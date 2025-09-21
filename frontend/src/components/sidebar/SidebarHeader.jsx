// components/sidebar/SidebarHeader.jsx
export default function SidebarHeader() {
    return (
        <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-green-600 font-bold text-xl">WhatsApp</h1>
            <div className="flex space-x-2">
                <button className="p-2">➕</button>
                <button className="p-2">⋮</button>
            </div>
        </div>
    );
}