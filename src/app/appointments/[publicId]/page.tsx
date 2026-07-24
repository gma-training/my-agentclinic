import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAppointmentByPublicId } from '@/db/appointments.ts'
import { AppointmentSummary } from '../appointment-summary.tsx'

export const metadata: Metadata = {
  title: 'Appointment — AgentClinic',
}

export const dynamic = 'force-dynamic'

export default async function AppointmentPage({
  params,
}: {
  params: Promise<{ publicId: string }>
}) {
  const { publicId } = await params
  const appointment = await getAppointmentByPublicId(publicId)

  if (!appointment) notFound()

  return (
    <main>
      <hgroup>
        <h1>You&rsquo;re booked in</h1>
        <p>Relief is on the way, {appointment.agent.name}.</p>
      </hgroup>

      <AppointmentSummary appointment={appointment} />

      <p>
        <Link href="/dashboard">View my appointments</Link>
      </p>
    </main>
  )
}
