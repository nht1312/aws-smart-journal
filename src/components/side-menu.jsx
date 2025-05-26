import { menuItems } from "../const";

export default function SideMenu() {
    return (
        <aside className="w-64 text-[30px] h-screen bg-white shadow-md border-r z-50">
            <div className="p-4 border-b">
                <h2 className="text-[30px] font-semibold">My Diary</h2>
            </div>
            <nav className="flex flex-col p-4 space-y-2">
                {menuItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        className="px-4 py-2 rounded-md text-gray-700"
                    >
                        {item.label}
                    </a>
                ))}
            </nav>
        </aside>
    );
}
