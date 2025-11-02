import React, { useState, useRef } from "react";
import { Smile, Paperclip, Send } from "lucide-react";
import EmojiPanel from "./EmojiPanel";

export default function MessageInput({ onSend }) {
    const [input, setInput] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const emojiButtonRef = useRef(null);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        if (onSend) onSend(input.trim());
        setInput("");
        setShowEmoji(false);
    };

    const handleEmojiClick = (emoji) => {
        setInput((prev) => prev + emoji);
    };

    return (
        <div className="relative">
            {/* Emoji popup moved slightly to the right of emoji icon */}
            {showEmoji && (
                <div className="absolute bottom-[20px] left-[200px] z-50">
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

                {/* Attachment Button */}
                <button type="button" className="p-1 hover:bg-gray-200 rounded-full">
                    <Paperclip className="w-6 h-6 text-gray-600 cursor-pointer" />
                </button>

                {/* Input Field */}
                <input
                    type="text"
                    placeholder="Type a message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-2 border rounded-full focus:outline-none focus:ring focus:ring-green-200"
                />

                {/* Send Button */}
                <button type="submit">
                    <Send className="w-6 h-6 text-green-600 hover:text-green-700 cursor-pointer" />
                </button>
            </form>
        </div>
    );
}