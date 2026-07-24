import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { seedAilments } from './seed.ts'

// These functions read back what the seed put in, so the seed is the source of
// truth: assertions compare against `seedAilments` instead of hard-coded copies
// of its content — adding or reworording an ailment can't quietly break them.
//
// Setup points DATABASE_PATH at a throwaway file, then migrates + seeds it
// before importing the module under test (which opens the database on import).
type AilmentsModule = typeof import('./ailments.ts')
let getAllAilments: AilmentsModule['getAllAilments']
let getAilmentBySlug: AilmentsModule['getAilmentBySlug']
let tmpDir: string

beforeAll(async () => {
  tmpDir = mkdtempSync(join(tmpdir(), 'agentclinic-test-'))
  process.env.DATABASE_PATH = join(tmpDir, 'test.db')

  const { runMigrations } = await import('./migrate.ts')
  runMigrations()
  const { seed } = await import('./seed.ts')
  await seed()
  ;({ getAllAilments, getAilmentBySlug } = await import('./ailments.ts'))
})

afterAll(() => {
  rmSync(tmpDir, { recursive: true, force: true })
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
