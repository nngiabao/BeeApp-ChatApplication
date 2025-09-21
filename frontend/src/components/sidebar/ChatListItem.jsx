// components/sidebar/ChatListItem.jsx
export default function ChatListItem({ name, lastMessage, time }) {
    return (
        <div className="flex justify-between items-center p-3 hover:bg-gray-100 cursor-pointer border-b">
            <div>
                <h2 className="font-medium">{name}</h2>
                <p className="text-sm text-gray-500">{lastMessage}</p>
            </div>
            <span className="text-xs text-gray-400">{time}</span>
        </div>
    );
}