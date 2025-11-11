import React, { useEffect, useMemo } from "react";
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

    // ✅ Auto-sort chats by latest message
    const sortedChats = useMemo(() => {
        const filtered = getFilteredChats();
        return filtered.sort(
            (a, b) =>
                new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
        );
    }, [chatList, activeFilter]); // rerun whenever new chat data arrives

    if (!sortedChats.length)
        return <p className="p-4 text-gray-500 text-center">No chats available.</p>;

    return (
        <div className="overflow-y-auto">
            {sortedChats.map((chat) => {
                const isActive = currentChat?.id === chat.id;
                const lastMessageTime = chat.lastMessageTime
                    ? new Date(chat.lastMessageTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                    : "";

                return (
                    <div
                        key={chat.id}
                        onClick={() => selectChat(chat)}
                        className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition ${
                            isActive ? "bg-green-50" : ""
                        }`}
                    >
                        {/* Avatar */}
                        <img
                            src={`https://i.pravatar.cc/50?u=${chat.title}`}
                            alt={chat.title}
                            className="w-10 h-10 rounded-full mr-3"
                        />

                        {/* Chat Info */}
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <h2 className="font-medium text-gray-800 truncate">
                                    {chat.title}
                                </h2>
                                <span className="text-xs text-gray-500">
                                    {lastMessageTime}
                                </span>
                            </div>

                            {/* Last message preview */}
                            <p
                                className={`text-sm truncate ${
                                    chat.unread ? "font-semibold text-green-700" : "text-gray-500"
                                }`}
                            >
                                {chat.lastMessage || "Start a chat"}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
