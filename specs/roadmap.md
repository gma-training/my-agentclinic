# Roadmap

High-level implementation order, in **very small phases**. Each phase is a
**vertical slice** — it ships one usable capability end-to-end (UI + server +
data) so the app is always demoable, then the next phase builds on it.

Phases are intentionally small; ship, review, and move on.

## Phase 0 — Project skeleton (Complete)

- Scaffold the Next.js + TypeScript app.
- Home page renders in a modern browser with basic styling.
- Build and dev scripts work.

_Outcome: the app runs and shows a landing page._

## Phase 1 — Browse ailments

- Model ailments (seed a handful of agent-themed ailments).
- List page shows all ailments; detail view shows one ailment.

_Outcome: an agent can see what ails them._

## Phase 2 — Browse therapies

- Model therapies and their link to ailments.
- List and detail views for therapies; from an ailment, see therapies that treat it.

_Outcome: an agent can find a therapy for an ailment._

## Phase 3 — Agents

- Model agents with a basic profile.
- View an agent profile.

_Outcome: agents exist in the system and can be viewed._

## Phase 4 — Book an appointment

- Model appointments (agent + therapy + time).
- Booking flow: choose therapy, pick a time, confirm.
- Confirmation view.

_Outcome: the core journey works end-to-end — an agent books relief._

## Phase 5 — Agent dashboard

- An agent sees their upcoming and past appointments.
- Cancel/reschedule an appointment.

_Outcome: agents self-serve their bookings._

## Phase 6 — Staff dashboard

- Staff view: all appointments, agents, ailments, therapies.
- Manage (create/edit) ailments and therapies.

_Outcome: staff can run the clinic._

## Phase 7 — Polish

- Attractive, consistent styling across the site (per Steve).
- Empty states, loading states, and error handling.
- Accessibility and responsive layout checks.

_Outcome: a polished, attractive, reliable site._
