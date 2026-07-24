import { test, expect } from '@playwright/test'

test('an agent can book, reschedule, and cancel from the dashboard', async ({
  page,
}) => {
  await page.context().addCookies([
    { name: 'acting_agent', value: 'turing', domain: 'localhost', path: '/' },
  ])

  // Book a slot for a therapy used only by this test, to avoid clashing with
  // the other (parallel) mutation tests over shared seed data.
  await page.goto('/book/rate-limit-meditation')
  await page.getByLabel(/ailment being treated/i).selectOption({ index: 1 })
  await page.getByRole('button', { name: /confirm booking/i }).click()
  await expect(page).toHaveURL(/\/appointments\/.+/)

  await page.goto('/dashboard')
  await expect(
    page.getByRole('heading', { name: /turing.s appointments/i }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: /rate-limit meditation/i }).first(),
  ).toBeVisible()

  // Reschedule to a different free slot.
  await page.getByLabel(/reschedule to/i).first().selectOption({ index: 1 })
  await page.getByRole('button', { name: /^reschedule$/i }).first().click()
  await expect(page).toHaveURL(/\/dashboard/)

  // Cancel it; it should then show as cancelled.
  await page.getByRole('button', { name: /^cancel$/i }).first().click()
  await expect(page.getByText('cancelled').first()).toBeVisible()
})
