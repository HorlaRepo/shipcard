import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { faq, features, hero, howItWorks, navigation, pricing, waitlist } from '../content/site.js';
import App from './App.jsx';
import { THEME_STORAGE_KEY } from './providers/ThemeProvider.jsx';

test('the page has one h1 and it is the promise', () => {
  render(<App />);

  const headings = screen.getAllByRole('heading', { level: 1 });

  expect(headings).toHaveLength(1);
  expect(headings[0]).toHaveTextContent(hero.title.marked);
});

test('every section below the hero is a named region with an h2', () => {
  render(<App />);

  for (const section of [howItWorks, features, pricing, faq, waitlist]) {
    const region = screen.getByRole('region', { name: section.title });
    expect(within(region).getByRole('heading', { level: 2, name: section.title })).toBeVisible();
  }
});

test('the header links point at sections that exist', () => {
  const { container } = render(<App />);

  for (const link of [...navigation.links, navigation.cta]) {
    expect(container.querySelector(link.href), `target of ${link.href}`).not.toBeNull();
  }
});

test('the skip link is the first focusable element and targets main', () => {
  render(<App />);

  const [firstLink] = screen.getAllByRole('link');

  expect(firstLink).toHaveAttribute('href', `#${screen.getByRole('main').id}`);
});

test.each(['light', 'dark'])(
  'the page has no accessibility violations in the %s theme',
  async (theme) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    const { container } = render(<App />);
    expect(document.documentElement.dataset.theme).toBe(theme);

    const results = await axe(container);

    expect(results.violations).toEqual([]);
  },
);

test('the page has no accessibility violations with the FAQ open and a pricing period chosen', async () => {
  const user = userEvent.setup();
  const { container } = render(<App />);
  await user.click(screen.getByRole('button', { name: faq.items[0]?.question }));
  await user.click(screen.getByRole('radio', { name: new RegExp(`^${pricing.billing.annual}`) }));

  const results = await axe(container);

  expect(results.violations).toEqual([]);
});
