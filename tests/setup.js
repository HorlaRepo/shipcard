import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { installMatchMedia, resetMediaQueries } from './helpers/matchMedia.js';
import { server } from './msw/server.js';

installMatchMedia();

// An unplanned request is a test bug: no test may reach the real network.
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
  resetMediaQueries();
  window.sessionStorage.clear();
  window.localStorage.clear();
});

afterAll(() => server.close());
