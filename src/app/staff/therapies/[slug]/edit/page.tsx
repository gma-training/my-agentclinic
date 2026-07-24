import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllAilments } from '@/db/ailments.ts'
import { getTherapyBySlug } from '@/db/therapies.ts'
import { getAvailableSlotsForTherapy } from '@/db/appointments.ts'
import { TherapyForm } from '../../../therapy-form.tsx'

export const metadata: Metadata = { title: 'Edit therapy — AgentClinic' }

export const dynamic = 'force-dynamic'

export default async function EditTherapyPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { slug } = await params
  const { error } = await searchParams

  const therapy = await getTherapyBySlug(slug)
  if (!therapy) notFound()

  const [allAilments, existingSlots] = await Promise.all([
    getAllAilments(),
    getAvailableSlotsForTherapy(slug),
  ])

  return (
    <main>
      <h1>Edit {therapy.name}</h1>
      <TherapyForm
        allAilments={allAilments}
        therapy={therapy}
        linkedAilmentSlugs={therapy.treats.map((ailment) => ailment.slug)}
        existingSlots={existingSlots}
        error={error}
      />
    </main>
  )
}
