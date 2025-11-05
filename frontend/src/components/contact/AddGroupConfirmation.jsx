import React, { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";

export default function NewGroupPanel({ onBack, onCreate }) {
    const [groupName, setGroupName] = useState("");
    const [groupIcon, setGroupIcon] = useState(null);
    const [disappearingMessages, setDisappearingMessages] = useState("Off");

    // ✅ Permissions toggles
    const [permissions, setPermissions] = useState({
        editGroupSettings: true,
        sendMessages: true,
        addMembers: true,
        approveMembers: false,
    });

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setGroupIcon(URL.createObjectURL(file));
        }
    };

    const togglePermission = (key) => {
        setPermissions((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleCreate = () => {
        if (!groupName.trim()) return;
        onCreate({ groupName, groupIcon, disappearingMessages, permissions });
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
                            <span className="text-white text-sm">
                                Add group icon
                            </span>
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
                placeholder="Group subject (optional)"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="border-b border-gray-300 p-2 mb-6 focus:outline-none focus:border-green-500"
            />

            {/* Disappearing Messages */}
            <div className="flex justify-between items-center py-3 border-t border-gray-200 cursor-pointer">
                <p className="text-gray-700 font-medium">
                    Disappearing messages
                </p>
                <p className="text-gray-500">{disappearingMessages}</p>
            </div>

            {/* Group Permissions */}
            <div className="border-t border-gray-200 pt-4 mt-4">
                <h2 className="text-gray-700 font-semibold mb-3">
                    Members can:
                </h2>

                {/* Permission 1 */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="font-medium text-gray-800">
                            Edit group settings
                        </p>
                        <p className="text-sm text-gray-500 w-64">
                            Includes name, icon, description, disappearing
                            messages, and pin ability.
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={permissions.editGroupSettings}
                            onChange={() => togglePermission("editGroupSettings")}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                </div>

                {/* Permission 2 */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="font-medium text-gray-800">
                            Send new messages
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={permissions.sendMessages}
                            onChange={() => togglePermission("sendMessages")}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                </div>

                {/* Permission 3 */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="font-medium text-gray-800">
                            Add other members
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={permissions.addMembers}
                            onChange={() => togglePermission("addMembers")}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                </div>

                <h2 className="text-gray-700 font-semibold mb-3 mt-6">
                    Admins can:
                </h2>

                {/* Admin Permission */}
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-medium text-gray-800">
                            Approve new members
                        </p>
                        <p className="text-sm text-gray-500 w-64">
                            When turned on, admins must approve anyone who wants
                            to join this group.
                            <span className="text-green-600 ml-1 cursor-pointer">
                                Learn more
                            </span>
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={permissions.approveMembers}
                            onChange={() => togglePermission("approveMembers")}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                </div>
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
