import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "./UserContext";

const ContactListContext = createContext();

// ✅ Provider Component
export function ContactListProvider({ children }) {
    const { user } = useUser();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        if (!user || hasFetched) return;

        const fetchContacts = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:8080/contacts/user/${user.id}`);
                const list = Array.isArray(res.data.data) ? res.data.data : [];
                setContacts(list);
                setError(null);
                setHasFetched(true);
                localStorage.setItem("contacts", JSON.stringify(list));
            } catch (err) {
                console.error("Error fetching contacts:", err);
                setError("Failed to load contacts.");
            } finally {
                setLoading(false);
            }
        };

        const cached = localStorage.getItem("contacts");
        if (cached) {
            setContacts(JSON.parse(cached));
            setHasFetched(true);
        } else {
            fetchContacts();
        }
    }, [user, hasFetched]);

    const addContact = (contact) => {
        setContacts((prev) => {
            const updated = [...prev, contact];
            localStorage.setItem("contacts", JSON.stringify(updated));
            return updated;
        });
    };

    const removeContact = (id) => {
        setContacts((prev) => {
            const updated = prev.filter((c) => c.id !== id);
            localStorage.setItem("contacts", JSON.stringify(updated));
            return updated;
        });
    };

    const value = { contacts, loading, error, addContact, removeContact };

    return (
        <ContactListContext.Provider value={value}>
            {children}
        </ContactListContext.Provider>
    );
}

// ✅ Custom hook to use this context easily
export function useContactList() {
    const context = useContext(ContactListContext);
    if (!context) throw new Error("useContactList must be used within a ContactListProvider");
    return context;
}
