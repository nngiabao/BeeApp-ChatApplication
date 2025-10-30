//src/components/dashboard/StatCard.jsx
import React from 'react';
import { Card, CardContent } from './Card';
export default function StatCard({ value, label, color }) {
    return (
        <Card className='shadow-md'>
            <CardContent className='text-center'>
                <h2 className={`text-2xl font-bold ${color}`}>{value}</h2>
                <p className='text-gray-500'>{label}</p>
            </CardContent>
        </Card>
    );
}