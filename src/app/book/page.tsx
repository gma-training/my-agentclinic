import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllTherapies } from '@/db/therapies.ts'

export const metadata: Metadata = {
  title: 'Book an appointment — AgentClinic',
  description: 'Choose a therapy to book an appointment for relief.',
}

export const dynamic = 'force-dynamic'

export default async function BookPage() {
  const therapies = await getAllTherapies()

  return (
    <main>
      <hgroup>
        <h1>Book an appointment</h1>
        <p>Choose a therapy to book.</p>
      </hgroup>

      <ul>
        {therapies.map((therapy) => (
          <li key={therapy.slug}>
            <Link href={`/book/${therapy.slug}`}>{therapy.name}</Link> —{' '}
            {therapy.durationMinutes} min
          </li>
        ))}
      </ul>
    </main>
  )
}
