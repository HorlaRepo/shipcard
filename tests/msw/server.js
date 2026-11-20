import { setupServer } from 'msw/node';

/**
 * One MSW server for the whole suite. It starts with no handlers: each test
 * registers the responses it needs with `server.use()`, and any request a test
 * did not plan for fails that test (see tests/setup.js).
 */
export const server = setupServer();
