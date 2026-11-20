import Container from './Container.jsx';
import styles from './Section.module.css';

/**
 * @typedef {object} SectionProps
 * @property {string} id Anchor target; also names the section for assistive technology.
 * @property {string} title
 * @property {string} [lead] A sentence of context under the title.
 * @property {'split' | 'stacked'} [layout] Split sets the title beside the content on wide screens.
 * @property {import('react').ReactNode} children
 */

/**
 * A page section: a full-width rule, a title in the display voice and the
 * content. Every section below the hero uses it, so their rhythm is identical.
 *
 * @param {SectionProps} props
 */
export default function Section({ id, title, lead, layout = 'split', children }) {
  const titleId = `${id}-title`;

  return (
    <section id={id} className={styles.section} aria-labelledby={titleId}>
      <Container>
        <div className={`${styles.inner} ${styles[layout]}`}>
          <header className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            {lead === undefined ? null : <p className={styles.lead}>{lead}</p>}
          </header>
          <div className={styles.content}>{children}</div>
        </div>
      </Container>
    </section>
  );
}
