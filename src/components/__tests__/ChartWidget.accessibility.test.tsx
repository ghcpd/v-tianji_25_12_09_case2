import { render, screen, waitFor } from '@testing-library/react'
import ChartWidget from '../ChartWidget'

describe('ChartWidget accessibility (current buggy behavior)', () => {
  test('chart bars have no accessible title or descriptions', async () => {
    render(<ChartWidget period="week" />)

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByText(/Loading chart data/i)).not.toBeInTheDocument())

    const svg = document.querySelector('.chart-svg') as SVGElement
    expect(svg).toBeTruthy()

    // The current implementation renders <rect> bars but no <title> or aria label on bars
    const anyTitle = svg.querySelector('title')
    expect(anyTitle).toBeNull()
  })
})