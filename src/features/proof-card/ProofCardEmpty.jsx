import CardFrame from './CardFrame.jsx';
import cardStyles from './ProofCard.module.css';
import styles from './ProofCardEmpty.module.css';

/**
 * The card before any lookup: the same label with its captions printed and
 * its fields still blank. It shares the filled card's styles, so the two have
 * the same geometry.
 *
 * @param {object} props
 * @param {string} props.productName
 * @param {string} props.kind
 * @param {{ title: string, body: string }} props.content
 * @param {import('./ProofCard.jsx').CardContent['captions']} props.captions
 */
export default function ProofCardEmpty({ productName, kind, content, captions }) {
  return (
    <CardFrame productName={productName} kind={kind}>
      <div className={cardStyles.card}>
        <div className={cardStyles.identity}>
          <span className={cardStyles.avatar} aria-hidden="true" />
          <div className={cardStyles.who}>
            <p className={styles.title}>{content.title}</p>
            <p className={styles.body}>{content.body}</p>
          </div>
        </div>

        <div aria-hidden="true" className={styles.fields}>
          <div className={cardStyles.figures}>
            {[captions.repos, captions.stars, captions.age].map((caption) => (
              <div key={caption} className={cardStyles.figure}>
                <span className={cardStyles.caption}>{caption}</span>
                <span className={styles.blankValue} />
              </div>
            ))}
          </div>
          {[captions.languages, captions.topRepos].map((caption) => (
            <div key={caption} className={cardStyles.block}>
              <span className={cardStyles.caption}>{caption}</span>
              <span className={styles.blankLine} />
            </div>
          ))}
          <div className={cardStyles.footer}>
            <span className={cardStyles.caption}>{captions.lastShipped}</span>
            <span className={styles.blankLine} />
          </div>
        </div>
      </div>
    </CardFrame>
  );
}
