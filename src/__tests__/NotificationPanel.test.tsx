import { render, screen } from '@testing-library/react';
import NotificationPanel from '../components/NotificationPanel';

describe('NotificationPanel Accessibility', () => {
  test('toggle button uses unclear symbols', () => {
    const mockNotifications = [
      { id: 1, message: 'Test notification', timestamp: new Date() }
    ];

    render(
      <NotificationPanel
        notifications={mockNotifications}
        count={1}
        onClear={() => {}}
      />
    );

    const toggleButton = screen.getByRole('button', { name: '+' });
    expect(toggleButton).toBeInTheDocument();

    // Bug: Button uses '+' and '-' without clear meaning
    expect(toggleButton).not.toHaveAttribute('aria-label');
    expect(toggleButton).not.toHaveAttribute('aria-expanded');
  });

  test('notification list not properly structured', () => {
    const mockNotifications = [
      { id: 1, message: 'Test notification', timestamp: new Date() }
    ];

    render(
      <NotificationPanel
        notifications={mockNotifications}
        count={1}
        onClear={() => {}}
      />
    );

    const toggleButton = screen.getByRole('button', { name: '+' });
    toggleButton.click();

    const list = screen.getByRole('list'); // Should be a list
    expect(list).toBeInTheDocument();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBeGreaterThan(0);

    // Bug: Notifications not in proper list structure
  });
});