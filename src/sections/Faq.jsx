import Disclosure from '../components/ui/Disclosure.jsx';
import Section from '../components/ui/Section.jsx';
import styles from './Faq.module.css';

/**
 * @typedef {object} FaqContent
 * @property {string} id
 * @property {string} title
 * @property {{ id: string, question: string, answer: string }[]} items
 */

/**
 * Questions a careful visitor asks before trusting the card. Each answer
 * opens under its question; several can be open at once.
 *
 * @param {{ content: FaqContent }} props
 */
export default function Faq({ content }) {
  return (
    <Section id={content.id} title={content.title}>
      <ul className={styles.list}>
        {content.items.map((item) => (
          <li key={item.id} className={styles.item}>
            <Disclosure title={item.question}>
              <p>{item.answer}</p>
            </Disclosure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
