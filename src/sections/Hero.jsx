import Container from '../components/ui/Container.jsx';
import styles from './Hero.module.css';

/**
 * @typedef {object} HeroContent
 * @property {string} id
 * @property {{ opening: string, closing: string, marked: string }} title
 *   The headline in three parts; `marked` gets the highlighter stroke.
 * @property {string} lead
 */

/**
 * The opening of the page: the promise as the page's only h1, then the live
 * demo, passed in as children so this section stays layout only.
 *
 * @param {{ content: HeroContent, children?: import('react').ReactNode }} props
 */
export default function Hero({ content, children }) {
  const titleId = `${content.id}-title`;

  return (
    <section id={content.id} className={styles.hero} aria-labelledby={titleId}>
      <Container>
        <h1 id={titleId} className={styles.title}>
          <span className={styles.line}>{content.title.opening}</span>{' '}
          <span className={styles.line}>
            {content.title.closing} <mark className={styles.marked}>{content.title.marked}</mark>
          </span>
        </h1>
        <p className={styles.lead}>{content.lead}</p>
        {children}
      </Container>
    </section>
  );
}
