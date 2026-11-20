import { describe, expect, test, vi } from 'vitest';

import worker from './index.js';

const ORIGIN = 'https://shipcard.example';

/** An in-memory stand-in for the KV namespace. */
function createEnv() {
  /** @type {Map<string, string>} */
  const stored = new Map();
  return {
    stored,
    env: {
      WAITLIST: {
        /** @param {string} key @param {string} value */
        put: async (key, value) => void stored.set(key, value),
      },
    },
  };
}

/**
 * @param {unknown} body
 * @param {RequestInit} [init]
 */
function signUp(body, init = {}) {
  return new Request(`${ORIGIN}/api/waitlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: ORIGIN },
    body: typeof body === 'string' ? body : JSON.stringify(body),
    ...init,
  });
}

test('stores a valid address and answers 201', async () => {
  const { env, stored } = createEnv();

  const response = await worker.fetch(signUp({ email: 'ada@example.com' }), env);

  expect(response.status).toBe(201);
  expect(await response.json()).toEqual({ ok: true });
  expect(response.headers.get('Cache-Control')).toBe('no-store');
  expect(JSON.parse(stored.get('ada@example.com') ?? '')).toEqual({
    joinedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
  });
});

test('normalises the address, so signing up twice keeps one entry', async () => {
  const { env, stored } = createEnv();

  await worker.fetch(signUp({ email: '  Ada@Example.COM ' }), env);
  await worker.fetch(signUp({ email: 'ada@example.com' }), env);

  expect([...stored.keys()]).toEqual(['ada@example.com']);
});

describe('rejects with 400 and stores nothing', () => {
  test.each([
    ['a missing address', {}],
    ['an address without a domain', { email: 'ada@' }],
    ['an address with a space', { email: 'ada lovelace@example.com' }],
    ['an address that is not a string', { email: 42 }],
    ['an address longer than 254 characters', { email: `${'a'.repeat(250)}@example.com` }],
    ['a body that is not an object', ['ada@example.com']],
    ['a body that is not JSON', '{nope'],
    ['a body over the size limit', { email: 'ada@example.com', padding: 'x'.repeat(2000) }],
  ])('%s', async (_case, body) => {
    const { env, stored } = createEnv();

    const response = await worker.fetch(signUp(body), env);

    expect(response.status).toBe(400);
    expect(stored.size).toBe(0);
  });
});

test('a filled honeypot is told it worked, and nothing is stored', async () => {
  const { env, stored } = createEnv();

  const response = await worker.fetch(
    signUp({ email: 'bot@example.com', website: 'https://spam.example' }),
    env,
  );

  expect(response.status).toBe(201);
  expect(stored.size).toBe(0);
});

test('refuses a sign-up posted from another site', async () => {
  const { env, stored } = createEnv();
  const request = signUp(
    { email: 'ada@example.com' },
    { headers: { 'Content-Type': 'application/json', Origin: 'https://elsewhere.example' } },
  );

  const response = await worker.fetch(request, env);

  expect(response.status).toBe(403);
  expect(stored.size).toBe(0);
});

test('refuses a body that is not declared as JSON', async () => {
  const { env } = createEnv();
  const request = signUp('email=ada@example.com', {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: ORIGIN },
  });

  expect((await worker.fetch(request, env)).status).toBe(415);
});

test('answers 405 to methods other than POST and names the one allowed', async () => {
  const { env } = createEnv();

  const response = await worker.fetch(new Request(`${ORIGIN}/api/waitlist`), env);

  expect(response.status).toBe(405);
  expect(response.headers.get('Allow')).toBe('POST');
});

test('answers 404 for any other API path', async () => {
  const { env } = createEnv();

  const response = await worker.fetch(new Request(`${ORIGIN}/api/unknown`), env);

  expect(response.status).toBe(404);
});

test('answers 500 without leaking detail when storage fails', async () => {
  const env = {
    WAITLIST: { put: vi.fn().mockRejectedValue(new Error('KV unavailable: secret detail')) },
  };

  const response = await worker.fetch(signUp({ email: 'ada@example.com' }), env);

  expect(response.status).toBe(500);
  expect(await response.json()).toEqual({ error: 'server_error' });
});
