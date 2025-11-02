import React from "react";
import {MessageSquare, Users, Settings} from "lucide-react";

export default function SidebarNav({activeTab, setActiveTab}) {
    const iconClass = (tab) =>
        `w-6 h-6 cursor-pointer transition-colors ${
            activeTab === tab ? "text-green-700" : "text-gray-500 hover:text-green-600"
        }`;

    return (
        <div className="w-14 bg-[#f0f2f5] flex flex-col items-center justify-between py-4 border-r border-gray-300">
            <div className="flex flex-col items-center space-y-6">
                <MessageSquare
                    className={iconClass("chats")}
                    onClick={() => setActiveTab("chats")}
                    title="Chats"
                />
                <Users
                    className={iconClass("contacts")}
                    onClick={() => setActiveTab("contacts")}
                    title="Contacts"
                />

                {/* Bottom Section */}
                <div>
                    <Settings
                        className="w-6 h-6 text-gray-500 cursor-pointer hover:text-green-600"
                        onClick={() => setActiveTab("settings")}
                        title="Settings"
                    />
                </div>
            </div>
        </div>
    );
}
