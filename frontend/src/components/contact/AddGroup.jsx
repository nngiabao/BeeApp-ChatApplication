import React, { useState } from "react";
import { ArrowLeft, X , ArrowRight} from "lucide-react";
import { useUser } from "../context/UserContext";
import { useContactList } from "../context/ContactContext";
import NewGroupPanel from "./AddGroupConfirmation.jsx"; //

export default function AddGroupPanel({ onBack }) {
    const { user } = useUser();
    const { contacts, loading } = useContactList();

    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState("");
    const [step, setStep] = useState(1); // 1 = select members, 2 = group setup

    if (loading) return <p className="text-gray-500">Loading contacts...</p>;

    const toggleSelect = (contact) => {
        setSelected((prev) => {
            if (prev.find((p) => p.id === contact.id)) {
                return prev.filter((p) => p.id !== contact.id);
            }
            return [...prev, contact];
        });
    };

    const removeSelected = (id) => {
        setSelected((prev) => prev.filter((c) => c.id !== id));
    };

    const filteredContacts = contacts.filter((c) =>
        c.alias?.toLowerCase().includes(search.toLowerCase())
    );

    const handleNext = () => {
        if (selected.length > 0) {
            setStep(2);
        }
    };

    const handleCreateGroup = (groupData) => {
        console.log("Creating group:", {
            members: selected,
            ...groupData,
        });
        // 🧩 TODO: Send this data to your backend API to create the group
    };

    // ✅ Step 2: show the new group setup screen
    if (step === 2) {
        return (
            <NewGroupPanel
                onBack={() => setStep(1)}
                onCreate={handleCreateGroup}
            />
        );
    }

    // ✅ Step 1: Select members screen
    return (
        <div className="w-full h-full bg-white p-4 overflow-y-auto flex flex-col">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
                <button
                    onClick={onBack}
                    className="text-green-600 hover:text-green-700"
                >
                    <ArrowLeft className="w-5 h-5"/>
                </button>
                <h1 className="text-lg font-semibold">Add group members</h1>
            </div>

            {/* Selected Chips inside Search Bar */}
            <div
                className="flex flex-wrap items-center border px-3 py-2 mb-4 focus-within:ring-1 focus-within:ring-green-500">
                {selected.map((contact) => (
                    <div
                        key={contact.id}
                        className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full mr-2 mb-1"
                    >
                        <span className="text-sm font-medium">
                            {contact.alias}
                        </span>
                        <X
                            className="w-4 h-4 ml-1 cursor-pointer"
                            onClick={() => removeSelected(contact.id)}
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
                {filteredContacts.map((contact) => (
                    <div
                        key={contact.id}
                        onClick={() => toggleSelect(contact)}
                        className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition ${
                            selected.find((s) => s.id === contact.id)
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
                ))}
            </div>

            {/* Footer (Next button) */}
            {selected.length > 0 && (
                <div
                    className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex justify-end items-center">
                    <button
                        onClick={handleNext}
                        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        <ArrowRight/>
                    </button>
                </div>
            )}

        </div>
    );
}
