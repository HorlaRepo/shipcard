import { HttpNetworkError, HttpStatusError, HttpTimeoutError, postJson } from '../../lib/http.js';

/** Same origin: the Worker that serves the page also handles this path (ADR 0013). */
const WAITLIST_ENDPOINT = '/api/waitlist';
const STATUS_BAD_REQUEST = 400;

/**
 * Why a sign-up failed, as the visitor experiences it.
 *
 * - `rejected`: the server refused the address.
 * - `network`: the request did not get through, or timed out.
 * - `server`: the endpoint failed.
 */
export class WaitlistError extends Error {
  /**
   * @param {'rejected' | 'network' | 'server'} kind
   * @param {unknown} cause
   */
  constructor(kind, cause) {
    super(`Waitlist sign-up failed: ${kind}`, { cause });
    this.name = 'WaitlistError';
    this.kind = kind;
  }
}

/**
 * Adds an email address to the waitlist.
 *
 * This function is the only code that knows where sign-ups go, so changing
 * the provider is a change to this file and its tests.
 *
 * @param {object} signUp
 * @param {string} signUp.email
 * @param {string} signUp.website The honeypot field; empty for a real visitor.
 * @param {object} [options]
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<void>}
 * @throws {WaitlistError}
 * @throws {DOMException} An AbortError when `signal` aborts.
 */
export async function submitWaitlist({ email, website }, { signal } = {}) {
  try {
    await postJson(WAITLIST_ENDPOINT, { email, website }, { signal });
  } catch (error) {
    if (error instanceof HttpStatusError) {
      throw new WaitlistError(error.status === STATUS_BAD_REQUEST ? 'rejected' : 'server', error);
    }
    if (error instanceof HttpNetworkError || error instanceof HttpTimeoutError) {
      throw new WaitlistError('network', error);
    }
    throw error;
  }
}
