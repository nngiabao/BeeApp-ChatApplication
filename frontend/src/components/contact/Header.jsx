import React from "react";


export default function ContactHeader() {
    return (
        <div>
            {/* Header */}
            <div className="flex items-center space-x-2 mb-4">
                <button className="text-green-600 hover:text-green-700">←</button>
                <h1 className="text-lg font-semibold">New chat</h1>
            </div>


            {/* Search bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search name or number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-green-500"
                />
            </div>
        </div>
    );
}