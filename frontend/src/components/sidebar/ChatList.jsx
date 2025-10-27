// src/components/sidebar/ChatList.jsx
import React from "react";
import ChatListItem from "./ChatListItem";


export default function ChatList() {
    const chats = [
        { id: 1, name: "Karin Cis600", message: "what happened bro", time: "12:03" },
        { id: 2, name: "Sai CIS600", message: "Got it bro", time: "Yesterday" },
        { id: 3, name: "Saurabh csu india", message: "Wassup bro", time: "Saturday" },
    ];


    return (
        <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
                <ChatListItem key={chat.id} chat={chat} />
            ))}
        </div>
    );
}