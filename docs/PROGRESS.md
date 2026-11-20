# Progress

Updated at the end of every session. Read it at the start of the next one, after `BRIEF.md`.

## Phases

| Phase | Scope                                       | Status      |
| ----- | ------------------------------------------- | ----------- |
| 0     | Foundation: toolchain, CI, decision records | Done        |
| 1     | Design direction: `DESIGN.md`, tokens       | Done        |
| 2     | Layout and static sections                  | Done        |
| 3     | Proof-card feature                          | Done        |
| 4     | Interactions and theme                      | Not started |
| 5     | Audits and polish                           | Not started |
| 6     | Docs and delivery                           | Not started |

## Done

- Phase 0: Vite + React scaffold; ESLint, Prettier, `checkJs`, Husky, Vitest, MSW, knip, size-limit; CI workflow; ADRs 0001–0013; six skills installed. `npm run check` passes.
- Phase 1: `docs/DESIGN.md` (the waybill world, chosen from seven recorded candidates); `tokens.css`, `reset.css`, `global.css`; Archivo and IBM Plex Mono self-hosted and subset (40 KB together); a test that enforces the documented contrast ratios in both themes.
- Phase 2: all copy in `content/site.js`; `ui/` (Container, Section, Button, Icon) and `layout/` (Header, MobileNav, SkipLink, Footer); Hero, How it works, Features, Pricing, FAQ and Waitlist sections. Checked at 320, 390, 768 and 1280 px with no horizontal scroll. Mobile menu keyboard behaviour and page structure are tested.
- Phase 3: the proof-card feature. `lib/http` (timeout, cancellation, transport errors), `lib/cache`, `githubClient` (two parallel unauthenticated requests, every failure mapped to a typed error), `mapProfile`, the `useGithubProfile` state machine, the form, the card and its empty, loading and error states, three lazy-loaded example snapshots, `?u=` deep links, copy link, and an error boundary. 189 tests. The result region measures 716 px in every state at 390 and 1280 px, so nothing shifts.

## In progress

Nothing.

## Next

- The waitlist form and its Worker endpoint (ADR 0013), with the Cloudflare config, as its own pull request.
- Phase 4: theme provider and no-flash script, pricing toggle, FAQ disclosure, header shrink, scroll reveals, card reveal, guided by emil-design-eng.

## Open issues

- First-load JavaScript is 81 KB gzipped of the 100 KB budget (React and React DOM are 68 KB of that).
- The dark theme's tokens exist but nothing sets `data-theme` until Phase 4.
- Totals are computed from the 100 most recently pushed repositories (ADR 0006); the card says so when an account has more.

## Blockers

None.
