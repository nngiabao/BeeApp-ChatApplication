import React, { createContext, useState, useContext } from "react";

// Create the context
const UserContext = createContext();

// Provider component
export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

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
                profilePicture: user.profilePicture,
                isOnline: user.isOnline,
                accountType: user.accountType,
            };
            //
            const res = await fetch(`http://localhost:8080/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok && data.data) {
                setUser(data.data); // ✅ update local user context
                console.log("✅ User updated:", data.data);
            } else {
                console.error("❌ Update failed:", data.message);
                alert(data.message || "Failed to update user");
            }
        } catch (err) {
            console.error("❌ Error updating user:", err);
            alert("Server error while updating user");
        }
    };

    //Change password separately
    const changePassword = async (oldPassword, newPassword) => {
        if (!user || !user.id) return;

        try {
            const payload = {
                ...user,
                password: newPassword,
            };

            const res = await fetch(`http://localhost:8080/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Password updated successfully!");
            } else {
                alert(data.message || "Password update failed");
            }
        } catch (err) {
            console.error("❌ Error updating password:", err);
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
