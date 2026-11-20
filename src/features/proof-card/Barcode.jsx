import styles from './Barcode.module.css';
import { encodeCode39 } from './encodeCode39.js';

/**
 * The username as a Code 39 barcode. Decorative for assistive technology:
 * the handle is printed as text on the same card.
 *
 * @param {{ text: string }} props
 */
export default function Barcode({ text }) {
  const barcode = encodeCode39(text);
  if (!barcode) {
    return null;
  }

  const path = barcode.bars.map((bar) => `M${bar.x} 0h${bar.width}v1h-${bar.width}z`).join('');

  return (
    <svg
      className={styles.barcode}
      viewBox={`0 0 ${barcode.width} 1`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} />
    </svg>
  );
}
