export default function ChatHeader({ chat }) {
    return (
        <div className="p-4 border-b bg-gray-50 font-bold">
            {chat ? chat.name : "Select a chat"}
        </div>
    );
}
