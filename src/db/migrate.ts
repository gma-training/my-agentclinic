import { migrate } from 'drizzle-orm/node-sqlite/migrator'
import { db, DATABASE_PATH } from './index.ts'

// Applies any pending SQL migrations from ./drizzle to the database. Run via
// `npm run db:migrate`. Safe to re-run — already-applied migrations are skipped.
migrate(db, { migrationsFolder: './drizzle' })
console.log(`Migrations applied to ${DATABASE_PATH}`)
