import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllAgents } from '@/db/agents.ts'
import { getAllAilments } from '@/db/ailments.ts'
import { getAllTherapies } from '@/db/therapies.ts'
import { getAllAppointments } from '@/db/appointments.ts'
import { formatSlotTime } from '@/lib/format.ts'

export const metadata: Metadata = {
  title: 'Staff — AgentClinic',
}

export const dynamic = 'force-dynamic'

export default async function StaffPage() {
  const [appointments, agents, ailments, therapies] = await Promise.all([
    getAllAppointments(),
    getAllAgents(),
    getAllAilments(),
    getAllTherapies(),
  ])

  return (
    <main>
      <hgroup>
        <h1>Staff dashboard</h1>
        <p>Run the clinic: appointments, agents, ailments, and therapies.</p>
      </hgroup>

      <section>
        <h2>Appointments</h2>
        {appointments.length === 0 ? (
          <p>No appointments booked yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th scope="col">When</th>
                <th scope="col">Agent</th>
                <th scope="col">Therapy</th>
                <th scope="col">Ailment</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.publicId}>
                  <td>
                    <Link href={`/appointments/${appointment.publicId}`}>
                      {formatSlotTime(appointment.slot.startsAt)}
                    </Link>
                  </td>
                  <td>{appointment.agent.name}</td>
                  <td>{appointment.therapy.name}</td>
                  <td>{appointment.ailment.name}</td>
                  <td>{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <hgroup>
          <h2>Ailments</h2>
          <p>
            <Link href="/staff/ailments/new" role="button">
              New ailment
            </Link>
          </p>
        </hgroup>
        <ul>
          {ailments.map((ailment) => (
            <li key={ailment.slug}>
              {ailment.name} —{' '}
              <Link href={`/staff/ailments/${ailment.slug}/edit`}>Edit</Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <hgroup>
          <h2>Therapies</h2>
          <p>
            <Link href="/staff/therapies/new" role="button">
              New therapy
            </Link>
          </p>
        </hgroup>
        <ul>
          {therapies.map((therapy) => (
            <li key={therapy.slug}>
              {therapy.name} —{' '}
              <Link href={`/staff/therapies/${therapy.slug}/edit`}>Edit</Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Agents</h2>
        <ul>
          {agents.map((agent) => (
            <li key={agent.slug}>
              <Link href={`/agents/${agent.slug}`}>{agent.name}</Link> —{' '}
              {agent.model}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
