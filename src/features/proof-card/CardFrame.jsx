import styles from './CardFrame.module.css';

/**
 * The label stock every state of the card is printed on. The empty, loading,
 * error and filled states all render inside it, so they have identical
 * dimensions and the page never shifts when one replaces another.
 *
 * @param {object} props
 * @param {string} props.productName
 * @param {string} props.kind The card's type, printed in the header strip.
 * @param {boolean} [props.isArriving] Plays the arrival motion; set for a finished card only.
 * @param {import('react').ReactNode} props.children
 */
export default function CardFrame({ productName, kind, isArriving = false, children }) {
  return (
    <div className={isArriving ? `${styles.frame} ${styles.arriving}` : styles.frame}>
      <p className={styles.strip}>
        <span>{productName}</span>
        <span>{kind}</span>
      </p>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
