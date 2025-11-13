import React, { useState } from "react";
import { Pencil, Phone, Copy, Lock, LogOut } from "lucide-react";
import { useUser } from "../context/UserContext.jsx";

export default function ProfileInfo() {
    const { user, updateUser, changePassword } = useUser();
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [name, setName] = useState();
    const [phone, setPhone] = useState();
    const [about, setAbout] = useState();

    const handleLogout = () => {

        localStorage.clear();

        window.location.href = "/";
    };
    //update name
    const handleSaveName = async () => {
        setIsEditingName(false);
        await updateUser({ name });  //
    };
    //update phone
    const handlePhoneSave = async () => {
        setIsEditingPhone(false);
        await updateUser({ phoneNumber: phone });
    };
    //update about
    const handleAboutSave = async () => {
        setIsEditingAbout(false);
        await updateUser({ statusMessage: about });
    };
    //update pw
    const handlePasswordSave = async (e) => {
        e.preventDefault(); // stop page reload

        if (newPassword !== confirmPassword) {
            alert("New passwords do not match");
            return;
        }

        await changePassword(oldPassword, newPassword);

        //Close popup after success
        setShowPasswordForm(false);

        //Clear input fields
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
                    {isEditingName ? (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={handleSaveName}
                            autoFocus
                            className="text-gray-800 font-medium border-b border-gray-300 focus:outline-none focus:border-green-500"
                        />
                    ) : (
                        <span className="text-gray-800 font-medium">{user.name}</span>
                    )}
                    <Pencil
                        className="w-4 h-4 text-gray-500 cursor-pointer hover:text-green-600"
                        onClick={() => setIsEditingName(true)}
                    />
                </div>
            </div>
            {/* About */}
            <div className="mb-6">
                <label className="block text-sm text-gray-500 mb-1">About</label>
                <div className="flex justify-between items-center">
                    {isEditingAbout ? (
                        <input
                            type="text"
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            onBlur={handleAboutSave}
                            autoFocus
                            className="text-gray-800 text-sm border-b border-gray-300 focus:outline-none focus:border-green-500 w-full"
                        />
                    ) : (
                        <span className="text-gray-800 text-sm">{user.statusMessage}</span>
                    )}
                    <Pencil
                        className="w-4 h-4 text-gray-500 cursor-pointer hover:text-green-600 ml-2"
                        onClick={() => setIsEditingAbout(true)}
                    />
                </div>
            </div>
            {/* Phone */}
            <div className="mb-6">
                <label className="block text-sm text-gray-500 mb-1">Phone</label>
                <div className="flex items-center justify-between">
                    {isEditingPhone ? (
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            onBlur={handlePhoneSave}
                            autoFocus
                            className="text-gray-800 font-medium border-b border-gray-300 focus:outline-none focus:border-green-500"
                        />
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-800 font-medium">{user.phoneNumber}</span>
                        </div>
                    )}
                    <Pencil
                        className="w-4 h-4 text-gray-500 cursor-pointer hover:text-green-600"
                        onClick={() => setIsEditingPhone(true)}
                    />
                </div>
            </div>
            {/* Change Password (Like Phone Field) */}
            <div className="mb-6">
                <label className="block text-sm text-gray-500 mb-1">Password</label>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-800 font-medium">••••••••</span>
                    </div>
                    <Pencil
                        className="w-4 h-4 text-gray-500 cursor-pointer hover:text-green-600"
                        onClick={() => setShowPasswordForm(true)}
                    />
                </div>
            </div>

            {/* Logout Button */}
            <div
                onClick={handleLogout}
                className="flex items-center space-x-3 bg-[#faf9f8] px-4 py-3 rounded-xl cursor-pointer hover:bg-red-50 transition duration-200"
            >
                <LogOut className="w-5 h-5 text-red-500" />
                <span className="text-red-600 font-medium text-sm">Log out</span>
            </div>

            {/* Password Change Popup */}
            {showPasswordForm && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">Change Password</h2>
                        <form onSubmit={handlePasswordSave} className="space-y-4">
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
