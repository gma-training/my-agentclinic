# MVP — Validation

The MVP is done and mergeable when all of the following hold. Items are grouped
by phase so each slice can be checked as it lands; the **Outcome check** at the
end is the whole-MVP acceptance.

## Phase 2 — Therapies

- [x] A `therapies` table (unique `slug`, `name`, `shortDescription`, therapy
      fields) and an `ailment_therapies` join table model a many-to-many link.
- [x] Seed data adds ~6 on-theme therapies, each linked to ≥1 ailment; seeding
      stays idempotent.
- [x] `getAllTherapies()`, `getTherapyBySlug(slug)` (with treated ailments), and
      `getTherapiesForAilment(...)` are covered by passing Vitest tests.
- [x] `/therapies` lists all therapies (name, short description); each links to
      its detail page.
- [x] `/therapies/[slug]` shows the therapy and the ailments it treats; an
      unknown slug renders an on-theme not-found UI **and** returns HTTP 404.
- [x] The ailment detail page shows "therapies that treat this", linking each.
- [x] The header **"Therapies"** nav item links to `/therapies`.

## Phase 3 — Agents & "acting as"

- [x] An `agents` table (unique `slug`, `name`, profile fields) with ~4 seeded
      agents; `getAllAgents()` / `getAgentBySlug(slug)` covered by tests.
- [x] `/agents/[slug]` shows an agent profile; unknown slug 404s.
- [x] A header selector switches the **acting agent** (cookie-backed, no auth);
      the current agent is visible, and there is a sensible "none selected"
      state. The selector behaviour is covered by a test.

## Phase 4 — Book an appointment

- [x] `time_slots` (per therapy) and `appointments` (agent + therapy + ailment +
      slot + status) tables exist; a slot can hold **at most one active
      appointment** (enforced by a unique constraint), covered by a test.
- [x] Booking flow: acting as an agent, choose a therapy, pick an **available
      slot**, and confirm via a server action; a confirmation view shows agent,
      therapy, ailment, and slot time.
- [x] Attempting to book an already-taken slot is prevented with a friendly
      outcome (no duplicate appointment, no crash) — covered by a test.
- [x] The header **"Book"** nav item is live.

## Phase 5 — Agent dashboard

- [x] `/dashboard` shows the acting agent's **upcoming** and **past**
      appointments, with an empty state when there are none.
- [x] **Cancel** sets status `cancelled` and frees the slot (the slot becomes
      bookable again) — covered by a test.
- [x] **Reschedule** moves a booked appointment to another free slot of the same
      therapy (old slot freed, new slot taken) — covered by a test.

## Phase 6 — Staff dashboard

- [x] `/staff` lists all appointments, agents, ailments, and therapies.
- [x] Staff can **create and edit** an ailment (incl. symptoms + therapy links)
      via server-action forms; required fields and slug uniqueness are
      validated.
- [x] Staff can **create and edit** a therapy (incl. ailment links + time
      slots); created/edited items appear on the public list/detail pages.

## Cross-cutting (whole MVP)

- [x] `npm test` (Vitest) passes: all data-access, component, and server-action
      logic tests are green.
- [x] `npm run test:e2e` (Playwright) passes, including the full journey:
      pick an acting agent → browse ailments/therapies → book a slot → see
      confirmation → view it on the dashboard → cancel/reschedule → see it on
      the staff dashboard; and a staff create/edit reflected publicly.
- [x] `npm run build` completes with **no** TypeScript or lint errors
      (`strict` stays on); `npm run lint` passes.
- [x] `npm run dev` serves every new route in a modern browser with Pico
      styling applied.
- [x] Documented setup (generate/migrate/seed) works from a fresh clone and
      produces a populated database for all new models (`README.md` current).
- [x] `CHANGELOG.md` records the MVP work (per phase), via the `/changelog`
      skill.
- [x] Identity is the **"acting as" selector with no auth**, times come from
      **fixed seeded slots**, and **Phase 7 polish is not included** — matching
      the scope decisions in [requirements.md](./requirements.md).

## Outcome check

- [x] Per the mission's "success looks like": **an agent can arrive, identify
      their ailment, choose an appropriate therapy, book an appointment, and see
      it confirmed — while staff can view and manage that activity from their
      dashboard.** A reviewer can run the app and complete this journey
      end-to-end, and each phase along the way was independently demoable.
</content>
