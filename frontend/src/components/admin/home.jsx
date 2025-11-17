// pages/DashboardHome.jsx
import React from "react";
export default function DashboardHome() {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="bg-white shadow rounded-2xl p-6">Total Users: 1200</div>
                <div className="bg-white shadow rounded-2xl p-6">Active Chats: 856</div>
                <div className="bg-white shadow rounded-2xl p-6">Files Shared: 340</div>
            </div>
        </div>
    );
}