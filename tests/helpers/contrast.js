/**
 * WCAG 2.2 contrast between two colours.
 * https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio
 */

const HEX_COLOUR = /^#([0-9a-f]{6})$/i;

/**
 * @param {string} hex A six-digit hex colour, e.g. "#15140f".
 * @returns {number} Relative luminance, 0 (black) to 1 (white).
 */
function relativeLuminance(hex) {
  const match = HEX_COLOUR.exec(hex);
  if (!match || !match[1]) {
    throw new Error(`Expected a six-digit hex colour, received "${hex}"`);
  }
  const value = Number.parseInt(match[1], 16);
  const channels = [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
  const [red = 0, green = 0, blue = 0] = channels.map((channel) => {
    const srgb = channel / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

/**
 * @param {string} foreground Six-digit hex colour.
 * @param {string} background Six-digit hex colour.
 * @returns {number} Contrast ratio, 1 to 21.
 */
export function contrastRatio(foreground, background) {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}
