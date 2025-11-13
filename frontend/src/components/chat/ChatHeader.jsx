import React, { useState, useRef, useEffect } from "react";
import {
    MoreVertical,
    Info,
    Star,
    BellOff,
    XCircle,
    LogOut,
    UserX,
    Trash2,
} from "lucide-react";
import { useChat } from "../context/ChatContext";

export default function ChatHeader() {
    const { currentChat } = useChat();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    if (!currentChat) return null;

    const avatarUrl = currentChat.imgUrl
        ? currentChat.imgUrl
        : `https://chatapp-beeapp.s3.us-east-2.amazonaws.com/invidual/default-profile.png`;

    // 🧩 Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isGroup = currentChat.type === "GROUP";

    return (
        <div className="flex items-center justify-between p-4 bg-[#f0f2f5] border-b border-gray-300 relative">
            {/* Chat info */}
            <div className="flex items-center space-x-3">
                <img
                    src={avatarUrl}
                    alt={currentChat.title}
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <h2 className="font-semibold text-gray-800">{currentChat.title}</h2>
                    <p className="text-xs text-gray-500">
                        {currentChat.isOnline ? "Online" : "Last seen recently"}
                    </p>
                </div>
            </div>

            {/* Menu button */}
            <div className="relative" ref={menuRef}>
                <MoreVertical
                    className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800"
                    onClick={() => setMenuOpen((prev) => !prev)}
                />

                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden animate-fadeIn">
                        {isGroup ? (
                            <>
                                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <Info className="w-4 h-4 mr-2" /> Group info
                                </button>
                                <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-200">
                                    <LogOut className="w-4 h-4 mr-2" /> Exit group
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <Info className="w-4 h-4 mr-2"/> View contact
                                </button>
                                <button
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <Info className="w-4 h-4 mr-2"/> Block contact
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
