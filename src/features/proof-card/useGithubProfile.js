import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import { createCache } from '../../lib/cache.js';
import { logInDevelopment } from '../../lib/devLog.js';
import { isAbortError } from '../../lib/http.js';
import { LookupError, NetworkError, UpstreamError } from './errors.js';
import { loadSnapshot } from './examples/loadSnapshot.js';
import { getProfile } from './githubClient.js';
import { mapProfile } from './mapProfile.js';

/** How long a looked-up profile is reused before GitHub is asked again. */
export const CACHE_TTL_MS = 10 * 60 * 1000;
/** Versioned, so a change to the view model's shape cannot read stale entries. */
const CACHE_NAMESPACE = 'shipcard:profile:v1:';

/**
 * @typedef {import('./mapProfile.js').ProfileViewModel} ProfileViewModel
 * @typedef {import('./githubClient.js').Quota} Quota
 */

/**
 * The lookup as a state machine. One `status` field means the impossible
 * combinations (loading with an error, success without a profile) cannot be
 * represented. `quota` is the last allowance GitHub reported, in any state.
 *
 * @typedef {(
 *   | { status: 'idle' }
 *   | { status: 'loading', username: string }
 *   | { status: 'success', username: string, profile: ProfileViewModel }
 *   | { status: 'error', username: string, error: LookupError }
 * ) & { quota: Quota | null }} LookupState
 */

/**
 * @typedef {(
 *   | { type: 'SUBMIT', username: string }
 *   | { type: 'RESOLVE', profile: ProfileViewModel, quota?: Quota | null }
 *   | { type: 'REJECT', error: LookupError }
 *   | { type: 'RESET' }
 * )} LookupAction
 */

/** @type {LookupState} */
const INITIAL_STATE = { status: 'idle', quota: null };

/**
 * RESOLVE and REJECT only apply while loading: an answer that arrives after
 * the visitor has reset or resubmitted describes a request nobody is waiting for.
 *
 * @param {LookupState} state
 * @param {LookupAction} action
 * @returns {LookupState}
 */
export function lookupReducer(state, action) {
  switch (action.type) {
    case 'SUBMIT':
      return { status: 'loading', username: action.username, quota: state.quota };
    case 'RESOLVE':
      return state.status === 'loading'
        ? {
            status: 'success',
            username: state.username,
            profile: action.profile,
            quota: action.quota ?? state.quota,
          }
        : state;
    case 'REJECT':
      return state.status === 'loading'
        ? { status: 'error', username: state.username, error: action.error, quota: state.quota }
        : state;
    case 'RESET':
      return { status: 'idle', quota: state.quota };
    default:
      return state;
  }
}

/**
 * Looks up GitHub profiles for the proof card.
 *
 * A new lookup cancels the one in flight, unmounting cancels too, and a
 * cancellation is never reported as an error. Results are cached per tab for
 * ten minutes, so repeating a lookup costs none of the hourly allowance.
 *
 * @param {object} [options]
 * @param {string | null} [options.initialUsername] Looked up once on mount (the `?u=` deep link).
 * @returns {{
 *   state: LookupState,
 *   submit: (username: string) => void,
 *   openSnapshot: (username: import('./examples/loadSnapshot.js').ExampleUsername) => void,
 *   reset: () => void,
 * }}
 */
export function useGithubProfile({ initialUsername = null } = {}) {
  const [state, dispatch] = useReducer(lookupReducer, INITIAL_STATE);
  const [cache] = useState(
    () =>
      /** @type {ReturnType<typeof createCache<ProfileViewModel>>} */ (
        createCache({ namespace: CACHE_NAMESPACE, ttlMs: CACHE_TTL_MS })
      ),
  );
  const controllerRef = useRef(/** @type {AbortController | null} */ (null));

  /**
   * Starts a lookup: cancels the previous one and returns the signal that
   * tells this one whether it has been cancelled in turn.
   */
  const begin = useCallback(
    /** @param {string} username */
    (username) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      dispatch({ type: 'SUBMIT', username });
      return controller.signal;
    },
    [],
  );

  /** Reports a failure, unless the lookup was cancelled. */
  const fail = useCallback(
    /**
     * @param {unknown} error
     * @param {AbortSignal} signal
     */
    (error, signal) => {
      if (signal.aborted || isAbortError(error)) {
        return;
      }
      const lookupError = error instanceof LookupError ? error : new UpstreamError(error);
      if (lookupError.kind === 'upstream') {
        logInDevelopment('GitHub lookup failed unexpectedly', lookupError.cause);
      }
      dispatch({ type: 'REJECT', error: lookupError });
    },
    [],
  );

  const submit = useCallback(
    /** @param {string} username */
    (username) => {
      const signal = begin(username);
      const cacheKey = username.toLowerCase();
      const cached = cache.get(cacheKey);
      if (cached) {
        dispatch({ type: 'RESOLVE', profile: cached });
        return;
      }

      getProfile(username, { signal })
        .then(({ user, repos, quota }) => {
          if (signal.aborted) {
            return;
          }
          const profile = mapProfile(user, repos, new Date());
          cache.set(cacheKey, profile);
          dispatch({ type: 'RESOLVE', profile, quota });
        })
        .catch((error) => fail(error, signal));
    },
    [begin, cache, fail],
  );

  const openSnapshot = useCallback(
    /** @param {import('./examples/loadSnapshot.js').ExampleUsername} username */
    (username) => {
      const signal = begin(username);
      loadSnapshot(username)
        .then((profile) => {
          if (!signal.aborted) {
            dispatch({ type: 'RESOLVE', profile });
          }
        })
        // The snapshot is a lazily loaded chunk, so this is a network failure.
        .catch((error) => fail(new NetworkError(error), signal));
    },
    [begin, fail],
  );

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    dispatch({ type: 'RESET' });
  }, []);

  // The deep link is read once: later changes to the URL come from this page.
  const initialUsernameRef = useRef(initialUsername);
  useEffect(() => {
    if (initialUsernameRef.current) {
      submit(initialUsernameRef.current);
    }
    return () => controllerRef.current?.abort();
  }, [submit]);

  return { state, submit, openSnapshot, reset };
}
