import React, { useState } from "react";
import { useContactList } from "../context/ContactContext";
import { ArrowLeft, Unlock } from "lucide-react";
import axios from "axios";

export default function BlockedContactsSection({ onBack }) {
    const { contacts, loading, error, removeContact } = useContactList();
    const [confirmUnblock, setConfirmUnblock] = useState(null);

    if (loading) return <p className="text-gray-500">Loading blocked contacts...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    //Only show blocked contacts
    const blockedContacts = contacts.filter(
        (contact) => contact.blocked || contact.isBlocked
    );

    //Handle unblock confirmation
    const handleUnblock = (contact) => {
        setConfirmUnblock(contact); // show popup
    };

    const confirmUnblockAction = async () => {
        if (confirmUnblock) {
            //Call backend endpoint to unblock
            await axios.put(`${import.meta.env.VITE_API_URL}/contacts/unblock/${confirmUnblock.id}`);
            removeContact(confirmUnblock.id); // or update contact.blocked=false if you prefer keeping it
            setConfirmUnblock(null);
        }
    };

    return (
        <div className="p-4 relative">
            {/* 🔙 Header with back button */}
            <div className="flex items-center gap-3 mb-4">
                <ArrowLeft
                    onClick={onBack}
                    className="w-5 h-5 text-gray-600 cursor-pointer hover:text-green-600"
                />
                <h2 className="text-lg font-semibold">Blocked Contacts</h2>
            </div>

            {/* 🚫 Blocked list */}
            <div className="space-y-2">
                {blockedContacts.length === 0 ? (
                    <p className="text-gray-400 text-sm">No blocked contacts.</p>
                ) : (
                    blockedContacts.map((contact) => (
                        <div
                            key={contact.id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition"
                        >
                            <div className="flex items-center space-x-3">
                                {/* Avatar */}
                                <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white">
                  <span className="text-sm font-semibold">
                    {contact.alias
                        ? contact.alias.charAt(0).toUpperCase()
                        : "?"}
                  </span>
                                </div>

                                {/* Info */}
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {contact.alias || "Unnamed Contact"}
                                    </p>
                                    <p className="text-sm text-red-500 font-medium">
                                        Blocked
                                    </p>
                                </div>
                            </div>

                            {/* 🔓 Unblock Button */}
                            <button
                                onClick={() => handleUnblock(contact)}
                                className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
                            >
                                <Unlock className="w-4 h-4" />
                                Unblock
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* ⚠️ Confirmation popup */}
            {confirmUnblock && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h3 className="text-lg font-semibold mb-3 text-gray-900">
                            Unblock {confirmUnblock.alias || "this user"}?
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            They will be able to message and call you again.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmUnblock(null)}
                                className="px-4 py-1 border rounded-lg text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmUnblockAction}
                                className="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
