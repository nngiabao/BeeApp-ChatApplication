// src/components/sidebar/SidebarHeader.jsx
import React from "react";
import { Plus, MoreVertical } from "lucide-react";


export default function SidebarHeader() {
    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-red-300">BeeApp</h1>
            <div className="flex space-x-4 text-gray-600">
                <Plus className="w-5 h-5 cursor-pointer" />
                <MoreVertical className="w-5 h-5 cursor-pointer" />
            </div>
        </div>
    );
}