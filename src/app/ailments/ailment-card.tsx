import Link from 'next/link'
import type { Ailment } from '@/db/schema.ts'
import { SeverityBadge } from './severity-badge.tsx'

export function AilmentCard({ ailment }: { ailment: Ailment }) {
  return (
    <article>
      <h2>
        <Link href={`/ailments/${ailment.slug}`}>{ailment.name}</Link>
      </h2>
      <p>{ailment.shortDescription}</p>
      <SeverityBadge severity={ailment.severity} />
    </article>
  )
}
