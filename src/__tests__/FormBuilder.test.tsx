import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormBuilder from '../components/FormBuilder';

describe('FormBuilder Accessibility', () => {
  test('error messages not announced to screen readers', async () => {
    render(<FormBuilder />);

    const submitButton = screen.getByRole('button', { name: /submit form/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      const errorMessages = screen.getAllByText(/is required/i);
      expect(errorMessages.length).toBeGreaterThan(0);

      errorMessages.forEach(error => {
        expect(error).not.toHaveAttribute('aria-live');
        expect(error).not.toHaveAttribute('role', 'alert');
      });
    });

    // Bug: Error messages not announced to screen readers
  });

  test('form fields lack proper ARIA describedby', () => {
    render(<FormBuilder />);

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input).not.toHaveAttribute('aria-describedby');
    });

    // Bug: Form fields not properly associated with error messages
  });

  test('remove field buttons lack descriptive labels', () => {
    render(<FormBuilder />);

    const removeButtons = screen.getAllByRole('button', { name: '×' });
    removeButtons.forEach(button => {
      expect(button).not.toHaveAttribute('aria-label');
    });

    // Bug: Remove buttons not properly labeled
  });
});