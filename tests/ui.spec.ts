import { test, expect } from '@playwright/test'

test.describe('UI/UX verification', () => {
  test('Modal does not trap focus (focus escapes modal)', async ({ page }) => {
    await page.goto('/users')
    await page.waitForSelector('.user-card')
    // open first user modal
    await page.click('.user-card')
    await page.waitForSelector('.modal-content')

    // Tab many times
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab')
    }

    // check if active element is inside modal
    const activeInside = await page.evaluate(() => {
      const active = document.activeElement
      if (!active) return false
      return !!active.closest('.modal-content')
    })

    // Expect it to be false (focus escaped) — demonstrates missing focus trap
    expect(activeInside).toBe(false)
  })

  test('Table header sorting is not keyboard accessible', async ({ page }) => {
    await page.goto('/table')
    await page.waitForSelector('table.data-table')

    // Check first sortable header for keyboard accessibility attributes
    const header = await page.locator('th.sortable').first()
    const tabindex = await header.getAttribute('tabindex')
    const role = await header.getAttribute('role')

    expect(tabindex).toBeNull()
    expect(role).toBeNull()

    // Click to sort to show behavior works with mouse
    const firstRowBefore = await page.locator('tbody tr td:nth-child(3)').first().textContent()
    await header.click()
    const firstRowAfter = await page.locator('tbody tr td:nth-child(3)').first().textContent()

    // Sorting should change when clicked with mouse
    expect(firstRowBefore).not.toBe(firstRowAfter)

    // Now focus header and press Enter — should not trigger sorting (keyboard handler missing)
    await header.focus()
    await page.keyboard.press('Enter')
    const firstRowAfterEnter = await page.locator('tbody tr td:nth-child(3)').first().textContent()

    // Expect no change compared to previous (keyboard didn't toggle sorting)
    expect(firstRowAfterEnter).toBe(firstRowAfter)
  })

  test('Filtering with no results shows confusing pagination instead of clear message', async ({ page }) => {
    await page.goto('/table')
    await page.waitForSelector('.filter-input')

    await page.fill('.filter-input', 'zzzzzzzzzzzz')
    await page.waitForTimeout(200)

    // There should be no friendly 'no results' message
    const noResults = await page.locator('.no-results').count()
    expect(noResults).toBe(0)

    // But pagination shows page 1 of 0 which is confusing
    const pagination = await page.locator('.pagination-info').textContent()
    expect(pagination).toContain('Page 1 of 0')
  })

  test('User cards are not keyboard focusable / actionable', async ({ page }) => {
    await page.goto('/users')
    await page.waitForSelector('.user-card')

    const card = await page.locator('.user-card').first()
    const tabindex = await card.getAttribute('tabindex')
    const role = await card.getAttribute('role')

    expect(tabindex).toBeNull()
    expect(role).toBeNull()
  })

  test('Chart widget lacks aria-label or title for accessibility', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.chart-svg')

    const svg = await page.locator('.chart-svg').first()
    const ariaLabel = await svg.getAttribute('aria-label')
    const role = await svg.getAttribute('role')
    const title = await svg.locator('title').count()

    expect(ariaLabel).toBeNull()
    expect(role).toBeNull()
    expect(title).toBe(0)
  })
})