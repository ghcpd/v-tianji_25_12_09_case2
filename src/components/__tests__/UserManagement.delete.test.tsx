import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserManagement from '../UserManagement'
import { vi } from 'vitest'

describe('UserManagement delete behavior (current UX issue)', () => {
  beforeEach(() => {
    // Use real timers for this test so userEvent interactions work reliably
    vi.useRealTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('delete removes user immediately without a confirmation prompt', async () => {
    render(<UserManagement />)

    // Wait for the users to be loaded (UserManagement waits 1s)
    await waitFor(() => expect(document.querySelectorAll('.user-card').length).toBeGreaterThan(0), { timeout: 3000 })

    // user cards are plain divs with class .user-card — click the first one
    const userCards = document.querySelectorAll('.user-card')
    expect(userCards.length).toBeGreaterThan(0)
    const firstUserCard = userCards[0] as HTMLElement
    // click the name inside the card to better trigger the onClick handler in tests
    const firstUserName = firstUserCard.querySelector('.user-name') as HTMLElement
    expect(firstUserName).toBeTruthy()
    await userEvent.click(firstUserName)
    // allow any state updates to flush (no fake timers used)

    // wait for modal/dialog content element to appear, then click Delete
    await waitFor(() => expect(document.querySelector('.user-modal-content')).toBeTruthy())
    const deleteButton = document.querySelector('.delete-button') as HTMLElement
    expect(deleteButton).toBeTruthy()
    await userEvent.click(deleteButton)

    // After delete, the user should be removed from the grid (count reduces)
    // We will check that there are fewer user-avatar images than the initial set (initial was 24)
    await waitFor(() => {
      const avatars = document.querySelectorAll('.user-avatar')
      expect(avatars.length).toBeLessThan(24)
    }, { timeout: 2000 })
  })
})