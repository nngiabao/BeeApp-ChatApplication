// src/components/chat/ChatHeader.jsx
import React from "react";
import { MoreVertical } from "lucide-react";


export default function ChatHeader() {
    return (
        <div className="flex items-center justify-between p-4 bg-[#f0f2f5] border-b border-gray-300">
            <div className="flex items-center space-x-3">
                <img
                    src="https://i.pravatar.cc/50?img=2"
                    alt="Sai"
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <h2 className="font-semibold text-gray-800">Sai CIS600</h2>
                    <p className="text-xs text-gray-500">online</p>
                </div>
            </div>
            <MoreVertical className="w-5 h-5 text-gray-600 cursor-pointer" />
        </div>
    );
}