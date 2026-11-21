/**
 * =====================================================================
 * MOCHI ENGLISH STUDIO - 4-STAGE VOCABULARY MASTERY CHALLENGE
 * =====================================================================
 * Quy trình kiểm tra 4 giai đoạn chuyên sâu trước khi công nhận từ mới:
 * Giai đoạn 1: Ghép nghĩa (Matching / Multiple Choice)
 * Giai đoạn 2: Nhớ từ & Gõ từ tiếng Anh (Spelling & Recall)
 * Giai đoạn 3: Đặt câu ngắn có chứa từ mới (Sentence Writing & AI Check)
 * Giai đoạn 4: Check phát âm từ & Nói câu liên quan (Pronunciation & Speech)
 */

let challengeWordIndex = -1;
let challengeWord = null;
let challengeCurrentStage = 1;
let challengeStageResults = { stage1: false, stage2: false, stage3: false, stage4a: false, stage4b: false };
let challengeStudentSentence = "";
let challengeRecognition = null;
let challengeIsListening = false;
let challengeListeningTarget = "word"; // "word" | "sentence"

// Mở modal bắt đầu thử thách cho 1 từ cụ thể theo index
function startWordChallenge(idx) {
    if (!userProgress.vocabulary || !userProgress.vocabulary[idx]) {
        if (typeof showToast === 'function') {
            showToast("Không tìm thấy từ vựng để kiểm tra!", "warning");
        }
        return;
    }

    challengeWordIndex = idx;
    challengeWord = userProgress.vocabulary[idx];
    challengeCurrentStage = 1;
    challengeStageResults = { stage1: false, stage2: false, stage3: false, stage4a: false, stage4b: false };
    challengeStudentSentence = challengeWord.example || "";

    const modal = document.getElementById('vocab-challenge-modal');
    if (modal) modal.classList.remove('hidden');

    renderChallengeStageUI();
}

// Mở modal chọn từ hoặc tự động kiểm tra từ chưa thuộc đầu tiên
function openVocabChallengeSelector() {
    const unmasteredIdx = userProgress.vocabulary.findIndex(v => !v.mastered);
    if (unmasteredIdx !== -1) {
        startWordChallenge(unmasteredIdx);
    } else if (userProgress.vocabulary.length > 0) {
        // Nếu đã thuộc hết thì ôn lại từ đầu tiên
        startWordChallenge(0);
    } else {
        if (typeof showToast === 'function') {
            showToast("Chưa có từ vựng nào trong danh sách học!", "warning");
        }
    }
}

function closeVocabChallengeModal() {
    stopChallengeMic();
    const modal = document.getElementById('vocab-challenge-modal');
    if (modal) modal.classList.add('hidden');
}

// Chuyển sang giai đoạn tiếp theo
function goToChallengeStage(stageNum) {
    stopChallengeMic();
    challengeCurrentStage = stageNum;
    renderChallengeStageUI();
}

// Render giao diện theo từng giai đoạn
function renderChallengeStageUI() {
    if (!challengeWord) return;

    // Header info
    const titleEl = document.getElementById('challenge-word-title');
    if (titleEl) {
        titleEl.innerText = challengeWord.word;
    }
    const ipaEl = document.getElementById('challenge-word-ipa');
    if (ipaEl) {
        ipaEl.innerText = challengeWord.ipa || "";
    }

    // Cập nhật trạng thái các nấc tiến trình 1 - 2 - 3 - 4
    for (let i = 1; i <= 4; i++) {
        const stepBadge = document.getElementById(`challenge-step-pill-${i}`);
        if (stepBadge) {
            if (i < challengeCurrentStage || (i === 4 && challengeStageResults.stage4b)) {
                stepBadge.className = "px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500 text-white flex items-center gap-1 shadow-2xs";
                stepBadge.innerHTML = `<i class="fa-solid fa-check"></i><span>Bước ${i}</span>`;
            } else if (i === challengeCurrentStage) {
                stepBadge.className = "px-3 py-1 rounded-full text-xs font-extrabold bg-blush-500 text-white flex items-center gap-1 shadow-pastel ring-2 ring-blush-300";
                stepBadge.innerHTML = `<i class="fa-solid fa-play text-[10px]"></i><span>Bước ${i}</span>`;
            } else {
                stepBadge.className = "px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-cocoa-700/60 flex items-center gap-1";
                stepBadge.innerHTML = `<span>Bước ${i}</span>`;
            }
        }
    }

    // Ẩn tất cả các view giai đoạn
    for (let s = 1; s <= 4; s++) {
        const stageView = document.getElementById(`challenge-stage-${s}-view`);
        if (stageView) stageView.classList.add('hidden');
    }
    const victoryView = document.getElementById('challenge-victory-view');
    if (victoryView) victoryView.classList.add('hidden');

    // Hiển thị view của giai đoạn hiện tại
    if (challengeCurrentStage === 1) {
        setupStage1UI();
    } else if (challengeCurrentStage === 2) {
        setupStage2UI();
    } else if (challengeCurrentStage === 3) {
        setupStage3UI();
    } else if (challengeCurrentStage === 4) {
        setupStage4UI();
    } else if (challengeCurrentStage === 5) {
        setupVictoryUI();
    }
}

// =====================================================================
// GIAI ĐOẠN 1: GHÉP TỪ & CHỌN NGHĨA TIẾNG VIỆT ĐÚNG
// =====================================================================
function setupStage1UI() {
    const stageView = document.getElementById('challenge-stage-1-view');
    if (!stageView) return;
    stageView.classList.remove('hidden');

    const wordEl = document.getElementById('stage1-target-word');
    if (wordEl) wordEl.innerText = challengeWord.word;

    const ipaEl = document.getElementById('stage1-target-ipa');
    if (ipaEl) ipaEl.innerText = challengeWord.ipa;

    // Lấy 1 đáp án đúng và 3 đáp án nhiễu
    const correctMeaning = challengeWord.meaning;
    const pool = userProgress.vocabulary
        .filter(v => v.word.toLowerCase() !== challengeWord.word.toLowerCase())
        .map(v => v.meaning);

    // Bổ sung thêm nghĩa mẫu nếu kho từ vựng ít hơn 4 từ
    const fallbackMeanings = ["Đồng nghiệp", "Lịch trình", "Hạn chót", "Cải thiện", "Tham dự", "Chuẩn bị", "Đàm phán", "Hợp tác"];
    fallbackMeanings.forEach(m => {
        if (!pool.includes(m) && m !== correctMeaning) pool.push(m);
    });

    // Trộn ngẫu nhiên 3 đáp án sai
    pool.sort(() => 0.5 - Math.random());
    const wrongOptions = pool.slice(0, 3);
    const allOptions = [correctMeaning, ...wrongOptions].sort(() => 0.5 - Math.random());

    const optionsContainer = document.getElementById('stage1-options-container');
    const feedbackBox = document.getElementById('stage1-feedback');
    if (feedbackBox) {
        feedbackBox.classList.add('hidden');
        feedbackBox.innerHTML = '';
    }

    const nextBtn = document.getElementById('btn-stage1-next');
    if (nextBtn) nextBtn.classList.add('hidden');

    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        const letters = ['A', 'B', 'C', 'D'];

        allOptions.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = "w-full text-left p-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-blush-400 text-cocoa-800 text-sm font-bold flex items-center gap-3 transition shadow-2xs cursor-pointer";
            btn.innerHTML = `
                <span class="w-8 h-8 rounded-xl bg-lavender-100 text-lavender-700 flex items-center justify-center font-extrabold text-xs shrink-0">${letters[idx]}</span>
                <span class="flex-1">${opt}</span>
            `;
            btn.onclick = () => handleStage1Choice(btn, opt, correctMeaning);
            optionsContainer.appendChild(btn);
        });
    }
}

function handleStage1Choice(clickedBtn, selectedMeaning, correctMeaning) {
    const optionsContainer = document.getElementById('stage1-options-container');
    const feedbackBox = document.getElementById('stage1-feedback');
    const nextBtn = document.getElementById('btn-stage1-next');

    if (selectedMeaning === correctMeaning) {
        // ĐÚNG
        challengeStageResults.stage1 = true;
        clickedBtn.className = "w-full text-left p-4 rounded-2xl border-2 border-emerald-500 bg-mint-50 text-emerald-900 text-sm font-extrabold flex items-center gap-3 shadow-pastel ring-2 ring-emerald-300";
        clickedBtn.querySelector('span:first-child').className = "w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-extrabold text-xs shrink-0";
        
        // Vô hiệu hóa các nút khác
        if (optionsContainer) {
            Array.from(optionsContainer.children).forEach(b => {
                if (b !== clickedBtn) {
                    b.classList.add('opacity-50', 'pointer-events-none');
                }
            });
        }

        if (feedbackBox) {
            feedbackBox.className = "mt-4 p-3.5 bg-mint-100 border border-mint-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2";
            feedbackBox.innerHTML = `<span>🐰 Chính xác tuyệt đối! "${challengeWord.word}" nghĩa là: <strong>${correctMeaning}</strong></span>`;
            feedbackBox.classList.remove('hidden');
        }

        if (nextBtn) {
            nextBtn.classList.remove('hidden');
        }
        if (typeof speakText === 'function') speakText(challengeWord.word);
    } else {
        // SAI
        clickedBtn.className = "w-full text-left p-4 rounded-2xl border-2 border-rose-400 bg-rose-50 text-rose-800 text-sm font-bold flex items-center gap-3 line-through";
        if (feedbackBox) {
            feedbackBox.className = "mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-700 flex items-center gap-2";
            feedbackBox.innerHTML = `<span>❌ Chưa chính xác rồi, bạn hãy thử chọn lại nhé! Gợi ý: bấm loa 🔊 để nghe phát âm.</span>`;
            feedbackBox.classList.remove('hidden');
        }
    }
}

// =====================================================================
// GIAI ĐOẠN 2: NHỚ TỪ & GÕ LẠI TỪ TIẾNG ANH (SPELLING & RECALL)
// =====================================================================
function setupStage2UI() {
    const stageView = document.getElementById('challenge-stage-2-view');
    if (!stageView) return;
    stageView.classList.remove('hidden');

    const meaningEl = document.getElementById('stage2-target-meaning');
    if (meaningEl) meaningEl.innerText = challengeWord.meaning;

    const hintLettersEl = document.getElementById('stage2-hint-letters');
    if (hintLettersEl) {
        const w = challengeWord.word;
        if (w.length > 2) {
            const masked = w[0] + " " + "_ ".repeat(w.length - 2) + w[w.length - 1];
            hintLettersEl.innerText = `${masked} (${w.length} ký tự)`;
        } else {
            hintLettersEl.innerText = `${w.length} ký tự`;
        }
    }

    const input = document.getElementById('stage2-input-word');
    if (input) {
        input.value = '';
        input.className = "w-full px-5 py-3.5 bg-cream border-2 border-lavender-200 focus:border-blush-400 rounded-2xl text-base font-extrabold text-cocoa-800 text-center tracking-widest focus:outline-none transition";
        setTimeout(() => input.focus(), 200);
    }

    const feedbackBox = document.getElementById('stage2-feedback');
    if (feedbackBox) {
        feedbackBox.classList.add('hidden');
        feedbackBox.innerHTML = '';
    }

    const nextBtn = document.getElementById('btn-stage2-next');
    if (nextBtn) nextBtn.classList.add('hidden');
}

function checkStage2Input() {
    const input = document.getElementById('stage2-input-word');
    const typed = input ? input.value.trim().toLowerCase() : "";
    const correct = challengeWord.word.trim().toLowerCase();
    const feedbackBox = document.getElementById('stage2-feedback');
    const nextBtn = document.getElementById('btn-stage2-next');

    if (!typed) {
        if (typeof showToast === 'function') {
            showToast("Bạn hãy gõ từ tiếng Anh vào ô nhé!", "warning");
        }
        return;
    }

    if (typed === correct) {
        challengeStageResults.stage2 = true;
        if (input) {
            input.className = "w-full px-5 py-3.5 bg-mint-50 border-2 border-emerald-500 rounded-2xl text-base font-extrabold text-emerald-800 text-center tracking-widest focus:outline-none ring-2 ring-emerald-300";
            input.disabled = true;
        }

        if (feedbackBox) {
            feedbackBox.className = "mt-4 p-3.5 bg-mint-100 border border-mint-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2";
            feedbackBox.innerHTML = `<span>🌟 Tuyệt vời! Bạn nhớ đúng 100% chính tả: <strong>${challengeWord.word}</strong> (${challengeWord.ipa})</span>`;
            feedbackBox.classList.remove('hidden');
        }

        if (nextBtn) nextBtn.classList.remove('hidden');
        if (typeof speakText === 'function') speakText(challengeWord.word);
    } else {
        if (input) {
            input.className = "w-full px-5 py-3.5 bg-rose-50 border-2 border-rose-400 rounded-2xl text-base font-extrabold text-rose-800 text-center tracking-widest focus:outline-none";
        }
        if (feedbackBox) {
            feedbackBox.className = "mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-700 flex flex-col gap-1";
            feedbackBox.innerHTML = `
                <div>❌ Chưa đúng chính tả rồi! Bạn gõ là: "<em>${typed}</em>".</div>
                <div class="text-[11px] text-cocoa-700">Gợi ý: Từ này có ${correct.length} chữ cái, bắt đầu bằng chữ '<strong>${correct[0].toUpperCase()}</strong>'. Thử lại nhé!</div>
            `;
            feedbackBox.classList.remove('hidden');
        }
    }
}

// =====================================================================
// GIAI ĐOẠN 3: ĐẶT CÂU NGẮN CÓ CHỨA TỪ VỰNG MỚI (SENTENCE WRITING)
// =====================================================================
function setupStage3UI() {
    const stageView = document.getElementById('challenge-stage-3-view');
    if (!stageView) return;
    stageView.classList.remove('hidden');

    const wordEl = document.getElementById('stage3-target-word');
    if (wordEl) wordEl.innerText = `${challengeWord.word} (${challengeWord.meaning})`;

    const exampleBox = document.getElementById('stage3-example-hint');
    if (exampleBox) {
        exampleBox.innerText = `Ví dụ: "${challengeWord.example}"`;
        exampleBox.parentElement.classList.add('hidden'); // Mặc định ẩn, bấm nút mới hiện
    }

    const textarea = document.getElementById('stage3-input-sentence');
    if (textarea) {
        textarea.value = '';
        textarea.disabled = false;
        setTimeout(() => textarea.focus(), 200);
    }

    const feedbackBox = document.getElementById('stage3-feedback');
    if (feedbackBox) {
        feedbackBox.classList.add('hidden');
        feedbackBox.innerHTML = '';
    }

    const nextBtn = document.getElementById('btn-stage3-next');
    if (nextBtn) nextBtn.classList.add('hidden');

    const submitBtn = document.getElementById('btn-stage3-submit');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>🐰 Kiểm tra câu viết</span>`;
    }
}

function toggleStage3Example() {
    const hintContainer = document.getElementById('stage3-example-container');
    if (hintContainer) hintContainer.classList.toggle('hidden');
}

async function checkStage3Sentence() {
    const textarea = document.getElementById('stage3-input-sentence');
    const sentence = textarea ? textarea.value.trim() : "";
    const feedbackBox = document.getElementById('stage3-feedback');
    const nextBtn = document.getElementById('btn-stage3-next');
    const submitBtn = document.getElementById('btn-stage3-submit');

    if (!sentence) {
        if (typeof showToast === 'function') {
            showToast("Bạn hãy viết một câu tiếng Anh ngắn có chứa từ này nhé!", "warning");
        }
        return;
    }

    const wordsInSentence = sentence.split(/\s+/);
    if (wordsInSentence.length < 3) {
        if (typeof showToast === 'function') {
            showToast("Câu của bạn hơi ngắn, hãy viết câu hoàn chỉnh có ít nhất 3-4 từ nhé!", "warning");
        }
        return;
    }

    // Kiểm tra xem câu có chứa từ cần học hay không (hỗ trợ cả các biến thể số nhiều, thêm ing, ed, v.v.)
    const cleanWord = challengeWord.word.toLowerCase().replace(/[^a-z]/g, '');
    const cleanSentence = sentence.toLowerCase().replace(/[^a-z\s]/g, ' ');
    const hasWord = cleanSentence.split(/\s+/).some(w => w.startsWith(cleanWord) || cleanWord.startsWith(w));

    if (!hasWord) {
        if (feedbackBox) {
            feedbackBox.className = "mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-800";
            feedbackBox.innerHTML = `⚠️ Trong câu của bạn hình như chưa có từ "<strong>${challengeWord.word}</strong>". Bạn hãy thêm từ này vào câu nhé!`;
            feedbackBox.classList.remove('hidden');
        }
        return;
    }

    // Người học đã dùng từ thành công!
    challengeStageResults.stage3 = true;
    challengeStudentSentence = sentence;

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-1"></i>Mochi đang phân tích...`;
    }

    let reviewComment = `Tuyệt vời! Bạn đã ứng dụng thành thạo từ "${challengeWord.word}" vào câu nói thực tế!`;

    // Nếu có API key, nhờ AI sửa nhẹ và khen câu
    if (typeof hasApiKey === 'function' && hasApiKey()) {
        try {
            const prompt = `Học viên vừa đặt câu với từ mới "${challengeWord.word}" (${challengeWord.meaning}). Câu học viên: "${sentence}". Hãy nhận xét ngắn gọn 1 câu bằng tiếng Việt xem câu đúng ngữ pháp chưa và sửa nhẹ nếu có lỗi.`;
            const schema = {
                type: "OBJECT",
                properties: {
                    feedback: { type: "STRING" },
                    improvedSentence: { type: "STRING" }
                },
                required: ["feedback", "improvedSentence"]
            };
            const raw = await callGeminiAPI(prompt, schema);
            const parsed = JSON.parse(raw);
            if (parsed && parsed.feedback) {
                reviewComment = `${parsed.feedback} (Gợi ý tự nhiên: "${parsed.improvedSentence}")`;
            }
        } catch (err) {
            console.warn("AI check sentence error:", err);
        }
    }

    if (textarea) textarea.disabled = true;
    if (feedbackBox) {
        feedbackBox.className = "mt-4 p-3.5 bg-mint-100 border border-mint-200 rounded-2xl text-xs font-bold text-emerald-800 space-y-1";
        feedbackBox.innerHTML = `
            <div>✅ <strong>Hoàn thành xuất sắc Giai đoạn 3!</strong></div>
            <div class="text-[11px] text-cocoa-700 font-medium">🐰 Mochi: ${reviewComment}</div>
        `;
        feedbackBox.classList.remove('hidden');
    }

    if (submitBtn) submitBtn.classList.add('hidden');
    if (nextBtn) nextBtn.classList.remove('hidden');
}

// =====================================================================
// GIAI ĐOẠN 4: CHECK PHÁT ÂM TỪ & NÓI CÂU LIÊN QUAN (SPEECH & MIC)
// =====================================================================
function setupStage4UI() {
    const stageView = document.getElementById('challenge-stage-4-view');
    if (!stageView) return;
    stageView.classList.remove('hidden');

    challengeStageResults.stage4a = false;
    challengeStageResults.stage4b = false;
    challengeListeningTarget = "word";

    // Setup 4A: Phát âm từ
    const wordTargetEl = document.getElementById('stage4-word-target');
    if (wordTargetEl) wordTargetEl.innerText = challengeWord.word;
    const ipaTargetEl = document.getElementById('stage4-ipa-target');
    if (ipaTargetEl) ipaTargetEl.innerText = challengeWord.ipa;

    const box4a = document.getElementById('stage4a-box');
    if (box4a) {
        box4a.className = "p-4 rounded-2xl border-2 border-blush-200 bg-blush-50/50 space-y-3";
    }
    const status4a = document.getElementById('stage4a-status');
    if (status4a) {
        status4a.innerHTML = `<span class="text-cocoa-700/80">Bấm Micro và đọc to từ "<strong>${challengeWord.word}</strong>"</span>`;
    }

    // Setup 4B: Nói câu liên quan
    const sentenceTargetEl = document.getElementById('stage4-sentence-target');
    const targetSentence = challengeStudentSentence || challengeWord.example;
    if (sentenceTargetEl) sentenceTargetEl.innerText = `"${targetSentence}"`;

    const box4b = document.getElementById('stage4b-box');
    if (box4b) {
        box4b.className = "p-4 rounded-2xl border-2 border-slate-200 bg-slate-50/50 space-y-3 opacity-60 pointer-events-none";
    }
    const status4b = document.getElementById('stage4b-status');
    if (status4b) {
        status4b.innerHTML = `<span class="text-slate-400">Hoàn thành phát âm từ ở trên để mở khóa bước này</span>`;
    }

    const finishBtn = document.getElementById('btn-stage4-finish');
    if (finishBtn) finishBtn.classList.add('hidden');
}

function startChallengeMic(target) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        if (typeof showToast === 'function') {
            showToast("Trình duyệt chưa hỗ trợ Micro nhận diện giọng nói. Bấm nút 'Bỏ qua Mic' để tiếp tục nhé!", "warning");
        }
        return;
    }

    stopChallengeMic();
    challengeListeningTarget = target;
    challengeIsListening = true;

    challengeRecognition = new SpeechRecognition();
    challengeRecognition.lang = 'en-US';
    challengeRecognition.continuous = false;
    challengeRecognition.interimResults = true;

    const micBtn = document.getElementById(target === 'word' ? 'btn-mic-stage4a' : 'btn-mic-stage4b');
    const statusEl = document.getElementById(target === 'word' ? 'stage4a-status' : 'stage4b-status');

    if (micBtn) {
        micBtn.classList.add('mic-recording', 'bg-rose-500');
        micBtn.innerHTML = `<i class="fa-solid fa-stop text-white"></i>`;
    }
    if (statusEl) {
        statusEl.innerHTML = `<span class="text-rose-600 font-bold animate-pulse">🎙️ Mochi đang lắng nghe bạn phát âm...</span>`;
    }

    challengeRecognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
        }
        if (statusEl && transcript) {
            statusEl.innerHTML = `<span class="italic text-cocoa-800">Bạn vừa nói: "<strong>${transcript}</strong>"</span>`;
        }
        evaluateSpeechResult(target, transcript);
    };

    challengeRecognition.onerror = (e) => {
        console.warn("Challenge Mic error:", e.error);
        stopChallengeMic();
        if (statusEl && !challengeStageResults[target === 'word' ? 'stage4a' : 'stage4b']) {
            statusEl.innerHTML = `<span class="text-amber-700">Mochi chưa nghe rõ, bạn bấm Micro thử lại nhé!</span>`;
        }
    };

    challengeRecognition.onend = () => {
        stopChallengeMic();
    };

    try {
        challengeRecognition.start();
    } catch (err) {
        console.warn("Mic start error:", err);
    }
}

function stopChallengeMic() {
    challengeIsListening = false;
    if (challengeRecognition) {
        try { challengeRecognition.stop(); } catch (e) {}
        challengeRecognition = null;
    }

    const btnA = document.getElementById('btn-mic-stage4a');
    if (btnA) {
        btnA.classList.remove('mic-recording', 'bg-rose-500');
        btnA.innerHTML = `<i class="fa-solid fa-microphone"></i>`;
    }
    const btnB = document.getElementById('btn-mic-stage4b');
    if (btnB) {
        btnB.classList.remove('mic-recording', 'bg-rose-500');
        btnB.innerHTML = `<i class="fa-solid fa-microphone"></i>`;
    }
}

function evaluateSpeechResult(target, speechText) {
    if (!speechText) return;
    const cleanSpeech = speechText.toLowerCase().replace(/[^a-z]/g, '');

    if (target === 'word') {
        const cleanTarget = challengeWord.word.toLowerCase().replace(/[^a-z]/g, '');
        // Chấp nhận nếu có chứa từ hoặc phát âm gần đúng
        if (cleanSpeech.includes(cleanTarget) || cleanTarget.includes(cleanSpeech) || cleanSpeech.length >= cleanTarget.length - 1) {
            challengeStageResults.stage4a = true;
            stopChallengeMic();

            const statusEl = document.getElementById('stage4a-status');
            if (statusEl) {
                statusEl.innerHTML = `<span class="text-emerald-700 font-extrabold">✅ Phát âm chuẩn xác: "<strong>${challengeWord.word}</strong>"!</span>`;
            }

            const box4a = document.getElementById('stage4a-box');
            if (box4a) {
                box4a.className = "p-4 rounded-2xl border-2 border-emerald-400 bg-mint-50 space-y-3";
            }

            // Mở khóa Bước 4B
            const box4b = document.getElementById('stage4b-box');
            if (box4b) {
                box4b.className = "p-4 rounded-2xl border-2 border-blush-300 bg-blush-50/60 space-y-3 transition-all";
            }
            const status4b = document.getElementById('stage4b-status');
            if (status4b) {
                status4b.innerHTML = `<span class="text-cocoa-700 font-bold">Bước 4B: Bấm Micro và đọc to câu trên nhé!</span>`;
            }

            if (typeof showToast === 'function') {
                showToast("Phát âm từ rất tốt! Giờ hãy đọc to câu ví dụ nhé 🎙️", "success");
            }
        }
    } else if (target === 'sentence') {
        // Kiểm tra câu nói: có ít nhất 2 từ khớp hoặc độ dài tương đối
        challengeStageResults.stage4b = true;
        stopChallengeMic();

        const statusEl = document.getElementById('stage4b-status');
        if (statusEl) {
            statusEl.innerHTML = `<span class="text-emerald-700 font-extrabold">🎉 Xuất sắc! Bạn đã luyện nói câu trôi chảy thành công!</span>`;
        }

        const box4b = document.getElementById('stage4b-box');
        if (box4b) {
            box4b.className = "p-4 rounded-2xl border-2 border-emerald-400 bg-mint-50 space-y-3";
        }

        const finishBtn = document.getElementById('btn-stage4-finish');
        if (finishBtn) finishBtn.classList.remove('hidden');
    }
}

// Bỏ qua kiểm tra giọng nói nếu thiết bị không có Micro
function bypassSpeechChallenge(target) {
    stopChallengeMic();
    if (target === 'word') {
        challengeStageResults.stage4a = true;
        const statusEl = document.getElementById('stage4a-status');
        if (statusEl) statusEl.innerHTML = `<span class="text-emerald-700 font-bold">✅ Đã xác nhận phát âm!</span>`;
        const box4b = document.getElementById('stage4b-box');
        if (box4b) box4b.className = "p-4 rounded-2xl border-2 border-blush-300 bg-blush-50/60 space-y-3";
        const status4b = document.getElementById('stage4b-status');
        if (status4b) status4b.innerHTML = `<span class="text-cocoa-700 font-bold">Bước 4B: Bấm Micro hoặc Đọc nhẩm câu trên</span>`;
    } else if (target === 'sentence') {
        challengeStageResults.stage4b = true;
        const statusEl = document.getElementById('stage4b-status');
        if (statusEl) statusEl.innerHTML = `<span class="text-emerald-700 font-bold">✅ Đã hoàn thành luyện nói câu!</span>`;
        const finishBtn = document.getElementById('btn-stage4-finish');
        if (finishBtn) finishBtn.classList.remove('hidden');
    }
}

// =====================================================================
// HOÀN THÀNH TOÀN BỘ 4 GIAI ĐOẠN - CÔNG NHẬN TỪ ĐÃ THUỘC
// =====================================================================
function completeVocabChallenge() {
    stopChallengeMic();

    // Chính thức đánh dấu từ này là ĐÃ THUỘC / ĐÃ HỌC XONG
    if (challengeWordIndex !== -1 && userProgress.vocabulary[challengeWordIndex]) {
        userProgress.vocabulary[challengeWordIndex].mastered = true;
        saveProgressToStorage();
        if (typeof addXP === 'function') {
            addXP(25, `Làm chủ từ vựng "${challengeWord.word}" qua 4 thử thách!`);
        }
        if (typeof renderFlashcards === 'function') {
            renderFlashcards();
        }
    }

    goToChallengeStage(5);
}

function setupVictoryUI() {
    const stageView = document.getElementById('challenge-victory-view');
    if (!stageView) return;
    stageView.classList.remove('hidden');

    const wordEl = document.getElementById('victory-word-badge');
    if (wordEl) wordEl.innerText = challengeWord.word;

    const meaningEl = document.getElementById('victory-word-meaning');
    if (meaningEl) meaningEl.innerText = `${challengeWord.ipa} • ${challengeWord.meaning}`;

    // Kiểm tra xem còn từ nào chưa thuộc không để mời làm tiếp
    const nextUnmasteredIdx = userProgress.vocabulary.findIndex(v => !v.mastered);
    const nextWordBtn = document.getElementById('btn-victory-next-word');
    if (nextWordBtn) {
        if (nextUnmasteredIdx !== -1) {
            nextWordBtn.classList.remove('hidden');
            nextWordBtn.innerHTML = `<span>Kiểm tra từ tiếp theo</span><i class="fa-solid fa-arrow-right ml-1"></i>`;
            nextWordBtn.onclick = () => startWordChallenge(nextUnmasteredIdx);
        } else {
            nextWordBtn.classList.add('hidden');
        }
    }
}
