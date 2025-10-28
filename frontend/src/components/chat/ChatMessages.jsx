import React from "react";

export default function ChatMessages({ messages, currentUser }) {
    return (
        <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => {
                const isMine = msg.sender === currentUser || msg.from === "me";

                return (
                    <div
                        key={index}
                        className={`mb-2 p-2 rounded-lg max-w-xs ${
                            isMine
                                ? "bg-green-200 ml-auto text-right"
                                : "bg-white text-left"
                        }`}
                    >
                        <p className="text-sm font-medium break-words">{msg.title || msg.text}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {msg.sender || msg.from}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
