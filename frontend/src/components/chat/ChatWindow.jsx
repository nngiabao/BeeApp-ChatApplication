import React, { useState, useEffect } from "react";
import { connectWebSocket, sendMessage } from "../../utils/socket";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import MessageInput from "./MessageInput";
import { useLocation } from "react-router-dom";
import { useChat } from "../context/ChatContext";
import mainImage from "../../assets/mainpage.png";

export default function ChatWindow() {
    const [messages, setMessages] = useState([]);
    const location = useLocation();
    const username = location.state?.username || "Guest";
    const { currentChat } = useChat(); // ✅ current selected chat

    useEffect(() => {
        connectWebSocket((msg) => setMessages((prev) => [...prev, msg]));
    }, []);

    const handleSend = (text) => {
        sendMessage(username, text);
    };

    // ✅ if no chat selected → show default image
    if (!currentChat) {
        return (
            <div
                className="flex items-center justify-center h-full w-full bg-cover bg-center"
                style={{
                    backgroundImage: `url(${mainImage})`, // ✅ dynamically apply imported image
                }}
            >
            </div>
        );
    }

    // ✅ normal chat view when a chat is selected
    return (
        <div className="flex flex-col h-full w-full bg-[url('/chat-bg.png')] bg-cover bg-center">
            <ChatHeader chat={currentChat}/>
            <ChatMessages messages={messages} currentUser={username} />
            <MessageInput onSend={handleSend} />
        </div>
    );
}
