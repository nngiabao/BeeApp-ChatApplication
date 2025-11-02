import React from "react";
import { UserPlus, Users, UsersRound } from "lucide-react";

export default function QuickActions({ onAddGroup, onAddContact }) {
    return (
        <div className="space-y-3 mb-6">
            <div
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                onClick={onAddGroup}
            >
                <Users className="text-green-600" />
                <span className="font-medium">New group</span>
            </div>

            <div
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                onClick={onAddContact}
            >
                <UserPlus className="text-green-600" />
                <span className="font-medium">New contact</span>
            </div>

            <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
                <UsersRound className="text-green-600" />
                <span className="font-medium">New community</span>
            </div>
        </div>
    );
}
