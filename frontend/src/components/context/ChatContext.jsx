// src/context/ChatContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
    connectWebSocket,
    subscribeToChat,
    unsubscribeFromChat,
    sendMessage as socketSendMessage,
} from "../../utils/socket";
import { useUser } from "./UserContext";

const ChatContext = createContext();

export function ChatProvider({ children }) {
    const { user } = useUser();

    const [chatList, setChatList] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messagesByChat, setMessagesByChat] = useState({});
    const [membersByChat, setMembersByChat] = useState({}); // ✅ store group members
    const [activeFilter, setActiveFilter] = useState("All");

    // 🧩 Load all chats (sidebar)
    const loadChatList = async () => {
        if (!user?.id) return;
        try {
            const res = await fetch(`http://localhost:8080/chats/${user.id}`);
            const data = await res.json();
            setChatList(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("❌ Failed to load chat list:", err);
        }
    };

    // ✅ Load group members (only for GROUP chats)
    const loadGroupMembers = async (chatId) => {
        try {
            const res = await fetch(`http://localhost:8080/groups/${chatId}`);
            const data = await res.json();

            if (Array.isArray(data)) {
                setMembersByChat((prev) => ({
                    ...prev,
                    [chatId]: data,
                }));
            }
        } catch (err) {
            console.error("❌ Failed to load group members:", err);
        }
    };

    // ✅ Select a chat (cached if already loaded)
    const selectChat = async (chat) => {
        if (!chat) return;
        setCurrentChat(chat);

        // Load messages if not cached
        if (!messagesByChat[chat.id]?.length) {
            try {
                const res = await fetch(`http://localhost:8080/messages/chat/${chat.id}`);
                const data = await res.json();

                if (Array.isArray(data.data)) {
                    setMessagesByChat((prev) => ({
                        ...prev,
                        [chat.id]: data.data,
                    }));
                }
            } catch (err) {
                console.error("❌ Failed to load messages:", err);
            }
        }

        // Load members if group and not cached
        if (chat.type === "GROUP" && !membersByChat[chat.id]) {
            await loadGroupMembers(chat.id);
        }
    };

    // ✅ Send message
    const sendMessage = (msg) => {
        if (!currentChat) return;

        const messagePayload = {
            chatId: currentChat.id,
            senderId: msg.senderId,
            content: msg.content,
            messageType: msg.messageType || "text",
            mediaUrl: msg.mediaUrl || null,
            createdAt: new Date().toISOString(),
        };

        // Optimistic UI update
        setMessagesByChat((prev) => ({
            ...prev,
            [currentChat.id]: [
                ...(prev[currentChat.id] || []),
                { ...messagePayload, status: "sending" },
            ],
        }));

        // WebSocket send
        socketSendMessage(
            currentChat.id,
            msg.senderId,
            msg.content,
            msg.messageType,
            msg.mediaUrl
        );
    };

    // ✅ Connect WebSocket once
    useEffect(() => {
        connectWebSocket(() => {
            console.log("✅ WebSocket connected");
        });
        loadChatList();
    }, [user?.id]);

    // ✅ Subscribe to active chat’s WebSocket
    useEffect(() => {
        if (!currentChat?.id) return;

        subscribeToChat(currentChat.id, (msg) => {
            console.log("📩 New message:", msg);
            setMessagesByChat((prev) => ({
                ...prev,
                [currentChat.id]: [...(prev[currentChat.id] || []), msg],
            }));
        });

        return () => unsubscribeFromChat(currentChat.id);
    }, [currentChat]);

    // ✅ Chat filters
    const getFilteredChats = () => {
        if (!Array.isArray(chatList)) return [];
        return chatList.filter((chat) => {
            if (activeFilter === "Groups") return chat.type === "GROUP";
            if (activeFilter === "Unread") return chat.lastMessageStatus === "SENT";
            return true;
        });
    };

    const value = {
        chatList,
        currentChat,
        messagesByChat,
        membersByChat, // ✅ expose members for group chat
        activeFilter,
        setActiveFilter,
        selectChat,
        sendMessage,
        loadChatList,
        getFilteredChats,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) throw new Error("useChat must be used within a ChatProvider");
    return context;
}
