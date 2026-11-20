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

/**
 * Formats a count compactly, e.g. 256248 → "256K", 1500 → "1.5K", 42 → "42".
 *
 * @param {number} value
 * @returns {string}
 */
export function formatCount(value) {
  return new Intl.NumberFormat(LOCALE, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

const MS_PER_SECOND = 1000;

/** Units for relative time, largest first, with their length in seconds. */
const RELATIVE_UNITS = /** @type {const} */ ([
  ['year', 365 * 24 * 60 * 60],
  ['month', 30 * 24 * 60 * 60],
  ['week', 7 * 24 * 60 * 60],
  ['day', 24 * 60 * 60],
  ['hour', 60 * 60],
  ['minute', 60],
]);

/**
 * Describes how long ago a moment was, e.g. "3 days ago", "yesterday",
 * "now". The largest unit that fits at least once is used.
 *
 * @param {Date} date The moment being described.
 * @param {Date} now The moment it is described from.
 * @returns {string}
 */
export function formatRelativeTime(date, now) {
  const elapsedSeconds = (now.getTime() - date.getTime()) / MS_PER_SECOND;
  const formatter = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });

  for (const [unit, secondsPerUnit] of RELATIVE_UNITS) {
    if (elapsedSeconds >= secondsPerUnit) {
      return formatter.format(-Math.floor(elapsedSeconds / secondsPerUnit), unit);
    }
  }
  return formatter.format(0, 'second');
}

/**
 * Formats a time of day in the visitor's own time zone, e.g. "14:32".
 *
 * @param {Date} date
 * @returns {string}
 */
export function formatClockTime(date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

/**
 * Formats a calendar date, e.g. "20 Nov 2026".
 *
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/**
 * Fills `{name}` placeholders in a copy template.
 *
 * @param {string} template e.g. "No GitHub user called @{username}."
 * @param {Record<string, string | number>} values
 * @returns {string}
 */
export function fillTemplate(template, values) {
  return template.replace(/\{(\w+)\}/g, (placeholder, name) =>
    name in values ? String(values[name]) : placeholder,
  );
}
