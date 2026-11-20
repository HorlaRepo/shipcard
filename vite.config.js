import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  server: {
    // The API is the Worker; `npm run dev:api` serves it on wrangler's port.
    proxy: { '/api': 'http://localhost:8787' },
  },
  css: {
    // Lightning CSS compiles the @custom-media breakpoints in tokens.css.
    transformer: 'lightningcss',
    lightningcss: { drafts: { customMedia: true } },
  },
  test: {
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}', 'worker/**/*.js'],
      exclude: ['**/*.test.{js,jsx}', 'src/main.jsx'],
      reporter: ['text-summary', 'html'],
    },
    // Two environments: the page runs in a simulated browser, the Worker in
    // plain Node, where browser globals do not exist.
    projects: [
      {
        extends: true,
        test: {
          name: 'page',
          environment: 'jsdom',
          setupFiles: ['./tests/setup.js'],
          include: ['src/**/*.test.{js,jsx}'],
        },
      },
      {
        extends: true,
        test: {
          name: 'worker',
          environment: 'node',
          include: ['worker/**/*.test.js'],
        },
      },
    ],
  },
});
