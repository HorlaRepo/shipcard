import { formatCount, formatRelativeTime } from '../../lib/format.js';

const TOP_LANGUAGE_COUNT = 5;
const TOP_REPO_COUNT = 3;
const PERCENT = 100;

/** Rendered avatar size in CSS pixels; twice that is requested for sharp screens. */
export const AVATAR_SIZE = 64;
const AVATAR_PIXEL_DENSITY = 2;
const AVATAR_HOST = 'avatars.githubusercontent.com';
const GITHUB_ORIGIN = 'https://github.com';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAYS_PER_YEAR = 365.25;
const DAYS_PER_MONTH = DAYS_PER_YEAR / 12;

/**
 * @typedef {object} LanguageShare
 * @property {string} name
 * @property {number} count Repositories whose primary language this is.
 * @property {number} percent Share of repositories that have a language, rounded.
 */

/**
 * @typedef {object} TopRepo
 * @property {string} name
 * @property {string} url Always on github.com.
 * @property {string} starLabel e.g. "256K".
 */

/**
 * Everything the card renders, already formatted. Plain data, so it can be
 * cached as JSON.
 *
 * @typedef {object} ProfileViewModel
 * @property {string} login
 * @property {string} name The display name, or the login when none is set.
 * @property {string | null} bio
 * @property {string | null} avatarUrl Sized for the card, or null if GitHub sent no usable URL.
 * @property {string} profileUrl
 * @property {string} publicRepoLabel
 * @property {string} starLabel
 * @property {{ value: number, unit: 'year' | 'month' | 'day' }} accountAge
 * @property {LanguageShare[]} languages Top five, largest first.
 * @property {TopRepo[]} topRepos Three most starred.
 * @property {string | null} lastShippedLabel e.g. "3 days ago"; null when nothing was ever pushed.
 * @property {boolean} isPartial True when the account has more repositories than were read.
 * @property {string | null} snapshotDateLabel Set only for saved example cards.
 */

/**
 * @param {string | null | undefined} avatarUrl
 * @returns {string | null} The URL with a size parameter, if it is a GitHub avatar.
 */
function sizeAvatar(avatarUrl) {
  if (!avatarUrl || !URL.canParse(avatarUrl)) {
    return null;
  }
  const url = new URL(avatarUrl);
  if (url.protocol !== 'https:' || url.hostname !== AVATAR_HOST) {
    return null;
  }
  url.searchParams.set('s', String(AVATAR_SIZE * AVATAR_PIXEL_DENSITY));
  return url.href;
}

/**
 * @param {Date} createdAt
 * @param {Date} now
 * @returns {ProfileViewModel['accountAge']} In the largest unit that is at least 1.
 */
function measureAccountAge(createdAt, now) {
  const days = Math.max(0, Math.floor((now.getTime() - createdAt.getTime()) / MS_PER_DAY));
  const years = Math.floor(days / DAYS_PER_YEAR);
  if (years >= 1) {
    return { value: years, unit: 'year' };
  }
  const months = Math.floor(days / DAYS_PER_MONTH);
  return months >= 1 ? { value: months, unit: 'month' } : { value: days, unit: 'day' };
}

/**
 * @param {import('./githubClient.js').GithubRepo[]} repos
 * @returns {LanguageShare[]}
 */
function rankLanguages(repos) {
  /** @type {Map<string, number>} */
  const counts = new Map();
  for (const { language } of repos) {
    if (language) {
      counts.set(language, (counts.get(language) ?? 0) + 1);
    }
  }
  const total = [...counts.values()].reduce((sum, count) => sum + count, 0);

  return [...counts]
    .toSorted(([nameA, countA], [nameB, countB]) => countB - countA || nameA.localeCompare(nameB))
    .slice(0, TOP_LANGUAGE_COUNT)
    .map(([name, count]) => ({ name, count, percent: Math.round((count / total) * PERCENT) }));
}

/**
 * @param {import('./githubClient.js').GithubRepo[]} repos
 * @returns {Date | null} The most recent push across the repositories.
 */
function findLastPush(repos) {
  const times = repos
    .map((repo) => (repo.pushed_at ? Date.parse(repo.pushed_at) : Number.NaN))
    .filter(Number.isFinite);
  return times.length > 0 ? new Date(Math.max(...times)) : null;
}

/**
 * Maps GitHub's user and repository objects to the card's view model.
 *
 * Forks and archived repositories are left out of the stars, the languages and
 * the top repositories: a fork's stars belong to its parent, and an archived
 * project is no longer maintained. The last push is taken from every
 * repository, because contributing to a fork is still shipping.
 *
 * Pure: the same inputs always give the same output.
 *
 * @param {import('./githubClient.js').GithubUser} user
 * @param {import('./githubClient.js').GithubRepo[]} repos
 * @param {Date} now The moment "ago" is measured from; injected so tests are deterministic.
 * @returns {ProfileViewModel}
 */
export function mapProfile(user, repos, now) {
  const ownRepos = repos.filter((repo) => !repo.fork && !repo.archived);
  const starsOf = (/** @type {import('./githubClient.js').GithubRepo} */ repo) =>
    repo.stargazers_count ?? 0;
  const profileUrl = `${GITHUB_ORIGIN}/${encodeURIComponent(user.login)}`;
  const lastPush = findLastPush(repos);

  return {
    login: user.login,
    name: user.name?.trim() || user.login,
    bio: user.bio?.trim() || null,
    avatarUrl: sizeAvatar(user.avatar_url),
    profileUrl,
    publicRepoLabel: formatCount(user.public_repos),
    starLabel: formatCount(ownRepos.reduce((sum, repo) => sum + starsOf(repo), 0)),
    accountAge: measureAccountAge(new Date(user.created_at), now),
    languages: rankLanguages(ownRepos),
    topRepos: ownRepos
      .toSorted((a, b) => starsOf(b) - starsOf(a) || a.name.localeCompare(b.name))
      .slice(0, TOP_REPO_COUNT)
      .map((repo) => ({
        name: repo.name,
        // Built from the login and name rather than taken from the response,
        // so a link on the card can only ever point at github.com.
        url: `${profileUrl}/${encodeURIComponent(repo.name)}`,
        starLabel: formatCount(starsOf(repo)),
      })),
    lastShippedLabel: lastPush ? formatRelativeTime(lastPush, now) : null,
    isPartial: user.public_repos > repos.length,
    snapshotDateLabel: null,
  };
}
