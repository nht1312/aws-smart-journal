import { useState, useEffect, useRef } from "react";
import "./App.css";
import SideMenu from "./components/side-menu";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getToken } from "./api/journalApi";
import { parseJwt } from "./utils/stringUtils";
import { useAuth } from "./hooks/useAuth";
import { getCookie } from "./utils/tokenUtils";

function App() {
  const hasFetchedToken = useRef(false);
  const [currentMood, setCurrentMood] = useState("😊"); 
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const fetchUser = async () => {
    if (hasFetchedToken.current) return;

    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const cookieToken = getCookie("token");

    if (code && !cookieToken) {
      try {
        hasFetchedToken.current = true;
        const tokenObj = await getToken(code);
        const user = parseJwt(tokenObj.id_token);
        setUser(user);
        document.cookie = `token=${tokenObj.id_token}; path=/; max-age=${user.exp - Math.floor(Date.now() / 1000)}`;
      } catch (err) {
        console.error("Token exchange failed:", err);
      }
    }
  };

  useEffect(() => {
    const handleMoodChange = (event) => {
      if (event.detail?.mood) {
        setCurrentMood(event.detail.mood);
      }
    };

    window.addEventListener("moodChanged", handleMoodChange);
    return () => window.removeEventListener("moodChanged", handleMoodChange);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [location.search, navigate]);

  return (
    <div className="flex min-h-screen w-screen bg-gray-50">
      <SideMenu />
      <main className="flex-1 ml-64">
        <div className="max-w-7xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default App;
