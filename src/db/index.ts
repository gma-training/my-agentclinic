import { drizzle } from 'drizzle-orm/node-sqlite'

/**
 * Path to the SQLite database file. Overridable via `DATABASE_PATH` so tests
 * and CI can point at a throwaway database. Defaults to a file in the repo
 * root (git-ignored — the database is generated from migrations + seed, not
 * committed; see specs/2026-07-22-browse-ailments/requirements.md).
 */
export const DATABASE_PATH = process.env.DATABASE_PATH ?? 'agentclinic.db'

/**
 * The Drizzle database client, backed by Node's built-in `node:sqlite`
 * (no native module to compile, no network needed to install). Foreign keys
 * are not enforced by SQLite unless explicitly enabled, so we turn them on for
 * every connection to make the `symptoms → ailments` cascade real.
 */
export const db = drizzle({ connection: { path: DATABASE_PATH } })
db.$client.exec('PRAGMA foreign_keys = ON')
