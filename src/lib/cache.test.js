import { expect, test, vi } from 'vitest';

import { createCache } from './cache.js';

const TTL_MS = 1000;

/** A cache with a clock the test controls. */
function createTestCache() {
  const clock = { time: 0 };
  const cache = createCache({ namespace: 'test:', ttlMs: TTL_MS, now: () => clock.time });
  return { cache, clock };
}

test('returns what was stored', () => {
  const { cache } = createTestCache();

  cache.set('key', { value: 1 });

  expect(cache.get('key')).toEqual({ value: 1 });
});

test('returns undefined for a key that was never stored', () => {
  expect(createTestCache().cache.get('missing')).toBeUndefined();
});

test('an entry expires after its time to live', () => {
  const { cache, clock } = createTestCache();
  cache.set('key', 'value');

  clock.time = TTL_MS - 1;
  expect(cache.get('key')).toBe('value');

  clock.time = TTL_MS;
  expect(cache.get('key')).toBeUndefined();
  expect(window.sessionStorage.getItem('test:key')).toBeNull();
});

test('an entry survives into a new cache through sessionStorage', () => {
  createTestCache().cache.set('key', 'value');

  expect(createTestCache().cache.get('key')).toBe('value');
});

test('keeps working in memory when sessionStorage throws', () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('Quota exceeded', 'QuotaExceededError');
  });
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new DOMException('Access denied', 'SecurityError');
  });
  const { cache } = createTestCache();

  cache.set('key', 'value');

  expect(cache.get('key')).toBe('value');
});

test('ignores a stored entry that is not valid JSON', () => {
  window.sessionStorage.setItem('test:key', '{not json');

  expect(createTestCache().cache.get('key')).toBeUndefined();
});
