# Decisions

Every decision in this project is recorded here, with its reason and the alternatives that lost. [ADR 0001](0001-record-decisions-as-adrs-and-a-log.md) explains the system.

- **Decision records (ADRs)** cover anything structural or hard to reverse. One file each, numbered in order.
- **The decision log** below covers small, local choices. One row each.

Accepted decisions are reopened only with new evidence. A replaced decision is marked `Superseded by NNNN` and stays in the index.

## Decision records

| ADR | Decision | Status |
| --- | --- | --- |
| [0001](0001-record-decisions-as-adrs-and-a-log.md) | Record decisions as ADRs plus a decision log | Accepted |
| [0002](0002-vite-and-react.md) | Vite and React, on Node LTS, with versions pinned by the lockfile | Accepted |
| [0003](0003-javascript-with-jsdoc-types.md) | JavaScript with JSDoc types, checked by `tsc --noEmit` | Accepted |
| [0004](0004-css-modules-and-design-tokens.md) | CSS Modules with design tokens as CSS custom properties | Accepted |
| [0005](0005-state-reducer-context-and-url.md) | State: a reducer for the demo, context for the theme, the URL for the username | Accepted |
| [0006](0006-unauthenticated-github-rest-api.md) | GitHub REST API, unauthenticated, two requests per lookup | Accepted |
| [0007](0007-motion-with-css-and-intersection-observer.md) | Motion with CSS transitions and IntersectionObserver | Accepted |
| [0008](0008-waitlist-submits-to-a-form-provider.md) | Waitlist submits to a hosted form provider behind `submitWaitlist()` | Superseded by 0013 |
| [0009](0009-vitest-testing-library-and-msw.md) | Vitest, React Testing Library and MSW | Accepted |
| [0010](0010-deploy-to-vercel-or-netlify.md) | Deploy to Vercel or Netlify with security headers in config | Superseded by 0012 |
| [0011](0011-skill-set-with-one-design-authority.md) | A fixed skill set, with Impeccable as the single design authority | Accepted |
| [0012](0012-host-on-cloudflare-workers.md) | Host on Cloudflare Workers with static assets | Accepted |
| [0013](0013-waitlist-endpoint-on-a-worker.md) | Waitlist endpoint on a Cloudflare Worker with KV storage | Accepted |

## Decision log

| # | Date | Decision | Why | Alternatives rejected |
| --- | --- | --- | --- | --- |
| L-01 | 2026-11-20 | Use Impeccable's reference files directly; do not run its `scripts/impeccable` launcher | The launcher downloads and executes a prebuilt binary on first run. The skill documents a launcher-free path, and the guidance itself is in Markdown | Running the launcher (unreviewed binary with full local permissions, for context loading that reading two files replaces) |
| L-02 | 2026-11-20 | Install skills with `--copy` for one agent directory (`.claude/skills/`) | Real files travel with the repository and show up in review; the lockfile pins each to a commit and hash | Symlinks into `.agents/skills/` (two directories for one set of files); global install (does not travel with the repo, against the brief) |
