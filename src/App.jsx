import { useState, useEffect, useRef } from "react";
import "./App.css";
import SideMenu from './components/side-menu'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { getToken } from './api/journalApi';
import { parseJwt } from './utils/stringUtils';
import { useAuth } from './hooks/useAuth';

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
    const storedUser = localStorage.getItem("user");

    if (code && !storedUser) {
      try {
        hasFetchedToken.current = true;
        const data = await getToken(code);
        const user = parseJwt(data.id_token);
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
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
      <div className="flex min-h-screen w-screen">
        <SideMenu />
        <div className="flex-1 relative p-8 max-h-[100vh]">
          <Outlet />
        </div>
      </div>
  );
}

export default App;
