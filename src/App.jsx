import { useState, useEffect } from "react";
import "./App.css";
import SideMenu from "./components/side-menu";
import { Outlet } from "react-router-dom";
import MoodBackground from "./components/MoodBackground";

function App() {
  const [currentMood, setCurrentMood] = useState("😊"); // Default mood

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

  return (
    <MoodBackground mood={currentMood}>
      <div className="flex min-h-screen w-screen">
        <SideMenu />
        <div className="flex-1 relative p-8 max-h-[100vh]">
          <Outlet />
        </div>
      </div>
    </MoodBackground>
  );
}

export default App;
