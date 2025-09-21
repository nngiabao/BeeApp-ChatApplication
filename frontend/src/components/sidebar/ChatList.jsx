// components/sidebar/ChatList.jsx
import ChatListItem from "./ChatListItem";


const sampleChats = [
    { name: "Saurabh csu india", lastMessage: "😁", time: "thứ năm" },
    { name: "Cis-600 Maao", lastMessage: "Yes sir", time: "thứ tư" },
    { name: "Charan", lastMessage: "No bro", time: "thứ tư" },
    { name: "Sri", lastMessage: "Ok bro", time: "chủ nhật" },
];


export default function ChatList() {
    return (
        <div className="flex-1 overflow-y-auto">
            {sampleChats.map((chat, index) => (
                <ChatListItem key={index} {...chat} />
            ))}
        </div>
    );
}