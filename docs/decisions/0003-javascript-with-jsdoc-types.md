# 0003. JavaScript with JSDoc types, checked by `tsc --noEmit`

- Status: Accepted
- Date: 2026-11-20

## Context
The brief says JavaScript: no TypeScript files. The code still maps untrusted API responses to a view model and passes it through hooks and components, which is exactly where type errors hide. Reviewers score maintainability and engineering standards.

## Decision
Source files are `.js` and `.jsx`. Types are written as JSDoc on every exported function, hook and component's props. `tsconfig.json` turns on `allowJs`, `checkJs` and `strict`, and `npm run typecheck` (`tsc --noEmit`) runs in CI.

## Why
- The compiler checks JSDoc types with the same engine as `.ts` files, so the project gets null checks, wrong-argument errors and editor completion while shipping only JavaScript.
- The types double as the documentation the brief asks for on public functions.
- Nothing is added to the bundle and no build step changes: the type checker only reads.

## Alternatives considered
### TypeScript source files
The usual choice. Rejected because the brief's requirement is JavaScript; `.ts` files would break it however good the reasons.

### Untyped JavaScript
Rejected because it leaves no safety net at the API boundary: a renamed view-model field would fail at runtime in front of a visitor rather than in CI.

### PropTypes
Runtime checks on component props. Rejected because they cover components only (not the API client, mapper or hooks), report in the browser console rather than in CI, and are ignored by React 19.

## Consequences
- Positive: type safety and editor support with a JavaScript-only codebase.
- Negative / trade-offs: JSDoc is wordier than TypeScript syntax, and complex generics are awkward to express, so types are kept simple (`@typedef` objects, unions of string literals). A `tsconfig.json` and the `typescript` package exist in a JavaScript project and need this record to explain them.
- Revisit if: the JavaScript-only requirement is lifted; the JSDoc types then convert to `.ts` mechanically.
