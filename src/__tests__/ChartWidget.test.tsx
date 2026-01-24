import { render, screen } from '@testing-library/react';
import ChartWidget from '../components/ChartWidget';

describe('ChartWidget Accessibility', () => {
  test('chart bars are not keyboard accessible', () => {
    render(<ChartWidget period="week" />);

    // Wait for loading to finish
    setTimeout(() => {
      const bars = screen.getAllByRole('presentation'); // rect elements don't have roles
      expect(bars.length).toBeGreaterThan(0);

      // Bug: Chart bars cannot be focused with keyboard
      bars.forEach(bar => {
        expect(bar).not.toHaveAttribute('tabindex');
        expect(bar).not.toHaveAttribute('aria-label');
      });
    }, 600);
  });

  test('chart lacks proper heading structure', () => {
    render(<ChartWidget period="week" />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();

    // But the chart itself lacks semantic structure
    // Bug: Chart data not accessible to screen readers
  });

  test('chart period indicator not announced', () => {
    render(<ChartWidget period="week" />);

    const periodElement = screen.getByText('week');
    expect(periodElement).not.toHaveAttribute('aria-live');
    expect(periodElement).not.toHaveAttribute('aria-label');

    // Bug: Period changes not announced to screen readers
  });
});