import React, { useState } from 'react';

/**
 * @fileoverview This file contains the MessageThread component.
 * It is a client component that displays the message thread between users.
 * It uses React hooks to manage state and handle events.
 */

const MessageThread = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [inputMessage, setInputMessage] = useState('');

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            setMessages([...messages, inputMessage]);
            setInputMessage('');
        }
    };

    return (
        <div className="flex flex-col h-96 border rounded-lg p-4">
            <div className="flex-1 overflow-y-auto mb-4">
                {messages.map((message, index) => (
                    <div key={index} className="mb-2 p-2 bg-gray-200 rounded">
                        {message}
                    </div>
                ))}
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-1 border rounded p-2 mr-2"
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage} className="bg-blue-500 text-white rounded p-2">
                    Send
                </button>
            </div>
        </div>
    );
};

export default MessageThread;