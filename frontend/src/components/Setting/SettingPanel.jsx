
import React from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";


export default function SettingsPanel() {
    return (
        <div className="w-full h-full bg-white p-6 overflow-y-auto">
            <ProfileHeader />
            <ProfileInfo />
        </div>
    );
}