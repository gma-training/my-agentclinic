'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
  SlotTakenError,
  cancelAppointment,
  rescheduleAppointment,
} from '@/db/appointments.ts'

export async function cancelAppointmentAction(formData: FormData) {
  const publicId = String(formData.get('publicId') ?? '')
  if (publicId) await cancelAppointment(publicId)
  revalidatePath('/dashboard')
}

export async function rescheduleAppointmentAction(formData: FormData) {
  const publicId = String(formData.get('publicId') ?? '')
  const newSlotId = Number(formData.get('slotId'))
  if (!publicId || !newSlotId) redirect('/dashboard')

  try {
    await rescheduleAppointment(publicId, newSlotId)
  } catch (error) {
    if (error instanceof SlotTakenError) {
      redirect('/dashboard?taken=1')
    }
    throw error
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
