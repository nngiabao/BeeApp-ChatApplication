import React, { useEffect, useState } from "react";

export default function TicketManagement() {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [responses, setResponses] = useState([]);
    const [newResponse, setNewResponse] = useState("");

    // 🧩 Load all tickets on mount
    useEffect(() => {
        fetch("http://localhost:8080/supports")
            .then(res => res.json())
            .then(data => setTickets(data.data))
            .catch(console.error);
    }, []);

    // 🧩 Load responses for ticket
    const loadResponses = async (ticketId) => {
        const res = await fetch(`http://localhost:8080/supports/${ticketId}/responses`);
        const data = await res.json();
        setResponses(data.data);
        console.log(data.data);
    };

    const handleTicketClick = async (ticket) => {
        setSelectedTicket(ticket);
        await loadResponses(ticket.id);
    };

    // 🧩 Reply to a ticket
    const handleReply = async () => {
        if (!newResponse.trim()) return;

        try {
            const res = await fetch(
                `http://localhost:8080/supports/${selectedTicket.id}/reply?managerId=1&message=${encodeURIComponent(newResponse)}`,
                {
                    method: "POST",
                }
            );

            if (!res.ok) throw new Error("Failed to send reply");

            setNewResponse("");
            await loadResponses(selectedTicket.id); // reload message thread
        } catch (error) {
            console.error("❌ Error sending reply:", error);
            alert("Failed to send response. Please try again.");
        }
    };


    // 🧩 Mark as resolved
    const handleMarkResolved = async () => {
        await fetch(`http://localhost:8080/supports/${selectedTicket.id}/resolve`, {
            method: "PUT"
        });

        // Refresh tickets list
        const res = await fetch("http://localhost:8080/supports");
        const data = await res.json();
        setTickets(data.data);

        // Update selected ticket status
        const updated = data.data.find(t => t.id === selectedTicket.id);
        setSelectedTicket(updated);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Ticket Management</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ticket List */}
                <div className="bg-white shadow rounded-2xl p-6 max-h-[70vh] overflow-y-auto">
                    <h3 className="text-xl font-semibold mb-4">All Tickets</h3>
                    {tickets.map(ticket => (
                        <div key={ticket.id} onClick={() => handleTicketClick(ticket)}
                             className={`border-b py-2 cursor-pointer hover:bg-gray-100 ${selectedTicket?.id === ticket.id ? "bg-gray-100" : ""}`}>
                            <p className="font-medium">{ticket.subject}</p>
                            <p className="text-sm text-gray-500">Status: {ticket.status}</p>
                        </div>
                    ))}
                </div>

                {/* Ticket Details */}
                {selectedTicket && (
                    <div className="bg-white shadow rounded-2xl p-6 max-h-[70vh] flex flex-col overflow-y-auto">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-semibold">{selectedTicket.subject}</h3>
                            {selectedTicket.status !== "RESOLVED" && (
                                <button
                                    onClick={handleMarkResolved}
                                    className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700"
                                >
                                    Mark as Resolved
                                </button>
                            )}
                        </div>

                        <p className="mb-4 text-gray-700">{selectedTicket.message}</p>

                        <div className="flex-1 space-y-2 overflow-y-auto border-t pt-2">
                            {responses.map(res => (
                                <div
                                    key={res.id}
                                    className={`border p-2 rounded ${
                                        res.senderType === "ADMIN" ? "bg-blue-50" : "bg-gray-100"
                                    }`}
                                >
                                    <p className="text-sm text-gray-600 font-semibold ">
                                        {res.senderType === "ADMIN" ? `Admin #${res.managerId}` : "User"}:
                                    </p>
                                    <p>{res.response}</p>
                                </div>
                            ))}
                        </div>


                        {selectedTicket.status !== "RESOLVED" ? (
                            <div className="mt-4 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type a reply..."
                                    className="flex-1 border rounded p-2"
                                    value={newResponse}
                                    onChange={e => setNewResponse(e.target.value)}
                                />
                                <button
                                    onClick={handleReply}
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Reply
                                </button>
                            </div>
                        ) : (
                            <p className="mt-4 text-sm text-gray-500 italic">This ticket is marked as resolved. You can no longer reply.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
