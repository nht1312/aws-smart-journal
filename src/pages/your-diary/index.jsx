import { useState, useEffect, useRef } from "react";
import { getJournalByUserID } from "../../api/journalApi";
import Spinner from "../../components/spinner";
import { useAuth } from "../../hooks/useAuth";
import MoodChart from "../../components/MoodChart";
import gsap from "gsap";
import { EmptyState } from "../../components/empty-state";
import { JournalCard } from "../../components/journal-card";


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