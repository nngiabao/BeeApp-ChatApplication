// components/chat/ChatHeader.jsx
export default function ChatHeader() {
    return (
        <div className="flex items-center justify-between p-4 border-b bg-white">
            <h2 className="font-medium">Saurabh csu india</h2>
            <div className="flex space-x-2">
                <button className="p-2">📞</button>
                <button className="p-2">📹</button>
                <button className="p-2">⋮</button>
            </div>
        </div>
    );
}