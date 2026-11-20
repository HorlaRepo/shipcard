# Progress

Updated at the end of every session. Read it at the start of the next one, after `BRIEF.md`.

## Phases

| Phase | Scope                                       | Status      |
| ----- | ------------------------------------------- | ----------- |
| 0     | Foundation: toolchain, CI, decision records | Done        |
| 1     | Design direction: `DESIGN.md`, tokens       | Done        |
| 2     | Layout and static sections                  | Not started |
| 3     | Proof-card feature                          | Not started |
| 4     | Interactions and theme                      | Not started |
| 5     | Audits and polish                           | Not started |
| 6     | Docs and delivery                           | Not started |

## Done

- Phase 0: Vite + React scaffold; ESLint, Prettier, `checkJs`, Husky, Vitest, MSW, knip, size-limit; CI workflow; ADRs 0001–0013; six skills installed. `npm run check` passes.
- Phase 1: `docs/DESIGN.md` (the waybill world, chosen from seven recorded candidates); `tokens.css`, `reset.css`, `global.css`; Archivo and IBM Plex Mono self-hosted and subset (40 KB together); a test that enforces the documented contrast ratios in both themes.

## In progress

Nothing.

## Next

- Phase 2: `content/site.js` with all copy; `ui/` and `layout/` components; the six sections, static, responsive from 320 px; the waitlist form and its Worker endpoint.

## Open issues

- React and React DOM alone are 68 KB gzipped, so application code has about 32 KB of the 100 KB budget.

## Blockers

None.
