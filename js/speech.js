/**
 * =====================================================================
 * MOCHI ENGLISH STUDIO - SPEECH SYNTHESIS & ADVANCED SPEECH RECOGNITION
 * =====================================================================
 */

let speechRecognizer = null;
let isMicListening = false;
let shouldKeepListening = false;
let activeVoiceTarget = "main"; // "main" | "floating"
let autoSpeakReplies = true;

let silenceTimer = null;
let recordingSeconds = 0;
let recordingTimerInterval = null;

// =====================================================================
// 1. TEXT-TO-SPEECH (TTS) ENGINE
// =====================================================================
function speakText(text, rate = 0.94) {
    if (!('speechSynthesis' in window)) {
        if (typeof showToast === 'function') {
            showToast("Trình duyệt chưa hỗ trợ giọng đọc tự động.", "warning");
        }
        return;
    }
    window.speechSynthesis.cancel();
    const clean = text.replace(/<[^>]*>?/gm, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = userProgress.speechAccent || 'en-US';
    utterance.rate = rate;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang.includes(utterance.lang) && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')))
                      || voices.find(v => v.lang.includes(utterance.lang));
    if (matchedVoice) utterance.voice = matchedVoice;

    window.speechSynthesis.speak(utterance);
}

if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

function toggleSpeechAccent() {
    userProgress.speechAccent = userProgress.speechAccent === 'en-US' ? 'en-GB' : 'en-US';
    saveProgressToStorage();
    if (typeof showToast === 'function') {
        showToast(`Đã chuyển sang ${userProgress.speechAccent === 'en-US' ? 'Giọng Mỹ (US)' : 'Giọng Anh (UK)'}`, "info");
    }
}

function toggleAutoTTS() {
    autoSpeakReplies = !autoSpeakReplies;
    const btn = document.getElementById('btn-auto-tts');
    const icon = document.getElementById('tts-icon');
    if (autoSpeakReplies) {
        if (icon) icon.className = "fa-solid fa-volume-high";
        if (btn) btn.querySelector('span').innerText = "Giọng đọc: BẬT";
    } else {
        window.speechSynthesis.cancel();
        if (icon) icon.className = "fa-solid fa-volume-xmark";
        if (btn) btn.querySelector('span').innerText = "Giọng đọc: TẮT";
    }
}

// =====================================================================
// 2. ADVANCED CONTINUOUS SPEECH RECOGNITION (CHỐNG NGẮT MIC ĐỘT NGỘT)
// =====================================================================
function setupVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const indicator = document.getElementById('mic-support-indicator');

    if (!SpeechRecognition) {
        if (indicator) {
            indicator.innerHTML = `<span class="text-amber-600">⚠️ Dùng Chrome/Edge để bật Micro nói trực tiếp</span>`;
        }
        return;
    }

    if (indicator) {
        indicator.innerHTML = `<span class="text-emerald-600">🟢 Micro sẵn sàng (Nhận diện liên tục)</span>`;
    }

    speechRecognizer = new SpeechRecognition();
    speechRecognizer.lang = 'en-US';
    // ĐẶT continuous = true để giữ mic nghe liên tục, không bị ngắt quãng giữa chừng khi người dùng lấy hơi
    speechRecognizer.continuous = true;
    speechRecognizer.interimResults = true;
    speechRecognizer.maxAlternatives = 1;

    speechRecognizer.onstart = () => {
        isMicListening = true;
        startRecordingTimer();
        updateMicUIActive();
    };

    speechRecognizer.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                final += transcript;
            } else {
                interim += transcript;
            }
        }

        const currentText = final || interim;
        if (currentText) {
            if (activeVoiceTarget === "main") {
                const bannerText = document.getElementById('voice-interim-text');
                if (bannerText) bannerText.innerText = `"${currentText}"`;
                const input = document.getElementById('speaking-input-box');
                if (input) input.value = currentText;
            } else {
                const floatInput = document.getElementById('floating-ai-input');
                if (floatInput) floatInput.value = currentText;
            }
        }

        // Đặt lại bộ đếm im lặng dài hơn (6.5 giây) thay vì tắt mic ngay lập tức
        resetSilenceTimer();
    };

    speechRecognizer.onerror = (e) => {
        console.warn("SpeechRecognition Event:", e.error);
        if (e.error === 'not-allowed') {
            shouldKeepListening = false;
            resetMicUI();
            if (typeof showToast === 'function') {
                showToast("Vui lòng cấp quyền truy cập Micro trên trình duyệt để luyện nói nhé!", "error");
            }
        } else if (e.error === 'no-speech') {
            // Không ngắt mic khi người dùng tạm ngừng nói để suy nghĩ
            // Tiếp tục giữ mic mở nếu người dùng chưa bấm dừng
        } else if (e.error === 'network') {
            // Khi gặp lỗi network tạm thời của Google Speech, thử giữ UI hoặc phục hồi
            console.warn("Speech recognition network hiccup");
        }
    };

    speechRecognizer.onend = () => {
        // Nếu người dùng vẫn muốn tiếp tục thu âm và chưa bấm nút Dừng/Gửi, tự động kết nối lại
        if (shouldKeepListening) {
            try {
                speechRecognizer.start();
                return;
            } catch (err) {
                console.warn("SpeechRecognizer restart:", err);
            }
        }
        
        // Khi thu âm thực sự kết thúc
        finishAndDeliverVoice();
    };
}

function startRecordingTimer() {
    recordingSeconds = 0;
    clearInterval(recordingTimerInterval);
    recordingTimerInterval = setInterval(() => {
        recordingSeconds++;
        const m = String(Math.floor(recordingSeconds / 60)).padStart(2, '0');
        const s = String(recordingSeconds % 60).padStart(2, '0');
        const timerBadge = document.getElementById('voice-timer-badge');
        if (timerBadge) {
            timerBadge.innerText = `${m}:${s}`;
        }
    }, 1000);
}

function resetSilenceTimer() {
    clearTimeout(silenceTimer);
    // Cho phép người dùng dừng nghỉ lên tới 6.5 giây trước khi tự động chốt câu
    silenceTimer = setTimeout(() => {
        if (isMicListening && shouldKeepListening) {
            stopVoiceCapture();
        }
    }, 6500);
}

function updateMicUIActive() {
    if (activeVoiceTarget === "main") {
        const btn = document.getElementById('btn-voice-mic');
        if (btn) {
            btn.classList.add('mic-recording', 'bg-rose-500');
            btn.title = "Bấm để dừng và gửi câu nói";
        }
        const icon = document.getElementById('voice-mic-icon');
        if (icon) icon.className = "fa-solid fa-stop";
        
        const banner = document.getElementById('voice-recording-banner');
        if (banner) banner.classList.remove('hidden');
        
        const interim = document.getElementById('voice-interim-text');
        if (interim) interim.innerText = "Mochi đang lắng nghe bạn nói tiếng Anh...";
    } else {
        const floatBtn = document.getElementById('btn-floating-mic');
        if (floatBtn) floatBtn.classList.add('mic-recording', 'bg-blush-500', 'text-white');
        const floatIcon = document.getElementById('floating-mic-icon');
        if (floatIcon) floatIcon.className = "fa-solid fa-stop text-xs";
        const floatInput = document.getElementById('floating-ai-input');
        if (floatInput) floatInput.placeholder = "Mochi đang nghe bạn nói...";
    }
}

function toggleVoiceCapture() {
    if (!speechRecognizer) {
        if (typeof showToast === 'function') {
            showToast("Trình duyệt này chưa hỗ trợ Micro. Bạn có thể gõ trực tiếp bên cạnh nhé!", "warning");
        }
        return;
    }

    if (isMicListening) {
        // Người dùng chủ động bấm dừng -> gửi ngay câu nói!
        stopVoiceCapture();
    } else {
        activeVoiceTarget = "main";
        shouldKeepListening = true;
        window.speechSynthesis.cancel();
        const input = document.getElementById('speaking-input-box');
        if (input) input.value = '';
        try {
            speechRecognizer.start();
        } catch (err) {
            console.warn("speechRecognizer start error:", err);
            speechRecognizer.stop();
            setTimeout(() => {
                if (shouldKeepListening) speechRecognizer.start();
            }, 300);
        }
    }
}

function toggleFloatingVoice() {
    if (!speechRecognizer) {
        if (typeof showToast === 'function') {
            showToast("Trình duyệt này chưa hỗ trợ Micro. Bạn hãy nhập câu hỏi nhé!", "warning");
        }
        return;
    }

    if (isMicListening) {
        stopVoiceCapture();
    } else {
        activeVoiceTarget = "floating";
        shouldKeepListening = true;
        window.speechSynthesis.cancel();
        const floatInput = document.getElementById('floating-ai-input');
        if (floatInput) floatInput.value = '';
        try {
            speechRecognizer.start();
        } catch (err) {
            console.warn("float speechRecognizer start error:", err);
            speechRecognizer.stop();
            setTimeout(() => {
                if (shouldKeepListening) speechRecognizer.start();
            }, 300);
        }
    }
}

function stopVoiceCapture() {
    shouldKeepListening = false;
    clearTimeout(silenceTimer);
    clearInterval(recordingTimerInterval);
    if (speechRecognizer && isMicListening) {
        try {
            speechRecognizer.stop();
        } catch (err) {
            console.warn("Error stopping recognizer:", err);
            finishAndDeliverVoice();
        }
    } else {
        resetMicUI();
    }
}

function finishAndDeliverVoice() {
    const target = activeVoiceTarget;
    resetMicUI();

    if (target === "main") {
        const input = document.getElementById('speaking-input-box');
        const spokenText = input ? input.value.trim() : '';
        if (spokenText && typeof handleSendSpeaking === 'function') {
            handleSendSpeaking();
        }
    } else {
        const floatInput = document.getElementById('floating-ai-input');
        const spokenText = floatInput ? floatInput.value.trim() : '';
        if (spokenText && typeof handleFloatingAISend === 'function') {
            handleFloatingAISend();
        }
    }
}

function resetMicUI() {
    isMicListening = false;
    shouldKeepListening = false;
    clearTimeout(silenceTimer);
    clearInterval(recordingTimerInterval);

    const btn = document.getElementById('btn-voice-mic');
    if (btn) {
        btn.classList.remove('mic-recording', 'bg-rose-500');
        btn.title = "Bấm để nói tiếng Anh";
    }
    const icon = document.getElementById('voice-mic-icon');
    if (icon) icon.className = "fa-solid fa-microphone";

    const banner = document.getElementById('voice-recording-banner');
    if (banner) banner.classList.add('hidden');

    const floatBtn = document.getElementById('btn-floating-mic');
    if (floatBtn) floatBtn.classList.remove('mic-recording', 'bg-blush-500', 'text-white');
    const floatIcon = document.getElementById('floating-mic-icon');
    if (floatIcon) floatIcon.className = "fa-solid fa-microphone text-xs";
    const floatInput = document.getElementById('floating-ai-input');
    if (floatInput) floatInput.placeholder = "Hỏi Mochi hoặc nói tiếng Anh...";
}
