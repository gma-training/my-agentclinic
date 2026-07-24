import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTherapyBySlug } from '@/db/therapies.ts'
import { TherapyDetail } from './therapy-detail.tsx'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const therapy = await getTherapyBySlug(slug)

  if (!therapy) return {}

  return {
    title: `${therapy.name} — AgentClinic`,
    description: therapy.shortDescription,
  }
}

export default async function TherapyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const therapy = await getTherapyBySlug(slug)

  if (!therapy) notFound()

  return (
    <main>
      <TherapyDetail therapy={therapy} />
    </main>
  )
}
