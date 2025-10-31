import React from "react";


export default function ContactSection() {
    const contacts = [
        {name: "+1 (651) 230-2637 (You)", message: "Message yourself"},
        {name: "Ahmed", message: "مرحبًا! أنا استعمل واتساب."},
        {name: "Aly", message: "Ali alghamdi"},
        {name: "Andruey", message: "Hey there! I am using WhatsApp."},
        {name: "Aziz", message: "Urgent calls only"},
        {name: "C Puyen", message: "Available"},
    ];


    return (
        <div>
            <h2 className="text-sm text-gray-500 mb-2">Contacts on BeeApp</h2>
            <div className="space-y-1">
                {contacts.map((contact, index) => (
                    <div
                        key={index}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white">
<span className="text-sm font-semibold">
{contact.name.charAt(0).toUpperCase()}
</span>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{contact.name}</p>
                            <p className="text-sm text-gray-500">{contact.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}