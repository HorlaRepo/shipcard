import styles from './Container.module.css';

/**
 * Holds content to the page's maximum width with the fluid gutter.
 *
 * @param {{ children: import('react').ReactNode }} props
 */
export default function Container({ children }) {
  return <div className={styles.container}>{children}</div>;
}
