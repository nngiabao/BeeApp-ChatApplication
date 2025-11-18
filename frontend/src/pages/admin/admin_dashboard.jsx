import React, { useState } from "react";
import Sidebar from "../../components/admin/Sidebar.jsx";
import Users from "../../components/admin/User_management.jsx";
import Tickets from "../../components/admin/Ticket_management.jsx";
import Analytics from "../../components/admin/Analytics.jsx";
import Setting from "../../components/admin/SettingPanel.jsx";

// Dummy content components
const DashboardOverview = () => (
    <div>
        <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-2xl p-6">Total Users: 1200</div>
            <div className="bg-white shadow rounded-2xl p-6">Active Chats: 856</div>
            <div className="bg-white shadow rounded-2xl p-6">Files Shared: 340</div>
        </div>
    </div>
);


export default function AdminDashboardLayout() {
    const [activePage, setActivePage] = useState("dashboard");

    const renderPage = () => {
        switch (activePage) {
            case "dashboard": return <DashboardOverview />;
            case "users": return <Users />;
            case "tickets": return <Tickets />;
            case "analytics": return <Analytics />;
            case "settings": return <Setting />;
            default: return <DashboardOverview />;
        }
    };

    return (
        <div className="flex h-screen w-full bg-gray-100">
            <Sidebar setActivePage={setActivePage} />
            <main className="flex-1 p-10 overflow-y-auto">
                {renderPage()}
            </main>
        </div>
    );
}
