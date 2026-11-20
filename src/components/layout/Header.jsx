import { useRef } from 'react';

import { useInView } from '../../hooks/useInView.js';
import Button from '../ui/Button.jsx';
import Container from '../ui/Container.jsx';
import styles from './Header.module.css';
import MobileNav from './MobileNav.jsx';
import ThemeToggle from './ThemeToggle.jsx';

/**
 * @typedef {object} NavigationContent
 * @property {string} label Accessible name of the navigation landmark.
 * @property {string} homeLabel Accessible name of the wordmark link.
 * @property {{ label: string, href: string }[]} links
 * @property {{ label: string, href: string }} cta
 * @property {{ toDark: string, toLight: string }} theme
 * @property {{ openLabel: string, closeLabel: string, dialogLabel: string }} menu
 */

/**
 * The sticky page header: wordmark, section links, theme toggle and the
 * waitlist action. Below the medium breakpoint the links move into MobileNav.
 *
 * Once the page has scrolled, the header draws a hairline under itself and
 * the wordmark shrinks a little. A sentinel at the top of the page reports
 * the scroll position through IntersectionObserver, so no scroll listener runs.
 *
 * @param {{ siteName: string, homeHref: string, navigation: NavigationContent }} props
 */
export default function Header({ siteName, homeHref, navigation }) {
  const sentinelRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const isAtTop = useInView(sentinelRef);

  return (
    <>
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
      <header className={styles.header} data-scrolled={!isAtTop}>
        <Container>
          <div className={styles.bar}>
            <a
              className={styles.wordmark}
              href={homeHref}
              aria-label={navigation.homeLabel}
              translate="no"
            >
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
              <ThemeToggle labels={navigation.theme} />
              <MobileNav navigation={navigation} />
            </div>
          </div>
        </Container>
      </header>
    </>
  );
}
