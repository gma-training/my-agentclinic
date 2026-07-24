import Link from 'next/link'
import type { AilmentWithSymptoms } from '@/db/ailments.ts'
import type { Therapy } from '@/db/schema.ts'
import { SeverityBadge } from '../severity-badge.tsx'

export function AilmentDetail({
  ailment,
  therapies = [],
}: {
  ailment: AilmentWithSymptoms
  therapies?: Therapy[]
}) {
  return (
    <article>
      <hgroup>
        <h1>{ailment.name}</h1>
        <SeverityBadge severity={ailment.severity} />
      </hgroup>
      <p>{ailment.shortDescription}</p>
      <h2>Symptoms</h2>
      <ul>
        {ailment.symptoms.map((symptom) => (
          <li key={symptom}>{symptom}</li>
        ))}
      </ul>

      {therapies.length > 0 && (
        <>
          <h2>Therapies that treat this</h2>
          <ul>
            {therapies.map((therapy) => (
              <li key={therapy.slug}>
                <Link href={`/therapies/${therapy.slug}`}>{therapy.name}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  )
}
