// src/components/chat/ChatMessages.jsx
import React from "react";
import { useChat } from "../context/ChatContext";
import { useUser } from "../context/UserContext";

export default function ChatMessages() {
    const { currentChat, messagesByChat, membersByChat } = useChat();
    const { user } = useUser();

    if (!currentChat) return null;

    const messages = messagesByChat[currentChat.id] || [];
    const members = membersByChat[currentChat.id] || [];
    const isGroupChat = currentChat.type === "GROUP";

    const getSenderName = (senderId) => {
        if (senderId === user.id) return "You";
        const member = members.find((m) => m.userId === senderId);
        return member ? member.alias || member.name : `User ${senderId}`;
    };

    return (
        <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {messages.map((msg) => {
                const isMine = msg.senderId === user.id;
                const senderName = getSenderName(msg.senderId);

                return (
                    <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                    >
                        {isGroupChat && !isMine && (
                            <p className="text-green-600 font-bold mb-1">
                                {senderName}
                            </p>
                        )}
                        <div
                            className={`p-3 rounded-2xl shadow-sm max-w-xs break-words ${
                                isMine
                                    ? "bg-green-200 text-gray-900 rounded-br-none"
                                    : "bg-white border border-gray-200 text-gray-900 rounded-bl-none"
                            }`}
                        >
                            {/* ✅ Sender name inside bubble, green & bold for group chats */}


                            {/* Message text */}
                            <p className="text-sm">{msg.content}</p>

                            {/* Timestamp */}
                            <p
                                className={`text-[10px] text-gray-500 mt-1 ${
                                    isMine ? "text-left" : "text-right"
                                }`}
                            >
                                {new Date(msg.sentAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}