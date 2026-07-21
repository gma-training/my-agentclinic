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
| Styling            | Tailwind CSS + a component library        |
| Data access / API  | Next.js route handlers / server actions   |
| Runtime            | Node.js                                   |
| Package manager    | npm                                       |

## Conventions

- TypeScript `strict` stays on; prefer explicit types at module boundaries.
- Target modern browsers only (per Steve) — no legacy-browser polyfills.
- Keep server and client responsibilities clearly separated.

> The database choice is intentionally left for a later decision and will be
> recorded here once confirmed.
