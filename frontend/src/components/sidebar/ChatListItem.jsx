import React, { useEffect, useMemo } from "react";
import { useChat } from "../context/ChatContext";
import { useContactList } from "../context/ContactContext";

export default function ChatListItem() {
    const {
        chatList,
        currentChat,
        activeFilter,
        loadChatList,
        selectChat,
        getFilteredChats,
    } = useChat();

    const { contacts } = useContactList();

    // Load chat list when component mounts
    useEffect(() => {
        loadChatList();
    }, []);

    // ✅ Sort and filter chats — only show those with a last message
    const sortedChats = useMemo(() => {
        const filtered = getFilteredChats()
            .filter((chat) => chat.lastMessage && chat.lastMessage.trim() !== ""); // ⬅️ filter out empty ones
        return filtered.sort(
            (a, b) =>
                new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
        );
    }, [chatList, activeFilter]);

    if (!sortedChats.length)
        return <p className="p-4 text-gray-500 text-center">No active chats yet.</p>;

    // ✅ Helper: get contact info for private chat
    const getPrivateChatInfo = (chat) => {
        if (chat.type !== "PRIVATE") return {};
        const match = contacts.find(
            (c) => c.contactId === chat.otherUserId || c.contactId === chat.createdBy
        );
        return {
            name: match?.alias || match?.contactName || "Unknown User",
            imgUrl: match?.profilePicture || "../../assets/mainpage.png",
        };
    };

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

                // 🧩 Fallback for private chats without title
                const { name, imgUrl } =
                    chat.type === "PRIVATE" && !chat.title
                        ? getPrivateChatInfo(chat)
                        : {
                            name: chat.title || "Unnamed Chat",
                            imgUrl: chat.imgUrl || "https://chatapp-beeapp.s3.us-east-2.amazonaws.com/invidual/default-profile.png",
                        };

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
                            src={imgUrl}
                            alt={name}
                            className="w-10 h-10 rounded-full mr-3 object-cover"
                        />

                        {/* Chat Info */}
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <h2 className="font-medium text-gray-800 truncate">{name}</h2>
                                <span className="text-xs text-gray-500">{lastMessageTime}</span>
                            </div>

                            {/* ✅ Display last message only */}
                            <p
                                className={`text-sm truncate ${
                                    chat.unread
                                        ? "font-semibold text-green-700"
                                        : "text-gray-500"
                                }`}
                            >
                                {chat.lastMessage}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
