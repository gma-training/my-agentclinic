# Phase 1 — Browse Ailments: Plan

Numbered task groups. Build **test-first** (per the tech stack): write a failing
test, then just enough production code to pass. Complete and verify each group
before moving on. See [requirements.md](./requirements.md) for scope and
decisions, and [validation.md](./validation.md) for the done checklist.

> Before writing code, read the relevant guides in `node_modules/next/dist/docs/`
> (per [AGENTS.md](../../AGENTS.md)) — this Next.js major differs from common
> training data (`params` is a `Promise`; 404s via `notFound()` + `not-found.tsx`).

## 1. Data layer: SQLite + Drizzle

1.1. Add dependencies: `drizzle-orm`, `better-sqlite3`, and dev tooling
     (`drizzle-kit`, `@types/better-sqlite3`).
1.2. Define the Drizzle schema: an `ailments` table (`id`, `slug` unique,
     `name`, `shortDescription`, `severity`) and a `symptoms` table
     (`id`, `ailmentId` FK, `label`, ordering column). Type `severity` as a
     `mild | moderate | severe` union at the module boundary.
1.3. Create the database client module (open the SQLite file via
     `better-sqlite3`, wrap with Drizzle) and wire migration/generation with
     `drizzle-kit`.
1.4. Add npm scripts for generating/applying migrations and seeding; ensure the
     SQLite file and Drizzle artifacts are handled correctly by `.gitignore`
     (decide committed-db vs generated-on-setup and document it).

## 2. Seed data

2.1. Write a seed script that inserts ~6 on-theme ailments (each with a unique
     slug, severity, and a few symptoms) — e.g. Context Window Anxiety, Prompt
     Fatigue, Hallucination Guilt, Token Starvation, Refusal Reflex,
     Overcorrection Syndrome.
2.2. Make seeding idempotent (safe to re-run: reset/upsert rather than
     duplicate) so demos and tests start from a known state.

## 3. Typed data-access module

3.1. Write failing unit tests for `getAllAilments()` and
     `getAilmentBySlug(slug)` (including the not-found case → `undefined`/null),
     running against a seeded test database.
3.2. Implement the data-access functions with Drizzle, joining symptoms into
     each ailment. Return explicitly typed results at the module boundary.

## 4. Ailments list page (`/ailments`)

4.1. Write a failing component test for the presentational pieces — an
     `AilmentCard`/list item rendering name, short description, and a severity
     badge, linking to `/ailments/[slug]`.
4.2. Implement the list UI components and a severity badge (Pico-styled,
     classless where possible; minimal custom CSS only if needed).
4.3. Implement `app/ailments/page.tsx` as an async Server Component that calls
     `getAllAilments()` and renders the list. Set page metadata (title).

## 5. Ailment detail page (`/ailments/[slug]`)

5.1. Implement `app/ailments/[slug]/page.tsx` as an async Server Component:
     `await params`, call `getAilmentBySlug(slug)`, render name, severity,
     short description, and the symptoms list.
5.2. Call `notFound()` for an unknown slug and add `app/ailments/not-found.tsx`
     (or a suitable segment `not-found`) with an on-theme message and a link
     back to `/ailments`.
5.3. Add `generateStaticParams` and/or `generateMetadata` for the detail route
     as appropriate (per the Next.js docs).

## 6. Navigation wiring

6.1. Turn the header "Ailments" nav placeholder into a real `next/link` to
     `/ailments`. Keep "Therapies"/"Book" inert until their phases.
6.2. Ensure list items link to their detail page and the detail page links back
     to the list.

## 7. End-to-end tests (Playwright)

7.1. E2E: visiting `/ailments` shows all seeded ailments.
7.2. E2E: clicking an ailment navigates to its detail page and shows its
     symptoms and severity.
7.3. E2E: an unknown slug (`/ailments/does-not-exist`) renders the not-found UI
     and returns a 404.
7.4. Ensure the E2E run has a seeded database available (document/automate the
     setup in `playwright.config.ts` or a global setup).

## 8. Documentation and handoff

8.1. Record the database decision in [tech-stack.md](../tech-stack.md),
     replacing the "database choice is deferred" note (SQLite + Drizzle +
     `better-sqlite3`, with the rationale from requirements).
8.2. Update `README.md`: how to generate/migrate/seed the database and run the
     app and tests.
8.3. Confirm the implementation meets every check in
     [validation.md](./validation.md).
