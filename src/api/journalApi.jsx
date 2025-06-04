const API_LINK =
  "https://vdft9knjc2.execute-api.ap-southeast-2.amazonaws.com/dev/journal";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API
const genAI = new GoogleGenAI({
  apiKey: "AIzaSyB0YYZ0ImGoIieEVjQLO3NEWJDPHC3BHfs",
});

// Helper function to generate prompts
function generatePrompts(text) {
  return {
    summary: `Hãy cung cấp một bản tóm tắt ngắn gọn, đầy thấu cảm về nhật ký sau đây. Tập trung vào nội dung cảm xúc và các sự kiện chính: "${text}"`,
    suggestion: `Dựa trên nội dung nhật ký này, hãy đưa ra một lời khuyên hoặc gợi ý mang tính hỗ trợ và chân thành có thể giúp người viết: "${text}"`,
    mood: `Phân tích cảm xúc chủ đạo trong đoạn nhật ký sau và chọn MỘT emoji phù hợp nhất để thể hiện cảm xúc đó. CHỈ trả về emoji, không kèm theo bất kỳ từ nào khác: "${text}"`,
  };
}

export async function createJournalEntry(data) {
  try {
    // Generate AI insights first
    const aiInsights = await generateJournalInsights(data.text);

    // Dispatch mood change event
    const moodChangedEvent = new CustomEvent("moodChanged", {
      detail: { mood: aiInsights.mood },
    });
    window.dispatchEvent(moodChangedEvent);

    // Add AI insights to the data
    const enrichedData = {
      ...data,
      ai: {
        summary: aiInsights.summary,
        suggestion: aiInsights.suggestion,
        mood: aiInsights.mood,
      },
    };

    const response = await fetch("/api/journal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enrichedData),
    });

    if (!response.ok) {
      throw new Error("Failed to create journal entry");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating journal entry:", error);
    throw error;
  }
}

export async function getJournalByID(id) {
  try {
    const response = await fetch(`/api/get-journal-by-id?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get journal entry");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting journal entry:", error);
    throw error;
  }
}

export async function getJournalByUserID(userID) {
  try {
    const response = await fetch(`/api/journals?userId=${userID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get journal entry");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting journal entry:", error);
    throw error;
  }
}

export async function generateJournalInsights(text) {
  try {
    const prompts = generatePrompts(text);

    // Generate summary, suggestion, and mood in parallel
    const [summaryResult, suggestionResult, moodResult] = await Promise.all([
      genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompts.summary,
      }),
      genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompts.suggestion,
      }),
      genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompts.mood,
      }),
    ]);

    const summary = summaryResult.text;
    const suggestion = suggestionResult.text;
    const mood = moodResult.text;

    return {
      summary,
      suggestion,
      mood,
    };
  } catch (error) {
    console.error("Error generating journal insights:", error);
    throw error;
  }
}
