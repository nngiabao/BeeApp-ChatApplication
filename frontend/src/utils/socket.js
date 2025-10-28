import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";


let stompClient = null;

export const connectWebSocket = (onMessageReceived) => {
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        console.log("✅ Connected to WebSocket");
        stompClient.subscribe("/topic/public", (message) => {
            const payload = JSON.parse(message.body);
            onMessageReceived(payload);
        });
    });
};

export const sendMessage = (sender, text) => {
    if (stompClient && stompClient.connected) {
        const msg = {
            sender,
            title: text,
            type: "text",
            createdAt: new Date().toISOString(),
        };
        stompClient.send("/app/sendMessage", {}, JSON.stringify(msg));
    }
};
