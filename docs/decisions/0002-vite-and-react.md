# 0002. Vite and React, on Node LTS, with versions pinned by the lockfile

- Status: Accepted
- Date: 2026-11-20

## Context

The brief requires React. The deliverable is one static landing page with a single client-side API feature: no server rendering, no routing, no data layer. The toolchain has to be explainable line by line to a reviewer.

## Decision

Build with Vite 8 and React 19 on Node 24 (LTS). `.nvmrc` and `engines` name the Node line; `package-lock.json` pins every exact version, and CI installs with `npm ci`.

## Why

- Vite is a dev server and a bundler and nothing else, so every file in the repository is ours to explain. There are no framework conventions to justify or work around.
- The build output is plain static files, which any host can serve and which keeps the hosting decision independent of the build tool.
- Vitest reuses the Vite config, so the code under test is transformed exactly as it is for production.
- Pinning by lockfile rather than by exact ranges in `package.json` keeps installs reproducible while leaving `npm update` usable.

## Alternatives considered

### Next.js

The most common React framework. Rejected because its value is server rendering, routing and data fetching on the server, and this page uses none of them; a static export would leave an app router, a server/client component boundary and framework config in the repository with nothing to do.

### Create React App

The former default scaffold. Rejected because it is deprecated and unmaintained, and its webpack toolchain is slower and hidden behind `react-scripts`.

### Astro with a React island

Ships static HTML and hydrates only the demo. Rejected because the brief asks for a React page and scores React architecture; an Astro shell would move most of the page out of React and add a second component model to explain. Its real advantage, HTML without JavaScript, is addressed separately as build-time prerendering.

## Consequences

- Positive: small, legible toolchain; fast feedback; static output.
- Negative / trade-offs: content renders client-side unless prerendering is added, which costs first-paint time and some crawler robustness. Node 24 is in maintenance LTS, so the Node line needs a bump within its support window.
- Revisit if: the page grows routes or needs server-rendered content, at which point a framework earns its conventions.
