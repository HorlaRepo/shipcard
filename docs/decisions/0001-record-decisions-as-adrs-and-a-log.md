# 0001. Record decisions as ADRs plus a decision log

- Status: Accepted
- Date: 2026-11-20

## Context

This project is reviewed for technical decision-making, and most of a decision is invisible in the finished code: the code shows what was chosen, never what was rejected or why. The project is also built across several sessions, so a choice made in one session has to survive into the next without being argued again.

## Decision

Every decision is written down in `docs/decisions/`. Structural or hard-to-reverse choices get one numbered Architecture Decision Record each; small local choices get one row in the decision log in `docs/decisions/README.md`, which also indexes every ADR.

## Why

- An ADR has a fixed shape (context, decision, alternatives, consequences), so a reviewer can check a decision in a minute and knows where to look for the rejected options.
- Two tiers keep the cost proportional. A debounce value does not deserve a page; a hosting choice does not fit in a table cell.
- Numbered files in the repository are versioned with the code they explain, so `git log` shows the decision landing with or before its implementation.
- "Superseded by NNNN" keeps history honest: a reversed decision stays readable, together with the evidence that reversed it.

## Alternatives considered

### Comments in the code

Explain each choice next to the line it affects. Rejected because decisions that span files (state management, hosting, the test stack) have no single line to sit on, comments are not indexed, and a deleted alternative leaves nothing to comment.

### A "Technical decisions" section in the README only

One long section listing choices. Rejected because a README section records outcomes, not alternatives, and rewriting it loses history: a reader cannot tell what was decided first or what changed. The README keeps a summary table that links here instead.

## Consequences

- Positive: every "why this and not that?" has an address; new sessions start from recorded decisions rather than from taste.
- Negative / trade-offs: writing takes time on a 48-hour build, and a stale record is worse than none, so a change of direction must write a new record.
- Revisit if: the records stop being read (decisions get re-argued despite them) or the log grows past what one page can index.
