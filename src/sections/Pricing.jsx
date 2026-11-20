import Button from '../components/ui/Button.jsx';
import Icon from '../components/ui/Icon.jsx';
import Section from '../components/ui/Section.jsx';
import { formatPrice } from '../lib/format.js';
import styles from './Pricing.module.css';

/**
 * @typedef {object} PricingTier
 * @property {string} id
 * @property {string} name
 * @property {string} summary
 * @property {number} monthlyPrice Price per month when billed monthly.
 * @property {number} annualMonthlyPrice Price per month when billed once a year.
 * @property {boolean} isPerSeat
 * @property {boolean} isRecommended
 * @property {string[]} features
 * @property {{ label: string, href: string }} cta
 */

/**
 * @typedef {object} PricingContent
 * @property {string} id
 * @property {string} title
 * @property {string} lead
 * @property {string} currency
 * @property {string} perMonth
 * @property {string} perSeatPerMonth
 * @property {string} recommendedLabel
 * @property {PricingTier[]} tiers
 */

/**
 * The tiers as columns of one rate table. Only the recommended tier's action
 * is yellow, so the section still has a single marked thing.
 *
 * @param {{ content: PricingContent }} props
 */
export default function Pricing({ content }) {
  return (
    <Section id={content.id} title={content.title} lead={content.lead} layout="stacked">
      <ul className={styles.table}>
        {content.tiers.map((tier) => (
          <li key={tier.id} className={styles.tier}>
            <h3 className={styles.name}>{tier.name}</h3>
            <p className={styles.summary}>{tier.summary}</p>

            <p className={styles.price}>
              <span className={styles.amount}>
                {formatPrice(tier.monthlyPrice, content.currency)}
              </span>{' '}
              <span className={styles.period}>
                {tier.isPerSeat ? content.perSeatPerMonth : content.perMonth}
              </span>
            </p>

            <ul className={styles.features}>
              {tier.features.map((feature) => (
                <li key={feature} className={styles.feature}>
                  <Icon name="check" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className={styles.action}>
              {tier.isRecommended && (
                <p className={styles.recommended}>{content.recommendedLabel}</p>
              )}
              <Button variant={tier.isRecommended ? 'primary' : 'secondary'} href={tier.cta.href}>
                {tier.cta.label}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
