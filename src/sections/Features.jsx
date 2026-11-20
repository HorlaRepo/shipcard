import Section from '../components/ui/Section.jsx';
import styles from './Features.module.css';

/**
 * @typedef {object} FeaturesContent
 * @property {string} id
 * @property {string} title
 * @property {{ title: string, body: string }[]} items
 */

/**
 * What the card shows, as a ruled list: a claim on the left, the reason it
 * can be trusted on the right.
 *
 * @param {{ content: FeaturesContent }} props
 */
export default function Features({ content }) {
  return (
    <Section id={content.id} title={content.title}>
      <ul className={styles.list}>
        {content.items.map((item) => (
          <li key={item.title} className={styles.item}>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.body}>{item.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
