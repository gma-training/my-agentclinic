import { afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { getDb } from './index.ts'
import { getAllAilments, getAilmentBySlug } from './ailments.ts'
import { runMigrations } from './migrate.ts'
import { seed, seedAilments } from './seed.ts'

// These functions read back what the seed put in, so the seed is the source of
// truth: assertions compare against `seedAilments` instead of hard-coded copies
// of its content — adding or reworording an ailment can't quietly break them.
//
// The suite runs against whatever DATABASE_PATH points at; the `test` npm
// script sets it to `:memory:`, so each worker gets its own throwaway in-memory
// database and the dev database is never touched. We migrate + seed it once up
// front — but guard first, so a bare `vitest` run that forgot the env can't
// silently clobber the default (on-disk) database.
beforeAll(async () => {
  if (!process.env.DATABASE_PATH) {
    throw new Error(
      'DATABASE_PATH must point at a throwaway database — run the tests via `npm test`.',
    )
  }

  runMigrations()
  await seed()
})

// Seed once, then run each test inside a transaction that is rolled back
// afterwards: every test starts from the pristine seed and its own writes are
// undone, so tests stay order-independent without re-seeding between them.
// Today's tests only read; this wraps them anyway so the isolation contract is
// established now and any future write test inherits it for free. (`node:sqlite`
// is synchronous, so no awaits — and don't add a `db.transaction()` inside a
// test, as SQLite can't nest transactions within this outer one.)
beforeEach(() => {
  getDb().$client.exec('BEGIN')
})

afterEach(() => {
  getDb().$client.exec('ROLLBACK')
})

// Any seeded ailment stands in for "a real one" in the single-record tests.
const anAilment = seedAilments[0]

describe('getAllAilments', () => {
  test('returns one entry per seeded ailment, in seed order', async () => {
    const all = await getAllAilments()

    expect(all.map((ailment) => ailment.slug)).toEqual(
      seedAilments.map((ailment) => ailment.slug),
    )
  })

  test('carries the fields the list page displays', async () => {
    const all = await getAllAilments()
    const listed = all.find((ailment) => ailment.slug === anAilment.slug)

    expect(listed).toMatchObject({
      slug: anAilment.slug,
      name: anAilment.name,
      shortDescription: anAilment.shortDescription,
      severity: anAilment.severity,
    })
  })
})

describe('getAilmentBySlug', () => {
  test('finds the ailment with that slug', async () => {
    const ailment = await getAilmentBySlug(anAilment.slug)

    expect(ailment).toMatchObject({
      slug: anAilment.slug,
      name: anAilment.name,
      severity: anAilment.severity,
    })
  })

  test('lists its symptoms in the order they were authored', async () => {
    const ailment = await getAilmentBySlug(anAilment.slug)

    expect(ailment?.symptoms).toEqual(anAilment.symptoms)
  })

  test('returns undefined when no ailment has that slug', async () => {
    const ailment = await getAilmentBySlug('no-such-ailment')

    expect(ailment).toBeUndefined()
  })
})
