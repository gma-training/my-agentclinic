import { defineConfig } from 'drizzle-kit'

// drizzle-kit only needs the schema + dialect to *generate* SQL migrations;
// applying them is done in code via src/db/migrate.ts (drizzle-orm's
// node:sqlite migrator). See specs/2026-07-22-browse-ailments/plan.md.
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/db/schema.ts',
  out: './drizzle',
})
