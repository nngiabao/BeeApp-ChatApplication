import React, { useEffect, useState } from "react";

export default function SettingsPanel() {
    const [admin, setAdmin] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        statusMessage: "",
        profilePicture: "",
    });

    const adminId = 1; // ← replace with actual admin ID or fetch from auth context

    useEffect(() => {
        fetch(`http://localhost:8080/users/${adminId}`)
            .then(res => res.json())
            .then(data => {
                setAdmin(data.data);
                setFormData({
                    name: data.data.name || "",
                    phoneNumber: data.data.phoneNumber || "",
                    statusMessage: data.data.statusMessage || "",
                    profilePicture: data.data.profilePicture || "",
                });
            })
            .catch(console.error);
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        const res = await fetch(`http://localhost:8080/users/${adminId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            alert("Profile updated!");
        } else {
            alert("Failed to update profile.");
        }
    };

    const handleProfilePictureUpdate = async () => {
        const res = await fetch(`http://localhost:8080/users/${adminId}/profile-picture`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imgUrl: formData.profilePicture }),
        });

        if (res.ok) {
            alert("Profile picture updated!");
        } else {
            alert("Failed to update picture.");
        }
    };

    if (!admin) return <div>Loading admin data...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Admin Settings</h2>

            <div className="bg-white shadow rounded-2xl p-6 space-y-4 max-w-lg">
                {/* Profile Picture */}
                <div className="flex items-center gap-4">
                    <img
                        src={formData.profilePicture || "https://chatapp-beeapp.s3.us-east-2.amazonaws.com/invidual/default-profile.png"}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border"
                    />
                    <div className="flex-1">
                        <label className="block text-sm font-medium">Profile Picture URL</label>
                        <input
                            type="text"
                            name="profilePicture"
                            value={formData.profilePicture}
                            onChange={handleChange}
                            className="mt-1 border rounded px-3 py-1 w-full"
                        />
                        <button
                            onClick={handleProfilePictureUpdate}
                            className="mt-2 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                            Update Picture
                        </button>
                    </div>
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

                {/* Phone Number */}
                <div>
                    <label className="block text-sm font-medium">Phone Number</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="mt-1 border rounded px-3 py-1 w-full"
                    />
                </div>

                {/* Status Message */}
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
                <div className="text-right">
                    <button
                        onClick={handleSave}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
