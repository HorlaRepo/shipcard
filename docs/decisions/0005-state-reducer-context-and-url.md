# 0005. State: a reducer for the demo, context for the theme, the URL for the username

- Status: Accepted
- Date: 2026-11-20

## Context

The page has three pieces of state with different lifetimes and audiences: the proof-card lookup (one feature, with loading and error states), the theme (read across the whole tree, persisted) and the username on show (should survive a reload and be shareable). Everything else is local UI state such as an open FAQ item.

## Decision

The lookup is a `useReducer` state machine inside the proof-card feature (`idle`, `loading`, `success`, `error`). The theme lives in a React context provided once at the root. The current username lives in the URL query (`?u=<username>`).

## Why

- A reducer with one `status` field makes impossible states unrepresentable: there is no way to be loading and showing an error at once, which separate `isLoading`/`error`/`data` flags allow.
- The theme is the only truly global value and changes rarely, so context's re-render cost is irrelevant and a store would be ceremony.
- The URL is state the visitor can copy. Putting the username there makes cards shareable and reload-safe for free, with no storage to keep in sync.
- Each tool is the smallest that does its job, and the fetch logic stays in the open where it can be read and tested.

## Alternatives considered

### Redux or Zustand

A global store. Rejected because only one value is shared across the tree; a store would add a dependency, a provider and indirection to move state that already sits next to its only consumer.

### TanStack Query

A server-state library that handles caching, deduplication, retries and cancellation. This is the right tool at scale. Rejected here because the request lifecycle (abort, timeout, cache, error mapping) is the thing being assessed, and the library would hide it behind `useQuery`; it would also take a sizeable share of the 100 KB JavaScript budget for one query. It is the named scale-up path.

### `useState` flags

`isLoading`, `error` and `data` as separate state. Rejected because the flags can disagree, every handler has to remember to reset the others, and the transitions are not testable as a unit.

## Consequences

- Positive: no state dependency; transitions are a pure function with exhaustive tests; shareable URLs.
- Negative / trade-offs: caching, cancellation and stale handling are hand-written and must be tested here rather than inherited. A second API feature would repeat the pattern.
- Revisit if: a second or third remote resource appears; adopt TanStack Query and delete the hand-written cache and reducer.
