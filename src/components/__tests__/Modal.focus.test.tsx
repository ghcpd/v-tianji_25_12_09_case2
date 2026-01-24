import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '../Modal'
import { useState } from 'react'

function Wrapper() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button aria-label="opener" onClick={() => setOpen(true)}>Open</button>
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <div>
            <input placeholder="first-input" />
            <button>Inside</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

describe('Modal focus behavior (current buggy behavior)', () => {
  test('closing modal does NOT restore focus to previously focused element', async () => {
    render(<Wrapper />)
    const opener = screen.getByLabelText('opener') as HTMLButtonElement

    opener.focus()
    expect(document.activeElement).toBe(opener)

    await userEvent.click(opener)

    // the modal focuses the first input after a short timeout
    await waitFor(() => expect(screen.getByPlaceholderText('first-input')).toHaveFocus())

    // close modal by clicking the backdrop (the dialog itself)
    const backdrop = screen.getByRole('dialog') as HTMLElement
    await userEvent.click(backdrop)

    // Buggy behavior: focus is NOT restored to the opener button
    expect(document.activeElement).not.toBe(opener)
  })
})