// src/components/chat/ChatHeader.jsx
import React from "react";
import { MoreVertical } from "lucide-react";
import { useChat } from "../context/ChatContext";

export default function ChatHeader() {
    const { currentChat } = useChat();

    if (!currentChat) return null;

    // You can later replace with chat.avatarUrl if stored in DB
    const avatarUrl = currentChat.avatarUrl
        ? currentChat.avatarUrl
        : `https://i.pravatar.cc/50?u=${currentChat.title}`;

    return (
        <div className="flex items-center justify-between p-4 bg-[#f0f2f5] border-b border-gray-300">
            <div className="flex items-center space-x-3">
                <img
                    src={avatarUrl}
                    alt={currentChat.title}
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <h2 className="font-semibold text-gray-800">{currentChat.title}</h2>
                    <p className="text-xs text-gray-500">
                        {currentChat.isOnline ? "Online" : "Last seen recently"}
                    </p>
                </div>
            </div>
            <MoreVertical className="w-5 h-5 text-gray-600 cursor-pointer" />
        </div>
    );
}
