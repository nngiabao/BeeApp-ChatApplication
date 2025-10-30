import React, { useState, useEffect } from "react";
import { connectWebSocket, sendMessage } from "../../utils/socket";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import MessageInput from "./MessageInput";
import { useLocation } from "react-router-dom";

export default function ChatWindow() {
    const [messages, setMessages] = useState([]);
    const location = useLocation();
    const username = location.state?.username || "Guest";

    useEffect(() => {
        connectWebSocket((msg) => setMessages((prev) => [...prev, msg]));
    }, []);

    const handleSend = (text) => {
        sendMessage(username, text);
    };

    return (
        <div className="flex flex-col h-full w-full bg-[url('/chat-bg.png')] bg-cover bg-center">
            <ChatHeader />
            <ChatMessages messages={messages} currentUser={username} />
            <MessageInput onSend={handleSend} />
        </div>
    );
}
