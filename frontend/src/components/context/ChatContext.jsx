// src/context/ChatContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
    connectWebSocket,
    subscribeToChat,
    unsubscribeFromChat,
    sendMessage as socketSendMessage,
    isConnected,
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

    // 🔌 Connect WebSocket once
    useEffect(() => {
        if (!user?.id) return;
        connectWebSocket();
    }, [user?.id]);

    // 📥 Load chats + subscribe AFTER WebSocket is ready
    const initializeChats = async () => {
        if (!user?.id) return;

        const res = await fetch(`http://localhost:8080/chats/${user.id}`);
        const data = await res.json();

        if (!Array.isArray(data)) return;

        setChatList(data);

        data.forEach((chat) => {
            subscribeToChat(chat.id, (savedMsg) => {
                const chatId = savedMsg.chatId;

                setMessagesByChat((prev) => ({
                    ...prev,
                    [chatId]: [...(prev[chatId] || []), savedMsg],
                }));

                setChatList((prev) => {
                    const updated = prev.map((c) =>
                        c.id === chatId
                            ? {
                                ...c,
                                lastMessage: savedMsg.content,
                                lastMessageTime: savedMsg.sentAt,
                            }
                            : c
                    );
                    return updated.sort(
                        (a, b) =>
                            new Date(b.lastMessageTime || 0) -
                            new Date(a.lastMessageTime || 0)
                    );
                });
            });
        });
    };

    // 🔥 Wait until WebSocket connected
    useEffect(() => {
        if (!user?.id) return;

        const check = setInterval(() => {
            if (isConnected()) {
                initializeChats();
                clearInterval(check);
            }
        }, 200);

        return () => clearInterval(check);
    }, [user?.id]);

    // 📌 Selecting a chat
    const selectChat = async (chat) => {
        if (!chat) return;

        // 🧹 UNSUBSCRIBE OLD CHAT
        if (currentChat) {
            unsubscribeFromChat(currentChat.id);
        }

        setCurrentChat(chat);

        const chatId = chat.id;

        // Load messages if needed
        if (!messagesByChat[chatId]) {
            const res = await fetch(
                `http://localhost:8080/messages/chat/${chatId}`
            );
            const data = await res.json();
            if (Array.isArray(data.data)) {
                setMessagesByChat((prev) => ({
                    ...prev,
                    [chatId]: data.data,
                }));
            }
        }

        // Load group members if needed
        if (chat.type === "GROUP" && !membersByChat[chatId]) {
            const res = await fetch(
                `http://localhost:8080/groups/chat/${chatId}`
            );
            const data = await res.json();
            if (Array.isArray(data)) {
                setMembersByChat((prev) => ({
                    ...prev,
                    [chatId]: data,
                }));
            }
        }

        // Subscribe safely
        subscribeToChat(chatId, (savedMsg) => {
            setMessagesByChat((prev) => ({
                ...prev,
                [chatId]: [...(prev[chatId] || []), savedMsg],
            }));

            setChatList((prev) => {
                const updated = prev.map((c) =>
                    c.id === chatId
                        ? {
                            ...c,
                            lastMessage: savedMsg.content,
                            lastMessageTime: savedMsg.sentAt,
                        }
                        : c
                );

                return updated.sort(
                    (a, b) =>
                        new Date(b.lastMessageTime || 0) -
                        new Date(a.lastMessageTime || 0)
                );
            });
        });
    };

    // 📨 Send message
    const sendMessage = (msg) => {
        if (!currentChat || !user?.id) return;

        const chatId = currentChat.id;

        const localMsg = {
            chatId,
            senderId: user.id,
            content: msg.content,
            messageType: msg.messageType || "text",
            mediaUrl: msg.mediaUrl || null,
            sentAt: new Date().toISOString(),
        };

        setMessagesByChat((prev) => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), localMsg],
        }));

        socketSendMessage(chatId, user.id, msg.content, msg.messageType, msg.mediaUrl);
    };

    // Filtering
    const getFilteredChats = () => {
        if (!Array.isArray(chatList)) return [];
        return chatList.filter((chat) => {
            if (activeFilter === "Groups") return chat.type === "GROUP";
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
        getFilteredChats,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => useContext(ChatContext);
