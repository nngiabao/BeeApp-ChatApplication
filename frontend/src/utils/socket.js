// src/utils/socket.js
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;
let connected = false;
let activeSubscriptions = {};
let connectCallbackQueue = [];   // <-- Callbacks waiting for connection

export const isConnected = () => connected;

// 🔌 Connect WebSocket (connect only once)
export const connectWebSocket = () => {
    if (stompClient && connected) {
        console.log("⚡ WebSocket already connected");
        return;
    }

    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = Stomp.over(socket);

    // Remove verbose logs
    stompClient.debug = () => {};

    stompClient.connect(
        {},
        () => {
            connected = true;
            console.log("✅ WebSocket connected");

            // Run all callbacks waiting for connection
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
        console.log(`⏳ Waiting for WebSocket before subscribing to chat ${chatId}`);
        connectCallbackQueue.push(subscribeFn);
    }
};

// 🚫 Unsubscribe from chat
export const unsubscribeFromChat = (chatId) => {
    const sub = activeSubscriptions[chatId];
    if (sub) {
        sub.unsubscribe();
        delete activeSubscriptions[chatId];
        console.log(`🚫 Unsubscribed from /topic/chat/${chatId}`);
    }
};

// ✉️ Send message safely
export function sendMessage(chatId, senderId, messageContent, messageType = "TEXT", mediaUrl = null) {
    if (!stompClient || !stompClient.connected) {
        console.error("Cannot send message. STOMP client is not connected.");
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

// 🛑 Optional disconnect
export const disconnectWebSocket = () => {
    if (stompClient) {
        stompClient.disconnect(() => console.log("🛑 WebSocket disconnected"));
    }
    stompClient = null;
    connected = false;
    activeSubscriptions = {};
};
