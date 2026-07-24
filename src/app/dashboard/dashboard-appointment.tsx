import type { AppointmentDetail } from '@/db/appointments.ts'
import type { TimeSlot } from '@/db/schema.ts'
import { formatSlotTime } from '@/lib/format.ts'
import { AppointmentSummary } from '../appointments/appointment-summary.tsx'
import {
  cancelAppointmentAction,
  rescheduleAppointmentAction,
} from './actions.ts'

/**
 * An upcoming appointment on the agent dashboard, with controls to cancel it or
 * reschedule it to another free slot of the same therapy.
 */
export function DashboardAppointment({
  appointment,
  availableSlots,
}: {
  appointment: AppointmentDetail
  availableSlots: TimeSlot[]
}) {
  return (
    <article>
      <AppointmentSummary appointment={appointment} />

      <div role="group">
        <form action={cancelAppointmentAction}>
          <input type="hidden" name="publicId" value={appointment.publicId} />
          <button type="submit" className="secondary">
            Cancel
          </button>
        </form>

        {availableSlots.length > 0 && (
          <form action={rescheduleAppointmentAction}>
            <input type="hidden" name="publicId" value={appointment.publicId} />
            <label>
              Reschedule to
              <select name="slotId" defaultValue="" required>
                <option value="" disabled>
                  Choose a new time…
                </option>
                {availableSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {formatSlotTime(slot.startsAt)}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit">Reschedule</button>
          </form>
        )}
      </div>
    </article>
  )
}
