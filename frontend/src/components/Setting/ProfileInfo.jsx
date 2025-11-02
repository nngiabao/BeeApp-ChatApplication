import React from "react";
import { Pencil, Phone, Copy } from "lucide-react";


export default function ProfileInfo() {
    return (
        <div>
            {/* Name */}
            <div className="mb-6">
                <label className="block text-sm text-gray-500 mb-1">Name</label>
                <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-medium">Bao</span>
                    <Pencil className="w-4 h-4 text-gray-500 cursor-pointer hover:text-green-600" />
                </div>
            </div>


            {/* About */}
            <div className="mb-6">
                <label className="block text-sm text-gray-500 mb-1">About</label>
                <div className="flex justify-between items-center">
                    <span className="text-gray-800 text-sm">Hey there! I am using BeeApp.</span>
                    <Pencil className="w-4 h-4 text-gray-500 cursor-pointer hover:text-green-600" />
                </div>
            </div>


            {/* Phone */}
            <div>
                <label className="block text-sm text-gray-500 mb-1">Phone</label>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-800 font-medium">+1 (651) 230-2637</span>
                    </div>
                    <Copy className="w-4 h-4 text-gray-500 cursor-pointer hover:text-green-600" />
                </div>
            </div>
        </div>
    );
}