// src/components/dashboard/FeatureCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './Card';
import Button from './Button';
export default function FeatureCard({ icon, title, desc, onManage }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className='hover:shadow-lg transition-shadow'>
                <CardContent className='flex flex-col items-center text-center p-6'>
                    <div className='mb-3'>{icon}</div>
                    <h3 className='font-semibold text-lg mb-2'>{title}</h3>
                    <p className='text-gray-500 mb-4'>{desc}</p>
                    <Button onClick={onManage}>Manage</Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}