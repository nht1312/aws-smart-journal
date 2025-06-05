import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AIMessage({ detail }) {
  const { summary, suggestion } = detail;
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current.children,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out",
      }
    );
  }, []);

  // Split the suggestion into separate points
  const formatSuggestion = (text) => {
    // Split by periods, but keep the periods
    const points = text
      .split(/(?<=\.)/)
      .map((point) => point.trim())
      .filter((point) => point.length > 0);

    return points;
  };

  return (
    <div ref={containerRef}>
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
          <span className="text-3xl">💌</span>
          Thoughts for You
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">{summary}</p>
      </div>

      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
          <span className="text-3xl">💖</span>A Piece of Advice
        </h2>
        <div className="space-y-4">
          {formatSuggestion(suggestion).map((point, index) => (
            <div
              key={index}
              className="flex items-start gap-3 text-lg text-gray-700 leading-relaxed"
            >
              <span className="text-xl mt-1">✨</span>
              <p>{point}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
