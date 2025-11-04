import React from "react";
import { UserPlus, UsersRound } from "lucide-react";

export default function QuickActions({ onAddGroup, onAddContact ,onBlockList}) {
    return (
        <div className="space-y-3 mb-6">
            <div
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                onClick={onAddGroup}
            >
                <UsersRound className="text-green-600"/>
                <span className="font-medium">New group</span>
            </div>

            <div
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                onClick={onAddContact}
            >
                <UserPlus className="text-green-600"/>
                <span className="font-medium">New contact</span>
            </div>
            <div
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                onClick={onBlockList}
            >
                <UserPlus className="text-green-600"/>
                <span className="font-medium">Block list</span>
            </div>
        </div>
    );
}
