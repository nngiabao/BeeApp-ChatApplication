import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const UserContext = createContext();

// Provider component
export function UserProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    // Save to localStorage on user change
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    //Update user info (name, phone, etc.)
    const updateUser = async (updatedFields) => {
        if (!user || !user.id) return;

        try {
            //Make sure all required fields are sent
            const payload = {
                username: user.username,
                phoneNumber: updatedFields.phoneNumber || user.phoneNumber,
                name: updatedFields.name ?? user.name,
                statusMessage: updatedFields.statusMessage ?? user.statusMessage,
                profilePicture: updatedFields.profilePicture,
                isOnline: user.isOnline,
                accountType: user.accountType,
            };
            const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok && data.data) {
                setUser(data.data); //update local user context

            } else {
                alert(data.message || "Failed to update user");
            }
        } catch (err) {
            alert("Server error while updating user");
        }
    };

    const changePassword = async (oldPassword, newPassword) => {
        if (!user || !user.id) return;

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/users/${user.id}/password?oldpass=${oldPassword}&newpass=${newPassword}`,
                { method: "PUT" }
            );

            const data = await res.json();
            if (res.ok) {
                alert(data.message || "Password updated successfully!");
            } else {
                alert(data.message || "Failed to change password");
            }
        } catch (err) {
            console.error(" Error changing password:", err);
            alert("Server error while changing password");
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, updateUser, changePassword }}>
            {children}
        </UserContext.Provider>
    );
}

// Custom hook for easy access to context
export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
