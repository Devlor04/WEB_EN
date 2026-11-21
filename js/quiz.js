/**
 * =====================================================================
 * MOCHI ENGLISH STUDIO - QUIZ ENGINE & AI QUIZ GENERATOR
 * =====================================================================
 */

function loadSelectedQuiz() {
    const topicSelect = document.getElementById('quiz-topic-select');
    const topicKey = topicSelect ? topicSelect.value : 'tenses';
    const preset = BUILTIN_QUIZZES[topicKey] || BUILTIN_QUIZZES.tenses;
    currentQuiz = JSON.parse(JSON.stringify(preset));
    userQuizSelections = {};
    isQuizGraded = false;
    renderQuizQuestions();
}

function renderQuizQuestions() {
    const passageBox = document.getElementById('reading-passage-container');
    const passageBody = document.getElementById('reading-passage-body');
    const listEl = document.getElementById('quiz-questions-list');
    const statusBanner = document.getElementById('quiz-status-banner');

    if (!listEl) return;

    if (currentQuiz.passage) {
        if (passageBox) passageBox.classList.remove('hidden');
        if (passageBody) passageBody.innerHTML = currentQuiz.passage;
    } else {
        if (passageBox) passageBox.classList.add('hidden');
    }

    listEl.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    currentQuiz.questions.forEach((item, qIdx) => {
        const card = document.createElement('div');
        card.className = "p-5 rounded-3xl border-2 border-lavender-100 bg-lavender-50/25";

        const optionsHTML = item.options.map((opt, optIdx) => {
            const selected = userQuizSelections[qIdx] === optIdx;
            let style = "bg-white border-slate-200 text-cocoa-800 hover:border-lavender-400";

            if (isQuizGraded) {
                if (optIdx === item.answer) {
                    style = "bg-mint-50 border-emerald-500 text-emerald-900 font-extrabold ring-2 ring-emerald-400/40";
                } else if (selected && optIdx !== item.answer) {
                    style = "bg-rose-50 border-rose-400 text-rose-800 line-through";
                } else {
                    style = "bg-white border-slate-200 text-slate-400 opacity-70";
                }
            } else if (selected) {
                style = "bg-blush-50 border-blush-400 text-cocoa-800 font-extrabold ring-2 ring-blush-200";
            }

            return `
                <button onclick="pickQuizOption(${qIdx}, ${optIdx})" class="w-full text-left p-3.5 rounded-2xl border-2 text-sm transition flex items-center gap-3 ${style}">
                    <span class="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 ${selected ? 'bg-blush-400 text-white' : 'bg-lavender-100 text-lavender-600'}">${letters[optIdx]}</span>
                    <span>${opt}</span>
                </button>
            `;
        }).join('');

        const explainHTML = isQuizGraded ? `
            <div class="mt-4 p-4 rounded-2xl bg-white border-2 border-mint-200 text-xs text-cocoa-800 leading-relaxed">
                <strong class="text-emerald-700">🐰 Mochi giải thích:</strong> ${item.explanation}
            </div>
        ` : '';

        card.innerHTML = `
            <p class="font-heading font-bold text-cocoa-800 text-sm sm:text-base mb-3.5">${item.q}</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">${optionsHTML}</div>
            ${explainHTML}
        `;
        listEl.appendChild(card);
    });

    if (!isQuizGraded && statusBanner) {
        statusBanner.innerText = `Đã chọn ${Object.keys(userQuizSelections).length} / ${currentQuiz.questions.length} câu hỏi.`;
    }
}

function pickQuizOption(qIdx, optIdx) {
    if (isQuizGraded) return;
    userQuizSelections[qIdx] = optIdx;
    renderQuizQuestions();
}

function submitAndGradeQuiz() {
    const total = currentQuiz.questions.length;
    let correct = 0;
    currentQuiz.questions.forEach((q, i) => {
        if (userQuizSelections[i] === q.answer) correct++;
    });

    isQuizGraded = true;
    renderQuizQuestions();

    userProgress.quizzesCompleted += 1;
    addXP(correct * 10, `Hoàn thành bài luyện tập (${correct}/${total} câu đúng)!`);

    const statusBanner = document.getElementById('quiz-status-banner');
    if (statusBanner) {
        statusBanner.innerHTML = `Kết quả: <span class="text-lg font-extrabold text-emerald-600">${correct}/${total} câu đúng</span> 🎉`;
    }
}

function resetQuizAnswers() {
    userQuizSelections = {};
    isQuizGraded = false;
    renderQuizQuestions();
}

async function generateAIQuiz() {
    const btn = document.getElementById('btn-ai-quiz');
    const selectEl = document.getElementById('quiz-topic-select');
    const topicLabel = selectEl ? selectEl.options[selectEl.selectedIndex].text : "Ngữ pháp";
    const isReading = selectEl && selectEl.value === 'reading';
    const cfg = LEVEL_CONFIGS[userProgress.level] || LEVEL_CONFIGS["A2_B2"];

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i><span>Mochi đang soạn đề...</span>`;
    }

    let generatedQuiz = null;

    if (hasApiKey()) {
        const prompt = isReading
            ? `Tạo 1 đoạn văn hoặc email tiếng Anh (khoảng 110 từ, trình độ ${cfg.badge}, mục tiêu ${userProgress.goal}) kèm 3 câu hỏi trắc nghiệm đọc hiểu và giải thích đáp án chi tiết bằng tiếng Việt.`
            : `Tạo 5 câu hỏi trắc nghiệm tiếng Anh trình độ ${cfg.badge} (mục tiêu ${userProgress.goal}) thuộc chủ đề: "${topicLabel}". Mỗi câu có 4 đáp án, chỉ số đáp án đúng (0-3) và giải thích ngữ pháp dễ hiểu bằng tiếng Việt.`;

        const schema = {
            type: "OBJECT",
            properties: {
                passage: { type: "STRING" },
                questions: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            q: { type: "STRING" },
                            options: { type: "ARRAY", items: { type: "STRING" } },
                            answer: { type: "INTEGER" },
                            explanation: { type: "STRING" }
                        },
                        required: ["q", "options", "answer", "explanation"]
                    }
                }
            },
            required: ["passage", "questions"]
        };

        try {
            const raw = await callGeminiAPI(prompt, schema);
            const parsed = JSON.parse(raw);
            if (parsed && parsed.questions && parsed.questions.length > 0) {
                generatedQuiz = {
                    passage: parsed.passage && parsed.passage.trim().length > 15 ? parsed.passage : null,
                    questions: parsed.questions.map((item, i) => ({
                        ...item,
                        q: item.q.match(/^\d+\./) ? item.q : `${i + 1}. ${item.q}`
                    }))
                };
            }
        } catch (err) {
            console.warn("AI Quiz generation failed, fallback to smart bank:", err);
        }
    }

    if (!generatedQuiz) {
        const fallback = generateLessonFromBank(userProgress.level, userProgress.goal, userProgress.day);
        generatedQuiz = {
            passage: null,
            questions: fallback.quizQuestions.map((item, idx) => ({
                ...item,
                q: item.q.match(/^\d+\./) ? item.q : `${idx + 1}. ${item.q}`
            }))
        };
    }

    if (generatedQuiz) {
        currentQuiz = generatedQuiz;
        userQuizSelections = {};
        isQuizGraded = false;
        renderQuizQuestions();
        if (typeof showToast === 'function') {
            showToast("Mochi đã soạn xong bộ đề luyện tập mới! 📝", "success");
        }
    }

    if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i><span>AI Tạo Đề Mới</span>`;
    }
}
