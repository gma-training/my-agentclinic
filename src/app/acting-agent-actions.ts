'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { ACTING_AGENT_COOKIE } from '@/lib/acting-agent.ts'

/**
 * Sets (or, given an empty value, clears) the agent the session is acting as.
 * Invoked by the header selector. Revalidates the whole tree so every page
 * reflects the new acting agent.
 */
export async function setActingAgent(formData: FormData) {
  const slug = String(formData.get('slug') ?? '')
  const cookieStore = await cookies()

  if (slug) {
    cookieStore.set(ACTING_AGENT_COOKIE, slug, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    })
  } else {
    cookieStore.delete(ACTING_AGENT_COOKIE)
  }

  revalidatePath('/', 'layout')
}
