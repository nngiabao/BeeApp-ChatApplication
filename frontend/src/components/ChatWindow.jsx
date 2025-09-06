export default function ChatWindow({ messages, username }) {
    return (
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, i) => (
                <div
                    key={i}
                    className={`mb-2 flex ${
                        msg.from === username ? "justify-end" : "justify-start"
                    }`}
                >
                    <div
                        className={`px-4 py-2 rounded-lg max-w-xs ${
                            msg.from === username
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300 text-black"
                        }`}
                    >
                        {msg.text}
                    </div>
                </div>
            ))}
        </div>
    );
}
