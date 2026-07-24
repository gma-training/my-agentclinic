import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAilmentBySlug } from '@/db/ailments.ts'
import { getAllTherapies, getTherapiesForAilment } from '@/db/therapies.ts'
import { AilmentForm } from '../../../ailment-form.tsx'

export const metadata: Metadata = { title: 'Edit ailment — AgentClinic' }

export const dynamic = 'force-dynamic'

export default async function EditAilmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { slug } = await params
  const { error } = await searchParams

  const ailment = await getAilmentBySlug(slug)
  if (!ailment) notFound()

  const [allTherapies, linked] = await Promise.all([
    getAllTherapies(),
    getTherapiesForAilment(slug),
  ])

  return (
    <main>
      <h1>Edit {ailment.name}</h1>
      <AilmentForm
        allTherapies={allTherapies}
        ailment={ailment}
        linkedTherapySlugs={linked.map((therapy) => therapy.slug)}
        error={error}
      />
    </main>
  )
}
