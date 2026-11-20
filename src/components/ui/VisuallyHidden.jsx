import styles from './VisuallyHidden.module.css';

/**
 * Text for assistive technology only: hidden from sight, present in the
 * accessibility tree.
 *
 * @param {{ children: import('react').ReactNode }} props
 */
export default function VisuallyHidden({ children }) {
  return <span className={styles.hidden}>{children}</span>;
}
