import React from "react";
import SidebarNav from "./SidebarNav";
import SidebarHeader from "./SidebarHeader";
import SidebarSearch from "./SidebarSearch";
import SidebarFilters from "./SidebarFilters";
import ChatList from "./ChatListItem";

export default function Sidebar() {
    return (
        <div className="flex h-screen bg-white border-r border-gray-300">
            {/* Main sidebar content */}
            <div className="flex flex-col w-[460px]">
                <SidebarHeader />
                <SidebarSearch />
                <SidebarFilters />
                <ChatList chat={{ name: "Anna", title: "You", data: "Start a chat" }} />
            </div>
        </div>
    );
}
