// src/components/sidebar/ChatListItem.jsx
import React from "react";


export default function ChatListItem({ chat }) {
    return (
        <div className="flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100">
            <img
                src={`https://i.pravatar.cc/50?u=${chat.name}`}
                alt={chat.name}
                className="w-10 h-10 rounded-full mr-3"
            />
            <div className="flex-1">
                <div className="flex justify-between">
                    <h2 className="font-medium text-gray-800">{chat.name}</h2>
                    <span className="text-xs text-gray-500">{chat.title}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{chat.data}</p>
            </div>
        </div>
    );
}
