/**
 * =====================================================================
 * MOCHI ENGLISH STUDIO - STORAGE & USER STATE MANAGEMENT
 * =====================================================================
 */

const todayDateString = new Date().toISOString().split('T')[0];

let userProgress = {
    level: "A2_B2",
    goal: "TOEIC 700+",
    startDate: todayDateString,
    lastActiveDate: todayDateString,
    dailyLessonTitle: "Chủ đề hôm nay: Thói quen công sở & Thì hiện tại",
    day: 1,
    xp: 0,
    tasks: { vocab: false, grammar: false, writing: false, speaking: false },
    vocabulary: JSON.parse(JSON.stringify(LEVEL_CONFIGS["A2_B2"].vocab)),
    quizzesCompleted: 0,
    savedEssays: [],
    speakingTurns: 0,
    speechAccent: 'en-US'
};

// Biến runtime trong phiên làm việc
let tempModalLevel = "A2_B2";
let tempModalGoal = "TOEIC 700+";

let currentQuiz = JSON.parse(JSON.stringify(BUILTIN_QUIZZES.tenses));
let userQuizSelections = {};
let isQuizGraded = false;

function loadProgressFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            userProgress = { ...userProgress, ...parsed };
        }
        checkAndAutoAdvanceNewDay();
    } catch (err) {
        console.warn("Lỗi đọc dữ liệu localStorage:", err);
    }
}

// Tự động phát hiện khi sang ngày mới để làm mới checklist và tăng ngày học
function checkAndAutoAdvanceNewDay() {
    if (userProgress.lastActiveDate && userProgress.lastActiveDate !== todayDateString) {
        userProgress.day = Math.min(90, userProgress.day + 1);
        userProgress.lastActiveDate = todayDateString;
        userProgress.tasks = { vocab: false, grammar: false, writing: false, speaking: false };
        userProgress.dailyLessonTitle = `Bài học Ngày ${userProgress.day}: Mở rộng từ vựng & Phản xạ ${LEVEL_CONFIGS[userProgress.level].badge}`;
        saveProgressToStorage();
        setTimeout(() => {
            if (typeof showToast === 'function') {
                showToast(`Chào ngày mới! Mochi đã mở khóa Ngày ${userProgress.day}/90 cho bạn 🌸`, "success");
            }
        }, 800);
    }
}

function saveProgressToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
        updateAllStatsUI();
    } catch (err) {
        console.warn("Lỗi lưu dữ liệu localStorage:", err);
    }
}

function addXP(points, reason = "") {
    userProgress.xp += points;
    saveProgressToStorage();
    if (reason && typeof showToast === 'function') {
        showToast(`+${points} XP • ${reason}`, "success");
    }
}

function updateAllStatsUI() {
    const lvlCfg = LEVEL_CONFIGS[userProgress.level] || LEVEL_CONFIGS["A2_B2"];

    // Header badges & subtitles
    const elHeaderLevel = document.getElementById('header-level-badge');
    if (elHeaderLevel) elHeaderLevel.innerText = lvlCfg.badge;

    const elHeaderGoal = document.getElementById('header-goal-subtitle');
    if (elHeaderGoal) elHeaderGoal.innerText = `Lộ trình chinh phục ${userProgress.goal} (${lvlCfg.name}) ✨`;

    const elHeaderDay = document.getElementById('header-day-badge');
    if (elHeaderDay) elHeaderDay.innerText = `Ngày ${userProgress.day}/90`;

    const elHeaderXp = document.getElementById('header-xp-badge');
    if (elHeaderXp) elHeaderXp.innerText = `${userProgress.xp} XP`;

    // Daily Banner
    const elDailyBadge = document.getElementById('daily-theme-badge');
    if (elDailyBadge) elDailyBadge.innerText = `Hôm nay • Ngày ${userProgress.day}`;

    const elGoalPill = document.getElementById('current-goal-pill');
    if (elGoalPill) elGoalPill.innerText = `Mục tiêu: ${userProgress.goal}`;

    const elDailyTitle = document.getElementById('daily-lesson-title');
    if (elDailyTitle) elDailyTitle.innerText = userProgress.dailyLessonTitle;

    // Dashboard overview cards
    const elStatDays = document.getElementById('stat-days');
    if (elStatDays) elStatDays.innerText = `Ngày ${userProgress.day} / 90`;

    const elStatMastered = document.getElementById('stat-mastered-words');
    if (elStatMastered) {
        const masteredCount = userProgress.vocabulary.filter(v => v.mastered).length;
        elStatMastered.innerText = `${masteredCount} / ${userProgress.vocabulary.length} từ`;
    }

    const elStatQuizzes = document.getElementById('stat-quizzes');
    if (elStatQuizzes) elStatQuizzes.innerText = `${userProgress.quizzesCompleted} bài`;

    const elStatSpeaking = document.getElementById('stat-speaking-turns');
    if (elStatSpeaking) elStatSpeaking.innerText = `${userProgress.speakingTurns} lượt`;

    const elSavedEssays = document.getElementById('saved-essays-badge');
    if (elSavedEssays) elSavedEssays.innerText = `${userProgress.savedEssays.length} bài đã lưu`;

    // Speaking header badge
    const elSpeakingLvl = document.getElementById('speaking-level-pill');
    if (elSpeakingLvl) elSpeakingLvl.innerText = lvlCfg.badge;

    // Accent button
    const elAccentBtn = document.getElementById('btn-accent-toggle');
    if (elAccentBtn) {
        elAccentBtn.innerText = userProgress.speechAccent === 'en-US' ? '🇺🇸 Giọng Mỹ (US)' : '🇬🇧 Giọng Anh (UK)';
    }

    // Checklist & Daily progress bar
    const checkboxes = document.querySelectorAll('#daily-checklist-items input[type="checkbox"]');
    let checkedTotal = 0;
    checkboxes.forEach(cb => {
        const key = cb.getAttribute('data-task');
        cb.checked = !!userProgress.tasks[key];
        if (cb.checked) checkedTotal++;
    });

    if (checkboxes.length > 0) {
        const pct = Math.round((checkedTotal / checkboxes.length) * 100);
        const elPct = document.getElementById('daily-progress-percent');
        if (elPct) elPct.innerText = `${pct}%`;
        const elBar = document.getElementById('daily-progress-bar');
        if (elBar) elBar.style.width = `${pct}%`;
    }

    // Render Roadmap Phases dynamically for selected Level & Goal
    const elRoadmapHead = document.getElementById('roadmap-card-heading');
    if (elRoadmapHead) elRoadmapHead.innerText = `Lộ Trình ${lvlCfg.badge} (${userProgress.goal})`;

    const elCoachTip = document.getElementById('mochi-coach-tip');
    if (elCoachTip) elCoachTip.innerHTML = lvlCfg.tip;

    const phasesEl = document.getElementById('roadmap-phases-container');
    if (phasesEl) {
        const activePhaseIdx = userProgress.day <= 30 ? 0 : (userProgress.day <= 60 ? 1 : 2);
        const phaseColors = [
            { border: 'border-blush-200', bg: 'bg-blush-50/60', pill: 'bg-blush-400 text-white' },
            { border: 'border-lavender-100', bg: 'bg-lavender-50/40', pill: 'bg-lavender-200 text-lavender-600' },
            { border: 'border-mint-100', bg: 'bg-mint-50/40', pill: 'bg-mint-200 text-emerald-800' }
        ];

        phasesEl.innerHTML = lvlCfg.phases.map((p, i) => `
            <div class="p-4 rounded-2xl border-2 ${phaseColors[i].border} ${phaseColors[i].bg} ${i === activePhaseIdx ? 'ring-2 ring-blush-400' : ''} transition">
                <div class="flex justify-between items-center gap-2">
                    <h3 class="font-heading font-bold text-cocoa-800 text-sm">${p.title}</h3>
                    <span class="text-[11px] font-extrabold ${phaseColors[i].pill} px-2.5 py-0.5 rounded-full shrink-0">${p.tag}</span>
                </div>
                <p class="text-xs text-cocoa-700 mt-1.5 leading-relaxed">${p.desc}</p>
            </div>
        `).join('');
    }
}

// Backup & Restore Modal Functions
function openBackupModal() {
    const m = document.getElementById('backup-modal');
    if (m) m.classList.remove('hidden');
}

function closeBackupModal() {
    const m = document.getElementById('backup-modal');
    if (m) m.classList.add('hidden');
}

function exportProgressJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userProgress, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mochi-english-${userProgress.level}-day${userProgress.day}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    if (typeof showToast === 'function') {
        showToast("Đã tải file sao lưu tiến trình về máy! 💾", "success");
    }
}

function importProgressJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (imported.level && imported.vocabulary) {
                userProgress = { ...userProgress, ...imported };
                saveProgressToStorage();
                if (typeof renderFlashcards === 'function') renderFlashcards();
                if (typeof loadSelectedQuiz === 'function') loadSelectedQuiz();
                closeBackupModal();
                if (typeof showToast === 'function') {
                    showToast("Khôi phục tiến trình học tập thành công! 🎉", "success");
                }
            } else {
                throw new Error("File không đúng cấu trúc.");
            }
        } catch (err) {
            if (typeof showToast === 'function') {
                showToast("File sao lưu không hợp lệ, vui lòng kiểm tra lại!", "error");
            }
        }
    };
    reader.readAsText(file);
}

function confirmResetProgress() {
    if (confirm("Bạn có chắc chắn muốn đặt lại toàn bộ tiến trình học tập về Ngày 1 không?")) {
        const lvl = userProgress.level || "A2_B2";
        userProgress = {
            level: lvl,
            goal: LEVEL_CONFIGS[lvl].defaultQuiz === 'beginner' ? "Giao tiếp cơ bản" : "TOEIC 700+",
            startDate: todayDateString,
            lastActiveDate: todayDateString,
            dailyLessonTitle: "Chủ đề hôm nay: Thói quen công sở & Thì hiện tại",
            day: 1,
            xp: 0,
            tasks: { vocab: false, grammar: false, writing: false, speaking: false },
            vocabulary: JSON.parse(JSON.stringify(LEVEL_CONFIGS[lvl].vocab)),
            quizzesCompleted: 0,
            savedEssays: [],
            speakingTurns: 0,
            speechAccent: 'en-US'
        };
        saveProgressToStorage();
        if (typeof renderFlashcards === 'function') renderFlashcards();
        if (typeof loadSelectedQuiz === 'function') loadSelectedQuiz();
        closeBackupModal();
        if (typeof showToast === 'function') {
            showToast("Đã đặt lại tiến trình học từ đầu! Hãy bắt đầu với tinh thần mới nhé 🌱", "info");
        }
    }
}
