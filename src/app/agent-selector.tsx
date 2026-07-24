'use client'

import { useRef } from 'react'
import type { Agent } from '@/db/schema.ts'
import { setActingAgent } from './acting-agent-actions.ts'

/**
 * Header control for choosing which agent the session is "acting as". Changing
 * the selection submits the form, which runs the `setActingAgent` server action
 * and re-renders the tree with the new acting agent. Works without JavaScript
 * too — the form still posts on change once hydrated, and the submit button is
 * the no-JS fallback.
 */
export function AgentSelector({
  agents,
  currentSlug,
}: {
  agents: Agent[]
  currentSlug?: string
}) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form action={setActingAgent} ref={formRef} role="search">
      <select
        name="slug"
        aria-label="Acting as agent"
        defaultValue={currentSlug ?? ''}
        onChange={() => formRef.current?.requestSubmit()}
      >
        <option value="">Choose an agent…</option>
        {agents.map((agent) => (
          <option key={agent.slug} value={agent.slug}>
            {agent.name}
          </option>
        ))}
      </select>
      <noscript>
        <button type="submit">Switch</button>
      </noscript>
    </form>
  )
}
