import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:5000';
const parsedBaseURL = new URL(baseURL);
const derivedPort = parsedBaseURL.port || (parsedBaseURL.protocol === 'https:' ? '443' : '80');
const healthURL =
  process.env.PLAYWRIGHT_HEALTH_URL ?? `${parsedBaseURL.origin}/health`;

const viewports = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 }
} as const;

export default defineConfig({
  testDir: 'tests/playwright',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL,
    actionTimeout: 20_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium-mobile',
      use: { ...devices['Pixel 5'], viewport: viewports.mobile }
    },
    {
      name: 'chromium-tablet',
      use: { ...devices['Galaxy Tab S4'], browserName: 'chromium' }
    },
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], viewport: viewports.desktop }
    },
    {
      name: 'firefox-mobile',
      use: { ...devices['Pixel 5'], browserName: 'firefox' }
    },
    {
      name: 'firefox-tablet',
      use: { ...devices['iPad (gen 7)'], browserName: 'firefox' }
    },
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'], viewport: viewports.desktop }
    },
    {
      name: 'webkit-mobile',
      use: { ...devices['iPhone 12'], viewport: viewports.mobile }
    },
    {
      name: 'webkit-tablet',
      use: { ...devices['iPad (gen 7)'], browserName: 'webkit' }
    },
    {
      name: 'webkit-desktop',
      use: { ...devices['Desktop Safari'], viewport: viewports.desktop }
    }
  ],
  metadata: {
    project: 'BeeDab',
    product: 'Real Estate Platform'
  },
  webServer: {
    command: 'npm run start',
    url: healthURL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    env: {
      PORT: derivedPort,
      BOOT_RUN_MIGRATIONS: 'false',
      E2E: 'true'
    }
  }
});
