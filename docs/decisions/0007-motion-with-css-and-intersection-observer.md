# 0007. Motion with CSS transitions and IntersectionObserver

- Status: Accepted
- Date: 2026-11-20

## Context

The page needs a short list of motions: the header shrinking on scroll, a mobile menu opening, a card reveal, a pricing toggle, FAQ disclosure, a one-time reveal as sections enter the viewport, and copy-link feedback. Every one must have a reduced-motion alternative, animate only `transform` and `opacity`, and fit a 100 KB JavaScript budget.

## Decision

All motion is CSS transitions and keyframes driven by class or attribute changes, with durations and easings from tokens. Scroll-triggered reveals use one `useInView` hook built on `IntersectionObserver`.

## Why

- Every motion on the list is a change between two states, which is what a CSS transition is. No interaction needs physics, gesture tracking or orchestration across components.
- CSS animations of `transform` and `opacity` run on the compositor and cost no JavaScript at all.
- `prefers-reduced-motion` is a media query, so the reduced path lives beside the motion it replaces and cannot be forgotten in a separate code path.
- `IntersectionObserver` reports visibility off the main thread, unlike a scroll listener.

## Alternatives considered

### Motion (formerly Framer Motion)

A React animation library with layout and exit animations. Rejected because it adds roughly 30–50 KB of JavaScript, up to half the page's budget, for effects that CSS already does here. Its distinctive features (layout animation, shared elements, gestures) have no use on this page.

### GSAP

A timeline-based animation engine. Rejected because timelines solve sequenced, scrubbed choreography that this page does not have, and the library's weight and licence terms are a cost with nothing to buy.

### CSS scroll-driven animations (`animation-timeline: view()`)

Scroll reveals with no JavaScript. Rejected for now because support is still incomplete across browsers in use, and a reveal that plays once is a visibility event rather than a scroll-linked progress value.

## Consequences

- Positive: zero bundle cost for motion; reduced-motion handled in CSS; nothing to hydrate.
- Negative / trade-offs: exit animations need care (an element must stay mounted until its transition ends), and interruptible spring motion is not available. Complex sequencing would be awkward.
- Revisit if: the design needs layout animations, gestures or orchestrated sequences that CSS cannot express without hacks.
