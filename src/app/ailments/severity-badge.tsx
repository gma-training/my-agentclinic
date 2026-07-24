import type { Severity } from '@/db/schema.ts'

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className="severity" data-severity={severity}>
      {severity}
    </span>
  )
}
