import React, { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import { useChat } from "../context/ChatContext";
import { useUser } from "../context/UserContext";

export default function ChatInfoPanel({ open, onClose, chat }) {
  const { user } = useUser();
  const { membersByChat, loadGroupMembers, loadChatList } = useChat();

  const [members, setMembers] = useState([]);
  const [renameOpen, setRenameOpen] = useState(false);
  const [newName, setNewName] = useState(chat?.title || "");

  const fileInputRef = useRef(null);

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

  // 🔥 Correct admin check
  const isAdmin = members.some(
      (m) => m.userId === user?.id && m.role === "ADMIN"
  );

  const avatarUrl =
      chat?.imgUrl ||
      "https://chatapp-beeapp.s3.us-east-2.amazonaws.com/invidual/default-profile.png";

  // --------------------
  // CHANGE GROUP IMAGE
  // --------------------
  const handleGroupImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert("File too large (20MB limit)");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "group");

      const res = await fetch("http://localhost:8080/aws/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const imageUrl = await res.text();

      await fetch(
          `http://localhost:8080/groups/${chat.id}/picture?imgUrl=${encodeURIComponent(
              imageUrl
          )}`,
          { method: "POST" }
      );

      chat.imgUrl = imageUrl;
      setMembers([...members]);

      if (typeof loadChatList === "function") {
        await loadChatList();
      }

      alert("Group picture updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload image");
    }
  };

  // --------------------
  // RENAME GROUP
  // --------------------
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

    if (typeof loadChatList === "function") {
      await loadChatList();
    }
  };

  // --------------------
  // REMOVE MEMBER
  // --------------------
  const removeMember = async (userId) => {
    try {
      await fetch(
          `http://localhost:8080/groups/remove/${chat.id}/${userId}`,
          { method: "DELETE" }
      );

      loadGroupMembers(chat.id);
    } catch (err) {
      console.error("Failed to remove member:", err);
    }
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

            {isAdmin && (
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleGroupImageUpload}
                />
            )}
          </div>

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

        {/* Admin Buttons */}
        {isAdmin && (
            <div className="px-6 mb-3 flex flex-col gap-2">
              <button
                  className="w-full bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
                  onClick={() => fileInputRef.current.click()}
              >
                Change Group Picture
              </button>

              <button
                  className="w-full bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
                  onClick={() => setRenameOpen(true)}
              >
                Change Group Name
              </button>

              <button
                  className="w-full bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
                  onClick={() => alert("Add member feature coming next")}
              >
                Add Member
              </button>
            </div>
        )}

        {/* Members */}
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

                      {/* Remove member button - only admin and not self */}
                      {isAdmin && m.userId !== user.id && (
                          <button
                              className="absolute right-3 text-red-500 text-xs"
                              onClick={() => removeMember(m.userId)}
                          >
                            Remove
                          </button>
                      )}
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
}
