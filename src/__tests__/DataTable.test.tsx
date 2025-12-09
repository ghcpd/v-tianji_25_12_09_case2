import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import DataTable from '../components/DataTable'

describe('DataTable pagination and accessibility', () => {
  it('ensures totalPages is at least 1 when no results', () => {
    render(<DataTable />)

    const filterInput = screen.getByPlaceholderText(/Search by name or email/)
    fireEvent.change(filterInput, { target: { value: 'ZZZZNONEXISTENT' } })

    const pageInfo = screen.getByText(/Page \d+ of \d+/)
    expect(pageInfo.textContent).toContain('Page 1 of 1')
  })

  it('allows sorting via keyboard on column headers', () => {
    render(<DataTable />)

    const nameHeader = screen.getByText(/^Name/)
    // Initial no arrow
    expect(nameHeader.textContent).toContain('Name')

    // Press Enter to sort ascending
    fireEvent.keyDown(nameHeader, { key: 'Enter' })
    expect(nameHeader.textContent).toContain('↑')

    // Press Enter to sort descending
    fireEvent.keyDown(nameHeader, { key: 'Enter' })
    expect(nameHeader.textContent).toContain('↓')
  })
})