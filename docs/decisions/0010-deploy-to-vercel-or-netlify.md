# 0010. Deploy to Vercel or Netlify with security headers in config

- Status: Superseded by 0012
- Date: 2026-11-20

## Context

The build output is static files. The brief requires security headers, including a Content-Security-Policy, and a fallback for unknown paths. Reviewers need a live link.

## Decision

Deploy the static build to Vercel or Netlify, with headers and the SPA fallback declared in `vercel.json` or `netlify.toml`.

## Why

- Both hosts are free at this scale and serve from a CDN.
- Both build a preview deployment per pull request, so Lighthouse can run before merging.
- Both set response headers from a file in the repository, so the security policy is versioned and reviewable.

## Alternatives considered

### GitHub Pages

Free static hosting from the repository. Rejected because it cannot set custom response headers, so a Content-Security-Policy could only be a `<meta>` tag, which cannot express `frame-ancestors` and leaves the other headers missing.

### A self-managed server

A VPS with nginx. Rejected because it adds patching, TLS and uptime work that buys nothing for static files.

## Consequences

- Positive: headers in config, preview deploys, no servers.
- Negative / trade-offs: host-specific config file; the waitlist needs a separate provider unless Netlify Forms is used.
- Revisit if: the project owner names a host. This happened: see 0012.
