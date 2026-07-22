# Tech Stack

Guiding principle (from Mary in engineering): a **reliable site on a popular
stack**, built with **TypeScript**, giving agents and staff a dashboard for easy
access. From Steve in marketing: it should look attractive in a **modern
browser**.

## Recommendation: Next.js (full-stack TypeScript)

We build AgentClinic as a single **Next.js** (App Router) application written in
**TypeScript**, server-side and client-side in one codebase.

### Why Next.js

- **Popular and reliable.** The most widely used full-stack TypeScript framework,
  with a large ecosystem, long-term support, and easy hiring/onboarding.
- **One codebase.** Server-side rendering, API/route handlers, and the React UI
  live together — no separate backend service to run and coordinate.
- **Dashboards.** React plus server components make the agent and staff
  dashboards straightforward to build and keep fast.
- **Attractive by default.** Modern rendering, good performance, and easy
  integration with a component/styling system for a polished modern-browser
  experience.

## Layers

| Concern            | Choice                                    |
| ------------------ | ----------------------------------------- |
| Language           | TypeScript (`strict` mode)                |
| Framework          | Next.js (App Router)                      |
| UI                 | React (server + client components)        |
| Styling            | Vanilla CSS (CSS Modules / global CSS)    |
| Data access / API  | Next.js route handlers / server actions   |
| Runtime            | Node.js                                   |
| Package manager    | npm                                       |
| Testing            | _To be decided_                           |

## Development approach

We build **test-first**. We only add production code to make a failing test
pass:

- Before starting a feature, write a failing test that describes the desired
  behaviour.
- Add just enough production code to make that test pass.
- No production code is written without a failing test motivating it.

## Conventions

- TypeScript `strict` stays on; prefer explicit types at module boundaries.
- Target modern browsers only (per Steve) — no legacy-browser polyfills.
- Keep server and client responsibilities clearly separated.
- Style with vanilla CSS — CSS Modules for component-scoped styles and global
  CSS for app-wide styles. No CSS framework and no component library.

> The database choice is intentionally left for a later decision and will be
> recorded here once confirmed.
