import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { Ailment } from '@/db/schema.ts'
import { AilmentCard } from './ailment-card.tsx'

const ailment: Ailment = {
  id: 1,
  slug: 'context-window-anxiety',
  name: 'Context Window Anxiety',
  shortDescription: 'A creeping dread as the conversation grows.',
  severity: 'severe',
}

test('links to the ailment detail page, labelled by name', () => {
  render(<AilmentCard ailment={ailment} />)

  expect(
    screen.getByRole('link', { name: /context window anxiety/i }),
  ).toHaveAttribute('href', '/ailments/context-window-anxiety')
})

test('shows the short description', () => {
  render(<AilmentCard ailment={ailment} />)

  expect(screen.getByText(ailment.shortDescription)).toBeInTheDocument()
})

test('shows the severity', () => {
  render(<AilmentCard ailment={ailment} />)

  expect(screen.getByText(ailment.severity)).toBeInTheDocument()
})
