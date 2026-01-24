import { render, screen } from '@testing-library/react'
import NotificationPanel from '../NotificationPanel'

describe('NotificationPanel accessibility (current issues)', () => {
  test('toggle button uses "+" character as accessible name which is not descriptive', () => {
    render(<NotificationPanel notifications={[]} count={0} onClear={() => {}} />)

    // The toggle button has accessible name '+' when collapsed
    const toggle = screen.getByRole('button', { name: '+' })
    expect(toggle).toBeTruthy()

    // It should have a more descriptive accessible name; currently it does not
    expect(toggle.getAttribute('aria-label')).toBeNull()
  })
})