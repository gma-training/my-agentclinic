# Phase 1 — Browse Ailments: Requirements

## Scope

Deliver the second vertical slice from the [roadmap](../roadmap.md): agents can
**browse the ailments they suffer**. This phase introduces the first real domain
data and the first data layer for the app. It ships end-to-end — a persisted
data model, a seeded set of ailments, a list page, and a detail page — so the
app remains demoable.

This is also the phase where the deferred **database decision** is made and
recorded (see decision 1), because the roadmap now requires modelling and
persisting domain data.

### In scope

- A persisted **Ailment** model with seed data (a handful of agent-themed
  ailments).
- A **list page** at `/ailments` showing every ailment (name, short
  description, severity).
- A **detail page** at `/ailments/[slug]` showing one ailment in full (name,
  short description, severity, symptoms).
- A **not-found** experience for an unknown ailment slug (real 404).
- Navigation: the header "Ailments" link points to `/ailments`.
- Tests: Vitest unit/component tests plus Playwright E2E for the async server
  component pages (per the tech stack).

### Out of scope

- **Therapies** and any link between ailments and therapies (Phase 2). Detail
  pages will *not* yet show "therapies that treat this".
- **Agents**, **appointments**, dashboards, booking (Phases 3+).
- Creating/editing/deleting ailments (staff management is Phase 6). This phase
  is read-only browsing over seed data.
- Search, filtering, sorting, or pagination of the ailment list.
- Authentication/authorisation.

## Decisions

1. **Persistence: SQLite via Drizzle ORM (`better-sqlite3`).**
   The roadmap now requires modelling and persisting data, so we resolve the
   database choice the tech stack deferred. We use a local **SQLite** database
   accessed through **Drizzle ORM** with the **`better-sqlite3`** driver.
   Rationale:
   - *Popular & reliable stack* (mission): SQLite + Drizzle is a mainstream,
     well-supported combination for Next.js.
   - *Approachable teaching reference* (mission): Drizzle's schema is plain
     TypeScript and its queries read like SQL, so students see the data layer
     clearly rather than behind heavy abstraction.
   - *Quick to spin up / reliable demos* (mission): a single committed SQLite
     file with a seed script means no external database service to run. This
     also keeps the **zero-network** stance the project already adopted for
     fonts — Drizzle is pure TypeScript with **no code-generation or binary
     download step** (unlike a query-engine-based ORM).
   - This decision must be **recorded back into
     [tech-stack.md](../tech-stack.md)** (replacing the "database choice is
     deferred" note) — see [plan.md](./plan.md).

2. **URL identifier: human-readable `slug`.**
   Detail pages are keyed by a slug (e.g. `/ailments/context-window-anxiety`)
   rather than a numeric id. Slugs read clearly in a live demo and make the
   teaching example self-descriptive. Each ailment has a stable, unique slug.

3. **Ailment fields:** `name`, `shortDescription`, `severity`, and `symptoms`.
   - `name` — the ailment's title (e.g. "Context Window Anxiety").
   - `slug` — unique URL identifier (see decision 2).
   - `shortDescription` — one/two-line summary shown in the list and at the top
     of the detail page.
   - `severity` — one of `mild` | `moderate` | `severe`, shown as a badge in
     both list and detail.
   - `symptoms` — a list of short symptom strings shown on the detail page.
   No longer "detail body" field this phase — `shortDescription` + `symptoms`
   give enough content to be demoable without inventing clinical copy.

4. **Symptoms modelled as a related table (one ailment → many symptoms).**
   Rather than packing symptoms into a JSON column, we store them in a separate
   `symptoms` table with a foreign key to `ailments`. This demonstrates a real
   one-to-many relation in the data layer — useful teaching value, and a natural
   lead-in to the ailment↔therapy relations coming in Phase 2.

5. **Seed data, not fixtures.** A committed seed script populates a handful
   (~6) of on-theme ailments. The list is intentionally small so pages stay
   readable in a demo; no pagination is needed.

6. **Read-only server components fetch data directly.** The list and detail
   pages are async Server Components that query the database through a small
   typed data-access module (e.g. `getAllAilments`, `getAilmentBySlug`). No
   route handlers/API endpoints are introduced this phase — pages read data
   server-side directly, matching the tech stack's "server actions / direct
   access" approach.

## Context

- **Product mission:** AgentClinic is a genuine clinic-booking product themed
  around AI agents getting relief from their humans. "Browse ailments" is the
  first place an agent identifies what ails them. See [mission.md](../mission.md).
- **Audiences:** course students learning spec-driven development, and
  developers giving live AI coding demos. This phase must stay approachable
  (clear data layer, readable URLs) and quick to spin up (single SQLite file,
  seed script).
- **Tech stack:** Next.js 16 (App Router) + TypeScript `strict`, React 19,
  Pico CSS (classless), Vitest + RTL, Playwright. See
  [tech-stack.md](../tech-stack.md). **Note:** Next.js in this repo is a newer
  major than common training data — implementation must read the bundled guides
  under `node_modules/next/dist/docs/` (per [AGENTS.md](../../AGENTS.md)). In
  particular, `params` is a `Promise` that must be awaited, and 404s use
  `notFound()` + a `not-found.tsx`.
- **Starting point:** Phase 0 shipped a branded landing page with header/nav
  placeholders (the "Ailments" nav item is currently inert text). There is no
  data layer yet. See [../2026-07-21-project-skeleton](../2026-07-21-project-skeleton/).
