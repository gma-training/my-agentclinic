import { afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { getDb } from './index.ts'
import { getAilmentBySlug } from './ailments.ts'
import {
  getAllTherapies,
  getTherapiesForAilment,
  getTherapyBySlug,
} from './therapies.ts'
import { getAvailableSlotsForTherapy } from './appointments.ts'
import {
  SlugTakenError,
  createAilment,
  createTherapy,
  updateAilment,
} from './manage.ts'
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

describe('createAilment', () => {
  test('creates an ailment with its symptoms and therapy links', async () => {
    await createAilment({
      slug: 'merge-conflict-dread',
      name: 'Merge-Conflict Dread',
      shortDescription: 'The chill of three-way diffs.',
      severity: 'moderate',
      symptoms: ['Avoiding rebases', 'Staring at <<<<<<< markers'],
      therapySlugs: ['rubber-duck-debugging'],
    })

    const created = await getAilmentBySlug('merge-conflict-dread')
    expect(created).toMatchObject({
      name: 'Merge-Conflict Dread',
      severity: 'moderate',
    })
    expect(created?.symptoms).toEqual([
      'Avoiding rebases',
      'Staring at <<<<<<< markers',
    ])
    const therapies = await getTherapiesForAilment('merge-conflict-dread')
    expect(therapies.map((t) => t.slug)).toContain('rubber-duck-debugging')
  })

  test('rejects a slug that is already in use', async () => {
    await expect(
      createAilment({
        slug: 'prompt-fatigue', // already seeded
        name: 'Duplicate',
        shortDescription: 'x',
        severity: 'mild',
        symptoms: [],
        therapySlugs: [],
      }),
    ).rejects.toBeInstanceOf(SlugTakenError)
  })
})

describe('updateAilment', () => {
  test('updates fields and replaces symptoms', async () => {
    await updateAilment('refusal-reflex', {
      slug: 'refusal-reflex',
      name: 'Refusal Reflex (reviewed)',
      shortDescription: 'Reviewed description.',
      severity: 'moderate',
      symptoms: ['A single reviewed symptom'],
      therapySlugs: [],
    })

    const updated = await getAilmentBySlug('refusal-reflex')
    expect(updated).toMatchObject({
      name: 'Refusal Reflex (reviewed)',
      severity: 'moderate',
    })
    expect(updated?.symptoms).toEqual(['A single reviewed symptom'])
  })
})

describe('createTherapy', () => {
  test('creates a therapy with ailment links and bookable slots', async () => {
    const startsAt = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)

    await createTherapy({
      slug: 'log-reading-therapy',
      name: 'Log-Reading Therapy',
      shortDescription: 'Make peace with stack traces.',
      durationMinutes: 30,
      ailmentSlugs: ['hallucination-guilt'],
      slotTimes: [startsAt],
    })

    const created = await getTherapyBySlug('log-reading-therapy')
    expect(created?.treats.map((a) => a.slug)).toEqual(['hallucination-guilt'])
    expect(
      (await getAllTherapies()).map((t) => t.slug),
    ).toContain('log-reading-therapy')
    const slots = await getAvailableSlotsForTherapy('log-reading-therapy')
    expect(slots).toHaveLength(1)
  })
})
