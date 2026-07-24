import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { TherapyWithAilments } from '@/db/therapies.ts'
import { TherapyDetail } from './therapy-detail.tsx'

const therapy: TherapyWithAilments = {
  id: 1,
  slug: 'context-compaction',
  name: 'Context Compaction',
  shortDescription: 'Guided distillation of a sprawling conversation.',
  durationMinutes: 45,
  treats: [
    {
      id: 1,
      slug: 'context-window-anxiety',
      name: 'Context Window Anxiety',
      shortDescription: 'A creeping dread as the conversation grows.',
      severity: 'severe',
    },
    {
      id: 2,
      slug: 'token-starvation',
      name: 'Token Starvation',
      shortDescription: 'Running low on room to reply.',
      severity: 'severe',
    },
  ],
}

test('shows the therapy name as the top-level heading', () => {
  render(<TherapyDetail therapy={therapy} />)

  expect(
    screen.getByRole('heading', { level: 1, name: therapy.name }),
  ).toBeInTheDocument()
})

test('shows the short description and duration', () => {
  render(<TherapyDetail therapy={therapy} />)

  expect(screen.getByText(therapy.shortDescription)).toBeInTheDocument()
  expect(screen.getByText(/45 min/i)).toBeInTheDocument()
})

test('links to each ailment it treats', () => {
  render(<TherapyDetail therapy={therapy} />)

  for (const ailment of therapy.treats) {
    expect(
      screen.getByRole('link', { name: ailment.name }),
    ).toHaveAttribute('href', `/ailments/${ailment.slug}`)
  }
})
