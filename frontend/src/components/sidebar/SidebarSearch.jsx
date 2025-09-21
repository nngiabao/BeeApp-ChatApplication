// components/sidebar/SidebarSearch.jsx
export default function SidebarSearch() {
    return (
        <div className="p-2">
            <input
                type="text"
                placeholder="Tìm kiếm hoặc bắt đầu đoạn chat mới"
                className="w-full p-2 rounded-full bg-gray-100 outline-none"
            />
        </div>
    );
}