// App.jsx
import Sidebar from "./components/sidebar/Sidebar";
import ChatWindow from "./components/chat/ChatWindow";


export default function App() {
    return (
        <div className="h-screen flex">
            {/* Left sidebar (chats list, search, filters) */}
            <Sidebar />


            {/* Right chat window (header, messages, input) */}
            <ChatWindow />
        </div>
    );
}