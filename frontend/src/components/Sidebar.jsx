export default function Sidebar({ chats, onSelect }) {
    return (
        <div className="w-1/4 bg-gray-100 border-r overflow-y-auto">
            <h2 className="p-4 font-bold text-xl border-b">Chats</h2>
            {chats.map((chat, i) => (
                <div
                    key={i}
                    className="p-4 cursor-pointer hover:bg-gray-200 border-b"
                    onClick={() => onSelect(chat)}
                >
                    <p className="font-semibold">{chat.name}</p>
                    <p className="text-sm text-gray-600 truncate">
                        {chat.messages.at(-1)?.text}
                    </p>
                </div>
            ))}
        </div>
    );
}
