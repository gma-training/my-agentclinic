import { asc, eq } from 'drizzle-orm'
import { db } from './index.ts'
import { ailments, symptoms, type Ailment } from './schema.ts'

/** An ailment together with its symptom labels, in authored order. */
export type AilmentWithSymptoms = Ailment & { symptoms: string[] }

/**
 * All ailments, in a stable order (as seeded). Used by the list page, which
 * shows name, short description, and severity — symptoms are not needed here.
 */
export function getAllAilments(): Promise<Ailment[]> {
  return db.select().from(ailments).orderBy(asc(ailments.id))
}

/**
 * A single ailment by its slug, with its symptoms joined in, or `undefined` if
 * no ailment has that slug. Used by the detail page.
 */
export async function getAilmentBySlug(
  slug: string,
): Promise<AilmentWithSymptoms | undefined> {
  const [ailment] = await db
    .select()
    .from(ailments)
    .where(eq(ailments.slug, slug))
    .limit(1)

  if (!ailment) return undefined

  const rows = await db
    .select({ label: symptoms.label })
    .from(symptoms)
    .where(eq(symptoms.ailmentId, ailment.id))
    .orderBy(asc(symptoms.position))

  return { ...ailment, symptoms: rows.map((row) => row.label) }
}
