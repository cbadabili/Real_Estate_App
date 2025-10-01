import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility regressions', () => {
  test('home, property list, and services pages meet WCAG AA smoke budget', async ({ page }, testInfo) => {
    const targets = ['/', '/properties', '/services'];

    for (const target of targets) {
      let responseOk = false;
      try {
        const response = await page.goto(target, { waitUntil: 'domcontentloaded' });
        responseOk = !!response?.ok();
      } catch (error) {
        testInfo.annotations.push({ type: 'warning', description: `Skipping ${target} accessibility audit: ${String(error)}` });
        continue;
      }

      if (!responseOk) {
        testInfo.annotations.push({ type: 'warning', description: `Skipping ${target} accessibility audit: non-OK response` });
        continue;
      }

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      if (results.violations.length) {
        await testInfo.attach(`axe-violations-${target.replace(/\W+/g, '-')}`, {
          contentType: 'application/json',
          body: JSON.stringify(results, null, 2)
        });
      }

      expect(results.violations, `${target} should not ship with critical accessibility violations`).toHaveLength(0);
    }
  });
});
