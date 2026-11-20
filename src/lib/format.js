/**
 * Formatting helpers built on the platform's Intl APIs (no date or number
 * library). Everything here is a pure function with no React imports.
 */

const LOCALE = 'en-US';

/**
 * Formats a whole-unit price, e.g. 8 → "$8".
 *
 * @param {number} amount
 * @param {string} currency ISO 4217 code, e.g. "USD".
 * @returns {string}
 */
export function formatPrice(amount, currency) {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
