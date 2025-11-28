// src/components/ContactSection.jsx
import React, { useState, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import { useUser } from "../context/UserContext";

export default function ContactSection() {
    const { chatList, addChatToList, selectChat } = useChat();
    const { user } = useUser();

    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🧩 Load user's contacts
    useEffect(() => {
        if (!user?.id) return;

        fetch(`http://localhost:8080/contacts/user/${user.id}`)
            .then((res) => res.json())
            .then((data) => setContacts(data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user?.id]);

    // 🔍 Find existing individual/private chat
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

            // Fallback matching
            return (
                (chat.user1Id === user.id && chat.user2Id === contact.contactId) ||
                (chat.user2Id === user.id && chat.user1Id === contact.contactId)
            );
        });
    };

    // 📨 Open or create chat
    const handleOpenChat = async (contact) => {
        if (!user?.id || !contact?.contactId) return;

        try {
            // 1️⃣ Try existing chat
            const existing = findExistingChatWithContact(contact);

            if (existing) {
                selectChat(existing);
                return;
            }

            // 2️⃣ Create new chat
            const chatRequest = {
                createdBy: user.id,
                contactId: contact.contactId
            };

            const res = await fetch("http://localhost:8080/chats/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(chatRequest),
            });

            const newChat = await res.json();

            // 3️⃣ Enrich chat object with contact info for header
            const enrichedChat = {
                ...newChat,
                title: contact.alias || contact.name,           // name
                imgUrl: contact.profilePicture,                 // avatar
                isOnline: contact.isOnline || false,            // online
                participants: [
                    { id: user.id },
                    { id: contact.contactId, name: contact.name, profilePicture: contact.profilePicture }
                ]
            };

            addChatToList(enrichedChat);  // store in chatList
            selectChat(enrichedChat);     // open chat

        } catch (err) {
            console.error("❌ Error creating/opening chat:", err);
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
                            onClick={() => handleOpenChat(c)}
                            className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
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
                                <div className="font-medium">{c.alias || c.name}</div>
                                <div className="text-sm text-gray-500">
                                    {c.phoneNumber}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
