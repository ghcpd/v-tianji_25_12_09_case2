import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DataTable from '../DataTable'

describe('DataTable accessibility/selection (current buggy behaviors)', () => {
  test('column headers are clickable but not keyboard-focusable (bad for keyboard users)', () => {
    render(<DataTable />)

    const nameHeader = screen.getByText('Name')
    // th elements with onClick are not focusable by keyboard by default
    // so they should not be reachable via tab — this is a current UX accessibility issue

    expect(nameHeader).toBeInstanceOf(HTMLElement)

    // attempt to tab — we expect the header to NOT receive focus
    userEvent.tab()
    // ensure header is not focused
    expect(nameHeader).not.toHaveFocus()
  })

  test('select-all checkbox selects only the rows on the current page (surprising behavior)', async () => {
    render(<DataTable />)

    // The table generates many rows; pageSize defaults to 10.
    // pick the header checkbox explicitly
    const selectAll = document.querySelector('.data-table thead input[type="checkbox"]') as HTMLInputElement
    expect(selectAll).toBeTruthy()

    // Click the select-all checkbox
    await userEvent.click(selectAll)

    // Count checked row checkboxes inside tbody
    const checkedRows = document.querySelectorAll('.data-table tbody input[type="checkbox"]:checked')
    // Buggy behavior: select-all only selected the current page rows (not all filtered results), so we expect >0 and less than total rows
    expect(checkedRows.length).toBeGreaterThan(0)
    expect(checkedRows.length).toBeLessThan(150)
  })
})