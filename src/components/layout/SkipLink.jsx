import styles from './SkipLink.module.css';

/**
 * The first focusable element on the page: lets keyboard users jump past the
 * header. It stays off-screen until focused.
 *
 * @param {{ label: string, targetId: string }} props
 */
export default function SkipLink({ label, targetId }) {
  return (
    <a className={styles.link} href={`#${targetId}`}>
      {label}
    </a>
  );
}
