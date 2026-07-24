import { drizzle } from 'drizzle-orm/node-sqlite'

/**
 * Path to the SQLite database file. Overridable via `DATABASE_PATH` so tests
 * and CI can point at a throwaway database. Defaults to a file in the repo
 * root (git-ignored — the database is generated from migrations + seed, not
 * committed; see specs/2026-07-22-browse-ailments/requirements.md).
 *
 * Read lazily (on first connection) rather than captured at import, so a
 * `DATABASE_PATH` set after this module is imported — e.g. in test setup —
 * still takes effect.
 */
export function databasePath(): string {
  return process.env.DATABASE_PATH ?? 'agentclinic.db'
}

function connect() {
  const database = drizzle({ connection: { path: databasePath() } })
  // SQLite does not enforce foreign keys unless explicitly enabled, so we turn
  // them on for the connection to make the `symptoms → ailments` cascade real.
  database.$client.exec('PRAGMA foreign_keys = ON')
  return database
}

let instance: ReturnType<typeof connect> | undefined

/**
 * The Drizzle database client, backed by Node's built-in `node:sqlite` (no
 * native module to compile, no network needed to install). The connection is
 * opened on first call and reused thereafter — importing this module has no
 * side effects, so `DATABASE_PATH` can be set before the first query.
 */
export function getDb() {
  return (instance ??= connect())
}
