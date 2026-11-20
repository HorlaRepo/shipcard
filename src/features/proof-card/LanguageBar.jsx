import styles from './LanguageBar.module.css';

/**
 * The share of each top language, as one segmented bar and a list. The bar is
 * decorative: the list beside it carries every name and percentage, so the
 * tints never have to be told apart.
 *
 * The bar is an SVG whose segment positions are attributes, because the
 * page's Content-Security-Policy does not allow inline styles.
 *
 * @param {{ languages: import('./mapProfile.js').LanguageShare[] }} props
 */
export default function LanguageBar({ languages }) {
  const total = languages.reduce((sum, language) => sum + language.count, 0);
  // Each segment starts where the ones before it end.
  const segments = languages.map((language, index) => ({
    name: language.name,
    x: languages.slice(0, index).reduce((sum, earlier) => sum + earlier.count, 0),
    width: language.count,
  }));

  return (
    <>
      <svg
        className={styles.bar}
        viewBox={`0 0 ${total} 1`}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        {segments.map((segment) => (
          <rect
            key={segment.name}
            className={styles.segment}
            x={segment.x}
            width={segment.width}
            height="1"
          />
        ))}
      </svg>
      <ul className={styles.legend}>
        {languages.map((language) => (
          <li key={language.name} className={styles.entry}>
            <span className={styles.swatch} aria-hidden="true" />
            {language.name} <span className={styles.percent}>{language.percent}%</span>
          </li>
        ))}
      </ul>
    </>
  );
}
