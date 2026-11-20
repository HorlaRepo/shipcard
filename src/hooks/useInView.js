import { useEffect, useState } from 'react';

/**
 * Reports whether an element is in the viewport, using IntersectionObserver
 * (no scroll listener).
 *
 * Where IntersectionObserver is missing the element is reported as in view,
 * so anything waiting on this hook to appear is never left hidden.
 *
 * @param {import('react').RefObject<Element | null>} ref
 * @param {object} [options]
 * @param {boolean} [options.once] Stay true after the first time in view; used for one-time reveals.
 * @param {string} [options.rootMargin] Grows or shrinks the viewport's edges, e.g. "0px 0px -10% 0px".
 * @returns {boolean}
 */
export function useInView(ref, { once = false, rootMargin } = {}) {
  const isSupported = typeof IntersectionObserver !== 'undefined';
  const [isInView, setIsInView] = useState(!isSupported);

  useEffect(() => {
    const element = ref.current;
    if (!isSupported || !element) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting && once) {
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, isSupported, once, rootMargin]);

  return isInView;
}
