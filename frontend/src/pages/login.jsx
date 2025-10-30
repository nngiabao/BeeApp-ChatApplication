import { useState } from "react";
import { IoIosLock } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // for navigation after login

export default function Login() {
    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // hook for navigation

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Logging in with:", form);

        try {
            const res = await axios.post("http://localhost:8080/users/login", {
                username: form.username,
                password: form.password,
            });
            setMessage("Login successful!");

            //Navigate to chat/home, passing username
            navigate("/home", { state: { username: form.username } });
        } catch (err) {
            console.error("Error logging in:", err);
            if (err.response?.status === 400) {
                setMessage("Invalid username or password.");
            } else {
                setMessage("Server unreachable. Check backend connection.");
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0ebe3]">
            {/* Logo */}
            <div className="absolute top-8 left-10 flex items-center space-x-2">
                { /* <FaWhatsapp className="text-green-500 text-3xl" />*/}
                <span className="text-xl font-semibold text-gray-800">BeeApp</span>
            </div>

            {/* Card */}
            <div className="bg-white p-8 rounded-2xl shadow border max-w-md w-full text-center">
                <h2 className="text-2xl font-semibold mb-4">Login to BeeApp</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full border rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />

                    <button
                        type="submit"
                        disabled={!form.username || !form.password}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-full transition-all duration-200 ${
                            form.username && form.password
                                ? "bg-green-500 hover:bg-green-600 text-white"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Login
                    </button>
                </form>

                {message && (
                    <p className="text-sm text-center mt-4 text-gray-700">{message}</p>
                )}

                <p className="text-sm mt-6">
                    Don’t have an account?{" "}
                    <a href="/signup" className="text-green-600 hover:underline">
                        Sign up
                    </a>
                </p>
            </div>

            {/* Footer */}
            <div className="mt-8 text-gray-600 text-sm flex flex-col items-center">
                <div className="flex items-center gap-2">
                    <IoIosLock />
                    <span>Your personal messages are end-to-end encrypted</span>
                </div>
                <p className="mt-2 underline text-xs">Terms & Privacy Policy</p>
            </div>
        </div>
    );
}
