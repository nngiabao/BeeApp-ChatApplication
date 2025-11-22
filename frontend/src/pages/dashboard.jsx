import React, { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import TicketPanel from "../components/Setting/TicketPanel";

export default function Dashboard() {
    const [activeTicket, setActiveTicket] = useState(null);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar setActiveTicket={setActiveTicket} />

            <div className="flex-1 bg-white">
                {activeTicket ? (
                    <TicketPanel
                        ticket={activeTicket}
                        close={() => setActiveTicket(null)}
                    />
                ) : (
                    <ChatWindow />
                )}
            </div>
        </div>
    );
}
