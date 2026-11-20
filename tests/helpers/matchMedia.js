/**
 * jsdom has no layout, so it does not implement window.matchMedia. This is a
 * controllable stand-in: tests state which queries match, and can change the
 * answer later to simulate a resize or a system theme switch.
 */

/** @type {Map<string, boolean>} */
const matches = new Map();
/** @type {Map<string, Set<() => void>>} */
const listeners = new Map();

/**
 * @param {string} query
 * @returns {MediaQueryList}
 */
function matchMedia(query) {
  const queryListeners = listeners.get(query) ?? new Set();
  listeners.set(query, queryListeners);

  // Only the members the app uses; the cast says so to the type checker.
  const mediaQueryList = {
    media: query,
    get matches() {
      return matches.get(query) ?? false;
    },
    /** @param {string} _type @param {() => void} listener */
    addEventListener: (_type, listener) => queryListeners.add(listener),
    /** @param {string} _type @param {() => void} listener */
    removeEventListener: (_type, listener) => queryListeners.delete(listener),
  };
  return /** @type {MediaQueryList} */ (/** @type {unknown} */ (mediaQueryList));
}

/** Installs the stand-in on window. Called once from tests/setup.js. */
export function installMatchMedia() {
  window.matchMedia = matchMedia;
}

/**
 * Sets whether a media query matches and notifies its subscribers.
 *
 * @param {string} query
 * @param {boolean} isMatching
 */
export function setMediaQuery(query, isMatching) {
  matches.set(query, isMatching);
  listeners.get(query)?.forEach((listener) => listener());
}

/** Forgets every answer, so each test starts with nothing matching. */
export function resetMediaQueries() {
  matches.clear();
  listeners.clear();
}
