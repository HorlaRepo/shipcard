# 0004. CSS Modules with design tokens as CSS custom properties

- Status: Accepted
- Date: 2026-11-20

## Context
The brief requires CSS, not a utility framework or UI kit, and both a light and a dark theme. Styles must stay maintainable as sections are added, and the design has to be visibly systematic: reviewers look for design-system thinking, not one-off values.

## Decision
Component styles are CSS Modules (`Name.module.css` beside `Name.jsx`). Every colour, space, radius, shadow, type size, duration and easing is a custom property defined in `src/styles/tokens.css`. Themes swap token values on `[data-theme]`; components never branch on the theme.

## Why
- CSS Modules scope class names at build time, so a rule in one component cannot leak into another, with no runtime and no naming discipline to police.
- Custom properties are the platform's own token mechanism: they cascade, can be read in dev tools, and switch at runtime, which makes theming one attribute change with no re-render.
- One token file makes the design system reviewable in a single place, and "no raw values in component CSS" becomes a rule that can be checked by reading.
- Vite supports CSS Modules without configuration.

## Alternatives considered
### Tailwind CSS
Utility classes in markup. Rejected because the brief asks for CSS, and utilities move styling decisions into class strings where the token system is harder to see and assess.

### CSS-in-JS (styled-components, Emotion)
Styles authored in JavaScript. Rejected because it adds a runtime that computes and injects styles on the client, costing bundle size and main-thread time on a page with a 100 KB budget, for dynamic styling this page does not need.

### Global CSS with BEM naming
Plain stylesheets with a naming convention. Rejected because scoping would depend on every class being named correctly forever; nothing fails when two components pick the same name.

## Consequences
- Positive: scoped styles, zero runtime, a single source of truth for design values, cheap theming.
- Negative / trade-offs: class names are generated, so they are less readable in dev tools; sharing a style between components needs a shared token or a `ui/` component rather than a shared class. Custom properties are not type-checked, so a misspelt token fails silently.
- Revisit if: silent token typos cause real bugs (add a lint rule for unknown custom properties) or the design system outgrows one file.
