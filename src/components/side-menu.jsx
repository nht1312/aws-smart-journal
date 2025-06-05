import { menuItems , LOGIN_PAGE, LOGOUT_URL} from "../const";
import { useAuth } from "../hooks/useAuth";

export default function SideMenu() {
    const { user , setUser} = useAuth();
    const handleClick = () => {
      localStorage.removeItem("user");
      setUser(null);
    };
    return (
        <aside className="w-64 text-[30px] h-screen bg-white shadow-md border-r z-50">
            <div className="p-4 border-b">
                <h2 className="text-[30px] font-semibold">My Diary</h2>
            </div>
            <nav className="flex flex-col p-4 space-y-2">
                {user && menuItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        onClick={item.isHandleOnClick ? handleClick : undefined}
                        className="px-4 py-2 rounded-md text-gray-700"
                    >
                        {item.label}
                    </a>
                ))}
                {!user && <a
                    key='login'
                    href={LOGIN_PAGE}
                    className="px-4 py-2 rounded-md text-gray-700"
                >
                    Login
                </a>}
            </nav>
        </aside>
    );
}
