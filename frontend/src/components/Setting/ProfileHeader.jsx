import React, { useRef, useState } from "react";
import { Image, Camera } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function ProfileHeader() {
    const { user, updateUser } = useUser(); // assuming updateUser updates user info in context
    const [preview, setPreview] = useState(user?.profilePicture || "");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 20 * 1024 * 1024) {
            alert("File size exceeds 20MB limit.");
            return;
        }

        setUploading(true);
        try {
            // 1️⃣ Upload to S3 via backend
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", "invidual"); // store under /individual/ folder

            const res = await fetch("http://localhost:8080/aws/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");
            const imageUrl = await res.text(); // backend returns the URL

            // 2️⃣ Update local preview
            setPreview(imageUrl);

            // 4️⃣ Update user in context (frontend)
            updateUser({ profilePicture: imageUrl });
            alert("Profile photo updated successfully!");
        } catch (err) {
            console.error("Error uploading image:", err);
            alert("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h1 className="text-lg font-semibold mb-6">Profile</h1>
            <div className="flex flex-col items-center mb-8">
                <div
                    className="relative w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {/* Image preview */}
                    {preview ? (
                        <img
                            src={preview}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full"
                        />
                    ) : (
                        <Image className="w-10 h-10 text-gray-600" />
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                        <span className="text-xs text-white mt-1">
                            {uploading ? "Uploading..." : "Change photo"}
                        </span>
                    </div>
                </div>

                {/* Hidden file input */}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
}
