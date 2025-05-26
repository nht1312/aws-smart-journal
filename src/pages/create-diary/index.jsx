import React, { useState } from "react";
import DateInput from "../../components/date-picker.jsx";
import Spinner from "../../components/spinner.jsx";
import { createJournalEntry } from "../../api/journalApi.jsx";
import { useNavigate } from "react-router-dom";

export default function CreateDiary() {
    const navigation = useNavigate();
    const [formData, setFormData] = useState({
        date: "",
        weather: "",
        title: "",
        text: "",
        "userId": "user123",
    });
    const [loading, setLoading] = useState(false)

    const handleInputChange = (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const result = await createJournalEntry(formData);
            console.log("Submitted successfully:", result);

            navigation("/diary-detail/" + result.data.id);
        } catch (error) {
            console.error("Submit error:", error);
        }
        setLoading(false);
    };
    return (
        <div className="w-full h-full overflow-hidden">
            <div className="h-full overflow-y-auto overflow-y-auto w-full border border-gray-300 rounded-lg shadow-sm py-10 px-20 bg-white ">
                <h1 className="text-xl font-bold mb-8 mt-3 text-center ">~ Dear Diary ~</h1>
                <div className="mb-8">
                    <h2 className="text-[35px] font-semibold mt-4">Title</h2>
                    <input
                        type="text"
                        placeholder="Add a title"
                        className="border-0 border-b-2 border-transparent text-[30px] focus:border-gray-400 focus:outline-none transition duration-200"
                        onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                </div>

                <div className="mb-8">
                    <h2 className="text-[35px] font-semibold mt-4 mb-2">Date</h2>
                    <DateInput
                        value={formData.date}
                        placeholder={"Add a date"}
                        handleChange={(date) => handleInputChange("date", date)}
                    />
                </div>

                <div className="mb-8">
                    <h2 className="text-[35px] font-semibold mt-4 mb-2">Weather:</h2>
                    <input
                        type="text"
                        placeholder="How is the weather"
                        maxLength={15}
                        onChange={(e) => handleInputChange("weather", e.target.value)}
                        className="border-0 border-b-2 border-transparent text-[30px] focus:border-gray-400 focus:outline-none transition duration-200"
                    />
                </div>

                <div className="mb-8">
                    <h2 className="text-[35px] font-semibold mt-4 mb-2">The story:</h2>
                    <textarea
                        placeholder="How is your day"
                        className="text-[30px]  w-full h-50 p-5 resize-none border border-gray-300 rounded-md focus:border-black focus:outline-none p-3 text-sm text-gray-800 transition duration-200"
                        onChange={(e) => handleInputChange("text", e.target.value)}
                    />
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
                        onClick={handleSubmit}
                    >
                        Add
                    </button>
                </div>

                {loading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 h-screen w-screen">
                        <Spinner />
                    </div>
                )}
            </div>


        </div>
    );
}