import { useContext } from 'react';
import { MessageContext } from '../context/MessageContext';

/**
 * Custom hook to access the message context
 * Provides access to message state and methods to show/hide notifications
 * @returns The message context containing message state, showMessage, and hideMessage functions
 * @throws Error if used outside of MessageProvider
 */
export function useMessage() {
    const context = useContext(MessageContext);
    // Ensure the hook is used within the MessageProvider
    if (context === undefined) {
        throw new Error('useMessage must be used within a MessageProvider');
    }
    return context;
}
