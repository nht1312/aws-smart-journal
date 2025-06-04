import { useState, useEffect } from "react";
import "./App.css";
import SideMenu from './components/side-menu'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { getToken } from './api/journalApi';
import { parseJwt } from './utils/stringUtils';
import { useAuth } from './hooks/useAuth';

function App() {
  const [currentMood, setCurrentMood] = useState("😊"); // Default mood
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  // Listen for mood changes from journal entries
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
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    if (code && user == null) {
      getToken(code)
        .then(data => {
          const user = parseJwt(data.id_token);
          setUser(JSON.stringify(user));
          localStorage.setItem("user", JSON.stringify(user));
          
          window.location.reload();
        })
        .catch(err => {
          console.error("Token exchange failed:", err);
        });
    }
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
