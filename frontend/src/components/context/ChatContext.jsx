// src/context/ChatContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
    connectWebSocket,
    subscribeToChat,
    unsubscribeFromChat,
    sendMessage as socketSendMessage,
} from "../../utils/socket";
import {useUser} from "./UserContext";

const ChatContext = createContext();

export function ChatProvider({ children }) {
    const [chatList, setChatList] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]);
    const { user } = useUser();
    // 🧩 Load all chats (sidebar)
    const loadChatList = async () => {
        try {
            const res = await fetch(`http://localhost:8080/chats/${user.id}`);
            const data = await res.json();
            setChatList(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("❌ Failed to load chat list:", err);
        }
    };

    // 🧩 Load selected chat details (header + messages)
    const loadChatDetails = async (chatId) => {
        clearChat();
        try {
            const [chatRes, memberRes, msgRes] = await Promise.all([
                fetch(`http://localhost:8080/chats/${chatId}`),
                fetch(`http://localhost:8080/groups/${chatId}`),
                fetch(`http://localhost:8080/messages/chat/${chatId}`),
            ]);

            const [chatData, memberData, msgData] = await Promise.all([
                chatRes.json(),
                memberRes.json(),
                msgRes.json(),
            ]);

            setCurrentChat(chatData);
            setMembers(Array.isArray(memberData) ? memberData : []);
            setMessages(Array.isArray(msgData) ? msgData : []);
        } catch (err) {
            console.error("❌ Failed to load chat details:", err);
        }
    };

    // ✅ Connect WebSocket once
    useEffect(() => {
        connectWebSocket(() => {
            console.log("🟢 WebSocket connected in ChatContext");
        });
        loadChatList();
    }, []);

    // ✅ Subscribe when a chat is opened
    useEffect(() => {
        if (currentChat?.id) {
            console.log(`📡 Subscribing to chat ${currentChat.id}`);
            subscribeToChat(currentChat.id, (msg) => {
                console.log("📩 Message received:", msg);
                setMessages((prev) => [...prev, msg]);
            });

            // cleanup when switching or leaving chat
            return () => unsubscribeFromChat(currentChat.id);
        }
    }, [currentChat]);

    // 🧩 Send message (via socket.js)
    const sendMessage = (msg) => {
        if (!currentChat) {
            console.warn("⚠️ No active chat selected.");
            return;
        }

        const messagePayload = {
            chatId: currentChat.id,
            senderId: msg.senderId,
            content: msg.content,
            messageType: msg.messageType || "text",
            mediaUrl: msg.mediaUrl || null,
            createdAt: new Date().toISOString(),
        };

        // Optimistic UI update
        setMessages((prev) => [...prev, { ...messagePayload, status: "sending" }]);
        socketSendMessage(
            currentChat.id,
            msg.senderId,
            msg.content,
            msg.messageType,
            msg.mediaUrl
        );
    };

    // 🧹 Clear current chat
    const clearChat = () => {
        setMembers([]);
        setMessages([]);
        setCurrentChat(null);
    };

    const value = {
        chatList,
        currentChat,
        members,
        messages,
        loadChatList,
        loadChatDetails,
        clearChat,
        sendMessage,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) throw new Error("useChat must be used within a ChatProvider");
    return context;
}
