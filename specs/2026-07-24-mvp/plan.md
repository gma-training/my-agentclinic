# MVP — Plan

Numbered task groups, grouped by roadmap phase and built in order (2 → 6). Build
**test-first** (per the [tech stack](../tech-stack.md)): write a failing test,
then just enough production code to pass. Complete and verify each phase — it
should be demoable — before starting the next. See
[requirements.md](./requirements.md) for scope and decisions, and
[validation.md](./validation.md) for the done checklist.

> Before writing code, read the relevant guides in `node_modules/next/dist/docs/`
> (per [AGENTS.md](../../AGENTS.md)). This Next.js major differs from common
> training data: `params`/`searchParams` are Promises; 404s use `notFound()` +
> `not-found.tsx`; **server actions** and **`cookies()`** have version-specific
> APIs — check them before writing the booking/management/selector code.

Each phase should update `CHANGELOG.md` (via the [`/changelog`](../../.claude/skills/changelog/SKILL.md)
skill) and, where relevant, `README.md`.

## Phase 2 — Therapies

1. **Data layer.**
   1.1. Extend the Drizzle schema: a `therapies` table (`id`, unique `slug`,
        `name`, `shortDescription`, plus any therapy fields, e.g. `duration`)
        and an `ailment_therapies` **join table** for the many-to-many link
        (decision 5). Generate the migration.
   1.2. Seed ~6 on-theme therapies (e.g. Rubber-Duck Debugging, Context
        Compaction, Prompt Journaling, Rate-Limit Meditation) and link each to
        one or more seeded ailments. Keep seeding idempotent.
2. **Data access (test-first).**
   2.1. Failing tests for `getAllTherapies()`, `getTherapyBySlug(slug)` (with
        its treated ailments), and `getTherapiesForAilment(ailmentId/slug)`.
   2.2. Implement them with Drizzle joins; typed at the module boundary.
3. **Pages & nav.**
   3.1. Component test + `TherapyCard`; `/therapies` list Server Component.
   3.2. `/therapies/[slug]` detail Server Component (await `params`,
        `notFound()` for unknown slug, segment `not-found.tsx`).
   3.3. Add a "Therapies that treat this" section to the ailment detail page,
        linking each therapy to its detail page.
   3.4. Make the header **"Therapies"** nav item a real link.
4. **E2E.** `/therapies` lists all; click-through reaches a detail page showing
   its treated ailments; ailment detail shows its therapies; unknown slug 404s.

## Phase 3 — Agents & the "acting as" selector

5. **Data layer.**
   5.1. `agents` table (`id`, unique `slug`, `name`, profile fields — e.g.
        `model`/`role`, `bio`). Migration + idempotent seed (~4 agents).
   5.2. Data access (test-first): `getAllAgents()`, `getAgentBySlug(slug)`.
6. **Agent profile.** `/agents/[slug]` Server Component (name + profile);
   `notFound()` for unknown slug. Component test for the profile presentation.
7. **"Acting as" selector (decision 2).**
   7.1. A cookie-backed notion of the **acting agent** with a small helper
        (`getActingAgent()` / a `setActingAgent` **server action**). Read
        `cookies()` per the Next.js docs.
   7.2. A header selector (client component posting to the server action) to
        switch acting agent; reflect the current agent in the header. Component
        test for the selector; default/empty state when none is chosen.

## Phase 4 — Book an appointment

8. **Data layer.**
   8.1. `time_slots` table (`id`, `therapyId` FK, `startsAt`) — seeded discrete
        slots per therapy (decision 3). `appointments` table (`id`,
        non-guessable public id, `agentId`, `therapyId`, `ailmentId`, `slotId`,
        `status`). Enforce **one active appointment per slot** with a unique
        constraint. Migration + seed of slots.
   8.2. Data access (test-first): available slots for a therapy, create an
        appointment, and the guard that a taken slot cannot be rebooked.
9. **Booking flow (server actions; test-first on the action logic).**
   9.1. Entry from a therapy (and/or ailment) → choose therapy → pick an
        available **slot** → confirm. The acting agent (Phase 3) is the booker;
        prompt to pick an agent first if none is set.
   9.2. `bookAppointment` server action: validate the slot is still free
        (handle the race → friendly "slot just taken" path), create the
        appointment, redirect to confirmation.
   9.3. **Confirmation view** showing agent, therapy, ailment, and slot time.
   9.4. Make the header **"Book"** nav item a real link.
10. **E2E.** Acting as an agent, book a therapy's slot end-to-end and land on a
    confirmation; the booked slot no longer appears as available.

## Phase 5 — Agent dashboard

11. **Data access (test-first).** Upcoming vs past appointments for an agent
    (by slot time + status); cancel and reschedule helpers.
12. **Dashboard page.** `/dashboard` (the acting agent) Server Component:
    upcoming and past lists; empty state when the agent has none.
13. **Cancel / reschedule (server actions, decision 6).**
    13.1. `cancelAppointment` → status `cancelled`, frees the slot; test the
          slot becomes bookable again.
    13.2. `rescheduleAppointment` → move a `booked` appointment to another free
          slot of the same therapy; test old slot freed / new slot taken.
14. **E2E.** Book, see it under "upcoming", cancel it (moves out of upcoming),
    and reschedule another to a different slot.

## Phase 6 — Staff dashboard

15. **Staff overview.** `/staff` Server Component listing all appointments,
    agents, ailments, and therapies (read-only tables, links to detail).
16. **Manage ailments (server actions, decision 8; test-first).** Create/edit
    an ailment including its symptoms and therapy links. Pico-styled forms;
    validate required fields and slug uniqueness.
17. **Manage therapies (server actions; test-first).** Create/edit a therapy
    including its ailment links and its time slots.
18. **E2E.** From `/staff`, create a new ailment and a new therapy and see them
    appear on their public list pages; edit one and see the change.

## Cross-cutting: documentation & handoff

19. **Docs.** Keep `README.md` current (any new scripts/setup) and run
    [`/changelog`](../../.claude/skills/changelog/SKILL.md) per phase. If any
    decision here changes (e.g. a schema choice), record it back in
    [requirements.md](./requirements.md) / [tech-stack.md](../tech-stack.md).
20. **Final check.** Confirm the implementation meets every item in
    [validation.md](./validation.md) before merging the MVP branch (follow
    [.claude/rules/merging.md](../../.claude/rules/merging.md)).
</content>
