export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const { databasePath } = await import('./db/index.ts')

  // An in-memory database (used by the e2e tests) is empty on every boot, so
  // set it up here. An on-disk database is prepared out of band via
  // `npm run db:setup`, so leave it untouched.
  if (databasePath() !== ':memory:') return

  const { runMigrations } = await import('./db/migrate.ts')
  const { seed } = await import('./db/seed.ts')

  runMigrations()
  await seed()
}
