// src/components/dashboard/Button.jsx
import React from 'react';
export default function Button({ children, onClick, className }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium ${className}`}
        >
            {children}
        </button>
    );
}