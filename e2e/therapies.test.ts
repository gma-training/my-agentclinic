import { test, expect } from '@playwright/test'
import { seedTherapies } from '../src/db/seed-data.ts'

test('the list page shows every seeded therapy', async ({ page }) => {
  await page.goto('/therapies')

  for (const therapy of seedTherapies) {
    await expect(page.getByRole('link', { name: therapy.name })).toBeVisible()
  }
})

test('clicking a therapy opens its detail page showing the ailments it treats', async ({
  page,
}) => {
  const therapy = seedTherapies[0]

  await page.goto('/therapies')
  await page.getByRole('link', { name: therapy.name }).click()

  await expect(page).toHaveURL(`/therapies/${therapy.slug}`)
  await expect(
    page.getByRole('heading', { level: 1, name: therapy.name }),
  ).toBeVisible()
  for (const ailmentSlug of therapy.treats) {
    await expect(
      page.getByRole('link', { name: new RegExp(ailmentSlug.replace(/-/g, ' '), 'i') }),
    ).toBeVisible()
  }
})

test('an ailment detail page lists the therapies that treat it', async ({
  page,
}) => {
  // context-window-anxiety is treated by context-compaction in the seed data.
  await page.goto('/ailments/context-window-anxiety')

  await expect(
    page.getByRole('heading', { name: /therapies that treat this/i }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: /context compaction/i }),
  ).toBeVisible()
})

test('an unknown therapy slug shows the not-found UI and returns 404', async ({
  page,
}) => {
  const response = await page.goto('/therapies/does-not-exist')

  expect(response?.status()).toBe(404)
  await expect(
    page.getByRole('heading', { name: /no such therapy/i }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: /back to all therapies/i }),
  ).toBeVisible()
})
