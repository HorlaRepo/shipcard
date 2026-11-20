import {
  getJson,
  HttpBodyError,
  HttpNetworkError,
  HttpStatusError,
  HttpTimeoutError,
} from '../../lib/http.js';
import {
  NetworkError,
  NotFoundError,
  RateLimitError,
  TimeoutError,
  UpstreamError,
} from './errors.js';

const API_ROOT = 'https://api.github.com';
/** Pinned so a new default version cannot change the response shape unannounced. */
const API_VERSION = '2026-03-10';
const REQUEST_HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': API_VERSION,
};
/** One page of repositories; the most recently pushed come first (ADR 0006). */
const REPOS_QUERY = 'per_page=100&sort=pushed&type=owner';

const STATUS_NOT_FOUND = 404;
const STATUS_FORBIDDEN = 403;
const STATUS_TOO_MANY_REQUESTS = 429;
const MS_PER_SECOND = 1000;

/**
 * The fields of GitHub's user object that this page reads.
 *
 * @typedef {object} GithubUser
 * @property {string} login
 * @property {string | null} [name]
 * @property {string | null} [avatar_url]
 * @property {string | null} [bio]
 * @property {number} public_repos
 * @property {string} created_at
 */

/**
 * The fields of GitHub's repository object that this page reads.
 *
 * @typedef {object} GithubRepo
 * @property {string} name
 * @property {string | null} [html_url]
 * @property {number} [stargazers_count]
 * @property {string | null} [language]
 * @property {boolean} [fork]
 * @property {boolean} [archived]
 * @property {string | null} [pushed_at]
 */

/**
 * What is left of this network's hourly allowance.
 *
 * @typedef {object} Quota
 * @property {number} remaining Requests left; a lookup costs two.
 * @property {Date | null} resetAt When the allowance refills.
 */

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isRecord(value) {
  return typeof value === 'object' && value !== null;
}

/**
 * @param {unknown} data
 * @returns {data is GithubUser}
 */
function isGithubUser(data) {
  return (
    isRecord(data) &&
    typeof data.login === 'string' &&
    typeof data.created_at === 'string' &&
    typeof data.public_repos === 'number'
  );
}

/**
 * @param {unknown} data
 * @returns {data is GithubRepo[]}
 */
function isGithubRepoList(data) {
  return (
    Array.isArray(data) && data.every((repo) => isRecord(repo) && typeof repo.name === 'string')
  );
}

/**
 * @param {Headers} headers
 * @returns {Date | null}
 */
function readResetTime(headers) {
  const resetSeconds = Number(headers.get('x-ratelimit-reset'));
  return Number.isFinite(resetSeconds) && resetSeconds > 0
    ? new Date(resetSeconds * MS_PER_SECOND)
    : null;
}

/**
 * @param {Headers[]} headersList One per response; the lowest remaining count wins.
 * @returns {Quota | null} Null when GitHub sent no rate-limit headers.
 */
function readQuota(headersList) {
  const counts = headersList
    .map((headers) => headers.get('x-ratelimit-remaining'))
    .filter((value) => value !== null)
    .map(Number)
    .filter(Number.isFinite);
  const [firstHeaders] = headersList;

  return counts.length > 0 && firstHeaders
    ? { remaining: Math.min(...counts), resetAt: readResetTime(firstHeaders) }
    : null;
}

/**
 * Maps a transport failure onto the error the visitor should see.
 *
 * @param {unknown} error
 * @param {string} username
 * @returns {unknown} A LookupError, or the original error when it is a cancellation.
 */
function toLookupError(error, username) {
  if (error instanceof HttpStatusError) {
    if (error.status === STATUS_NOT_FOUND) {
      return new NotFoundError(username);
    }
    if (error.status === STATUS_FORBIDDEN || error.status === STATUS_TOO_MANY_REQUESTS) {
      // "remaining: 0" marks the hourly limit, which has an exact reset time.
      // Without it this is a secondary limit, and GitHub gives no time.
      const isPrimaryLimit = error.headers.get('x-ratelimit-remaining') === '0';
      return new RateLimitError(isPrimaryLimit ? readResetTime(error.headers) : null);
    }
    return new UpstreamError(error);
  }
  if (error instanceof HttpTimeoutError) {
    return new TimeoutError(error.timeoutMs);
  }
  if (error instanceof HttpNetworkError) {
    return new NetworkError(error);
  }
  if (error instanceof HttpBodyError) {
    return new UpstreamError(error);
  }
  return error;
}

/**
 * Fetches a user and their repositories from GitHub's public REST API, in
 * parallel and without credentials.
 *
 * @param {string} username A valid GitHub username (see parseUsername).
 * @param {object} [options]
 * @param {AbortSignal} [options.signal] Cancels both requests.
 * @returns {Promise<{ user: GithubUser, repos: GithubRepo[], quota: Quota | null }>}
 * @throws {import('./errors.js').LookupError} For every failure except cancellation.
 * @throws {DOMException} An AbortError when `signal` aborts.
 */
export async function getProfile(username, { signal } = {}) {
  const userUrl = `${API_ROOT}/users/${encodeURIComponent(username)}`;
  // If one request fails, the other's answer is useless: cancel it.
  const siblings = new AbortController();
  const requestSignal = signal ? AbortSignal.any([signal, siblings.signal]) : siblings.signal;
  const options = { signal: requestSignal, headers: REQUEST_HEADERS };

  try {
    const [userResponse, reposResponse] = await Promise.all([
      getJson(userUrl, options),
      getJson(`${userUrl}/repos?${REPOS_QUERY}`, options),
    ]);

    if (!isGithubUser(userResponse.data) || !isGithubRepoList(reposResponse.data)) {
      throw new UpstreamError(new TypeError('GitHub response did not have the expected shape'));
    }

    return {
      user: userResponse.data,
      repos: reposResponse.data,
      quota: readQuota([userResponse.headers, reposResponse.headers]),
    };
  } catch (error) {
    siblings.abort();
    throw toLookupError(error, username);
  }
}
