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
  'arrow-up-right': 'M7 17L17 7M9 7h8v8',
  star: 'M12 4l2.5 5.2 5.5.8-4 4 1 5.6-5-2.7-5 2.7 1-5.6-4-4 5.5-.8z',
  copy: 'M9 9h10v10H9zM5 15V5h10',
  alert: 'M12 4l9 16H3zM12 10v4M12 17v.5',
  plus: 'M12 5v14M5 12h14',
  sun: 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8',
  moon: 'M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z',
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
