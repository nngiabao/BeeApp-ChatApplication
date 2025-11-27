import React, { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import { useChat } from "../context/ChatContext";

export default function ChatInfoPanel({ open, onClose, chat }) {
  const { membersByChat, loadGroupMembers , loadChatList } = useChat();
  const [members, setMembers] = useState([]);
  const [renameOpen, setRenameOpen] = useState(false);
  const [newName, setNewName] = useState(chat?.title || "");

  const fileInputRef = useRef(null);

  const avatarUrl =
      chat?.imgUrl ||
      "https://chatapp-beeapp.s3.us-east-2.amazonaws.com/invidual/default-profile.png";

  // Load members
  useEffect(() => {
    if (chat?.type === "GROUP" && chat.id) {
      loadGroupMembers(chat.id);
    }
  }, [chat]);

  useEffect(() => {
    if (chat?.id && membersByChat[chat.id]) {
      setMembers(membersByChat[chat.id]);
    }
  }, [membersByChat, chat]);

  // ✔️ group has an admin (not logged-in user)
  const isAdmin = members.some((m) => m.role === "ADMIN");

  const handleGroupImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert("File too large (20MB limit)");
      return;
    }

    try {
      // 1️⃣ Upload to S3
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "group");

      const res = await fetch("http://localhost:8080/aws/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const imageUrl = await res.text();

      //Update backend group picture
      await fetch(
          `http://localhost:8080/groups/${chat.id}/picture?imgUrl=${encodeURIComponent(
              imageUrl
          )}`,
          { method: "POST" }
      );

      //Update FE chat object so UI updates immediately
      chat.imgUrl = imageUrl;

      //Force this component to rerender (update avatar in panel)
      setMembers([...members]);

      //Refresh sidebar chat list (so sidebar avatar updates)
      if (typeof loadChatList === "function") {
        await loadChatList();
      }

      alert("Group picture updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload image");
    }
  };

  const handleRenameGroup = async () => {
    if (!newName.trim() || newName.length > 30) {
      alert("Name must be 1–30 characters");
      return;
    }

    await fetch(
        `http://localhost:8080/groups/${chat.id}/rename?name=${encodeURIComponent(
            newName
        )}`,
        { method: "POST" }
    );

    chat.title = newName;
    setRenameOpen(false);
  };

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
          <div className="relative">
            <img
                src={avatarUrl}
                alt={chat?.title}
                className={`w-24 h-24 rounded-full mb-3 ${
                    isAdmin ? "cursor-pointer" : ""
                }`}
                onClick={isAdmin ? () => fileInputRef.current.click() : undefined}
            />

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleGroupImageUpload}
            />
          </div>

          {/* Group Name */}
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            {chat?.title}

            {isAdmin && (
                <button onClick={() => setRenameOpen(true)}>
                  <span className="text-gray-600 hover:text-gray-900 text-sm">✎</span>
                </button>
            )}
          </h3>

          <p className="text-sm text-gray-500 mt-1">Group chat</p>
        </div>

        {/* Rename Modal */}
        {renameOpen && (
            <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t shadow-lg">
              <input
                  type="text"
                  value={newName}
                  maxLength={30}
                  className="w-full border rounded-lg p-2"
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter group name"
              />

              <button
                  className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg"
                  onClick={handleRenameGroup}
              >
                Save
              </button>

              <button
                  className="mt-2 w-full text-gray-500"
                  onClick={() => setRenameOpen(false)}
              >
                Cancel
              </button>
            </div>
        )}

        {/* Members list */}
        <div className="px-6 mt-4 overflow-y-auto max-h-[60%]">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">
            Group Members
          </h4>

          {members.length === 0 ? (
              <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                No members found
              </div>
          ) : (
              <div className="space-y-3">
                {members.map((m) => (
                    <div
                        key={m.userId}
                        className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition relative"
                    >
                      <img
                          src={
                              m.profilePicture ||
                              "https://chatapp-beeapp.s3.us-east-2.amazonaws.com/invidual/default-profile.png"
                          }
                          alt={m.name}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                      />

                      {m.role === "ADMIN" && (
                          <span className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-0.5 rounded-full text-[10px]">
                    ADMIN
                  </span>
                      )}

                      <div>
                        <p className="text-gray-800 font-medium text-sm">
                          {m.name || m.username || "Unknown User"}
                        </p>
                        <p className="text-xs text-gray-500">{m.role || "Member"}</p>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
}
