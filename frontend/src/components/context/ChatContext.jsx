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

    // 🧩 Load group members by chatId
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

    // ✅ Select a chat (and load messages + members if not cached)
    const selectChat = async (chat) => {
        if (!chat) return;
        setCurrentChat(chat);

        const chatId = chat.id;
        const messagesLoaded = messagesByChat[chatId]?.length;
        const membersLoaded = membersByChat[chatId]?.length;

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

        // Load group members (only if group chat)
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

        // 1️⃣ Optimistic UI update
        const optimisticMsg = {
            chatId,
            senderId: user.id,
            content: msg.content,
            messageType: msg.messageType || "text",
            mediaUrl: msg.mediaUrl || null,
            status: "sending",
            sentAt: new Date().toISOString(),
        };

        // Add to messagesByChat
        setMessagesByChat((prev) => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), optimisticMsg],
        }));

        // 2️⃣ Move this chat to top of sidebar (optimistic)
        setChatList((prev) => {
            const updated = prev.map((chat) =>
                chat.id === chatId
                    ? { ...chat, lastMessage: msg.content, lastMessageTime: optimisticMsg.sentAt }
                    : chat
            );
            // Sort newest first
            return updated.sort(
                (a, b) =>
                    new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
            );
        });

        try {
            // 3️⃣ Send via WebSocket → backend saves → broadcasts
            socketSendMessage(
                chatId,
                user.id,
                msg.content,
                msg.messageType,
                msg.mediaUrl
            );
            console.log("📤 Message sent via WebSocket:", msg.content);
        } catch (err) {
            console.error("❌ Failed to send message:", err);
            setMessagesByChat((prev) => ({
                ...prev,
                [chatId]: (prev[chatId] || []).map((m) =>
                    m.sentAt === optimisticMsg.sentAt
                        ? { ...m, status: "failed" }
                        : m
                ),
            }));
        }
    };

    // ✅ Connect WebSocket once when app starts
    useEffect(() => {
        connectWebSocket(() => {
            console.log("✅ WebSocket connected");
        });
        loadChatList();
    }, [user?.id]);
    //when chat update
    // ✅ Subscribe to current chat’s messages
    useEffect(() => {
        if (!currentChat?.id) return;

        subscribeToChat(currentChat.id, (savedMsg) => {
            console.log("📩 Received saved message:", savedMsg);

            setMessagesByChat((prev) => {
                const existingMessages = prev[currentChat.id] || [];

                // 🔍 Avoid duplicates — compare sender + content + sentAt
                const isDuplicate = existingMessages.some(
                    (m) =>
                        m.senderId === savedMsg.senderId &&
                        m.content === savedMsg.content &&
                        Math.abs(new Date(m.sentAt) - new Date(savedMsg.sentAt)) < 1000
                );
                if (isDuplicate) {
                    console.warn("⏩ Skipping duplicate message:", savedMsg.content);
                    return prev;
                }

                return {
                    ...prev,
                    [currentChat.id]: [...existingMessages, savedMsg],
                };
            });

            // 🧠 Update chat preview + sort
            setChatList((prev) => {
                const updated = prev.map((chat) =>
                    chat.id === savedMsg.chatId
                        ? {
                            ...chat,
                            lastMessage: savedMsg.content,
                            lastMessageTime: savedMsg.sentAt,
                        }
                        : chat
                );
                return updated.sort(
                    (a, b) =>
                        new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
                );
            });
        });

        return () => unsubscribeFromChat(currentChat.id);
    }, [currentChat]);

    // ✅ Filter sidebar chats
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
        membersByChat, // ✅ Added
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
