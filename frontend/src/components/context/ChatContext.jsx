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
    const [membersByChat, setMembersByChat] = useState({});
    const [activeFilter, setActiveFilter] = useState("All");

    // 🧩 Load all chats for sidebar
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

    // 🧩 Load group members
    const loadGroupMembers = async (chatId) => {
        try {
            const res = await fetch(`http://localhost:8080/groups/chat/${chatId}`);
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

    // ✅ Select a chat (and load messages if not cached)
    const selectChat = async (chat) => {
        if (!chat) return;
        setCurrentChat(chat);

        const chatId = chat.id;
        const messagesLoaded = messagesByChat[chatId]?.length;
        const membersLoaded = membersByChat[chatId]?.length;

        // Load messages if not cached
        if (!messagesLoaded) {
            try {
                const res = await fetch(`http://localhost:8080/messages/chat/${chatId}`);
                const data = await res.json();
                if (Array.isArray(data.data)) {
                    setMessagesByChat((prev) => ({
                        ...prev,
                        [chatId]: data.data,
                    }));
                }
            } catch (err) {
                console.error("❌ Failed to load messages:", err);
            }
        }

        // Load members if group chat
        if (chat.type === "GROUP" && !membersLoaded) {
            await loadGroupMembers(chatId);
        }
    };

    // ✅ Send message (via WebSocket → backend → DB)
    const sendMessage = async (msg) => {
        if (!currentChat || !user?.id) {
            console.warn("⚠️ No active chat or user.");
            return;
        }

        const chatId = currentChat.id;
        const optimisticMsg = {
            chatId,
            senderId: user.id,
            content: msg.content,
            messageType: msg.messageType || "text",
            mediaUrl: msg.mediaUrl || null,
            status: "sending",
            sentAt: new Date().toISOString(),
        };

        // Optimistic UI update
        setMessagesByChat((prev) => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), optimisticMsg],
        }));

        // Move chat to top
        setChatList((prev) => {
            const updated = prev.map((chat) =>
                chat.id === chatId
                    ? {
                        ...chat,
                        lastMessage: msg.content,
                        lastMessageTime: optimisticMsg.sentAt,
                    }
                    : chat
            );
            return updated.sort(
                (a, b) =>
                    new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
            );
        });

        try {
            // WebSocket send — backend saves + broadcasts
            socketSendMessage(
                chatId,
                user.id,
                msg.content,
                msg.messageType,
                msg.mediaUrl
            );
            console.log("📤 Sent via WebSocket:", msg.content);
        } catch (err) {
            console.error("❌ Failed to send message:", err);
        }
    };

    // ✅ Connect WebSocket once
    // ✅ Subscribe to WebSocket updates for all chats
    useEffect(() => {
        if (!user?.id) return;

        connectWebSocket(() => {
            console.log("✅ WebSocket connected");
        });

        const initSubscriptions = async () => {
            try {
                const res = await fetch(`http://localhost:8080/chats/${user.id}`);
                const data = await res.json();
                if (!Array.isArray(data)) return;

                setChatList(data);

                // 🧩 Subscribe to each chat for real-time updates
                data.forEach((chat) => {
                    subscribeToChat(chat.id, (savedMsg) => {
                        console.log(`📡 Received message on chat ${chat.id}:`, savedMsg);

                        // ✅ 1️⃣ Update sidebar preview (last message + timestamp)
                        setChatList((prev) => {
                            const updated = prev.map((c) =>
                                c.id === savedMsg.chatId
                                    ? {
                                        ...c,
                                        lastMessage: savedMsg.content,
                                        lastMessageTime: savedMsg.sentAt,
                                    }
                                    : c
                            );

                            // ✅ 2️⃣ Sort newest chats first
                            return updated.sort(
                                (a, b) =>
                                    new Date(b.lastMessageTime || 0) -
                                    new Date(a.lastMessageTime || 0)
                            );
                        });

                        // ✅ 3️⃣ Append message to correct chat (if open)
                        setMessagesByChat((prev) => {
                            const chatMessages = prev[savedMsg.chatId] || [];
                            const alreadyExists = chatMessages.some(
                                (m) =>
                                    m.id === savedMsg.id ||
                                    (m.senderId === savedMsg.senderId &&
                                        m.content === savedMsg.content &&
                                        Math.abs(
                                            new Date(m.sentAt) - new Date(savedMsg.sentAt)
                                        ) < 1000)
                            );
                            if (alreadyExists) return prev;

                            return {
                                ...prev,
                                [savedMsg.chatId]: [...chatMessages, savedMsg],
                            };
                        });
                    });
                });
            } catch (err) {
                console.error("❌ Failed to initialize subscriptions:", err);
            }
        };

        initSubscriptions();

        return () => {
            // 🧹 Unsubscribe all chats on cleanup
            chatList.forEach((chat) => unsubscribeFromChat(chat.id));
        };
    }, [user?.id]);


    //Filter sidebar
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
        membersByChat,
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
