// src/components/sidebar/SidebarFilters.jsx
import React from "react";


export default function SidebarFilters() {
    const filters = ["All", "Unread", "Favorites", "Groups"];
    return (
        <div className="flex space-x-2 px-4 py-2 border-b border-gray-100">
            {filters.map((filter) => (
                <button
                    key={filter}
                    className={`px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 ${
                        filter === "All" ? "bg-green-100 text-green-600" : "text-gray-600"
                    }`}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
}