// src/components/chat/ChatWindow.jsx
import React from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import MessageInput from "./MessageInput";
import mainImage from "../../assets/mainpage.png";
import { useChat } from "../context/ChatContext";
import { useUser } from "../context/UserContext";

export default function ChatWindow() {
    const { currentChat, messagesByChat, sendMessage } = useChat();
    const { user } = useUser();

    // ✅ Get messages from context cache
    const messages = currentChat ? messagesByChat[currentChat.id] || [] : [];

    // ✅ Handler for sending new messages
    const handleSend = (text) => {
        if (!text.trim()) return;
        sendMessage({
            senderId: user.id,
            content: text.trim(),
            messageType: "text",
        });
    };

    // ✅ Default state (no chat selected)
    if (!currentChat) {
        return (
            <div
                className="flex items-center justify-center h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${mainImage})` }}
            />
        );
    }

    // ✅ Active chat view
    return (
        <div className="flex flex-col h-full w-full bg-[url('/chat-bg.png')] bg-cover bg-center">
            <ChatHeader />
            <ChatMessages messages={messages} />
            <MessageInput onSend={handleSend} />
        </div>
    );
}
