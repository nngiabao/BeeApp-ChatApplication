import { useState } from "react";


export default function MessageInput({ onSend }) {
    const [text, setText] = useState("");
    const send = () => {
        if (!text.trim()) return;
        onSend(text);
        setText("");
    };


    return (
        <div className="bg-white border-t px-3 py-2 flex items-center gap-2">
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none text-sm"
            />
            <button onClick={send} className="px-4 py-2 bg-green-500 text-white rounded-full">
                ➤
            </button>
        </div>
    );
}