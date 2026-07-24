import { asc, eq } from 'drizzle-orm'
import { getDb } from './index.ts'
import {
  ailmentTherapies,
  ailments,
  therapies,
  type Ailment,
  type Therapy,
} from './schema.ts'

/** A therapy together with the ailments it treats. */
export type TherapyWithAilments = Therapy & { treats: Ailment[] }

/**
 * All therapies, in a stable order (as seeded). Used by the list page, which
 * shows name, short description, and duration.
 */
export function getAllTherapies(): Promise<Therapy[]> {
  return getDb().select().from(therapies).orderBy(asc(therapies.id))
}

/**
 * A single therapy by its slug, with the ailments it treats joined in, or
 * `undefined` if no therapy has that slug. Used by the detail page.
 */
export async function getTherapyBySlug(
  slug: string,
): Promise<TherapyWithAilments | undefined> {
  const db = getDb()

  const [therapy] = await db
    .select()
    .from(therapies)
    .where(eq(therapies.slug, slug))
    .limit(1)

  if (!therapy) return undefined

  const treats = await db
    .select({ ailment: ailments })
    .from(ailmentTherapies)
    .innerJoin(ailments, eq(ailmentTherapies.ailmentId, ailments.id))
    .where(eq(ailmentTherapies.therapyId, therapy.id))
    .orderBy(asc(ailments.id))

  return { ...therapy, treats: treats.map((row) => row.ailment) }
}

/**
 * Every therapy that treats the ailment with the given slug, in a stable order.
 * Returns an empty list if the ailment is unknown or has no therapies. Used by
 * the "therapies that treat this" section of the ailment detail page.
 */
export async function getTherapiesForAilment(
  ailmentSlug: string,
): Promise<Therapy[]> {
  const rows = await getDb()
    .select({ therapy: therapies })
    .from(ailments)
    .innerJoin(ailmentTherapies, eq(ailmentTherapies.ailmentId, ailments.id))
    .innerJoin(therapies, eq(therapies.id, ailmentTherapies.therapyId))
    .where(eq(ailments.slug, ailmentSlug))
    .orderBy(asc(therapies.id))

  return rows.map((row) => row.therapy)
}
