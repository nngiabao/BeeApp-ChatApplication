import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Signup() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        phoneNumber: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault ();

        try {
            const res = await axios.post("http://localhost:8080/api/users", {
                username: form.username,
                email: form.email,
                password: form.password,
                phoneNumber: form.phoneNumber
            });

            setMessage("✅ User registered successfully!");
            console.log("Response:", res.data);
        } catch (err) {
            console.error("Error registering user:", err);
            setMessage("❌ Registration failed. Check console for details.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="username"
                        type="text"
                        placeholder="Full Name"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                    />
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                    />

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
                    >
                        Create Account
                    </button>
                </form>

                {message && (
                    <p className="text-sm text-center mt-4 text-gray-700">{message}</p>
                )}

                <p className="text-sm text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/" className="text-green-500 hover:underline">
                    Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
