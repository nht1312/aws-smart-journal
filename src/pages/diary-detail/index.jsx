import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { formatDateToDDMMYYYY } from "../../utils/stringUtils";
import AIMessage from "../../components/message-container";
import { getJournalByID } from "../../api/journalApi";
import Spinner from "../../components/spinner";
import WeatherEffect from "../../components/WeatherEffect";
import gsap from "gsap";

const ContentSection = ({ title, children, emoji, delay = 0 }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay,
        ease: "power2.out",
      }
    );
  }, [delay]);

  return (
    <div
      ref={sectionRef}
      className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 mb-8"
    >
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
        <span className="text-3xl">{emoji}</span>
        {title}
      </h2>
      {children}
    </div>
  );
};

export default function DiaryDetail() {
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  const fetchData = async () => {
    try {
      const result = await getJournalByID(id);
      setDetail(result);
      setLoading(false);
    } catch (error) {
      console.error("Get data error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!detail || Object.keys(detail).length === 0) {
      setLoading(true);
      fetchData();
    }
  }, [detail]);

  useEffect(() => {
    if (!loading && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        }
      );
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <WeatherEffect mood={detail.ai?.mood} />
      <div
        ref={containerRef}
        className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <ContentSection title="Journal Entry" emoji="📖" delay={0}>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-4 border-b border-gray-100">
              <h1 className="text-3xl font-bold text-gray-900 break-words sm:max-w-[70%]">
                {detail.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-2xl">📅</span>
                <span className="text-xl">
                  {formatDateToDDMMYYYY(detail.date)}
                </span>
              </div>
            </div>

            {detail.weather && (
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-2xl">🌤️</span>
                <span className="text-xl">{detail.weather}</span>
              </div>
            )}

            <div className="text-gray-600 text-xl leading-relaxed">
              <p className="first-letter:text-4xl first-letter:font-serif first-letter:mr-2 first-letter:float-left">
                {detail.text}
              </p>
            </div>
          </div>
        </ContentSection>

        {detail.ai && (
          <ContentSection title="AI Insights" emoji="✨" delay={0.2}>
            <AIMessage detail={detail.ai} />
          </ContentSection>
        )}

        <div className="fixed bottom-8 right-8 space-y-4">
          <button
            onClick={() => window.history.back()}
            className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform duration-200"
          >
            ←
          </button>
        </div>
      </div>
    </>
  );
}
