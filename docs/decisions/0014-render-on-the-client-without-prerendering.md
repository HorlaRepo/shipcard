# 0014. Render on the client, without build-time prerendering

- Status: Accepted
- Date: 2026-11-21

## Context

The page is a Vite single-page build (0002): the HTML that arrives holds metadata and an empty root, and React renders the content. The brief names build-time prerendering as a stretch goal and asks for the trade-off to be recorded either way. The requirements it would serve are a fast first paint (LCP under 2.5 s on a mid-range phone) and content that search engines and link previews can read.

Measured on the deployed page with mobile Lighthouse (simulated mid-range phone, slow 4G), without prerendering: Largest Contentful Paint 0.8 s, Cumulative Layout Shift 0, Total Blocking Time 120–190 ms, Performance 97–99.

## Decision

The page renders on the client. Everything a crawler or a link preview needs without running JavaScript is written into `index.html`: the title, description, canonical URL, Open Graph and Twitter tags, and `SoftwareApplication` structured data, with a `<noscript>` message for visitors without JavaScript.

## Why

- The requirement prerendering exists to meet is already met: LCP is 0.8 s against a 2.5 s budget, because the bundle is small (84 KB gzipped) and the headline's font is preloaded.
- Link previews (Slack, LinkedIn, X) read only the head, which is static HTML here, so shared links show the right title, description and image today.
- Google renders JavaScript, and the page is one URL whose ranking does not matter to a demo; other crawlers still receive complete metadata and structured data.
- Prerendering would add a build step that runs the app in Node, where `window`, `localStorage`, `matchMedia` and `IntersectionObserver` do not exist, and a hydration path in which the theme, the `?u=` deep link and the scroll state must produce the same first render on both sides. That is new failure surface on the feature under assessment, for a number that is already green.

## Alternatives considered

### Prerender at build time with `react-dom/static` and hydrate

Render `<App />` to HTML in a post-build script and inject it into `index.html`. Rejected for now because it buys an estimated 0.2–0.3 s of first paint on a page already at 0.8 s, and costs guarded access to every browser API during render plus hydration-mismatch handling for the theme and the deep link. It is the right next step if the page gains content that must be indexed.

### A prerendering plugin (for example `vite-plugin-prerender` with a headless browser)

Snapshot the rendered page in headless Chrome during the build. Rejected because it adds a browser download to every CI run and a dependency whose maintenance is outside this project, to produce the same HTML the first alternative would.

### Move to a framework with server rendering

Rejected in 0002, and nothing measured here reopens it.

## Consequences

- Positive: one render path, no hydration, no Node-side guards; the measured budgets are met.
- Negative / trade-offs: with JavaScript disabled the visitor sees only the `<noscript>` message. Crawlers that do not run JavaScript index the metadata but not the body copy. First paint depends on the script arriving.
- Revisit if: LCP on real devices approaches the 2.5 s budget, the page gains copy that needs to rank, or a no-JavaScript experience becomes a requirement.
