import { useCallback, useSyncExternalStore } from 'react';

/**
 * Subscribes to a CSS media query.
 *
 * @param {string} query A media query string, e.g. "(min-width: 60rem)".
 * @returns {boolean} Whether the query currently matches.
 */
export function useMediaQuery(query) {
  const subscribe = useCallback(
    /** @param {() => void} onChange */
    (onChange) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener('change', onChange);
      return () => mediaQueryList.removeEventListener('change', onChange);
    },
    [query],
  );

  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches);
}
