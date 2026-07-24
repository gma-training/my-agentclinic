import type { TherapyWithAilments } from '@/db/therapies.ts'
import type { Ailment, TimeSlot } from '@/db/schema.ts'
import { formatSlotTime } from '@/lib/format.ts'
import { saveTherapyAction } from './actions.ts'

const ERRORS: Record<string, string> = {
  slug: 'That slug is already in use. Choose another.',
  missing: 'Please fill in the required fields (a positive duration too).',
}

/** Create/edit form for a therapy. Omit `therapy` to create a new one. */
export function TherapyForm({
  allAilments,
  therapy,
  linkedAilmentSlugs = [],
  existingSlots = [],
  error,
}: {
  allAilments: Ailment[]
  therapy?: TherapyWithAilments
  linkedAilmentSlugs?: string[]
  existingSlots?: TimeSlot[]
  error?: string
}) {
  return (
    <form action={saveTherapyAction}>
      {error && ERRORS[error] && <p role="alert">{ERRORS[error]}</p>}
      {therapy && (
        <input type="hidden" name="currentSlug" value={therapy.slug} />
      )}

      <label>
        Slug
        <input name="slug" defaultValue={therapy?.slug ?? ''} required />
      </label>

      <label>
        Name
        <input name="name" defaultValue={therapy?.name ?? ''} required />
      </label>

      <label>
        Short description
        <textarea name="shortDescription" defaultValue={therapy?.shortDescription ?? ''} />
      </label>

      <label>
        Duration (minutes)
        <input
          type="number"
          name="durationMinutes"
          min={1}
          defaultValue={therapy?.durationMinutes ?? 30}
          required
        />
      </label>

      <fieldset>
        <legend>Treats</legend>
        {allAilments.map((ailment) => (
          <label key={ailment.slug}>
            <input
              type="checkbox"
              name="ailmentSlugs"
              value={ailment.slug}
              defaultChecked={linkedAilmentSlugs.includes(ailment.slug)}
            />
            {ailment.name}
          </label>
        ))}
      </fieldset>

      {existingSlots.length > 0 && (
        <details>
          <summary>Existing slots ({existingSlots.length})</summary>
          <ul>
            {existingSlots.map((slot) => (
              <li key={slot.id}>{formatSlotTime(slot.startsAt)}</li>
            ))}
          </ul>
        </details>
      )}

      <label>
        Add time slots (one per line, e.g. 2026-08-01T09:00)
        <textarea name="slotTimes" rows={4} placeholder="2026-08-01T09:00" />
      </label>

      <button type="submit">Save therapy</button>
    </form>
  )
}
