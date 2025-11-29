import React, { useState } from "react";
import { Pencil, Phone, Copy, Lock } from "lucide-react";

export default function ProfileInfo() {
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match");
            return;
        }
        // Call API for password update here
        setShowPasswordForm(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    return (
        <div className="relative">
            {/* Name */}
            <div className="mb-6">
                <label className="block text-sm text-gray-500 mb-1">Name</label>
                <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-medium">Bao</span>
                    <Pencil className="w-4 h-4 text-gray-500 cursor-pointer hover:text-green-600" />
                </div>
            </div>

            {/* About */}
            <div className="mb-6">
                <label className="block text-sm text-gray-500 mb-1">About</label>
                <div className="flex justify-between items-center">
                    <span className="text-gray-800 text-sm">Hey there! I am using BeeApp.</span>
                    <Pencil className="w-4 h-4 text-gray-500 cursor-pointer hover:text-green-600" />
                </div>
            </div>

            {/* Phone */}
            <div className="mb-6">
                <label className="block text-sm text-gray-500 mb-1">Phone</label>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-800 font-medium">+1 (651) 230-2637</span>
                    </div>
                    <Copy className="w-4 h-4 text-gray-500 cursor-pointer hover:text-green-600" />
                </div>
            </div>

            {/* Change Password Button */}
            <div className="flex justify-end">
                <button
                    onClick={() => setShowPasswordForm(true)}
                    className="flex items-center space-x-2 text-green-600 hover:text-green-700 text-sm font-medium"
                >
                    <Lock className="w-4 h-4" />
                    <span>Change Password</span>
                </button>
            </div>

            {/* Password Change Popup */}
            {showPasswordForm && (
                <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Change Password</h2>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Old Password</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordForm(false)}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
