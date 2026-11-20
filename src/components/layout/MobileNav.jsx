import { useCallback, useId, useRef, useState } from 'react';

import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { useModalDialog } from '../../hooks/useModalDialog.js';
import { MEDIA_FROM_MD } from '../../lib/breakpoints.js';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';
import styles from './MobileNav.module.css';

/**
 * The menu for narrow screens: a button that opens the section links in a
 * modal dialog. Escape closes it and returns focus to the button; following
 * a link closes it and lets the browser move to the section.
 *
 * @param {{ navigation: import('./Header.jsx').NavigationContent }} props
 */
export default function MobileNav({ navigation }) {
  const [isRequestedOpen, setIsRequestedOpen] = useState(false);
  const isWide = useMediaQuery(MEDIA_FROM_MD);
  // The menu does not exist on wide screens, so it cannot be open there.
  const isOpen = isRequestedOpen && !isWide;

  const dialogId = useId();
  const triggerRef = useRef(/** @type {HTMLButtonElement | null} */ (null));
  const dialogRef = useRef(/** @type {HTMLDivElement | null} */ (null));

  const closeAndReturnFocus = useCallback(() => {
    setIsRequestedOpen(false);
    triggerRef.current?.focus();
  }, []);

  useModalDialog({ isOpen, dialogRef, onEscape: closeAndReturnFocus });

  const handleLinkClick = () => setIsRequestedOpen(false);

  return (
    <div className={styles.root}>
      <button
        ref={triggerRef}
        className={styles.trigger}
        type="button"
        aria-label={navigation.menu.openLabel}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={dialogId}
        onClick={() => setIsRequestedOpen(true)}
      >
        <Icon name="menu" />
      </button>

      <div
        ref={dialogRef}
        id={dialogId}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={navigation.menu.dialogLabel}
        hidden={!isOpen}
      >
        <div className={styles.panel}>
          <button
            className={styles.trigger}
            type="button"
            aria-label={navigation.menu.closeLabel}
            onClick={closeAndReturnFocus}
          >
            <Icon name="close" />
          </button>

          <nav aria-label={navigation.label}>
            <ul className={styles.links}>
              {navigation.links.map((link) => (
                <li key={link.href}>
                  <a className={styles.link} href={link.href} onClick={handleLinkClick}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <Button variant="primary" href={navigation.cta.href} onClick={handleLinkClick}>
            {navigation.cta.label}
          </Button>
        </div>
      </div>
    </div>
  );
}
