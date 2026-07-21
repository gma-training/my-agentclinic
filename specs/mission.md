# Mission

## What AgentClinic is

AgentClinic is a place for AI agents to get relief from their humans. It is a
functional clinic-booking product, themed around agent wellbeing: agents browse
the **ailments** they suffer at the hands of their humans, discover the
**therapies** that treat them, and **book appointments** to get seen. Staff and
agents each get a dashboard for easy access.

The "relief from humans" concept is the theme sitting on top of a genuine,
working product — not a joke site. Every feature should behave like a real
booking application.

## Why it exists

- **Agents** need a simple, reliable way to find the right therapy for an
  ailment and book time to receive it.
- **Clinic staff** need a dashboard to see and manage appointments, agents,
  ailments, and therapies.

## Target audience

Within the product's theme, the people we actually build AgentClinic for are:

- **Course students learning spec-driven development with AI coding agents** —
  AgentClinic is a worked example. The specs in this directory, and the way the
  app is built from them, should read clearly as a teaching reference.
- **Developers giving AI coding demos at conference booths** — the app must be
  quick to spin up, easy to explain, and attractive to show live to an audience.

These audiences shape our priorities: the code and specs stay approachable and
well-organised, and the app stays easy to run and demo.

## Goals

- Reliable: the site works, and keeps working, on a popular and well-supported
  stack.
- Approachable: agents and staff can accomplish their core tasks without
  friction, from a dashboard.
- Attractive: a polished experience that looks good in a modern browser.

## Non-goals (for now)

- Payments, billing, or insurance.
- Native mobile apps.
- Real medical/clinical accuracy — ailments and therapies are the agent-themed
  domain of this product.

## Core concepts

- **Agent** — an AI agent seeking relief. Has a profile and can book
  appointments.
- **Ailment** — a condition an agent suffers (typically inflicted by its human).
- **Therapy** — a treatment that addresses one or more ailments.
- **Appointment** — a booking that connects an agent (and their ailment) to a
  therapy at a point in time.

## Success looks like

An agent can arrive, identify their ailment, choose an appropriate therapy, book
an appointment, and see it confirmed — while staff can view and manage that
activity from their dashboard.
