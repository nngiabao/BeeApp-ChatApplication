import React, { useEffect, useMemo } from "react";
import { useChat } from "../context/ChatContext";
import { useContactList } from "../context/ContactContext";

export default function ChatListItem() {
    const {
        chatList,
        currentChat,
        activeFilter,
        selectChat,
        getFilteredChats,
    } = useChat();

    const { contacts } = useContactList();

    //Filter + Sort chats (same as before)
    const sortedChats = useMemo(() => {
        const filtered = getFilteredChats().filter((chat) => {
            if (chat.type === "GROUP") return true; // always show group chats
            if (chat.type === "PRIVATE") {
                return chat.lastMessage && chat.lastMessage.trim() !== "";
            }
            return false;
        });

        return filtered.sort(
            (a, b) =>
                new Date(b.lastMessageTime || 0) -
                new Date(a.lastMessageTime || 0)
        );
    }, [chatList, activeFilter]);

    if (!sortedChats.length)
        return <p className="p-4 text-gray-500 text-center">No active chats yet.</p>;

    const getPrivateChatInfo = (chat) => {
        if (chat.type !== "PRIVATE") return {};

        const match = contacts.find(
            (c) =>
                c.contactId === chat.otherUserId ||
                c.contactId === chat.contactId ||
                chat.title === c.alias ||
                chat.title === c.contactName
        );

        return {
            name: match?.alias || match?.contactName || chat.title || "Unknown User",
            imgUrl:
                match?.profilePicture ||
                chat.imgUrl ||
                "https://chatapp-beeapp.s3.us-east-2.amazonaws.com/invidual/default-profile.png",
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

                const privateInfo = getPrivateChatInfo(chat);

                const name =
                    chat.type === "PRIVATE" ? privateInfo.name : chat.title;

                const imgUrl =
                    chat.type === "PRIVATE"
                        ? privateInfo.imgUrl
                        : chat.imgUrl ||
                        "https://chatapp-beeapp.s3.us-east-2.amazonaws.com/invidual/default-profile.png";

                return (
                    <div
                        key={chat.id}
                        onClick={() =>
                            selectChat({
                                ...chat,
                                imgUrl,
                                title: name,
                            })
                        }
                        className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition ${
                            isActive ? "bg-green-50" : ""
                        }`}
                    >
                        <img
                            src={imgUrl}
                            alt={name}
                            className="w-10 h-10 rounded-full mr-3 object-cover"
                        />

                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <h2 className="font-medium text-gray-800 truncate">
                                    {name}
                                </h2>
                                <span className="text-xs text-gray-500">
                                    {lastMessageTime}
                                </span>
                            </div>

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
