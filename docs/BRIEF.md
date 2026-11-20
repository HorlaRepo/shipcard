# Shipcard — Build Brief for SwapLearn Assessment (Option 2)

Nov 20, 2026 · @Francis Oladosu

## How to use this brief

You are building Shipcard, a React landing page submitted for a Senior Software Engineer assessment. Reviewers score code quality, architecture, maintainability, scalability, readability, documentation, engineering standards, UX, performance and technical decision-making. Every choice must survive a senior engineer asking "why?"

**Non-negotiables**

- React.js, JavaScript and CSS only, as the brief requires. No TypeScript files, no Tailwind, no UI kit.
- It stays a landing page. One page, one live API feature. Do not grow it into an app.
- Every decision is recorded with its reason and the alternatives considered (see Decision log rule). Undocumented decisions are treated as bugs.
- Zero slop: no placeholder copy, no dead code, no unused dependencies, no fabricated testimonials or metrics, no generic "AI-made" visual tropes.
- Nothing is "done" until it passes the Definition of done at the end of this brief.

**Order of authority when guidance conflicts**

1. This brief.
2. Accepted decision records in `docs/decisions/`.
3. `DESIGN.md` (the design direction, written in Phase 1).
4. Installed skills.
5. General best practice.

When a skill contradicts a higher source, follow the higher source and note the conflict in the relevant decision record. Example: `baseline-ui` assumes Tailwind tokens; here, use the CSS custom-property tokens instead.

**Keep this brief in the repo** as `docs/BRIEF.md` and reference it from `CLAUDE.md`, so every new session starts from it.

## Product concept and scope

Shipcard is a fictional product: "Your résumé says what you know. Your code proves it." The landing page sells it, and the hero section contains a working demo. A visitor types a GitHub username and gets a proof-of-work card built live from GitHub's public API. The demo is the pitch, so the API integration has a real reason to exist.

**The card shows**

- Avatar, name, handle, account age
- Public repos and total stars across them
- Top 3–5 languages, counted from each repo's primary language
- Three most-starred repos, linked
- Last-shipped recency (most recent push), e.g. "Shipped 3 days ago"

**In scope**

- One responsive landing page: header, hero with live demo, how it works, features, pricing (monthly/annual toggle), FAQ, waitlist form, footer
- Light and dark themes (system default, user override, persisted, no flash on load)
- Shareable card URLs (`?u=<username>` loads that card on arrival)
- Animations and interactions that serve meaning, respecting reduced-motion
- SEO metadata, tests, CI, deployment, README, decision records

**Out of scope (do not build)**

- Authentication, user accounts, a backend or database
- GitHub tokens of any kind in the client
- Multiple routes or pages beyond the landing page (a 404 fallback is fine)
- Testimonials, logos of "customers", invented user counts or ratings
- Image export of the card, analytics, i18n

The name "Shipcard" is a working name. Changing it must be a single edit in `src/content/`.

## Skills to install and when to use each

Install six skills, each with one job, and invoke each only in its phase. Loading every skill at once produces conflicting advice and endless re-polishing. Skills are third-party code: read each `SKILL.md` before installing, and install at project level so they travel with the repo.

| Skill | Job in this project | Phase | Install |
| --- | --- | --- | --- |
| [Impeccable](https://github.com/pbakaus/impeccable) (Paul Bakaus) | Primary design and anti-slop skill. Sets visual direction, then audits and polishes. Builds on Anthropic's frontend-design skill, so do not install both. | 1 (shape), 5 (audit, polish) | `npx skills add pbakaus/impeccable` |
| [emil-design-eng](https://emilkowal.ski/skill) (Emil Kowalski) | Interactions and motion: easing, durations, press states, hover guards, reduced motion. | 4 | `npx skills add emilkowalski/skill` |
| [web-design-guidelines](https://github.com/vercel-labs/agent-skills) (Vercel) | Audit against 100+ web interface rules covering accessibility, performance and UX. | 5 | `npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines` |
| [vercel-react-best-practices](https://github.com/vercel-labs/agent-skills) (Vercel) | React performance and patterns. Apply client-side rules only; ignore Next.js and server-side rules. | 3, 5 | `npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices` |
| [fixing-accessibility](https://github.com/ibelick/ui-skills) (ibelick) | Targeted a11y fixes: ARIA, keyboard, focus, contrast, form errors. | 5 | `npx skills add https://github.com/ibelick/ui-skills --skill fixing-accessibility` |
| [fixing-metadata](https://github.com/ibelick/ui-skills) (ibelick) | Titles, descriptions, canonical, Open Graph, JSON-LD, robots. | 5 | `npx skills add https://github.com/ibelick/ui-skills --skill fixing-metadata` |

**Optional, only if a specific need appears:** `baseline-ui` and `fixing-motion-performance` from ibelick/ui-skills. `baseline-ui` assumes Tailwind tokens, so translate its rules to the project's CSS tokens.

**Deliberately not used:** UI/UX Pro Max (large generic palette database pulls toward template looks and needs Python) and any second general design skill (overlaps Impeccable and causes contradictory direction). Record this in the skills decision record.

**How to invoke**

- Phase 1: Impeccable's shaping or critique commands to produce `DESIGN.md` before any section is styled.
- Phase 4: emil-design-eng for each interaction (theme toggle, pricing toggle, FAQ, mobile menu, card reveal).
- Phase 5: run audits one at a time, in this order: fixing-accessibility → web-design-guidelines → vercel-react-best-practices → fixing-metadata → Impeccable audit → Impeccable polish. Triage each audit's findings before running the next (see Working rules).

Install commands are as published by each author at the time of writing. Confirm the current command on the linked page before running it.

## Decision log rule

Every decision is written down before or alongside the code that implements it, with the reason and the alternatives that were rejected. A decision is anything a reviewer could reasonably ask "why this and not that?" about: a library, a pattern, a file layout, an API behaviour, a design token, a trade-off, a skill's advice accepted or ignored.

**Two tiers**

- **Decision record (ADR)** for anything structural or hard to reverse. One file per decision in `docs/decisions/NNNN-short-title.md`, numbered in order.
- **Decision log row** for small, local choices (a debounce value, a breakpoint, a naming convention). One row in the table in `docs/decisions/README.md`, which also indexes every ADR.

**Rules**

- Every ADR lists at least two real alternatives, each with the specific reason it lost. "Not needed" alone is not a reason.
- State the trade-off honestly: what this choice costs and what would make you revisit it.
- Accepted decisions are not reopened without new evidence. If one is replaced, mark it `Superseded by NNNN` and write the new ADR; never edit history away.
- Commit the ADR in the same commit as the code it explains, or before it.
- The README's "Technical decisions" section summarises the ADRs and links to each.

**ADR template** (copy exactly)

```markdown
# NNNN. <Decision title>

- Status: Proposed | Accepted | Superseded by NNNN
- Date: YYYY-MM-DD

## Context
What problem or force requires a decision. Facts and constraints only.

## Decision
What we chose, in one or two sentences.

## Why
The reasons this option best fits the constraints.

## Alternatives considered
### <Option A>
What it is. Why it was rejected (specific).
### <Option B>
What it is. Why it was rejected (specific).

## Consequences
- Positive: ...
- Negative / trade-offs: ...
- Revisit if: <the condition that would change this decision>
```

**Decision log row format** (in `docs/decisions/README.md`)

| # | Date | Decision | Why | Alternatives rejected |
| --- | --- | --- | --- | --- |
| L-01 | YYYY-MM-DD | Submit username on Enter, not on keystroke | Saves rate limit; one intent = one request | Debounced search-as-you-type (burns 60 req/hr quota) |

## Pre-made decisions (write these as the first ADRs)

These are already decided. In Phase 0, write each as a full ADR using the template, expanding the reasoning; do not re-debate them.

| ADR | Decision | Why | Alternatives rejected |
| --- | --- | --- | --- |
| 0001 | Record decisions as ADRs plus a decision log | Reviewers score technical decision-making; this makes it visible and checkable | Comments in code (scattered, unindexed); README only (loses alternatives and history) |
| 0002 | Vite + React (latest stable), Node LTS, versions pinned by lockfile | Fast dev server and build, no framework conventions to explain away, matches the brief | Next.js (server features unused on one static page, harder to justify); Create React App (deprecated) |
| 0003 | JavaScript with JSDoc types and `checkJs`, checked in CI with `tsc --noEmit` | Brief says JavaScript; this still catches type errors | TypeScript files (violates brief); untyped JS (no safety net); PropTypes (runtime-only, deprecated in React 19) |
| 0004 | CSS Modules + design tokens as CSS custom properties | Brief says CSS; scoped styles plus a token layer show design-system thinking | Tailwind (not plain CSS, hides the design system); CSS-in-JS (runtime cost); global BEM only (no scoping guarantee) |
| 0005 | State: `useReducer` state machine for the demo, React context for theme, URL query for the username | Smallest tool for each job; URL makes cards shareable | Redux or Zustand (over-engineering for one page); TanStack Query (correct at scale, but hides the fetch logic being assessed; name it as the scale-up path) |
| 0006 | GitHub REST API, unauthenticated, two requests per lookup | Real public data with no secrets in the client | Authenticated calls (a token in a browser bundle is a leaked token); a proxy backend (out of scope for a landing page); GraphQL API (requires auth) |
| 0007 | Motion with CSS transitions and IntersectionObserver | Covers every interaction needed at zero bundle cost | Framer Motion / Motion (about 30–50 KB for effects CSS can do); GSAP (licence and weight overkill) |
| 0008 | Waitlist submits to a real form endpoint (Formspree or Netlify Forms) behind a `submitWaitlist()` service | Real behaviour; the service boundary makes the provider swappable | Fake success message (dishonest UI); custom backend (out of scope) |
| 0009 | Vitest + React Testing Library + MSW | Native to Vite; tests behaviour through the DOM; MSW mocks at the network edge so the real client code runs | Jest (extra config with Vite); mocking `fetch` by hand (tests the mock, not the client) |
| 0010 | Deploy to Vercel or Netlify with security headers in config | Free, preview deploys, header control | GitHub Pages (no custom headers, so no CSP) |
| 0011 | Skills set as listed in Skills section; Impeccable as the single design authority | One voice per concern prevents contradictory advice | Anthropic frontend-design alongside Impeccable (overlap); UI/UX Pro Max (generic palettes, Python dependency) |

## Architecture and folder structure

Organise by feature, keep content out of components, and keep the API layer free of React so it can be tested and replaced on its own.

```text
.
├── CLAUDE.md                  # points to docs/BRIEF.md and docs/PROGRESS.md
├── README.md
├── index.html                 # meta, JSON-LD, inline no-flash theme script
├── public/                    # robots.txt, sitemap.xml, og-image, favicons, fonts
├── docs/
│   ├── BRIEF.md               # this brief
│   ├── DESIGN.md              # design direction from Phase 1
│   ├── PROGRESS.md            # done / in progress / next / open issues
│   └── decisions/             # README.md (index + log) and NNNN-*.md ADRs
├── src/
│   ├── main.jsx
│   ├── app/                   # App.jsx, providers/ (ThemeProvider)
│   ├── components/
│   │   ├── ui/                # Button, Container, Section, VisuallyHidden, Icon
│   │   └── layout/            # Header, MobileNav, Footer, SkipLink, ThemeToggle
│   ├── sections/              # Hero, HowItWorks, Features, Pricing, Faq, Waitlist
│   ├── features/
│   │   ├── proof-card/        # ProofCard, ProofCardForm, ProofCardSkeleton,
│   │   │                      # useGithubProfile, githubClient, mapProfile, errors, tests
│   │   └── waitlist/          # WaitlistForm, submitWaitlist, validation, tests
│   ├── hooks/                 # useInView, useMediaQuery, useUrlParam
│   ├── lib/                   # http.js (fetch + timeout + typed errors), cache.js, format.js
│   ├── content/               # site.js: all copy, nav, features, pricing, FAQ
│   └── styles/                # tokens.css, reset.css, global.css
├── tests/                     # setup.js, msw handlers and fixtures
└── .github/workflows/ci.yml
```

**Layer rules**

- `sections/` compose `components/` and `features/`. They hold layout, not logic.
- `features/*` own their state, API calls and tests. Nothing outside a feature imports its internals; each exposes one public component.
- `lib/` has no React imports. `githubClient` and `mapProfile` are plain functions.
- `content/site.js` is the only place copy lives. Components receive content as props.
- Import paths are explicit; no barrel `index.js` files (they hide dependencies and hurt tree-shaking).

**Proof-card data flow**

```text
ProofCardForm (validate username)
  → useGithubProfile (reducer: idle → loading → success | error)
    → cache.get(username)  ── hit → success
    → githubClient.getProfile(username, { signal })
        → http.getJson  (timeout, AbortController, typed errors)
        → GET /users/{u}  +  GET /users/{u}/repos?per_page=100&sort=pushed   (in parallel)
    → mapProfile(user, repos)  → view model
    → cache.set(username, model)
  → ProofCard renders the view model; URL updated to ?u=<username>
```

## Page sections and content rules

The page has eight parts, in this order. Each has one job; if a section can't name its job, cut it.

| Section | Job | Interactive behaviour |
| --- | --- | --- |
| Header | Brand, anchor nav, primary CTA, theme toggle | Sticky with subtle shrink on scroll; mobile menu opens as a dialog with focus trap, Escape to close, focus returns to the trigger |
| Hero | One-line promise + the live proof-card demo | Username form; skeleton while loading; card reveals with a short transition; example usernames as one-click chips |
| How it works | Three steps from username to shareable card | Reveal on scroll (once), disabled under reduced motion |
| Features | 4–6 concrete benefits tied to proof of work | Static; no hover gimmicks |
| Pricing | 2–3 tiers with monthly/annual toggle | Accessible toggle (radio group or switch with label); prices update without layout shift |
| FAQ | 5–7 real questions (data source, privacy, rate limits, pricing) | Disclosure pattern: buttons with `aria-expanded` and `aria-controls`, or native `details`/`summary` |
| Waitlist | Email capture | Inline validation on blur and submit; real submission; success and error states announced |
| Footer | Secondary links, source repo link, credits | Static |

**Content rules**

- Write specific copy for this product. No lorem ipsum, no "Unlock your potential", no "Revolutionize", no "Seamless", no emoji as icons.
- No fabricated social proof. The live demo is the proof.
- Every CTA says what happens next ("Generate my card", "Join the waitlist"), not "Get started".
- Empty, loading, error and success states are designed and written for the demo and the form, not left as defaults.
- Error copy says what happened and what to do: "GitHub's limit for this network resets at 14:32. Try an example card meanwhile."
- Respect the fictional framing: a small footer note says Shipcard is a demo project and data comes from GitHub's public API.

## GitHub API integration spec

Each lookup makes two unauthenticated requests in parallel, and the UI must handle every way they can fail. GitHub allows 60 unauthenticated requests per hour per IP, so a visitor gets about 30 lookups an hour before hitting the limit. Treat that as a design constraint, not an edge case.

**Endpoints**

- `GET https://api.github.com/users/{username}`
- `GET https://api.github.com/users/{username}/repos?per_page=100&sort=pushed&type=owner`
- Headers: `Accept: application/vnd.github+json`, `X-GitHub-Api-Version` pinned to a current version.

**Input validation (before any request)**

- Trim; strip a leading `@`; accept a pasted `github.com/<user>` URL and extract the username.
- Validate against GitHub's username rules: `^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$`.
- Invalid input never reaches the network; show an inline error linked with `aria-describedby`.
- Always `encodeURIComponent` the username in the path.

**Request handling (`lib/http.js`)**

- One `getJson(url, { signal, timeoutMs })` helper. Timeout via `AbortController` (8 seconds, a named constant).
- A new lookup aborts the in-flight one; unmount aborts too. Aborts are not shown as errors.
- Map responses to typed errors in `features/proof-card/errors.js`:

| Condition | Error | UI response |
| --- | --- | --- |
| 404 on `/users` | `NotFoundError` | "No GitHub user called @x." Focus stays in the input |
| 403 or 429 with `x-ratelimit-remaining: 0` | `RateLimitError` with `resetAt` from `x-ratelimit-reset` | Local reset time and example cards offered |
| Other 403/429 (secondary limit) | `RateLimitError` without exact time | "GitHub is throttling requests. Try again in a minute." |
| Timeout | `TimeoutError` | Retry button |
| Network failure | `NetworkError` | Offline-aware message, retry button |
| 5xx or unexpected shape | `UpstreamError` | Generic message, retry; details logged in dev only |

**Caching**

- In-memory map plus `sessionStorage`, keyed by lowercase username, TTL 10 minutes (named constant).
- `sessionStorage` access wrapped in try/catch (private mode and quota errors must not break the page).
- Read the remaining-quota header and, when it is low, show a quiet hint near the form.

**Example cards (rate-limit fallback)**

- Ship 2–3 static JSON snapshots of well-known public developers in `features/proof-card/examples/`, labelled in the UI as "Snapshot from \<date>".
- They render through the same `mapProfile` path, so the fallback exercises real code.

**Mapping (`mapProfile`)**

- Pure function: `(user, repos, now) → viewModel`. Pass `now` in so tests are deterministic.
- Exclude forks and archived repos from stars, languages and top repos; state this rule in the UI tooltip and README.
- Languages: count primary language per remaining repo, return the top 5 with percentages; ignore `null`.
- Handle zero repos, missing name, missing bio and very large star counts (format with `Intl.NumberFormat`, compact notation).
- Dates: relative time with `Intl.RelativeTimeFormat`; no date library.

**State machine (`useGithubProfile`)**

- States: `idle`, `loading`, `success`, `error`. Actions: `SUBMIT`, `RESOLVE`, `REJECT`, `RESET`. Impossible states are unrepresentable.
- Results region uses `aria-live="polite"` and `aria-busy` while loading.
- The card section is wrapped in an error boundary with a fallback, so a rendering bug cannot blank the page.

**URL state**

- On success, `history.replaceState` sets `?u=<username>`; on load, a valid `u` param triggers a lookup.
- A "Copy link" button uses the Clipboard API with a visible and announced confirmation.

## Code quality and zero-slop rules

Code should read as if one careful senior engineer wrote all of it. Every rule below is checked in review, and the ones that can be automated are enforced in CI.

**Tooling (enforced)**

- ESLint flat config with `@eslint/js` recommended, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`. Run with `--max-warnings 0`.
- Prettier for formatting, with no style debates in review. ESLint does not do formatting.
- `tsc --noEmit` with `checkJs` on `src/` (JSDoc types on every exported function, hook and component props).
- `lint-staged` + Husky pre-commit: lint and format staged files only.
- `.editorconfig`, `.nvmrc`, `engines` in `package.json`.

**Code rules**

- No `console.*`, `debugger`, commented-out code, `TODO` without an issue reference, or unused exports, files or dependencies (check with `knip`).
- No magic numbers or strings: timeouts, TTLs, limits, breakpoints and storage keys are named constants.
- Components stay under about 150 lines and do one thing. Extract when a piece is reused or independently testable, not before.
- No premature abstraction: no generic "factory", "manager" or config-driven component unless two real uses exist.
- Naming: PascalCase components, camelCase functions, `useX` hooks, `handleX` event handlers, `isX`/`hasX` booleans. File name equals its default export.
- Effects only for synchronising with external systems (DOM, network, storage). Derive values during render instead of syncing state.
- No `dangerouslySetInnerHTML`, no inline styles except CSS custom-property values, no `!important`.
- Comments explain why, never what. JSDoc on public functions and hooks.
- Errors are handled where they can be acted on; nothing is swallowed silently.

**CSS rules**

- All colours, spacing, radii, shadows, type sizes, durations and easings come from `tokens.css` custom properties. No raw hex or pixel values in component CSS except 0 and 1px hairlines.
- Mobile-first; layout with grid and flex; fluid type with `clamp()`; logical properties (`margin-inline`, `padding-block`).
- Both themes defined by swapping token values on `[data-theme]`; components never branch on theme.
- Animate only `transform` and `opacity`. Every motion has a `prefers-reduced-motion` alternative.

**Visual anti-slop (reject on sight)**

- Purple-to-blue gradients, glowing blobs, glassmorphism everywhere, dark-mode neon glows.
- Inter or a system font used for everything with no typographic hierarchy. Choose a deliberate pairing in `DESIGN.md`.
- Cards inside cards, identical three-column icon grids, emoji as icons, centred everything.
- Bounce or elastic easing on UI elements, animations over 400 ms on interactions.
- More than one accent colour per view; low-contrast grey text on grey.

## Accessibility, performance, SEO and security

The deployed page must score 100 for Accessibility and at least 95 for Performance, Best Practices and SEO in mobile Lighthouse, in both themes, with zero axe violations.

**Accessibility (WCAG 2.2 AA)**

- Landmarks: `header`, `nav`, `main`, `footer`; one `h1`; headings never skip levels.
- Skip link as the first focusable element.
- Visible `:focus-visible` ring from a token, at least 3:1 against both themes. Never remove outlines without a replacement.
- Text contrast at least 4.5:1 (3:1 for large text and UI boundaries) in both themes. Record measured ratios in `DESIGN.md`.
- Every control has an accessible name; icon-only buttons have `aria-label`; decorative SVGs have `aria-hidden="true"`.
- Forms: visible labels, errors linked by `aria-describedby`, `aria-invalid` on error, focus moves to the first invalid field on submit.
- Mobile menu: dialog semantics, focus trap, Escape closes, focus returns, background inert.
- Touch targets at least 44 × 44 px. Hover-only effects guarded with `@media (hover: hover)`.
- Everything usable by keyboard alone and at 200% zoom with no horizontal scroll at 320 px width.

**Performance**

- Budget: at most 100 KB gzipped JS on first load; LCP under 2.5 s, CLS under 0.1, INP under 200 ms on a mid-range mobile profile. Add a `size-limit` check in CI.
- Self-host fonts as WOFF2, subset, `font-display: swap`, preload the one used above the fold, at most two families.
- Images: AVIF/WebP with explicit `width`/`height`; `loading="lazy"` and `decoding="async"` below the fold; GitHub avatars requested at the rendered size via the `s=` parameter.
- Lazy-load below-the-fold sections only if measurement shows a benefit; record the measurement either way.
- No layout shift when the card loads: the skeleton reserves the card's exact dimensions.

**SEO**

- In `index.html`: title (50–60 characters), meta description (140–160), canonical, `lang`, theme-color for both schemes.
- Open Graph and Twitter card tags with a 1200 × 630 image in `public/`.
- JSON-LD `SoftwareApplication` (name, description, offers matching the pricing section).
- `robots.txt` and `sitemap.xml` in `public/`.
- Content renders client-side; prerendering at build time is a stretch goal. Record the trade-off in an ADR either way.

**Security**

- No secrets in the repo or the bundle. `.env.example` only if a variable actually exists (the form endpoint ID is public and may live there).
- Security headers in the host config: Content-Security-Policy (allow `api.github.com`, `avatars.githubusercontent.com`, the form provider; no `unsafe-inline` scripts except a hashed theme script), `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, `Permissions-Policy` locking unused features, `frame-ancestors 'none'`.
- External links: `rel="noopener noreferrer"`.
- All API data rendered as text through React; URLs from the API used only for GitHub domains.
- `npm audit` clean at high severity in CI; dependencies kept to what is necessary.

## Testing strategy

Test the behaviour that would embarrass the project if it broke, not lines for a coverage number. Tests query by role and accessible name, the way a user or screen reader finds things.

| Area | What to test | Tool |
| --- | --- | --- |
| `mapProfile` | Zero repos; all forks; null languages; missing name/bio; huge star counts; top-5 language ordering; deterministic dates via injected `now` | Vitest (pure unit) |
| Username parsing | Valid, invalid, leading `@`, pasted URL, 39-character limit, consecutive hyphens | Vitest |
| `githubClient` + `http` | Each error mapping in the error table; timeout; abort is not an error; parallel requests | Vitest + MSW |
| `useGithubProfile` | idle → loading → success; → error for each type; new submit aborts the old; cache hit skips the network | RTL `renderHook` + MSW |
| Proof-card UI | Submitting renders the card; errors announced in the live region; rate-limit shows reset time and example cards; `?u=` deep link loads a card | RTL + MSW |
| Waitlist form | Validation messages; focus moves to first error; success and failure states | RTL + MSW |
| Interactions | FAQ and mobile menu keyboard behaviour (Enter, Space, Escape, focus return); pricing toggle updates prices | RTL + `user-event` |
| Theme | System default; toggle persists; `data-theme` applied | RTL |
| Accessibility | No violations on the full page in both themes | `vitest-axe` |

**Rules**

- MSW handlers and fixtures live in `tests/`; fixtures are trimmed real GitHub responses.
- No snapshot tests of markup (brittle and unreviewed).
- No test depends on network, wall-clock time or test order.
- `npm test` runs the whole suite in under 30 seconds.
- Coverage is reported, not gated. The README explains what is tested and what deliberately is not (visual styling, third-party form provider).

## Git, CI, deployment and README

Reviewers read commit history and the README before the code, so both are part of the deliverable.

**Git**

- Conventional Commits (`feat(proof-card): handle rate limits`, `docs(adr): 0006 unauthenticated GitHub API`).
- Small, atomic commits that each build and pass tests. Never one large "initial commit" or "final changes".
- `.gitignore` covers `node_modules`, `dist`, `.env*` except `.env.example`, coverage and editor files.

**CI (`.github/workflows/ci.yml`, on push and pull request)**

1. Install with `npm ci` using the `.nvmrc` Node version, with caching.
2. `npm run lint` (ESLint, zero warnings) and `npm run format:check`.
3. `npm run typecheck` (`tsc --noEmit`).
4. `npm test -- --run`.
5. `npm run build`, then `size-limit`.
6. `npm audit --audit-level=high`.

**Scripts** (`package.json`): `dev`, `build`, `preview`, `lint`, `format`, `format:check`, `typecheck`, `test`, `test:watch`, `size`, `check` (runs everything CI runs).

**Deployment**

- Vercel or Netlify, with security headers and SPA fallback in `vercel.json` or `netlify.toml`.
- Run Lighthouse on the deployed URL (mobile, both themes) and save the scores in the README.
- The SwapLearn submission (account, `swaplearn-cli`, push) is done by Francis, not the build agent. Do not install `swaplearn-cli` in the dev environment.

**README sections, in order**

1. Name, one-line description, live link, demo GIF of the proof card.
2. Features (what the page does, including the live GitHub demo).
3. Tech stack, one line each with the reason.
4. Getting started: prerequisites, install, `.env` (if any), every script.
5. Project structure: the tree with one line per folder explaining its role.
6. Technical decisions: a table summarising each ADR with a link to it.
7. API integration: endpoints, rate-limit handling, caching, error states.
8. Accessibility, performance and SEO: what was done and the measured Lighthouse scores.
9. Testing: approach, what is covered, what is deliberately not.
10. Trade-offs and what I would do next with more time.
11. Credits and licence.

The README has no badges that do not reflect real status, no filler, and no marketing tone. It reads like engineering documentation.

## Working rules to avoid going in circles

Progress comes from deciding once, finishing in phases and writing state down. These rules apply to every session.

- **Start every session** by reading `docs/BRIEF.md`, `docs/PROGRESS.md` and `docs/decisions/README.md`. Do not re-plan finished work.
- **End every session** by updating `PROGRESS.md`: done, in progress, next step, open issues, and any blocker with what was tried.
- **Decided means decided.** An accepted ADR is reopened only with new evidence (a failing test, a measured number, a brief requirement it violates). Taste alone is not new evidence.
- **One phase at a time.** Finish and commit a phase before starting the next. Polish happens in Phase 5, not while building Phase 2.
- **One skill at a time.** Invoke only the skills listed for the current phase. Run audits sequentially, never in parallel.
- **Triage audit findings** into a table in `PROGRESS.md`: finding, severity (must / should / won't), action. Fix all "must", fix "should" if under 15 minutes each, and record "won't" items with a reason in the decision log. Re-run an audit at most once after fixes.
- **Two-attempt limit.** If an approach fails twice, stop, record what was tried and why it failed in `PROGRESS.md`, and choose a different approach or flag it to Francis. Do not try a third variation of the same idea.
- **No silent rewrites.** Do not restyle or restructure finished sections without a recorded reason. Diff-sized, targeted changes over rewrites.
- **Design stops at `DESIGN.md`.** Visual direction is set once in Phase 1. Later visual changes must cite a rule in `DESIGN.md` or update it with a log row.
- **Ask only for real blockers.** If something is ambiguous but reversible, take the most reasonable reading, record it as a decision log row and continue.
- **Verify, don't assume.** Run the app and look at it after every visible change; run `npm run check` before every commit.

## Build order and definition of done

Seven phases fit inside the 48-hour window, with the riskiest work (the API feature) done early and about six hours left as buffer before submission.

1. **Phase 0 — Foundation (about 3 h).** Scaffold Vite + React; ESLint, Prettier, `checkJs`, Husky, Vitest, MSW; CI workflow; folder structure; `CLAUDE.md`, `BRIEF.md`, `PROGRESS.md`; ADRs 0001–0011 written in full. Exit: `npm run check` passes on an empty app; CI is green.
2. **Phase 1 — Design direction (about 2 h).** Use Impeccable to produce `DESIGN.md`: concept, type pairing, colour tokens for both themes with measured contrast ratios, spacing and radius scale, motion tokens, and the anti-patterns this design avoids. Implement `tokens.css`, `reset.css`, `global.css`. Exit: tokens exist and every value in `DESIGN.md` has a token.
3. **Phase 2 — Layout and static sections (about 5 h).** Header, mobile nav, all sections with real copy from `content/site.js`, responsive from 320 px up. Exit: full page renders at every width with no horizontal scroll; keyboard path works.
4. **Phase 3 — Proof-card feature (about 6 h).** `http`, errors, `githubClient`, `mapProfile`, cache, `useGithubProfile`, form, card, skeleton, example snapshots, URL state, error boundary, with every test in the testing table. Exit: all proof-card tests pass; every error state is reachable and looks designed.
5. **Phase 4 — Interactions and theme (about 3 h).** Theme provider with no-flash script; pricing toggle; FAQ; scroll reveals; card reveal; copy-link feedback, guided by emil-design-eng. Exit: every motion has a reduced-motion path; no animation exceeds the token durations.
6. **Phase 5 — Audits and polish (about 4 h).** Run the audit sequence from the Skills section; triage and fix; metadata; headers; size-limit; Lighthouse on a preview deploy. Exit: Definition of done checklist below passes.
7. **Phase 6 — Docs and delivery (about 2 h).** README, demo GIF, final ADR review, production deploy, Lighthouse scores recorded. Hand over to Francis for SwapLearn submission.

**Definition of done**

- [ ] `npm run check` passes locally and CI is green on the final commit
- [ ] Zero ESLint warnings, zero type errors, zero `npm audit` high or critical issues
- [ ] Every test in the testing table exists and passes; zero axe violations in both themes
- [ ] Lighthouse mobile on the deployed URL: Accessibility 100; Performance, Best Practices, SEO at least 95, in both themes
- [ ] JS bundle within the 100 KB gzipped budget
- [ ] Every proof-card state (idle, loading, success, each error, rate-limited with examples) checked by eye on mobile and desktop
- [ ] Keyboard-only walkthrough of the whole page passes; screen reader announces demo results and form errors
- [ ] No layout shift on card load; no theme flash on reload
- [ ] Every decision has an ADR or a decision log row with reasons and alternatives; README decisions table links them all
- [ ] No placeholder copy, dead code, unused files or dependencies (`knip` clean), `console` calls or fake social proof
- [ ] README complete in the specified order, with live link and GIF
- [ ] Commit history is atomic and conventional
- [ ] `PROGRESS.md` final entry lists known limitations honestly

## Amendments from the project owner

Instructions given by Francis after this brief was written. They carry the brief's authority and replace the text they name; each has a decision record explaining the change.

| Date | Amendment | Replaces | Decision record |
| --- | --- | --- | --- |
| 2026-11-20 | Host the page on Cloudflare. | "Deploy to Vercel or Netlify" (pre-made decision 0010, Deployment section) | [0012](decisions/0012-host-on-cloudflare-workers.md) |
| 2026-11-20 | The waitlist endpoint is the project's backend and also runs on Cloudflare. | "Formspree or Netlify Forms" (pre-made decision 0008); narrows "a backend or database" in Out of scope to exclude this one endpoint | [0013](decisions/0013-waitlist-endpoint-on-a-worker.md) |
