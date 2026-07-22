# Phase 1 — Browse Ailments: Validation

The phase is done and mergeable when all of the following hold.

## Data layer

- [x] A SQLite database is defined with Drizzle: an `ailments` table
      (`id`, unique `slug`, `name`, `shortDescription`, `severity`) and a
      related `symptoms` table (one ailment → many symptoms).
- [x] `severity` is constrained to `mild | moderate | severe` at the type
      boundary.
- [x] A seed script populates ~6 on-theme ailments (each with a slug, severity,
      and symptoms) and is safe to re-run (idempotent).
- [x] `getAllAilments()` returns every seeded ailment; `getAilmentBySlug(slug)`
      returns one ailment (with its symptoms) or a not-found result for an
      unknown slug. Both are covered by passing Vitest tests.

## List page (`/ailments`)

- [ ] `/ailments` lists **all** seeded ailments, each showing name, short
      description, and a severity badge.
- [ ] Each list item links to that ailment's detail page.
- [ ] The page has an appropriate title/metadata.

## Detail page (`/ailments/[slug]`)

- [ ] `/ailments/[slug]` shows the ailment's name, severity, short description,
      and its list of symptoms.
- [ ] A link returns the user to `/ailments`.
- [ ] An unknown slug (e.g. `/ailments/does-not-exist`) renders an on-theme
      not-found UI **and** responds with HTTP 404.

## Navigation

- [ ] The header "Ailments" nav item links to `/ailments`.
- [ ] "Therapies" and "Book" remain inert (unchanged from Phase 0).

## Tests

- [ ] `npm test` (Vitest) passes: data-access and presentational-component
      tests are green.
- [ ] `npm run test:e2e` (Playwright) passes: list shows all ailments, clicking
      through reaches a detail page with symptoms/severity, and an unknown slug
      404s.

## Build & scripts

- [ ] `npm run build` completes with **no** TypeScript or lint errors
      (`strict` stays on).
- [ ] `npm run lint` passes.
- [ ] `npm run dev` serves `/ailments` and a detail page in a modern browser
      with Pico styling applied.
- [ ] Documented setup (generate/migrate/seed) works from a fresh clone so a
      reviewer can get a populated database and run the app.

## Docs

- [ ] [tech-stack.md](../tech-stack.md) records the database decision (SQLite +
      Drizzle + `better-sqlite3`), replacing the deferred-decision note.
- [ ] `README.md` documents the database setup/seed steps.

## Outcome check

- [ ] Per the roadmap: **an agent can see what ails them.** A reviewer can run
      the app, open `/ailments`, browse the list, and click into an ailment to
      read its details — the slice is demoable end-to-end.
