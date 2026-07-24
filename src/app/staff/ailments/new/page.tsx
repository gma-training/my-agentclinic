import type { Metadata } from 'next'
import { getAllTherapies } from '@/db/therapies.ts'
import { AilmentForm } from '../../ailment-form.tsx'

export const metadata: Metadata = { title: 'New ailment — AgentClinic' }

export const dynamic = 'force-dynamic'

export default async function NewAilmentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const allTherapies = await getAllTherapies()

  return (
    <main>
      <h1>New ailment</h1>
      <AilmentForm allTherapies={allTherapies} error={error} />
    </main>
  )
}
