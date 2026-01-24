import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('../hooks/useAsyncData', () => ({
  useAsyncData: vi.fn(() => ({ data: null, loading: true, error: null, refetch: vi.fn() }))
}))

import { useAsyncData } from '../hooks/useAsyncData'
import React from 'react'
import { render } from '@testing-library/react'

import Dashboard from '../components/Dashboard'

describe('Dashboard useAsyncData dependency behavior', () => {
  beforeEach(() => {
    ;(useAsyncData as any).mockClear()
  })

  it('passes selectedPeriod as dependency so data refetches when period changes', () => {
    render(<Dashboard />)

    // useAsyncData should have been called with fetch function and dependency array
    expect((useAsyncData as any)).toHaveBeenCalled()
    const firstCallArgs = (useAsyncData as any).mock.calls[0]
    // second argument should be the dependencies array
    expect(firstCallArgs[1]).toEqual(['week'])
  })
})