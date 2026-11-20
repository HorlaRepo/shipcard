import { readFileSync } from 'node:fs';

import { describe, expect, test } from 'vitest';

import { contrastRatio } from '../../tests/helpers/contrast.js';

// Read from disk (relative to the project root, where Vitest runs): Vitest
// replaces CSS imports with an empty module.
const tokensCss = readFileSync('src/styles/tokens.css', 'utf8');

const TEXT_MINIMUM = 4.5;
const BOUNDARY_MINIMUM = 3;

/**
 * Reads the colour tokens declared in the rule that contains `marker`.
 *
 * @param {string} marker Text that appears only in that theme's rule.
 * @returns {Record<string, string>} Token name to hex value.
 */
function readTheme(marker) {
  const start = tokensCss.indexOf(marker);
  const block = tokensCss.slice(start, tokensCss.indexOf('}', start));
  const declarations = block.matchAll(/(--color-[\w-]+):\s*(#[0-9a-f]{6})\b/gi);
  return Object.fromEntries([...declarations].map(([, name, value]) => [name, value]));
}

const themes = {
  light: readTheme('color-scheme: light'),
  dark: readTheme('color-scheme: dark'),
};

/** Pairings recorded in docs/DESIGN.md under "Measured contrast". */
const pairings = [
  { foreground: '--color-ink', background: '--color-ground', minimum: TEXT_MINIMUM },
  { foreground: '--color-ink', background: '--color-surface', minimum: TEXT_MINIMUM },
  { foreground: '--color-ink-muted', background: '--color-ground', minimum: TEXT_MINIMUM },
  { foreground: '--color-ink-muted', background: '--color-surface', minimum: TEXT_MINIMUM },
  { foreground: '--color-on-accent', background: '--color-accent', minimum: TEXT_MINIMUM },
  { foreground: '--color-danger', background: '--color-surface', minimum: TEXT_MINIMUM },
  { foreground: '--color-danger', background: '--color-ground', minimum: TEXT_MINIMUM },
  { foreground: '--color-success', background: '--color-surface', minimum: TEXT_MINIMUM },
  { foreground: '--color-success', background: '--color-ground', minimum: TEXT_MINIMUM },
  { foreground: '--color-control', background: '--color-surface', minimum: BOUNDARY_MINIMUM },
  { foreground: '--color-control', background: '--color-ground', minimum: BOUNDARY_MINIMUM },
  { foreground: '--color-focus', background: '--color-ground', minimum: BOUNDARY_MINIMUM },
  { foreground: '--color-focus', background: '--color-surface', minimum: BOUNDARY_MINIMUM },
  { foreground: '--color-accent-edge', background: '--color-ground', minimum: BOUNDARY_MINIMUM },
];

describe.each(Object.entries(themes))('%s theme contrast', (_name, tokens) => {
  test.each(pairings)(
    '$foreground on $background is at least $minimum:1',
    ({ foreground, background, minimum }) => {
      const foregroundColour = tokens[foreground];
      const backgroundColour = tokens[background];

      expect(foregroundColour, `${foreground} is defined`).toBeDefined();
      expect(backgroundColour, `${background} is defined`).toBeDefined();
      expect(
        contrastRatio(String(foregroundColour), String(backgroundColour)),
      ).toBeGreaterThanOrEqual(minimum);
    },
  );
});
