import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';

import { setMediaQuery } from '../../../tests/helpers/matchMedia.js';
import ThemeToggle from '../../components/layout/ThemeToggle.jsx';
import { navigation } from '../../content/site.js';
import ThemeProvider, { THEME_STORAGE_KEY, useTheme } from './ThemeProvider.jsx';

const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';
const labels = navigation.theme;

afterEach(() => {
  delete document.documentElement.dataset.theme;
});

function renderToggle() {
  render(
    <ThemeProvider>
      <ThemeToggle labels={labels} />
    </ThemeProvider>,
  );
  return userEvent.setup();
}

const appliedTheme = () => document.documentElement.dataset.theme;

test('follows the system setting when the visitor has not chosen', () => {
  setMediaQuery(DARK_SCHEME_QUERY, true);

  renderToggle();

  expect(appliedTheme()).toBe('dark');
  expect(screen.getByRole('button', { name: labels.toLight })).toBeVisible();
});

test('defaults to light when the system has no dark preference', () => {
  renderToggle();

  expect(appliedTheme()).toBe('light');
  expect(screen.getByRole('button', { name: labels.toDark })).toBeVisible();
});

test('keeps following the system while there is no saved choice', () => {
  renderToggle();

  act(() => setMediaQuery(DARK_SCHEME_QUERY, true));

  expect(appliedTheme()).toBe('dark');
});

test('the toggle switches the theme, relabels itself and saves the choice', async () => {
  const user = renderToggle();

  await user.click(screen.getByRole('button', { name: labels.toDark }));

  expect(appliedTheme()).toBe('dark');
  expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  expect(screen.getByRole('button', { name: labels.toLight })).toBeVisible();
});

test('a saved choice wins over the system setting, and survives a system change', () => {
  window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
  setMediaQuery(DARK_SCHEME_QUERY, true);

  renderToggle();
  expect(appliedTheme()).toBe('light');

  act(() => setMediaQuery(DARK_SCHEME_QUERY, false));
  act(() => setMediaQuery(DARK_SCHEME_QUERY, true));
  expect(appliedTheme()).toBe('light');
});

test('an unrecognised saved value is ignored', () => {
  window.localStorage.setItem(THEME_STORAGE_KEY, 'sepia');

  renderToggle();

  expect(appliedTheme()).toBe('light');
});

test('still switches for this visit when storage is blocked', async () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new DOMException('Access denied', 'SecurityError');
  });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('Access denied', 'SecurityError');
  });
  const user = renderToggle();

  await user.click(screen.getByRole('button', { name: labels.toDark }));

  expect(appliedTheme()).toBe('dark');
});

test('useTheme explains itself when used outside the provider', () => {
  // React logs the thrown error; that noise is expected here.
  vi.spyOn(console, 'error').mockImplementation(() => {});
  const Orphan = () => {
    useTheme();
    return null;
  };

  expect(() => render(<Orphan />)).toThrow('useTheme must be used inside ThemeProvider');
});
