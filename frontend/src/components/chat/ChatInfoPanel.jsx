import React from "react";
import { X } from "lucide-react";

export default function ChatInfoPanel({ open, onClose, chat }) {
  const avatarUrl =
    chat?.imgUrl ||
    "https://chatapp-beeapp.s3.us-east-2.amazonaws.com/invidual/default-profile.png";

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg border-l border-gray-200 z-50 transform transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-800">
          {chat?.type === "GROUP" ? "Group Info" : "Contact Info"}
        </h2>
        <button onClick={onClose}>
          <X className="w-5 h-5 text-gray-600 hover:text-gray-800" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center p-6">
        <img src={avatarUrl} alt={chat?.title} className="w-24 h-24 rounded-full mb-3" />
        <h3 className="text-lg font-semibold text-gray-800">{chat?.title}</h3>
        {chat?.type === "GROUP" ? (
          <p className="text-sm text-gray-500 mt-1">Group chat</p>
        ) : (
          <p className="text-sm text-gray-500 mt-1">Last seen recently</p>
        )}
      </div>

      {/* Media, Links, Docs (Placeholder) */}
      <div className="px-6 mt-4">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">Media, links and docs</h4>
        <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
          No media yet
        </div>
      </div>
    </div>
  );
}
