import { expect, test } from 'vitest';

import { encodeCode39 } from './encodeCode39.js';

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-';
/** A character is 3 wide and 6 narrow elements: 3×3 + 6×1 modules. */
const CHARACTER_WIDTH = 15;
const GAP_WIDTH = 1;
const BARS_PER_CHARACTER = 5;

/**
 * @param {string} text
 * @returns {string} The bars as "x:width" pairs, for comparing two encodings.
 */
function signature(text) {
  const barcode = encodeCode39(text);
  return barcode ? barcode.bars.map((bar) => `${bar.x}:${bar.width}`).join(',') : 'null';
}

test('frames the text with start and stop characters', () => {
  const barcode = encodeCode39('A');
  const characterCount = 3;

  expect(barcode?.bars).toHaveLength(characterCount * BARS_PER_CHARACTER);
  expect(barcode?.width).toBe(characterCount * CHARACTER_WIDTH + (characterCount - 1) * GAP_WIDTH);
});

test('every character in the alphabet has a distinct pattern', () => {
  const signatures = new Set([...ALPHABET].map(signature));

  expect(signatures.size).toBe(ALPHABET.length);
});

test('every character is exactly fifteen modules wide', () => {
  for (const character of ALPHABET) {
    expect(encodeCode39(character)?.width, character).toBe(3 * CHARACTER_WIDTH + 2 * GAP_WIDTH);
  }
});

test('lower case is encoded as upper case', () => {
  expect(signature('torvalds')).toBe(signature('TORVALDS'));
});

test('encodes the letter A with the standard pattern', () => {
  // "*" is narrow-wide-narrow-narrow-wide-narrow-wide-narrow-narrow, then a gap;
  // "A" is wide-narrow-narrow-narrow-narrow-wide-narrow-narrow-wide.
  const startWidth = CHARACTER_WIDTH + GAP_WIDTH;

  expect(encodeCode39('A')?.bars.slice(BARS_PER_CHARACTER, 2 * BARS_PER_CHARACTER)).toEqual([
    { x: startWidth, width: 3 },
    { x: startWidth + 4, width: 1 },
    { x: startWidth + 6, width: 1 },
    { x: startWidth + 10, width: 1 },
    { x: startWidth + 12, width: 3 },
  ]);
});

test.each(['under_score', 'dot.name', 'star*', 'ünïcode'])(
  'returns null for "%s", which Code 39 cannot carry',
  (text) => {
    expect(encodeCode39(text)).toBeNull();
  },
);
