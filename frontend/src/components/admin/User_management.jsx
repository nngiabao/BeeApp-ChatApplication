// pages/UserManagement.jsx
import React, { useEffect, useState } from "react";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, user: null });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await fetch("http://localhost:8080/users");
        const data = await res.json();
        setUsers(data.data);
    };

    const handleSearch = (e) => setSearch(e.target.value);

    const handleToggleOnline = async (user) => {
        const body = JSON.stringify({ username: user.username });
        await fetch(`http://localhost:8080/users/${user.isOnline ? "logout" : "login"}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
        });
        fetchUsers();
    };

    const filteredUsers = users
        .filter((u) => u.accountType === "USER") //
        .filter(
            (u) =>
                u.name?.toLowerCase().includes(search.toLowerCase()) ||
                u.phoneNumber.includes(search)
        );

    const handleContextMenu = (e, user) => {
        e.preventDefault();
        setContextMenu({ visible: true, x: e.pageX, y: e.pageY, user });
    };

    const handleEditUser = () => {
        setEditForm({ ...contextMenu.user });
        setSelectedUser(contextMenu.user);
        setContextMenu({ ...contextMenu, visible: false });
    };

    const handleDeleteUser = async () => {
        await fetch(`http://localhost:8080/users/${contextMenu.user.id}`, { method: "DELETE" });
        fetchUsers();
        setContextMenu({ ...contextMenu, visible: false });
    };

    const handleUpdateUser = async () => {
        await fetch(`http://localhost:8080/users/${selectedUser.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editForm),
        });
        setSelectedUser(null);
        fetchUsers();
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">User Management</h2>

            <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search by name or phone"
                className="mb-4 border p-2 rounded w-full"
            />

            <div className="bg-white shadow rounded-2xl p-6">
                <table className="w-full">
                    <thead>
                    <tr className="text-left border-b">
                        <th className="py-2">UserName</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Online</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.map((user) => (
                        <tr
                            key={user.id}
                            onContextMenu={(e) => handleContextMenu(e, user)}
                            className="border-b hover:bg-gray-100 cursor-pointer"
                        >
                            <td className="py-2">{user.username}</td>
                            <td >{user.name}</td>
                            <td>{user.phoneNumber}</td>
                            <td>
                                <button
                                    onClick={() => handleToggleOnline(user)}
                                    className={`px-2 py-1 rounded text-white text-sm ${
                                        user.isOnline ? "bg-green-500" : "bg-gray-400"
                                    }`}
                                >
                                    {user.isOnline ? "Online" : "Offline"}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Right-click menu */}
            {contextMenu.visible && (
                <div
                    className="absolute bg-white border rounded shadow-md text-sm"
                    style={{ top: contextMenu.y, left: contextMenu.x, zIndex: 10 }}
                    onMouseLeave={() => setContextMenu({ ...contextMenu, visible: false })}
                >
                    <div onClick={handleEditUser} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Edit
                    </div>
                    <div onClick={handleDeleteUser} className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer">
                        Delete
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-4">Edit User</h3>
                        <label className="block font-medium mb-1">Username</label>
                        <input
                            type="text"
                            className="border p-2 rounded w-full"
                            value={editForm.username}
                            readOnly
                        />
                        <label className="block font-medium mb-1">Full Name</label>
                        <input
                            type="text"
                            value={editForm.name || ""}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            placeholder="Name"
                            className="border rounded p-2 mb-2 w-full"
                        />
                        <label className="block font-medium mb-1">Phone Number</label>
                        <input
                            type="text"
                            value={editForm.phoneNumber || ""}
                            onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                            placeholder="Phone Number"
                            className="border rounded p-2 mb-2 w-full"
                        />
                        <label className="block font-medium mb-1">Status Message</label>
                        <input
                            type="text"
                            value={editForm.statusMessage || ""}
                            onChange={(e) => setEditForm({...editForm, statusMessage: e.target.value})}
                            placeholder="Status Message"
                            className="border rounded p-2 mb-2 w-full"
                        />

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateUser}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}