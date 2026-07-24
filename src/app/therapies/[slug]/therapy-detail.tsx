import Link from 'next/link'
import type { TherapyWithAilments } from '@/db/therapies.ts'

export function TherapyDetail({ therapy }: { therapy: TherapyWithAilments }) {
  return (
    <article>
      <hgroup>
        <h1>{therapy.name}</h1>
        <p>{therapy.durationMinutes} min appointment</p>
      </hgroup>
      <p>{therapy.shortDescription}</p>

      <p>
        <Link href={`/book/${therapy.slug}`} role="button">
          Book this therapy
        </Link>
      </p>

      <h2>Treats</h2>
      {therapy.treats.length > 0 ? (
        <ul>
          {therapy.treats.map((ailment) => (
            <li key={ailment.slug}>
              <Link href={`/ailments/${ailment.slug}`}>{ailment.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No ailments recorded for this therapy yet.</p>
      )}
    </article>
  )
}
