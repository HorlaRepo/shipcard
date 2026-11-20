# Progress

Updated at the end of every session. Read it at the start of the next one, after `BRIEF.md`.

## Phases

| Phase | Scope                                       | Status      |
| ----- | ------------------------------------------- | ----------- |
| 0     | Foundation: toolchain, CI, decision records | Done        |
| 1     | Design direction: `DESIGN.md`, tokens       | Done        |
| 2     | Layout and static sections                  | Done        |
| 3     | Proof-card feature                          | Done        |
| 4     | Interactions and theme                      | Done        |
| 5     | Audits and polish                           | Not started |
| 6     | Docs and delivery                           | Not started |

## Done

- Phase 0: Vite + React scaffold; ESLint, Prettier, `checkJs`, Husky, Vitest, MSW, knip, size-limit; CI workflow; ADRs 0001–0013; six skills installed. `npm run check` passes.
- Phase 1: `docs/DESIGN.md` (the waybill world, chosen from seven recorded candidates); `tokens.css`, `reset.css`, `global.css`; Archivo and IBM Plex Mono self-hosted and subset (40 KB together); a test that enforces the documented contrast ratios in both themes.
- Phase 2: all copy in `content/site.js`; `ui/` (Container, Section, Button, Icon) and `layout/` (Header, MobileNav, SkipLink, Footer); Hero, How it works, Features, Pricing, FAQ and Waitlist sections. Checked at 320, 390, 768 and 1280 px with no horizontal scroll. Mobile menu keyboard behaviour and page structure are tested.
- Phase 3: the proof-card feature. `lib/http` (timeout, cancellation, transport errors), `lib/cache`, `githubClient` (two parallel unauthenticated requests, every failure mapped to a typed error), `mapProfile`, the `useGithubProfile` state machine, the form, the card and its empty, loading and error states, three lazy-loaded example snapshots, `?u=` deep links, copy link, and an error boundary. 189 tests. The result region measures 716 px in every state at 390 and 1280 px, so nothing shifts.
- Waitlist: `POST /api/waitlist` on a Cloudflare Worker storing addresses in KV (validated again on the server, same-origin only, honeypot); the form with validation on blur and submit, real submission, announced success and failure states. Checked end to end under `wrangler dev`. 216 tests in two projects (page, worker).
- Phase 4: theme provider with a no-flash inline script and a toggle (system until chosen, then remembered); monthly/annual pricing as a radio group; FAQ disclosure; header scroll state from a sentinel; one staggered scroll reveal; the card's arrival; press and hover states. Every motion has a reduced-motion path and none exceeds 320 ms. 240 tests, including axe in both themes.

## In progress

Nothing.

## Next

- Phase 5: metadata, favicons, Open Graph image, JSON-LD, robots and sitemap; security headers in `public/_headers` with the inline script's hash; first deploy to Cloudflare; then the audits, one at a time, in the brief's order: fixing-accessibility → web-design-guidelines → vercel-react-best-practices → fixing-metadata → Impeccable audit → Impeccable polish. Lighthouse on the deployed URL in both themes.

## Open issues

- First-load JavaScript is 83 KB gzipped of the 100 KB budget (React and React DOM are 68 KB of that).
- Totals are computed from the 100 most recently pushed repositories (ADR 0006); the card says so when an account has more.
- Not yet deployed.
- `favicon.ico` is missing (a 404 in the console) until Phase 5.

## Blockers

None.
