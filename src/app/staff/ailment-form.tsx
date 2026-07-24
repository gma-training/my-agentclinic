import type { AilmentWithSymptoms } from '@/db/ailments.ts'
import { SEVERITIES, type Therapy } from '@/db/schema.ts'
import { saveAilmentAction } from './actions.ts'

const ERRORS: Record<string, string> = {
  slug: 'That slug is already in use. Choose another.',
  missing: 'Please fill in the required fields.',
}

/** Create/edit form for an ailment. Omit `ailment` to create a new one. */
export function AilmentForm({
  allTherapies,
  ailment,
  linkedTherapySlugs = [],
  error,
}: {
  allTherapies: Therapy[]
  ailment?: AilmentWithSymptoms
  linkedTherapySlugs?: string[]
  error?: string
}) {
  return (
    <form action={saveAilmentAction}>
      {error && ERRORS[error] && <p role="alert">{ERRORS[error]}</p>}
      {ailment && (
        <input type="hidden" name="currentSlug" value={ailment.slug} />
      )}

      <label>
        Slug
        <input name="slug" defaultValue={ailment?.slug ?? ''} required />
      </label>

      <label>
        Name
        <input name="name" defaultValue={ailment?.name ?? ''} required />
      </label>

      <label>
        Short description
        <textarea name="shortDescription" defaultValue={ailment?.shortDescription ?? ''} />
      </label>

      <label>
        Severity
        <select name="severity" defaultValue={ailment?.severity ?? 'mild'}>
          {SEVERITIES.map((severity) => (
            <option key={severity} value={severity}>
              {severity}
            </option>
          ))}
        </select>
      </label>

      <label>
        Symptoms (one per line)
        <textarea name="symptoms" rows={4} defaultValue={ailment?.symptoms.join('\n') ?? ''} />
      </label>

      <fieldset>
        <legend>Treated by</legend>
        {allTherapies.map((therapy) => (
          <label key={therapy.slug}>
            <input
              type="checkbox"
              name="therapySlugs"
              value={therapy.slug}
              defaultChecked={linkedTherapySlugs.includes(therapy.slug)}
            />
            {therapy.name}
          </label>
        ))}
      </fieldset>

      <button type="submit">Save ailment</button>
    </form>
  )
}
