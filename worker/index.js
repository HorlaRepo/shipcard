/**
 * The page's backend: one Cloudflare Worker (ADR 0012, ADR 0013).
 *
 * Static assets are served by Cloudflare without invoking this code; it runs
 * only for /api/*, and its one endpoint accepts a waitlist sign-up.
 */

import { isEmail } from '../src/lib/email.js';

const WAITLIST_PATH = '/api/waitlist';
/** A sign-up is a few dozen bytes; anything much larger is not one. */
const MAX_BODY_BYTES = 1024;

/**
 * The parts of the Worker environment this code uses (see wrangler.jsonc).
 *
 * @typedef {object} Env
 * @property {{ put(key: string, value: string): Promise<void> }} WAITLIST KV namespace of sign-ups.
 */

/**
 * @param {number} status
 * @param {Record<string, unknown>} body
 * @param {Record<string, string>} [headers]
 * @returns {Response}
 */
function json(status, body, headers = {}) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', ...headers },
  });
}

/**
 * Reads a small JSON object from the request, or returns null if the body is
 * too large, not JSON or not an object.
 *
 * @param {Request} request
 * @returns {Promise<Record<string, unknown> | null>}
 */
async function readBody(request) {
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    return null;
  }
  try {
    const body = JSON.parse(text);
    return typeof body === 'object' && body !== null && !Array.isArray(body) ? body : null;
  } catch {
    return null;
  }
}

/**
 * POST /api/waitlist: stores an email address.
 *
 * The address is the key, lowercased, so signing up twice leaves one entry.
 * `website` is a honeypot: the form hides it from people, so a value in it
 * means a bot filled the form in. Bots are told it worked and nothing is kept.
 *
 * @param {Request} request
 * @param {Env} env
 * @returns {Promise<Response>}
 */
async function handleWaitlist(request, env) {
  if (request.method !== 'POST') {
    return json(405, { error: 'method_not_allowed' }, { Allow: 'POST' });
  }
  // Browsers send Origin on every cross-site POST; only this site's form may sign up.
  const origin = request.headers.get('Origin');
  if (origin !== null && origin !== new URL(request.url).origin) {
    return json(403, { error: 'forbidden' });
  }
  if (!request.headers.get('Content-Type')?.includes('application/json')) {
    return json(415, { error: 'unsupported_media_type' });
  }

  const body = await readBody(request);
  if (!body) {
    return json(400, { error: 'invalid_body' });
  }
  if (body.website) {
    return json(201, { ok: true });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : null;
  if (!isEmail(email)) {
    return json(400, { error: 'invalid_email' });
  }

  await env.WAITLIST.put(email, JSON.stringify({ joinedAt: new Date().toISOString() }));
  return json(201, { ok: true });
}

export default {
  /**
   * @param {Request} request
   * @param {Env} env
   * @returns {Promise<Response>}
   */
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname !== WAITLIST_PATH) {
      return json(404, { error: 'not_found' });
    }

    try {
      return await handleWaitlist(request, env);
    } catch {
      // Storage failed. The detail is in the Worker's logs (observability is
      // on); the visitor only needs to know to try again.
      return json(500, { error: 'server_error' });
    }
  },
};
