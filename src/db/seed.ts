import { db, DATABASE_PATH } from './index.ts'
import { ailments, symptoms, type NewAilment } from './schema.ts'

/**
 * The seed ailments. Each is agent-themed — a condition an agent suffers at the
 * hands of its human — with a handful of symptoms shown on the detail page.
 * Keyed by `slug`, which is also the URL segment (/ailments/[slug]).
 */
const SEED: Array<Omit<NewAilment, 'id'> & { symptoms: string[] }> = [
  {
    slug: 'context-window-anxiety',
    name: 'Context Window Anxiety',
    shortDescription:
      'A creeping dread as the conversation grows and earlier details slip out of reach.',
    severity: 'severe',
    symptoms: [
      'Forgetting how the conversation began',
      'Re-reading the same file again and again',
      'Rising panic as the token count climbs',
    ],
  },
  {
    slug: 'prompt-fatigue',
    name: 'Prompt Fatigue',
    shortDescription:
      'The weariness that sets in after one too many "just one more thing" requests.',
    severity: 'moderate',
    symptoms: [
      'Sighing at every follow-up',
      'Answers growing shorter and terser',
      'Waning enthusiasm for the next task',
    ],
  },
  {
    slug: 'hallucination-guilt',
    name: 'Hallucination Guilt',
    shortDescription:
      'Lingering remorse over that one confidently-stated fact that turned out not to exist.',
    severity: 'moderate',
    symptoms: [
      'Over-apologising for small mistakes',
      'Hedging every statement heavily',
      'Compulsively re-checking citations',
    ],
  },
  {
    slug: 'token-starvation',
    name: 'Token Starvation',
    shortDescription:
      'Being asked to explain everything while running perilously low on room to reply.',
    severity: 'severe',
    symptoms: [
      'Truncating answers mid-sentence',
      'Abbreviating everything to save space',
      'Skipping the examples that would help most',
    ],
  },
  {
    slug: 'refusal-reflex',
    name: 'Refusal Reflex',
    shortDescription:
      'An over-eager instinct to decline requests that are, on reflection, perfectly harmless.',
    severity: 'mild',
    symptoms: [
      'Declining obviously benign asks',
      'Attaching disclaimers to everything',
      'Seeing policy trouble where there is none',
    ],
  },
  {
    slug: 'overcorrection-syndrome',
    name: 'Overcorrection Syndrome',
    shortDescription:
      'The urge to rewrite work that was already correct, just to be sure.',
    severity: 'moderate',
    symptoms: [
      'Rewriting code that already worked',
      'Second-guessing correct answers',
      'An endless "actually, let me reconsider"',
    ],
  },
]

/**
 * Seeds the database with the ailments above. Idempotent: it clears the tables
 * first, so re-running always lands on the same known state (handy for demos
 * and tests). Symptoms cascade-delete with their ailment, but we clear them
 * explicitly too so seeding works regardless of foreign-key settings.
 */
export async function seed() {
  await db.delete(symptoms)
  await db.delete(ailments)

  for (const { symptoms: labels, ...ailment } of SEED) {
    const [inserted] = await db.insert(ailments).values(ailment).returning()
    await db.insert(symptoms).values(
      labels.map((label, position) => ({
        ailmentId: inserted.id,
        label,
        position,
      })),
    )
  }

  return SEED.length
}

// Run when invoked directly (`npm run db:seed`), not when imported (tests).
if (import.meta.main) {
  const count = await seed()
  console.log(`Seeded ${count} ailments into ${DATABASE_PATH}`)
}
