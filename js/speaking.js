/**
 * =====================================================================
 * MOCHI ENGLISH STUDIO - SPEAKING PARTNER & FLOATING AI TUTOR
 * =====================================================================
 */

let chatConversation = [];

function startNewSpeakingSession() {
    const scenarioSelect = document.getElementById('speaking-scenario-select');
    const topic = scenarioSelect ? scenarioSelect.value : "Daily Routine & English Goals";
    chatConversation = [];
    const area = document.getElementById('speaking-messages-area');
    if (!area) return;
    area.innerHTML = '';

    const openers = {
        "Beginner Self-Introduction": {
            en: "Hello! Nice to meet you! I am Mochi 🐰. What is your name, and where are you from?",
            vi: "Xin chào! Rất vui được gặp bạn! Mình là Mochi 🐰. Tên bạn là gì và bạn đến từ đâu?"
        },
        "Daily Routine & English Goals": {
            en: "Hi friend! I'm Mochi 🐰. Let's practice speaking together! Tell me, what is your daily schedule like, and what are you doing right now to improve your English?",
            vi: "Chào bạn! Mình là Mochi 🐰. Hãy kể cho mình nghe lịch trình hằng ngày của bạn như thế nào và hiện tại bạn đang làm gì để cải thiện tiếng Anh nhé?"
        },
        "Office Small Talk & Meetings": {
            en: "Good morning! Imagine we are colleagues at an international company. We have a big project deadline this Friday. How are you preparing for it?",
            vi: "Chào buổi sáng! Hãy tưởng tượng chúng ta là đồng nghiệp. Thứ Sáu này là hạn chót dự án lớn, bạn đang chuẩn bị đến đâu rồi?"
        },
        "Job Interview Practice": {
            en: "Welcome to the interview! Thank you for submitting your resume. Could you introduce yourself briefly and tell me about your career goals?",
            vi: "Chào mừng bạn đến buổi phỏng vấn! Bạn hãy giới thiệu ngắn gọn về bản thân và mục tiêu nghề nghiệp của mình nhé?"
        },
        "Travel & Cafe Chat": {
            en: "Hello! Welcome to Mochi Cozy Cafe ☕. Would you like a table near the window? Also, what kind of drinks or food do you usually order?",
            vi: "Xin chào! Chào mừng đến Mochi Cozy Cafe ☕. Bạn muốn ngồi bàn cạnh cửa sổ chứ? Bạn thường thích gọi đồ uống hay món ăn gì?"
        }
    };

    const first = openers[topic] || openers["Daily Routine & English Goals"];
    renderAIMessageBubble(first.en, first.vi, null);
    chatConversation.push({ role: "model", text: first.en });
    if (autoSpeakReplies && typeof speakText === 'function') {
        speakText(first.en);
    }
}

function renderUserMessageBubble(text, upgradeBoxId) {
    const area = document.getElementById('speaking-messages-area');
    if (!area) return;
    const div = document.createElement('div');
    div.className = "flex flex-col items-end space-y-1.5";
    div.innerHTML = `
        <div class="max-w-[85%] sm:max-w-[70%] bg-gradient-to-r from-blush-400 to-blush-500 text-white px-4 py-3 rounded-3xl rounded-tr-sm shadow-2xs text-sm font-medium leading-relaxed">
            ${text}
        </div>
        <div id="${upgradeBoxId}" class="max-w-[85%] sm:max-w-[70%] bg-amber-50 border border-amber-200 text-cocoa-800 px-3.5 py-2.5 rounded-2xl text-xs">
            <span class="text-amber-700 font-bold"><i class="fa-solid fa-spinner fa-spin mr-1"></i>Mochi đang sửa ngữ pháp & gợi ý câu hay hơn...</span>
        </div>
    `;
    area.appendChild(div);
    area.scrollTop = area.scrollHeight;
}

function renderAIMessageBubble(enText, viText, hintText) {
    const area = document.getElementById('speaking-messages-area');
    if (!area) return;
    const div = document.createElement('div');
    div.className = "flex items-start gap-3 max-w-[90%] sm:max-w-[78%]";
    const escapedEn = (enText || '').replace(/'/g, "\\'");

    div.innerHTML = `
        <div class="w-9 h-9 rounded-2xl bg-blush-100 border border-blush-200 text-lg flex items-center justify-center shrink-0 mt-1">
            🐰
        </div>
        <div class="bg-white border-2 border-blush-100 rounded-3xl rounded-tl-sm p-4 shadow-card space-y-2">
            <div class="flex items-start justify-between gap-3">
                <p class="text-sm font-bold text-cocoa-800 leading-relaxed">${enText}</p>
                <button onclick="speakText('${escapedEn}')" title="Nghe lại" class="shrink-0 w-8 h-8 rounded-full bg-blush-50 hover:bg-blush-400 text-blush-500 hover:text-white flex items-center justify-center transition cursor-pointer">
                    <i class="fa-solid fa-volume-high text-xs"></i>
                </button>
            </div>
            <p class="text-xs text-cocoa-700/80 border-t border-blush-50 pt-2">🇻🇳 ${viText}</p>
            ${hintText ? `<div class="bg-mint-50 border border-mint-200 text-emerald-800 text-[11px] px-3 py-1.5 rounded-xl font-bold">💡 Gợi ý trả lời tiếp: ${hintText}</div>` : ''}
        </div>
    `;
    area.appendChild(div);
    area.scrollTop = area.scrollHeight;
}

async function handleSendSpeaking() {
    const input = document.getElementById('speaking-input-box');
    const userSpeech = input ? input.value.trim() : '';
    if (!userSpeech) return;

    if (input) input.value = '';
    const upgradeId = `b2-upgrade-${Date.now()}`;
    renderUserMessageBubble(userSpeech, upgradeId);

    userProgress.speakingTurns += 1;
    addXP(10);

    const cfg = LEVEL_CONFIGS[userProgress.level] || LEVEL_CONFIGS["A2_B2"];
    const topicSelect = document.getElementById('speaking-scenario-select');
    const topic = topicSelect ? topicSelect.value : "Giao tiếp";
    const historyContext = chatConversation.slice(-4).map(m => `${m.role === 'user' ? 'Student' : 'Mochi'}: ${m.text}`).join('\n');

    let replyData = null;

    if (hasApiKey()) {
        const prompt = `Bạn là Mochi, trợ lý AI luyện giao tiếp tiếng Anh 1-1 dễ thương, nhiệt tình giúp học viên Việt Nam ở lộ trình "${cfg.name}" đạt mục tiêu "${userProgress.goal}".
Chủ đề hiện tại: "${topic}"
Lịch sử hội thoại:
${historyContext}
Học viên vừa nói: "${userSpeech}"

Hãy trả về JSON gồm:
1. "b2Correction": Nhận xét ngắn gọn bằng tiếng Việt lỗi ngữ pháp (nếu có) trong câu học viên vừa nói và viết lại 1 câu tự nhiên, hay hơn phù hợp trình độ ${cfg.badge}.
2. "replyEn": Phản hồi tiếp cuộc trò chuyện bằng tiếng Anh tự nhiên vừa sức với trình độ ${cfg.badge} (2 câu ngắn gọn, khích lệ, kết thúc bằng 1 câu hỏi mở).
3. "replyVi": Dịch nghĩa tiếng Việt của "replyEn".
4. "nextReplyHint": Gợi ý 1 cấu trúc hoặc 2 từ vựng tiếng Anh giúp học viên dễ dàng trả lời câu hỏi tiếp theo.`;

        const schema = {
            type: "OBJECT",
            properties: {
                b2Correction: { type: "STRING" },
                replyEn: { type: "STRING" },
                replyVi: { type: "STRING" },
                nextReplyHint: { type: "STRING" }
            },
            required: ["b2Correction", "replyEn", "replyVi", "nextReplyHint"]
        };

        try {
            const raw = await callGeminiAPI(prompt, schema);
            replyData = JSON.parse(raw);
        } catch (err) {
            console.warn("Speaking API failed, fallback:", err);
        }
    }

    // Fallback thông minh phản hồi giao tiếp khi không có API key
    if (!replyData) {
        replyData = {
            b2Correction: `Câu của bạn rất tốt! Bạn có thể diễn đạt tự nhiên hơn bằng cách nói: "${userSpeech.charAt(0).toUpperCase() + userSpeech.slice(1)}, which helps me improve my communication skills."`,
            replyEn: `That's wonderful! I really enjoy practicing with you. Could you tell me more about your favorite part of the day?`,
            replyVi: `Tuyệt vời quá! Mình rất thích luyện tập cùng bạn. Bạn có thể kể thêm về khoảng thời gian yêu thích nhất trong ngày của bạn không?`,
            nextReplyHint: `I really enjoy... / My favorite part of the day is because...`
        };
    }

    try {
        const upgradeEl = document.getElementById(upgradeId);
        if (upgradeEl) {
            upgradeEl.innerHTML = `<span class="font-extrabold text-amber-800">✨ Nâng cấp câu nói (${cfg.badge}):</span> ${replyData.b2Correction}`;
        }

        renderAIMessageBubble(replyData.replyEn, replyData.replyVi, replyData.nextReplyHint);
        chatConversation.push({ role: "user", text: userSpeech });
        chatConversation.push({ role: "model", text: replyData.replyEn });

        if (autoSpeakReplies && typeof speakText === 'function') {
            speakText(replyData.replyEn);
        }
    } catch (err) {
        console.error(err);
        const upgradeEl = document.getElementById(upgradeId);
        if (upgradeEl) {
            upgradeEl.innerHTML = `<span class="text-rose-600 font-bold">Mochi mất kết nối tạm thời, bạn thử nói lại câu tiếp theo nhé!</span>`;
        }
    }
}

// =====================================================================
// FLOATING AI ASSISTANT DRAWER LOGIC
// =====================================================================
function toggleFloatingAI() {
    const panel = document.getElementById('floating-ai-panel');
    if (panel) panel.classList.toggle('hidden');
}

function sendQuickFloatingPrompt(text) {
    const input = document.getElementById('floating-ai-input');
    if (input) input.value = text;
    handleFloatingAISend();
}

async function handleFloatingAISend() {
    const input = document.getElementById('floating-ai-input');
    const msg = input ? input.value.trim() : '';
    if (!msg) return;

    if (input) input.value = '';
    const box = document.getElementById('floating-ai-messages');
    if (!box) return;

    // Render user message
    const userDiv = document.createElement('div');
    userDiv.className = "flex justify-end";
    userDiv.innerHTML = `<div class="bg-blush-400 text-white px-3.5 py-2 rounded-2xl rounded-tr-sm max-w-[82%] font-medium leading-relaxed">${msg}</div>`;
    box.appendChild(userDiv);

    // Render loading placeholder
    const loadId = `float-load-${Date.now()}`;
    const loadDiv = document.createElement('div');
    loadDiv.id = loadId;
    loadDiv.className = "flex items-start gap-2";
    loadDiv.innerHTML = `
        <span class="w-7 h-7 rounded-xl bg-blush-100 flex items-center justify-center text-sm shrink-0">🐰</span>
        <div class="bg-white border border-blush-100 rounded-2xl rounded-tl-sm p-3 text-cocoa-700 italic">Mochi đang suy nghĩ...</div>
    `;
    box.appendChild(loadDiv);
    box.scrollTop = box.scrollHeight;

    const cfg = LEVEL_CONFIGS[userProgress.level] || LEVEL_CONFIGS["A2_B2"];
    let data = null;

    if (hasApiKey()) {
        const prompt = `Bạn là trợ lý ảo Mochi AI dễ thương trên trang web học tiếng Anh. Học viên đang học lộ trình "${cfg.name}" với mục tiêu "${userProgress.goal}".
Tin nhắn của học viên: "${msg}"
Hãy trả lời ngắn gọn, thân thiện, dễ hiểu bằng tiếng Việt (nếu học viên viết tiếng Anh để trò chuyện, hãy trả lời bằng tiếng Anh trước kèm giải thích/dịch nghĩa tiếng Việt và sửa lỗi nếu có). Trả về JSON gồm:
1. "replyText": Nội dung câu trả lời (có thể dùng xuống dòng nhẹ).
2. "englishToSpeak": Câu tiếng Anh tiêu biểu trong câu trả lời để đọc thành tiếng (nếu không có câu tiếng Anh thì để chuỗi rỗng "").`;

        const schema = {
            type: "OBJECT",
            properties: {
                replyText: { type: "STRING" },
                englishToSpeak: { type: "STRING" }
            },
            required: ["replyText", "englishToSpeak"]
        };

        try {
            const raw = await callGeminiAPI(prompt, schema);
            data = JSON.parse(raw);
        } catch (err) {
            console.warn("Floating AI error, fallback:", err);
        }
    }

    if (!data) {
        data = {
            replyText: `Chào bạn! Mình là Mochi 🐰. Để trả lời câu hỏi "${msg}", bí quyết là hãy thực hành phản xạ mỗi ngày 15 phút. Bạn có thể bấm vào nút "Tạo bài học mới" hoặc luyện thẻ Flashcard ngay hôm nay nhé!`,
            englishToSpeak: "Practice makes perfect! Keep up the good work every day."
        };
    }

    try {
        const target = document.getElementById(loadId);
        const escapedSpeak = (data.englishToSpeak || '').replace(/'/g, "\\'");
        const speakBtn = data.englishToSpeak
            ? `<button onclick="speakText('${escapedSpeak}')" class="mt-2 inline-flex items-center gap-1 text-[11px] font-extrabold bg-blush-50 hover:bg-blush-100 text-blush-500 px-2.5 py-1 rounded-xl cursor-pointer">🔊 Nghe phát âm</button>`
            : '';

        if (target) {
            target.innerHTML = `
                <span class="w-7 h-7 rounded-xl bg-blush-100 flex items-center justify-center text-sm shrink-0">🐰</span>
                <div class="bg-white border border-blush-100 rounded-2xl rounded-tl-sm p-3 text-cocoa-800 leading-relaxed shadow-2xs max-w-[85%]">
                    <p class="whitespace-pre-line">${data.replyText}</p>
                    ${speakBtn}
                </div>
            `;
        }
        if (data.englishToSpeak && autoSpeakReplies && typeof speakText === 'function') {
            speakText(data.englishToSpeak);
        }
        box.scrollTop = box.scrollHeight;
    } catch (err) {
        console.error(err);
        const target = document.getElementById(loadId);
        if (target) {
            target.innerHTML = `
                <span class="w-7 h-7 rounded-xl bg-blush-100 flex items-center justify-center text-sm shrink-0">🐰</span>
                <div class="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-rose-700">Mochi đang bận một chút, bạn thử gửi lại nhé!</div>
            `;
        }
    }
}
