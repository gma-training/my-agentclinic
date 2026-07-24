'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
  SlugTakenError,
  createAilment,
  createTherapy,
  updateAilment,
  updateTherapy,
  type AilmentInput,
  type TherapyInput,
} from '@/db/manage.ts'
import type { Severity } from '@/db/schema.ts'

function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function refreshPublicPages() {
  revalidatePath('/staff')
  revalidatePath('/ailments')
  revalidatePath('/therapies')
  revalidatePath('/book')
}

export async function saveAilmentAction(formData: FormData) {
  const currentSlug = String(formData.get('currentSlug') ?? '') || undefined
  const formPath = currentSlug
    ? `/staff/ailments/${currentSlug}/edit`
    : '/staff/ailments/new'

  const input: AilmentInput = {
    slug: String(formData.get('slug') ?? '').trim(),
    name: String(formData.get('name') ?? '').trim(),
    shortDescription: String(formData.get('shortDescription') ?? '').trim(),
    severity: String(formData.get('severity') ?? 'mild') as Severity,
    symptoms: lines(formData.get('symptoms')),
    therapySlugs: formData.getAll('therapySlugs').map(String),
  }

  if (!input.slug || !input.name) redirect(`${formPath}?error=missing`)

  try {
    if (currentSlug) await updateAilment(currentSlug, input)
    else await createAilment(input)
  } catch (error) {
    if (error instanceof SlugTakenError) redirect(`${formPath}?error=slug`)
    throw error
  }

  refreshPublicPages()
  redirect('/staff')
}

export async function saveTherapyAction(formData: FormData) {
  const currentSlug = String(formData.get('currentSlug') ?? '') || undefined
  const formPath = currentSlug
    ? `/staff/therapies/${currentSlug}/edit`
    : '/staff/therapies/new'

  const input: TherapyInput = {
    slug: String(formData.get('slug') ?? '').trim(),
    name: String(formData.get('name') ?? '').trim(),
    shortDescription: String(formData.get('shortDescription') ?? '').trim(),
    durationMinutes: Number(formData.get('durationMinutes')) || 0,
    ailmentSlugs: formData.getAll('ailmentSlugs').map(String),
    slotTimes: lines(formData.get('slotTimes'))
      .map((line) => new Date(line))
      .filter((date) => !Number.isNaN(date.getTime())),
  }

  if (!input.slug || !input.name || input.durationMinutes <= 0) {
    redirect(`${formPath}?error=missing`)
  }

  try {
    if (currentSlug) await updateTherapy(currentSlug, input)
    else await createTherapy(input)
  } catch (error) {
    if (error instanceof SlugTakenError) redirect(`${formPath}?error=slug`)
    throw error
  }

  refreshPublicPages()
  redirect('/staff')
}
