// src/components/contacts/ContactSection.jsx
import React, { useState, useRef, useEffect } from "react";
import { useContactList } from "../context/ContactContext";
import { useChat } from "../context/ChatContext";
import { useUser } from "../context/UserContext";
import { UserX, Trash2, MessageCircle, Ban, Star } from "lucide-react";

export default function ContactSection() {
    const { contacts, loading, error } = useContactList();
    const { chatList, selectChat, setChatList } = useChat();
    const { user } = useUser();

    const [menuPos, setMenuPos] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const menuRef = useRef();

    // 🧩 Close context menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuPos(null);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    if (loading) return <p className="text-gray-500">Loading contacts...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const visibleContacts = contacts.filter((contact) => !contact.blocked);

    // 🧩 Right-click context menu
    const handleContextMenu = (e, contact) => {
        e.preventDefault();
        setSelectedContact(contact);
        setMenuPos({ x: e.clientX, y: e.clientY });
    };

    const handleAction = (action) => {
        console.log(`👉 ${action} on contact:`, selectedContact);
        setMenuPos(null);
    };

    // 🧠 Open or create private chat
    const handleOpenChat = async (contact) => {
        try {
            // 1️⃣ Check if chat already exists locally
            const existingChat = chatList.find(
                (chat) =>
                    chat.type === "PRIVATE" &&
                    chat.members?.some((m) => m.userId === contact.contactId)
            );

            if (existingChat) {
                const finalChat = {
                    ...existingChat,
                    imgUrl: contact.profilePicture,  // pass img url
                };
                selectChat(finalChat);
                return;
            }

            // 2️⃣ Otherwise create a new chat
            const body = {
                title: contact.alias || contact.contactName,
                createdBy: user.id,
                contactId: contact.contactId,
            };

            const res = await fetch("http://localhost:8080/chats/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error("Failed to create chat");

            const chat = await res.json();
            const finalChat = {
                ...chat,
                imgUrl: contact.profilePicture,   //
                alias: contact.alias,
                contactId: contact.contactId,
            };

            setChatList((prev) => [...prev, finalChat]);
            selectChat(finalChat);
        } catch (err) {
            console.error("❌ Failed to open or create chat:", err);
        }
    };

    return (
        <div className="relative">
            <h2 className="text-sm text-gray-500 mb-2">Contacts on BeeApp</h2>

            <div className="space-y-1">
                {visibleContacts.length === 0 ? (
                    <p className="text-gray-400 text-sm">No available contacts.</p>
                ) : (
                    visibleContacts.map((contact) => (
                        <div
                            key={contact.id}
                            onClick={() => handleOpenChat(contact)} // 👈 Left click opens chat
                            onContextMenu={(e) => handleContextMenu(e, contact)}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                        >
                            {/* Avatar */}
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center overflow-hidden text-white">
                                {contact.profilePicture ? (
                                    <img
                                        src={contact.profilePicture}
                                        alt={contact.alias || "User"}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm font-semibold">
                                        {contact.alias
                                            ? contact.alias.charAt(0).toUpperCase()
                                            : "?"}
                                    </span>
                                )}
                            </div>

                            {/* Info */}
                            <div>
                                <p className="font-medium text-gray-900">
                                    {contact.alias || "Unnamed Contact"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {contact.statusMessage || "Available"}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Context Menu */}
            {menuPos && (
                <div
                    ref={menuRef}
                    className="fixed bg-white border border-gray-200 rounded-xl shadow-lg w-48 py-2 z-50"
                    style={{ top: menuPos.y, left: menuPos.x }}
                >
                    <button
                        onClick={() => handleAction("message")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        <MessageCircle className="w-4 h-4 mr-2" /> Message
                    </button>
                    <button
                        onClick={() => handleAction("favorite")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        <Star className="w-4 h-4 mr-2" /> Add to favorites
                    </button>
                    <button
                        onClick={() => handleAction("block")}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                        <Ban className="w-4 h-4 mr-2" /> Block contact
                    </button>
                    <button
                        onClick={() => handleAction("remove")}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                        <UserX className="w-4 h-4 mr-2" /> Remove contact
                    </button>
                    <button
                        onClick={() => handleAction("delete")}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete chat
                    </button>
                </div>
            )}
        </div>
    );
}
