# 🌸 Mochi English Studio - Web Học Tiếng Anh Cá Nhân Hóa & AI

> Ứng dụng học tiếng Anh đa trình độ (A0 → C1) kết hợp Trợ lý ảo Mochi AI, Flashcards 3D, Luyện đề thông minh và Thử thách kiểm tra từ vựng 4 giai đoạn.

🌐 **Trải nghiệm trực tuyến**: [https://devlor04.github.io/Study_EN/](https://devlor04.github.io/Study_EN/)

---

## ✨ Tính Năng Nổi Bật

### 1. 🗺️ Lộ Trình Cá Nhân Hóa & Checklist Hằng Ngày
- Tùy chỉnh theo 3 cấp độ:
  - **🌱 Mất gốc (A0 → A2)**: Nền tảng phát âm IPA, từ vựng sinh hoạt & câu giao tiếp cơ bản.
  - **🌷 Cơ bản (A2 → B2)**: Chắc ngữ pháp, phản xạ nói trôi chảy & TOEIC 700+.
  - **👑 Trung cấp (B1 → C1)**: Từ vựng học thuật, phản xạ chuyên sâu & TOEIC 850+ / IELTS.
- Tự động đếm ngày học (90 ngày) và tích lũy điểm thưởng XP.
- Nút **"Tạo bài học mới hôm nay"** tự động làm mới chủ đề, từ vựng và bài tập mỗi ngày.

### 2. 🎯 Thử Thách Kiểm Tra Từ Vựng 4 Giai Đoạn (Vocab Mastery)
Từ mới chỉ được tính là đã học sau khi vượt qua đủ 4 thử thách:
- **Bước 1 (Ghép nghĩa)**: Nhận diện và chọn nghĩa tiếng Việt chính xác.
- **Bước 2 (Nhớ chính tả)**: Nhớ mặt chữ và gõ lại chính xác từ tiếng Anh.
- **Bước 3 (Ứng dụng)**: Đặt một câu tiếng Anh ngắn có sử dụng từ vựng đó, được Mochi AI phân tích và sửa lỗi.
- **Bước 4 (Phản xạ & Phát âm)**: Bật Micro phát âm chuẩn xác từ mới và đọc to câu hoàn chỉnh.

### 3. 📝 Ngữ Pháp & Đọc Hiểu Thực Chiến
- Luyện đề trắc nghiệm chia theo từng chủ đề: Thì hiện tại, TOEIC Part 5 & Đọc hiểu email công sở Part 7.
- Chấm điểm tức thì, giải thích chi tiết đáp án bằng tiếng Việt.
- Hỗ trợ AI tự động sinh đề thi mới theo yêu cầu.

### 4. ✍️ Góc Luyện Viết (Writing Studio)
- Đồng hồ bấm giờ và đếm số từ theo thời gian thực.
- Đề bài đa dạng từ viết đoạn ngắn giới thiệu bản thân đến email thương mại.
- Mochi AI chấm bài, sửa lỗi ngữ pháp chi tiết và viết lại phiên bản nâng cấp chuẩn mực.

### 5. 🎙️ Luyện Nói 1-1 Với Mochi AI (Speaking Partner)
- Web Speech API với chế độ **Continuous Recognition** (thu âm liên tục, chống ngắt mic đột ngột).
- Nhận diện giọng nói thời gian thực và tự động sửa câu nói của bạn lên văn phong tự nhiên hơn.
- Text-to-Speech (TTS) đọc phản hồi tự nhiên với tùy chọn giọng Anh - Mỹ (US) hoặc Anh - Anh (UK).

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: HTML5, Tailwind CSS, Google Fonts (Quicksand & Nunito), Font Awesome Icons.
- **JavaScript**: Vanilla JS (ES6+) kiến trúc Module hóa sạch sẽ, độc lập:
  - `js/config.js`: Cấu hình Tailwind theme & hằng số.
  - `js/data.js`: Kho bài học & ngân hàng câu hỏi đề thi.
  - `js/storage.js`: Quản lý LocalStorage & sao lưu/khôi phục tiến trình.
  - `js/api.js`: Tích hợp Google Gemini API & Smart Offline Generator.
  - `js/speech.js`: Bộ máy xử lý âm thanh & nhận diện giọng nói liên tục.
  - `js/roadmap.js`: Điều hướng lộ trình & nhiệm vụ ngày.
  - `js/flashcards.js`: Bộ thẻ từ vựng 3D tương tác.
  - `js/vocab-challenge.js`: Bộ điều khiển 4 giai đoạn kiểm tra từ vựng.
  - `js/quiz.js`: Hệ thống trắc nghiệm & chấm điểm.
  - `js/writing.js`: Bộ máy luyện viết & AI chấm bài.
  - `js/speaking.js`: Hội thoại phản xạ 1-1 với AI.
  - `js/app.js`: Điểm khởi chạy ứng dụng & điều hướng.
- **CI/CD**: GitHub Actions tự động build và deploy lên GitHub Pages mỗi khi push code lên nhánh `main`.

---

## 🚀 Cài Đặt & Chạy Trực Tiếp

1. Clone repository về máy:
   ```bash
   git clone https://github.com/Devlor04/Study_EN.git
   cd Study_EN
   ```
2. Mở file `index.html` trực tiếp trên trình duyệt (Chrome, Edge, Brave...) để trải nghiệm đầy đủ tính năng!

---

*Phát triển bởi [Devlor04](https://github.com/Devlor04) 💖*
