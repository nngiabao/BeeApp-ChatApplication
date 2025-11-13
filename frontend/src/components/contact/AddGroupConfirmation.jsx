import React, { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function NewGroupPanel({ onBack, onCreated, members = [] }) {
    const { user } = useUser();
    const [groupName, setGroupName] = useState("");
    const [groupIcon, setGroupIcon] = useState(null);

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (file) setGroupIcon(URL.createObjectURL(file));
    };

    const handleCreate = async () => {
        if (!groupName.trim()) return;

        //Pass selected members + creator to backend
        await onCreated({ groupName, groupIcon });
    };

    return (
        <div className="w-full h-full bg-white p-4 flex flex-col">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
                <button
                    onClick={onBack}
                    className="text-green-600 hover:text-green-700"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-semibold">New group</h1>
            </div>

            {/* Group Icon */}
            <div className="flex flex-col items-center mb-6">
                <label htmlFor="group-icon" className="cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-gray-400 flex items-center justify-center overflow-hidden">
                        {groupIcon ? (
                            <img
                                src={groupIcon}
                                alt="Group Icon"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-white text-sm">Add group icon</span>
                        )}
                    </div>
                </label>
                <input
                    id="group-icon"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleIconChange}
                />
            </div>

            {/* Group Subject */}
            <input
                type="text"
                placeholder="Group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="border-b border-gray-300 p-2 mb-6 focus:outline-none focus:border-green-500"
            />

            {/* Selected Members Preview */}
            <div className="flex flex-wrap gap-3 mb-6">
                {members.map((m) => (
                    <div
                        key={m.id}
                        className="flex flex-col items-center text-center"
                    >
                        <img className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white mb-1"
                             src={m.profilePicture || "https://chatapp-beeapp.s3.us-east-2.amazonaws.com/invidual/default-profile.png"}
                             alt={m.name} >
                        </img>
                        <p className="text-xs text-gray-700 font-medium truncate w-14">
                            {m.alias}
                        </p>
                    </div>
                ))}
            </div>

            {/* Create Button */}
            <div className="flex justify-center mt-auto pt-6">
                <button
                    onClick={handleCreate}
                    disabled={!groupName.trim()}
                    className="bg-green-600 p-3 rounded-full disabled:opacity-50"
                >
                    <Check className="w-6 h-6 text-white" />
                </button>
            </div>
        </div>
    );
}
