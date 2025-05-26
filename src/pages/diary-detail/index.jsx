import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { formatDateToDDMMYYYY } from "../../utils/stringUtils";
import AIMessage from "../../components/message-container";
import { getJournalByID } from "../../api/journalApi";
import Spinner from "../../components/spinner";

export default function DiaryDetail() {
    const { id } = useParams(); 

    const [detail, setDetail] = useState({});
    const [loading, setLoading] = useState(true);
    const diaryDetailObject = {
        "message": "Journal saved",
        "data": {
            "id": "rtujavwii3k6zrnmv79fvg",
            "userId": "user123",
            "timestamp": 1747899322037,
            "text": "vui vẻ",
            "title": "Test",
            "date": "2025-05-21T17:00:00.000Z",
            "weather": "sunny",
            "ai": {
                "mood": "😄 Vui vẻ",
                "summary": "Bạn đang có một ngày thật tốt đẹp!",
                "suggestion": "Ghi nhớ cảm xúc này để tiếp thêm động lực sau này."
            }
        }
    };

    const fetchData = async () => {
        try {
            const result = await getJournalByID(id);
            
            setDetail(result);
            setLoading(false);
        } catch (error) {
            console.error("Get data error:", error);
        }
    };

    useEffect(() => {
        if(!detail || Object.keys(detail).length === 0) {
            setLoading(true);
            fetchData();
        }
    },[detail]);

    

    return (
        <>
            {loading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <Spinner />
                </div>
            )}
            {(detail && Object.keys(detail).length > 0) &&
                (<div className="w-full h-full overflow-hidden">
                    <div className="h-full overflow-y-auto overflow-y-auto w-full border border-gray-300 rounded-lg shadow-sm py-10 px-20 bg-white ">
                        <div className="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <h1 className="text-xl font-bold break-words sm:max-w-[70%]">
                                {detail.title}
                            </h1>
                            <h1 className="text-xl font-bold shrink-0">
                                {formatDateToDDMMYYYY(detail.date)}
                            </h1>
                        </div>

                        <div className="mb-2">
                            <h2 className="text-[35px]  ">Dear diary,</h2>
                        </div>

                        <div className="mb-10 text-justify">
                            <p className="text-[35px] ">{detail.text}</p>
                        </div>

                        <div className="mb-10">
                            <AIMessage detail={detail.ai} />
                        </div>
                    </div>
                </div>)}
        </>
    );
}