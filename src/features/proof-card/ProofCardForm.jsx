import { useEffect, useId, useRef, useState } from 'react';

import Button from '../../components/ui/Button.jsx';
import { fillTemplate } from '../../lib/format.js';
import { parseUsername } from './parseUsername.js';
import styles from './ProofCardForm.module.css';

/** Requests left at or below which the visitor is told how many remain. */
const LOW_QUOTA_REQUESTS = 10;
const REQUESTS_PER_LOOKUP = 2;

/**
 * @typedef {object} FormContent
 * @property {string} label
 * @property {string} hint
 * @property {string} submit
 * @property {string} examplesLabel
 * @property {string} quotaHint
 * @property {{ empty: string, invalid: string, notFound: string }} problems
 */

/**
 * The username form. Input is validated before it is submitted, so invalid
 * text never reaches the network.
 *
 * @param {object} props
 * @param {FormContent} props.content
 * @param {string[]} props.examples Usernames offered as one-click chips.
 * @param {string} props.initialValue
 * @param {string | null} props.lookupProblem A failure about the input itself, e.g. not found.
 * @param {import('./githubClient.js').Quota | null} props.quota
 * @param {(username: string) => void} props.onSubmit
 */
export default function ProofCardForm({
  content,
  examples,
  initialValue,
  lookupProblem,
  quota,
  onSubmit,
}) {
  const [value, setValue] = useState(initialValue);
  const [inputProblem, setInputProblem] = useState(
    /** @type {'empty' | 'invalid' | null} */ (null),
  );
  const inputRef = useRef(/** @type {HTMLInputElement | null} */ (null));
  const id = useId();
  const hintId = `${id}-hint`;
  const problemId = `${id}-problem`;

  const problem = inputProblem ? content.problems[inputProblem] : lookupProblem;

  // A problem with the input sends the visitor back to it, wherever focus was.
  useEffect(() => {
    if (problem) {
      inputRef.current?.focus();
    }
  }, [problem]);

  /** @param {string} text */
  const submitText = (text) => {
    const parsed = parseUsername(text);
    setInputProblem(parsed.problem);
    if (parsed.username) {
      onSubmit(parsed.username);
    }
  };

  /** @param {import('react').FormEvent} event */
  const handleSubmit = (event) => {
    event.preventDefault();
    submitText(value);
  };

  /** @param {string} username */
  const handleExampleClick = (username) => {
    setValue(username);
    submitText(username);
  };

  const lookupsLeft = quota ? Math.floor(quota.remaining / REQUESTS_PER_LOOKUP) : null;
  const isQuotaLow = quota !== null && quota.remaining <= LOW_QUOTA_REQUESTS;

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <label className={styles.label} htmlFor={id}>
        {content.label}
      </label>
      <div className={styles.row}>
        <input
          ref={inputRef}
          id={id}
          className={styles.input}
          type="text"
          name="username"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setInputProblem(null);
          }}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
          enterKeyHint="go"
          required
          aria-invalid={problem ? 'true' : undefined}
          aria-describedby={`${hintId} ${problemId}`}
        />
        <Button variant="primary" type="submit">
          {content.submit}
        </Button>
      </div>
      <p id={hintId} className={styles.hint}>
        {content.hint}
      </p>
      <p id={problemId} className={styles.problem} role="alert">
        {problem}
      </p>

      <div className={styles.examples}>
        <p className={styles.caption} id={`${id}-examples`}>
          {content.examplesLabel}
        </p>
        <ul className={styles.chips} aria-labelledby={`${id}-examples`}>
          {examples.map((username) => (
            <li key={username}>
              <button
                className={styles.chip}
                type="button"
                onClick={() => handleExampleClick(username)}
              >
                @{username}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p className={styles.quota} role="status">
        {isQuotaLow && lookupsLeft !== null
          ? fillTemplate(content.quotaHint, { count: lookupsLeft })
          : ''}
      </p>
    </form>
  );
}
