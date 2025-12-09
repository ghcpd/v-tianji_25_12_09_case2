import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

function BuggyCounter() {
  const [count, setCount] = React.useState(0)
  const handleBatch = (newNotifications: any[]) => {
    // buggy behavior: overwrite with batch length
    setCount(newNotifications.length)
  }
  return (
    <div>
      <div data-testid="count">{count}</div>
      <button onClick={() => handleBatch([1,2])}>batch1</button>
      <button onClick={() => handleBatch([3])}>batch2</button>
    </div>
  )
}

function FixedCounter() {
  const [count, setCount] = React.useState(0)
  const handleBatch = (newNotifications: any[]) => {
    // fixed behavior: accumulate
    setCount(prev => prev + newNotifications.length)
  }
  return (
    <div>
      <div data-testid="count">{count}</div>
      <button onClick={() => handleBatch([1,2])}>batch1</button>
      <button onClick={() => handleBatch([3])}>batch2</button>
    </div>
  )
}

describe('Notification count behavior', () => {
  it('demonstrates buggy overwrite vs fixed accumulation', () => {
    const { getByText, getByTestId, rerender } = render(<BuggyCounter />)

    fireEvent.click(getByText('batch1'))
    expect(getByTestId('count').textContent).toBe('2')

    fireEvent.click(getByText('batch2'))
    // buggy: overwritten to 1
    expect(getByTestId('count').textContent).toBe('1')

    // Now test fixed behavior
    rerender(<FixedCounter />)
    fireEvent.click(getByText('batch1'))
    expect(getByTestId('count').textContent).toBe('2')

    fireEvent.click(getByText('batch2'))
    // fixed: accumulates to 3
    expect(getByTestId('count').textContent).toBe('3')
  })
})