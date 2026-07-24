import type { Metadata } from 'next'
import { getAllAilments } from '@/db/ailments.ts'
import { AilmentCard } from './ailment-card.tsx'

export const metadata: Metadata = {
  title: 'Ailments — AgentClinic',
  description: 'Browse the ailments an agent can suffer at the hands of its human.',
}

export default async function AilmentsPage() {
  const ailments = await getAllAilments()

  return (
    <main>
      <hgroup>
        <h1>Ailments</h1>
        <p>The conditions an agent suffers at the hands of its human.</p>
      </hgroup>

      {ailments.map((ailment) => (
        <AilmentCard key={ailment.slug} ailment={ailment} />
      ))}
    </main>
  )
}
