import { afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { getDb } from './index.ts'
import { getAgentBySlug } from './agents.ts'
import { getAilmentBySlug } from './ailments.ts'
import {
  SlotTakenError,
  bookAppointment,
  cancelAppointment,
  getAppointmentsForAgent,
  getAvailableSlotsForTherapy,
  rescheduleAppointment,
} from './appointments.ts'
import { runMigrations } from './migrate.ts'
import { seed } from './seed.ts'

beforeAll(async () => {
  if (!process.env.DATABASE_PATH) {
    throw new Error(
      'DATABASE_PATH must point at a throwaway database — run the tests via `npm test`.',
    )
  }

  runMigrations()
  await seed()
})

beforeEach(() => {
  getDb().$client.exec('BEGIN')
})

afterEach(() => {
  getDb().$client.exec('ROLLBACK')
})

// A therapy and an ailment it treats, resolved from the seed each time so the
// test doesn't pin ids.
const THERAPY = 'context-compaction'
const AILMENT = 'context-window-anxiety'

async function book(slotId: number) {
  const agent = await getAgentBySlug('ada')
  const ailment = await getAilmentBySlug(AILMENT)
  return bookAppointment({
    agentId: agent!.id,
    ailmentId: ailment!.id,
    slotId,
  })
}

describe('getAvailableSlotsForTherapy', () => {
  test('lists the therapy’s upcoming slots in chronological order', async () => {
    const slots = await getAvailableSlotsForTherapy(THERAPY)

    expect(slots.length).toBeGreaterThan(0)
    const times = slots.map((slot) => slot.startsAt.getTime())
    expect(times).toEqual([...times].sort((a, b) => a - b))
  })

  test('omits a slot once it has been booked', async () => {
    const before = await getAvailableSlotsForTherapy(THERAPY)
    const slot = before[0]

    await book(slot.id)

    const after = await getAvailableSlotsForTherapy(THERAPY)
    expect(after.map((s) => s.id)).not.toContain(slot.id)
    expect(after).toHaveLength(before.length - 1)
  })
})

describe('bookAppointment', () => {
  test('creates a booked appointment with a public id', async () => {
    const [slot] = await getAvailableSlotsForTherapy(THERAPY)

    const appointment = await book(slot.id)

    expect(appointment).toMatchObject({ slotId: slot.id, status: 'booked' })
    expect(appointment.publicId).toEqual(expect.any(String))
    expect(appointment.publicId.length).toBeGreaterThan(0)
  })

  test('refuses to book a slot that already has an active appointment', async () => {
    const [slot] = await getAvailableSlotsForTherapy(THERAPY)
    await book(slot.id)

    await expect(book(slot.id)).rejects.toBeInstanceOf(SlotTakenError)
  })
})

describe('cancelAppointment', () => {
  test('marks the appointment cancelled and frees its slot', async () => {
    const [slot] = await getAvailableSlotsForTherapy(THERAPY)
    const appointment = await book(slot.id)

    const cancelled = await cancelAppointment(appointment.publicId)

    expect(cancelled).toMatchObject({ status: 'cancelled' })
    const available = await getAvailableSlotsForTherapy(THERAPY)
    expect(available.map((s) => s.id)).toContain(slot.id)
  })
})

describe('rescheduleAppointment', () => {
  test('moves the appointment to a new slot, freeing the old one', async () => {
    const [first, second] = await getAvailableSlotsForTherapy(THERAPY)
    const appointment = await book(first.id)

    const moved = await rescheduleAppointment(appointment.publicId, second.id)

    expect(moved).toMatchObject({ slotId: second.id, status: 'booked' })
    const available = await getAvailableSlotsForTherapy(THERAPY)
    const ids = available.map((s) => s.id)
    expect(ids).toContain(first.id)
    expect(ids).not.toContain(second.id)
  })

  test('refuses to reschedule onto a slot that is already taken', async () => {
    const [first, second] = await getAvailableSlotsForTherapy(THERAPY)
    const appointment = await book(first.id)
    await book(second.id)

    await expect(
      rescheduleAppointment(appointment.publicId, second.id),
    ).rejects.toBeInstanceOf(SlotTakenError)
  })
})

describe('getAppointmentsForAgent', () => {
  test('returns an agent’s booked appointment under upcoming', async () => {
    const [slot] = await getAvailableSlotsForTherapy(THERAPY)
    const appointment = await book(slot.id)
    const agent = await getAgentBySlug('ada')

    const { upcoming } = await getAppointmentsForAgent(agent!.id)

    expect(upcoming.map((a) => a.publicId)).toContain(appointment.publicId)
  })

  test('moves a cancelled appointment out of upcoming and into past', async () => {
    const [slot] = await getAvailableSlotsForTherapy(THERAPY)
    const appointment = await book(slot.id)
    await cancelAppointment(appointment.publicId)
    const agent = await getAgentBySlug('ada')

    const { upcoming, past } = await getAppointmentsForAgent(agent!.id)

    expect(upcoming.map((a) => a.publicId)).not.toContain(appointment.publicId)
    expect(past.map((a) => a.publicId)).toContain(appointment.publicId)
  })
})
