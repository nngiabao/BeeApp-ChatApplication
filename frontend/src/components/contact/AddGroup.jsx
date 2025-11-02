import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function AddGroupPanel({ onBack }) {
    const { user } = useUser();

    // Example contact list, later you can load from backend
    const contacts = [
        { name: "Ahmed", message: "مرحبًا! أنا استعمل واتساب." },
        { name: "Aly", message: "Ali alghamdi" },
        { name: "Andruey", message: "Hey there! I am using WhatsApp." },
        { name: "Aziz", message: "Urgent calls only" },
        { name: "C Duyen", message: "Hey there! I am using WhatsApp." },
        { name: "Cau Charlie", message: "Hey there! I am using WhatsApp." },
        { name: "Charan", message: "Hey there! I am using WhatsApp." },
        { name: "Chirag CSU, MCS", message: "Hey there! I am using WhatsApp." },
    ];

    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState("");

    const toggleSelect = (name) => {
        setSelected((prev) =>
            prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
        );
    };

    const filteredContacts = contacts.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full h-full bg-white p-4 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
                <button onClick={onBack} className="text-green-600 hover:text-green-700">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-semibold">Add group members</h1>
            </div>

            {/* Search bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search name or number"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-green-500"
                />
            </div>

            {/* Contact List */}
            <div className="space-y-1">
                {filteredContacts.map((contact, index) => (
                    <div
                        key={index}
                        onClick={() => toggleSelect(contact.name)}
                        className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                            selected.includes(contact.name) ? "bg-green-50 border-l-4 border-green-600" : ""
                        }`}
                    >
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white">
              <span className="text-sm font-semibold">
                {contact.name.charAt(0).toUpperCase()}
              </span>
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">{contact.name}</p>
                            <p className="text-sm text-gray-500">{contact.message}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Selected Members */}
            {selected.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex justify-between items-center">
                    <p className="text-sm text-gray-600">Selected: {selected.join(", ")}</p>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}