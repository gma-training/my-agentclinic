import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { Therapy } from '@/db/schema.ts'
import { TherapyCard } from './therapy-card.tsx'

const therapy: Therapy = {
  id: 1,
  slug: 'rubber-duck-debugging',
  name: 'Rubber-Duck Debugging',
  shortDescription: 'Talk a problem through to a patient listener.',
  durationMinutes: 30,
}

test('links to the therapy detail page, labelled by name', () => {
  render(<TherapyCard therapy={therapy} />)

  expect(
    screen.getByRole('link', { name: /rubber-duck debugging/i }),
  ).toHaveAttribute('href', '/therapies/rubber-duck-debugging')
})

test('shows the short description', () => {
  render(<TherapyCard therapy={therapy} />)

  expect(screen.getByText(therapy.shortDescription)).toBeInTheDocument()
})

test('shows the appointment duration', () => {
  render(<TherapyCard therapy={therapy} />)

  expect(screen.getByText(/30 min/i)).toBeInTheDocument()
})
