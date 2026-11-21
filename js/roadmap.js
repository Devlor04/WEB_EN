/**
 * =====================================================================
 * MOCHI ENGLISH STUDIO - ROADMAP, DAILY TASKS & LESSON GENERATOR
 * =====================================================================
 */

function handleTaskToggle(checkbox) {
    const key = checkbox.getAttribute('data-task');
    const wasChecked = userProgress.tasks[key];
    userProgress.tasks[key] = checkbox.checked;
    if (checkbox.checked && !wasChecked) {
        const xpMap = { vocab: 20, grammar: 30, writing: 30, speaking: 40 };
        addXP(xpMap[key] || 20, "Hoàn thành nhiệm vụ ngày!");
    } else {
        saveProgressToStorage();
    }
}

function finishCurrentDay() {
    userProgress.day = Math.min(90, userProgress.day + 1);
    userProgress.tasks = { vocab: false, grammar: false, writing: false, speaking: false };
    userProgress.dailyLessonTitle = `Bài học Ngày ${userProgress.day}: Mục tiêu ${userProgress.goal}`;
    addXP(50, `Chúc mừng bạn bước sang Ngày ${userProgress.day}!`);
    generateDailyFreshLesson(false);
}

function openProfileModal() {
    tempModalLevel = userProgress.level;
    tempModalGoal = userProgress.goal;
    highlightModalSelections();
    const m = document.getElementById('profile-modal');
    if (m) m.classList.remove('hidden');
}

function closeProfileModal() {
    const m = document.getElementById('profile-modal');
    if (m) m.classList.add('hidden');
}

function selectModalLevel(lvl) {
    tempModalLevel = lvl;
    highlightModalSelections();
}

function selectModalGoal(g) {
    tempModalGoal = g;
    highlightModalSelections();
}

function highlightModalSelections() {
    document.querySelectorAll('.level-choice-btn').forEach(btn => {
        const isSelected = btn.getAttribute('data-level') === tempModalLevel;
        btn.className = isSelected
            ? "level-choice-btn p-3 rounded-2xl border-2 border-blush-400 bg-blush-50/80 text-left transition shadow-2xs"
            : "level-choice-btn p-3 rounded-2xl border-2 border-slate-200 bg-white text-left transition hover:border-blush-300";
    });

    document.querySelectorAll('.goal-choice-btn').forEach(btn => {
        const isSelected = btn.getAttribute('data-goal') === tempModalGoal;
        btn.className = isSelected
            ? "goal-choice-btn p-3 rounded-2xl border-2 border-lavender-500 bg-lavender-50 text-left transition shadow-2xs"
            : "goal-choice-btn p-3 rounded-2xl border-2 border-slate-200 bg-white text-left transition hover:border-lavender-300";
    });
}

function applyProfileChanges() {
    const levelChanged = userProgress.level !== tempModalLevel;
    userProgress.level = tempModalLevel;
    userProgress.goal = tempModalGoal;

    const cfg = LEVEL_CONFIGS[userProgress.level];
    if (levelChanged) {
        userProgress.vocabulary = JSON.parse(JSON.stringify(cfg.vocab));
        const quizSel = document.getElementById('quiz-topic-select');
        if (quizSel) quizSel.value = cfg.defaultQuiz;
        const writeSel = document.getElementById('writing-topic-select');
        if (writeSel) writeSel.value = cfg.defaultWriting;
        const spkSel = document.getElementById('speaking-scenario-select');
        if (spkSel) spkSel.value = cfg.defaultSpeaking;

        if (typeof loadSelectedQuiz === 'function') loadSelectedQuiz();
        if (typeof changeWritingPrompt === 'function') changeWritingPrompt();
        if (typeof startNewSpeakingSession === 'function') startNewSpeakingSession();
    }

    userProgress.dailyLessonTitle = `Chủ đề hôm nay: Chinh phục ${userProgress.goal} (${cfg.badge})`;
    saveProgressToStorage();
    if (typeof renderFlashcards === 'function') renderFlashcards();
    closeProfileModal();
    if (typeof showToast === 'function') {
        showToast(`Đã chuyển sang lộ trình ${cfg.name} • ${userProgress.goal} 🌸`, "success");
    }
}

/**
 * DAILY FRESH LESSON GENERATOR:
 * TẠO BÀI HỌC MỚI HÔM NAY (Đảm bảo 100% tạo thành công cả Online AI lẫn Offline Fallback)
 */
async function generateDailyFreshLesson(isManualClick = false) {
    const btn = document.getElementById('btn-refresh-daily');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i><span>Mochi đang soạn bài hôm nay...</span>`;
    }

    const cfg = LEVEL_CONFIGS[userProgress.level] || LEVEL_CONFIGS["A2_B2"];
    let lessonData = null;

    // 1. Thử gọi Gemini AI nếu người dùng đã cấu hình API Key
    if (hasApiKey()) {
        try {
            const prompt = `Bạn là Mochi, trợ lý học tiếng Anh cá nhân hóa. Học viên đang ở trình độ "${cfg.name}" với mục tiêu "${userProgress.goal}", đang học Ngày ${userProgress.day}/90.
Hãy tạo một gói bài học mới cho ngày hôm nay dưới dạng JSON gồm:
1. "lessonTitle": Tên chủ đề bài học hôm nay bằng tiếng Việt hấp dẫn (ví dụ: "Ngày ${userProgress.day}: Giao tiếp nơi công sở & Câu điều kiện").
2. "words": Mảng 5 từ vựng tiếng Anh mới phù hợp đúng trình độ ${cfg.badge} và mục tiêu ${userProgress.goal} (mỗi từ có word, ipa, meaning tiếng Việt, example tiếng Anh).
3. "quizQuestions": Mảng 3 câu hỏi trắc nghiệm ngữ pháp/từ vựng chuẩn trình độ ${cfg.badge} (mỗi câu có q, options mảng 4 đáp án, answer số nguyên 0-3, explanation giải thích tiếng Việt dễ hiểu).`;

            const schema = {
                type: "OBJECT",
                properties: {
                    lessonTitle: { type: "STRING" },
                    words: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                word: { type: "STRING" },
                                ipa: { type: "STRING" },
                                meaning: { type: "STRING" },
                                example: { type: "STRING" }
                            },
                            required: ["word", "ipa", "meaning", "example"]
                        }
                    },
                    quizQuestions: {
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
                required: ["lessonTitle", "words", "quizQuestions"]
            };

            const raw = await callGeminiAPI(prompt, schema);
            lessonData = JSON.parse(raw);
        } catch (err) {
            console.warn("Gemini API call failed, falling back to smart lesson generator:", err);
        }
    }

    // 2. Nếu không có API Key hoặc Gemini bị lỗi -> Tự động sinh từ ngân hàng bài học thông minh
    if (!lessonData || !lessonData.words || !lessonData.quizQuestions) {
        lessonData = generateLessonFromBank(userProgress.level, userProgress.goal, userProgress.day);
    }

    // 3. Áp dụng dữ liệu bài học mới vào giao diện
    try {
        if (lessonData && lessonData.words && lessonData.quizQuestions) {
            userProgress.dailyLessonTitle = lessonData.lessonTitle;
            const freshWords = lessonData.words.map(w => ({ ...w, mastered: false }));
            
            // Đưa các từ mới lên đầu danh sách học
            userProgress.vocabulary = [...freshWords, ...userProgress.vocabulary.filter(existing => 
                !freshWords.some(fw => fw.word.toLowerCase() === existing.word.toLowerCase())
            )];

            currentQuiz = {
                passage: null,
                questions: lessonData.quizQuestions.map((item, idx) => ({
                    ...item,
                    q: item.q.match(/^\d+\./) ? item.q : `${idx + 1}. ${item.q}`
                }))
            };
            userQuizSelections = {};
            isQuizGraded = false;

            saveProgressToStorage();
            if (typeof renderFlashcards === 'function') renderFlashcards();
            if (typeof renderQuizQuestions === 'function') renderQuizQuestions();
            
            if (typeof showToast === 'function') {
                showToast(`Đã tạo thành công bài học mới cho Ngày ${userProgress.day}! ✨🎉`, "success");
            }
        }
    } catch (err) {
        console.error("Lỗi cập nhật bài học:", err);
        if (typeof showToast === 'function') {
            showToast("Đã xảy ra lỗi khi tạo bài, vui lòng thử lại nhé!", "error");
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-sparkles"></i><span>Tạo bài học mới hôm nay</span>`;
        }
    }
}
