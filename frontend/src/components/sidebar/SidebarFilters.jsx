import React from "react";
import { useChat } from "../context/ChatContext";

export default function SidebarFilters() {
    const { activeFilter, setActiveFilter } = useChat();
    const filters = ["All", "Unread", "Groups"];

    return (
        <div className="flex space-x-2 px-4 py-2 border-b border-gray-100">
            {filters.map((filter) => (
                <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                        activeFilter === filter
                            ? "bg-green-100 text-green-600"
                            : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
}
