# Progress

Updated at the end of every session. Read it at the start of the next one, after `BRIEF.md`.

## Phases

| Phase | Scope                                       | Status      |
| ----- | ------------------------------------------- | ----------- |
| 0     | Foundation: toolchain, CI, decision records | Done        |
| 1     | Design direction: `DESIGN.md`, tokens       | Done        |
| 2     | Layout and static sections                  | Done        |
| 3     | Proof-card feature                          | Not started |
| 4     | Interactions and theme                      | Not started |
| 5     | Audits and polish                           | Not started |
| 6     | Docs and delivery                           | Not started |

## Done

- Phase 0: Vite + React scaffold; ESLint, Prettier, `checkJs`, Husky, Vitest, MSW, knip, size-limit; CI workflow; ADRs 0001–0013; six skills installed. `npm run check` passes.
- Phase 1: `docs/DESIGN.md` (the waybill world, chosen from seven recorded candidates); `tokens.css`, `reset.css`, `global.css`; Archivo and IBM Plex Mono self-hosted and subset (40 KB together); a test that enforces the documented contrast ratios in both themes.
- Phase 2: all copy in `content/site.js`; `ui/` (Container, Section, Button, Icon) and `layout/` (Header, MobileNav, SkipLink, Footer); Hero, How it works, Features, Pricing, FAQ and Waitlist sections. Checked at 320, 390, 768 and 1280 px with no horizontal scroll. Mobile menu keyboard behaviour and page structure are tested.

## In progress

Nothing.

## Next

- Phase 3: the proof-card feature (`lib/http`, errors, `githubClient`, `mapProfile`, cache, `useGithubProfile`, form, card, skeleton, example snapshots, URL state, error boundary) with every test in the brief's table.
- Then the waitlist form and its Worker endpoint, before Phase 4.

## Open issues

- JavaScript is 73 KB gzipped of the 100 KB budget after Phase 2 (React and React DOM are 68 KB of that).
- The pricing toggle and FAQ disclosure are static until Phase 4; the hero's demo slot and the waitlist form slot are empty until their features land.

## Blockers

None.
