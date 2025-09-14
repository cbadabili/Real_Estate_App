
import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync } from 'fs';
import path from 'path';

describe('Environment & Build Verification', () => {
  it('should have all required configuration files', () => {
    const requiredFiles = [
      'package.json',
      'tsconfig.json',
      'vite.config.ts',
      'tailwind.config.js',
      '.env.example'
    ];

    requiredFiles.forEach(file => {
      expect(existsSync(file)).toBe(true);
    });
  });

  it('should have required environment variables documented', () => {
    const envExample = existsSync('.env.example');
    expect(envExample).toBe(true);
  });

  it('should have proper directory structure', () => {
    const requiredDirs = [
      'client/src',
      'server',
      'shared',
      'migrations'
    ];

    requiredDirs.forEach(dir => {
      expect(existsSync(dir)).toBe(true);
    });
  });

  it('should have database schema files', () => {
    expect(existsSync('shared/schema.ts')).toBe(true);
    expect(existsSync('server/db.ts')).toBe(true);
  });
});
