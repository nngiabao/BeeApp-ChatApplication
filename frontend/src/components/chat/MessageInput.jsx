// src/components/chat/MessageInput.jsx
import React, { useState } from "react";
import { Smile, Paperclip, Mic } from "lucide-react";


export default function MessageInput() {
    const [input, setInput] = useState("");


    const handleSend = () => {
        if (!input.trim()) return;
        console.log("Sent:", input);
        setInput("");
    };


    return (
        <div className="p-4 bg-[#f0f2f5] border-t border-gray-300 flex items-center space-x-3">
            <Smile className="w-6 h-6 text-gray-600 cursor-pointer" />
            <Paperclip className="w-6 h-6 text-gray-600 cursor-pointer" />
            <input
                type="text"
                placeholder="Type a message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2 border rounded-full focus:outline-none focus:ring focus:ring-green-200"
            />
            <button onClick={handleSend}>
                <Mic className="w-6 h-6 text-gray-600 cursor-pointer" />
            </button>
        </div>
    );
}