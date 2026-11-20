/**
 * Code 39 barcode encoding. Its alphabet (capital letters, digits, hyphen) is
 * exactly the alphabet of a GitHub username, so the barcode on a card is a
 * real, scannable encoding of the handle rather than decoration.
 *
 * Each character is nine elements, alternating bar and space and starting
 * with a bar; three of the nine are wide ("w"), the rest narrow ("n").
 */
const PATTERNS = /** @type {Record<string, string>} */ ({
  0: 'nnnwwnwnn',
  1: 'wnnwnnnnw',
  2: 'nnwwnnnnw',
  3: 'wnwwnnnnn',
  4: 'nnnwwnnnw',
  5: 'wnnwwnnnn',
  6: 'nnwwwnnnn',
  7: 'nnnwnnwnw',
  8: 'wnnwnnwnn',
  9: 'nnwwnnwnn',
  A: 'wnnnnwnnw',
  B: 'nnwnnwnnw',
  C: 'wnwnnwnnn',
  D: 'nnnnwwnnw',
  E: 'wnnnwwnnn',
  F: 'nnwnwwnnn',
  G: 'nnnnnwwnw',
  H: 'wnnnnwwnn',
  I: 'nnwnnwwnn',
  J: 'nnnnwwwnn',
  K: 'wnnnnnnww',
  L: 'nnwnnnnww',
  M: 'wnwnnnnwn',
  N: 'nnnnwnnww',
  O: 'wnnnwnnwn',
  P: 'nnwnwnnwn',
  Q: 'nnnnnnwww',
  R: 'wnnnnnwwn',
  S: 'nnwnnnwwn',
  T: 'nnnnwnwwn',
  U: 'wwnnnnnnw',
  V: 'nwwnnnnnw',
  W: 'wwwnnnnnn',
  X: 'nwnnwnnnw',
  Y: 'wwnnwnnnn',
  Z: 'nwwnwnnnn',
  '-': 'nwnnnnwnw',
  '*': 'nwnnwnwnn',
});

/** Every Code 39 symbol starts and ends with this character. */
const START_STOP = '*';
const NARROW = 1;
const WIDE = 3;

/**
 * @typedef {object} Barcode
 * @property {{ x: number, width: number }[]} bars Position and width of each bar, in modules.
 * @property {number} width Total width in modules.
 */

/**
 * Encodes text as Code 39.
 *
 * @param {string} text Letters, digits and hyphens; lower case is encoded as upper case.
 * @returns {Barcode | null} Null if the text has a character Code 39 cannot carry.
 */
export function encodeCode39(text) {
  // The start/stop character may not appear inside the data.
  if (text.includes(START_STOP)) {
    return null;
  }
  const characters = [...`${START_STOP}${text.toUpperCase()}${START_STOP}`];
  /** @type {Barcode['bars']} */
  const bars = [];
  let x = 0;

  for (const character of characters) {
    const pattern = PATTERNS[character];
    if (!pattern) {
      return null;
    }
    [...pattern].forEach((element, index) => {
      const width = element === 'w' ? WIDE : NARROW;
      const isBar = index % 2 === 0;
      if (isBar) {
        bars.push({ x, width });
      }
      x += width;
    });
    // One narrow space separates characters.
    x += NARROW;
  }

  return { bars, width: x - NARROW };
}
