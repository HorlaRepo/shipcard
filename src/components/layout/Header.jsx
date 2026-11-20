import Button from '../ui/Button.jsx';
import Container from '../ui/Container.jsx';
import styles from './Header.module.css';
import MobileNav from './MobileNav.jsx';

/**
 * @typedef {object} NavigationContent
 * @property {string} label Accessible name of the navigation landmark.
 * @property {string} homeLabel Accessible name of the wordmark link.
 * @property {{ label: string, href: string }[]} links
 * @property {{ label: string, href: string }} cta
 * @property {{ openLabel: string, closeLabel: string, dialogLabel: string }} menu
 */

/**
 * The sticky page header: wordmark, section links and the waitlist action.
 * Below the medium breakpoint the links move into MobileNav.
 *
 * @param {{ siteName: string, homeHref: string, navigation: NavigationContent }} props
 */
export default function Header({ siteName, homeHref, navigation }) {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.bar}>
          <a className={styles.wordmark} href={homeHref} aria-label={navigation.homeLabel}>
            {siteName}
          </a>

          <nav className={styles.nav} aria-label={navigation.label}>
            <ul className={styles.links}>
              {navigation.links.map((link) => (
                <li key={link.href}>
                  <a className={styles.link} href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <div className={styles.cta}>
              <Button href={navigation.cta.href}>{navigation.cta.label}</Button>
            </div>
            <MobileNav navigation={navigation} />
          </div>
        </div>
      </Container>
    </header>
  );
}
