/**
 * =====================================================================
 * MOCHI ENGLISH STUDIO - GEMINI API & SMART OFFLINE FALLBACK ENGINE
 * =====================================================================
 */

function getApiKey() {
    return localStorage.getItem(API_KEY_STORAGE_KEY) || "";
}

function setApiKey(key) {
    if (key && key.trim()) {
        localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
    } else {
        localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
}

function hasApiKey() {
    const key = getApiKey();
    return !!(key && key.trim().length > 5);
}

// Modal Cài đặt API Key
function openApiKeyModal() {
    const m = document.getElementById('apikey-modal');
    const input = document.getElementById('input-gemini-key');
    if (input) input.value = getApiKey();
    if (m) m.classList.remove('hidden');
}

function closeApiKeyModal() {
    const m = document.getElementById('apikey-modal');
    if (m) m.classList.add('hidden');
}

function saveApiKeyFromModal() {
    const input = document.getElementById('input-gemini-key');
    if (input) {
        const val = input.value.trim();
        setApiKey(val);
        closeApiKeyModal();
        if (typeof showToast === 'function') {
            if (val) {
                showToast("Đã lưu Gemini API Key thành công! 🤖✨", "success");
            } else {
                showToast("Đã xóa API Key. Ứng dụng sẽ dùng bộ bài học thông minh tích hợp!", "info");
            }
        }
    }
}

/**
 * Gọi Google Gemini API với cơ chế tự động thử lại (Exponential backoff)
 */
async function callGeminiAPI(promptText, responseSchema) {
    const key = getApiKey();
    if (!key) {
        throw new Error("NO_API_KEY");
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`;
    const payload = {
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: responseSchema
        }
    };

    let retryDelay = 1000;
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errData = await response.text();
                throw new Error(`API HTTP Error ${response.status}: ${errData}`);
            }
            const json = await response.json();
            const output = json?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!output) throw new Error("Empty Gemini output");
            return output;
        } catch (err) {
            if (attempt === 2) throw err;
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            retryDelay *= 2;
        }
    }
}

/**
 * SMART FALLBACK GENERATOR:
 * Tự động tạo bài học mới ngay lập tức mà không bao giờ bị lỗi kết nối!
 */
function generateLessonFromBank(level, goal, day) {
    const bankList = LESSON_BANK[level] || LESSON_BANK["A2_B2"];
    const randomLesson = bankList[Math.floor(Math.random() * bankList.length)];
    
    // Tạo tiêu đề bài học hấp dẫn theo ngày và mục tiêu
    const prefixes = [
        `Ngày ${day}: ${randomLesson.title}`,
        `Chủ đề Ngày ${day}: Bứt phá ${goal} với ${randomLesson.title}`,
        `Bài học Ngày ${day}: Thực chiến ${goal} - ${randomLesson.title}`
    ];
    const lessonTitle = prefixes[day % prefixes.length];

    // Trộn các từ vựng
    const words = JSON.parse(JSON.stringify(randomLesson.words)).sort(() => 0.5 - Math.random());
    const quizQuestions = JSON.parse(JSON.stringify(randomLesson.questions)).sort(() => 0.5 - Math.random());

    return {
        lessonTitle,
        words,
        quizQuestions
    };
}
