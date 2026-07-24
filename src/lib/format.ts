// A fixed locale keeps slot times rendering identically on server and client
// (avoiding hydration mismatches) and deterministic in tests.
const slotFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

/** A time slot's start rendered for display, e.g. "Wed 26 Jul, 09:00". */
export function formatSlotTime(startsAt: Date): string {
  return slotFormatter.format(startsAt)
}

/** A date as a `datetime-local` input value (local time), e.g. "2026-08-01T09:00". */
export function toDateTimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  )
}
