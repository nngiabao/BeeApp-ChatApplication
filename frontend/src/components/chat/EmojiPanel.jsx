import React, { useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";

export default function EmojiPanel({ onEmojiClick, onClose }) {
    const pickerRef = useRef();

    // close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                onClose?.();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={pickerRef}
            className="absolute bottom-16 right-4 bg-white rounded-xl shadow-lg border p-2 z-50"
        >
            <EmojiPicker
                onEmojiClick={(emojiData) => onEmojiClick(emojiData.emoji)}
                searchDisabled={false}
                skinTonesDisabled={false}
                previewConfig={{ showPreview: false }}
                width={320}
                height={400}
            />
        </div>
    );
}
