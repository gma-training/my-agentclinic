import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAilmentBySlug } from '@/db/ailments.ts'
import { AilmentDetail } from './ailment-detail.tsx'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const ailment = await getAilmentBySlug(slug)

  if (!ailment) return {}

  return {
    title: `${ailment.name} — AgentClinic`,
    description: ailment.shortDescription,
  }
}

export default async function AilmentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const ailment = await getAilmentBySlug(slug)

  if (!ailment) notFound()

  return (
    <main>
      <AilmentDetail ailment={ailment} />
    </main>
  )
}
