// src/components/chat/MessageInput.jsx
import React, { useState, useRef } from "react";
import { Smile, Paperclip, Send, Loader2 } from "lucide-react";
import EmojiPanel from "./EmojiPanel";
import { useChat } from "../context/ChatContext";
import { useUser } from "../context/UserContext";

export default function MessageInput() {
    const [input, setInput] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const emojiButtonRef = useRef(null);

    const { sendMessage, currentChat } = useChat();
    const { user } = useUser();

    //Send text message
    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim() || !currentChat) return;

        sendMessage({
            senderId: user.id,
            content: input.trim(),
            messageType: "text",
        });

        setInput("");
        setShowEmoji(false);
    };

    //Handle emoji click
    const handleEmojiClick = (emoji) => setInput((prev) => prev + emoji);

    // Handle file selection and upload to AWS
    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (< 20 MB)
        const maxSize = 20 * 1024 * 1024;
        if (file.size > maxSize) {
            alert("❌ File too large! Please select a file smaller than 20 MB.");
            return;
        }

        if (!currentChat) {
            alert("Please open a chat before sending a file.");
            return;
        }

        try {
            setUploading(true);

            // Create form data
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", "file");

            // Upload to backend → AWS S3
            const res = await fetch("http://${import.meta.env.VITE_API_URL}/aws/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");
            const fileUrl = await res.text();

            // Send message with file URL
            sendMessage({
                senderId: user.id,
                content: file.name,
                messageType: "file",
                mediaUrl: fileUrl,
            });

        } catch (err) {
            console.error("File upload error:", err);
            alert("Failed to upload file.");
        } finally {
            setUploading(false);
            e.target.value = ""; // reset input
        }
    };

    return (
        <div className="relative">
            {/* Emoji popup */}
            {showEmoji && (
                <div className="absolute bottom-[70px] left-[60px] z-50">
                    <EmojiPanel
                        onEmojiClick={handleEmojiClick}
                        onClose={() => setShowEmoji(false)}
                    />
                </div>
            )}

            <form
                onSubmit={handleSend}
                className="p-4 bg-[#f0f2f5] border-t border-gray-300 flex items-center space-x-3"
            >
                {/* Emoji Button */}
                <button
                    ref={emojiButtonRef}
                    type="button"
                    onClick={() => setShowEmoji((prev) => !prev)}
                    className="p-1 hover:bg-gray-200 rounded-full"
                >
                    <Smile className="w-6 h-6 text-gray-600 cursor-pointer" />
                </button>

                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
                />

                {/* Attachment Button */}
                <button
                    type="button"
                    className="p-1 hover:bg-gray-200 rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                >
                    {uploading ? (
                        <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
                    ) : (
                        <Paperclip className="w-6 h-6 text-gray-600 cursor-pointer" />
                    )}
                </button>

                {/* Input Field */}
                <input
                    type="text"
                    placeholder="Type a message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-2 border rounded-full focus:outline-none focus:ring focus:ring-green-200"
                    disabled={uploading}
                />

                {/* Send Button */}
                <button type="submit" disabled={uploading}>
                    <Send className="w-6 h-6 text-green-600 hover:text-green-700 cursor-pointer" />
                </button>
            </form>
        </div>
    );
}
