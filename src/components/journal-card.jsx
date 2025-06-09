import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export const JournalCard = ({ data, onAppear }) => {
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const { ai } = data;

  useEffect(() => {
    const card = cardRef.current;
    if (card && onAppear) {
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
          onComplete: () => onAppear(),
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
    }
  }, [onAppear]);

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
      className="w-[300px] bg-white rounded-2xl overflow-hidden border border-gray-100 transition-[filter] duration-300"
      style={{
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      <div className="h-[160px] bg-gradient-to-br from-purple-100 to-pink-100 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl filter drop-shadow-sm">
            {ai?.mood || "📝"}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold mb-3 line-clamp-2 min-h-[3.5rem]">
          {data.title}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">📅</span>
            <span>{new Date(data.date).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">🌤️</span>
            <span>{data.weather || "Not specified"}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">💭</span>
            <span className="line-clamp-2">
              {ai?.summary?.substring(0, 50)}...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};