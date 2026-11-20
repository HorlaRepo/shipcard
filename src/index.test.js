import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

import { describe, expect, test } from 'vitest';

import { pricing, site } from './content/site.js';

// Read from disk, relative to the project root, where Vitest runs.
const html = readFileSync('index.html', 'utf8');
const headers = readFileSync('public/_headers', 'utf8');
const page = new DOMParser().parseFromString(html, 'text/html');

/** @param {string} selector */
const content = (selector) => page.querySelector(selector)?.getAttribute('content') ?? '';

describe('security headers', () => {
  test('the Content-Security-Policy allows the inline theme script by its current hash', () => {
    const inlineScripts = [...page.querySelectorAll('script:not([src]):not([type])')];
    expect(inlineScripts).toHaveLength(1);

    const hash = createHash('sha256')
      .update(inlineScripts[0]?.textContent ?? '')
      .digest('base64');

    expect(headers).toContain(`'sha256-${hash}'`);
  });

  test('the policy never allows inline or evaluated code wholesale', () => {
    expect(headers).not.toMatch(/unsafe-inline|unsafe-eval/);
  });

  test('the inline script reads the same storage key as the theme provider', () => {
    expect(html).toContain("localStorage.getItem('shipcard:theme')");
  });
});

describe('metadata', () => {
  const canonical = page.querySelector('link[rel="canonical"]')?.getAttribute('href');

  test('the title is 50 to 60 characters and the description 140 to 160', () => {
    expect(page.title.length).toBeGreaterThanOrEqual(50);
    expect(page.title.length).toBeLessThanOrEqual(60);
    expect(content('meta[name="description"]').length).toBeGreaterThanOrEqual(140);
    expect(content('meta[name="description"]').length).toBeLessThanOrEqual(160);
  });

  test('the title, description, canonical and Open Graph tags agree', () => {
    expect(content('meta[property="og:title"]')).toBe(page.title);
    expect(content('meta[property="og:description"]')).toBe(content('meta[name="description"]'));
    expect(content('meta[property="og:url"]')).toBe(canonical);
    expect(content('meta[property="og:image"]')).toBe(`${canonical}og-image.png`);
  });

  test('robots.txt and the sitemap point at the canonical address', () => {
    expect(readFileSync('public/robots.txt', 'utf8')).toContain(`Sitemap: ${canonical}sitemap.xml`);
    expect(readFileSync('public/sitemap.xml', 'utf8')).toContain(`<loc>${canonical}</loc>`);
  });

  test('the document declares its language and names the product', () => {
    expect(page.documentElement.lang).toBe('en');
    expect(page.title).toContain(site.name);
  });

  test('the structured data offers match the pricing on the page', () => {
    const data = JSON.parse(
      page.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
    );

    expect(data['@type']).toBe('SoftwareApplication');
    expect(data.name).toBe(site.name);
    expect(data.url).toBe(canonical);
    expect(
      data.offers.map((/** @type {Record<string, string>} */ offer) => ({
        name: offer.name,
        price: offer.price,
        currency: offer.priceCurrency,
      })),
    ).toEqual(
      pricing.tiers.map((tier) => ({
        name: tier.name,
        price: String(tier.monthlyPrice),
        currency: pricing.currency,
      })),
    );
  });
});
