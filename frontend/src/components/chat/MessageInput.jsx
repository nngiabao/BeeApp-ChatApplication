import React, { useState } from "react";
import { Smile, Paperclip, Send } from "lucide-react";

export default function MessageInput({ onSend }) {
    const [input, setInput] = useState("");

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Send the message through WebSocket
        if (onSend) {
            onSend(input.trim());
        }

        setInput(""); // Clear after send
    };

    return (
        <form
            onSubmit={handleSend}
            className="p-4 bg-[#f0f2f5] border-t border-gray-300 flex items-center space-x-3"
        >
            <Smile className="w-6 h-6 text-gray-600 cursor-pointer" />
            <Paperclip className="w-6 h-6 text-gray-600 cursor-pointer" />

            <input
                type="text"
                placeholder="Type a message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2 border rounded-full focus:outline-none focus:ring focus:ring-green-200"
            />

            <button type="submit">
                <Send className="w-6 h-6 text-green-600 hover:text-green-700 cursor-pointer" />
            </button>
        </form>
    );
}
