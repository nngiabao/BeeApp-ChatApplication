import React from "react";
import { Home, Users, Settings, BarChart ,ClipboardList} from "lucide-react";


export default function Sidebar({ setActivePage }) {
    return (
        <aside className="w-64 bg-white shadow-xl p-6 flex flex-col">
            <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>

            <nav className="flex flex-col space-y-4">
                <button
                    onClick={() => setActivePage("dashboard")}
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600"
                >
                    <Home size={20}/>
                    <span>Dashboard</span>
                </button>

                <button
                    onClick={() => setActivePage("users")}
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600"
                >
                    <Users size={20}/>
                    <span>User Management</span>
                </button>
                {/* Ticket management */}
                <button
                    onClick={() => setActivePage("tickets")}
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600"
                >
                    <ClipboardList size={20}/> {/* import from lucide-react */}
                    <span>Ticket Management</span>
                </button>
                <button
                    onClick={() => setActivePage("analytics")}
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600"
                >
                    <BarChart size={20}/>
                    <span>Analytics</span>
                </button>

                <button
                    onClick={() => setActivePage("settings")}
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600"
                >
                    <Settings size={20}/>
                    <span>Settings</span>
                </button>
            </nav>
        </aside>
    );
}
