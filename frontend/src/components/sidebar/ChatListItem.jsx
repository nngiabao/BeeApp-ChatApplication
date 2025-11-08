import React, { useEffect } from "react";
import { useChat } from "../context/ChatContext";

export default function ChatListItem() {
    const { chatList, loadChatList, loadChatDetails, currentChat, activeFilter } = useChat();

    useEffect(() => {
        loadChatList();
    }, []);

    if (!chatList.length)
        return <p className="p-4 text-gray-500 text-center">No chats available.</p>;

    // ✅ Apply filters
    const filteredChats = chatList.filter((chat) => {
        if (activeFilter === "Groups") return chat.type === "GROUP";
        if (activeFilter === "Unread") return chat.type === "SENT"; // adjust to your backend property
        return true; // "All" → show everything
    });

    return (
        <div className="overflow-y-auto">
            {filteredChats.map((chat) => (
                <div
                    key={chat.id}
                    onClick={() => loadChatDetails(chat.id)}
                    className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition ${
                        currentChat?.id === chat.id ? "bg-green-50" : ""
                    }`}
                >
                    <img
                        src={`https://i.pravatar.cc/50?u=${chat.title}`}
                        alt={chat.title}
                        className="w-10 h-10 rounded-full mr-3"
                    />
                    <div className="flex-1">
                        <div className="flex justify-between">
                            <h2 className="font-medium text-gray-800">{chat.title}</h2>
                            <span className="text-xs text-gray-500">
                                {chat.lastMessageTime
                                    ? new Date(chat.lastMessageTime).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : ""}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                            {chat.lastMessage || "Start a chat"}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
