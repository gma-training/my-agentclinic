# Phase 0 — Project Skeleton: Requirements

## Scope

Deliver the first vertical slice from the [roadmap](../roadmap.md): a running
Next.js + TypeScript application that renders a branded AgentClinic landing page
in a modern browser, with working build and dev scripts. No domain features
(ailments, therapies, agents, appointments) are in scope yet — this phase
establishes the foundation every later phase builds on.

### In scope

- Scaffold a Next.js (App Router) app in TypeScript `strict` mode at the repo
  root, replacing the existing bare TypeScript setup.
- A branded home page: AgentClinic name, tagline ("relief from your humans"),
  and header/nav placeholders, with basic styling.
- Working `dev`, `build`, and `start` scripts.
- Lint/format tooling as provided by the scaffold.

### Out of scope

- Any data model or persistence (database choice is deferred per the tech
  stack).
- Ailments, therapies, agents, appointments, dashboards, or routing beyond the
  home page.
- A CSS framework — we use vanilla CSS (see decisions).
- A component library (deferred until a phase needs rich components).

## Decisions

1. **Scaffold with `create-next-app`, replacing the bare TS setup.**
   The existing root files (`package.json` with a `tsc`/commonjs build,
   `src/index.ts`, the current `tsconfig.json`) are replaced by a fresh
   `create-next-app` (TypeScript, App Router, ESLint). Cleanest path and matches
   the tech-stack recommendation of a single Next.js app.

2. **Vanilla CSS; no CSS framework, no component library.**
   Styling uses vanilla CSS — CSS Modules for component-scoped styles and global
   CSS for app-wide styles — per the [tech stack](../tech-stack.md). No CSS
   framework is used. This keeps the foundation minimal and easy to read as a
   teaching reference. A component library remains deferred until a
   phase needs rich components.

3. **Branded landing page.**
   The home page shows the AgentClinic brand, the "relief from your humans"
   tagline, and header/nav placeholders — enough to be demoable and on-theme
   without wiring up sections that don't exist yet.

4. **App at repo root.**
   The Next.js app lives at the repo root (not a subdirectory) to keep the
   project structure flat and approachable for course students and demos.

5. **Vendor the Geist font locally (no Google Fonts fetch).**
   We keep the scaffold's intended Geist typeface, but self-host it instead of
   fetching from Google Fonts. The variable `woff2` files (Geist Sans and Geist
   Mono) are committed under `src/app/fonts/` alongside their SIL OFL license,
   and loaded with `next/font/local`. This keeps the Geist look with **zero**
   network dependency at build or runtime, so the build and demo stay reliable
   and quick to spin up. (The `create-next-app` default uses
   `next/font/google`, which fetches Geist from Google Fonts at build time — a
   network call we deliberately avoid rather than open the egress firewall to
   Google's font CDN.)

## Context

- **Product mission:** AgentClinic is a genuine, working clinic-booking product
  themed around AI agents getting relief from their humans. See
  [mission.md](../mission.md).
- **Audiences:** course students learning spec-driven development, and
  developers giving live AI coding demos. This shapes Phase 0: the app must be
  quick to spin up, easy to explain, and attractive in a modern browser.
- **Tech stack:** Next.js (App Router) + TypeScript `strict`, React, Node.js,
  npm. See [tech-stack.md](../tech-stack.md).
- **Starting point:** the repo currently has only a placeholder TypeScript
  setup (`package.json`, `tsconfig.json`, `src/index.ts`) that this phase
  replaces.
