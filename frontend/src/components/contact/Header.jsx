import React from "react";


export default function ContactHeader() {
    return (
        <div>
            {/* Header */}
            <div className="flex items-center space-x-2 mb-4">
                <h1 className="text-xl font-semibold text-red-300">Contacts</h1>
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