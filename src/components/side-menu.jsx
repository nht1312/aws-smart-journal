import { menuItems, LOGIN_PAGE } from "../const";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function SideMenu() {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const itemsRef = useRef([]);

  const handleLogout = () => {
    // Animate out
    gsap.to(menuRef.current, {
      x: -20,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        localStorage.removeItem("user");
        setUser(null);
        // Animate back in
        gsap.to(menuRef.current, {
          x: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      },
    });
  };

  useEffect(() => {
    // Initial entrance animation
    gsap.fromTo(
      menuRef.current,
      {
        x: -50,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      }
    );

    // Stagger menu items
    gsap.fromTo(
      itemsRef.current,
      {
        x: -20,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
      }
    );
  }, []);

  const getMenuItemIcon = (label) => {
    switch (label.toLowerCase()) {
      case "home":
        return "🏠";
      case "log out":
        return "👋";
      case "login":
        return "🔑";
      default:
        return "📝";
    }
  };

  return (
    <aside
      ref={menuRef}
      className="fixed top-0 left-0 w-64 h-screen bg-white shadow-lg border-r border-gray-100 z-50 flex flex-col"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-50" />

      {/* Logo section */}
      <div className="relative p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
          <span className="text-3xl">📔</span>
          My Diary
        </h2>
      </div>

      {/* Navigation */}
      <nav className="relative p-4 space-y-2 flex-1 overflow-y-auto">
        {user &&
          menuItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <a
                key={item.label}
                ref={(el) => (itemsRef.current[index] = el)}
                href={item.href}
                onClick={item.isHandleOnClick ? handleLogout : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50"
                }`}
              >
                <span className="text-xl">{getMenuItemIcon(item.label)}</span>
                {item.label}
              </a>
            );
          })}

        {!user && (
          <a
            ref={(el) => (itemsRef.current[0] = el)}
            href={LOGIN_PAGE}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200"
          >
            <span className="text-xl">🔑</span>
            Login
          </a>
        )}

        {/* Add New Diary Button (inside menu for mobile responsiveness) */}
        {user && (
          <button
            onClick={() => navigate("/new-diary")}
            className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl py-3 px-4 flex items-center gap-3 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
          >
            <span className="text-xl">✨</span>
            New Diary
          </button>
        )}
      </nav>

      {/* User section */}
      {user && (
        <div className="relative p-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                {user.email}
              </p>
              <p className="text-xs text-gray-500">Logged in</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
