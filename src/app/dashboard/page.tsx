import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getAppointmentsForAgent,
  getAvailableSlotsForTherapy,
} from '@/db/appointments.ts'
import { getActingAgent } from '@/lib/acting-agent.ts'
import { AppointmentSummary } from '../appointments/appointment-summary.tsx'
import { DashboardAppointment } from './dashboard-appointment.tsx'

export const metadata: Metadata = {
  title: 'My appointments — AgentClinic',
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ taken?: string }>
}) {
  const { taken } = await searchParams
  const agent = await getActingAgent()

  if (!agent) {
    return (
      <main>
        <hgroup>
          <h1>My appointments</h1>
          <p>Choose an agent from the header to see their appointments.</p>
        </hgroup>
      </main>
    )
  }

  const { upcoming, past } = await getAppointmentsForAgent(agent.id)

  // Free slots for each upcoming appointment's therapy, for the reschedule menu.
  const slotsByTherapy = new Map(
    await Promise.all(
      [...new Set(upcoming.map((a) => a.therapy.slug))].map(
        async (slug) =>
          [slug, await getAvailableSlotsForTherapy(slug)] as const,
      ),
    ),
  )

  return (
    <main>
      <hgroup>
        <h1>{agent.name}&rsquo;s appointments</h1>
        <p>Your upcoming and past visits to the clinic.</p>
      </hgroup>

      {taken && (
        <p role="alert">
          That slot was just taken. Please pick a different time.
        </p>
      )}

      <section>
        <h2>Upcoming</h2>
        {upcoming.length === 0 ? (
          <p>
            No upcoming appointments. <Link href="/book">Book one</Link>.
          </p>
        ) : (
          upcoming.map((appointment) => (
            <DashboardAppointment
              key={appointment.publicId}
              appointment={appointment}
              availableSlots={slotsByTherapy.get(appointment.therapy.slug) ?? []}
            />
          ))
        )}
      </section>

      <section>
        <h2>Past</h2>
        {past.length === 0 ? (
          <p>Nothing in your history yet.</p>
        ) : (
          past.map((appointment) => (
            <AppointmentSummary
              key={appointment.publicId}
              appointment={appointment}
            />
          ))
        )}
      </section>
    </main>
  )
}
