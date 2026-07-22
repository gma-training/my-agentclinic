import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

/**
 * The severities an ailment can have. Kept as a `const` tuple so it can drive
 * both the database column's `enum` constraint and the `Severity` type below —
 * one source of truth. See specs/2026-07-22-browse-ailments/requirements.md.
 */
export const SEVERITIES = ['mild', 'moderate', 'severe'] as const
export type Severity = (typeof SEVERITIES)[number]

/** An ailment an agent suffers at the hands of its human. */
export const ailments = sqliteTable('ailments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  shortDescription: text('short_description').notNull(),
  severity: text('severity', { enum: SEVERITIES }).notNull(),
})

/**
 * Symptoms of an ailment. Modelled as a related table (one ailment → many
 * symptoms) rather than a JSON column, to demonstrate a real one-to-many
 * relation and lead into the ailment↔therapy relations of Phase 2.
 */
export const symptoms = sqliteTable('symptoms', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ailmentId: integer('ailment_id')
    .notNull()
    .references(() => ailments.id, { onDelete: 'cascade' }),
  label: text('label').notNull(),
  // Preserves the authored order of symptoms within an ailment.
  position: integer('position').notNull().default(0),
})

export type Ailment = typeof ailments.$inferSelect
export type NewAilment = typeof ailments.$inferInsert
export type Symptom = typeof symptoms.$inferSelect
export type NewSymptom = typeof symptoms.$inferInsert
