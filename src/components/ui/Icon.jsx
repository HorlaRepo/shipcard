import styles from './Icon.module.css';

/**
 * The page's icon set: authored paths on a 24-unit grid, drawn with one
 * stroke weight (DESIGN.md: icons are authored SVG, never glyphs or emoji).
 */
const paths = {
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
};

/** @typedef {keyof typeof paths} IconName */

/**
 * A decorative icon. It is hidden from assistive technology, so the control
 * or text beside it must carry the meaning.
 *
 * @param {{ name: IconName }} props
 */
export default function Icon({ name }) {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={paths[name]} />
    </svg>
  );
}
