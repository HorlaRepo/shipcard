import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { faq, features, hero, howItWorks, navigation, pricing, waitlist } from '../content/site.js';
import App from './App.jsx';

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

test('the page has no accessibility violations', async () => {
  const { container } = render(<App />);

  const results = await axe(container);

  expect(results.violations).toEqual([]);
});
