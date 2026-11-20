import { useState } from 'react';

import Button from '../components/ui/Button.jsx';
import Icon from '../components/ui/Icon.jsx';
import Section from '../components/ui/Section.jsx';
import SegmentedControl from '../components/ui/SegmentedControl.jsx';
import { fillTemplate, formatPrice } from '../lib/format.js';
import styles from './Pricing.module.css';

const MONTHS_PER_YEAR = 12;

/** @typedef {'monthly' | 'annual'} BillingPeriod */

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
 * @property {{ legend: string, monthly: string, annual: string, annualNote: string, billedMonthly: string, billedAnnually: string, free: string }} billing
 * @property {string} perMonth
 * @property {string} perSeatPerMonth
 * @property {string} recommendedLabel
 * @property {PricingTier[]} tiers
 */

/**
 * Says how a tier is charged for the chosen period.
 *
 * @param {PricingTier} tier
 * @param {BillingPeriod} period
 * @param {PricingContent} content
 * @returns {string}
 */
function describeBilling(tier, period, content) {
  if (tier.monthlyPrice === 0) {
    return content.billing.free;
  }
  if (period === 'monthly') {
    return content.billing.billedMonthly;
  }
  const yearlyTotal = formatPrice(tier.annualMonthlyPrice * MONTHS_PER_YEAR, content.currency);
  return fillTemplate(content.billing.billedAnnually, { total: yearlyTotal });
}

/**
 * The tiers as columns of one rate table, with a monthly or annual view.
 * Only the recommended tier's action is yellow, so the section still has a
 * single marked action.
 *
 * @param {{ content: PricingContent }} props
 */
export default function Pricing({ content }) {
  const [period, setPeriod] = useState(/** @type {BillingPeriod} */ ('monthly'));

  return (
    <Section id={content.id} title={content.title} lead={content.lead} layout="stacked">
      <SegmentedControl
        legend={content.billing.legend}
        value={period}
        onChange={setPeriod}
        options={[
          { value: 'monthly', label: content.billing.monthly },
          { value: 'annual', label: content.billing.annual, note: content.billing.annualNote },
        ]}
      />

      <ul className={styles.table}>
        {content.tiers.map((tier) => (
          <li key={tier.id} className={styles.tier}>
            <h3 className={styles.name}>{tier.name}</h3>
            <p className={styles.summary}>{tier.summary}</p>

            <p className={styles.price}>
              <span className={styles.amount}>
                {formatPrice(
                  period === 'annual' ? tier.annualMonthlyPrice : tier.monthlyPrice,
                  content.currency,
                )}
              </span>{' '}
              <span className={styles.period}>
                {tier.isPerSeat ? content.perSeatPerMonth : content.perMonth}
              </span>
            </p>
            <p className={styles.billing}>{describeBilling(tier, period, content)}</p>

            <ul className={styles.features}>
              {tier.features.map((feature) => (
                <li key={feature} className={styles.feature}>
                  <Icon name="check" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className={styles.action}>
              {tier.isRecommended ? (
                <p className={styles.recommended}>{content.recommendedLabel}</p>
              ) : null}
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
