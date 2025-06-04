import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { createJournalEntry } from "../../api/journalApi.jsx";
import { LOGIN_PAGE } from "../../const/index.js";
import DateInput from "../../components/date-picker.jsx";
import Spinner from "../../components/spinner.jsx";
import SpeechToText from "../../components/SpeechToText";

const INITIAL_FORM_STATE = {
  date: "",
  weather: "",
  title: "",
  text: "",
  userId: "",
};

export default function CreateDiary() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        userId: user["cognito:username"],
      }));
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title?.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề";
    }
    if (!formData.date) {
      newErrors.date = "Vui lòng chọn ngày";
    }
    if (!formData.text?.trim()) {
      newErrors.text = "Vui lòng nhập nội dung";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSpeechInput = (transcript) => {
    setFormData((prevData) => ({
      ...prevData,
      text: prevData.text ? `${prevData.text} ${transcript}` : transcript,
    }));
    if (errors.text) {
      setErrors((prev) => ({ ...prev, text: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      console.error("User not authenticated");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await createJournalEntry(formData);
      console.log("Submitted successfully:", result);
      navigate(`/diary-detail/${result.data.id}`);
    } catch (error) {
      console.error("Submit error:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Có lỗi xảy ra khi lưu nhật ký. Vui lòng thử lại.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const renderField = (label, component, error) => (
    <div className="mb-8">
      <h2 className="text-[35px] font-semibold mt-4 mb-2">{label}</h2>
      {component}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="h-full overflow-y-auto w-full border border-gray-300 rounded-lg shadow-sm py-10 px-20 bg-white">
        <h1 className="text-xl font-bold mb-8 mt-3 text-center">
          ~ Dear Diary ~
        </h1>

        {renderField(
          "Title",
          <input
            type="text"
            placeholder="Add a title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="w-full border-0 border-b-2 border-transparent text-[30px] focus:border-gray-400 focus:outline-none transition duration-200"
          />,
          errors.title
        )}

        {renderField(
          "Date",
          <DateInput
            value={formData.date}
            placeholder="Add a date"
            handleChange={(date) => handleInputChange("date", date)}
          />,
          errors.date
        )}

        {renderField(
          "Weather:",
          <input
            type="text"
            placeholder="How is the weather"
            value={formData.weather}
            maxLength={15}
            onChange={(e) => handleInputChange("weather", e.target.value)}
            className="w-full border-0 border-b-2 border-transparent text-[30px] focus:border-gray-400 focus:outline-none transition duration-200"
          />
        )}

        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-[35px] font-semibold mt-4 mb-2">The story:</h2>
            <SpeechToText onTranscript={handleSpeechInput} />
          </div>
          <textarea
            placeholder="How is your day"
            value={formData.text}
            onChange={(e) => handleInputChange("text", e.target.value)}
            className="w-full h-50 p-5 resize-none border border-gray-300 rounded-md focus:border-black focus:outline-none text-[30px] transition duration-200"
          />
          {errors.text && (
            <p className="text-red-500 text-sm mt-1">{errors.text}</p>
          )}
        </div>

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
            {errors.submit}
          </div>
        )}

        {user ? (
          <div className="flex justify-end mt-6">
            <button
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : "Add"}
            </button>
          </div>
        ) : (
          <div className="flex justify-end mt-6">
            <a
              href={LOGIN_PAGE}
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
              Please login to save your journal
            </a>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
}
