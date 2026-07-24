import { asc, eq } from 'drizzle-orm'
import { getDb } from './index.ts'
import { agents, type Agent } from './schema.ts'

/** All agents, in a stable order (as seeded). */
export function getAllAgents(): Promise<Agent[]> {
  return getDb().select().from(agents).orderBy(asc(agents.id))
}

/** A single agent by its slug, or `undefined` if no agent has that slug. */
export async function getAgentBySlug(slug: string): Promise<Agent | undefined> {
  const [agent] = await getDb()
    .select()
    .from(agents)
    .where(eq(agents.slug, slug))
    .limit(1)

  return agent
}
