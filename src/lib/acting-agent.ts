import { cookies } from 'next/headers'
import { getAgentBySlug } from '@/db/agents.ts'
import type { Agent } from '@/db/schema.ts'

/**
 * Name of the cookie holding the slug of the agent the session is "acting as".
 * This is a plain session value for the demo — **not** a security boundary
 * (there is no auth; see specs/2026-07-24-mvp/requirements.md).
 */
export const ACTING_AGENT_COOKIE = 'acting_agent'

/** The acting agent's slug from the cookie, or `undefined` if none is set. */
export async function getActingAgentSlug(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(ACTING_AGENT_COOKIE)?.value || undefined
}

/**
 * The agent the session is currently acting as, or `undefined` if none is
 * chosen (or the cookie points at an agent that no longer exists).
 */
export async function getActingAgent(): Promise<Agent | undefined> {
  const slug = await getActingAgentSlug()
  if (!slug) return undefined
  return getAgentBySlug(slug)
}
