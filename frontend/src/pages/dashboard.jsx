import React from "react";


import Sidebar from "../components/sidebar/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";

export default function Dashboard() {



// Temporary demo data for each tab

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Active Window */}
            <div className="flex-1">
                <ChatWindow />
            </div>
        </div>
    );
}
