import { useState, useCallback, useRef } from "react";

const useSpeechRecognition = (options = {}) => {
  const {
    language = "vi-VN",
    continuous = true,
    interimResults = true,
    onResult = () => {},
    onError = () => {},
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const manualStopRef = useRef(false);

  // Initialize recognition instance once
  const initializeRecognition = useCallback(() => {
    if (recognitionRef.current) {
      return recognitionRef.current;
    }

    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      const error = "Browser không hỗ trợ nhận dạng giọng nói.";
      setError(error);
      throw new Error(error);
    }

    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    const instance = new SpeechRecognition();

    instance.continuous = continuous;
    instance.interimResults = interimResults;
    instance.lang = language;

    instance.onstart = () => {
      setIsListening(true);
      setError(null);
      manualStopRef.current = false;
    };

    instance.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      const isFinal = event.results[current].isFinal;

      setTranscript(transcript);
      onResult({ transcript, isFinal });
    };

    instance.onerror = (event) => {
      let errorMessage;
      switch (event.error) {
        case "not-allowed":
          errorMessage = "Vui lòng cho phép truy cập microphone";
          break;
        case "network":
          errorMessage = "Lỗi kết nối mạng";
          break;
        case "no-speech":
          errorMessage = "Không phát hiện giọng nói";
          break;
        case "audio-capture":
          errorMessage = "Không tìm thấy microphone";
          break;
        default:
          errorMessage = "Đã xảy ra lỗi khi nhận dạng giọng nói";
      }
      setError(errorMessage);
      onError(errorMessage);
      setIsListening(false);
    };

    instance.onend = () => {
      setIsListening(false);
      if (continuous && !manualStopRef.current && !error) {
        try {
          instance.start();
        } catch (err) {
          setError("Lỗi khi khởi động lại nhận dạng giọng nói");
          onError(err);
        }
      }
    };

    recognitionRef.current = instance;
    return instance;
  }, [
    continuous,
    interimResults,
    language,
    onResult,
    onError,
    error,
    isListening,
  ]);

  const startListening = useCallback(() => {
    try {
      const recognition = initializeRecognition();
      manualStopRef.current = false;
      recognition.start();
    } catch (err) {
      setError("Lỗi khi bắt đầu nhận dạng giọng nói");
      onError(err);
    }
  }, [initializeRecognition, onError]);

  const stopListening = useCallback(() => {
    try {
      if (recognitionRef.current) {
        manualStopRef.current = true;
        recognitionRef.current.stop();
        setIsListening(false);
      }
    } catch (err) {
      setError("Lỗi khi dừng nhận dạng giọng nói");
      onError(err);
    }
  }, [onError]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (recognitionRef.current) {
      try {
        manualStopRef.current = true;
        recognitionRef.current.stop();
      } catch (err) {
        console.error("Error stopping recognition:", err);
      }
      recognitionRef.current = null;
    }
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    transcript,
    error,
    cleanup,
  };
};

export default useSpeechRecognition;
