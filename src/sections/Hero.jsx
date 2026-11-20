import Container from '../components/ui/Container.jsx';
import ProofCardDemo from '../features/proof-card/ProofCardDemo.jsx';
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
 * demo that proves it. The lead paragraph sits above the form, beside the card.
 *
 * @param {object} props
 * @param {HeroContent} props.content
 * @param {import('../features/proof-card/ProofCardDemo.jsx').ProofCardContent} props.demoContent
 */
export default function Hero({ content, demoContent }) {
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
        <ProofCardDemo
          content={demoContent}
          intro={<p className={styles.lead}>{content.lead}</p>}
        />
      </Container>
    </section>
  );
}
