# Shipcard

A React landing page whose hero builds a proof-of-work card live from GitHub's public API.

## Start of every session

Read these three files, in this order, before changing anything:

1. [`docs/BRIEF.md`](docs/BRIEF.md): the build brief. It is the highest authority, including its amendments table.
2. [`docs/PROGRESS.md`](docs/PROGRESS.md): what is done, in progress and next. Do not re-plan finished work.
3. [`docs/decisions/README.md`](docs/decisions/README.md): accepted decisions. They are reopened only with new evidence.

## End of every session

Update `docs/PROGRESS.md`: done, in progress, next step, open issues, and any blocker with what was tried.

## Rules that are easy to forget

- React, JavaScript and CSS only. No TypeScript files, no Tailwind, no UI kit.
- Every decision gets an ADR or a decision log row, in the same commit as the code or before it.
- Run `npm run check` before every commit.
- One phase and one skill at a time (see the brief's Working rules).
- Work on a branch and merge through a pull request; never commit to `main`.
