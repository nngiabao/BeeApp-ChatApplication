import React from "react";
import ContactHeader from "./Header";
import QuickActions from "./QuickActions";
import ContactSection from "./ContactSection";


export default function ContactList() {
    return (
        <div className="w-full h-full bg-white p-4 overflow-y-auto">
            <ContactHeader />
            <QuickActions />
            <ContactSection />
        </div>
    );
}