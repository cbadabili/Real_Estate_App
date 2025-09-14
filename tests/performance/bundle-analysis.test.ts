
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

describe('Bundle Analysis and Size Tests', () => {
  const distPath = join(process.cwd(), 'dist/public');
  
  it('should have reasonable bundle sizes', () => {
    const indexHtml = join(distPath, 'index.html');
    
    if (!existsSync(indexHtml)) {
      console.warn('Build not found. Run `npm run build` first.');
      return;
    }

    const htmlContent = readFileSync(indexHtml, 'utf-8');
    const jsMatches = htmlContent.match(/assets\/index-[a-zA-Z0-9]+\.js/g);
    const cssMatches = htmlContent.match(/assets\/index-[a-zA-Z0-9]+\.css/g);

    if (jsMatches) {
      const jsFile = join(distPath, jsMatches[0]);
      const jsSize = statSync(jsFile).size;
      expect(jsSize).toBeLessThan(3 * 1024 * 1024); // 3MB JS bundle max
    }

    if (cssMatches) {
      const cssFile = join(distPath, cssMatches[0]);
      const cssSize = statSync(cssFile).size;
      expect(cssSize).toBeLessThan(500 * 1024); // 500KB CSS max
    }
  });

  it('should not include development dependencies in production bundle', () => {
    const packageJson = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf-8')
    );

    const devDependencies = Object.keys(packageJson.devDependencies || {});
    const productionBundle = existsSync(join(distPath, 'assets'))
      ? readFileSync(join(distPath, 'index.html'), 'utf-8')
      : '';

    // Check that dev-only packages aren't in the bundle
    const devOnlyPackages = ['@types/', 'vitest', 'typescript', 'eslint'];
    
    devOnlyPackages.forEach(pkg => {
      expect(productionBundle).not.toContain(pkg);
    });
  });

  it('should have proper code splitting for heavy components', () => {
    if (!existsSync(distPath)) return;

    const assetsDir = join(distPath, 'assets');
    if (!existsSync(assetsDir)) return;

    const files = require('fs').readdirSync(assetsDir);
    const jsFiles = files.filter((f: string) => f.endsWith('.js'));

    // Should have multiple JS chunks for code splitting
    expect(jsFiles.length).toBeGreaterThan(1);

    // Main bundle should be reasonably sized
    const mainBundle = jsFiles.find((f: string) => f.includes('index-'));
    if (mainBundle) {
      const size = statSync(join(assetsDir, mainBundle)).size;
      expect(size).toBeLessThan(2 * 1024 * 1024); // 2MB main bundle
    }
  });
});
