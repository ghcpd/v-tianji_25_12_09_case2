import { render, screen } from '@testing-library/react';
import Modal from '../components/Modal';

describe('Modal Accessibility', () => {
  test('modal focus management incomplete', () => {
    const mockOnClose = jest.fn();
    render(
      <Modal onClose={mockOnClose}>
        <div>Test Content</div>
      </Modal>
    );

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();

    // Bug: Focus should be trapped in modal, but test shows basic structure
    expect(modal).toHaveAttribute('aria-modal', 'true');
  });

  test('backdrop click closes modal', () => {
    const mockOnClose = jest.fn();
    render(
      <Modal onClose={mockOnClose}>
        <div>Test Content</div>
      </Modal>
    );

    const backdrop = screen.getByRole('dialog').parentElement;
    backdrop?.click();

    expect(mockOnClose).toHaveBeenCalled();
  });
});