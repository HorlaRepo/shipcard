import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, test, vi } from 'vitest';

import reposFixture from '../../../tests/fixtures/githubRepos.json';
import userFixture from '../../../tests/fixtures/githubUser.json';
import {
  githubFailure,
  githubHanging,
  githubSuccess,
  githubUnreachable,
  RESET_EPOCH_SECONDS,
} from '../../../tests/msw/github.js';
import { server } from '../../../tests/msw/server.js';
import { DEFAULT_TIMEOUT_MS, isAbortError } from '../../lib/http.js';
import {
  NetworkError,
  NotFoundError,
  RateLimitError,
  TimeoutError,
  UpstreamError,
} from './errors.js';
import { getProfile } from './githubClient.js';

const MS_PER_SECOND = 1000;

afterEach(() => {
  vi.useRealTimers();
});

describe('a successful lookup', () => {
  test('returns the user, the repositories and the remaining quota', async () => {
    server.use(...githubSuccess().handlers);

    const result = await getProfile('torvalds');

    expect(result.user).toEqual(userFixture);
    expect(result.repos).toEqual(reposFixture);
    expect(result.quota).toEqual({
      remaining: 57,
      resetAt: new Date(RESET_EPOCH_SECONDS * MS_PER_SECOND),
    });
  });

  test('makes exactly two requests, with the pinned API version and no credentials', async () => {
    const github = githubSuccess();
    server.use(...github.handlers);

    await getProfile('torvalds');

    expect(github.requests.map((request) => request.url)).toEqual(
      expect.arrayContaining([
        'https://api.github.com/users/torvalds',
        'https://api.github.com/users/torvalds/repos?per_page=100&sort=pushed&type=owner',
      ]),
    );
    expect(github.requests).toHaveLength(2);
    for (const request of github.requests) {
      expect(request.headers.get('accept')).toBe('application/vnd.github+json');
      expect(request.headers.get('x-github-api-version')).toBe('2026-03-10');
      expect(request.headers.has('authorization')).toBe(false);
    }
  });

  test('sends both requests in parallel', async () => {
    /** @type {(() => void)[]} */
    const releases = [];
    let started = 0;
    const hold = async () => {
      started += 1;
      await new Promise((resolve) => releases.push(() => resolve(undefined)));
    };
    server.use(
      http.get('https://api.github.com/users/:username', async () => {
        await hold();
        return HttpResponse.json(userFixture);
      }),
      http.get('https://api.github.com/users/:username/repos', async () => {
        await hold();
        return HttpResponse.json(reposFixture);
      }),
    );

    const pending = getProfile('torvalds');
    // Neither response has been released, yet both requests are already in flight.
    await vi.waitFor(() => expect(started).toBe(2));
    releases.forEach((release) => release());

    await expect(pending).resolves.toMatchObject({ user: { login: 'torvalds' } });
  });

  test('reports no quota when GitHub sends no rate-limit headers', async () => {
    server.use(...githubSuccess({ headers: {} }).handlers);

    await expect(getProfile('torvalds')).resolves.toMatchObject({ quota: null });
  });
});

describe('error mapping', () => {
  test('404 becomes NotFoundError carrying the username', async () => {
    server.use(...githubFailure(404));

    const error = await getProfile('nobody-here').catch((reason) => reason);

    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.username).toBe('nobody-here');
  });

  test.each([403, 429])(
    '%d with no requests remaining becomes RateLimitError with the reset time',
    async (status) => {
      server.use(
        ...githubFailure(status, {
          'x-ratelimit-remaining': '0',
          'x-ratelimit-reset': String(RESET_EPOCH_SECONDS),
        }),
      );

      const error = await getProfile('torvalds').catch((reason) => reason);

      expect(error).toBeInstanceOf(RateLimitError);
      expect(error.resetAt).toEqual(new Date(RESET_EPOCH_SECONDS * MS_PER_SECOND));
    },
  );

  test.each([403, 429])(
    '%d with requests remaining is a secondary limit: RateLimitError without a time',
    async (status) => {
      server.use(...githubFailure(status, { 'x-ratelimit-remaining': '41' }));

      const error = await getProfile('torvalds').catch((reason) => reason);

      expect(error).toBeInstanceOf(RateLimitError);
      expect(error.resetAt).toBeNull();
    },
  );

  test.each([500, 502, 503])('%d becomes UpstreamError', async (status) => {
    server.use(...githubFailure(status));

    await expect(getProfile('torvalds')).rejects.toBeInstanceOf(UpstreamError);
  });

  test('a body that is not JSON becomes UpstreamError', async () => {
    const notJson = () => HttpResponse.text('<html>gateway</html>');
    server.use(
      http.get('https://api.github.com/users/:username', notJson),
      http.get('https://api.github.com/users/:username/repos', notJson),
    );

    await expect(getProfile('torvalds')).rejects.toBeInstanceOf(UpstreamError);
  });

  test.each([
    ['a user without a login', { user: { id: 1 }, repos: [] }],
    ['repositories that are not a list', { user: userFixture, repos: { message: 'nope' } }],
    ['a repository without a name', { user: userFixture, repos: [{ id: 1 }] }],
  ])('%s becomes UpstreamError', async (_shape, response) => {
    server.use(...githubSuccess(response).handlers);

    await expect(getProfile('torvalds')).rejects.toBeInstanceOf(UpstreamError);
  });

  test('a failed connection becomes NetworkError', async () => {
    server.use(...githubUnreachable());

    await expect(getProfile('torvalds')).rejects.toBeInstanceOf(NetworkError);
  });

  test('no answer within the timeout becomes TimeoutError', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    server.use(...githubHanging());

    const pending = getProfile('torvalds').catch((reason) => reason);
    await vi.advanceTimersByTimeAsync(DEFAULT_TIMEOUT_MS);
    const error = await pending;

    expect(error).toBeInstanceOf(TimeoutError);
    expect(error.timeoutMs).toBe(DEFAULT_TIMEOUT_MS);
  });
});

test('cancelling rejects with an AbortError, which is not a lookup error', async () => {
  server.use(...githubHanging());
  const controller = new AbortController();

  const pending = getProfile('torvalds', { signal: controller.signal }).catch((reason) => reason);
  controller.abort();
  const error = await pending;

  expect(isAbortError(error)).toBe(true);
});

test('encodes the username in the request path', async () => {
  const github = githubSuccess();
  server.use(...github.handlers);

  // parseUsername never lets this through; the client must still be safe on its own.
  await getProfile('a/b?c');

  expect(github.requests.every((request) => request.url.includes('/users/a%2Fb%3Fc'))).toBe(true);
});
