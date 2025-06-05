import { useEffect, useRef } from "react";
import { formatDateToDDMMYYYY } from "../utils/stringUtils";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const moodColors = {
  "😊": "#FFD700", // Gold for happy
  "😃": "#FFD700",
  "😄": "#FFD700",
  "🙂": "#98FB98", // Pale green for content
  "😌": "#87CEEB", // Sky blue for peaceful
  "🧘": "#87CEEB",
  "😰": "#DDA0DD", // Plum for anxious
  "😨": "#DDA0DD",
  "😢": "#B0C4DE", // Light steel blue for sad
  "😭": "#B0C4DE",
  "😥": "#B0C4DE",
  "😡": "#FF6B6B", // Coral red for angry
  "😠": "#FF6B6B",
  "😤": "#FF6B6B",
};

export default function Card({ data }) {
  const { ai } = data;
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const moodColor = moodColors[ai?.mood] || "#87CEEB";

  useEffect(() => {
    const card = cardRef.current;
    gsap.fromTo(
      card,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }
    );

    // Set up hover animations
    const hoverIn = () => {
      gsap.to(card, {
        y: -8,
        scale: 1.02,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const hoverOut = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    card.addEventListener("mouseenter", hoverIn);
    card.addEventListener("mouseleave", hoverOut);

    return () => {
      card.removeEventListener("mouseenter", hoverIn);
      card.removeEventListener("mouseleave", hoverOut);
    };
  }, []);

  const handleClick = () => {
    const card = cardRef.current;
    gsap.to(card, {
      scale: 0.98,
      duration: 0.1,
      ease: "power2.in",
      onComplete: () => {
        gsap.to(card, {
          scale: 1,
          duration: 0.1,
          ease: "power2.out",
          onComplete: () => {
            navigate(`/diary-detail/${data.id}`);
          },
        });
      },
    });
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className="w-[320px] bg-white rounded-2xl overflow-hidden border border-gray-100 transition-[filter] duration-300"
      style={{
        background: `linear-gradient(135deg, white 0%, ${moodColor}15 100%)`,
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      <div className="relative p-6">
        <div className="absolute top-4 right-4 text-4xl filter drop-shadow-sm">
          {ai?.mood || "📝"}
        </div>

        <h2 className="text-xl font-semibold mb-4 pr-12 line-clamp-2">
          {data.title}
        </h2>

        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <span className="w-6">📅</span>
            <span className="ml-2 text-sm">
              {formatDateToDDMMYYYY(data.date)}
            </span>
          </div>

          {data.weather && (
            <div className="flex items-center text-gray-600">
              <span className="w-6">🌤️</span>
              <span className="ml-2 text-sm">{data.weather}</span>
            </div>
          )}

          {ai?.summary && (
            <div className="flex items-start text-gray-600">
              <span className="w-6 mt-1">💭</span>
              <p className="ml-2 text-sm line-clamp-2">{ai.summary}</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <button className="w-full text-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
            Read More →
          </button>
        </div>
      </div>
    </div>
  );
}
