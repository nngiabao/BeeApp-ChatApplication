import React, { useEffect, useState } from "react";
import { Pencil, Phone, Lock, LogOut, LifeBuoy } from "lucide-react";
import { useUser } from "../context/UserContext.jsx";

export default function ProfileInfo() {
    const { user, updateUser, changePassword } = useUser();
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [showTickets, setShowTickets] = useState(false);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [name, setName] = useState(user.name || "");
    const [phone, setPhone] = useState(user.phoneNumber || "");
    const [about, setAbout] = useState(user.statusMessage || "");

    const [errors, setErrors] = useState({ name: "", phone: "", about: "" });

    // Ticket state
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [userTickets, setUserTickets] = useState([]);
    //
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyMessage, setReplyMessage] = useState("");
    // Load user's tickets
    useEffect(() => {
        if (showTickets) {
            fetch(`http://localhost:8080/supports/user/${user.id}`)
                .then(res => res.json())
                .then(data => setUserTickets(data.data || []))
                .catch(() => setUserTickets([]));
        }
    }, [showTickets]);

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8080/users/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user.username }),
            });
        } catch (err) {
            console.error("Logout failed:", err);
        }
        localStorage.clear();
        window.location.href = "/";
    };

    const nameRegex = /^[A-Za-z0-9\s]{1,32}$/;
    const aboutRegex = /^[A-Za-z0-9\s.,!?'"-]{0,50}$/;
    const phoneRegex = /^\d{10}$/;

    const handleSaveName = async () => {
        if (!nameRegex.test(name)) {
            setErrors((prev) => ({ ...prev, name: "Name must be up to 32 letters or digits only." }));
            return;
        }
        setErrors((prev) => ({ ...prev, name: "" }));
        setIsEditingName(false);
        await updateUser({ name });
    };

    const handlePhoneSave = async () => {
        if (!phoneRegex.test(phone)) {
            setErrors((prev) => ({ ...prev, phone: "Phone number must be exactly 10 digits." }));
            return;
        }
        setErrors((prev) => ({ ...prev, phone: "" }));
        setIsEditingPhone(false);
        await updateUser({ phoneNumber: phone });
    };

    const handleAboutSave = async () => {
        if (!aboutRegex.test(about)) {
            setErrors((prev) => ({
                ...prev,
                about: "About: up to 50 characters, basic punctuation allowed.",
            }));
            return;
        }
        setErrors((prev) => ({ ...prev, about: "" }));
        setIsEditingAbout(false);
        await updateUser({ statusMessage: about });
    };

    const handlePasswordSave = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match");
            return;
        }
        await changePassword(oldPassword, newPassword);
        setShowPasswordForm(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleSendTicket = async () => {
        const ticket = {
            userId: user.id,
            subject,
            message,
            status: "pending"
        };
        try {
            await fetch("http://localhost:8080/supports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ticket)
            });
            alert("Ticket submitted successfully!");
            setSubject("");
            setMessage("");
            setShowTicketModal(false);
        } catch (err) {
            console.error("Ticket submission failed:", err);
            alert("Failed to submit ticket");
        }
    };

    return (
        <div className="relative space-y-6">
            {/* Name */}
            <div>
                <label className="block text-sm text-gray-500 mb-1">Name</label>
                <div className="flex justify-between items-center">
                    {isEditingName ? (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={handleSaveName}
                            autoFocus
                            className="text-gray-800 font-medium border-b border-gray-300 focus:outline-none focus:border-green-500"
                        />
                    ) : (
                        <span className="text-gray-800 font-medium">{user.name}</span>
                    )}
                    <Pencil className="w-4 h-4 text-gray-500 cursor-pointer hover:text-green-600" onClick={() => setIsEditingName(true)} />
                </div>
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* About */}
            <div>
                <label className="block text-sm text-gray-500 mb-1">About</label>
                <div className="flex justify-between items-center">
                    {isEditingAbout ? (
                        <input
                            type="text"
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            onBlur={handleAboutSave}
                            autoFocus
                            className="text-gray-800 text-sm border-b border-gray-300 focus:outline-none focus:border-green-500 w-full"
                        />
                    ) : (
                        <span className="text-gray-800 text-sm">{user.statusMessage}</span>
                    )}
                    <Pencil className="w-4 h-4 text-gray-500 cursor-pointer hover:text-green-600 ml-2" onClick={() => setIsEditingAbout(true)} />
                </div>
                {errors.about && <p className="text-xs text-red-500">{errors.about}</p>}
            </div>

            {/* Phone */}
            <div>
                <label className="block text-sm text-gray-500 mb-1">Phone</label>
                <div className="flex items-center justify-between">
                    {isEditingPhone ? (
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            onBlur={handlePhoneSave}
                            autoFocus
                            className="text-gray-800 font-medium border-b border-gray-300 focus:outline-none focus:border-green-500"
                        />
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-800 font-medium">{user.phoneNumber}</span>
                        </div>
                    )}
                    <Pencil className="w-4 h-4 text-gray-500 cursor-pointer hover:text-green-600" onClick={() => setIsEditingPhone(true)} />
                </div>
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm text-gray-500 mb-1">Password</label>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-800 font-medium">••••••••</span>
                    </div>
                    <Pencil className="w-4 h-4 text-gray-500 cursor-pointer hover:text-green-600" onClick={() => setShowPasswordForm(true)} />
                </div>
            </div>

            {/* Support */}
            <div className="space-y-3">
                <button
                    onClick={() => setShowTicketModal(true)}
                    className="w-full flex items-center justify-center px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                    <LifeBuoy className="w-4 h-4 mr-2" /> Send Support Ticket
                </button>

                <button
                    onClick={() => setShowTickets(true)}
                    className="w-full text-sm text-green-600 underline hover:text-green-700"
                >
                    View My Submitted Tickets
                </button>
            </div>

            {/* Logout */}
            <div onClick={handleLogout} className="flex items-center space-x-3 bg-[#faf9f8] px-4 py-3 rounded-xl cursor-pointer hover:bg-red-50 transition duration-200">
                <LogOut className="w-5 h-5 text-red-500" />
                <span className="text-red-600 font-medium text-sm">Log out</span>
            </div>

            {/* Password Modal */}
            {showPasswordForm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
                        <h2 className="text-lg font-semibold mb-4 text-center">Change Password</h2>
                        <form onSubmit={handlePasswordSave} className="space-y-3">
                            <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="input" required />
                            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input" required />
                            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input" required />
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowPasswordForm(false)} className="text-sm">Cancel</button>
                                <button type="submit" className="text-sm bg-green-600 text-white px-3 py-1 rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Ticket Modal */}
            {showTicketModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4 text-center">Send Support Ticket</h2>

                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Enter subject"
                            className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />

                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                            rows="4"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Describe your issue..."
                            className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowTicketModal(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendTicket}
                                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Tickets List Modal */}
            {userTickets.map((ticket) => (
                <li key={ticket.id} className="border rounded-lg p-3 shadow-sm">
                    <div className="text-sm font-semibold">{ticket.subject}</div>
                    <div className="text-xs text-gray-600 mb-1">{ticket.message}</div>
                    <div className="text-xs text-gray-400">
                        Status: {ticket.status} • {new Date(ticket.createdAt).toLocaleString()}
                    </div>

                    {/* Show "Reply" button if status is OPEN */}
                    {ticket.status === "OPEN" && (
                        <div className="mt-2">
                            <button
                                className="text-blue-600 text-xs underline hover:text-blue-800"
                                onClick={() => {
                                    setSelectedTicket(ticket);
                                    setReplyMessage("");
                                    setShowReplyModal(true);
                                }}
                            >
                                Reply
                            </button>
                        </div>
                    )}
                </li>
            ))}
            {/*reply modal ticket UI*/}
            {showReplyModal && selectedTicket && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-[400px]">
                        <h3 className="text-xl font-semibold mb-4 text-center">Reply to Ticket</h3>

                        <p className="text-gray-600 text-sm mb-2"><strong>Subject:</strong> {selectedTicket.subject}</p>
                        <p className="text-gray-500 text-sm mb-4"><strong>Message:</strong> {selectedTicket.message}</p>

                        <textarea
                            rows="4"
                            placeholder="Type your reply..."
                            className="w-full border rounded p-2 mb-4"
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowReplyModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-black"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {

                                    const response = await fetch(
                                        `http://localhost:8080/supports/${selectedTicket.id}/reply?senderId=${user.id}&senderType=USER&message=${encodeURIComponent(replyMessage)}`,
                                        { method: "POST" }
                                    );
                                    if (response.ok) {
                                        alert("Reply sent!");
                                        setShowReplyModal(false);
                                        setReplyMessage("");
                                        // Optionally reload ticket list here
                                    } else {
                                        alert("Failed to send reply");
                                    }
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
