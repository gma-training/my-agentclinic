import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Vite resolves tsconfig `paths` natively; no plugin needed.
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // Playwright owns the e2e/ directory; keep it out of the unit runner.
    exclude: ['**/node_modules/**', '**/e2e/**'],
  },
})
