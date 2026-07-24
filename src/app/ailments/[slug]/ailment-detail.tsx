import type { AilmentWithSymptoms } from '@/db/ailments.ts'
import { SeverityBadge } from '../severity-badge.tsx'

export function AilmentDetail({ ailment }: { ailment: AilmentWithSymptoms }) {
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
    </article>
  )
}
