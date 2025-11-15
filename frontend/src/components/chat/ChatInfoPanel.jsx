import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useChat } from "../context/ChatContext";

export default function ChatInfoPanel({ open, onClose, chat }) {
  const { membersByChat, loadGroupMembers } = useChat();
  const [members, setMembers] = useState([]);

  const avatarUrl =
      chat?.imgUrl ||
      "https://chatapp-beeapp.s3.us-east-2.amazonaws.com/invidual/default-profile.png";

  // 🧩 Load members if it's a group chat
  useEffect(() => {
    if (chat?.type === "GROUP" && chat.id) {
      loadGroupMembers(chat.id);
    }
  }, [chat]);

  // 🧩 Update members from context when loaded
  useEffect(() => {
    if (chat?.id && membersByChat[chat.id]) {
      setMembers(membersByChat[chat.id]);
    }
  }, [membersByChat, chat]);

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

        {/* Profile Section */}
        <div className="flex flex-col items-center p-6">
          <img
              src={avatarUrl}
              alt={chat?.title}
              className="w-24 h-24 rounded-full mb-3"
          />
          <h3 className="text-lg font-semibold text-gray-800">{chat?.title}</h3>
          {chat?.type === "GROUP" ? (
              <p className="text-sm text-gray-500 mt-1">Group chat</p>
          ) : (
              <p className="text-sm text-gray-500 mt-1">Last seen recently</p>
          )}
        </div>

        {/* 👇 Replace old media section with member list */}
        <div className="px-6 mt-4 overflow-y-auto max-h-[60%]">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">
            {chat?.type === "GROUP" ? "Group Members" : "Contact"}
          </h4>

          {chat?.type === "GROUP" ? (
              members.length === 0 ? (
                  <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                    No members found
                  </div>
              ) : (
                  <div className="space-y-3">
                    {members.map((m) => (
                        <div
                            key={m.userId}
                            className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition"
                        >
                          <img
                              src={
                                  m.profilePicture ||
                                  "https://chatapp-beeapp.s3.us-east-2.amazonaws.com/invidual/default-profile.png"
                              }
                              alt={m.name}
                              className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <p className="text-gray-800 font-medium text-sm">
                              {m.name || "Unknown User"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {m.role || "Member"}
                            </p>
                          </div>
                        </div>
                    ))}
                  </div>
              )
          ) : (
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition">
                <img
                    src={avatarUrl}
                    alt={chat?.title}
                    className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="text-gray-800 font-medium text-sm">{chat?.title}</p>
                  <p className="text-xs text-gray-500">Contact</p>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}
