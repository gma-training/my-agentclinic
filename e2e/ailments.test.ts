import { test, expect } from '@playwright/test'
import { seedAilments } from '../src/db/seed-data.ts'

test('the list page shows every seeded ailment', async ({ page }) => {
  await page.goto('/ailments')

  for (const ailment of seedAilments) {
    await expect(page.getByRole('link', { name: ailment.name })).toBeVisible()
  }
})

test('clicking an ailment opens its detail page with symptoms and severity', async ({
  page,
}) => {
  const ailment = seedAilments[0]

  await page.goto('/ailments')
  await page.getByRole('link', { name: ailment.name }).click()

  await expect(page).toHaveURL(`/ailments/${ailment.slug}`)
  await expect(
    page.getByRole('heading', { level: 1, name: ailment.name }),
  ).toBeVisible()
  await expect(page.getByText(ailment.severity)).toBeVisible()
  for (const symptom of ailment.symptoms) {
    await expect(page.getByText(symptom)).toBeVisible()
  }
})

test('an unknown slug shows the not-found UI and returns 404', async ({
  page,
}) => {
  const response = await page.goto('/ailments/does-not-exist')

  expect(response?.status()).toBe(404)
  await expect(
    page.getByRole('heading', { name: /no such ailment/i }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: /back to all ailments/i }),
  ).toBeVisible()
})
