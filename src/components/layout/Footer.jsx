import Container from '../ui/Container.jsx';
import styles from './Footer.module.css';

/**
 * @typedef {object} FooterContent
 * @property {string} note States that the product is a demo and where data comes from.
 * @property {string} credits
 * @property {string} linksLabel Accessible name of the footer navigation.
 * @property {{ label: string, href: string, isExternal: boolean }[]} links
 */

/**
 * The page footer: the demo-project note, secondary links and credits.
 *
 * @param {{ siteName: string, content: FooterContent }} props
 */
export default function Footer({ siteName, content }) {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.inner}>
          <div>
            <p className={styles.wordmark} translate="no">
              {siteName}
            </p>
            <p className={styles.note}>{content.note}</p>
          </div>

          <nav aria-label={content.linksLabel}>
            <ul className={styles.links}>
              {content.links.map((link) => (
                <li key={link.href}>
                  <a
                    className={styles.link}
                    href={link.href}
                    {...(link.isExternal && { rel: 'noopener noreferrer' })}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <p className={styles.credits}>{content.credits}</p>
        </div>
      </Container>
    </footer>
  );
}
