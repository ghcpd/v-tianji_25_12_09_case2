import { render, screen } from '@testing-library/react';
import MetricCard from '../components/MetricCard';

describe('MetricCard Accessibility', () => {
  test('metric card lacks focus states', () => {
    render(
      <MetricCard
        title="Test Metric"
        value="100"
        change={5.2}
        trend="up"
      />
    );

    const card = screen.getByText('Test Metric').closest('div');
    expect(card).toBeInTheDocument();

    // Bug: Card has hover effects but no focus states for keyboard users
    expect(card).not.toHaveStyle({
      outline: expect.any(String)
    });
  });

  test('trend indicator not accessible', () => {
    render(
      <MetricCard
        title="Test Metric"
        value="100"
        change={5.2}
        trend="up"
      />
    );

    const trendElement = screen.getByText('↑ 5.2%');
    expect(trendElement).not.toHaveAttribute('aria-label');
    expect(trendElement).not.toHaveAttribute('role');

    // Bug: Trend indicator not described for screen readers
  });
});