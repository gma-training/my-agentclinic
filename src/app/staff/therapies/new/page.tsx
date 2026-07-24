import type { Metadata } from 'next'
import { getAllAilments } from '@/db/ailments.ts'
import { TherapyForm } from '../../therapy-form.tsx'

export const metadata: Metadata = { title: 'New therapy — AgentClinic' }

export const dynamic = 'force-dynamic'

export default async function NewTherapyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const allAilments = await getAllAilments()

  return (
    <main>
      <h1>New therapy</h1>
      <TherapyForm allAilments={allAilments} error={error} />
    </main>
  )
}
