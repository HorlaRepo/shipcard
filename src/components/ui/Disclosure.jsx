import { useId, useState } from 'react';

import styles from './Disclosure.module.css';
import Icon from './Icon.jsx';

/**
 * A heading that shows and hides the content under it: a button with
 * `aria-expanded` and `aria-controls`, so Enter and Space work natively and
 * assistive technology hears the state.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {import('react').ReactNode} props.children The content revealed when open.
 */
export default function Disclosure({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <>
      <h3 className={styles.heading}>
        <button
          className={styles.trigger}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((wasOpen) => !wasOpen)}
        >
          <span>{title}</span>
          <span className={styles.icon}>
            <Icon name="plus" />
          </span>
        </button>
      </h3>
      <div id={panelId} className={styles.panel} hidden={!isOpen}>
        {children}
      </div>
    </>
  );
}
