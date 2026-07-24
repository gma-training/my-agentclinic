import { databasePath, getDb } from './index.ts'
import {
  agents,
  ailmentTherapies,
  ailments,
  appointments,
  symptoms,
  therapies,
  timeSlots,
} from './schema.ts'
import { seedAgents, seedAilments, seedTherapies } from './seed-data.ts'

// Hours (local time) at which each therapy offers slots on an upcoming day.
const SLOT_HOURS = [9, 13, 16]
const SLOT_DAYS_AHEAD = [1, 2, 3]

/**
 * Upcoming time slots for a therapy: a fixed grid of days-ahead × hours, always
 * in the future so freshly-seeded slots are bookable and show as "upcoming".
 */
function upcomingSlots(): Date[] {
  const slots: Date[] = []
  const base = new Date()
  base.setHours(0, 0, 0, 0)

  for (const daysAhead of SLOT_DAYS_AHEAD) {
    for (const hour of SLOT_HOURS) {
      const slot = new Date(base)
      slot.setDate(slot.getDate() + daysAhead)
      slot.setHours(hour)
      slots.push(slot)
    }
  }

  return slots
}

/**
 * Seeds the database with the canonical starting data. Idempotent: it clears
 * the tables first, so re-running always lands on the same known state (handy
 * for demos and tests). Rows in related tables cascade-delete with their
 * parent, but we clear them explicitly too so seeding works regardless of
 * foreign-key settings.
 */
export async function seed() {
  const db = getDb()

  await db.delete(appointments)
  await db.delete(timeSlots)
  await db.delete(ailmentTherapies)
  await db.delete(symptoms)
  await db.delete(therapies)
  await db.delete(ailments)
  await db.delete(agents)

  // Ailments first: therapies link back to them by the ids assigned here.
  const ailmentIdBySlug = new Map<string, number>()
  for (const { symptoms: labels, ...ailment } of seedAilments) {
    const [inserted] = await db.insert(ailments).values(ailment).returning()
    ailmentIdBySlug.set(inserted.slug, inserted.id)
    await db.insert(symptoms).values(
      labels.map((label, position) => ({
        ailmentId: inserted.id,
        label,
        position,
      })),
    )
  }

  let slotCount = 0
  for (const { treats, ...therapy } of seedTherapies) {
    const [inserted] = await db.insert(therapies).values(therapy).returning()
    await db.insert(ailmentTherapies).values(
      treats.map((ailmentSlug) => ({
        therapyId: inserted.id,
        ailmentId: ailmentIdBySlug.get(ailmentSlug)!,
      })),
    )
    const slots = upcomingSlots()
    await db.insert(timeSlots).values(
      slots.map((startsAt) => ({ therapyId: inserted.id, startsAt })),
    )
    slotCount += slots.length
  }

  await db.insert(agents).values(seedAgents)

  return {
    ailments: seedAilments.length,
    therapies: seedTherapies.length,
    agents: seedAgents.length,
    slots: slotCount,
  }
}

// Run when invoked directly (`npm run db:seed`), not when imported (tests).
if (import.meta.main) {
  const counts = await seed()
  console.log(
    `Seeded ${counts.ailments} ailments, ${counts.therapies} therapies, ${counts.agents} agents, and ${counts.slots} time slots into ${databasePath()}`,
  )
}
