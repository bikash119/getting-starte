import { defineConfig } from 'vitest/config';
import path from 'path';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsConfigPaths(),
  ],
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './app'),
      'api': path.resolve(__dirname, './api'),
    },
  },
});