import React from "react";
import { useChat } from "../context/ChatContext";
import { useUser } from "../context/UserContext";
import MessageBubble from "./MessageBubble"; // ✅ Add this

export default function ChatMessages() {
    const { currentChat, messagesByChat, membersByChat } = useChat();
    const { user } = useUser();

    if (!currentChat) return null;

    const chatId = currentChat.id;
    const messages = messagesByChat[chatId] || [];
    const members = membersByChat[chatId] || [];

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
                        {shouldShowName && (
                            <p className="text-green-600 font-bold text-xs mb-1 ml-1">
                                {senderName}
                            </p>
                        )}

                        {/* ✅ REPLACE INLINE BUBBLE WITH COMPONENT */}
                        <MessageBubble message={{ ...msg, self: isMine }} />
                    </div>
                );
            })}
        </div>
    );
}
