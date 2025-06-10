import React, { useCallback, useState, useEffect } from "react";
import useSpeechRecognition from "../hooks/useSpeechRecognition";

const ERROR_TIMEOUT = 3000; // 3 seconds

const SpeechToText = ({ onTranscript, language = "vi-VN" }) => {
  const [showError, setShowError] = useState(false);
  const [errorTimeout, setErrorTimeout] = useState(null);

  const handleResult = useCallback(
    ({ transcript, isFinal }) => {
      if (isFinal && transcript.trim()) {
        onTranscript(transcript);
      }
    },
    [onTranscript]
  );

  const handleError = useCallback(
    (error) => {
      console.error("Speech recognition error:", error);
      setShowError(true);

      // Clear any existing timeout
      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }

      // Set new timeout to hide error
      const timeout = setTimeout(() => {
        setShowError(false);
      }, ERROR_TIMEOUT);
      setErrorTimeout(timeout);
    },
    [errorTimeout]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }
    };
  }, [errorTimeout]);

  const { isListening, startListening, stopListening, error, cleanup } =
    useSpeechRecognition({
      language,
      continuous: true,
      interimResults: true,
      onResult: handleResult,
      onError: handleError,
    });

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <div className="flex items-center gap-2 relative">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`p-2 rounded-full transition-all duration-200 ${
          isListening
            ? "bg-red-500 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600"
            : "bg-blue-500 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600"
        }`}
        title={isListening ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
        disabled={!window.webkitSpeechRecognition && !window.SpeechRecognition}
      >
        <svg
          className={`w-6 h-6 text-white ${isListening ? "animate-pulse" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              isListening
                ? "M21 12a9 9 0 11-18 0 9 9 0 0118 0z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                : "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            }
          />
        </svg>
      </button>

      {error && showError && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-red-100 border border-red-300 rounded-md shadow-md z-10 min-w-[200px] animate-fade-in">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-red-500 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      {isListening && (
        <span className="text-green-500 text-sm animate-pulse">
          Đang lắng nghe...
        </span>
      )}
    </div>
  );
};

export default SpeechToText;
