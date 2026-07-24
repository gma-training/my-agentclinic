import { afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { getDb } from './index.ts'
import { getAgentBySlug, getAllAgents } from './agents.ts'
import { runMigrations } from './migrate.ts'
import { seed } from './seed.ts'
import { seedAgents } from './seed-data.ts'

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

const anAgent = seedAgents[0]

describe('getAllAgents', () => {
  test('returns one entry per seeded agent, in seed order', async () => {
    const all = await getAllAgents()

    expect(all.map((agent) => agent.slug)).toEqual(
      seedAgents.map((agent) => agent.slug),
    )
  })
})

describe('getAgentBySlug', () => {
  test('finds the agent with that slug', async () => {
    const agent = await getAgentBySlug(anAgent.slug)

    expect(agent).toMatchObject({
      slug: anAgent.slug,
      name: anAgent.name,
      model: anAgent.model,
    })
  })

  test('returns undefined when no agent has that slug', async () => {
    const agent = await getAgentBySlug('no-such-agent')

    expect(agent).toBeUndefined()
  })
})
