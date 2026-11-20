/**
 * Reports an unexpected error to the developer console, in development only.
 * Vite replaces `import.meta.env.DEV` with `false` in production builds, so
 * the call and its message are removed from the bundle.
 *
 * This is the one place the page may write to the console (decision log L-15).
 *
 * @param {string} message What was being attempted.
 * @param {unknown} error
 */
export function logInDevelopment(message, error) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console -- the single sanctioned dev-only log
    console.error(`[shipcard] ${message}`, error);
  }
}
