import React, { useState } from "react";

export default function AddMemberModal({
                                           open,
                                           onClose,
                                           contacts,
                                           chatId,
                                           groupMemberIds,
                                           onAdded,
                                       }) {
    if (!open) return null;

    const [search, setSearch] = useState("");

    //Contacts not in the group
    const available = contacts.filter(
        (c) => !groupMemberIds.includes(c.contactId)
    );

    //Filter by search
    const filtered = available.filter((c) =>
        c.alias?.toLowerCase().includes(search.toLowerCase())
    );

    const handleAdd = async (userId) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/groups/${chatId}/add/${userId}`, {
                method: "POST",
            });

            onAdded();
            onClose();
            alert("Member added!");
        } catch (err) {
            console.error(err);
            alert("Failed to add member");
        }
    };

    return (
        <div className="absolute inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white w-72 rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Add Member</h3>

                {/*  Search */}
                <input
                    type="text"
                    placeholder="Search contacts..."
                    className="w-full border rounded-md p-2 mb-3"
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* 🔄 Contact List */}
                <div className="max-h-60 overflow-y-auto space-y-2">
                    {available.length === 0 ? (
                        <p className="text-center text-sm text-gray-400">
                            You have no contacts to add.
                        </p>
                    ) : filtered.length === 0 ? (
                        <p className="text-center text-sm text-gray-400">
                            No matching contacts found.
                        </p>
                    ) : (
                        filtered.map((c) => (
                            <div
                                key={c.userId}
                                className="flex items-center justify-between p-2 bg-gray-100 rounded-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <img
                                        src={
                                            c.profilePicture ||
                                            "https://chatapp-beeapp.s3.us-east-2.amazonaws.com/invidual/default-profile.png"
                                        }
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <div>
                                        <p className="font-medium">{c.alias || "Unknown"}</p>
                                        <p className="text-xs text-gray-500">User ID: {c.userId}</p>
                                    </div>
                                </div>
                                <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                                    onClick={() => handleAdd(c.contactId)}
                                >
                                    Add
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <button
                    className="mt-3 w-full py-2 bg-gray-300 rounded-lg"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
