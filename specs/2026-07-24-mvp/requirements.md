# MVP — Requirements

## Scope

Deliver the rest of AgentClinic's core product as an MVP: everything the
[mission](../mission.md) calls "success" — **an agent can arrive, identify their
ailment, choose an appropriate therapy, book an appointment, and see it
confirmed — while staff can view and manage that activity from their
dashboard.**

Concretely this covers roadmap [Phases 2–6](../roadmap.md), each still shipped
as its own vertical slice, building on the shipped
[Phase 1 — Browse Ailments](../2026-07-22-browse-ailments/):

- **Phase 2 — Therapies:** model therapies and their link to ailments; list and
  detail views; from an ailment, see the therapies that treat it.
- **Phase 3 — Agents:** model agents with a basic profile; view an agent
  profile; introduce the "acting as" agent selector (see decision 2).
- **Phase 4 — Book an appointment:** model appointments (agent + therapy +
  ailment + time slot); a booking flow (choose therapy, pick a slot, confirm)
  and a confirmation view.
- **Phase 5 — Agent dashboard:** the acting agent sees their upcoming and past
  appointments and can cancel or reschedule.
- **Phase 6 — Staff dashboard:** staff see all appointments, agents, ailments,
  and therapies, and can create/edit ailments and therapies.

The app stays demoable at the end of **every** phase, not just at the end of the
MVP.

### In scope

- A persisted **Therapy** model, seeded, with a many-to-many link to
  **Ailment** ("therapies that treat this ailment", and vice versa).
- Therapy **list** (`/therapies`) and **detail** (`/therapies/[slug]`) pages,
  and a "therapies that treat this" section on the ailment detail page.
- A persisted **Agent** model, seeded, with a profile page
  (`/agents/[slug]`).
- An **"acting as" agent selector** (no auth) that sets which seeded agent the
  session is acting as — used by booking and the agent dashboard.
- A persisted **Appointment** model connecting an agent, a therapy, the ailment
  being treated, and a **fixed time slot**; a booking flow and a confirmation
  view.
- A persisted **time-slot** model: seeded, discrete slots per therapy that can
  be booked (see decision 3).
- An **agent dashboard** (`/dashboard` for the acting agent) listing upcoming
  and past appointments, with **cancel** and **reschedule**.
- A **staff dashboard** (`/staff`) listing all appointments/agents/ailments/
  therapies, with **create/edit** for ailments and therapies.
- Tests for each slice: Vitest unit/component tests plus Playwright E2E for the
  async server-component pages and the booking/management flows (per the
  [tech stack](../tech-stack.md)).

### Out of scope

- **Phase 7 polish** — the dedicated styling/empty-state/accessibility/
  responsive pass is deliberately *not* in this MVP. Each slice still uses Pico
  defaults and stays presentable, but the systematic polish pass is a
  fast-follow.
- **Authentication / authorisation / accounts.** Identity is the "acting as"
  selector (decision 2); the staff dashboard is not access-controlled — it is a
  separate area, not a secured one. No passwords, sessions-as-security, or
  per-role permissions.
- **Payments, billing, insurance** (mission non-goal).
- **Deleting** agents; **deleting** appointments (agents cancel, which is a
  status change — see decision 6). Staff create/edit ailments and therapies but
  do not delete them in this MVP.
- **Arbitrary free-form appointment times** — times come from seeded fixed slots
  (decision 3). No calendar/availability engine, recurrence, or time-zone
  handling beyond storing a slot's instant.
- Search, filtering, sorting, or pagination of any list (small seed data, as in
  Phase 1).
- Notifications/email, staff-initiated bookings, and multi-clinic/location
  concepts.

## Decisions

1. **Ship phase-by-phase, not big-bang.** The MVP spans five roadmap phases but
   they are built and verified in roadmap order (2 → 3 → 4 → 5 → 6), each a
   vertical slice that leaves the app demoable. This keeps the teaching example
   honest (every commit is a shippable increment) and de-risks the booking flow,
   which depends on therapies and agents already existing. The
   [plan](./plan.md) is grouped accordingly.

2. **Identity: an "acting as" agent selector, no auth.** The app has no login.
   A selector (e.g. in the header) chooses which seeded **agent** the session is
   currently acting as; booking and the agent dashboard operate as that agent.
   Rationale (mission audiences): a live demo needs to switch agents in one
   click, and students should see the booking/dashboard logic without an auth
   system obscuring it. The acting agent is stored in a **cookie** (a plain
   session value, *not* a security boundary). The staff dashboard is simply a
   different area of the site, not a secured one.

3. **Appointment times: fixed, seeded slots per therapy.** Each therapy has a
   set of discrete, seeded **time slots**. Booking = choosing an available slot
   for a therapy. A slot can be held by at most one active appointment, so
   double-booking is prevented by a uniqueness constraint rather than an
   availability engine. Rationale: deterministic to seed, demo, and test; avoids
   date/time-picker validation and time-zone scope the mission doesn't need.
   Cancelling frees the slot; rescheduling moves the appointment to another free
   slot of the same therapy.

4. **URL identifiers: human-readable `slug`s**, consistent with the Phase 1
   ailments decision. Therapies (`/therapies/[slug]`) and agents
   (`/agents/[slug]`) are keyed by stable, unique slugs. Appointments are keyed
   by a non-guessable id in their own URLs.

5. **Ailment ↔ Therapy is many-to-many** via a join table. A therapy can treat
   several ailments and an ailment can be treated by several therapies. This is
   the natural lead-on from the one-to-many symptoms relation introduced in
   Phase 1 and gives students a second, richer relation to read.

6. **Appointment lifecycle is a status, not a delete.** An appointment has a
   status (`booked` → `cancelled`; a past `booked` slot reads as `completed` by
   time). "Cancel" sets `cancelled` and frees the slot; it does not delete the
   row, so the agent dashboard's "past" list and the staff view keep an honest
   history. "Reschedule" re-points a `booked` appointment at another free slot.

7. **Reads via server components; writes via server actions.** Continuing the
   Phase 1 approach, pages read the database directly in async Server
   Components through the typed data-access module. Mutations (book, cancel,
   reschedule, staff create/edit, set-acting-agent) use **server actions** — no
   bespoke REST/route handlers. This keeps the data flow visible and matches the
   [tech stack](../tech-stack.md).

8. **Staff management is create/edit only** for ailments and therapies (no
   delete), reusing the existing ailment model and the new therapy model.
   Editing an ailment includes its symptoms and its therapy links; editing a
   therapy includes its ailment links and its slots. Forms are plain
   Pico-styled server-action forms.

## Context

- **Product mission.** AgentClinic is a genuine, working clinic-booking product
  themed around AI agents getting relief from their humans. This MVP completes
  the core loop the mission defines as success and gives both audiences — course
  students and conference-demo presenters — the full journey to show. See
  [mission.md](../mission.md).
- **Audiences shape the decisions above.** "Acting as" over auth, and fixed
  slots over a picker, both trade production generality for a demo that spins up
  fast and a spec/codebase that stays approachable — the explicit priorities in
  the mission.
- **Tech stack.** Next.js 16 (App Router) + TypeScript `strict`, React 19, Pico
  CSS (classless), SQLite via Drizzle ORM (`node:sqlite`), Vitest + RTL,
  Playwright. Build **test-first**. See [tech-stack.md](../tech-stack.md).
  **Note:** this Next.js major differs from common training data — read the
  bundled guides under `node_modules/next/dist/docs/` before writing code (per
  [AGENTS.md](../../AGENTS.md)). In particular `params`/`searchParams` are
  Promises to `await`, 404s use `notFound()` + `not-found.tsx`, and server
  actions and `cookies()` have version-specific APIs to check.
- **Starting point.** Phase 1 shipped the ailments data layer (Drizzle schema
  with `ailments` + `symptoms`, a seed script, `getAllAilments` /
  `getAilmentBySlug`), the `/ailments` list and detail pages, a not-found
  experience, and the header with a live "Ailments" link plus **inert
  "Therapies" and "Book" nav items** (`src/app/layout.tsx`) that this MVP makes
  live. See [../2026-07-22-browse-ailments](../2026-07-22-browse-ailments/).
- **Network stance.** Any new dependency (there should be few — the stack is
  already in place) must respect the zero-network posture; if something can't be
  fetched, stop and ask rather than working around it (per
  [AGENTS.md](../../AGENTS.md)).
</content>
</invoke>
