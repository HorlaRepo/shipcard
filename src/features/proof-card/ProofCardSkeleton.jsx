import VisuallyHidden from '../../components/ui/VisuallyHidden.jsx';
import CardFrame from './CardFrame.jsx';
import styles from './ProofCardSkeleton.module.css';

const FIGURE_COUNT = 3;
const REPO_COUNT = 3;

/**
 * The card while a lookup is in flight. It is printed on the same frame as
 * the finished card, so nothing moves when the data arrives.
 *
 * @param {object} props
 * @param {string} props.productName
 * @param {string} props.kind
 * @param {string} props.label What is loading, for assistive technology.
 */
export default function ProofCardSkeleton({ productName, kind, label }) {
  return (
    <CardFrame productName={productName} kind={kind}>
      <VisuallyHidden>{label}</VisuallyHidden>
      <div className={styles.skeleton} aria-hidden="true">
        <div className={styles.identity}>
          <span className={styles.avatar} />
          <span className={styles.lines}>
            <span className={styles.line} />
            <span className={styles.lineShort} />
          </span>
        </div>
        <div className={styles.figures}>
          {Array.from({ length: FIGURE_COUNT }, (_, index) => (
            <span key={index} className={styles.block} />
          ))}
        </div>
        <span className={styles.line} />
        <div className={styles.rows}>
          {Array.from({ length: REPO_COUNT }, (_, index) => (
            <span key={index} className={styles.line} />
          ))}
        </div>
        <span className={styles.block} />
      </div>
    </CardFrame>
  );
}
