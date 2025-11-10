import React, { useEffect } from "react";
import { useChat } from "../context/ChatContext";

export default function ChatListItem() {
    const {
        chatList,
        currentChat,
        activeFilter,
        loadChatList,
        selectChat,
        getFilteredChats,
    } = useChat();

    // Load chat list on mount
    useEffect(() => {
        loadChatList();
    }, []);

    // Get filtered chats
    const filteredChats = getFilteredChats();

    if (!filteredChats.length)
        return <p className="p-4 text-gray-500 text-center">No chats available.</p>;

    return (
        <div className="overflow-y-auto">
            {filteredChats.map((chat) => (
                <div
                    key={chat.id}
                    onClick={() => selectChat(chat)}
                    className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition ${
                        currentChat?.id === chat.id ? "bg-green-50" : ""
                    }`}
                >
                    {/* Chat avatar */}
                    <img
                        src={`https://i.pravatar.cc/50?u=${chat.title}`}
                        alt={chat.title}
                        className="w-10 h-10 rounded-full mr-3"
                    />

                    {/* Chat info */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
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
