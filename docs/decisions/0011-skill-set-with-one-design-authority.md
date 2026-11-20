# 0011. A fixed skill set, with Impeccable as the single design authority

- Status: Accepted
- Date: 2026-11-20

## Context

The page is built with agent skills: packaged guidance for design, motion, accessibility, React performance and metadata. Skills overlap and contradict each other, and loading several general-purpose ones at once produces a page that is re-polished in circles. Skills are also third-party content that runs with the agent's permissions.

## Decision

Six skills are installed at project level, each with one job and one phase:

| Skill                       | Job                                        | Phase |
| --------------------------- | ------------------------------------------ | ----- |
| impeccable                  | Design direction, then audit and polish    | 1, 5  |
| emil-design-eng             | Interactions and motion                    | 4     |
| web-design-guidelines       | Interface-rule audit                       | 5     |
| vercel-react-best-practices | React performance (client-side rules only) | 3, 5  |
| fixing-accessibility        | Targeted accessibility fixes               | 5     |
| fixing-metadata             | Titles, Open Graph, JSON-LD, robots        | 5     |

Impeccable is the only skill allowed to set visual direction. Where a skill contradicts the brief, an accepted ADR or `DESIGN.md`, the higher source wins and the conflict is noted in the decision log.

## Why

- One voice per concern means a disagreement is resolved by the order of authority, not by whichever skill ran last.
- Project-level installation (`.claude/skills/`, pinned by `skills-lock.json` to a commit and content hash) means the guidance that shaped the code travels with it and can be read by a reviewer.
- Every `SKILL.md` was read before installation. All six are prose guidance; none needs a network call to be useful.

## Alternatives considered

### Anthropic's frontend-design skill alongside Impeccable

Impeccable is built on it, so installing both gives two versions of the same advice with different wording. Rejected because the overlap produces contradictory direction with no rule for which wins.

### UI/UX Pro Max

A large database of palettes, font pairings and styles. Rejected because picking from a generic catalogue pulls toward template looks, the opposite of a deliberate direction, and it needs a Python runtime that nothing else in this project uses.

### No skills

Rely on general knowledge. Rejected because audits against a written rule list are repeatable and can be triaged; an audit from memory cannot be checked for coverage.

## Consequences

- Positive: predictable guidance per phase; conflicts have a resolution rule; the skill set is reviewable.
- Negative / trade-offs: about 2.8 MB of third-party files in the repository, most of it Impeccable's font index and browser tooling. Impeccable's launcher can download and run a prebuilt binary; this project uses its reference files directly and does not run the launcher (decision log L-01). Skill advice written for Tailwind or Next.js has to be translated or ignored.
- Revisit if: a skill's advice repeatedly conflicts with the brief, or a specific gap appears that `baseline-ui` or `fixing-motion-performance` would fill.
