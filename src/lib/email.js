/**
 * Email address validation, shared by the waitlist form and the Worker that
 * receives it, so the browser and the server cannot disagree.
 *
 * Deliberately loose: one "@", something before it, a dot somewhere in the
 * domain, no spaces. Whether an address really exists can only be learned by
 * writing to it, so a stricter pattern would only reject real addresses.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The longest address the SMTP standards allow (RFC 5321). */
export const EMAIL_MAX_LENGTH = 254;

/**
 * @param {unknown} value
 * @returns {value is string} Whether the value looks like an email address.
 */
export function isEmail(value) {
  return typeof value === 'string' && value.length <= EMAIL_MAX_LENGTH && EMAIL_PATTERN.test(value);
}
