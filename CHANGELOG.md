# Changelog

## 2026-07-24

- Wrote the MVP specs (requirements, plan, validation) covering roadmap phases
  2–6, and built them out end-to-end.
- Added **Therapies**: a therapy model linked many-to-many to ailments, seeded
  on-theme treatments, `/therapies` list and detail pages, and a "therapies that
  treat this" section on each ailment.
- Added **Agents** and an "acting as" agent selector in the header (cookie-based,
  no auth) so the session can switch between seeded agents, plus agent profile
  pages.
- Added **appointment booking**: fixed per-therapy time slots, a booking flow
  (choose therapy, ailment, and slot), a confirmation page, and a unique-index
  guard that prevents double-booking a slot.
- Added the **agent dashboard** (`/dashboard`): upcoming and past appointments
  with cancel and reschedule (cancelling frees the slot; both are status/slot
  changes, not deletes).
- Added the **staff dashboard** (`/staff`): a read-only overview of all
  appointments, agents, ailments, and therapies, plus forms to create and edit
  ailments and therapies.
- Wired the header nav (Therapies, Book, My appointments, Staff) and documented
  the demo flow in the README.
- Added the `/ailments` list page and `/ailments/[slug]` detail page (with an
  on-theme not-found page), completing the Browse Ailments slice — an agent can
  browse ailments and read each one's symptoms and severity.
- Moved the header, navigation, and footer into the root layout so every page
  shares them, and wired the "Ailments" nav link.
- Isolated test data from development: unit tests run against an in-memory
  database, and end-to-end tests against a throwaway seeded database on a
  separate port, so neither touches the dev database.
- Added Playwright end-to-end tests for the ailments flow (list, detail, and
  not-found).
- Adopted the Arrange–Act–Assert structure across the tests and standardised on
  `.test.` file naming.
- Set the minimum Node version to 24 and declared the package as ESM.
- Documented the database decision and setup/seed steps in the tech stack and
  README.

## 2026-07-23

- Added testing guidelines for the project.
- Cached the Playwright browser in a Docker volume so it isn't reinstalled on
  each container build.

## 2026-07-22

- Added a `/changelog` skill for maintaining this file.
- Set up the testing stack: Vitest for unit/component tests and Playwright for
  end-to-end tests, and recorded the decision in the tech stack and plan.
- Improved the React ESLint configuration.
- Marked Phase 0 (project skeleton) complete in the roadmap.
- Wrote the Phase 1 (Browse Ailments) specs — requirements, plan, and
  validation.
- Built the SQLite data layer with Drizzle ORM (`node:sqlite` driver): schema
  for ailments and their symptoms, migrations, an idempotent seed of six
  on-theme ailments, and typed `getAllAilments` / `getAilmentBySlug` data-access
  functions.

## 2026-07-21

- Scaffolded the Next.js + TypeScript app and moved it into the project root.
- Added a styled landing page.
- Vendored the Geist font and documented the font stack.
- Dropped Tailwind in favour of vanilla CSS.
- Wrote the Phase 0 specs (requirements, plan, validation).
- Added the project "constitution" docs (roadmap, tech stack, target audiences)
  and expanded the README.
- Configured the devcontainer: egress firewall, persisted `~/.claude`, and
  disabled telemetry.

## 2026-07-17

- Initialised the repository and devcontainer.
