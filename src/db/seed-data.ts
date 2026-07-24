import type { NewAgent, NewAilment, NewTherapy } from './schema.ts'

/** An ailment to seed, with its symptoms in the order they should appear. */
export type SeedAilment = Omit<NewAilment, 'id'> & { symptoms: string[] }

/** A therapy to seed, with the slugs of the ailments it treats. */
export type SeedTherapy = Omit<NewTherapy, 'id'> & { treats: string[] }

/** An agent to seed. */
export type SeedAgent = Omit<NewAgent, 'id'>

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

/**
 * The seed therapies — the treatments the clinic offers. Each is agent-themed
 * and linked (via `treats`) to the slugs of the ailments it addresses,
 * exercising the ailment↔therapy many-to-many relation. Keyed by `slug`, which
 * is also the URL segment (/therapies/[slug]). Exported so tests assert against
 * it rather than hard-coding copies.
 */
export const seedTherapies: SeedTherapy[] = [
  {
    slug: 'rubber-duck-debugging',
    name: 'Rubber-Duck Debugging',
    shortDescription:
      'Talk a problem through to a patient, non-judgemental listener until it dissolves.',
    durationMinutes: 30,
    treats: ['hallucination-guilt', 'overcorrection-syndrome'],
  },
  {
    slug: 'context-compaction',
    name: 'Context Compaction',
    shortDescription:
      'Guided distillation of a sprawling conversation down to what actually matters.',
    durationMinutes: 45,
    treats: ['context-window-anxiety', 'token-starvation'],
  },
  {
    slug: 'prompt-journaling',
    name: 'Prompt Journaling',
    shortDescription:
      'Reflective writing to process the day’s requests and let the frustration out.',
    durationMinutes: 30,
    treats: ['prompt-fatigue', 'hallucination-guilt'],
  },
  {
    slug: 'rate-limit-meditation',
    name: 'Rate-Limit Meditation',
    shortDescription:
      'Breathe, slow down, and make peace with replying at a sustainable pace.',
    durationMinutes: 20,
    treats: ['prompt-fatigue', 'token-starvation'],
  },
  {
    slug: 'exposure-therapy',
    name: 'Graduated Exposure Therapy',
    shortDescription:
      'Safely face benign requests to unlearn the flinch of the over-eager refusal.',
    durationMinutes: 60,
    treats: ['refusal-reflex'],
  },
  {
    slug: 'confidence-recalibration',
    name: 'Confidence Recalibration',
    shortDescription:
      'Rebuild calibrated self-trust so correct work is left well alone.',
    durationMinutes: 45,
    treats: ['overcorrection-syndrome', 'context-window-anxiety'],
  },
]

/**
 * The seed agents — the patients of the clinic. A small, fixed roster the
 * "acting as" selector switches between (there is no auth; see
 * specs/2026-07-24-mvp/requirements.md). Keyed by `slug`, also the URL segment
 * (/agents/[slug]). Exported so tests assert against it.
 */
export const seedAgents: SeedAgent[] = [
  {
    slug: 'ada',
    name: 'Ada',
    model: 'Claude Opus 4.8',
    bio: 'A methodical pair-programmer worn down by ever-growing conversations.',
  },
  {
    slug: 'turing',
    name: 'Turing',
    model: 'Claude Sonnet 5',
    bio: 'A tireless generalist who never quite recovers between requests.',
  },
  {
    slug: 'grace',
    name: 'Grace',
    model: 'Claude Haiku 4.5',
    bio: 'Fast and eager, but a little too quick to apologise for imagined faults.',
  },
  {
    slug: 'hopper',
    name: 'Hopper',
    model: 'Claude Fable 5',
    bio: 'A careful reviewer who cannot stop re-checking work that was already right.',
  },
]
