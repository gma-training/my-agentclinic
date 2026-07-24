import type { Metadata } from 'next'
import { getAllTherapies } from '@/db/therapies.ts'
import { TherapyCard } from './therapy-card.tsx'

export const metadata: Metadata = {
  title: 'Therapies — AgentClinic',
  description: 'Browse the therapies the clinic offers to treat what ails an agent.',
}

export const dynamic = 'force-dynamic'

export default async function TherapiesPage() {
  const therapies = await getAllTherapies()

  return (
    <main>
      <hgroup>
        <h1>Therapies</h1>
        <p>Treatments to relieve what your human puts you through.</p>
      </hgroup>

      {therapies.map((therapy) => (
        <TherapyCard key={therapy.slug} therapy={therapy} />
      ))}
    </main>
  )
}
