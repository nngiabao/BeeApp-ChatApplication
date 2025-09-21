import SidebarHeader from "./SidebarHeader.jsx";
import SidebarSearch from "./SidebarSearch.jsx";
import SidebarFilters from "./SidebarFilters.jsx";
import ChatList from "./ChatList.jsx";


export default function Sidebar({ chats, activeId, onSelectChat }) {
    return (
        <aside className="w-[380px] bg-white border-r flex flex-col">
            <SidebarHeader />
            <SidebarSearch />
            <SidebarFilters />
            <ChatList chats={chats} activeId={activeId} onSelectChat={onSelectChat} />
        </aside>
    );
}