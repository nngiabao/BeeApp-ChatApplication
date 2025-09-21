// components/chat/ChatMessages.jsx
const messages = [
    { from: "Saurabh", text: "😁" },
    { from: "me", text: "Ok bro" },
];


export default function ChatMessages() {
    return (
        <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`mb-2 p-2 rounded-lg max-w-xs ${
                        msg.from === "me"
                            ? "bg-green-200 ml-auto text-right"
                            : "bg-white text-left"
                    }`}
                >
                    {msg.text}
                </div>
            ))}
        </div>
    );
}