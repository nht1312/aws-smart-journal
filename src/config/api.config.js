export const API_CONFIG = {
  BASE_URL: "https://vdft9knjc2.execute-api.ap-southeast-2.amazonaws.com/dev",
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
  YOUTUBE_API_KEY: import.meta.env.YOUTUBE_API_KEY,
};

export const AI_PROMPTS = {
  SUMMARY: (text) =>
    `Hãy cung cấp một bản tóm tắt ngắn gọn, đầy thấu cảm về nhật ký sau đây. Tập trung vào nội dung cảm xúc và các sự kiện chính: "${text}"`,
  SUGGESTION: (text) =>
    `Dựa trên nội dung nhật ký này, hãy đưa ra một lời khuyên hoặc gợi ý mang tính hỗ trợ và chân thành có thể giúp người viết, ít nhất 10 ý, tất cả các ý viết thành 1 đoạn văn mỗi ý cách nhau bằng dấu ".", không đánh số các ý hay bất kì các cách nào khác ngoài dấu chấm để tách các ý, không dùng dấu ; không xuống hàng các ý phải viết thành 1 đoạn văn. không sử dụng dấu "..." để liệt kê các ý thêm hay còn nữa: "${text}"`,
  MOOD: (text) =>
    `Phân tích cảm xúc chủ đạo trong đoạn nhật ký sau và chọn MỘT emoji phù hợp nhất để thể hiện cảm xúc đó. CHỈ trả về emoji, không kèm theo bất kỳ từ nào khác: "${text}"`,
  SCORE: (text) =>
    `Phân tích cảm xúc chủ đạo trong đoạn nhật ký sau và chấm điểm cảm xúc đó trên thang điểm từ 0 đến 5.Lưu ý:  CHỈ trả về MỘT con số, không kèm theo bất kỳ từ nào khác hay kèm theo thang điểm hay bất kì dấu chấm câu/ ký tự nào ở cuối, có thể là số thập phân, bắt buộc phải trả về 1 con số: "${text}"`,
  SONG: (text) =>
    `Phân tích cảm xúc chủ đạo trong đoạn nhật ký và đưa ra 1 tên bài hát dựa trên cảm xúc được phân tích và nghệ sĩ hát bài đó với tên bài theo format sau {tên bài hát}-{nghệ sĩ}.LƯU Ý: CHỈ đưa ra tên bài và nghê sĩ, bài hát và nghê sĩ  PHẢI CÓ TRÊN YOUTUBE và PHÙ HỢP VỚI CẢM XÚC CỦA ĐOẠN NHẬT KÝ, KHÔNG trả lời gì thêm không điền thêm cảm xúc hay bất cứ các ký tự nào khác, nếu không xác định được cảm xúc hãy phân tích chủ đề chính của đoạn nhật ký và tìm  một bài hát và nghệ sĩ tương ứng với chủ đều của nhật ký, nếu không phân tích được chủ đề luôn hãy đưa ra bài hát và nghệ sĩ tương ứng mang cảm trúc trung lập: ĐÂY LÀ ĐOẠN NHẬT KÝ "${text}"`,
  KEYWORDS: (text) =>
    `Phân tích cảm xúc chủ đạo trong đoạn nhật ký sau và chọn từ để biểu đạt cảm xúc đó. LƯU Ý: tối đa 3 từ tối thiểu 1 từ, các từ phải đơn giản, phân cách với nhau bởi một khoảng trắng trên cùng 1 dòng, chỉ đưa ra kết quả là các từ diễn tả cảm xúc KHÔNG thêm bất kì nội dung nào khác, không xuống hàng cuối dòng: "${text}"`,
};
