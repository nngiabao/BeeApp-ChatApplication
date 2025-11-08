import React, { useState } from "react";
import { ArrowLeft, X, ArrowRight } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useContactList } from "../context/ContactContext";
import NewGroupPanel from "./AddGroupConfirmation.jsx"; // confirmation screen

export default function AddGroupPanel({ onBack }) {
    const { user } = useUser();
    const { contacts, loading } = useContactList();

    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState("");
    const [step, setStep] = useState(1); // 1 = select members, 2 = confirmation

    if (loading) return <p className="text-gray-500">Loading contacts...</p>;

    // ✅ Toggle select/deselect contacts
    const toggleSelect = (contact) => {
        setSelected((prev) =>
            prev.find((p) => p.contactId === contact.contactId)
                ? prev.filter((p) => p.contactId !== contact.contactId)
                : [...prev, contact]
        );
    };

    const removeSelected = (contactId) => {
        setSelected((prev) => prev.filter((c) => c.contactId !== contactId));
    };

    const filteredContacts = contacts.filter((c) =>
        c.alias?.toLowerCase().includes(search.toLowerCase())
    );

    const handleNext = () => {
        if (selected.length > 0) setStep(2);
    };

    // ✅ Pass member IDs + group info to backend
    const handleCreateGroup = async (groupData) => {
        const memberIds = [user.id, ...selected.map((m) => m.contactId)]; // ✅ use contactId

        const requestBody = {
            groupName: groupData.groupName,
            createdBy: user.id,
            memberIds,
        };

        try {
            const res = await fetch("http://localhost:8080/chats/group", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (!res.ok) throw new Error("Failed to create group");
            const data = await res.json();

            console.log("✅ Group created:", data);
            alert("Group created successfully!");
            onBack(); // go back or refresh list
        } catch (err) {
            console.error("❌ Error creating group:", err);
            alert("Error creating group.");
        }
    };

    // ✅ Step 2: show confirmation screen
    if (step === 2) {
        return (
            <NewGroupPanel
                onBack={() => setStep(1)}
                onCreated={handleCreateGroup}
                members={selected} // pass selected contacts
            />
        );
    }

    // ✅ Step 1: select contacts
    return (
        <div className="w-full h-full bg-white p-4 overflow-y-auto flex flex-col">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
                <button
                    onClick={onBack}
                    className="text-green-600 hover:text-green-700"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-semibold">Add group members</h1>
            </div>

            {/* Selected Chips */}
            <div className="flex flex-wrap items-center border px-3 py-2 mb-4 focus-within:ring-1 focus-within:ring-green-500">
                {selected.map((contact) => (
                    <div
                        key={contact.contactId}
                        className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full mr-2 mb-1"
                    >
                        <span className="text-sm font-medium">{contact.alias}</span>
                        <X
                            className="w-4 h-4 ml-1 cursor-pointer"
                            onClick={() => removeSelected(contact.contactId)} // ✅ fix
                        />
                    </div>
                ))}
                <input
                    type="text"
                    placeholder="Search name or number"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 outline-none bg-transparent min-w-[150px]"
                />
            </div>

            {/* Contact List */}
            <div className="space-y-1">
                {filteredContacts.map((contact) => {
                    const isSelected = selected.some(
                        (s) => s.contactId === contact.contactId
                    );

                    return (
                        <div
                            key={contact.contactId}
                            onClick={() => toggleSelect(contact)}
                            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition ${
                                isSelected
                                    ? "bg-green-50 border-l-4 border-green-600"
                                    : ""
                            }`}
                        >
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white">
                                <span className="text-sm font-semibold">
                                    {contact.alias?.charAt(0).toUpperCase() || "?"}
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                    {contact.alias}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {contact.status ||
                                        "Hey there! I’m using BeeApp."}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            {selected.length > 0 && (
                <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex justify-end items-center">
                    <button
                        onClick={handleNext}
                        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        <ArrowRight />
                    </button>
                </div>
            )}
        </div>
    );
}
