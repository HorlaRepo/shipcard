import { formatDate } from '../../../lib/format.js';
import { mapProfile } from '../mapProfile.js';

/**
 * Saved responses from GitHub's API for a few well-known public accounts,
 * offered when the visitor's network has used up its hourly allowance.
 *
 * Each one is a separate chunk, fetched only if it is opened, so the snapshots
 * cost nothing on first load.
 */
const loaders = {
  torvalds: () => import('./torvalds.json'),
  sindresorhus: () => import('./sindresorhus.json'),
  gaearon: () => import('./gaearon.json'),
};

/** @typedef {keyof typeof loaders} ExampleUsername */

export const EXAMPLE_USERNAMES = /** @type {ExampleUsername[]} */ (Object.keys(loaders));

/**
 * Loads a snapshot and maps it exactly as a live response is mapped, so the
 * fallback exercises the same code. "Ago" is measured from the capture time,
 * so the card reads as it did on the day it was saved.
 *
 * @param {ExampleUsername} username
 * @returns {Promise<import('../mapProfile.js').ProfileViewModel>}
 */
export async function loadSnapshot(username) {
  const { default: snapshot } = await loaders[username]();
  const capturedAt = new Date(snapshot.capturedAt);

  return {
    ...mapProfile(snapshot.user, snapshot.repos, capturedAt),
    snapshotDateLabel: formatDate(capturedAt),
  };
}
