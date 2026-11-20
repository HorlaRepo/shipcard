import Section from '../components/ui/Section.jsx';
import styles from './HowItWorks.module.css';

/**
 * @typedef {object} HowItWorksContent
 * @property {string} id
 * @property {string} title
 * @property {{ title: string, body: string }[]} steps
 */

/**
 * The three steps from username to shareable card. The steps are numbered
 * because their order is the information.
 *
 * @param {{ content: HowItWorksContent }} props
 */
export default function HowItWorks({ content }) {
  return (
    <Section id={content.id} title={content.title}>
      <ol className={styles.steps}>
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
