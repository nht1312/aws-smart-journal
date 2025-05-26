import { formatDateToDDMMYYYY } from "../utils/stringUtils";
import { useNavigate } from "react-router-dom";

export default function Card({data}) {
    const { ai } = data;
    const navigation = useNavigate();

    const handleClick = (event) => {
        const buttonId = event.target.id;
        navigation("/diary-detail/" + buttonId);
    };
    return (
        <div className="w-120 h-120 bg-white shadow-md rounded-md overflow-hidden border border-gray-300 p-5 pb-5 ml-10 mb-5">
            <div className="h-[45%]  bg-gray-100 rounded-md overflow-hidden">
                <img
                    src="/card-img.jpg"
                    alt="Pantone"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="h-[40%] flex flex-col mt-3 overflow-y-auto">
                <h2 className="text-[20px] break-words font-semibold">{data.title}</h2>
                <div className="flex mt-2">
                    <h3 className="text-[17px] font-semibold mr-3">Date:</h3>
                    <p className="text-[17px] text-gray-600">{formatDateToDDMMYYYY(data.date)}</p>
                </div>
                
                <div className="flex">
                    <h3 className="text-[17px] font-semibold mr-3">Mood:</h3>
                    <p className="text-[17px] text-gray-600">{ai.mood}</p>
                </div>

                <div className="flex">
                    <h3 className="text-[17px] font-semibold mr-3">Weather:</h3>
                    <p className="text-[17px] break-words text-gray-600">{data.weather}</p>
                </div>
            </div>
            <div className="text-right mt-3">
                <button  id={data.id} onClick={handleClick}>
                    Detail
                </button>
            </div>
        </div>
    );
}