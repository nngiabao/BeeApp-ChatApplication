import React from "react";
import { Download } from "lucide-react";

export default function MessageBubble({ message }) {

    const handleDownload = async () => {
        try {
            const response = await fetch(message.mediaUrl, { mode: "cors" });
            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = message.content || "file";
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    return (
        <div className={`flex ${message.self ? "justify-end" : "justify-start"} mb-2`}>
            <div
                className={`max-w-xs p-3 rounded-lg text-sm shadow-sm break-words relative ${
                    message.self ? "bg-green-100 text-gray-800" : "bg-white text-gray-800"
                }`}
            >
                {message.messageType?.toLowerCase() === "file" ? (
                    <div className="flex flex-row items-center gap-2">

                        <a
                            href={message.mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800 break-all flex-1"
                        >
                            {message.content}
                        </a>

                        <button
                            onClick={handleDownload}
                            className="text-green-600 hover:text-green-800 p-1"
                        >
                            <Download size={16} />
                        </button>
                    </div>
                ) : (
                    <p>{message.content}</p>
                )}
            </div>
        </div>
    );
}
