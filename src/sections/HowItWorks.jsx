import { useRef } from 'react';

import Section from '../components/ui/Section.jsx';
import { useInView } from '../hooks/useInView.js';
import styles from './HowItWorks.module.css';

/** Reveal once the steps are a little way into the viewport, not at its very edge. */
const REVEAL_MARGIN = '0px 0px -15% 0px';

/**
 * @typedef {object} HowItWorksContent
 * @property {string} id
 * @property {string} title
 * @property {{ title: string, body: string }[]} steps
 */

/**
 * The three steps from username to shareable card. The steps are numbered
 * because their order is the information, and they appear in that order the
 * first time the section scrolls into view.
 *
 * @param {{ content: HowItWorksContent }} props
 */
export default function HowItWorks({ content }) {
  const stepsRef = useRef(/** @type {HTMLOListElement | null} */ (null));
  const isRevealed = useInView(stepsRef, { once: true, rootMargin: REVEAL_MARGIN });

  return (
    <Section id={content.id} title={content.title}>
      <ol ref={stepsRef} className={styles.steps} data-revealed={isRevealed}>
        {content.steps.map((step, index) => (
          <li key={step.title} className={styles.step}>
            <span className={styles.number} aria-hidden="true">
              {index + 1}
            </span>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.body}>{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
