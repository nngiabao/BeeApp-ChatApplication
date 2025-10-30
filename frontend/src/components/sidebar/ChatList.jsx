// src/components/sidebar/ChatList.jsx
import React from "react";
import ChatListItem from "./ChatListItem";


export default function ChatList() {
    const chats = [
        { id: 1, name: "Anna", message: "heheheh", time: "12:03" }
    ];


    return (
        <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
                <ChatListItem key={chat.id} chat={chat} />
            ))}
        </div>
    );
}