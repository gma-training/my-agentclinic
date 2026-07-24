import {
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

/**
 * The severities an ailment can have. Kept as a `const` tuple so it can drive
 * both the database column's `enum` constraint and the `Severity` type below —
 * one source of truth. See specs/2026-07-22-browse-ailments/requirements.md.
 */
export const SEVERITIES = ['mild', 'moderate', 'severe'] as const
export type Severity = (typeof SEVERITIES)[number]

/** An ailment an agent suffers at the hands of its human. */
export const ailments = sqliteTable('ailments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  shortDescription: text('short_description').notNull(),
  severity: text('severity', { enum: SEVERITIES }).notNull(),
})

/**
 * Symptoms of an ailment. Modelled as a related table (one ailment → many
 * symptoms) rather than a JSON column, to demonstrate a real one-to-many
 * relation and lead into the ailment↔therapy relations of Phase 2.
 */
export const symptoms = sqliteTable('symptoms', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ailmentId: integer('ailment_id')
    .notNull()
    .references(() => ailments.id, { onDelete: 'cascade' }),
  label: text('label').notNull(),
  // Preserves the authored order of symptoms within an ailment.
  position: integer('position').notNull().default(0),
})

export type Ailment = typeof ailments.$inferSelect
export type NewAilment = typeof ailments.$inferInsert
export type Symptom = typeof symptoms.$inferSelect
export type NewSymptom = typeof symptoms.$inferInsert

/** A treatment the clinic offers. Treats one or more ailments (see below). */
export const therapies = sqliteTable('therapies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  shortDescription: text('short_description').notNull(),
  // How long one appointment for this therapy lasts, in minutes.
  durationMinutes: integer('duration_minutes').notNull(),
})

/**
 * The many-to-many link between ailments and therapies: a therapy treats
 * several ailments, and an ailment is treated by several therapies. The pair is
 * the primary key, so a link can't be duplicated.
 */
export const ailmentTherapies = sqliteTable(
  'ailment_therapies',
  {
    ailmentId: integer('ailment_id')
      .notNull()
      .references(() => ailments.id, { onDelete: 'cascade' }),
    therapyId: integer('therapy_id')
      .notNull()
      .references(() => therapies.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.ailmentId, table.therapyId] })],
)

export type Therapy = typeof therapies.$inferSelect
export type NewTherapy = typeof therapies.$inferInsert

/** An AI agent seeking relief. Books appointments and has a profile. */
export const agents = sqliteTable('agents', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  // The model the agent runs on, shown on its profile (e.g. "Claude Opus 4.8").
  model: text('model').notNull(),
  bio: text('bio').notNull(),
})

export type Agent = typeof agents.$inferSelect
export type NewAgent = typeof agents.$inferInsert

/** A bookable time slot for a therapy. */
export const timeSlots = sqliteTable('time_slots', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  therapyId: integer('therapy_id')
    .notNull()
    .references(() => therapies.id, { onDelete: 'cascade' }),
  startsAt: integer('starts_at', { mode: 'timestamp' }).notNull(),
})

/** The statuses an appointment can be in. Source of truth for the type below. */
export const APPOINTMENT_STATUSES = ['booked', 'cancelled'] as const
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number]

/**
 * A booking connecting an agent (and the ailment they're being treated for) to
 * a therapy at a time slot. Cancelling is a status change, not a delete
 * (see specs/2026-07-24-mvp/requirements.md), so the dashboard keeps history.
 */
export const appointments = sqliteTable(
  'appointments',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    // Non-guessable id used in the appointment's own URLs.
    publicId: text('public_id').notNull().unique(),
    agentId: integer('agent_id')
      .notNull()
      .references(() => agents.id, { onDelete: 'cascade' }),
    therapyId: integer('therapy_id')
      .notNull()
      .references(() => therapies.id, { onDelete: 'cascade' }),
    ailmentId: integer('ailment_id')
      .notNull()
      .references(() => ailments.id, { onDelete: 'cascade' }),
    slotId: integer('slot_id')
      .notNull()
      .references(() => timeSlots.id, { onDelete: 'cascade' }),
    status: text('status', { enum: APPOINTMENT_STATUSES })
      .notNull()
      .default('booked'),
  },
  (table) => [
    // A slot can be held by at most one *active* appointment. Cancelled rows
    // remain (for history) and don't block rebooking the freed slot.
    uniqueIndex('active_appointment_per_slot')
      .on(table.slotId)
      .where(sql`${table.status} = 'booked'`),
  ],
)

export type TimeSlot = typeof timeSlots.$inferSelect
export type NewTimeSlot = typeof timeSlots.$inferInsert
export type Appointment = typeof appointments.$inferSelect
export type NewAppointment = typeof appointments.$inferInsert
