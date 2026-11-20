# 0013. Waitlist endpoint on a Cloudflare Worker with KV storage

- Status: Accepted
- Date: 2026-11-20

## Context

New evidence since 0008: the project owner instructed that the backend be deployed on Cloudflare (brief amendment, 2026-11-20), and the page is now served by a Worker (0012). The only server-side behaviour the page needs is accepting a waitlist email. The requirement from 0008 stands: the form must really submit, and the provider must be swappable behind `submitWaitlist()`.

## Decision

The Worker that serves the page handles `POST /api/waitlist`. It validates the email again on the server, stores it in a Workers KV namespace keyed by the lowercased address, and answers with JSON. The form still calls only `submitWaitlist(email)`.

## Why

- The endpoint is same-origin, so it needs no third-party account, no CORS policy and no extra Content-Security-Policy host. 0008 listed all three as costs.
- The sign-ups are held in the owner's own Cloudflare account rather than a form provider's dashboard.
- KV is a key-value store, and a waitlist is a set of keys: writing the same email twice overwrites one entry, so duplicates need no query and no schema.
- The `submitWaitlist()` boundary from 0008 is unchanged, so the component and its tests did not need to know the provider moved.
- The endpoint is about fifty lines and is tested as a plain function: a `Request` in, a `Response` out.

## Alternatives considered

### Formspree or Netlify Forms (0008)

Rejected because the owner's instruction puts the backend on Cloudflare. Netlify Forms also only works on Netlify hosting, which 0012 moved away from, and Formspree would be a second vendor, a third-party origin in the security policy and an account outside the owner's control.

### Cloudflare D1 (SQLite)

A relational table with a unique index on email. Rejected because one column with a uniqueness rule is exactly what a key-value store gives for free; D1 would add a schema, a migration step and SQL for no query the page ever runs.

### A fake success message

Rejected for the reason given in 0008: it lies to the visitor.

## Consequences

- Positive: real submissions on the owner's platform; one origin; no vendor account; a small, testable handler.
- Negative / trade-offs: this is a backend, however small, on a project whose brief first ruled one out: it stores personal data (email addresses), so the page states what is stored and why. KV is eventually consistent, which is acceptable for a write-only list. The endpoint is public, so it is protected only by validation, a honeypot field and Cloudflare's network-level abuse controls; there is no confirmation email, so addresses are unverified.
- Revisit if: the list needs verified addresses (add double opt-in through an email service), exports or queries (move to D1), or abuse appears (add Turnstile).
