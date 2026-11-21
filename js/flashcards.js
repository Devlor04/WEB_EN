/**
 * =====================================================================
 * MOCHI ENGLISH STUDIO - FLASHCARDS & VOCABULARY MANAGEMENT
 * =====================================================================
 */

function renderFlashcards() {
    const grid = document.getElementById('flashcards-grid');
    if (!grid) return;

    const totalCountEl = document.getElementById('vocab-total-count');
    if (totalCountEl) totalCountEl.innerText = userProgress.vocabulary.length;
    grid.innerHTML = '';

    userProgress.vocabulary.forEach((item, index) => {
        const cardWrapper = document.createElement('div');
        cardWrapper.className = "perspective-1000 min-h-[220px] cursor-pointer group";
        cardWrapper.onclick = function(e) {
            if (e.target.closest('button')) return;
            const inner = this.querySelector('.card-inner');
            if (inner) inner.classList.toggle('rotate-y-180');
        };

        const starStyle = item.mastered
            ? "bg-amber-400 text-white border-amber-400 shadow-2xs"
            : "bg-white text-slate-400 border-slate-200 hover:border-amber-300 hover:text-amber-400";

        const escapedWord = (item.word || '').replace(/'/g, "\\'");
        const escapedExample = (item.example || '').replace(/'/g, "\\'");

        // Action button trên mặt thẻ
        const challengeButtonFront = item.mastered
            ? `<div class="flex items-center justify-between pt-1 border-t border-mint-100">
                   <span class="text-[11px] font-extrabold text-emerald-700 bg-mint-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                       <i class="fa-solid fa-circle-check text-[10px]"></i> Đã thuộc (4/4)
                   </span>
                   <button onclick="startWordChallenge(${index})" title="Ôn tập lại 4 thử thách" class="text-[11px] font-bold text-blush-500 hover:text-blush-600 underline cursor-pointer">
                       Ôn lại 🔄
                   </button>
               </div>`
            : `<button onclick="startWordChallenge(${index})" title="Hoàn thành 4 thử thách để mở khóa từ đã thuộc" class="w-full py-1.5 px-2 bg-gradient-to-r from-mint-500 to-emerald-600 hover:opacity-95 text-white text-[11px] font-extrabold rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition cursor-pointer">
                   <i class="fa-solid fa-graduation-cap"></i>
                   <span>Kiểm tra 4 bước 🎯</span>
               </button>`;

        const challengeButtonBack = item.mastered
            ? `<div class="flex items-center justify-between text-[11px] font-bold text-white/90 pt-1 border-t border-white/20">
                   <span>⭐ Đã làm chủ từ này</span>
                   <button onclick="startWordChallenge(${index})" class="underline hover:text-white cursor-pointer">Ôn lại 4 bước</button>
               </div>`
            : `<button onclick="startWordChallenge(${index})" class="w-full py-1.5 px-2 bg-white text-emerald-800 hover:bg-mint-50 text-[11px] font-extrabold rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition cursor-pointer">
                   <i class="fa-solid fa-graduation-cap text-emerald-600"></i>
                   <span>Làm thử thách 4 bước 🎯</span>
               </button>`;

        cardWrapper.innerHTML = `
            <div class="card-inner relative w-full h-full transform-style-3d rounded-3xl shadow-card">
                <!-- Front Face -->
                <div class="absolute inset-0 backface-hidden bg-gradient-to-b from-white to-blush-50/40 border-2 ${item.mastered ? 'border-mint-300' : 'border-blush-100'} group-hover:border-blush-400 rounded-3xl p-4 flex flex-col justify-between">
                    <div class="flex justify-between items-center">
                        <button onclick="toggleMasteredWord(${index})" title="${item.mastered ? 'Bấm để đánh dấu cần học lại' : 'Bấm để bắt đầu kiểm tra 4 bước'}" class="w-7 h-7 rounded-full border flex items-center justify-center text-xs transition ${starStyle} cursor-pointer">
                            <i class="fa-solid fa-star"></i>
                        </button>
                        <button onclick="speakText('${escapedWord}')" title="Nghe phát âm chuẩn" class="w-8 h-8 rounded-full bg-blush-100 hover:bg-blush-400 text-blush-500 hover:text-white flex items-center justify-center transition cursor-pointer">
                            <i class="fa-solid fa-volume-high text-xs"></i>
                        </button>
                    </div>

                    <div class="text-center my-auto">
                        <h3 class="font-heading text-lg font-extrabold text-cocoa-800">${item.word}</h3>
                        <p class="text-xs font-mono text-lavender-600 font-bold mt-1">${item.ipa}</p>
                    </div>

                    <div class="space-y-1.5">
                        ${challengeButtonFront}
                        <div class="text-center text-[10px] font-bold text-cocoa-700/50">
                            <i class="fa-solid fa-rotate mr-0.5"></i> Chạm thẻ để lật
                        </div>
                    </div>
                </div>

                <!-- Back Face -->
                <div class="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-blush-400 to-lavender-500 text-white rounded-3xl p-4 flex flex-col justify-between">
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-extrabold text-white/90">${item.word}</span>
                        <button onclick="speakText('${escapedExample}')" title="Nghe câu ví dụ" class="w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 text-white flex items-center justify-center transition cursor-pointer">
                            <i class="fa-solid fa-volume-high text-[11px]"></i>
                        </button>
                    </div>

                    <div>
                        <p class="font-heading font-extrabold text-sm text-amber-200 mb-1">${item.meaning}</p>
                        <p class="text-xs text-white/95 leading-snug italic">"${item.example}"</p>
                    </div>

                    <div class="space-y-1.5">
                        ${challengeButtonBack}
                        <div class="text-right text-[10px] font-bold text-white/80">Chạm để lật lại ↺</div>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(cardWrapper);
    });
    updateAllStatsUI();
}

function toggleMasteredWord(idx) {
    if (!userProgress.vocabulary[idx]) return;
    const item = userProgress.vocabulary[idx];

    if (!item.mastered) {
        // Nếu chưa thuộc: Bấm vào ngôi sao sẽ kích hoạt bài kiểm tra 4 bước để đảm bảo bạn thực sự thành thạo!
        if (typeof startWordChallenge === 'function') {
            startWordChallenge(idx);
        } else {
            item.mastered = true;
            saveProgressToStorage();
            renderFlashcards();
        }
    } else {
        // Nếu đã thuộc: Cho phép chuyển về trạng thái cần ôn tập lại
        if (confirm(`Bạn có muốn đưa từ "${item.word}" về trạng thái cần ôn tập lại không?`)) {
            item.mastered = false;
            saveProgressToStorage();
            renderFlashcards();
            if (typeof showToast === 'function') {
                showToast(`Đã chuyển từ "${item.word}" về danh sách cần ôn luyện! 🌱`, "info");
            }
        }
    }
}

function toggleCustomVocabForm() {
    const f = document.getElementById('custom-vocab-form');
    if (f) f.classList.toggle('hidden');
}

function saveCustomWord() {
    const wordInput = document.getElementById('input-word');
    const ipaInput = document.getElementById('input-ipa');
    const meaningInput = document.getElementById('input-meaning');
    const exampleInput = document.getElementById('input-example');

    const word = wordInput ? wordInput.value.trim() : '';
    const ipa = ipaInput ? ipaInput.value.trim() || "/.../" : "/.../";
    const meaning = meaningInput ? meaningInput.value.trim() : '';
    const example = exampleInput ? exampleInput.value.trim() || `I am learning how to use "${word}" properly.` : `I am learning how to use "${word}" properly.`;

    if (!word || !meaning) {
        if (typeof showToast === 'function') {
            showToast("Bạn nhớ nhập Từ tiếng Anh và Nghĩa tiếng Việt nhé!", "warning");
        }
        return;
    }

    userProgress.vocabulary.unshift({ word, ipa, meaning, example, mastered: false });
    saveProgressToStorage();
    renderFlashcards();

    if (wordInput) wordInput.value = '';
    if (ipaInput) ipaInput.value = '';
    if (meaningInput) meaningInput.value = '';
    if (exampleInput) exampleInput.value = '';

    toggleCustomVocabForm();
    if (typeof showToast === 'function') {
        showToast(`Đã thêm từ "${word}" vào bộ thẻ học! 🍓`, "success");
    }
}

async function generateAIVocabDeck() {
    const btn = document.getElementById('btn-ai-vocab');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i><span>Mochi đang chọn từ...</span>`;
    }

    const cfg = LEVEL_CONFIGS[userProgress.level] || LEVEL_CONFIGS["A2_B2"];
    let newCards = [];

    if (typeof hasApiKey === 'function' && hasApiKey()) {
        const prompt = `Tạo danh sách 5 từ vựng tiếng Anh trình độ ${cfg.badge} phù hợp cho mục tiêu "${userProgress.goal}". Mỗi từ gồm: word, ipa, meaning (tiếng Việt ngắn gọn), example (1 câu ví dụ tiếng Anh tự nhiên).`;
        const schema = {
            type: "OBJECT",
            properties: {
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
                }
            },
            required: ["words"]
        };

        try {
            const raw = await callGeminiAPI(prompt, schema);
            const parsed = JSON.parse(raw);
            if (parsed && parsed.words && parsed.words.length > 0) {
                newCards = parsed.words.map(w => ({ ...w, mastered: false }));
            }
        } catch (err) {
            console.warn("AI Vocab deck generation failed, using fallback bank:", err);
        }
    }

    if (newCards.length === 0) {
        // Fallback từ ngân hàng bài học
        const fallback = generateLessonFromBank(userProgress.level, userProgress.goal, userProgress.day);
        newCards = fallback.words.map(w => ({ ...w, mastered: false }));
    }

    if (newCards.length > 0) {
        userProgress.vocabulary = [...newCards, ...userProgress.vocabulary];
        saveProgressToStorage();
        renderFlashcards();
        if (typeof showToast === 'function') {
            showToast(`Mochi vừa thêm ${newCards.length} từ vựng ${cfg.badge} mới cho bạn! ✨`, "success");
        }
    }

    if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i><span>AI Tạo 5 Từ Mới</span>`;
    }
}
