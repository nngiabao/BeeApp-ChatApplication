import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;
let connected = false;

// Connect WebSocket
export const connectWebSocket = (onMessageReceived) => {
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = Stomp.over(socket);

    // Optional: remove debug logs for cleaner console
    stompClient.debug = () => {};

    stompClient.connect(
        {},
        () => {
            connected = true;
            console.log("✅ Connected to WebSocket");

            // Subscribe to global topic for all users
            stompClient.subscribe("/topic/public", (message) => {
                try {
                    const payload = JSON.parse(message.body);
                    onMessageReceived(payload);
                } catch (error) {
                    console.error("❌ Error parsing WebSocket message:", error);
                }
            });
        },
        (error) => {
            connected = false;
            console.error("❌ WebSocket connection failed:", error);
            // Optional auto-reconnect
            setTimeout(() => {
                console.log("🔄 Attempting to reconnect...");
                connectWebSocket(onMessageReceived);
            }, 3000);
        }
    );
};

// Send message to all connected users
export const sendMessage = (sender, text) => {
    if (stompClient && connected) {
        const msg = {
            sender,
            title: text,
            type: "text",
            createdAt: new Date().toISOString(),
        };

        stompClient.send("/app/sendMessage", {}, JSON.stringify(msg));
    } else {
        console.warn("⚠️ Cannot send — WebSocket not connected yet.");
    }
};
