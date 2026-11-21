/**
 * =====================================================================
 * MOCHI ENGLISH STUDIO - APPLICATION ENTRY POINT & UI CONTROLLER
 * =====================================================================
 */

function showToast(msg, type = "info") {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    const styles = {
        success: "bg-emerald-500 text-white shadow-pastel",
        warning: "bg-amber-500 text-white shadow-pastel",
        error: "bg-rose-500 text-white shadow-pastel",
        info: "bg-cocoa-800 text-white shadow-pastel"
    };

    el.className = `${styles[type] || styles.info} px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transform transition-all duration-300 translate-y-2 opacity-0 shadow-lg`;
    el.innerHTML = `<span>${msg}</span>`;
    container.appendChild(el);

    requestAnimationFrame(() => {
        el.classList.remove('translate-y-2', 'opacity-0');
    });

    setTimeout(() => {
        el.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => el.remove(), 300);
    }, 3500);
}

function switchTab(tabId) {
    const tabs = ['roadmap', 'practice', 'writing', 'speaking'];
    tabs.forEach(t => {
        const view = document.getElementById(`view-${t}`);
        const btn = document.getElementById(`tab-${t}`);

        if (view) {
            if (t === tabId) {
                view.classList.remove('hidden');
            } else {
                view.classList.add('hidden');
            }
        }

        if (btn) {
            if (t === tabId) {
                btn.className = "nav-tab-btn flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold bg-blush-400 text-white shadow-pastel transition";
            } else {
                btn.className = "nav-tab-btn flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold text-cocoa-700 hover:bg-blush-100 hover:text-blush-500 transition";
            }
        }
    });

    // Kích hoạt scroll mượt về đầu view
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// KHỞI CHẠY ỨNG DỤNG KHI MỞ TRANG
window.onload = function () {
    loadProgressFromStorage();
    updateAllStatsUI();
    renderFlashcards();

    const cfg = LEVEL_CONFIGS[userProgress.level] || LEVEL_CONFIGS["A2_B2"];
    const quizSel = document.getElementById('quiz-topic-select');
    if (quizSel) quizSel.value = cfg.defaultQuiz;

    const writeSel = document.getElementById('writing-topic-select');
    if (writeSel) writeSel.value = cfg.defaultWriting;

    const spkSel = document.getElementById('speaking-scenario-select');
    if (spkSel) spkSel.value = cfg.defaultSpeaking;

    loadSelectedQuiz();
    changeWritingPrompt();
    setupVoiceRecognition();
    startNewSpeakingSession();
};
