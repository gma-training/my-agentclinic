import { randomUUID } from 'node:crypto'
import { and, asc, eq, gt, isNull } from 'drizzle-orm'
import { getDb } from './index.ts'
import {
  agents,
  ailments,
  appointments,
  therapies,
  timeSlots,
  type Agent,
  type Ailment,
  type Appointment,
  type Therapy,
  type TimeSlot,
} from './schema.ts'

/** An appointment with the related records the views need to show it. */
export type AppointmentDetail = Appointment & {
  agent: Agent
  therapy: Therapy
  ailment: Ailment
  slot: TimeSlot
}

/** Thrown when booking (or rescheduling to) a slot that is already taken. */
export class SlotTakenError extends Error {
  constructor() {
    super('That time slot has already been taken.')
    this.name = 'SlotTakenError'
  }
}

// node:sqlite surfaces a unique-constraint violation with this message; we use
// it to turn the active-appointment-per-slot index into a SlotTakenError.
// Drizzle wraps driver errors in a DrizzleQueryError, so check the cause chain.
function isUniqueViolation(error: unknown): boolean {
  for (let e: unknown = error; e instanceof Error; e = e.cause) {
    if (/UNIQUE constraint failed/i.test(e.message)) return true
  }
  return false
}

/**
 * The therapy's upcoming, unbooked slots in chronological order. A slot is
 * available if it is in the future and no *active* (booked) appointment holds
 * it — so a cancelled appointment frees its slot again.
 */
export function getAvailableSlotsForTherapy(
  therapySlug: string,
): Promise<TimeSlot[]> {
  return getDb()
    .select({ slot: timeSlots })
    .from(timeSlots)
    .innerJoin(therapies, eq(therapies.id, timeSlots.therapyId))
    .leftJoin(
      appointments,
      and(
        eq(appointments.slotId, timeSlots.id),
        eq(appointments.status, 'booked'),
      ),
    )
    .where(
      and(
        eq(therapies.slug, therapySlug),
        gt(timeSlots.startsAt, new Date()),
        isNull(appointments.id),
      ),
    )
    .orderBy(asc(timeSlots.startsAt))
    .then((rows) => rows.map((row) => row.slot))
}

/**
 * Books an appointment for an agent, treating an ailment, in a given slot. The
 * slot determines the therapy. Throws {@link SlotTakenError} if the slot is
 * already held by an active appointment (guarded by a unique index, so a race
 * between two bookers still can't double-book).
 */
export async function bookAppointment({
  agentId,
  ailmentId,
  slotId,
}: {
  agentId: number
  ailmentId: number
  slotId: number
}): Promise<Appointment> {
  const db = getDb()

  const [slot] = await db
    .select()
    .from(timeSlots)
    .where(eq(timeSlots.id, slotId))
    .limit(1)
  if (!slot) throw new Error(`No time slot with id ${slotId}`)

  try {
    const [created] = await db
      .insert(appointments)
      .values({
        publicId: randomUUID(),
        agentId,
        therapyId: slot.therapyId,
        ailmentId,
        slotId,
        status: 'booked',
      })
      .returning()
    return created
  } catch (error) {
    if (isUniqueViolation(error)) throw new SlotTakenError()
    throw error
  }
}

/** Every appointment with its related records, soonest slot first. */
export async function getAllAppointments(): Promise<AppointmentDetail[]> {
  const rows = await getDb()
    .select({
      appointment: appointments,
      agent: agents,
      therapy: therapies,
      ailment: ailments,
      slot: timeSlots,
    })
    .from(appointments)
    .innerJoin(agents, eq(agents.id, appointments.agentId))
    .innerJoin(therapies, eq(therapies.id, appointments.therapyId))
    .innerJoin(ailments, eq(ailments.id, appointments.ailmentId))
    .innerJoin(timeSlots, eq(timeSlots.id, appointments.slotId))
    .orderBy(asc(timeSlots.startsAt))

  return rows.map((row) => ({
    ...row.appointment,
    agent: row.agent,
    therapy: row.therapy,
    ailment: row.ailment,
    slot: row.slot,
  }))
}

/** A single appointment by its public id, with related records, or undefined. */
export async function getAppointmentByPublicId(
  publicId: string,
): Promise<AppointmentDetail | undefined> {
  const [row] = await getDb()
    .select({
      appointment: appointments,
      agent: agents,
      therapy: therapies,
      ailment: ailments,
      slot: timeSlots,
    })
    .from(appointments)
    .innerJoin(agents, eq(agents.id, appointments.agentId))
    .innerJoin(therapies, eq(therapies.id, appointments.therapyId))
    .innerJoin(ailments, eq(ailments.id, appointments.ailmentId))
    .innerJoin(timeSlots, eq(timeSlots.id, appointments.slotId))
    .where(eq(appointments.publicId, publicId))
    .limit(1)

  if (!row) return undefined
  return {
    ...row.appointment,
    agent: row.agent,
    therapy: row.therapy,
    ailment: row.ailment,
    slot: row.slot,
  }
}

/**
 * An agent's appointments split into upcoming and past. Upcoming = booked and
 * still in the future, soonest first. Past = cancelled, or whose slot time has
 * passed (i.e. completed), most recent first.
 */
export async function getAppointmentsForAgent(
  agentId: number,
): Promise<{ upcoming: AppointmentDetail[]; past: AppointmentDetail[] }> {
  const rows = await getDb()
    .select({
      appointment: appointments,
      agent: agents,
      therapy: therapies,
      ailment: ailments,
      slot: timeSlots,
    })
    .from(appointments)
    .innerJoin(agents, eq(agents.id, appointments.agentId))
    .innerJoin(therapies, eq(therapies.id, appointments.therapyId))
    .innerJoin(ailments, eq(ailments.id, appointments.ailmentId))
    .innerJoin(timeSlots, eq(timeSlots.id, appointments.slotId))
    .where(eq(appointments.agentId, agentId))
    .orderBy(asc(timeSlots.startsAt))

  const details: AppointmentDetail[] = rows.map((row) => ({
    ...row.appointment,
    agent: row.agent,
    therapy: row.therapy,
    ailment: row.ailment,
    slot: row.slot,
  }))

  const now = Date.now()
  const upcoming = details.filter(
    (a) => a.status === 'booked' && a.slot.startsAt.getTime() >= now,
  )
  const past = details
    .filter(
      (a) => a.status === 'cancelled' || a.slot.startsAt.getTime() < now,
    )
    .reverse()

  return { upcoming, past }
}

/** Cancels an appointment (status → cancelled), freeing its slot. */
export async function cancelAppointment(
  publicId: string,
): Promise<Appointment | undefined> {
  const [updated] = await getDb()
    .update(appointments)
    .set({ status: 'cancelled' })
    .where(eq(appointments.publicId, publicId))
    .returning()

  return updated
}

/**
 * Moves a booked appointment to another free slot of the *same* therapy. Throws
 * {@link SlotTakenError} if the target slot is already taken, or a plain error
 * if the appointment is missing/cancelled or the slot belongs to another
 * therapy.
 */
export async function rescheduleAppointment(
  publicId: string,
  newSlotId: number,
): Promise<Appointment> {
  const db = getDb()

  const [appointment] = await db
    .select()
    .from(appointments)
    .where(eq(appointments.publicId, publicId))
    .limit(1)
  if (!appointment) throw new Error(`No appointment with id ${publicId}`)
  if (appointment.status !== 'booked') {
    throw new Error('Only a booked appointment can be rescheduled.')
  }

  const [slot] = await db
    .select()
    .from(timeSlots)
    .where(eq(timeSlots.id, newSlotId))
    .limit(1)
  if (!slot) throw new Error(`No time slot with id ${newSlotId}`)
  if (slot.therapyId !== appointment.therapyId) {
    throw new Error('A slot can only be rescheduled within the same therapy.')
  }

  try {
    const [updated] = await db
      .update(appointments)
      .set({ slotId: newSlotId })
      .where(eq(appointments.publicId, publicId))
      .returning()
    return updated
  } catch (error) {
    if (isUniqueViolation(error)) throw new SlotTakenError()
    throw error
  }
}
