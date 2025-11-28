// src/utils/socket.js
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;
let connected = false;
let activeSubscriptions = {};
let connectCallbackQueue = [];

export const isConnected = () => connected;

// 🔌 WebSocket URL from Vite env variables
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080/ws";

// 🔌 Connect WebSocket (connect only once)
export const connectWebSocket = () => {
    if (stompClient && connected) {
        console.log("⚡ WebSocket already connected");
        return;
    }

    console.log("🔌 Connecting WebSocket to:", SOCKET_URL);

    // Use production URL or local URL
    const socket = new SockJS(SOCKET_URL);
    stompClient = Stomp.over(socket);

    stompClient.debug = () => {};

    stompClient.connect(
        {},
        () => {
            connected = true;
            console.log("✅ WebSocket connected:", SOCKET_URL);

            connectCallbackQueue.forEach((cb) => cb());
            connectCallbackQueue = [];
        },
        (error) => {
            connected = false;
            console.error("❌ WebSocket connection failed:", error);

            setTimeout(() => {
                console.log("🔄 Reconnecting WebSocket...");
                connectWebSocket();
            }, 3000);
        }
    );
};

// 🚀 Subscribe AFTER WebSocket is ready
export const subscribeToChat = (chatId, onMessageReceived) => {
    const subscribeFn = () => {
        if (activeSubscriptions[chatId]) return;

        const topic = `/topic/chat/${chatId}`;
        console.log(`📡 Subscribing to ${topic}`);

        activeSubscriptions[chatId] = stompClient.subscribe(topic, (msg) => {
            try {
                const payload = JSON.parse(msg.body);
                onMessageReceived(payload);
            } catch (err) {
                console.error("❌ Failed to parse WS message:", err);
            }
        });
    };

    if (connected) {
        subscribeFn();
    } else {
        connectCallbackQueue.push(subscribeFn);
    }
};

// Do NOT unsubscribe when switching chats
export const unsubscribeFromChat = () => {
    // Disabled on purpose (WhatsApp style)
    return;
};

// ✉️ Send message
export function sendMessage(chatId, senderId, messageContent, messageType = "TEXT", mediaUrl = null) {
    if (!stompClient || !stompClient.connected) {
        console.error("Cannot send message. STOMP is not connected.");
        return;
    }

    const payload = {
        chatId,
        senderId,
        content: messageContent,
        messageType,
        mediaUrl,
        sentAt: new Date().toISOString(),
    };

    stompClient.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(payload),
    });
}
