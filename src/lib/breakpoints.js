/**
 * Breakpoints as media query strings, for the few places JavaScript needs to
 * know the layout. They mirror the custom media in src/styles/tokens.css,
 * which is where CSS reads them; change both together.
 */

/** From this width up, the header shows its links inline instead of a menu. */
export const MEDIA_FROM_MD = '(min-width: 60rem)';
