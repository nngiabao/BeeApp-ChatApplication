import React, { useEffect, useState } from "react";

export default function AnalyticsPanel() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalChats: 0,
        totalReports: 0,
        blockedUsers: 0,
        openTickets: 0,
    });

    useEffect(() => {
        fetch("http://localhost:8080/admin/dashboard/stats")
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(console.error);
    }, []);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Analytics Overview</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="bg-white shadow rounded-2xl p-6">
                    <p className="text-sm text-gray-500">Total Users</p>
                    <p className="text-2xl font-semibold">{stats.totalUsers}</p>
                </div>

                <div className="bg-white shadow rounded-2xl p-6">
                    <p className="text-sm text-gray-500">Active Users</p>
                    <p className="text-2xl font-semibold">{stats.activeUsers}</p>
                </div>

                <div className="bg-white shadow rounded-2xl p-6">
                    <p className="text-sm text-gray-500">Blocked Users</p>
                    <p className="text-2xl font-semibold">{stats.blockedUsers}</p>
                </div>

                <div className="bg-white shadow rounded-2xl p-6">
                    <p className="text-sm text-gray-500">Total Chats</p>
                    <p className="text-2xl font-semibold">{stats.totalChats}</p>
                </div>

                <div className="bg-white shadow rounded-2xl p-6">
                    <p className="text-sm text-gray-500">Support Tickets</p>
                    <p className="text-2xl font-semibold">{stats.totalReports}</p>
                </div>

                <div className="bg-white shadow rounded-2xl p-6">
                    <p className="text-sm text-gray-500">Open Tickets</p>
                    <p className="text-2xl font-semibold">{stats.openTickets}</p>
                </div>
            </div>

            {/* Future Chart Section */}
            <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4">Trends</h3>
                <div className="bg-white p-6 rounded-2xl shadow text-gray-400 text-sm text-center">
                    Charts coming soon...
                </div>
            </div>
        </div>
    );
}
