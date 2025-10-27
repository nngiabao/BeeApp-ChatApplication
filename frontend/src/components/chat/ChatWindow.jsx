// src/components/chat/ChatWindow.jsx
import React from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import MessageInput from "./MessageInput";


export default function ChatWindow() {
    return (
        <div className="flex flex-col h-full w-full bg-[url('/chat-bg.png')] bg-cover">
            <ChatHeader/>
            <ChatMessages/>
            <MessageInput/>
        </div>
    );
}