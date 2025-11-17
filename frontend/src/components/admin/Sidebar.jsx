// Sidebar.jsx
import React from "react";
import { Home, Users, FileChart, Settings } from "lucide-react";


export default function Sidebar({ setPage }) {
    return (
        <aside className="w-64 bg-white shadow-xl p-6 flex flex-col">
            <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>


            <nav className="flex flex-col space-y-4">
                <button onClick={() => setPage("home")} className="flex items-center space-x-3 text-gray-700 hover:text-blue-600">
                    <Home size={20} /> <span>Dashboard</span>
                </button>


                <button onClick={() => setPage("users")} className="flex items-center space-x-3 text-gray-700 hover:text-blue-600">
                    <Users size={20} /> <span>User Management</span>
                </button>


                <button onClick={() => setPage("reports")} className="flex items-center space-x-3 text-gray-700 hover:text-blue-600">
                    <FileChart size={20} /> <span>Report Management</span>
                </button>


                <button className="flex items-center space-x-3 text-gray-700 hover:text-blue-600">
                    <Settings size={20} /> <span>Settings</span>
                </button>
            </nav>
        </aside>
    );
}