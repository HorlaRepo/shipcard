import { describe, expect, test } from 'vitest';

import {
  fillTemplate,
  formatCount,
  formatDate,
  formatPrice,
  formatRelativeTime,
} from './format.js';

describe('formatCount', () => {
  test.each([
    [0, '0'],
    [42, '42'],
    [999, '999'],
    [1500, '1.5K'],
    [256248, '256.2K'],
    [1_234_567, '1.2M'],
    [4_200_000_000, '4.2B'],
  ])('%d → %s', (value, expected) => {
    expect(formatCount(value)).toBe(expected);
  });
});

describe('formatRelativeTime', () => {
  const now = new Date('2026-11-20T12:00:00Z');

  test.each([
    ['2026-11-20T11:59:40Z', 'now'],
    ['2026-11-20T11:55:00Z', '5 minutes ago'],
    ['2026-11-20T09:00:00Z', '3 hours ago'],
    ['2026-11-19T12:00:00Z', 'yesterday'],
    ['2026-11-17T12:00:00Z', '3 days ago'],
    ['2026-11-06T12:00:00Z', '2 weeks ago'],
    ['2026-08-20T12:00:00Z', '3 months ago'],
    ['2024-11-20T12:00:00Z', '2 years ago'],
  ])('%s → %s', (date, expected) => {
    expect(formatRelativeTime(new Date(date), now)).toBe(expected);
  });
});

test('formatPrice shows whole dollars', () => {
  expect(formatPrice(8, 'USD')).toBe('$8');
  expect(formatPrice(0, 'USD')).toBe('$0');
});

test('formatDate is a day, short month and year in UTC', () => {
  expect(formatDate(new Date('2026-11-20T23:30:00Z'))).toBe('20 Nov 2026');
});

test('fillTemplate replaces known placeholders and leaves unknown ones', () => {
  expect(fillTemplate('Hi @{name}, {count} left. {other}', { name: 'ada', count: 3 })).toBe(
    'Hi @ada, 3 left. {other}',
  );
});
