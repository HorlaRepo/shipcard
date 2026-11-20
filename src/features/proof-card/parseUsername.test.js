import { describe, expect, test } from 'vitest';

import { parseUsername } from './parseUsername.js';

describe('accepts', () => {
  test.each([
    ['torvalds', 'torvalds'],
    ['  torvalds  ', 'torvalds'],
    ['@torvalds', 'torvalds'],
    ['Sindre-Sorhus', 'Sindre-Sorhus'],
    ['a', 'a'],
    ['a-b-c', 'a-b-c'],
    ['https://github.com/gaearon', 'gaearon'],
    ['http://www.github.com/gaearon/', 'gaearon'],
    ['github.com/gaearon?tab=repositories', 'gaearon'],
    ['https://github.com/gaearon/overreacted.io', 'gaearon'],
    ['a'.repeat(39), 'a'.repeat(39)],
  ])('%s', (input, username) => {
    expect(parseUsername(input)).toEqual({ username, problem: null });
  });
});

describe('rejects as empty', () => {
  test.each(['', '   ', '\t\n'])('"%s"', (input) => {
    expect(parseUsername(input)).toEqual({ username: null, problem: 'empty' });
  });
});

describe('rejects as invalid', () => {
  test.each([
    ['a leading hyphen', '-torvalds'],
    ['a trailing hyphen', 'torvalds-'],
    ['consecutive hyphens', 'tor--valds'],
    ['40 characters', 'a'.repeat(40)],
    ['a space inside', 'linus torvalds'],
    ['an underscore', 'linus_torvalds'],
    ['a dot', 'linus.torvalds'],
    ['a path separator', '../users'],
    ['only an @', '@'],
    ['a link to another site', 'https://gitlab.com/torvalds'],
    ['markup', '<script>'],
  ])('%s', (_reason, input) => {
    expect(parseUsername(input)).toEqual({ username: null, problem: 'invalid' });
  });
});
