// src/components/sidebar/SidebarSearch.jsx
import React from "react";
import { Search } from "lucide-react";


export default function SidebarSearch() {
    return (
        <div className="p-3 relative border-b border-gray-100">
            <Search className="absolute left-5 top-5 text-gray-400 w-4 h-4" />
            <input
                type="text"
                placeholder="Search or start a new chat"
                className="w-full pl-10 pr-3 py-2 border rounded-full text-sm focus:outline-none focus:ring focus:ring-green-200"
            />
        </div>
    );
}