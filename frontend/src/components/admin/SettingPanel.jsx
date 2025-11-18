import React, { useEffect, useState } from "react";
import { useUser } from "../../components/context/UserContext";
import { useNavigate } from "react-router-dom";

export default function SettingsPanel() {
    const { user, updateUser, changePassword, setUser } = useUser();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        statusMessage: "",
    });

    const [previewPicture, setPreviewPicture] = useState("");
    const [errors, setErrors] = useState({});

    // Password fields
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                phoneNumber: user.phoneNumber || "",
                statusMessage: user.statusMessage || "",
            });
            setPreviewPicture(user.profilePicture || "");
        }
    }, [user]);

    // --- VALIDATION ---
    const validatePhone = (phone) => {
        const regex = /^[0-9]{10}$/;
        return regex.test(phone);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "phoneNumber") {
            if (!validatePhone(value)) {
                setErrors(prev => ({ ...prev, phone: "Phone must be 10 digits" }));
            } else {
                setErrors(prev => ({ ...prev, phone: null }));
            }
        }
    };

    const handleSave = () => {
        if (errors.phone) {
            alert("Fix validation errors first.");
            return;
        }
        updateUser(formData);
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`http://localhost:8080/users/${user.id}/profile-picture/upload`, {
                method: "PUT",
                body: formData,
            });

            const data = await res.json();

            if (res.ok && data.imgUrl) {
                alert("✅ Profile picture uploaded!");
                setFormData((prev) => ({ ...prev, profilePicture: data.imgUrl }));
                setUser({ ...user, profilePicture: data.imgUrl });
            } else {
                alert("❌ Upload failed");
            }
        } catch (err) {
            console.error("Upload error:", err);
            alert("Server error during upload");
        }
    };

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword) {
            alert("Both fields are required.");
            return;
        }
        if (newPassword.length < 4) {
            alert("Password must be at least 4 characters.");
            return;
        }

        await changePassword(oldPassword, newPassword);

        setOldPassword("");
        setNewPassword("");
    };

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8080/users/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user.username }),
            });
        } catch (err) {
            console.error("Logout failed:", err);
        }

        localStorage.clear();
        setUser(null);
        navigate("/");
    };

    if (!user) return <div>Loading admin data...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Admin Settings</h2>

            <div className="bg-white shadow rounded-2xl p-6 space-y-6 max-w-lg mx-auto">

                {/* Profile Picture */}
                <div className="relative mb-6 flex flex-col items-center">
                    <label htmlFor="profile-upload" className="cursor-pointer group">
                        <img
                            src={
                                formData.profilePicture ||
                                "https://chatapp-beeapp.s3.us-east-2.amazonaws.com/invidual/default-profile.png"
                            }
                            alt="Profile"
                            className="w-40 h-40 rounded-full object-cover border-4 border-gray-300 shadow transition-transform duration-300 hover:scale-105"
                        />
                        <input
                            type="file"
                            id="profile-upload"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <p className="text-sm text-gray-500 mt-2 group-hover:underline">Click to change profile
                            picture</p>
                    </label>
                </div>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 border rounded px-3 py-1 w-full"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium">Phone Number</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className={`mt-1 border rounded px-3 py-1 w-full 
                            ${errors.phone ? "border-red-500" : ""}`}
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium">Status Message</label>
                    <textarea
                        name="statusMessage"
                        value={formData.statusMessage}
                        onChange={handleChange}
                        className="mt-1 border rounded px-3 py-2 w-full"
                    />
                </div>

                {/* Save */}
                <button
                    onClick={handleSave}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Save Profile
                </button>

                {/* Change Password */}
                <div className="pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-3">Change Password</h3>

                    <input
                        type="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="border rounded px-3 py-2 w-full mb-3"
                    />

                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border rounded px-3 py-2 w-full mb-3"
                    />

                    <button
                        onClick={handleChangePassword}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Update Password
                    </button>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-6"
                >
                    Logout
                </button>

            </div>
        </div>
    );
}
