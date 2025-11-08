import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;
let connected = false;
let activeSubscriptions = {}; // track chat subscriptions

// 🧩 Connect WebSocket (only once)
export const connectWebSocket = (onConnected) => {
    if (stompClient && connected) {
        console.log("⚡ WebSocket already connected");
        return;
    }

    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = Stomp.over(socket);

    // Optional: silence debug logs
    stompClient.debug = () => {};

    stompClient.connect(
        {},
        () => {
            connected = true;
            console.log("✅ Connected to WebSocket server");
            if (onConnected) onConnected();
        },
        (error) => {
            connected = false;
            console.error("❌ WebSocket connection failed:", error);
            setTimeout(() => {
                console.log("🔄 Reconnecting WebSocket...");
                connectWebSocket(onConnected);
            }, 3000);
        }
    );
};

// 🧩 Subscribe to a specific chat topic
export const subscribeToChat = (chatId, onMessageReceived) => {
    if (!stompClient || !connected) {
        console.warn("⚠️ WebSocket not connected yet. Cannot subscribe.");
        return;
    }

    const topic = `/topic/chat/${chatId}`;

    // Avoid duplicate subscriptions
    if (activeSubscriptions[chatId]) {
        console.log(`⚠️ Already subscribed to ${topic}`);
        return;
    }

    console.log(`📡 Subscribing to ${topic}`);
    const subscription = stompClient.subscribe(topic, (message) => {
        try {
            const payload = JSON.parse(message.body);
            onMessageReceived(payload);
        } catch (error) {
            console.error("❌ Error parsing message:", error);
        }
    });

    activeSubscriptions[chatId] = subscription;
};

// 🧩 Unsubscribe when leaving a chat
export const unsubscribeFromChat = (chatId) => {
    const subscription = activeSubscriptions[chatId];
    if (subscription) {
        subscription.unsubscribe();
        delete activeSubscriptions[chatId];
        console.log(`🚫 Unsubscribed from /topic/chat/${chatId}`);
    }
};

// 🧩 Send message to the current chat
export const sendMessage = (chatId, senderId, content, messageType = "text", mediaUrl = null) => {
    if (!stompClient || !connected) {
        console.warn("⚠️ Cannot send message — WebSocket not connected.");
        return;
    }

    const msg = {
        chatId,
        senderId,
        content,
        messageType,
        mediaUrl,
        createdAt: new Date().toISOString(),
    };

    console.log("📤 Sending message:", msg);
    stompClient.send("/app/sendMessage", {}, JSON.stringify(msg));
};

// 🧹 Disconnect WebSocket (optional)
export const disconnectWebSocket = () => {
    if (stompClient && connected) {
        stompClient.disconnect(() => console.log("🛑 Disconnected from WebSocket"));
        stompClient = null;
        connected = false;
        activeSubscriptions = {};
    }
};
