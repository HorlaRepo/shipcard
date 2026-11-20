# Progress

Updated at the end of every session. Read it at the start of the next one, after `BRIEF.md`.

## Phases

| Phase | Scope                                       | Status |
| ----- | ------------------------------------------- | ------ |
| 0     | Foundation: toolchain, CI, decision records | Done   |
| 1     | Design direction: `DESIGN.md`, tokens       | Done   |
| 2     | Layout and static sections                  | Done   |
| 3     | Proof-card feature                          | Done   |
| 4     | Interactions and theme                      | Done   |
| 5     | Audits and polish                           | Done   |
| 6     | Docs and delivery                           | Done   |

## Done

- Phase 0: Vite + React scaffold; ESLint, Prettier, `checkJs`, Husky, Vitest, MSW, knip, size-limit; CI workflow; ADRs 0001–0013; six skills installed. `npm run check` passes.
- Phase 1: `docs/DESIGN.md` (the waybill world, chosen from seven recorded candidates); `tokens.css`, `reset.css`, `global.css`; Archivo and IBM Plex Mono self-hosted and subset (40 KB together); a test that enforces the documented contrast ratios in both themes.
- Phase 2: all copy in `content/site.js`; `ui/` (Container, Section, Button, Icon) and `layout/` (Header, MobileNav, SkipLink, Footer); Hero, How it works, Features, Pricing, FAQ and Waitlist sections. Checked at 320, 390, 768 and 1280 px with no horizontal scroll. Mobile menu keyboard behaviour and page structure are tested.
- Phase 3: the proof-card feature. `lib/http` (timeout, cancellation, transport errors), `lib/cache`, `githubClient` (two parallel unauthenticated requests, every failure mapped to a typed error), `mapProfile`, the `useGithubProfile` state machine, the form, the card and its empty, loading and error states, three lazy-loaded example snapshots, `?u=` deep links, copy link, and an error boundary. 189 tests. The result region measures 716 px in every state at 390 and 1280 px, so nothing shifts.
- Waitlist: `POST /api/waitlist` on a Cloudflare Worker storing addresses in KV (validated again on the server, same-origin only, honeypot); the form with validation on blur and submit, real submission, announced success and failure states. Checked end to end under `wrangler dev`. 216 tests in two projects (page, worker).
- Phase 4: theme provider with a no-flash inline script and a toggle (system until chosen, then remembered); monthly/annual pricing as a radio group; FAQ disclosure; header scroll state from a sentinel; one staggered scroll reveal; the card's arrival; press and hover states. Every motion has a reduced-motion path and none exceeds 320 ms. 240 tests, including axe in both themes.
- Phase 5: metadata, icons, social image, structured data, `robots.txt`, sitemap; security headers with a hashed inline script; first deploy to Cloudflare (https://shipcard.fran64biz.workers.dev); ADR 0014 on prerendering; the six audits below. 249 tests.

## Audit triage (Phase 5)

Audits were run one at a time, in the brief's order, and each was triaged before the next began. "Must" items are fixed; "should" items were fixed when they took under 15 minutes; "won't" items have a decision log row.

| #   | Audit                       | Finding                                                                                                               | Severity       | Action                                                                                                                             |
| --- | --------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1   | fixing-accessibility        | Repository links in the card are 26 px high and as narrow as 18 px; the handle link is 20 px high                     | Must           | Fixed: rows and links are 44 px targets; card height raised to fit (L-46)                                                          |
| 2   | fixing-accessibility        | The username field is not marked required                                                                             | Should         | Fixed: `required` added                                                                                                            |
| 3   | fixing-accessibility        | The quota status region is removed from the accessibility tree while empty, so its first message may not be announced | Should         | Fixed: it stays in the tree                                                                                                        |
| 4   | web-design-guidelines       | Loading labels do not end with an ellipsis                                                                            | Should         | Fixed: "Joining…", "Building the card for @x…"                                                                                     |
| 5   | web-design-guidelines       | No `preconnect` to the two GitHub origins the demo uses                                                               | Should         | Fixed in `index.html`                                                                                                              |
| 6   | web-design-guidelines       | No `touch-action: manipulation`; default tap highlight                                                                | Should         | Fixed in `global.css`                                                                                                              |
| 7   | web-design-guidelines       | The mobile menu lacks `overscroll-behavior: contain`                                                                  | Should         | Fixed                                                                                                                              |
| 8   | web-design-guidelines       | Brand name, handles and repository names are not marked `translate="no"`                                              | Should         | Fixed                                                                                                                              |
| 9   | web-design-guidelines       | A count spelt out in a heading ("three steps")                                                                        | Should         | Fixed: "3 steps"                                                                                                                   |
| 10  | web-design-guidelines       | Buttons and headings are not Title Case                                                                               | Won't          | L-47                                                                                                                               |
| 11  | web-design-guidelines       | Pricing period and FAQ state are not in the URL                                                                       | Won't          | L-48                                                                                                                               |
| 12  | web-design-guidelines       | No safe-area inset padding                                                                                            | Won't          | L-49                                                                                                                               |
| 13  | web-design-guidelines       | No non-breaking spaces between numbers and units                                                                      | Won't          | L-50                                                                                                                               |
| 14  | vercel-react-best-practices | One `&&` conditional render (`Section`); the rule prefers a ternary                                                   | Should         | Fixed                                                                                                                              |
| 15  | vercel-react-best-practices | Server, Next.js and SWR rules                                                                                         | Not applicable | Client-only page (ADR 0002, 0005)                                                                                                  |
| 16  | fixing-metadata             | `theme-color` duplicates token values with nothing keeping them equal                                                 | Should         | Fixed: a test compares them                                                                                                        |
| 17  | fixing-metadata             | Title, description, canonical, Open Graph, icons, structured data                                                     | Pass           | Verified by `src/index.test.js` and on the deployed URL                                                                            |
| 18  | Impeccable audit            | Accessibility, performance, theming, responsive and integrity dimensions                                              | Pass           | No raw colour or pixel values in component CSS; no overflow at 320 px; no layout shift across the card's states; no console errors |
| 19  | Impeccable polish           | The hero's lead paragraph pushed the demo below the first screen on laptops and left the form column half empty       | Should         | Fixed: the lead sits above the form, beside the card                                                                               |
| 20  | Impeccable polish           | Paragraphs could end on a single short word                                                                           | Should         | Fixed: `text-wrap: pretty`                                                                                                         |

- Phase 6: README in the brief's section order with measured scores; demo GIF; licence; final review of the decision records; production deploy.

## In progress

Nothing. The build is complete and handed over for the SwapLearn submission, which Francis makes.

## Definition of done

Checked on 21 November 2026 against the final commit and https://shipcard.fran64biz.workers.dev.

| Item                                                                                               | Result                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check` passes locally and CI is green                                                     | Yes                                                                                                                                                                                                                              |
| Zero ESLint warnings, type errors, and high or critical `npm audit` issues                         | Yes                                                                                                                                                                                                                              |
| Every test in the brief's testing table exists and passes; zero axe violations in both themes      | Yes: 249 tests; axe also run in Chrome on the deployed page, both themes, 390 and 1280 px                                                                                                                                        |
| Lighthouse mobile on the deployed URL                                                              | 100 / 100 / 100 / 100 in both themes, three runs each (LCP 0.8 s, CLS 0)                                                                                                                                                         |
| JavaScript within the 100 kB gzipped budget                                                        | 83.5 kB on first load                                                                                                                                                                                                            |
| Every proof-card state checked by eye on mobile and desktop                                        | Yes: idle, loading, success, not found, hourly limit with examples, secondary limit, timeout, network, upstream, at 390 and 1280 px                                                                                              |
| Keyboard-only walkthrough; screen reader announcements                                             | Keyboard: yes, in tests and by a scripted Tab walk of the deployed page. Announcements: verified through roles, live regions and accessible names in tests and axe. **Not verified with a real screen reader** (see limitations) |
| No layout shift on card load; no theme flash on reload                                             | Yes: the result region measures the same in every state; CLS 0; the theme is set by an inline script before paint                                                                                                                |
| Every decision has an ADR or a log row; the README links them                                      | Yes: 14 ADRs, 51 log rows                                                                                                                                                                                                        |
| No placeholder copy, dead code, unused files or dependencies, `console` calls or fake social proof | Yes: knip is clean; the one console call is the guarded development log (L-15)                                                                                                                                                   |
| README complete in the specified order, with live link and GIF                                     | Yes                                                                                                                                                                                                                              |
| Commit history is atomic and conventional                                                          | Yes: every change reached `main` through a pull request, merged by rebase                                                                                                                                                        |

## Known limitations

- **Not tested with a real screen reader.** VoiceOver or NVDA was not run by a person. The semantics are covered by tests and axe, which is strong evidence but not the same thing. Worth ten minutes before submission.
- **Totals stop at 100 repositories** (ADR 0006). Accounts with more have understated stars and languages; the card says so.
- **About 30 lookups an hour per network**, GitHub's unauthenticated limit. The cache and three example cards soften it.
- **No content without JavaScript** beyond a `<noscript>` message (ADR 0014).
- **Waitlist addresses are unverified**, and the endpoint has no rate limiting of its own (L-29).
- **Deploys are manual** (`npm run deploy` from `main`); CI holds no Cloudflare credentials (L-45).
- **The demo GIF was recorded against the deployed page with GitHub's responses replayed from the saved torvalds snapshot**, so recording did not spend the hourly allowance. The data shown is real, captured on 20 November 2026.
- **The address is a `workers.dev` subdomain.** A custom domain means editing `index.html`, `robots.txt` and `sitemap.xml`; a test keeps the three in agreement.
- **Impeccable's launcher and detector were not run** (L-01, L-51); its guidance was applied from its reference files.

## Open issues

None blocking.

## Blockers

None.
