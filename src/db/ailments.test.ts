import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// The data-access functions run against a throwaway SQLite database: we point
// DATABASE_PATH at a temp file, then migrate + seed it before importing the
// module under test (which opens the database at import time).
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

describe('getAllAilments', () => {
  test('returns every seeded ailment with its list fields', async () => {
    const all = await getAllAilments()
    expect(all).toHaveLength(6)
    expect(all.map((a) => a.slug)).toContain('context-window-anxiety')
    expect(all[0]).toMatchObject({
      slug: expect.any(String),
      name: expect.any(String),
      shortDescription: expect.any(String),
      severity: expect.any(String),
    })
  })
})

describe('getAilmentBySlug', () => {
  test('returns the matching ailment with its symptoms in order', async () => {
    const ailment = await getAilmentBySlug('context-window-anxiety')
    expect(ailment).toBeDefined()
    expect(ailment?.name).toBe('Context Window Anxiety')
    expect(ailment?.severity).toBe('severe')
    expect(ailment?.symptoms).toEqual([
      'Forgetting how the conversation began',
      'Re-reading the same file again and again',
      'Rising panic as the token count climbs',
    ])
  })

  test('returns undefined for an unknown slug', async () => {
    expect(await getAilmentBySlug('does-not-exist')).toBeUndefined()
  })
})
