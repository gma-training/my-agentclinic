import { afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { getDb } from './index.ts'
import {
  getAllTherapies,
  getTherapiesForAilment,
  getTherapyBySlug,
} from './therapies.ts'
import { runMigrations } from './migrate.ts'
import { seed } from './seed.ts'
import { seedTherapies } from './seed-data.ts'

// As with the ailments suite, the seed is the source of truth: assertions
// compare against `seedTherapies` rather than hard-coded copies of its content.
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

const aTherapy = seedTherapies[0]

describe('getAllTherapies', () => {
  test('returns one entry per seeded therapy, in seed order', async () => {
    const all = await getAllTherapies()

    expect(all.map((therapy) => therapy.slug)).toEqual(
      seedTherapies.map((therapy) => therapy.slug),
    )
  })

  test('carries the fields the list page displays', async () => {
    const all = await getAllTherapies()
    const listed = all.find((therapy) => therapy.slug === aTherapy.slug)

    expect(listed).toMatchObject({
      slug: aTherapy.slug,
      name: aTherapy.name,
      shortDescription: aTherapy.shortDescription,
      durationMinutes: aTherapy.durationMinutes,
    })
  })
})

describe('getTherapyBySlug', () => {
  test('finds the therapy with that slug', async () => {
    const therapy = await getTherapyBySlug(aTherapy.slug)

    expect(therapy).toMatchObject({
      slug: aTherapy.slug,
      name: aTherapy.name,
      durationMinutes: aTherapy.durationMinutes,
    })
  })

  test('includes the ailments it treats', async () => {
    const therapy = await getTherapyBySlug(aTherapy.slug)

    expect(therapy?.treats.map((ailment) => ailment.slug).sort()).toEqual(
      [...aTherapy.treats].sort(),
    )
  })

  test('returns undefined when no therapy has that slug', async () => {
    const therapy = await getTherapyBySlug('no-such-therapy')

    expect(therapy).toBeUndefined()
  })
})

describe('getTherapiesForAilment', () => {
  test('returns every therapy that treats the given ailment', async () => {
    // `context-compaction` treats context-window-anxiety in the seed data.
    const treating = await getTherapiesForAilment('context-window-anxiety')

    const expected = seedTherapies
      .filter((therapy) => therapy.treats.includes('context-window-anxiety'))
      .map((therapy) => therapy.slug)
    expect(treating.map((therapy) => therapy.slug).sort()).toEqual(
      expected.sort(),
    )
  })

  test('returns an empty list for an ailment with no therapies', async () => {
    const treating = await getTherapiesForAilment('no-such-ailment')

    expect(treating).toEqual([])
  })
})
