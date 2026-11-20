import { useId } from 'react';

import styles from './SegmentedControl.module.css';

/**
 * @template {string} Value
 * @typedef {object} SegmentedControlProps
 * @property {string} legend Names the group for assistive technology.
 * @property {{ value: Value, label: string, note?: string }[]} options
 * @property {Value} value The selected option.
 * @property {(value: Value) => void} onChange
 */

/**
 * A choice between a few options, built on a native radio group: arrow keys
 * move the selection and the group is announced as one control.
 *
 * @template {string} Value
 * @param {SegmentedControlProps<Value>} props
 */
export default function SegmentedControl({ legend, options, value, onChange }) {
  const name = useId();

  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.options}>
        {options.map((option) => (
          <label key={option.value} className={styles.option}>
            <input
              className={styles.input}
              type="radio"
              name={name}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
            />
            <span className={styles.label}>
              {option.label}
              {option.note ? <span className={styles.note}> {option.note}</span> : null}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
