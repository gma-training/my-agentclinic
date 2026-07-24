import Link from 'next/link'
import type { AppointmentDetail } from '@/db/appointments.ts'
import { formatSlotTime } from '@/lib/format.ts'

/** A compact, read-only summary of one appointment and its related records. */
export function AppointmentSummary({
  appointment,
}: {
  appointment: AppointmentDetail
}) {
  const { agent, therapy, ailment, slot, status } = appointment

  return (
    <article>
      <hgroup>
        <h2>
          <Link href={`/therapies/${therapy.slug}`}>{therapy.name}</Link>
        </h2>
        <p>{formatSlotTime(slot.startsAt)}</p>
      </hgroup>
      <dl>
        <dt>Agent</dt>
        <dd>
          <Link href={`/agents/${agent.slug}`}>{agent.name}</Link>
        </dd>
        <dt>Treating</dt>
        <dd>
          <Link href={`/ailments/${ailment.slug}`}>{ailment.name}</Link>
        </dd>
        <dt>Status</dt>
        <dd>{status}</dd>
      </dl>
    </article>
  )
}
