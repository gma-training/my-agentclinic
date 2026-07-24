'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { SlotTakenError, bookAppointment } from '@/db/appointments.ts'
import { getActingAgent } from '@/lib/acting-agent.ts'

/**
 * Books the chosen slot for the acting agent. Reads the agent from the session
 * cookie (not the form) so it can't be spoofed. On success, redirects to the
 * confirmation page; if the slot was taken in the meantime, back to the booking
 * page with a flag so the UI can explain what happened.
 */
export async function bookAppointmentAction(formData: FormData) {
  const therapySlug = String(formData.get('therapySlug') ?? '')
  const slotId = Number(formData.get('slotId'))
  const ailmentId = Number(formData.get('ailmentId'))

  const agent = await getActingAgent()
  if (!agent) redirect(`/book/${therapySlug}?agent=required`)
  if (!slotId || !ailmentId) redirect(`/book/${therapySlug}?invalid=1`)

  let publicId: string
  try {
    const appointment = await bookAppointment({
      agentId: agent.id,
      ailmentId,
      slotId,
    })
    publicId = appointment.publicId
  } catch (error) {
    if (error instanceof SlotTakenError) {
      redirect(`/book/${therapySlug}?taken=1`)
    }
    throw error
  }

  revalidatePath('/dashboard')
  redirect(`/appointments/${publicId}`)
}
