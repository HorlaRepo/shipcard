import { useCallback, useState } from 'react';

/**
 * Reads one query parameter and lets the caller replace it without adding a
 * history entry, so the address bar always names what is on screen and the
 * Back button still leaves the page.
 *
 * @param {string} name The parameter name, e.g. "u".
 * @returns {[string | null, (next: string | null) => void]}
 *   The current value, and a setter; pass null to remove the parameter.
 */
export function useUrlParam(name) {
  const [value, setValue] = useState(() => new URLSearchParams(window.location.search).get(name));

  const update = useCallback(
    /** @param {string | null} next */
    (next) => {
      const url = new URL(window.location.href);
      if (next === null) {
        url.searchParams.delete(name);
      } else {
        url.searchParams.set(name, next);
      }
      window.history.replaceState(window.history.state, '', url);
      setValue(next);
    },
    [name],
  );

  return [value, update];
}
