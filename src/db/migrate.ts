import { migrate } from 'drizzle-orm/node-sqlite/migrator'
import { db, DATABASE_PATH } from './index.ts'

/**
 * Applies any pending SQL migrations from ./drizzle to the database. Safe to
 * re-run — already-applied migrations are skipped.
 */
export function runMigrations() {
  migrate(db, { migrationsFolder: './drizzle' })
}

// Run when invoked directly (`npm run db:migrate`), not when imported (tests).
if (import.meta.main) {
  runMigrations()
  console.log(`Migrations applied to ${DATABASE_PATH}`)
}
