# 0006. GitHub REST API, unauthenticated, two requests per lookup

- Status: Accepted
- Date: 2026-11-20

## Context
The demo needs real public data for any GitHub username: the profile, and enough of the repositories to total stars, count languages and find the most-starred and most recently pushed. The page is static, so anything the browser can read, a visitor can read. GitHub allows 60 unauthenticated REST requests an hour per IP address.

## Decision
The browser calls GitHub's REST API directly with no credentials: `GET /users/{username}` and `GET /users/{username}/repos?per_page=100&sort=pushed&type=owner`, in parallel, with the API version pinned by header.

## Why
- Unauthenticated calls need no secret, so there is nothing to leak and nothing to rotate.
- Two requests give about 30 lookups an hour per visitor network, which is enough for a demo once a cache and example cards cover the rest.
- The REST API sends CORS headers and exposes the rate-limit headers to scripts, so the page can tell a visitor exactly when their limit resets.
- Sorting by `pushed` puts the most recent work first, so "last shipped" is exact even when the account has more than 100 repositories.

## Alternatives considered
### Authenticated calls with a token in the client
Raises the limit to 5,000 an hour. Rejected because a token in a browser bundle is a published token: anyone can extract it and spend its quota or use its scopes.

### A proxy backend holding the token
Keeps the token on a server and adds shared caching. Rejected because it turns a landing page into a service to operate, shares one quota across all visitors (one busy hour locks everyone out), and moves the request lifecycle being assessed out of the client.

### GitHub GraphQL API
One request could return exactly the fields needed, including true totals. Rejected because GraphQL requires authentication for every request, which brings back the token problem.

## Consequences
- Positive: no secrets, no server dependency for the demo, real data, a failure mode (rate limit) that is known in advance and designed for.
- Negative / trade-offs: totals are computed from the 100 most recently pushed repositories, so stars and languages are understated for the few accounts with more; the card says so. The limit is per IP, so visitors behind a shared network share it. Each lookup costs two requests.
- Revisit if: lookups need to be accurate past 100 repositories or the limit blocks real use; add pagination first, then a caching proxy with a server-held token.
