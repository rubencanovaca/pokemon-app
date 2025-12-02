import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ShowMessage } from '../src/components/ShowMessage';
import { MessageProvider } from '../src/context/MessageContext';
import { useMessage } from '../src/hooks/useMessage';

/**
 * Test helper component to trigger messages
 */
function MessageTrigger({ text, type }: { text: string; type: 'success' | 'error' }) {
  const { showMessage } = useMessage();

  return <button onClick={() => showMessage(text, type)}>Show Message</button>;
}

describe('ShowMessage Component', () => {
  it('should render success message with green background', async () => {
    render(
      <MessageProvider>
        <ShowMessage />
        <MessageTrigger text="Test success message" type="success" />
      </MessageProvider>
    );

    // Click button to show message
    const button = screen.getByText('Show Message');
    fireEvent.click(button);

    // Wait for message to appear
    await waitFor(() => {
      const message = screen.getByText('Test success message');
      expect(message).toBeInTheDocument();

      // Check for success styling (green background) - use the alert role to get the outer container
      const container = screen.getByRole('alert');
      expect(container).toHaveClass('bg-green-600');
    });
  });

  it('should render error message with red background', async () => {
    render(
      <MessageProvider>
        <ShowMessage />
        <MessageTrigger text="Test error message" type="error" />
      </MessageProvider>
    );

    // Click button to show message
    const button = screen.getByText('Show Message');
    fireEvent.click(button);

    // Wait for message to appear
    await waitFor(() => {
      const message = screen.getByText('Test error message');
      expect(message).toBeInTheDocument();

      // Check for error styling (red background) - use the alert role to get the outer container
      const container = screen.getByRole('alert');
      expect(container).toHaveClass('bg-red-600');
    });
  });

  it('should display success icon for success messages', async () => {
    render(
      <MessageProvider>
        <ShowMessage />
        <MessageTrigger text="Success" type="success" />
      </MessageProvider>
    );

    const button = screen.getByText('Show Message');
    fireEvent.click(button);

    await waitFor(() => {
      // Check for checkmark icon
      expect(screen.getByText('✓')).toBeInTheDocument();
    });
  });

  it('should display error icon for error messages', async () => {
    render(
      <MessageProvider>
        <ShowMessage />
        <MessageTrigger text="Error" type="error" />
      </MessageProvider>
    );

    const button = screen.getByText('Show Message');
    fireEvent.click(button);

    await waitFor(() => {
      // Check for X icon - there are two ✕ (icon and close button), get the first one
      const xElements = screen.getAllByText('✕');
      expect(xElements[0]).toBeInTheDocument();
    });
  });

  it('should auto-hide message after 3 seconds', async () => {
    render(
      <MessageProvider>
        <ShowMessage />
        <MessageTrigger text="Auto hide test" type="success" />
      </MessageProvider>
    );

    const button = screen.getByText('Show Message');
    fireEvent.click(button);

    // Message should be visible initially
    await waitFor(() => {
      expect(screen.getByText('Auto hide test')).toBeInTheDocument();
    });

    // Wait for auto-hide (3 seconds + animation delay)
    await waitFor(
      () => {
        expect(screen.queryByText('Auto hide test')).not.toBeInTheDocument();
      },
      { timeout: 4000 }
    );
  });

  it('should hide message when close button is clicked', async () => {
    render(
      <MessageProvider>
        <ShowMessage />
        <MessageTrigger text="Closeable message" type="success" />
      </MessageProvider>
    );

    const button = screen.getByText('Show Message');
    fireEvent.click(button);

    // Wait for message to appear
    await waitFor(() => {
      expect(screen.getByText('Closeable message')).toBeInTheDocument();
    });

    // Click close button
    const closeButton = screen.getByLabelText('Close message');
    fireEvent.click(closeButton);

    // Message should disappear
    await waitFor(() => {
      expect(screen.queryByText('Closeable message')).not.toBeInTheDocument();
    });
  });
  it('should stack multiple messages', async () => {
    render(
      <MessageProvider>
        <ShowMessage />
        <MessageTrigger text="Message 1" type="success" />
        <MessageTrigger text="Message 2" type="error" />
      </MessageProvider>
    );

    const buttons = screen.getAllByText('Show Message');

    // Trigger first message
    fireEvent.click(buttons[0]);

    // Trigger second message
    fireEvent.click(buttons[1]);

    await waitFor(() => {
      expect(screen.getByText('Message 1')).toBeInTheDocument();
      expect(screen.getByText('Message 2')).toBeInTheDocument();

      // Should have 2 messages visible
      const alerts = screen.getAllByRole('alert');
      expect(alerts).toHaveLength(2);
    });
  });
});
