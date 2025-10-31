import React from "react";
import SidebarNav from "./SidebarNav";
import SidebarHeader from "./SidebarHeader";
import SidebarSearch from "./SidebarSearch";
import SidebarFilters from "./SidebarFilters";
import ChatList from "./ChatListItem";

export default function Sidebar() {
    return (
        <div className="flex h-full">
            <div className="flex flex-col w-80 bg-white border-r border-gray-300">
                <SidebarHeader />
                <SidebarSearch />
                <SidebarFilters />
                <ChatList chat={{ name: "Anna", title: "You", data: "Start a chat" }} />
                {/*
                <div className="text-sm text-green-600 text-center py-3 border-t border-gray-200 hover:bg-green-50 cursor-pointer">
                    💬 Happy chatting time
                </div>*/}
            </div>
        </div>
    );
}
