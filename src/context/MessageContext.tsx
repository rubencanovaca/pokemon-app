import { createContext, useState, useCallback, ReactNode } from 'react';

/**
 * Type for message variants (success or error)
 */
export type MessageType = 'success' | 'error';

/**
 * Individual message in the queue
 */
export type Message = {
  /** Unique identifier for this message */
  id: string;
  /** Message text to display */
  text: string;
  /** Type of message (success or error) */
  type: MessageType;
};

/**
 * Type definition for the Message context
 * Provides access to message queue and methods to show/hide messages
 */
type MessageContextType = {
  /** Array of currently visible messages */
  messages: Message[];
  /** Function to show a message */
  showMessage: (text: string, type: MessageType) => void;
  /** Function to hide a specific message by ID */
  hideMessage: (id: string) => void;
};

export const MessageContext = createContext<MessageContextType | undefined>(undefined);

/**
 * Provider component that manages global message/notification queue
 * Supports multiple messages appearing simultaneously in a stack
 * @param children - React child components that will have access to the message context
 */
export function MessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);

  /**
   * Shows a message notification
   * Adds message to queue and automatically removes it after 3 seconds
   * @param text - The message text to display
   * @param messageType - The type of message ('success' or 'error')
   */
  const showMessage = useCallback((text: string, messageType: MessageType) => {
    const id = `${Date.now()}-${Math.random()}`;
    const newMessage: Message = { id, text, type: messageType };

    setMessages((prev) => [...prev, newMessage]);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }, 3000);
  }, []);

  /**
   * Hides a specific message by ID
   * @param id - The unique ID of the message to hide
   */
  const hideMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  return (
    <MessageContext.Provider value={{ messages, showMessage, hideMessage }}>
      {children}
    </MessageContext.Provider>
  );
}
