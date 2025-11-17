import React, { useEffect, useState } from "react";

export default function TicketManagement() {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [responses, setResponses] = useState([]);
    const [newResponse, setNewResponse] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/api/admin/support/tickets")
            .then(res => res.json())
            .then(setTickets)
            .catch(console.error);
    }, []);

    const loadResponses = async (ticketId) => {
        const res = await fetch(`http://localhost:8080/api/admin/support/responses/${ticketId}`);
        const data = await res.json();
        setResponses(data);
    };

    const handleTicketClick = async (ticket) => {
        setSelectedTicket(ticket);
        await loadResponses(ticket.id);
    };

    const handleReply = async () => {
        if (!newResponse.trim()) return;

        await fetch(`http://localhost:8080/api/admin/support/responses/${selectedTicket.id}?managerId=1&message=${encodeURIComponent(newResponse)}`, {
            method: "POST"
        });

        setNewResponse("");
        await loadResponses(selectedTicket.id);
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
                             className="border-b py-2 cursor-pointer hover:bg-gray-100">
                            <p className="font-medium">{ticket.subject}</p>
                            <p className="text-sm text-gray-500">Status: {ticket.status}</p>
                        </div>
                    ))}
                </div>

                {/* Ticket Detail + Response Thread */}
                {selectedTicket && (
                    <div className="bg-white shadow rounded-2xl p-6 max-h-[70vh] flex flex-col overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-4">{selectedTicket.subject}</h3>
                        <p className="mb-4 text-gray-700">{selectedTicket.message}</p>

                        <div className="flex-1 space-y-2 overflow-y-auto border-t pt-2">
                            {responses.map(res => (
                                <div key={res.id} className="border p-2 rounded bg-blue-50">
                                    <p className="text-sm text-gray-600">Manager #{res.managerId}:</p>
                                    <p>{res.response}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex gap-2">
                            <input
                                type="text"
                                placeholder="Type a reply..."
                                className="flex-1 border rounded p-2"
                                value={newResponse}
                                onChange={e => setNewResponse(e.target.value)}
                            />
                            <button onClick={handleReply} className="bg-blue-600 text-white px-4 py-2 rounded">
                                Reply
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
