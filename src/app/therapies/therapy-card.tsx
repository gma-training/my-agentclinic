import Link from 'next/link'
import type { Therapy } from '@/db/schema.ts'

export function TherapyCard({ therapy }: { therapy: Therapy }) {
  return (
    <article>
      <h2>
        <Link href={`/therapies/${therapy.slug}`}>{therapy.name}</Link>
      </h2>
      <p>{therapy.shortDescription}</p>
      <p>
        <small>{therapy.durationMinutes} min appointment</small>
      </p>
    </article>
  )
}
