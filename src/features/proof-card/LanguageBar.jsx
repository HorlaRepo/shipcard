import styles from './LanguageBar.module.css';

/**
 * The share of each top language, as one segmented bar and a list. The bar is
 * decorative: the list beside it carries every name and percentage, so the
 * tints never have to be told apart.
 *
 * @param {{ languages: import('./mapProfile.js').LanguageShare[] }} props
 */
export default function LanguageBar({ languages }) {
  return (
    <>
      <div className={styles.bar} aria-hidden="true">
        {languages.map((language) => (
          <span
            key={language.name}
            className={styles.segment}
            style={/** @type {import('react').CSSProperties} */ ({ '--share': language.count })}
          />
        ))}
      </div>
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
