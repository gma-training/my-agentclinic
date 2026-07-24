import { defineConfig, devices } from '@playwright/test'

const PORT = process.env.PORT || '5000';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Run tests against the production build, as the Next.js guide recommends,
  // backed by a throwaway seeded database so the dev database is never touched.
  webServer: {
    command: 'npm run db:setup && npm run build && npm run start',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    env: { DATABASE_PATH: 'e2e.db', PORT: PORT },
  },
})
