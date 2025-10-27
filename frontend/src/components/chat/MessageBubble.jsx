// src/components/chat/MessageBubble.jsx
import React from "react";


export default function MessageBubble({ message }) {
    return (
        <div className={`flex ${message.self ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-xs p-3 rounded-lg text-sm shadow-sm ${
                    message.self ? "bg-green-100 text-gray-800" : "bg-white text-gray-800"
                }`}
            >
                {message.text}
            </div>
        </div>
    );
}