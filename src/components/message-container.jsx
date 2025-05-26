export default function AIMessage({detail}) {
    const {
        summary,
        suggestion,
    } = detail;
    return (
        <>
            <div className="border border-gray-300 rounded-lg p-6 mb-8">
                <h2 className="text-[30px]  mt-4 mb-2">💌 Thoughts for You</h2>
                <p className="mb-8 text-[30px] text-justify">{summary}</p>
            </div>
            
            <div className="border border-gray-300 rounded-lg p-6 mb-8">
                <h2 className="text-[30px] semibold mt-4 mb-2">💖 A piece of advice</h2>
                <p className="mb-8 text-[30px] text-justify">{suggestion}</p>
            </div>
        </>
    );
}