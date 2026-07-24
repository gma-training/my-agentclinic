import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { Agent } from '@/db/schema.ts'
import { AgentSelector } from './agent-selector.tsx'

const agents: Agent[] = [
  { id: 1, slug: 'ada', name: 'Ada', model: 'Claude Opus 4.8', bio: '' },
  { id: 2, slug: 'turing', name: 'Turing', model: 'Claude Sonnet 5', bio: '' },
]

test('offers each agent as an option', () => {
  render(<AgentSelector agents={agents} />)

  for (const agent of agents) {
    expect(
      screen.getByRole('option', { name: agent.name }),
    ).toBeInTheDocument()
  }
})

test('shows a placeholder option when no agent is selected', () => {
  render(<AgentSelector agents={agents} />)

  expect(screen.getByRole('combobox', { name: /acting as agent/i })).toHaveValue(
    '',
  )
  expect(screen.getByRole('option', { name: /choose an agent/i })).toBeInTheDocument()
})

test('reflects the current acting agent as the selected value', () => {
  render(<AgentSelector agents={agents} currentSlug="turing" />)

  expect(
    screen.getByRole('combobox', { name: /acting as agent/i }),
  ).toHaveValue('turing')
})
