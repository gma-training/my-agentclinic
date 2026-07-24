import { eq, inArray } from 'drizzle-orm'
import { getDb } from './index.ts'
import {
  ailmentTherapies,
  ailments,
  symptoms,
  therapies,
  timeSlots,
  type Ailment,
  type Severity,
  type Therapy,
} from './schema.ts'

/** Thrown when creating or renaming to a slug that another record already uses. */
export class SlugTakenError extends Error {
  constructor(slug: string) {
    super(`The slug "${slug}" is already in use.`)
    this.name = 'SlugTakenError'
  }
}

/** The full set of fields the staff ailment form manages. */
export type AilmentInput = {
  slug: string
  name: string
  shortDescription: string
  severity: Severity
  symptoms: string[]
  therapySlugs: string[]
}

/** The full set of fields the staff therapy form manages. */
export type TherapyInput = {
  slug: string
  name: string
  shortDescription: string
  durationMinutes: number
  ailmentSlugs: string[]
  // Slot times to add as bookable slots. On edit these are *appended* to the
  // therapy's existing slots — existing slots are never deleted, so a slot with
  // a booked appointment can't be removed out from under it.
  slotTimes: Date[]
}

async function slugOwnedByAnother(
  slug: string,
  currentSlug: string | undefined,
): Promise<boolean> {
  const [row] = await getDb()
    .select({ slug: ailments.slug })
    .from(ailments)
    .where(eq(ailments.slug, slug))
    .limit(1)
  const [therapyRow] = await getDb()
    .select({ slug: therapies.slug })
    .from(therapies)
    .where(eq(therapies.slug, slug))
    .limit(1)
  const existing = row?.slug ?? therapyRow?.slug
  return existing !== undefined && existing !== currentSlug
}

async function replaceSymptoms(ailmentId: number, labels: string[]) {
  const db = getDb()
  await db.delete(symptoms).where(eq(symptoms.ailmentId, ailmentId))
  if (labels.length > 0) {
    await db.insert(symptoms).values(
      labels.map((label, position) => ({ ailmentId, label, position })),
    )
  }
}

async function therapyIdsForSlugs(slugs: string[]): Promise<number[]> {
  if (slugs.length === 0) return []
  const rows = await getDb()
    .select({ id: therapies.id })
    .from(therapies)
    .where(inArray(therapies.slug, slugs))
  return rows.map((row) => row.id)
}

async function ailmentIdsForSlugs(slugs: string[]): Promise<number[]> {
  if (slugs.length === 0) return []
  const rows = await getDb()
    .select({ id: ailments.id })
    .from(ailments)
    .where(inArray(ailments.slug, slugs))
  return rows.map((row) => row.id)
}

async function linkAilmentToTherapies(ailmentId: number, therapyIds: number[]) {
  const db = getDb()
  await db.delete(ailmentTherapies).where(eq(ailmentTherapies.ailmentId, ailmentId))
  if (therapyIds.length > 0) {
    await db
      .insert(ailmentTherapies)
      .values(therapyIds.map((therapyId) => ({ ailmentId, therapyId })))
  }
}

async function linkTherapyToAilments(therapyId: number, ailmentIds: number[]) {
  const db = getDb()
  await db.delete(ailmentTherapies).where(eq(ailmentTherapies.therapyId, therapyId))
  if (ailmentIds.length > 0) {
    await db
      .insert(ailmentTherapies)
      .values(ailmentIds.map((ailmentId) => ({ ailmentId, therapyId })))
  }
}

/** Creates an ailment with its symptoms and therapy links. */
export async function createAilment(input: AilmentInput): Promise<Ailment> {
  if (await slugOwnedByAnother(input.slug, undefined)) {
    throw new SlugTakenError(input.slug)
  }

  const db = getDb()
  const [created] = await db
    .insert(ailments)
    .values({
      slug: input.slug,
      name: input.name,
      shortDescription: input.shortDescription,
      severity: input.severity,
    })
    .returning()

  await replaceSymptoms(created.id, input.symptoms)
  await linkAilmentToTherapies(
    created.id,
    await therapyIdsForSlugs(input.therapySlugs),
  )
  return created
}

/** Updates the ailment identified by `currentSlug`, replacing symptoms/links. */
export async function updateAilment(
  currentSlug: string,
  input: AilmentInput,
): Promise<Ailment> {
  if (await slugOwnedByAnother(input.slug, currentSlug)) {
    throw new SlugTakenError(input.slug)
  }

  const db = getDb()
  const [updated] = await db
    .update(ailments)
    .set({
      slug: input.slug,
      name: input.name,
      shortDescription: input.shortDescription,
      severity: input.severity,
    })
    .where(eq(ailments.slug, currentSlug))
    .returning()
  if (!updated) throw new Error(`No ailment with slug "${currentSlug}"`)

  await replaceSymptoms(updated.id, input.symptoms)
  await linkAilmentToTherapies(
    updated.id,
    await therapyIdsForSlugs(input.therapySlugs),
  )
  return updated
}

async function addSlots(therapyId: number, slotTimes: Date[]) {
  if (slotTimes.length === 0) return
  await getDb()
    .insert(timeSlots)
    .values(slotTimes.map((startsAt) => ({ therapyId, startsAt })))
}

/** Creates a therapy with its ailment links and bookable slots. */
export async function createTherapy(input: TherapyInput): Promise<Therapy> {
  if (await slugOwnedByAnother(input.slug, undefined)) {
    throw new SlugTakenError(input.slug)
  }

  const db = getDb()
  const [created] = await db
    .insert(therapies)
    .values({
      slug: input.slug,
      name: input.name,
      shortDescription: input.shortDescription,
      durationMinutes: input.durationMinutes,
    })
    .returning()

  await linkTherapyToAilments(
    created.id,
    await ailmentIdsForSlugs(input.ailmentSlugs),
  )
  await addSlots(created.id, input.slotTimes)
  return created
}

/** Updates the therapy identified by `currentSlug`, appending any new slots. */
export async function updateTherapy(
  currentSlug: string,
  input: TherapyInput,
): Promise<Therapy> {
  if (await slugOwnedByAnother(input.slug, currentSlug)) {
    throw new SlugTakenError(input.slug)
  }

  const db = getDb()
  const [updated] = await db
    .update(therapies)
    .set({
      slug: input.slug,
      name: input.name,
      shortDescription: input.shortDescription,
      durationMinutes: input.durationMinutes,
    })
    .where(eq(therapies.slug, currentSlug))
    .returning()
  if (!updated) throw new Error(`No therapy with slug "${currentSlug}"`)

  await linkTherapyToAilments(
    updated.id,
    await ailmentIdsForSlugs(input.ailmentSlugs),
  )
  await addSlots(updated.id, input.slotTimes)
  return updated
}
