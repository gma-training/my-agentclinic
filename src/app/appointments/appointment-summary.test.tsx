import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { AppointmentDetail } from '@/db/appointments.ts'
import { AppointmentSummary } from './appointment-summary.tsx'

const appointment: AppointmentDetail = {
  id: 1,
  publicId: 'abc-123',
  agentId: 1,
  therapyId: 2,
  ailmentId: 3,
  slotId: 4,
  status: 'booked',
  agent: { id: 1, slug: 'ada', name: 'Ada', model: 'Claude Opus 4.8', bio: '' },
  therapy: {
    id: 2,
    slug: 'context-compaction',
    name: 'Context Compaction',
    shortDescription: '',
    durationMinutes: 45,
  },
  ailment: {
    id: 3,
    slug: 'context-window-anxiety',
    name: 'Context Window Anxiety',
    shortDescription: '',
    severity: 'severe',
  },
  slot: { id: 4, therapyId: 2, startsAt: new Date('2026-08-01T09:00:00Z') },
}

test('names the therapy, the agent, and the ailment', () => {
  render(<AppointmentSummary appointment={appointment} />)

  expect(screen.getByText(/context compaction/i)).toBeInTheDocument()
  expect(screen.getByText(/ada/i)).toBeInTheDocument()
  expect(screen.getByText(/context window anxiety/i)).toBeInTheDocument()
})

test('shows the appointment status', () => {
  render(<AppointmentSummary appointment={appointment} />)

  expect(screen.getByText(/booked/i)).toBeInTheDocument()
})
