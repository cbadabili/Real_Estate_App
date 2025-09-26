#!/usr/bin/env node
import { execSync } from 'node:child_process';
import process from 'node:process';

const SKIP_ENV = process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD;
const isProductionInstall = process.env.npm_config_production === 'true';
const shouldSkip =
  isProductionInstall ||
  (typeof SKIP_ENV === 'string' && ['1', 'true', 'yes'].includes(SKIP_ENV.toLowerCase()));

if (shouldSkip) {
  const reason = isProductionInstall
    ? 'npm_config_production is true'
    : 'PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD is set';
  process.stdout.write(`Skipping Playwright browser installation because ${reason}.\n`);
  process.exit(0);
}

const baseCommand = 'npx playwright install';
const withDepsCommand = `${baseCommand} --with-deps`;

const hasCommand = (cmd) => {
  try {
    execSync(`command -v ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

const runCommand = (cmd) => {
  process.stdout.write(`Running: ${cmd}\n`);
  execSync(cmd, { stdio: 'inherit', env: process.env });
};

const supportsSystemDeps = process.platform === 'linux' && hasCommand('apt-get');

try {
  if (supportsSystemDeps) {
    runCommand(withDepsCommand);
  } else {
    runCommand(baseCommand);
  }
} catch (error) {
  if (supportsSystemDeps) {
    process.stderr.write('Playwright installation with system dependencies failed. Falling back to browser-only installation.\n');
    runCommand(baseCommand);
  } else {
    throw error;
  }
}
