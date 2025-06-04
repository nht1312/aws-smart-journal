export const getMoodClass = (emoji) => {
  const moodMap = {
    "😊": "mood-happy",
    "😃": "mood-happy",
    "😄": "mood-happy",
    "🙂": "mood-happy",
    "😢": "mood-sad",
    "😭": "mood-sad",
    "😥": "mood-sad",
    "😡": "mood-angry",
    "😠": "mood-angry",
    "😤": "mood-angry",
    "😌": "mood-peaceful",
    "🧘": "mood-peaceful",
    "😰": "mood-anxious",
    "😨": "mood-anxious",
    "😱": "mood-anxious",
  };

  return moodMap[emoji] || "mood-peaceful"; // Default to peaceful if emoji not found
};
