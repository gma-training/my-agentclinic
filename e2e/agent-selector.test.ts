import { test, expect } from '@playwright/test'

test('the header selector sets the acting agent for the session', async ({
  page,
}) => {
  await page.goto('/')

  await page.getByLabel('Acting as agent').selectOption('ada')
  await page.waitForLoadState('networkidle')

  // The dashboard reads the acting agent from the cookie the selector set.
  await page.goto('/dashboard')
  await expect(
    page.getByRole('heading', { name: /ada.s appointments/i }),
  ).toBeVisible()
})
