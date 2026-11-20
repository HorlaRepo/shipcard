# Decisions

Every decision in this project is recorded here, with its reason and the alternatives that lost. [ADR 0001](0001-record-decisions-as-adrs-and-a-log.md) explains the system.

- **Decision records (ADRs)** cover anything structural or hard to reverse. One file each, numbered in order.
- **The decision log** below covers small, local choices. One row each.

Accepted decisions are reopened only with new evidence. A replaced decision is marked `Superseded by NNNN` and stays in the index.

## Decision records

| ADR | Decision | Status |
| --- | --- | --- |
| [0001](0001-record-decisions-as-adrs-and-a-log.md) | Record decisions as ADRs plus a decision log | Accepted |
| [0002](0002-vite-and-react.md) | Vite and React, on Node LTS, with versions pinned by the lockfile | Accepted |
| [0003](0003-javascript-with-jsdoc-types.md) | JavaScript with JSDoc types, checked by `tsc --noEmit` | Accepted |

## Decision log

| # | Date | Decision | Why | Alternatives rejected |
| --- | --- | --- | --- | --- |
