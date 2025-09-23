import path from 'path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';
import { defineConfig } from 'vite';

export default defineConfig(async () => {
  const plugins = [react(), runtimeErrorOverlay()];

  const rootDir = fileURLToPath(new URL('.', import.meta.url));

  if (process.env.NODE_ENV !== 'production' && process.env.REPL_ID !== undefined) {
    const { cartographer } = await import('@replit/vite-plugin-cartographer');
    plugins.push(cartographer());
  }

  return {
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
      allowedHosts: true,
      host: '0.0.0.0',
      port: 5000,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
