// src/utils/socket.js
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;
let connected = false;
let activeSubscriptions = {};
let connectCallbackQueue = [];

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const isConnected = () => connected;

// 🔌 Connect WebSocket (connect only once)
export const connectWebSocket = () => {
    if (stompClient && connected) {
        return;
    }

    const socket = new SockJS(SOCKET_URL);
    stompClient = Stomp.over(socket);

    stompClient.debug = () => {};

    stompClient.connect(
        {},
        () => {
            connected = true;

            connectCallbackQueue.forEach((cb) => cb());
            connectCallbackQueue = [];
        },
        (error) => {
            connected = false;
            console.error(" WebSocket connection failed:", error);

            setTimeout(() => {
                connectWebSocket();
            }, 3000);
        }
    );
};

// 🚀 Subscribe AFTER connected
export const subscribeToChat = (chatId, onMessageReceived) => {
    const subscribeFn = () => {
        if (activeSubscriptions[chatId]) return;

        const topic = `/topic/chat/${chatId}`;

        activeSubscriptions[chatId] = stompClient.subscribe(topic, (msg) => {
            try {
                const payload = JSON.parse(msg.body);
                onMessageReceived(payload);
            } catch (err) {
                console.error(" Failed to parse WS message:", err);
            }
        });
    };

    if (connected) subscribeFn();
    else connectCallbackQueue.push(subscribeFn);
};

// OPTIONAL
export const unsubscribeFromChat = (chatId) => {
    const sub = activeSubscriptions[chatId];
    if (sub) {
        sub.unsubscribe();
        delete activeSubscriptions[chatId];
    }
};

export const sendMessage = (chatId, senderId, messageContent, messageType = "TEXT", mediaUrl = null) => {
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
};

export const disconnectWebSocket = () => {
    if (stompClient) {
        stompClient.disconnect(() => console.log("WebSocket disconnected"));
    }
    stompClient = null;
    connected = false;
    activeSubscriptions = {};
};
