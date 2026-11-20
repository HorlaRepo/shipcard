import { delay, http, HttpResponse } from 'msw';

import reposFixture from '../fixtures/githubRepos.json';
import userFixture from '../fixtures/githubUser.json';

const USER_URL = 'https://api.github.com/users/:username';
const REPOS_URL = 'https://api.github.com/users/:username/repos';

/** Epoch seconds of the reset time used by rate-limit responses: 2026-11-20T14:32:00Z. */
export const RESET_EPOCH_SECONDS = 1795185120;

const QUOTA_HEADERS = {
  'x-ratelimit-remaining': '57',
  'x-ratelimit-reset': String(RESET_EPOCH_SECONDS),
};

/**
 * Handlers for a successful lookup. `requests` records the URL of every
 * request received, so a test can assert how many were made, and for whom.
 *
 * @param {object} [options]
 * @param {unknown} [options.user]
 * @param {unknown} [options.repos]
 * @param {Record<string, string>} [options.headers]
 */
export function githubSuccess({
  user = userFixture,
  repos = reposFixture,
  headers = QUOTA_HEADERS,
} = {}) {
  /** @type {Request[]} */
  const requests = [];
  return {
    requests,
    handlers: [
      http.get(USER_URL, ({ request }) => {
        requests.push(request);
        return HttpResponse.json(/** @type {any} */ (user), { headers });
      }),
      http.get(REPOS_URL, ({ request }) => {
        requests.push(request);
        return HttpResponse.json(/** @type {any} */ (repos), { headers });
      }),
    ],
  };
}

/**
 * Both endpoints answer with the same failure status.
 *
 * @param {number} status
 * @param {Record<string, string>} [headers]
 */
export function githubFailure(status, headers = {}) {
  const respond = () => HttpResponse.json({ message: 'failed' }, { status, headers });
  return [http.get(USER_URL, respond), http.get(REPOS_URL, respond)];
}

/** GitHub's hourly limit is used up; the reset time is RESET_EPOCH_SECONDS. */
export function githubRateLimited() {
  return githubFailure(403, {
    'x-ratelimit-remaining': '0',
    'x-ratelimit-reset': String(RESET_EPOCH_SECONDS),
  });
}

/** The connection fails before any response. */
export function githubUnreachable() {
  const respond = () => HttpResponse.error();
  return [http.get(USER_URL, respond), http.get(REPOS_URL, respond)];
}

/** GitHub never answers, so the request runs until it is aborted or times out. */
export function githubHanging() {
  const respond = async () => {
    await delay('infinite');
    return HttpResponse.json({});
  };
  return [http.get(USER_URL, respond), http.get(REPOS_URL, respond)];
}
