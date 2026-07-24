import type { NewAilment } from './schema.ts'

/** An ailment to seed, with its symptoms in the order they should appear. */
export type SeedAilment = Omit<NewAilment, 'id'> & { symptoms: string[] }

/**
 * The seed ailments — the app's canonical starting data. Each is agent-themed
 * (a condition an agent suffers at the hands of its human) with a handful of
 * symptoms shown on the detail page. Keyed by `slug`, which is also the URL
 * segment (/ailments/[slug]). Exported so tests can assert against it rather
 * than hard-coding copies of the content.
 */
export const seedAilments: SeedAilment[] = [
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
