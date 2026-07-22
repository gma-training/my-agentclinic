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
  integration with **Pico CSS** for a polished modern-browser experience with
  minimal styling effort.

## Layers

| Concern            | Choice                                    |
| ------------------ | ----------------------------------------- |
| Language           | TypeScript (`strict` mode)                |
| Framework          | Next.js (App Router)                      |
| UI                 | React (server + client components)        |
| Styling            | Pico CSS (semantic classless framework)   |
| Data access / API  | Next.js route handlers / server actions   |
| Runtime            | Node.js                                   |
| Package manager    | npm                                       |
| Testing            | Vitest + RTL (unit), Playwright (E2E)     |

## Development approach

We build **test-first**. We only add production code to make a failing test
pass:

- Before starting a feature, write a failing test that describes the desired
  behaviour.
- Add just enough production code to make that test pass.
- No production code is written without a failing test motivating it.

Tooling, in two layers:

- **Vitest** with **React Testing Library** (`jsdom` environment) for unit and
  component tests — fast, and the default red-green loop.
- **Playwright** for end-to-end tests. Vitest cannot test `async` Server
  Components, so those are covered by E2E tests against a running app.

## Conventions

- TypeScript `strict` stays on; prefer explicit types at module boundaries.
- Target modern browsers only (per Steve) — no legacy-browser polyfills.
- Keep server and client responsibilities clearly separated.
- Style with **Pico CSS**, a lightweight, mostly classless framework that styles
  semantic HTML elements directly — giving an attractive modern look with minimal
  markup. Reach for custom CSS only where Pico's defaults fall short.

> The database choice is intentionally left for a later decision and will be
> recorded here once confirmed.
