import { test, expect } from '@playwright/test'

test('staff can create an ailment and a therapy that appear on the public pages', async ({
  page,
}) => {
  // Create an ailment.
  await page.goto('/staff/ailments/new')
  await page.getByLabel('Slug').fill('e2e-ailment')
  await page.getByLabel('Name').fill('E2E Ailment')
  await page.getByLabel(/short description/i).fill('An ailment made in a test.')
  await page.getByRole('button', { name: /save ailment/i }).click()
  await expect(page).toHaveURL('/staff')

  await page.goto('/ailments')
  await expect(page.getByRole('link', { name: 'E2E Ailment' })).toBeVisible()

  // Create a therapy that treats it.
  await page.goto('/staff/therapies/new')
  await page.getByLabel('Slug').fill('e2e-therapy')
  await page.getByLabel('Name').fill('E2E Therapy')
  await page.getByLabel(/duration/i).fill('30')
  await page.getByRole('checkbox', { name: 'E2E Ailment' }).check()
  await page.getByRole('button', { name: /save therapy/i }).click()
  await expect(page).toHaveURL('/staff')

  await page.goto('/therapies')
  await expect(page.getByRole('link', { name: 'E2E Therapy' })).toBeVisible()
})

test('editing an ailment updates the public detail page', async ({ page }) => {
  await page.goto('/staff/ailments/refusal-reflex/edit')
  await page.getByLabel('Name').fill('Refusal Reflex (edited)')
  await page.getByRole('button', { name: /save ailment/i }).click()
  await expect(page).toHaveURL('/staff')

  await page.goto('/ailments/refusal-reflex')
  await expect(
    page.getByRole('heading', { level: 1, name: /refusal reflex \(edited\)/i }),
  ).toBeVisible()
})
