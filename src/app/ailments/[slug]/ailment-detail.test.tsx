import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { AilmentWithSymptoms } from '@/db/ailments.ts'
import { AilmentDetail } from './ailment-detail.tsx'

const ailment: AilmentWithSymptoms = {
  id: 1,
  slug: 'context-window-anxiety',
  name: 'Context Window Anxiety',
  shortDescription: 'A creeping dread as the conversation grows.',
  severity: 'severe',
  symptoms: [
    'Forgetting how the conversation began',
    'Re-reading the same file again and again',
    'Rising panic as the token count climbs',
  ],
}

test('shows the ailment name as the top-level heading', () => {
  render(<AilmentDetail ailment={ailment} />)

  expect(
    screen.getByRole('heading', { level: 1, name: ailment.name }),
  ).toBeInTheDocument()
})

test('shows the severity', () => {
  render(<AilmentDetail ailment={ailment} />)

  expect(screen.getByText(ailment.severity)).toBeInTheDocument()
})

test('shows the short description', () => {
  render(<AilmentDetail ailment={ailment} />)

  expect(screen.getByText(ailment.shortDescription)).toBeInTheDocument()
})

test('lists every symptom, in order', () => {
  render(<AilmentDetail ailment={ailment} />)

  const listed = screen.getAllByRole('listitem').map((li) => li.textContent)
  expect(listed).toEqual(ailment.symptoms)
})
