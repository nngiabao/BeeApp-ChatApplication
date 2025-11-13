// src/components/chat/ChatMessages.jsx
import React from "react";
import { useChat } from "../context/ChatContext";
import { useUser } from "../context/UserContext";

export default function ChatMessages() {
    const { currentChat, messagesByChat, membersByChat } = useChat();
    const { user } = useUser();

    if (!currentChat) return null;

    const chatId = currentChat.id;

    const messages = messagesByChat[chatId] || [];
    const members = membersByChat[chatId] || [];

    // Normalize group type
    const isGroupChat = (currentChat.type || "").toUpperCase() === "GROUP";

    const getSenderName = (senderId) => {
        if (senderId === user.id) return "You";

        const member =
            members.find(
                (m) =>
                    m.userId === senderId ||
                    m.id === senderId ||
                    m.user?.id === senderId
            ) || null;

        return (
            member?.alias ||
            member?.name ||
            member?.fullName ||
            `User ${senderId}`
        );
    };

    return (
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, index) => {
                const isMine = msg.senderId === user.id;
                const senderName = getSenderName(msg.senderId);

                // Check the previous message to decide if we show the sender name
                const prevMsg = messages[index - 1];
                const isSameSenderAsPrevious =
                    prevMsg && prevMsg.senderId === msg.senderId;

                const shouldShowName =
                    isGroupChat && !isMine && !isSameSenderAsPrevious;

                return (
                    <div
                        key={msg.id}
                        className={`flex flex-col ${
                            isMine ? "items-end" : "items-start"
                        }`}
                    >
                        {/* Show Name only when needed */}
                        {shouldShowName && (
                            <p className="text-green-600 font-bold text-xs mb-1 ml-1">
                                {senderName}
                            </p>
                        )}

                        {/* Message bubble */}
                        <div
                            className={`p-3 rounded-2xl shadow-sm max-w-xs break-words ${
                                isMine
                                    ? "bg-green-200 text-gray-900 rounded-br-none"
                                    : "bg-white border border-gray-200 text-gray-900 rounded-bl-none"
                            }`}
                        >
                            <p className="text-sm">{msg.content}</p>

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
