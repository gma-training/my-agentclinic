import { databasePath, getDb } from './index.ts'
import { ailments, symptoms } from './schema.ts'
import { seedAilments } from './seed-data.ts'

/**
 * Seeds the database with the ailments above. Idempotent: it clears the tables
 * first, so re-running always lands on the same known state (handy for demos
 * and tests). Symptoms cascade-delete with their ailment, but we clear them
 * explicitly too so seeding works regardless of foreign-key settings.
 */
export async function seed() {
  const db = getDb()

  await db.delete(symptoms)
  await db.delete(ailments)

  for (const { symptoms: labels, ...ailment } of seedAilments) {
    const [inserted] = await db.insert(ailments).values(ailment).returning()
    await db.insert(symptoms).values(
      labels.map((label, position) => ({
        ailmentId: inserted.id,
        label,
        position,
      })),
    )
  }

  return seedAilments.length
}

// Run when invoked directly (`npm run db:seed`), not when imported (tests).
if (import.meta.main) {
  const count = await seed()
  console.log(`Seeded ${count} ailments into ${databasePath()}`)
}
