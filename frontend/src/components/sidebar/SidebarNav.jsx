import React from "react";
import { MessageSquare, Users, Layers, Settings, CircleDashed } from "lucide-react";

export default function SidebarNav() {
    return (
        <div className="w-14 bg-[#f0f2f5] flex flex-col items-center justify-between py-4 border-r border-gray-300">
            {/* Top Section */}
            <div className="flex flex-col items-center space-y-6">
                <MessageSquare
                    className="w-6 h-6 text-green-600 cursor-pointer hover:text-green-700"
                    title="Chats"
                />
                <CircleDashed
                    className="w-6 h-6 text-gray-500 cursor-pointer hover:text-green-600"
                    title="Status"
                />
                <Users
                    className="w-6 h-6 text-gray-500 cursor-pointer hover:text-green-600"
                    title="Communities"
                />
                <Layers
                    className="w-6 h-6 text-gray-500 cursor-pointer hover:text-green-600"
                    title="Channels"
                />
            </div>

            {/* Bottom Section */}
            <div>
                <Settings
                    className="w-6 h-6 text-gray-500 cursor-pointer hover:text-green-600"
                    title="Settings"
                />
            </div>
        </div>
    );
}
