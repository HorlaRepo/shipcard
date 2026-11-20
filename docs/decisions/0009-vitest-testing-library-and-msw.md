# 0009. Vitest, React Testing Library and MSW

- Status: Accepted
- Date: 2026-11-20

## Context

The behaviour worth testing is mostly at boundaries: a pure mapper, an HTTP client with six failure modes, a hook that cancels and caches, and components whose value is what a user or screen reader perceives. Tests must not touch the network and must run in well under 30 seconds.

## Decision

Vitest runs the suite in jsdom. Components and hooks are tested with React Testing Library and `user-event`, queried by role and accessible name. Network calls are intercepted by MSW, with handlers and fixtures in `tests/`.

## Why

- Vitest reads the Vite config, so JSX, CSS Modules and aliases behave in tests as they do in the build, with no second transform pipeline to configure.
- Testing Library's role queries fail when the accessible name or role is wrong, so the tests check accessibility as a side effect of checking behaviour.
- MSW intercepts at the network layer, so the real `fetch` call, headers, status handling and abort logic all execute. A test that passes means the client works, not that a stub was called.
- Fixtures are trimmed real GitHub responses, so the mapper is tested against the API's actual shape.

## Alternatives considered

### Jest

The long-standing default runner. Rejected because it needs its own transform setup for ESM, JSX and CSS Modules alongside Vite's, which is duplicate configuration that can drift from the build.

### Mocking `fetch` by hand

Replace `globalThis.fetch` with a stub per test. Rejected because the stub must reimplement `Response`, headers and abort behaviour, so the tests end up asserting on the mock; errors in how the client builds requests go unseen.

### End-to-end tests only (Playwright)

Drive a real browser against the built page. Rejected as the main suite because every error state would need network interception anyway, runs are slower, and failures localise poorly. A browser is still used for the Lighthouse and visual checks.

## Consequences

- Positive: one config, fast runs, tests that exercise real client code and accessible names.
- Negative / trade-offs: jsdom is not a browser: no layout, no real focus rings, no CSS, so visual styling and motion are checked by eye and by Lighthouse, not by this suite.
- Revisit if: bugs appear that only a real browser shows (layout, focus order across the page); add a small Playwright smoke suite.
