import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAgentBySlug } from '@/db/agents.ts'
import { AgentProfile } from './agent-profile.tsx'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const agent = await getAgentBySlug(slug)

  if (!agent) return {}

  return {
    title: `${agent.name} — AgentClinic`,
    description: agent.bio,
  }
}

export default async function AgentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const agent = await getAgentBySlug(slug)

  if (!agent) notFound()

  return (
    <main>
      <AgentProfile agent={agent} />
    </main>
  )
}
