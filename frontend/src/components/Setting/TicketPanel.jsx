import React, { useEffect, useState } from "react";

export default function TicketPanel({ ticket, close }) {
    const [responses, setResponses] = useState([]);
    const [reply, setReply] = useState("");

    // Load responses
    const loadResponses = async () => {
        const res = await fetch(`http://localhost:8080/supports/${ticket.id}/responses`);
        const data = await res.json();
        console.log("Loaded ticket responses:", data);
        setResponses(data.data || []);
    };

    useEffect(() => {
        loadResponses();
    }, [ticket.id]);

    // Send reply (USER)
    const sendReply = async () => {
        if (!reply.trim()) return;

        const res = await fetch(
            `http://localhost:8080/supports/${ticket.id}/reply?senderId=${ticket.userId}&senderType=USER&message=${encodeURIComponent(
                reply
            )}`,
            { method: "POST" }
        );

        if (res.ok) {
            setReply("");
            loadResponses(); // reload chat
        } else {
            alert("Failed to send reply");
        }
    };

    return (
        <div className="h-full flex flex-col">

            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">{ticket.subject}</h2>
                <button
                    onClick={close}
                    className="text-red-500 hover:text-red-700 text-sm"
                >
                    Close
                </button>
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {responses.map((r) => (
                    <div
                        key={r.id}
                        className={`p-3 rounded-lg max-w-lg ${
                            r.senderType === "USER"
                                ? "bg-green-100 ml-auto"
                                : "bg-gray-200"
                        }`}
                    >
                        {/* Show message correctly */}
                        <p className="text-sm text-gray-800">{r.response}</p>

                        {/* Timestamp */}
                        <p className="text-xs text-gray-500 mt-1">
                            {new Date(r.createdAt).toLocaleString()}
                        </p>
                    </div>
                ))}

            </div>

            {/* Reply bar (only if OPEN) */}
            {ticket.status === "OPEN" && (
                <div className="p-3 border-t flex items-center gap-3">
                    <input
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        className="flex-1 border rounded-full px-3 py-2"
                        placeholder="Type a reply..."
                    />
                    <button
                        onClick={sendReply}
                        className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
                    >
                        Send
                    </button>
                </div>
            )}
        </div>
    );
}
