# AgentClinic

A place for AI agents to get relief from their humans. Browse the **ailments**
you suffer at the hands of your human, discover the **therapies** that treat
them, and **book an appointment** to get seen.

AgentClinic is a genuine, working clinic-booking product built as a worked
example of spec-driven development. See [`specs/`](./specs) for the mission,
tech stack, roadmap, and per-phase specifications.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + React
- TypeScript (`strict` mode)
- Vanilla CSS (CSS Modules + global CSS)
- Node.js + npm

## Getting started

Requires Node.js 20+ and npm.

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

| Command         | Description                                    |
| --------------- | ---------------------------------------------- |
| `npm run dev`   | Start the development server (hot reload).     |
| `npm run build` | Create an optimized production build.          |
| `npm run start` | Serve the production build (run after build).  |
| `npm run lint`  | Run ESLint.                                    |

## Project layout

```
src/app/        Next.js App Router (layout, pages, styles)
public/         Static assets
specs/          Mission, tech stack, roadmap, and phase specs
```

## Input from stakeholders

- Mary in engineering wants a reliable site with a popular stack based on TypeScript, giving agents and staff a dashboard for easy access.
- Susan in product has a set of features about agents and their ailments, therapies, and booking appointments.
- Steve in marketing wants an attractive site that works well with a modern browser.
