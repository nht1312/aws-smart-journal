export const API_CONFIG = {
  BASE_URL: "https://vdft9knjc2.execute-api.ap-southeast-2.amazonaws.com/dev",
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
};

export const AI_PROMPTS = {
  SUMMARY: (text) =>
    `Hãy cung cấp một bản tóm tắt ngắn gọn, đầy thấu cảm về nhật ký sau đây. Tập trung vào nội dung cảm xúc và các sự kiện chính: "${text}"`,
  SUGGESTION: (text) =>
    `Dựa trên nội dung nhật ký này, hãy đưa ra một lời khuyên hoặc gợi ý mang tính hỗ trợ và chân thành có thể giúp người viết: "${text}"`,
  MOOD: (text) =>
    `Phân tích cảm xúc chủ đạo trong đoạn nhật ký sau và chọn MỘT emoji phù hợp nhất để thể hiện cảm xúc đó. CHỈ trả về emoji, không kèm theo bất kỳ từ nào khác: "${text}"`,
};
