import Section from '../components/ui/Section.jsx';
import styles from './Faq.module.css';

/**
 * @typedef {object} FaqContent
 * @property {string} id
 * @property {string} title
 * @property {{ id: string, question: string, answer: string }[]} items
 */

/**
 * Questions a careful visitor asks before trusting the card.
 *
 * @param {{ content: FaqContent }} props
 */
export default function Faq({ content }) {
  return (
    <Section id={content.id} title={content.title}>
      <ul className={styles.list}>
        {content.items.map((item) => (
          <li key={item.id} className={styles.item}>
            <h3 className={styles.question}>{item.question}</h3>
            <p className={styles.answer}>{item.answer}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
