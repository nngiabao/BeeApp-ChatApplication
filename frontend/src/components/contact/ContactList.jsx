import React, { useState } from "react";
import ContactHeader from "./Header";
import QuickActions from "./QuickActions";
import ContactSection from "./ContactSection";
import AddContactPanel from "./AddContact";
import AddGroupPanel from "./AddGroup";
import BlockContactsPanel from "./BlockedContacts";

export default function ContactList() {
    const [activePanel, setActivePanel] = useState("list"); // 'list', 'addContact', 'addGroup'

    const renderPanel = () => {
        switch (activePanel) {
            case "addContact":
                return <AddContactPanel onBack={() => setActivePanel("list")} />;
            case "addGroup":
                return <AddGroupPanel onBack={() => setActivePanel("list")} />;
            case "blockedContacts":
                return <BlockContactsPanel onBack={() => setActivePanel("list")} />;
            default:
                return (
                    <div>
                        <ContactHeader />
                        <QuickActions
                            onAddContact={() => setActivePanel("addContact")}
                            onAddGroup={() => setActivePanel("addGroup")}
                            onBlockList={() => setActivePanel("blockedContacts")}
                        />
                        <ContactSection />
                    </div>
                );
        }
    };

    return <div className="w-full h-full bg-white p-4 overflow-y-auto">{renderPanel()}</div>;
}