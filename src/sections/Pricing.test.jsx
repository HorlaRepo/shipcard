import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { pricing } from '../content/site.js';
import Pricing from './Pricing.jsx';

function renderPricing() {
  render(<Pricing content={pricing} />);
  const group = screen.getByRole('group', { name: pricing.billing.legend });
  return {
    user: userEvent.setup(),
    monthly: within(group).getByRole('radio', { name: pricing.billing.monthly }),
    annual: within(group).getByRole('radio', { name: new RegExp(`^${pricing.billing.annual}`) }),
    /** @param {string} name */
    tier: (name) =>
      /** @type {HTMLElement} */ (screen.getByRole('heading', { level: 3, name }).closest('li')),
  };
}

test('shows monthly prices first', () => {
  const { monthly, tier } = renderPricing();

  expect(monthly).toBeChecked();
  expect(within(tier('Free')).getByText('$0')).toBeVisible();
  expect(within(tier('Pro')).getByText('$8')).toBeVisible();
  expect(within(tier('Team')).getByText('$20')).toBeVisible();
  expect(within(tier('Pro')).getByText(pricing.billing.billedMonthly)).toBeVisible();
});

test('choosing annual updates every paid price and says what is billed', async () => {
  const { user, annual, tier } = renderPricing();

  await user.click(annual);

  expect(annual).toBeChecked();
  expect(within(tier('Pro')).getByText('$6')).toBeVisible();
  expect(within(tier('Pro')).getByText('Billed as $72 once a year')).toBeVisible();
  expect(within(tier('Team')).getByText('$15')).toBeVisible();
  expect(within(tier('Team')).getByText('Billed as $180 once a year')).toBeVisible();
});

test('the free tier is free in both periods', async () => {
  const { user, annual, tier } = renderPricing();

  await user.click(annual);

  expect(within(tier('Free')).getByText('$0')).toBeVisible();
  expect(within(tier('Free')).getByText(pricing.billing.free)).toBeVisible();
});

test('the arrow keys move the selection, as in any radio group', async () => {
  const { user, monthly, annual } = renderPricing();

  monthly.focus();
  await user.keyboard('{ArrowRight}');
  expect(annual).toBeChecked();

  await user.keyboard('{ArrowLeft}');
  expect(monthly).toBeChecked();
});

test('the annual saving in the copy matches the prices', () => {
  const percent = Number(/\d+/.exec(pricing.billing.annualNote)?.[0]);

  for (const tier of pricing.tiers.filter((candidate) => candidate.monthlyPrice > 0)) {
    expect(tier.annualMonthlyPrice, tier.name).toBe(tier.monthlyPrice * (1 - percent / 100));
  }
});
