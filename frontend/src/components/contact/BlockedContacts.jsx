import React from "react";
import { useContactList } from "../context/ContactContext";

export default function BlockedContactsSection() {
    const { contacts, loading, error } = useContactList();

    if (loading) return <p className="text-gray-500">Loading blocked contacts...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    // ✅ Only show blocked contacts
    const blockedContacts = contacts.filter((contact) => contact.blocked);

    return (
        <div>
            <h2 className="text-sm text-gray-500 mb-2">Blocked Contacts</h2>
            <div className="space-y-1">
                {blockedContacts.length === 0 ? (
                    <p className="text-gray-400 text-sm">No blocked contacts.</p>
                ) : (
                    blockedContacts.map((contact) => (
                        <div
                            key={contact.id}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                        >
                            {/* Avatar circle */}
                            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white">
                                <span className="text-sm font-semibold">
                                    {contact.alias
                                        ? contact.alias.charAt(0).toUpperCase()
                                        : "?"}
                                </span>
                            </div>

                            {/* Contact info */}
                            <div>
                                <p className="font-medium text-gray-900">
                                    {contact.alias || "Unnamed Contact"}
                                </p>
                                <p className="text-sm text-red-500 font-medium">
                                    Blocked
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
