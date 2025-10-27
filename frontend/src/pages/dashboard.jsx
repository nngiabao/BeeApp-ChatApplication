import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";

export default function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar (nav + chat list) */}
            <Sidebar />

            {/* Chat Window */}
            <div className="flex-1">
                <ChatWindow />
            </div>
        </div>
    );
}
