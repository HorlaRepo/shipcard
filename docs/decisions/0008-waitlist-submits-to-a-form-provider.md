# 0008. Waitlist submits to a hosted form provider behind `submitWaitlist()`

- Status: Superseded by 0013
- Date: 2026-11-20

## Context
The waitlist form has to do something real: a form that shows "You're on the list" without sending anything is a dishonest interface. The brief puts a custom backend out of scope, and the page is static.

## Decision
The form posts to a hosted form endpoint (Formspree or Netlify Forms). The component never talks to the provider; it calls `submitWaitlist(email)` in the waitlist feature, which owns the URL, the request and the error mapping.

## Why
- A hosted endpoint gives real submissions with no server to write or run.
- The service function is the only place that knows the provider, so changing provider is a change to one file and its tests.
- The endpoint ID is public by design, so no secret enters the bundle.

## Alternatives considered
### A fake success message
Show a success state without a request. Rejected because it lies to the visitor, and the failure states the brief asks for would be untestable fiction.

### A custom backend
A server and a database for sign-ups. Rejected as out of scope for a landing page at the time of this decision.

## Consequences
- Positive: real behaviour; a swappable provider.
- Negative / trade-offs: depends on a third-party account and its free-tier limits; the provider's origin has to be allowed in the Content-Security-Policy; submissions live in someone else's dashboard.
- Revisit if: the host changes or the provider's limits bite. This happened: see 0013, which keeps the `submitWaitlist()` boundary and replaces the provider.
