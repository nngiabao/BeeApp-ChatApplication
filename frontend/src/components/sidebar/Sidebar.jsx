import React, { useState } from "react";
import SidebarNav from "./SidebarNav";
import ChatList from "./ChatList";
import ContactList from "../contact/ContactList";
import Settings from "../Setting/SettingPanel"; // optional

export default function Sidebar() {
    const [activeTab, setActiveTab] = useState("chats");

    const renderContent = () => {
        switch (activeTab) {
            case "chats":
                return <ChatList />;
            case "contacts":
                return <ContactList />;
            case "settings":
                return <Settings />;
            default:
                return <ChatList />;
        }
    };

    return (
        <div className="flex h-screen bg-white">
            {/* Navigation Bar (icons) */}
            <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab}/>

            {/* Content Panel */}
            <div className="flex flex-col w-[460px] border-r border-gray-300">
                {renderContent()}
            </div>
        </div>
    );
}
