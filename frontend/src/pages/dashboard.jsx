import React from "react";
import { useState } from 'react';

import Sidebar from "../components/sidebar/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('chats');


// Temporary demo data for each tab
    const renderContent = () => {
        switch (activeTab) {
            case 'chats':
                return <ChatWindow />
            case 'status':
                return <div className='p-6 text-gray-700'>🟢 View your Status updates here</div>;
            case 'communities':
                return <div className='p-6 text-gray-700'>👥 Communities you’ve joined</div>;
            case 'channels':
                return <div className='p-6 text-gray-700'>📢 Your Channels feed</div>;
            case 'settings':
                return <div className='p-6 text-gray-700'>⚙️ Settings & Preferences</div>;
            default:
                return <div className='p-6 text-gray-700'>Select a section</div>;
        }
    };
    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Active Window */}
            <div className="flex-1">
                {renderContent()}
            </div>
        </div>
    );
}
