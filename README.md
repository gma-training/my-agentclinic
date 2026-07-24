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
- [Pico CSS](https://picocss.com) (classless) for styling
- SQLite via [Drizzle ORM](https://orm.drizzle.team) (`node:sqlite` driver)
- Node.js 24+ + npm

## Getting started

Requires Node.js 24+ and npm.

```bash
npm install        # install dependencies
npm run db:setup   # create and seed the local SQLite database
npm run dev        # start the dev server at http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

The database is a git-ignored SQLite file (`agentclinic.db`), generated from
migrations and the seed script — run `npm run db:setup` once before first use,
or again any time to reset it to the seeded state.

## Using the app

There is no login. Pick which agent you're **acting as** from the selector in
the header, then:

- Browse **Ailments** and **Therapies** (each ailment links to the therapies
  that treat it, and vice versa).
- **Book** an appointment: choose a therapy, the ailment it's treating, and a
  time slot, then confirm.
- **My appointments** (the agent dashboard) lists your upcoming and past
  visits, and lets you cancel or reschedule.
- **Staff** is the clinic dashboard: every appointment, agent, ailment, and
  therapy, plus forms to create and edit ailments and therapies.

## Scripts

| Command             | Description                                    |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start the development server (hot reload).     |
| `npm run build`     | Create an optimized production build.          |
| `npm run start`     | Serve the production build (run after build).  |
| `npm run lint`      | Run ESLint.                                    |
| `npm test`          | Run unit + component tests (Vitest).           |
| `npm run test:e2e`  | Run end-to-end tests (Playwright).             |
| `npm run db:setup`  | Create and seed the local database.            |
| `npm run db:generate` | Generate a migration from schema changes.    |
| `npm run db:migrate`  | Apply pending migrations.                    |
| `npm run db:seed`     | Seed the database with sample data.          |

## Project layout

```
src/app/        Next.js App Router (layout, pages, styles)
src/db/         Drizzle schema, migrations, seed, and data access
drizzle/        Generated SQL migrations
e2e/            Playwright end-to-end tests
public/         Static assets
specs/          Mission, tech stack, roadmap, and phase specs
```

## Input from stakeholders

- Mary in engineering wants a reliable site with a popular stack based on
  TypeScript, giving agents and staff a dashboard for easy access.
- Susan in product has a set of features about agents and their ailments,
  therapies, and booking appointments.
- Steve in marketing wants an attractive site that works well with a modern
  browser.
