import React from "react";
import SidebarNav from "./SidebarNav";
import SidebarHeader from "./SidebarHeader";
import SidebarSearch from "./SidebarSearch";
import SidebarFilters from "./SidebarFilters";
import ChatList from "./ChatList";

export default function Sidebar() {
    return (
        <div className="flex h-full">
            <SidebarNav />
            <div className="flex flex-col w-80 bg-white border-r border-gray-300">
                <SidebarHeader />
                <SidebarSearch />
                <SidebarFilters />
                <ChatList />
                {/*
                <div className="text-sm text-green-600 text-center py-3 border-t border-gray-200 hover:bg-green-50 cursor-pointer">
                    💬 Happy chatting time
                </div>*/}
            </div>
        </div>
    );
}
