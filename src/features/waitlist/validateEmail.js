import { isEmail } from '../../lib/email.js';

/**
 * Checks what the visitor typed into the email field.
 *
 * @param {string} value
 * @returns {'empty' | 'invalid' | null} The problem, or null when the address is usable.
 */
export function validateEmail(value) {
  const trimmed = value.trim();
  if (trimmed === '') {
    return 'empty';
  }
  return isEmail(trimmed) ? null : 'invalid';
}
