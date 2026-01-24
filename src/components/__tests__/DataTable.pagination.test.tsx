import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DataTable from '../DataTable'

describe('DataTable pagination and page/total behavior (current buggy behavior)', () => {
  test('filtering to zero results shows Page 1 of 0 and Next remains enabled (incorrect)', async () => {
    render(<DataTable />)

    const searchInput = screen.getByPlaceholderText(/Search by name or email/i)
    await userEvent.type(searchInput, 'text-that-does-not-match-any-name')

    expect(screen.getByText(/Page 1 of 0/i)).toBeInTheDocument()

    const next = screen.getByRole('button', { name: /Next/i })
    // Bug: Next remains enabled when there are zero pages (currentPage 1 and totalPages 0)
    expect(next).not.toBeDisabled()
  })
})