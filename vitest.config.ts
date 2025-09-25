
import { defineConfig } from 'vitest/config';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: true,
    passWithNoTests: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'tests/backend/**',
      'tests/integration/**',
      'tests/performance/**',
      'tests/e2e/**',
      'tests/contract/**',
      'tests/frontend/**',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@server': path.resolve(__dirname, './server'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
});
