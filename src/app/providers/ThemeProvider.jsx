import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useMediaQuery } from '../../hooks/useMediaQuery.js';

/**
 * Where the visitor's explicit choice is kept. The inline script in
 * index.html reads the same key before first paint; change both together.
 */
export const THEME_STORAGE_KEY = 'shipcard:theme';
const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

/** @typedef {'light' | 'dark'} Theme */

/**
 * @typedef {object} ThemeContextValue
 * @property {Theme} theme The theme on screen.
 * @property {() => void} toggleTheme Switches theme and remembers the choice.
 */

const ThemeContext = createContext(/** @type {ThemeContextValue | null} */ (null));

/**
 * @returns {Theme | null} The visitor's saved choice, or null to follow the system.
 */
function readStoredTheme() {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    // Storage can be blocked; the system setting is a fine default.
    return null;
  }
}

/**
 * Provides the theme: the system setting by default, the visitor's choice
 * once they make one. The theme is applied as `data-theme` on <html>, where
 * tokens.css swaps token values, so no component ever branches on it.
 *
 * @param {{ children: import('react').ReactNode }} props
 */
export default function ThemeProvider({ children }) {
  const [override, setOverride] = useState(readStoredTheme);
  const systemPrefersDark = useMediaQuery(DARK_SCHEME_QUERY);
  /** @type {Theme} */
  const theme = override ?? (systemPrefersDark ? 'dark' : 'light');

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;

    // Browser chrome follows the page: read the ground colour the theme just set.
    const ground = getComputedStyle(root).getPropertyValue('--color-ground').trim();
    if (ground) {
      document
        .querySelectorAll('meta[name="theme-color"]')
        .forEach((meta) => meta.setAttribute('content', ground));
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    /** @type {Theme} */
    const next = theme === 'dark' ? 'light' : 'dark';
    setOverride(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // The choice still applies for this visit; it just will not be remembered.
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * @returns {ThemeContextValue}
 * @throws {Error} When used outside ThemeProvider.
 */
export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return value;
}
