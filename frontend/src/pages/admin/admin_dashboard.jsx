import React from "react";
import { Home, Users, Settings, BarChart } from "lucide-react";

export default function AdminDashboardLayout() {
    return (
        <div className="flex h-screen w-full bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-xl p-6 flex flex-col">
                <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>

                <nav className="flex flex-col space-y-4">
                    <button className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 cursor-pointer">
                        <Home size={20} />
                        <span>Dashboard</span>
                    </button>

                    <button className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 cursor-pointer">
                        <Users size={20} />
                        <span>User Management</span>
                    </button>

                    <button className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 cursor-pointer">
                        <BarChart size={20} />
                        <span>Analytics</span>
                    </button>

                    <button className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 cursor-pointer">
                        <Settings size={20} />
                        <span>Settings</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-y-auto">
                <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <div className="bg-white shadow rounded-2xl p-6">Total Users: 1200</div>
                    <div className="bg-white shadow rounded-2xl p-6">Active Chats: 856</div>
                    <div className="bg-white shadow rounded-2xl p-6">Files Shared: 340</div>
                </div>
            </main>
        </div>
    );
}
