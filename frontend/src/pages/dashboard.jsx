import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";

export default function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <Sidebar/>

            {/* Active Chat Window */}
            <div className="flex-1 bg-white">
                <ChatWindow/>
            </div>
        </div>
    );
}
