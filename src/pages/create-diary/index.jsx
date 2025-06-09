import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { createJournalEntry } from "../../api/journalApi.jsx";
import { LOGIN_PAGE } from "../../const/index.js";
import DateInput from "../../components/date-picker.jsx";
import Spinner from "../../components/spinner.jsx";
import SpeechToText from "../../components/SpeechToText";
import gsap from "gsap";

const INITIAL_FORM_STATE = {
  date: "",
  weather: "",
  title: "",
  text: "",
  userId: "",
};

const FormField = ({ label, error, children, delay = 0 }) => {
  const fieldRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      fieldRef.current,
      {
        opacity: 0,
        x: -20,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        delay,
        ease: "power2.out",
      }
    );
  }, [delay]);

  return (
    <div ref={fieldRef} className="mb-8">
      <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
        {label}
      </h2>
      {children}
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
};

export default function CreateDiary() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        userId: user["cognito:username"],
      }));
    }
  }, [user]);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        }
      );
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title?.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề cho nhật ký";
    }
    if (!formData.date) {
      newErrors.date = "Vui lòng nhập ngày của nhật ký";
    }
    if (!formData.text?.trim()) {
      newErrors.text = "Vui lòng nhập nội dung của nhật ký";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

      // Animate out before navigation
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          navigate(`/diary-detail/${result.data.id}`);
        },
      });
    } catch (error) {
      console.error("Submit error:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "An error occurred while saving. Please try again.",
      }));
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Bắt đầu ghi chép mới ✨
          </h1>
          <p className="text-gray-500 mt-2">
            Ghi lại suy nghĩ, cảm xúc và khoảnh khắc của bạn
          </p>
        </div>

        <FormField
          label={
            <>
              Tiêu đề <span className="text-2xl">📝</span>
            </>
          }
          error={errors.title}
          delay={0.1}
        >
          <input
            type="text"
            placeholder="Đặt tiêu đề cho trang nhật ký này của bạn..."
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="w-full px-4 py-3 text-lg rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-100 transition-all duration-200 outline-none"
          />
        </FormField>

        <FormField
          label={
            <>
              Ngày <span className="text-2xl">📅</span>
            </>
          }
          error={errors.date}
          delay={0.2}
        >
          <DateInput
            value={formData.date}
            placeholder="Chọn một ngày..."
            handleChange={(date) => handleInputChange("date", date)}
          />
        </FormField>

        <FormField
          label={
            <>
              Thời tiết <span className="text-2xl">🌤️</span>
            </>
          }
          delay={0.3}
        >
          <input
            type="text"
            placeholder="Thời tiết hôm nay như thế nào..."
            value={formData.weather}
            maxLength={15}
            onChange={(e) => handleInputChange("weather", e.target.value)}
            className="w-full px-4 py-3 text-lg rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-100 transition-all duration-200 outline-none"
          />
        </FormField>

        <FormField
          label={
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                Câu chuyện của bạn <span className="text-2xl">💭</span>
              </div>
              <SpeechToText onTranscript={handleSpeechInput} />
            </div>
          }
          error={errors.text}
          delay={0.4}
        >
          <textarea
            placeholder="Kể lại câu chuyện của bạn..."
            value={formData.text}
            onChange={(e) => handleInputChange("text", e.target.value)}
            className="w-full h-64 px-4 py-3 text-lg rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-100 transition-all duration-200 outline-none resize-none"
          />
        </FormField>

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-2">
            <span>⚠️</span> {errors.submit}
          </div>
        )}

        {user ? (
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "Saving..." : "Save Journal Entry"}
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <a
              href={LOGIN_PAGE}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Hãy đăng nhập để lưu lại nhật ký
            </a>
          </div>
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}
    </div>
  );
}
