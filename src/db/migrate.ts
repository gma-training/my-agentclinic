import { migrate } from 'drizzle-orm/node-sqlite/migrator'
import { databasePath, getDb } from './index.ts'

/**
 * Applies any pending SQL migrations from ./drizzle to the database. Safe to
 * re-run — already-applied migrations are skipped.
 */
export function runMigrations() {
  migrate(getDb(), { migrationsFolder: './drizzle' })
}

// Run when invoked directly (`npm run db:migrate`), not when imported (tests).
if (import.meta.main) {
  runMigrations()
  console.log(`Migrations applied to ${databasePath()}`)
}
