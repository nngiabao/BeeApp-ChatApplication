import React from "react";
import { useContactList } from "../context/ContactContext";

export default function ContactSection() {
    const { contacts, loading, error } = useContactList();

    if (loading) return <p className="text-gray-500">Loading contacts...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    // ✅ Filter out blocked contacts
    const visibleContacts = contacts.filter((contact) => !contact.blocked);

    return (
        <div>
            <h2 className="text-sm text-gray-500 mb-2">Contacts on BeeApp</h2>
            <div className="space-y-1">
                {visibleContacts.length === 0 ? (
                    <p className="text-gray-400 text-sm">No available contacts.</p>
                ) : (
                    visibleContacts.map((contact) => (
                        <div
                            key={contact.id}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                        >
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                                <span className="text-sm font-semibold">
                                    {contact.alias
                                        ? contact.alias.charAt(0).toUpperCase()
                                        : "?"}
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    {contact.alias || "Unnamed Contact"}
                                </p>
                                <p className="text-sm text-gray-500">Available</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
