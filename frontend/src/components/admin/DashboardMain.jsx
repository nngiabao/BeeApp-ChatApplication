import React, { useEffect, useState } from "react";
import mainpage from "../../assets/mainpage.png"; // <-- import your image

export default function DashboardOverview() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        sharedFiles: 0,
    });

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/admin/overview`)
            .then(res => res.json())
            .then(data => {
                setStats({
                    totalUsers: data.totalUsers || 0,
                    totalChats: data.totalChats || 0,
                    sharedFiles: data.sharedFiles || 0,
                });
            })
            .catch(console.error);
    }, []);

    return (
        <div className="flex flex-col h-full w-full">

            {/* Stats Section (Top) */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    <div className="bg-white shadow rounded-2xl p-6">
                        <h3 className="text-lg font-semibold">Total Users</h3>
                        <p className="text-3xl">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-white shadow rounded-2xl p-6">
                        <h3 className="text-lg font-semibold">Total Conversations</h3>
                        <p className="text-3xl">{stats.totalChats}</p>
                    </div>
                    <div className="bg-white shadow rounded-2xl p-6">
                        <h3 className="text-lg font-semibold">Files Shared</h3>
                        <p className="text-3xl">{stats.sharedFiles}</p>
                    </div>
                </div>
            </div>

            {/* Background Image Section (Bottom, fills rest) */}
            <div
                className="flex-1 rounded-2xl overflow-hidden shadow-lg bg-cover bg-center"
                style={{
                    backgroundImage: `url(${mainpage})`,
                }}
            >

            </div>
        </div>
    );
}
