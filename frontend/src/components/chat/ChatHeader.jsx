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
import ChatInfoPanel from "./ChatInfoPanel.jsx"; // chat info panel

export default function ChatHeader() {
    const { currentChat } = useChat();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showInfo, setShowInfo] = useState(false); // 👈 toggle info panel
    const menuRef = useRef(null);

    if (!currentChat) return null;

    const avatarUrl =
        currentChat.imgUrl ||
        "https://chatapp-beeapp.s3.us-east-2.amazonaws.com/invidual/default-profile.png";

    const isGroup = currentChat.type === "GROUP";

    // close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <div className="flex items-center justify-between p-4 bg-[#f0f2f5] border-b border-gray-300 relative">
                <div className="flex items-center space-x-3">
                    <img src={avatarUrl} alt={currentChat.title} className="w-10 h-10 rounded-full" />
                    <div>
                        <h2 className="font-semibold text-gray-800">{currentChat.title}</h2>
                        <p className="text-xs text-gray-500">
                            {currentChat.isOnline ? "Online" : "Last seen recently"}
                        </p>
                    </div>
                </div>

                <div className="relative" ref={menuRef}>
                    <MoreVertical
                        className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800"
                        onClick={() => setMenuOpen((prev) => !prev)}
                    />

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden animate-fadeIn">
                            {isGroup ? (
                                <>
                                    <button
                                        onClick={() => {
                                            setShowInfo(true);
                                            setMenuOpen(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <Info className="w-4 h-4 mr-2" /> Group info
                                    </button>
                                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <BellOff className="w-4 h-4 mr-2" /> Mute notifications
                                    </button>
                                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <XCircle className="w-4 h-4 mr-2" /> Clear chat
                                    </button>
                                    <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-200">
                                        <LogOut className="w-4 h-4 mr-2" /> Exit group
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            setShowInfo(true);
                                            setMenuOpen(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <Info className="w-4 h-4 mr-2" /> View contact
                                    </button>
                                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <Star className="w-4 h-4 mr-2" /> Add to favorites
                                    </button>
                                    <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-200">
                                        <UserX className="w-4 h-4 mr-2" /> Block contact
                                    </button>
                                    <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete chat
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* 👇 Slide-in Info Panel */}
            <ChatInfoPanel open={showInfo} onClose={() => setShowInfo(false)} chat={currentChat} />
        </>
    );
}
