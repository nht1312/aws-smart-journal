import { useEffect, useRef, useState } from "react";


export function useFetchTrack({ handleGetData, flag, setData, type})  {
    const lastKeywordRef = useRef(null);
    const [isDoneFetchData, setIsDoneFetchData] = useState(false);
    const fetchData = async (flag) => {
        try {
            const result = type
                ? await handleGetData(flag, type)
                : await handleGetData(flag);
            setData(result);
            //console.log(result);
            setIsDoneFetchData(true);
        } catch (error) {
            console.error("Get data error:", error);
        }
    };

    useEffect(() => {
        if (!flag || flag === "") {
            setData(null);
            lastKeywordRef.current = null;
            return;
        }

        if (lastKeywordRef.current === flag) {
            return;
        }

        fetchData(flag);
        lastKeywordRef.current = flag;
    }, [flag]);

    return { isDoneFetchData };
}