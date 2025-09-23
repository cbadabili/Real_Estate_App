import path from 'path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';
import { defineConfig } from 'vite';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const plugins = [react(), runtimeErrorOverlay()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
      '@shared': path.resolve(rootDir, '../shared'),
      '@assets': path.resolve(rootDir, '../attached_assets'),
    },
  },
  root: rootDir,
  build: {
    outDir: path.resolve(rootDir, '../dist/public'),
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
