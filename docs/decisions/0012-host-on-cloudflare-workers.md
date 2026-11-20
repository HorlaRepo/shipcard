# 0012. Host on Cloudflare Workers with static assets

- Status: Accepted
- Date: 2026-11-20

## Context
New evidence since 0010: the project owner instructed that both the frontend and the backend be deployed on Cloudflare (brief amendment, 2026-11-20). The requirements behind 0010 are unchanged: static files on a CDN, security headers including a Content-Security-Policy versioned in the repository, a fallback for unknown paths, and a way to preview a build before it goes live.

## Decision
One Cloudflare Worker serves the built page from static assets and handles the waitlist endpoint (0013). `wrangler.jsonc` declares the Worker, its assets directory and its bindings; `public/_headers` declares the security headers.

## Why
- Static assets on Workers are served from Cloudflare's edge without invoking the Worker, so the page costs no compute; only `/api/*` runs code.
- One Worker means one origin. The form posts to a same-origin path, so there is no CORS policy to write and `connect-src` needs no extra host for it.
- `_headers` is read at the edge and lives in the repository, so the security policy is reviewed like code, which was the reason for rejecting GitHub Pages in 0010 and still holds.
- `wrangler versions upload` gives every build a preview URL without promoting it, which replaces the preview deployments 0010 relied on.
- The free plan covers a landing page many times over.

## Alternatives considered
### Cloudflare Pages
Cloudflare's original static hosting product, with Pages Functions for server code. Rejected because Cloudflare now directs new projects to Workers with static assets and develops new features there; Pages Functions would also put the endpoint in a file-routed `functions/` directory with Pages-specific conventions, a second mental model for one route.

### Two deployments: a static site and a separate API Worker
The frontend on one hostname and the API on another. Rejected because the split buys nothing at this size and costs a CORS policy, a second deploy step and an extra host in the Content-Security-Policy.

### Stay on Vercel or Netlify (0010)
Rejected because the owner's instruction names Cloudflare; no technical finding was needed to overturn 0010, and none of its requirements is lost in the move.

## Consequences
- Positive: frontend and backend on one platform and one origin; headers in the repository; preview URLs per build; no cold servers.
- Negative / trade-offs: `wrangler` joins the dev dependencies and is the largest of them. Preview URLs are produced by a command, not automatically per pull request as on Vercel or Netlify. The config is Cloudflare-specific, though the build output remains plain static files and the Worker is a standard `fetch` handler.
- Revisit if: the page needs automatic per-pull-request previews (connect Workers Builds to the repository) or the owner changes host.
