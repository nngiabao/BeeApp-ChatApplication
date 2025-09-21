// components/chat/ChatWindow.jsx
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import MessageInput from "./MessageInput";


export default function ChatWindow() {
    return (
        <div className="flex-1 flex flex-col bg-gray-50">
            <ChatHeader />
            <ChatMessages />
            <MessageInput />
        </div>
    );
}