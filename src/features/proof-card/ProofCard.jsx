import Icon from '../../components/ui/Icon.jsx';
import VisuallyHidden from '../../components/ui/VisuallyHidden.jsx';
import { fillTemplate } from '../../lib/format.js';
import Barcode from './Barcode.jsx';
import CardFrame from './CardFrame.jsx';
import LanguageBar from './LanguageBar.jsx';
import { AVATAR_SIZE } from './mapProfile.js';
import styles from './ProofCard.module.css';

/**
 * @typedef {object} CardContent
 * @property {string} kind
 * @property {{ repos: string, stars: string, age: string, languages: string, topRepos: string, lastShipped: string }} captions
 * @property {Record<'year' | 'month' | 'day', string>} ageUnits Templates such as "{value} yr".
 * @property {string} starsSuffix
 * @property {string} noLanguages
 * @property {string} noRepos
 * @property {string} neverShipped
 * @property {string} countingRule
 * @property {string} partialRule
 * @property {string} snapshot
 * @property {string} profileLink
 */

/**
 * The proof-of-work card: a developer's public record, laid out as a waybill.
 *
 * @param {object} props
 * @param {import('./mapProfile.js').ProfileViewModel} props.profile
 * @param {string} props.productName
 * @param {CardContent} props.content
 */
export default function ProofCard({ profile, productName, content }) {
  const figures = [
    { caption: content.captions.repos, value: profile.publicRepoLabel },
    { caption: content.captions.stars, value: profile.starLabel },
    {
      caption: content.captions.age,
      value: fillTemplate(content.ageUnits[profile.accountAge.unit], {
        value: profile.accountAge.value,
      }),
    },
  ];

  return (
    <CardFrame
      isArriving
      productName={productName}
      kind={
        profile.snapshotDateLabel
          ? fillTemplate(content.snapshot, { date: profile.snapshotDateLabel })
          : content.kind
      }
    >
      <article className={styles.card} aria-labelledby="proof-card-name">
        <header className={styles.identity}>
          {profile.avatarUrl ? (
            <img
              className={styles.avatar}
              src={profile.avatarUrl}
              alt=""
              width={AVATAR_SIZE}
              height={AVATAR_SIZE}
              decoding="async"
            />
          ) : (
            <span className={styles.avatar} aria-hidden="true" />
          )}
          <div className={styles.who}>
            <h2 id="proof-card-name" className={styles.name}>
              {profile.name}
            </h2>
            <p className={styles.handle}>
              <a
                href={profile.profileUrl}
                rel="noopener noreferrer"
                aria-label={fillTemplate(content.profileLink, { login: profile.login })}
              >
                @{profile.login}
              </a>
            </p>
          </div>
        </header>

        <dl className={styles.figures}>
          {figures.map((figure) => (
            <div key={figure.caption} className={styles.figure}>
              <dt className={styles.caption}>{figure.caption}</dt>
              <dd className={styles.value}>{figure.value}</dd>
            </div>
          ))}
        </dl>

        <section className={styles.block} aria-labelledby="proof-card-languages">
          <h3 id="proof-card-languages" className={styles.caption}>
            {content.captions.languages}
          </h3>
          {profile.languages.length > 0 ? (
            <LanguageBar languages={profile.languages} />
          ) : (
            <p className={styles.none}>{content.noLanguages}</p>
          )}
        </section>

        <section className={styles.block} aria-labelledby="proof-card-repos">
          <h3 id="proof-card-repos" className={styles.caption}>
            {content.captions.topRepos}
          </h3>
          {profile.topRepos.length > 0 ? (
            <ol className={styles.repos}>
              {profile.topRepos.map((repo) => (
                <li key={repo.name} className={styles.repo}>
                  <a className={styles.repoName} href={repo.url} rel="noopener noreferrer">
                    {repo.name}
                  </a>
                  <span className={styles.stars}>
                    <Icon name="star" />
                    {repo.starLabel}
                    <VisuallyHidden> {content.starsSuffix}</VisuallyHidden>
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className={styles.none}>{content.noRepos}</p>
          )}
        </section>

        <footer className={styles.footer}>
          <p className={styles.shipped}>
            <span className={styles.caption}>{content.captions.lastShipped}</span>
            <span className={styles.shippedValue}>
              {profile.lastShippedLabel ?? content.neverShipped}
            </span>
          </p>
          <Barcode text={profile.login} />
          <p className={styles.rule}>
            {profile.isPartial ? content.partialRule : content.countingRule}
          </p>
        </footer>
      </article>
    </CardFrame>
  );
}
