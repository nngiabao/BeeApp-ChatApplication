// src/components/ContactSection.jsx
import React, { useState, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import { useUser } from "../context/UserContext";
import { Ban, Check } from "lucide-react";

export default function ContactSection() {
    const { chatList, addChatToList, selectChat } = useChat();
    const { user } = useUser();

    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load user's contacts
    useEffect(() => {
        if (!user?.id) return;

        fetch(`${import.meta.env.VITE_API_URL}/contacts/user/${user.id}`)
            .then((res) => res.json())
            .then((data) => setContacts(data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user?.id]);

    //Block or Unblock contact
    const toggleBlock = async (contact) => {
        try {
            const endpoint = contact.blocked
                ? `${import.meta.env.VITE_API_URL}/contacts/unblock/${contact.id}`
                : `${import.meta.env.VITE_API_URL}/contacts/block/${contact.id}`;

            const res = await fetch(endpoint, { method: "PUT" });
            if (!res.ok) {
                console.error("Block/Unblock failed:", res.status);
                return;
            }

            // Update UI without refreshing
            setContacts((prev) =>
                prev.map((c) =>
                    c.id === contact.id ? { ...c, blocked: !c.blocked } : c
                )
            );
        } catch (err) {
            console.error(" Error blocking/unblocking:", err);
        }
    };

    //Find existing chat
    const findExistingChatWithContact = (contact) => {
        if (!Array.isArray(chatList)) return null;

        return chatList.find((chat) => {
            if (chat.type !== "PRIVATE" && chat.type !== "INDIVIDUAL") return false;

            if (Array.isArray(chat.participants)) {
                return (
                    chat.participants.some((p) => p.id === user.id) &&
                    chat.participants.some((p) => p.id === contact.contactId)
                );
            }

            return (
                (chat.user1Id === user.id && chat.user2Id === contact.contactId) ||
                (chat.user2Id === user.id && chat.user1Id === contact.contactId)
            );
        });
    };

    // Open chat (disabled if blocked)
    const handleOpenChat = async (contact) => {
        if (contact.blocked) return; //Do not open chat with blocked users
        if (!user?.id || !contact?.contactId) return;

        try {
            const existing = findExistingChatWithContact(contact);

            if (existing) {
                selectChat(existing);
                return;
            }

            const chatRequest = {
                createdBy: user.id,
                contactId: contact.contactId,
            };

            const res = await fetch(`${import.meta.env.VITE_API_URL}/chats/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(chatRequest),
            });

            const newChat = await res.json();

            const enrichedChat = {
                ...newChat,
                title: contact.alias || contact.name,
                imgUrl: contact.profilePicture,
                isOnline: contact.isOnline || false,
                participants: [
                    { id: user.id },
                    { id: contact.contactId, name: contact.name, profilePicture: contact.profilePicture },
                ],
            };

            addChatToList(enrichedChat);
            selectChat(enrichedChat);
        } catch (err) {
            console.error("Error creating/opening chat:");
        }
    };

    if (loading) return <div className="p-4">Loading contacts...</div>;

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-3">Contacts</h2>

            <div className="space-y-2">
                {contacts.length === 0 ? (
                    <div className="text-gray-500">No contacts found.</div>
                ) : (
                    contacts.map((c) => (
                        <div
                            key={c.id}
                            className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                        >
                            {/* LEFT AREA (avatar + name) */}
                            <div
                                className={`flex items-center cursor-pointer ${
                                    c.blocked ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                                onClick={() => handleOpenChat(c)}
                            >
                                <img
                                    src={
                                        c.profilePicture ||
                                        "https://chatapp-beeapp.s3.us-east-2.amazonaws.com/invidual/default-profile.png"
                                    }
                                    alt="avatar"
                                    className="w-10 h-10 rounded-full object-cover"
                                />

                                <div className="ml-3">
                                    <div className="font-medium">
                                        {c.alias || c.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {c.phoneNumber}
                                    </div>
                                    {c.blocked && (
                                        <span className="text-xs text-red-600 font-medium">
                                            Blocked
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT AREA (block/unblock button) */}
                            <button
                                onClick={() => toggleBlock(c)}
                                className={`p-2 rounded-full ${
                                    c.blocked
                                        ? "bg-green-100 hover:bg-green-200"
                                        : "bg-red-100 hover:bg-red-200"
                                }`}
                            >
                                {c.blocked ? (
                                    <Check className="w-4 h-4 text-green-700" />
                                ) : (
                                    <Ban className="w-4 h-4 text-red-700" />
                                )}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
