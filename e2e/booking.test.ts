import { test, expect } from '@playwright/test'

// The acting agent is a cookie (no auth). Setting it directly keeps the booking
// flow deterministic; the selector UI itself is covered in agent-selector.test.ts.
async function actAs(page: import('@playwright/test').Page, slug: string) {
  await page.context().addCookies([
    { name: 'acting_agent', value: slug, domain: 'localhost', path: '/' },
  ])
}

test('the acting agent can book a therapy slot and see it confirmed', async ({
  page,
}) => {
  await actAs(page, 'grace')
  await page.goto('/book/exposure-therapy')

  const firstSlot = (
    await page.locator('fieldset label').first().innerText()
  ).trim()

  await page.getByLabel(/ailment being treated/i).selectOption({ index: 1 })
  await page.getByRole('button', { name: /confirm booking/i }).click()

  await expect(page).toHaveURL(/\/appointments\/.+/)
  await expect(
    page.getByRole('heading', { name: /booked in/i }),
  ).toBeVisible()

  // The slot just booked is no longer offered.
  await page.goto('/book/exposure-therapy')
  await expect(
    page.locator('fieldset label', { hasText: firstSlot }),
  ).toHaveCount(0)
})

test('booking is blocked until an agent is chosen', async ({ page }) => {
  await page.goto('/book/confidence-recalibration')

  await expect(page.getByText(/before booking/i)).toBeVisible()
  await expect(
    page.getByRole('button', { name: /confirm booking/i }),
  ).toHaveCount(0)
})
