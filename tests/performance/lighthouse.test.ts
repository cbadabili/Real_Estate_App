
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import puppeteer, { Browser, Page } from 'puppeteer';
import lighthouse from 'lighthouse';

describe('Lighthouse Performance Tests', () => {
  let browser: Browser;
  let page: Page;
  const baseUrl = 'http://0.0.0.0:5000';

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should meet performance thresholds for homepage', async () => {
    const url = `${baseUrl}/`;
    const { lhr } = await lighthouse(url, {
      port: 9222,
      onlyCategories: ['performance'],
      settings: { throttlingMethod: 'simulate3G' }
    });

    const performance = lhr.categories.performance.score! * 100;
    const fcp = lhr.audits['first-contentful-paint'].numericValue!;
    const lcp = lhr.audits['largest-contentful-paint'].numericValue!;
    const tti = lhr.audits['interactive'].numericValue!;

    expect(performance).toBeGreaterThan(70);
    expect(fcp).toBeLessThan(3000); // 3 seconds
    expect(lcp).toBeLessThan(4000); // 4 seconds
    expect(tti).toBeLessThan(5000); // 5 seconds
  });

  it('should meet performance thresholds for properties page', async () => {
    const url = `${baseUrl}/properties`;
    const { lhr } = await lighthouse(url, {
      port: 9222,
      onlyCategories: ['performance'],
      settings: { throttlingMethod: 'simulate3G' }
    });

    const performance = lhr.categories.performance.score! * 100;
    const fcp = lhr.audits['first-contentful-paint'].numericValue!;
    const lcp = lhr.audits['largest-contentful-paint'].numericValue!;

    expect(performance).toBeGreaterThan(65);
    expect(fcp).toBeLessThan(3500);
    expect(lcp).toBeLessThan(4500);
  });

  it('should meet performance thresholds for map search page', async () => {
    const url = `${baseUrl}/search/map`;
    const { lhr } = await lighthouse(url, {
      port: 9222,
      onlyCategories: ['performance'],
      settings: { throttlingMethod: 'simulate3G' }
    });

    const performance = lhr.categories.performance.score! * 100;
    const bundleSize = lhr.audits['total-byte-weight'].numericValue!;

    expect(performance).toBeGreaterThan(60); // Maps are heavier
    expect(bundleSize).toBeLessThan(3000000); // 3MB total
  });
});
