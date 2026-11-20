import { useEffect, useId, useRef, useState } from 'react';

import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { EMAIL_MAX_LENGTH } from '../../lib/email.js';
import { fillTemplate } from '../../lib/format.js';
import { isAbortError } from '../../lib/http.js';
import { submitWaitlist, WaitlistError } from './submitWaitlist.js';
import { validateEmail } from './validateEmail.js';
import styles from './WaitlistForm.module.css';

/**
 * @typedef {object} WaitlistFormContent
 * @property {string} label
 * @property {string} hint
 * @property {string} submit
 * @property {string} submitting
 * @property {string} honeypotLabel
 * @property {string} success
 * @property {Record<'empty' | 'invalid' | 'rejected' | 'network' | 'server', string>} problems
 */

/**
 * @typedef {(
 *   | { status: 'editing', problem: keyof WaitlistFormContent['problems'] | null }
 *   | { status: 'submitting' }
 *   | { status: 'success', email: string }
 * )} FormState
 */

/**
 * The waitlist sign-up: the feature's only public component. The address is
 * checked when the field loses focus and again on submit; the outcome is
 * shown in place and announced.
 *
 * @param {{ content: WaitlistFormContent }} props
 */
export default function WaitlistForm({ content }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState(
    /** @type {FormState} */ ({ status: 'editing', problem: null }),
  );
  const inputRef = useRef(/** @type {HTMLInputElement | null} */ (null));
  const honeypotRef = useRef(/** @type {HTMLInputElement | null} */ (null));
  const controllerRef = useRef(/** @type {AbortController | null} */ (null));
  const id = useId();
  const hintId = `${id}-hint`;
  const problemId = `${id}-problem`;

  // A sign-up still in flight when the form goes away has nobody to report to.
  useEffect(() => () => controllerRef.current?.abort(), []);

  const problem = state.status === 'editing' ? state.problem : null;
  const isSubmitting = state.status === 'submitting';

  /** @param {import('react').FormEvent} event */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    const inputProblem = validateEmail(email);
    if (inputProblem) {
      setState({ status: 'editing', problem: inputProblem });
      inputRef.current?.focus();
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    setState({ status: 'submitting' });
    try {
      const address = email.trim();
      await submitWaitlist(
        { email: address, website: honeypotRef.current?.value ?? '' },
        { signal: controller.signal },
      );
      setState({ status: 'success', email: address });
    } catch (error) {
      if (isAbortError(error)) {
        return;
      }
      setState({
        status: 'editing',
        problem: error instanceof WaitlistError ? error.kind : 'server',
      });
      inputRef.current?.focus();
    }
  };

  if (state.status === 'success') {
    return (
      <p className={styles.success} role="status">
        <span className={styles.successIcon}>
          <Icon name="check" />
        </span>
        {fillTemplate(content.success, { email: state.email })}
      </p>
    );
  }

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
          type="email"
          name="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setState({ status: 'editing', problem: null });
          }}
          onBlur={() => {
            // An untouched field is not an error yet; a half-typed one is.
            if (email !== '' && !isSubmitting) {
              setState({ status: 'editing', problem: validateEmail(email) });
            }
          }}
          maxLength={EMAIL_MAX_LENGTH}
          autoComplete="email"
          autoCapitalize="none"
          spellCheck="false"
          required
          aria-invalid={problem ? 'true' : undefined}
          aria-describedby={`${hintId} ${problemId}`}
        />
        <Button variant="primary" type="submit">
          {isSubmitting ? content.submitting : content.submit}
        </Button>
      </div>

      {/* Hidden from people, tempting to bots: a value here marks the sign-up as automated. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`${id}-website`}>{content.honeypotLabel}</label>
        <input
          ref={honeypotRef}
          id={`${id}-website`}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <p id={hintId} className={styles.hint}>
        {content.hint}
      </p>
      <p id={problemId} className={styles.problem} role="alert">
        {problem ? content.problems[problem] : ''}
      </p>
    </form>
  );
}
