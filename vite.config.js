import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  css: {
    // Lightning CSS compiles the @custom-media breakpoints in tokens.css.
    transformer: 'lightningcss',
    lightningcss: { drafts: { customMedia: true } },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/**/*.test.{js,jsx}', 'src/main.jsx'],
      reporter: ['text-summary', 'html'],
    },
  },
});
