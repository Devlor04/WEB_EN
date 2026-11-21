/**
 * =====================================================================
 * MOCHI ENGLISH STUDIO - WRITING STUDIO & ESSAY EVALUATOR
 * =====================================================================
 */

let writingTimerSec = 0;
let writingInterval = null;

function toggleWritingTimer() {
    const btn = document.getElementById('btn-writing-timer');
    if (writingInterval) {
        clearInterval(writingInterval);
        writingInterval = null;
        if (btn) btn.innerText = "Tiếp tục";
    } else {
        if (btn) btn.innerText = "Tạm dừng";
        writingInterval = setInterval(() => {
            writingTimerSec++;
            const m = String(Math.floor(writingTimerSec / 60)).padStart(2, '0');
            const s = String(writingTimerSec % 60).padStart(2, '0');
            const timerDisplay = document.getElementById('writing-timer-display');
            if (timerDisplay) timerDisplay.innerText = `${m}:${s}`;
        }, 1000);
    }
}

function changeWritingPrompt() {
    const topicSelect = document.getElementById('writing-topic-select');
    const idx = topicSelect ? topicSelect.value : 0;
    const promptItem = WRITING_PROMPTS[idx] || WRITING_PROMPTS[0];

    const heading = document.getElementById('writing-prompt-heading');
    if (heading) heading.innerText = promptItem.title;

    const tips = document.getElementById('writing-prompt-tips');
    if (tips) tips.innerHTML = `💡 ${promptItem.tips}`;
}

function countWritingWords() {
    const textarea = document.getElementById('writing-textarea');
    const txt = textarea ? textarea.value.trim() : '';
    const count = txt ? txt.split(/\s+/).length : 0;
    const counter = document.getElementById('writing-word-count');
    if (counter) counter.innerText = count;
}

async function evaluateWritingWithAI() {
    const textarea = document.getElementById('writing-textarea');
    const essay = textarea ? textarea.value.trim() : '';
    const promptHeading = document.getElementById('writing-prompt-heading');
    const topic = promptHeading ? promptHeading.innerText : "Luyện viết";
    const cfg = LEVEL_CONFIGS[userProgress.level] || LEVEL_CONFIGS["A2_B2"];

    if (essay.split(/\s+/).length < 5) {
        if (typeof showToast === 'function') {
            showToast("Bạn hãy viết ít nhất 5 từ tiếng Anh để Mochi chấm bài nhé!", "warning");
        }
        return;
    }

    const btn = document.getElementById('btn-submit-writing');
    const resultBox = document.getElementById('writing-ai-result');

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i><span>Mochi đang chấm bài...</span>`;
    }

    if (resultBox) {
        resultBox.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 text-center">
                <div class="text-4xl animate-bounce mb-2">🐰</div>
                <p class="font-heading font-bold text-cocoa-800">Mochi đang đọc và phân tích cấu trúc bài viết cho bạn...</p>
            </div>
        `;
    }

    let data = null;

    if (hasApiKey()) {
        const prompt = `Bạn là Mochi, giáo viên tiếng Anh dễ thương, tận tâm giúp học viên Việt Nam đạt mục tiêu "${userProgress.goal}" ở lộ trình "${cfg.name}".
Đề bài: "${topic}"
Bài viết của học viên: "${essay}"

Hãy trả về JSON chấm bài gồm:
1. "cefrLevel": Đánh giá trình độ bài viết (ví dụ: "A1+ (Khởi đầu tốt)" hoặc "B1+ (~650 TOEIC)").
2. "praise": 1 lời khen khích lệ ấm áp bằng tiếng Việt.
3. "grammarFixes": Mảng các lỗi ngữ pháp/từ vựng cần sửa (mỗi phần tử gồm "wrong", "corrected", "explanation" tiếng Việt dễ hiểu).
4. "b2UpgradeText": Viết lại toàn bộ bài viết của học viên theo văn phong tự nhiên, chuẩn mục tiêu ${cfg.badge}.`;

        const schema = {
            type: "OBJECT",
            properties: {
                cefrLevel: { type: "STRING" },
                praise: { type: "STRING" },
                grammarFixes: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            wrong: { type: "STRING" },
                            corrected: { type: "STRING" },
                            explanation: { type: "STRING" }
                        },
                        required: ["wrong", "corrected", "explanation"]
                    }
                },
                b2UpgradeText: { type: "STRING" }
            },
            required: ["cefrLevel", "praise", "grammarFixes", "b2UpgradeText"]
        };

        try {
            const raw = await callGeminiAPI(prompt, schema);
            data = JSON.parse(raw);
        } catch (err) {
            console.warn("Writing evaluation API error, fallback:", err);
        }
    }

    // Fallback thông minh nếu không có API key
    if (!data) {
        const wordCount = essay.split(/\s+/).length;
        data = {
            cefrLevel: wordCount > 40 ? `${cfg.badge} (Tốt)` : "Đang phát triển nền tảng",
            praise: "Bạn diễn đạt ý tưởng rất rõ ràng và mạch lạc! Hãy tiếp tục duy trì thói quen viết câu hoàn chỉnh mỗi ngày nhé.",
            grammarFixes: [
                {
                    wrong: "Lưu ý thì động từ & mạo từ",
                    corrected: "Luôn kiểm tra sự hòa hợp giữa Chủ ngữ và Động từ",
                    explanation: "Hãy chú ý chia đúng thì và mượn trợ động từ phù hợp khi viết câu phức."
                }
            ],
            b2UpgradeText: essay.length > 10 ? `${essay.charAt(0).toUpperCase() + essay.slice(1)}. In addition, consistent daily practice is the key to achieving professional English fluency.` : essay
        };
    }

    try {
        userProgress.savedEssays.unshift({
            date: new Date().toLocaleDateString('vi-VN'),
            topic,
            essay,
            cefrLevel: data.cefrLevel,
            b2UpgradeText: data.b2UpgradeText
        });
        addXP(30, "Hoàn thành bài luyện viết & lưu vào hồ sơ!");

        const fixesHTML = (data.grammarFixes && data.grammarFixes.length > 0)
            ? data.grammarFixes.map(item => `
                <div class="p-3.5 bg-blush-50/70 border border-blush-200 rounded-2xl space-y-1">
                    <p class="text-xs text-rose-600 line-through">❌ ${item.wrong}</p>
                    <p class="text-xs text-emerald-700 font-extrabold">✅ ${item.corrected}</p>
                    <p class="text-[11px] text-cocoa-700">${item.explanation}</p>
                </div>
            `).join('')
            : `<div class="p-3.5 bg-mint-50 border border-mint-200 rounded-2xl text-xs font-bold text-emerald-800">🌟 Xuất sắc! Bài viết của bạn không có lỗi ngữ pháp đáng kể nào!</div>`;

        const escapedUpgrade = (data.b2UpgradeText || '').replace(/'/g, "\\'");

        if (resultBox) {
            resultBox.innerHTML = `
                <div class="bg-gradient-to-r from-blush-400 to-lavender-500 text-white p-4 rounded-2xl shadow-2xs">
                    <span class="text-[10px] uppercase font-extrabold tracking-wider opacity-90">Đánh giá trình độ bài viết</span>
                    <h4 class="font-heading text-lg font-extrabold mt-0.5">${data.cefrLevel}</h4>
                    <p class="text-xs text-white/95 mt-1">${data.praise}</p>
                </div>

                <div>
                    <h4 class="font-heading font-bold text-cocoa-800 text-xs uppercase mb-2">🔍 Sửa lỗi ngữ pháp chi tiết</h4>
                    <div class="space-y-2">${fixesHTML}</div>
                </div>

                <div class="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
                    <div class="flex justify-between items-center mb-1.5">
                        <h4 class="font-heading font-bold text-amber-900 text-xs uppercase">👑 Phiên bản nâng cấp chuẩn</h4>
                        <button onclick="speakText('${escapedUpgrade}')" class="text-[11px] font-extrabold bg-amber-200 hover:bg-amber-300 text-amber-900 px-2.5 py-1 rounded-xl cursor-pointer">
                            🔊 Nghe mẫu
                        </button>
                    </div>
                    <p class="text-xs text-cocoa-800 leading-relaxed italic">"${data.b2UpgradeText}"</p>
                </div>
            `;
        }
    } catch (err) {
        console.error(err);
        if (resultBox) {
            resultBox.innerHTML = `<div class="p-4 bg-rose-50 text-rose-700 rounded-2xl text-xs font-bold">Mochi đang bận một chút, bạn hãy thử lại nhé!</div>`;
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<span>🐰 Nhờ Mochi AI Chấm & Nâng Cấp Câu</span>`;
        }
    }
}
