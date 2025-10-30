// 📁 src/components/dashboard/AdminDashboard.jsx
import React from 'react';
import DashboardHeader from '../../components/admin/Header';
import StatCard from '../../components/admin/StatCard';
import FeatureCard from '../../components/admin/FeatureCard';


export default function AdminDashboard() {
    const features = [
        { title: 'User Management', desc: 'View, edit, or remove user accounts.' },
        { title: 'Messages', desc: 'Monitor and moderate conversations.' },
        { title: 'Security', desc: 'Manage blocked users and activity.' },
    ];


    return (
        <div className='min-h-screen bg-gray-100 p-6'>
            <DashboardHeader title='Admin Dashboard' onLogout={() => alert('Logged out!')} />


            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                <StatCard value='1,245' label='Active Users' color='text-blue-600' />
                <StatCard value='12,584' label='Messages Sent' color='text-green-600' />
                <StatCard value='52' label='Reports' color='text-yellow-600' />
                <StatCard value='99.9%' label='Server Uptime' color='text-purple-600' />
            </div>


            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {features.map((f, i) => (
                    <FeatureCard key={i} title={f.title} desc={f.desc} icon={<span>⚙️</span>} onManage={() => alert(f.title)} />
                ))}
            </div>
        </div>
    );
}