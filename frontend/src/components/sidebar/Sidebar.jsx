import React, { useState } from "react";
import SidebarNav from "./SidebarNav";
import ChatList from "./Chatlist";
import ContactList from "../contact/ContactList";
import SettingsPanel from "../Setting/SettingPanel";

export default function Sidebar({ setActiveTicket }) {
    const [activeTab, setActiveTab] = useState("chats");

    const renderContent = () => {
        switch (activeTab) {
            case "chats":
                return <ChatList />;
            case "contacts":
                return <ContactList />;
            case "settings":
                return <SettingsPanel setActiveTicket={setActiveTicket} />;
            default:
                return <ChatList />;
        }
    };

    return (
        <div className="flex h-screen bg-white">
            <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex flex-col w-[350px] border-r border-gray-300">
                {renderContent()}
            </div>
        </div>
    );
}
