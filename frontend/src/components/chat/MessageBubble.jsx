import React from "react";
import { Download } from "lucide-react";

export default function MessageBubble({ message }) {
    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = message.mediaUrl;
        link.download = message.content;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={`flex ${message.self ? "justify-end" : "justify-start"} mb-2`}>
            <div
                className={`max-w-xs p-3 rounded-lg text-sm shadow-sm break-words relative ${
                    message.self ? "bg-green-100 text-gray-800" : "bg-white text-gray-800"
                }`}
            >
                {/* 📄 File Message */}
                {message.messageType?.toLowerCase() === "file" ? (
                    <div className="flex flex-row items-center gap-2">
                        {/* File name */}
                        <a
                            href={message.mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800 break-all flex-1"
                        >
                            {message.content}
                        </a>

                        {/* Download icon */}
                        <button
                            onClick={handleDownload}
                            className="text-green-600 hover:text-green-800 p-1"
                        >
                            <Download size={16} />
                        </button>
                    </div>
                ) : (
                    //Text Message
                    <p>{message.content}</p>
                )}
            </div>
        </div>
    );
}