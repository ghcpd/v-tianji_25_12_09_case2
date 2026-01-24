import { render, screen } from '@testing-library/react';
import DataTable from '../components/DataTable';

describe('DataTable Responsiveness', () => {
  test('table has fixed minimum width causing overflow', () => {
    render(<DataTable />);

    const table = screen.getByRole('table');
    const computedStyle = window.getComputedStyle(table);

    // The table has min-width: 800px which causes issues on mobile
    // Bug: Table not responsive on small screens
    expect(table).toHaveStyle({ minWidth: '800px' });
  });

  test('table lacks proper ARIA labels for sort buttons', () => {
    render(<DataTable />);

    const sortButtons = screen.getAllByRole('columnheader');
    sortButtons.forEach(button => {
      expect(button).not.toHaveAttribute('aria-sort');
      expect(button).not.toHaveAttribute('aria-label');
    });

    // Bug: Sort state not communicated to screen readers
  });

  test('checkboxes lack proper labels', () => {
    render(<DataTable />);

    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => {
      expect(checkbox).not.toHaveAttribute('aria-label');
    });

    // Bug: Checkboxes not properly labeled for accessibility
  });
});