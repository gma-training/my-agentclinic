import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTherapyBySlug } from '@/db/therapies.ts'
import { getAvailableSlotsForTherapy } from '@/db/appointments.ts'
import { getActingAgent } from '@/lib/acting-agent.ts'
import { formatSlotTime } from '@/lib/format.ts'
import { bookAppointmentAction } from '../actions.ts'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ therapySlug: string }>
}): Promise<Metadata> {
  const { therapySlug } = await params
  const therapy = await getTherapyBySlug(therapySlug)
  return therapy ? { title: `Book ${therapy.name} — AgentClinic` } : {}
}

export default async function BookTherapyPage({
  params,
  searchParams,
}: {
  params: Promise<{ therapySlug: string }>
  searchParams: Promise<{ taken?: string; agent?: string; invalid?: string }>
}) {
  const { therapySlug } = await params
  const { taken, agent: agentRequired } = await searchParams

  const therapy = await getTherapyBySlug(therapySlug)
  if (!therapy) notFound()

  const actingAgent = await getActingAgent()
  const slots = await getAvailableSlotsForTherapy(therapySlug)

  return (
    <main>
      <hgroup>
        <h1>Book {therapy.name}</h1>
        <p>{therapy.durationMinutes} min appointment</p>
      </hgroup>

      {taken && (
        <p role="alert">
          Sorry — that slot was just taken. Please choose another.
        </p>
      )}

      {!actingAgent ? (
        <p role="alert">
          Choose an agent from the header before booking.
        </p>
      ) : agentRequired ? (
        <p role="alert">Choose an agent from the header before booking.</p>
      ) : slots.length === 0 ? (
        <p>No upcoming slots are available for this therapy.</p>
      ) : (
        <form action={bookAppointmentAction}>
          <input type="hidden" name="therapySlug" value={therapy.slug} />

          <p>
            Booking as <strong>{actingAgent.name}</strong>.
          </p>

          <label>
            Ailment being treated
            <select name="ailmentId" required defaultValue="">
              <option value="" disabled>
                Choose an ailment…
              </option>
              {therapy.treats.map((ailment) => (
                <option key={ailment.slug} value={ailment.id}>
                  {ailment.name}
                </option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend>Choose a time</legend>
            {slots.map((slot, index) => (
              <label key={slot.id}>
                <input
                  type="radio"
                  name="slotId"
                  value={slot.id}
                  defaultChecked={index === 0}
                  required
                />
                {formatSlotTime(slot.startsAt)}
              </label>
            ))}
          </fieldset>

          <button type="submit">Confirm booking</button>
        </form>
      )}

      <p>
        <Link href={`/therapies/${therapy.slug}`}>Back to {therapy.name}</Link>
      </p>
    </main>
  )
}
