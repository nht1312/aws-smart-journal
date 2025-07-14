import { GoogleGenAI } from "@google/genai";
import { API_CONFIG, AI_PROMPTS } from "../config/api.config";
import { getCookie } from "../utils/tokenUtils";

// Initialize Gemini API
const genAI = new GoogleGenAI({
  apiKey: API_CONFIG.GEMINI_API_KEY,
});


class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError";
  }
}

export async function createJournalEntry(data) {
  const cookieToken = getCookie("token");
  try {
    const aiInsights = await generateJournalInsights(data.text);

    // Dispatch mood change event
    window.dispatchEvent(
      new CustomEvent("moodChanged", {
        detail: { mood: aiInsights.mood },
      })
    );

    const enrichedData = {
      ...data,
      ai: aiInsights,
    };

    const response = await fetch(`${API_CONFIG.BASE_URL}/journal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${cookieToken}`,
      },
      body: JSON.stringify(enrichedData),
    });

    if (!response.ok) {
      throw new APIError("Failed to create journal entry", response.status);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating journal entry:", error);
    throw error instanceof APIError
      ? error
      : new APIError("Internal server error", 500);
  }
}

export async function getJournalByID(id) {
  const cookieToken = getCookie("token");
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/get-journal-by-id?id=${id}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          'Authorization': `Bearer ${cookieToken}`,
        }
      }
    );

    if (!response.ok) {
      throw new APIError(
        `Failed to get journal entry with ID: ${id}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting journal entry:", error);
    throw error instanceof APIError
      ? error
      : new APIError("Internal server error", 500);
  }
}

export async function getJournalByUserID(userID) {
  const cookieToken = getCookie("token");
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/journals?userId=${userID}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          'Authorization': `Bearer ${cookieToken}`,
        }
      }
    );

    if (!response.ok) {
      throw new APIError(
        `Failed to get journal entries for user: ${userID}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting journal entries:", error);
    throw error instanceof APIError
      ? error
      : new APIError("Internal server error", 500);
  }
}

export async function getToken(code) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/get-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
      mode: "cors",
    });

    if (!response.ok) {
      throw new APIError("Failed to get authentication token", response.status);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to get token:", error);
    throw error instanceof APIError
      ? error
      : new APIError("Internal server error", 500);
  }
}

async function generateJournalInsights(text) {
  try {
    const [summaryResult, suggestionResult, moodResult, scoreREsult, songResult, keywordResult] = await Promise.all([
      genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: AI_PROMPTS.SUMMARY(text),
      }),
      genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: AI_PROMPTS.SUGGESTION(text),
      }),
      genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: AI_PROMPTS.MOOD(text),
      }),
      genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: AI_PROMPTS.SCORE(text),
      }),
      genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: AI_PROMPTS.SONG(text),
      }),
      genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: AI_PROMPTS.KEYWORDS(text),
      }),
    ]);

    return {
      summary: summaryResult.text,
      suggestion: suggestionResult.text,
      mood: moodResult.text,
      score: scoreREsult.text,
      song: songResult.text,
      keywords: keywordResult.text,
    };
  } catch (error) {
    console.error("Error generating journal insights:", error);
    throw new APIError("Failed to generate AI insights", 500);
  }
}


