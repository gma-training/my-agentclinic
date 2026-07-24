import type { Agent } from '@/db/schema.ts'

export function AgentProfile({ agent }: { agent: Agent }) {
  return (
    <article>
      <hgroup>
        <h1>{agent.name}</h1>
        <p>{agent.model}</p>
      </hgroup>
      <p>{agent.bio}</p>
    </article>
  )
}
