import React from "react";
import { getMoodClass } from "../utils/moodUtils";

const MoodBackground = ({ mood, children }) => {
  const moodClass = getMoodClass(mood);

  return (
    <div
      className={`mood-animation ${moodClass}`}
      style={{ minHeight: "100vh" }}
    >
      {children}
    </div>
  );
};

export default MoodBackground;
