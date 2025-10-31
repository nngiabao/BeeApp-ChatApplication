import React, { useState } from "react";
import SidebarNav from "./SidebarNav";
import ChatList from "./ChatList";
import ContactList from "../contact/ContactList";
//import SettingsPanel from "../admin/SettingsPanel"; // optional

export default function Sidebar() {
    const [activeTab, setActiveTab] = useState("chats");

    const renderContent = () => {
        switch (activeTab) {
            case "chats":
                return <ChatList />;
            case "contacts":
                return <ContactList />;
            default:
                return <ChatList />;
        }
    };

    return (
        <div className="flex h-screen">
            <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex flex-col w-80 bg-white border-r border-gray-300">
                {renderContent()}
            </div>
        </div>
    );
}
