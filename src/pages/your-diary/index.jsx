import { useState, useEffect, useRef } from "react";
import { getJournalByUserID } from "../../api/journalApi";
import Spinner from "../../components/spinner";
import { useAuth } from "../../hooks/useAuth";
import MoodChart from "../../components/MoodChart";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
    <div className="text-6xl mb-4">📝</div>
    <h3 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
      Your Journal Journey Begins Here
    </h3>
    <p className="text-gray-500 mb-6">
      Start writing your first entry and track your emotional journey
    </p>
  </div>
);

const JournalCard = ({ data, onAppear }) => {
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

export default function YourDiary() {
  const [loading, setLoading] = useState(true);
  const [journals, setJournals] = useState(null);
  const { user } = useAuth();
  const containerRef = useRef(null);

  const fetchData = async (user) => {
    try {
      const result = await getJournalByUserID(user["cognito:username"]);
      setJournals(result);
      setLoading(false);
    } catch (error) {
      console.error("Get data error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchData(user);
    } else {
      setLoading(false);
      setJournals([]);
    }
  }, [user]);

  useEffect(() => {
    if (containerRef.current && !loading) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [loading]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50/30 pb-20">
      {loading ? (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
          <Spinner />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {journals && journals.length > 0 ? (
            <>
              <div className="mb-12">
                <MoodChart journals={journals} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {journals.map((journal) => (
                  <JournalCard
                    key={journal.id}
                    data={journal}
                    onAppear={() => {}}
                  />
                ))}
              </div>
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      )}
    </div>
  );
}
