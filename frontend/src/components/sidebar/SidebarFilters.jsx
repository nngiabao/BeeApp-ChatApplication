// components/sidebar/SidebarFilters.jsx
export default function SidebarFilters() {
    return (
        <div className="flex space-x-2 px-2 py-1">
            {['Tất cả', 'Chưa đọc', 'Mục yêu thích', 'Nhóm'].map((filter) => (
                <button
                    key={filter}
                    className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200"
                >
                    {filter}
                </button>
            ))}
        </div>
    );
}