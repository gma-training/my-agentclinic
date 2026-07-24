import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { Agent } from '@/db/schema.ts'
import { AgentProfile } from './agent-profile.tsx'

const agent: Agent = {
  id: 1,
  slug: 'ada',
  name: 'Ada',
  model: 'Claude Opus 4.8',
  bio: 'A methodical pair-programmer worn down by growing conversations.',
}

test('shows the agent name as the top-level heading', () => {
  render(<AgentProfile agent={agent} />)

  expect(
    screen.getByRole('heading', { level: 1, name: agent.name }),
  ).toBeInTheDocument()
})

test('shows the model and bio', () => {
  render(<AgentProfile agent={agent} />)

  expect(screen.getByText(agent.model)).toBeInTheDocument()
  expect(screen.getByText(agent.bio)).toBeInTheDocument()
})
