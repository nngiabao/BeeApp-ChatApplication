import React from "react";
import {Image} from "lucide-react";


export default function ProfileHeader() {
    return (
        <div>
            <h1 className="text-lg font-semibold mb-6">Profile</h1>
            <div className="flex flex-col items-center mb-8">
                <div
                    className="relative w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {/* Image icon */}
                    <Image className="w-8 h-8 text-gray-700"/>
                    {/* Adjusted text to fit nicely inside circle */}
                    <span
                        className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-[10px] text-white bg-black/60 px-2 py-0.5 rounded-full whitespace-nowrap">
Add profile photo
</span>
                </div>
            </div>
        </div>
    );
}