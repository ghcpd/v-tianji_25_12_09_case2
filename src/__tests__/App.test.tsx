import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('App Navigation', () => {
  test('navigation links do not show active state', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink).not.toHaveClass('active');

    // This test will pass because there's no logic to set active class
    // Bug: Navigation links don't indicate current page
  });

  test('navigation links lack proper ARIA labels', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).not.toHaveAttribute('aria-current');
    });

    // Bug: No aria-current for current page indication
  });
});