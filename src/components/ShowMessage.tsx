import React from 'react';
import { useMessage } from '../hooks/useMessage';

/**
 * Snackbar component that displays success and error messages
 * Supports multiple messages appearing simultaneously in a stack
 * Appears at the top-right corner with animations
 * Green background for success messages, red for errors
 */
export function ShowMessage() {
    const { messages, hideMessage } = useMessage();

    return (
        <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 max-w-md">
            {messages.map((message, index) => {
                const bgColor = message.type === 'success' ? 'bg-green-600' : 'bg-red-600';

                return (
                    <div
                        key={message.id}
                        className={`px-6 py-4 rounded-lg shadow-lg text-white font-semibold 
                            transition-all duration-300 ease-in-out transform
                            animate-slideIn
                            ${bgColor}`}
                        role="alert"
                        aria-live="polite"
                        style={{
                            animation: 'slideIn 0.3s ease-out'
                        }}
                    >
                        <div className="flex items-center gap-3">
                            {/* Icon based on message type */}
                            <span className="text-2xl" aria-hidden="true">
                                {message.type === 'success' ? '✓' : '✕'}
                            </span>
                            <span>{message.text}</span>
                            {/* Close button */}
                            <button
                                onClick={() => hideMessage(message.id)}
                                className="ml-4 text-white hover:text-gray-200 transition-colors"
                                aria-label="Close message"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
