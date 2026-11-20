/**
 * A small time-limited cache: an in-memory map backed by sessionStorage, so a
 * result survives a reload of the tab but not the tab itself.
 *
 * Storage is best-effort. Private browsing modes and full quotas make
 * sessionStorage throw, and a cache that cannot persist must still work in
 * memory, so every storage call is guarded and a failure only costs the
 * persistence.
 */

/**
 * @template T
 * @typedef {object} CacheEntry
 * @property {T} value
 * @property {number} expiresAt Epoch milliseconds.
 */

/**
 * @template T
 * @param {object} options
 * @param {string} options.namespace Prefix for storage keys, e.g. "shipcard:profile:".
 * @param {number} options.ttlMs How long an entry stays fresh.
 * @param {() => number} [options.now] Clock, injectable for tests.
 * @returns {{ get: (key: string) => T | undefined, set: (key: string, value: T) => void }}
 */
export function createCache({ namespace, ttlMs, now = Date.now }) {
  /** @type {Map<string, CacheEntry<T>>} */
  const memory = new Map();

  /**
   * @param {string} key
   * @returns {CacheEntry<T> | undefined}
   */
  function readStorage(key) {
    try {
      const raw = window.sessionStorage.getItem(namespace + key);
      return raw === null ? undefined : JSON.parse(raw);
    } catch {
      return undefined;
    }
  }

  /**
   * @param {string} key
   * @param {CacheEntry<T>} entry
   */
  function writeStorage(key, entry) {
    try {
      window.sessionStorage.setItem(namespace + key, JSON.stringify(entry));
    } catch {
      // Persistence is optional; the in-memory entry is already set.
    }
  }

  /** @param {string} key */
  function remove(key) {
    memory.delete(key);
    try {
      window.sessionStorage.removeItem(namespace + key);
    } catch {
      // Nothing to remove if storage is unavailable.
    }
  }

  return {
    get(key) {
      const entry = memory.get(key) ?? readStorage(key);
      if (!entry || typeof entry.expiresAt !== 'number') {
        return undefined;
      }
      if (entry.expiresAt <= now()) {
        remove(key);
        return undefined;
      }
      memory.set(key, entry);
      return entry.value;
    },

    set(key, value) {
      const entry = { value, expiresAt: now() + ttlMs };
      memory.set(key, entry);
      writeStorage(key, entry);
    },
  };
}
