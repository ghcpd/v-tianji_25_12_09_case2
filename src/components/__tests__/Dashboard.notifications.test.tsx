import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Dashboard from '../Dashboard'
import { vi } from 'vitest'

describe('Dashboard notification count behavior (current buggy behavior)', () => {
  beforeEach(() => {
    // use real timers and intercept setInterval where needed
    vi.useRealTimers()
    // Make randomness deterministic so fetchNotifications always returns 2 items
    vi.spyOn(Math, 'random').mockReturnValue(0.9)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('notification count is set to the latest batch size (not cumulative)', async () => {
    render(<Dashboard />)

    // wait for initial useAsyncData load (it uses a short timeout)
    await waitFor(() => expect(screen.queryByText(/Loading dashboard/i)).not.toBeInTheDocument(), { timeout: 2000 })

    // wait for the first interval to fire (Dashboard uses a 5s interval + 300ms simulated fetch latency)
    await new Promise((r) => setTimeout(r, 5500))

    // The first interval + nested timeout have been advanced manually, so the badge should be visible now
    // eslint-disable-next-line no-console
    console.log('DOM after first batch length:', document.body.innerHTML.length)
    // eslint-disable-next-line no-console
    console.log(document.body.innerHTML)
    expect(document.querySelector('.notification-badge')?.textContent).toBe('2')

    // wait for the second batch
    await new Promise((r) => setTimeout(r, 5500))

    // debug: print DOM after second batch
    // eslint-disable-next-line no-console
    console.log('DOM after second batch length:', document.body.innerHTML.length)
    // because the buggy implementation sets the displayed count to new batch length rather than cumulative total,
    // the badge text should STILL show "2" (not 4)
    expect(document.querySelector('.notification-badge')?.textContent).toBe('2')
  })
})