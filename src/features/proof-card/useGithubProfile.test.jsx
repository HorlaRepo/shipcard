import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import {
  githubFailure,
  githubHanging,
  githubRateLimited,
  githubSuccess,
  githubUnreachable,
} from '../../../tests/msw/github.js';
import { server } from '../../../tests/msw/server.js';
import { DEFAULT_TIMEOUT_MS } from '../../lib/http.js';
import { CACHE_TTL_MS, lookupReducer, useGithubProfile } from './useGithubProfile.js';

afterEach(() => {
  vi.useRealTimers();
});

describe('lookupReducer', () => {
  /** @type {import('./useGithubProfile.js').LookupState} */
  const idle = { status: 'idle', quota: null };
  const profile = /** @type {import('./mapProfile.js').ProfileViewModel} */ ({ login: 'a' });

  test('ignores RESOLVE and REJECT unless a lookup is loading', () => {
    expect(lookupReducer(idle, { type: 'RESOLVE', profile })).toBe(idle);
  });

  test('RESET returns to idle and keeps the last known quota', () => {
    const quota = { remaining: 3, resetAt: null };

    expect(
      lookupReducer({ status: 'success', username: 'a', profile, quota }, { type: 'RESET' }),
    ).toEqual({ status: 'idle', quota });
  });
});

test('goes from idle to loading to success', async () => {
  server.use(...githubSuccess().handlers);
  const { result } = renderHook(() => useGithubProfile());
  expect(result.current.state).toEqual({ status: 'idle', quota: null });

  act(() => result.current.submit('torvalds'));
  expect(result.current.state).toMatchObject({ status: 'loading', username: 'torvalds' });

  await waitFor(() => expect(result.current.state.status).toBe('success'));
  expect(result.current.state).toMatchObject({
    username: 'torvalds',
    profile: { login: 'torvalds', name: 'Linus Torvalds' },
    quota: { remaining: 57 },
  });
});

describe('goes to error', () => {
  test.each([
    ['not-found', () => githubFailure(404)],
    ['rate-limit', () => githubRateLimited()],
    ['network', () => githubUnreachable()],
    ['upstream', () => githubFailure(500)],
  ])('with kind "%s"', async (kind, createHandlers) => {
    server.use(...createHandlers());
    const { result } = renderHook(() => useGithubProfile());

    act(() => result.current.submit('torvalds'));

    await waitFor(() => expect(result.current.state.status).toBe('error'));
    expect(result.current.state).toMatchObject({ username: 'torvalds', error: { kind } });
  });

  test('with kind "timeout"', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    server.use(...githubHanging());
    const { result } = renderHook(() => useGithubProfile());

    act(() => result.current.submit('torvalds'));
    await act(() => vi.advanceTimersByTimeAsync(DEFAULT_TIMEOUT_MS));

    expect(result.current.state).toMatchObject({ status: 'error', error: { kind: 'timeout' } });
  });
});

test('a new submit aborts the lookup in flight and only the new one resolves', async () => {
  server.use(...githubHanging());
  const { result } = renderHook(() => useGithubProfile());
  act(() => result.current.submit('first'));

  const github = githubSuccess();
  server.use(...github.handlers);
  act(() => result.current.submit('torvalds'));

  await waitFor(() => expect(result.current.state.status).toBe('success'));
  expect(result.current.state).toMatchObject({ username: 'torvalds' });
  expect(github.requests.every((request) => request.url.includes('/users/torvalds'))).toBe(true);
});

test('an aborted lookup is never reported as an error', async () => {
  server.use(...githubHanging());
  const { result } = renderHook(() => useGithubProfile());

  act(() => result.current.submit('torvalds'));
  act(() => result.current.reset());

  // Give a rejected promise the chance to dispatch, were it going to.
  await act(() => Promise.resolve());
  expect(result.current.state).toEqual({ status: 'idle', quota: null });
});

test('unmounting aborts the lookup in flight', async () => {
  /** @type {AbortSignal | undefined} */
  let signal;
  const fetchSpy = vi.spyOn(globalThis, 'fetch');
  server.use(...githubHanging());
  const { result, unmount } = renderHook(() => useGithubProfile());

  act(() => result.current.submit('torvalds'));
  await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
  signal = fetchSpy.mock.calls[0]?.[1]?.signal ?? undefined;
  unmount();

  expect(signal?.aborted).toBe(true);
});

test('a cache hit resolves without touching the network', async () => {
  const github = githubSuccess();
  server.use(...github.handlers);
  const { result } = renderHook(() => useGithubProfile());
  act(() => result.current.submit('torvalds'));
  await waitFor(() => expect(result.current.state.status).toBe('success'));
  expect(github.requests).toHaveLength(2);

  // Different capitalisation is the same account, so it is the same entry.
  act(() => result.current.submit('Torvalds'));

  expect(result.current.state).toMatchObject({ status: 'success', profile: { login: 'torvalds' } });
  expect(github.requests).toHaveLength(2);
});

test('a cached profile is fetched again once it is older than the time to live', async () => {
  const start = Date.parse('2026-11-20T12:00:00Z');
  const clock = vi.spyOn(Date, 'now').mockReturnValue(start);
  const github = githubSuccess();
  server.use(...github.handlers);
  const { result } = renderHook(() => useGithubProfile());
  act(() => result.current.submit('torvalds'));
  await waitFor(() => expect(result.current.state.status).toBe('success'));

  clock.mockReturnValue(start + CACHE_TTL_MS);
  act(() => result.current.submit('torvalds'));

  await waitFor(() => expect(github.requests).toHaveLength(4));
});

test('looks up the initial username once on mount', async () => {
  const github = githubSuccess();
  server.use(...github.handlers);

  const { result } = renderHook(() => useGithubProfile({ initialUsername: 'torvalds' }));

  await waitFor(() => expect(result.current.state.status).toBe('success'));
  expect(github.requests).toHaveLength(2);
});

test('opens a saved snapshot through the same mapper, without the network', async () => {
  const { result } = renderHook(() => useGithubProfile());

  act(() => result.current.openSnapshot('torvalds'));

  await waitFor(() => expect(result.current.state.status).toBe('success'));
  expect(result.current.state).toMatchObject({
    profile: {
      login: 'torvalds',
      snapshotDateLabel: expect.stringMatching(/^\d{1,2} \w{3} \d{4}$/),
    },
  });
});
