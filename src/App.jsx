import { useState, useEffect } from "react";
import "./App.css";
import SideMenu from "./components/side-menu";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getToken } from "./api/journalApi";
import { parseJwt } from "./utils/stringUtils";
import { useAuth } from "./hooks/useAuth";

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
        .then((data) => {
          const user = parseJwt(data.id_token);
          setUser(JSON.stringify(user));
          localStorage.setItem("user", JSON.stringify(user));

          window.location.reload();
        })
        .catch((err) => {
          console.error("Token exchange failed:", err);
        });
    }
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
