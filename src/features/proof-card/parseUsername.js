/** GitHub's own rule: letters and digits, single hyphens inside, at most 39 characters. */
const USERNAME_PATTERN = /^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$/;

/** A pasted profile link, with or without the scheme and "www.". */
const PROFILE_URL_PATTERN = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/?#\s]+)/i;

/**
 * @typedef {{ username: string, problem: null } | { username: null, problem: 'empty' | 'invalid' }} ParsedUsername
 */

/**
 * Turns what a visitor typed into a GitHub username, or says why it cannot be
 * one. Accepts a bare name, an @handle or a pasted github.com profile link.
 * Runs before any request, so invalid input never reaches the network.
 *
 * @param {string} input
 * @returns {ParsedUsername}
 */
export function parseUsername(input) {
  const trimmed = input.trim();
  if (trimmed === '') {
    return { username: null, problem: 'empty' };
  }

  const fromUrl = PROFILE_URL_PATTERN.exec(trimmed)?.[1];
  const candidate = (fromUrl ?? trimmed).replace(/^@/, '');

  return USERNAME_PATTERN.test(candidate)
    ? { username: candidate, problem: null }
    : { username: null, problem: 'invalid' };
}
