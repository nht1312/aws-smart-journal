import Card from "../../components/card";
import { getJournalByUserID } from "../../api/journalApi";
import Spinner from "../../components/spinner";
import { useState, useEffect } from "react";

export default function YourDiary() {
    const [loading, setLoading] = useState(true);
    const [journals, setJournals] = useState([]);

    const fetchData = async () => {
        try {
            const result = await getJournalByUserID("user123");

            setJournals(result);
            setLoading(false);
        } catch (error) {
            console.error("Get data error:", error);
        }
    };

    useEffect(() => {
        if (journals.length === 0) {
            setLoading(true);
            fetchData();
        }
    }, [journals]);


    return (
        <>
             {loading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <Spinner />
                </div>
            )}
            {(journals.length > 0) && (
                <div className="w-full h-full overflow-y-auto">
                    <div className="flex justify-center flex-wrap">
                        {journals.map((journal) => (
                            <Card
                                data={journal}
                            />
                        ))}
                    </div>
                </div>
            )}
            {!loading && (
                <div className="h-[70px] w-[70px] bg-[#7f1d1d] text-white flex justify-center items-center rounded-full fixed bottom-10 right-20">
                    <a href="/new-diary" className="text-[40px] text-white">+</a>
                </div>
            )}
            
        </>
        
    );
}