import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { useContactList } from "../context/ContactContext"; // ✅ import context
import { UserPlus, ArrowLeft } from "lucide-react";
import axios from "axios";

export default function AddContactPanel({ onBack }) {
    const { user } = useUser();
    const { addContact } = useContactList(); // ✅ get addContact from context

    const [contact, setContact] = useState({ name: "", lookUp: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setContact({ ...contact, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:8080/contacts/add`, {
                userId: user.id, // from context
                lookupValue: contact.lookUp,
                alias: contact.name
            });

            console.log("Response:", res.data);

            // ✅ If backend sends new contact in response, add it to global context
            if (res.data && res.data.data) {
                addContact(res.data.data); // assumes your backend wraps it in { message, data: { ... } }
            } else if (res.data && res.data.id) {
                addContact(res.data); // if backend returns raw contact
            }

            setMessage("✅ Contact added successfully!");
            setContact({ name: "", lookUp: "" });
        } catch (error) {
            console.error("Error adding contact:", error);
            setMessage("❌ Failed to add contact. Try again.");
        }
    };

    return (
        <div className="p-6 bg-white h-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <ArrowLeft
                    onClick={onBack}
                    className="w-5 h-5 text-gray-600 cursor-pointer hover:text-green-600"
                />
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <UserPlus className="text-green-600" /> Add New Contact
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Contact Name"
                    value={contact.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                />

                <input
                    type="text"
                    name="lookUp"
                    placeholder="Contact Phone or Username"
                    value={contact.lookUp}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all"
                >
                    Add Contact
                </button>
            </form>

            {message && (
                <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
            )}
        </div>
    );
}
