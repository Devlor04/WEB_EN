/**
 * =====================================================================
 * MOCHI ENGLISH STUDIO - DATA PRESETS & LESSON BANK
 * =====================================================================
 */

const LEVEL_CONFIGS = {
    "A0_A2": {
        badge: "A0 → A2",
        name: "Mất gốc (A0 → A2)",
        defaultQuiz: "beginner",
        defaultWriting: "0",
        defaultSpeaking: "Beginner Self-Introduction",
        tip: "<strong>Mẹo từ Mochi:</strong> Đừng lo lắng nếu bạn mất gốc! Mỗi ngày chỉ cần nắm chắc 5-8 từ vựng cơ bản, ghép thành câu đơn ngắn gọn và bấm loa đọc to theo nhé!",
        phases: [
            { title: "🌱 Giai đoạn 1: Đánh thức nền tảng (Tuần 1 - 4)", tag: "Ngày 1-30", desc: "Bảng phiên âm IPA, động từ To be, đại từ nhân xưng và 300 từ vựng giao tiếp sinh hoạt." },
            { title: "🌿 Giai đoạn 2: Ghép câu giao tiếp (Tuần 5 - 8)", tag: "Ngày 31-60", desc: "Thì hiện tại đơn, quá khứ đơn, hỏi đường, mua sắm, giới thiệu bản thân & gia đình." },
            { title: "🌸 Giai đoạn 3: Tự tin phản xạ A2 (Tuần 9 - 12)", tag: "Ngày 61-90", desc: "Nghe hiểu hội thoại ngắn và trò chuyện tự nhiên 3-5 phút với người nước ngoài." }
        ],
        vocab: [
            { word: "Introduce", ipa: "/ˌɪn.trəˈdʒuːs/", meaning: "Giới thiệu", example: "Let me introduce myself to the class.", mastered: false },
            { word: "Morning", ipa: "/ˈmɔː.nɪŋ/", meaning: "Buổi sáng", example: "I drink a cup of coffee every morning.", mastered: false },
            { word: "Favorite", ipa: "/ˈfeɪ.vər.ɪt/", meaning: "Yêu thích nhất", example: "My favorite color is pastel pink.", mastered: false },
            { word: "Understand", ipa: "/ˌʌn.dəˈstænd/", meaning: "Hiểu, nắm bắt", example: "I understand English better every day.", mastered: false },
            { word: "Practice", ipa: "/ˈpræk.tɪs/", meaning: "Luyện tập, thực hành", example: "We practice speaking English with Mochi.", mastered: false },
            { word: "Breakfast", ipa: "/ˈbrek.fəst/", meaning: "Bữa ăn sáng", example: "She usually eats bread for breakfast.", mastered: false },
            { word: "Friendly", ipa: "/ˈfrend.li/", meaning: "Thân thiện", example: "Vietnamese people are very friendly.", mastered: false },
            { word: "Weekend", ipa: "/ˌwiːkˈend/", meaning: "Cuối tuần", example: "What do you often do on the weekend?", mastered: false }
        ]
    },
    "A2_B2": {
        badge: "A2 → B2",
        name: "Cơ bản (A2 → B2)",
        defaultQuiz: "tenses",
        defaultWriting: "1",
        defaultSpeaking: "Daily Routine & English Goals",
        tip: "<strong>Mẹo từ Mochi:</strong> Vì bạn đã có nền tảng đọc hiểu, hãy dùng chính các bài đọc để nhặt từ vựng mới, kết hợp sửa lỗi ngữ pháp khi nói để bứt phá lên B2 nhé!",
        phases: [
            { title: "🌱 Giai đoạn 1: Xây móng (Tuần 1 - 4)", tag: "Ngày 1-30", desc: "Nắm chắc 6 thì cơ bản, Từ loại (N-V-Adj-Adv), luyện phát âm chuẩn & phản xạ câu đơn tự tin." },
            { title: "🌿 Giai đoạn 2: Tăng tốc B1-B2 (Tuần 5 - 8)", tag: "Ngày 31-60", desc: "Mệnh đề quan hệ, Câu điều kiện, Bị động. Kéo dài câu nói 3-4 ý & chinh phục TOEIC Part 5-6." },
            { title: "🌸 Giai đoạn 3: Về đích 700+ (Tuần 9 - 12)", tag: "Ngày 61-90", desc: "Luyện đề tổng hợp, tăng tốc đọc hiểu Part 7 & thảo luận trôi chảy các chủ đề công việc." }
        ],
        vocab: [
            { word: "Schedule", ipa: "/ˈskedʒ.uːl/", meaning: "Lịch trình, kế hoạch", example: "I always check my schedule every morning.", mastered: false },
            { word: "Deadline", ipa: "/ˈded.laɪn/", meaning: "Hạn chót hoàn thành", example: "We must submit our report before the deadline.", mastered: false },
            { word: "Colleague", ipa: "/ˈkɒl.iːɡ/", meaning: "Đồng nghiệp", example: "My colleagues are friendly and helpful.", mastered: false },
            { word: "Attend", ipa: "/əˈtend/", meaning: "Tham dự (cuộc họp, sự kiện)", example: "All employees will attend the meeting at 9 AM.", mastered: false },
            { word: "Submit", ipa: "/səbˈmɪt/", meaning: "Nộp (báo cáo, hồ sơ)", example: "Please submit your application by Friday.", mastered: false },
            { word: "Improve", ipa: "/ɪmˈpruːv/", meaning: "Cải thiện, nâng cao", example: "I am speaking English daily to improve my fluency.", mastered: false },
            { word: "Fluently", ipa: "/ˈfluː.ənt.li/", meaning: "Một cách trôi chảy", example: "She can speak English fluently after 3 months.", mastered: false },
            { word: "Prepare", ipa: "/prɪˈpeər/", meaning: "Chuẩn bị", example: "He is preparing for his upcoming TOEIC exam.", mastered: false },
            { word: "Require", ipa: "/rɪˈkwaɪər/", meaning: "Yêu cầu, đòi hỏi", example: "This position requires a TOEIC score of 700.", mastered: false },
            { word: "Manage", ipa: "/ˈmæn.ɪdʒ/", meaning: "Quản lý, xoay xở", example: "Good time management helps you reduce stress.", mastered: false }
        ]
    },
    "B1_C1": {
        badge: "B1 → C1",
        name: "Trung cấp (B1 → C1)",
        defaultQuiz: "part5",
        defaultWriting: "3",
        defaultSpeaking: "Office Small Talk & Meetings",
        tip: "<strong>Mẹo từ Mochi:</strong> Ở trình độ B1-C1, chìa khóa để bứt phá là dùng cụm từ cố định (Collocations), từ nối học thuật và diễn đạt quan điểm đa chiều!",
        phases: [
            { title: "🌱 Giai đoạn 1: Nâng cấp từ vựng (Tuần 1 - 4)", tag: "Ngày 1-30", desc: "Thay thế từ đơn giản bằng Collocations, Phrasal Verbs và cấu trúc câu phức tự nhiên." },
            { title: "🌿 Giai đoạn 2: Tư duy phản biện (Tuần 5 - 8)", tag: "Ngày 31-60", desc: "Đảo ngữ, Mệnh đề phân từ, viết luận mạch lạc & thuyết trình chủ đề kinh tế - xã hội." },
            { title: "🌸 Giai đoạn 3: Chinh phục C1 / 850+ (Tuần 9 - 12)", tag: "Ngày 61-90", desc: "Xử lý bẫy đọc hiểu tốc độ cao và đàm phán trôi chảy như người bản xứ." }
        ],
        vocab: [
            { word: "Collaborate", ipa: "/kəˈlæb.ə.reɪt/", meaning: "Hợp tác, cộng tác", example: "Our team collaborates closely with international partners.", mastered: false },
            { word: "Implement", ipa: "/ˈɪm.plɪ.ment/", meaning: "Triển khai, thực thi", example: "The company decided to implement a new strategy.", mastered: false },
            { word: "Comprehensive", ipa: "/ˌkɒm.prɪˈhen.sɪv/", meaning: "Toàn diện, bao quát", example: "She gave a comprehensive analysis of the market.", mastered: false },
            { word: "Negotiate", ipa: "/nɪˈɡəʊ.ʃi.eɪt/", meaning: "Đàm phán, thương lượng", example: "We successfully negotiated a better contract.", mastered: false },
            { word: "Substantial", ipa: "/səbˈstæn.ʃəl/", meaning: "Đáng kể, lớn lao", example: "There has been a substantial improvement in sales.", mastered: false },
            { word: "Facilitate", ipa: "/fəˈsɪl.ɪ.teɪt/", meaning: "Tạo điều kiện thuận lợi", example: "Modern technology facilitates remote working.", mastered: false },
            { word: "Perspective", ipa: "/pəˈspek.tɪv/", meaning: "Góc nhìn, quan điểm", example: "Traveling abroad broadens your perspective on life.", mastered: false },
            { word: "Consistent", ipa: "/kənˈsɪs.tənt/", meaning: "Kiên trì, nhất quán", example: "Consistent daily practice is the secret to fluency.", mastered: false }
        ]
    }
};

const BUILTIN_QUIZZES = {
    beginner: {
        passage: null,
        questions: [
            {
                q: "1. Hello! My name ______ Linh and I ______ a university student.",
                options: ["is / am", "am / is", "are / am", "is / are"],
                answer: 0,
                explanation: "'My name' là ngôi thứ 3 số ít nên dùng 'is'. Chủ ngữ 'I' luôn đi với 'am'."
            },
            {
                q: "2. They ______ from Vietnam, so they speak Vietnamese very well.",
                options: ["is", "am", "are", "be"],
                answer: 2,
                explanation: "Chủ ngữ 'They' (họ) là số nhiều nên động từ to be chia là 'are'."
            },
            {
                q: "3. Every morning, my father ______ coffee before going to work.",
                options: ["drink", "drinks", "drinking", "is drink"],
                answer: 1,
                explanation: "Thói quen hằng ngày ('Every morning') với chủ ngữ số ít 'my father' -> động từ thêm 's': 'drinks'."
            },
            {
                q: "4. ______ you like learning English with Mochi?",
                options: ["Does", "Are", "Do", "Is"],
                answer: 2,
                explanation: "'like' là động từ thường, chủ ngữ là 'you' nên ta mượn trợ động từ 'Do' để đặt câu hỏi."
            }
        ]
    },
    tenses: {
        passage: null,
        questions: [
            {
                q: "1. Ms. Lan usually ______ to the office by bus, but today she ______ her car.",
                options: ["goes / drives", "goes / is driving", "is going / drives", "go / is driving"],
                answer: 1,
                explanation: "Vế đầu có 'usually' (thói quen) dùng Hiện tại đơn 'goes'. Vế sau có 'today' (hành động tạm thời hôm nay) dùng Hiện tại tiếp diễn 'is driving'."
            },
            {
                q: "2. Please be quiet! The manager ______ an important meeting with clients right now.",
                options: ["attends", "attend", "is attending", "attended"],
                answer: 2,
                explanation: "Dấu hiệu 'Please be quiet!' và 'right now' diễn tả hành động đang diễn ra ngay lúc nói -> dùng Hiện tại tiếp diễn 'is attending'."
            },
            {
                q: "3. Our company ______ all employees to submit their weekly reports every Friday.",
                options: ["requires", "is requiring", "require", "requiring"],
                answer: 0,
                explanation: "Dấu hiệu 'every Friday' diễn tả lịch trình lặp lại hằng tuần, chủ ngữ 'Our company' số ít -> dùng Hiện tại đơn 'requires'."
            },
            {
                q: "4. I ______ my English skills at the moment because I want to achieve 700 in TOEIC.",
                options: ["improve", "am improving", "improves", "improved"],
                answer: 1,
                explanation: "Dấu hiệu 'at the moment' (giai đoạn hiện tại) -> dùng Hiện tại tiếp diễn 'am improving'."
            },
            {
                q: "5. What time ______ the train to Hanoi ______ tomorrow morning?",
                options: ["does / leave", "is / leaving", "do / leave", "does / leaves"],
                answer: 0,
                explanation: "Lịch trình tàu xe, máy bay cố định dùng thì Hiện tại đơn. Chủ ngữ 'the train' số ít nên mượn trợ động từ 'does' + V nguyên mẫu 'leave'."
            }
        ]
    },
    part5: {
        passage: null,
        questions: [
            {
                q: "1. All applicants must ______ their resumes online before October 15.",
                options: ["submission", "submit", "submitting", "submitted"],
                answer: 1,
                explanation: "Sau động từ khuyết thiếu 'must' luôn cần một động từ nguyên mẫu (V-bare) -> chọn 'submit' (nộp)."
            },
            {
                q: "2. Mr. Tanaka spoke so ______ during the presentation that everyone understood his ideas.",
                options: ["clear", "clarity", "clearly", "clearness"],
                answer: 2,
                explanation: "Cần một trạng từ (Adverb) để bổ nghĩa cho động từ thường 'spoke' (nói một cách rõ ràng) -> chọn 'clearly'."
            },
            {
                q: "3. The marketing team is responsible for ______ new strategies to attract customers.",
                options: ["develop", "developed", "developing", "development"],
                answer: 2,
                explanation: "Sau giới từ 'for' (trong cụm 'be responsible for') ta dùng danh động từ (V-ing) -> chọn 'developing'."
            },
            {
                q: "4. Due to the heavy rain, the outdoor company event was ______ until next Monday.",
                options: ["postponed", "attended", "required", "managed"],
                answer: 0,
                explanation: "Câu hỏi từ vựng TOEIC: Vì trời mưa lớn, sự kiện ngoài trời đã bị 'hoãn lại' (postponed) cho đến thứ Hai tới."
            },
            {
                q: "5. If you ______ any questions about your schedule, please contact the HR department.",
                options: ["had", "have", "will have", "having"],
                answer: 1,
                explanation: "Câu điều kiện loại 1 diễn tả sự thật ở hiện tại/tương lai: If + S + V(hiện tại đơn), S + will/can/V(mệnh lệnh) -> chọn 'have'."
            }
        ]
    },
    reading: {
        passage: `<strong>To:</strong> All Marketing Staff<br><strong>From:</strong> Sarah Jenkins, Marketing Director<br><strong>Date:</strong> November 18<br><strong>Subject:</strong> Weekly Team Meeting Schedule Change<br><br>Dear Team,<br><br>Please be informed that our regular weekly meeting, which usually takes place on Friday mornings at 9:00 AM, is being moved to Thursday afternoon at 2:00 PM this week. This change is necessary because several senior managers are attending an international trade conference on Friday.<br><br>During Thursday's meeting, we will review the Q4 advertising budget and discuss the upcoming product launch. Please prepare a brief 5-minute update on your current projects and submit your slides to me by Thursday at 11:00 AM. Thank you for your cooperation.`,
        questions: [
            {
                q: "1. What is the main purpose of this email?",
                options: [
                    "To cancel a trade conference",
                    "To announce a change in the meeting schedule",
                    "To hire new marketing staff",
                    "To approve the Q4 advertising budget"
                ],
                answer: 1,
                explanation: "Dòng Subject ghi 'Weekly Team Meeting Schedule Change' và đoạn 1 thông báo cuộc họp tuần này được dời sang chiều thứ Năm."
            },
            {
                q: "2. Why is the meeting being moved this week?",
                options: [
                    "The conference room is under repair.",
                    "Sarah Jenkins is on vacation.",
                    "Some senior managers will be at a conference on Friday.",
                    "The project slides are not ready yet."
                ],
                answer: 2,
                explanation: "Câu cuối đoạn 1 nêu rõ: 'because several senior managers are attending an international trade conference on Friday'."
            },
            {
                q: "3. What are staff members asked to do before 11:00 AM on Thursday?",
                options: [
                    "Submit their presentation slides to Sarah",
                    "Book tickets for the international conference",
                    "Send an email to clients",
                    "Review the Q4 budget"
                ],
                answer: 0,
                explanation: "Đoạn 2 có câu: 'submit your slides to me by Thursday at 11:00 AM'."
            }
        ]
    }
};

const WRITING_PROMPTS = [
    {
        title: "Đề bài (Mất gốc A0-A1): Introduce yourself in 5-7 simple sentences (your name, job/school, hobbies, and why you learn English).",
        tips: "Gợi ý: Dùng các mẫu câu đơn giản: My name is..., I am a..., I like..., I want to learn English because..."
    },
    {
        title: "Đề bài (Cơ bản A2-B1): Describe your daily routine and what you are doing right now to improve your English.",
        tips: "Gợi ý: Dùng Hiện tại đơn cho thói quen hằng ngày, Hiện tại tiếp diễn cho việc học tiếng Anh hiện tại. Dùng từ: schedule, improve, fluently, prepare."
    },
    {
        title: "Đề bài (TOEIC Email): Write an email to your colleague, Mr. David, to reschedule tomorrow's meeting from 9:00 AM to 3:00 PM because you have an urgent client call.",
        tips: "Gợi ý: Mở đầu lịch sự (Dear David,), nêu lý do dời lịch (schedule, attend, urgent), đề xuất giờ mới và kết thúc chuyên nghiệp (Best regards,)."
    },
    {
        title: "Đề bài (Nâng cao B2-C1): Why is achieving high English proficiency important for career advancement in a globalized world?",
        tips: "Gợi ý: Nêu 2-3 luận điểm chặt chẽ dùng từ nối (Furthermore, Consequently, From my perspective) và từ vựng: collaborate, substantial, opportunity."
    }
];

// Ngân hàng bài học phong phú dùng cho Smart Fallback khi không có API key
const LESSON_BANK = {
    "A0_A2": [
        {
            title: "Giao tiếp sinh hoạt: Mua sắm & Hỏi giá tiền",
            words: [
                { word: "Cost", ipa: "/kɒst/", meaning: "Trị giá, giá tiền", example: "How much does this cute cup cost?" },
                { word: "Discount", ipa: "/ˈdɪs.kaʊnt/", meaning: "Giảm giá, chiết khấu", example: "Can I get a 10% discount on this item?" },
                { word: "Expensive", ipa: "/ɪkˈspen.sɪv/", meaning: "Đắt đỏ", example: "This dress is too expensive for me." },
                { word: "Cheap", ipa: "/tʃiːp/", meaning: "Rẻ, phải chăng", example: "Street food in Vietnam is tasty and cheap." },
                { word: "Customer", ipa: "/ˈkʌs.tə.mər/", meaning: "Khách hàng", example: "The shop is welcoming many customers today." }
            ],
            questions: [
                {
                    q: "How much ______ this hat cost?",
                    options: ["is", "do", "does", "are"],
                    answer: 2,
                    explanation: "Chủ ngữ 'this hat' số ít và có động từ thường 'cost', câu hỏi thì hiện tại đơn mượn trợ động từ 'does'."
                },
                {
                    q: "This notebook is 50,000 VND. It is very ______.",
                    options: ["cheap", "expensive", "cost", "friendly"],
                    answer: 0,
                    explanation: "50,000 VND là mức giá rẻ, hợp lý nên dùng tính từ 'cheap'."
                },
                {
                    q: "Can I ______ with a credit card?",
                    options: ["pay", "pays", "paying", "paid"],
                    answer: 0,
                    explanation: "Sau động từ khuyết thiếu 'Can' luôn dùng động từ nguyên mẫu 'pay'."
                }
            ]
        },
        {
            title: "Giao tiếp hằng ngày: Đi lại & Hỏi đường",
            words: [
                { word: "Straight", ipa: "/streɪt/", meaning: "Thẳng phía trước", example: "Go straight for 200 meters and turn left." },
                { word: "Opposite", ipa: "/ˈɒp.ə.zɪt/", meaning: "Đối diện", example: "The bookstore is opposite the supermarket." },
                { word: "Turn", ipa: "/tɜːn/", meaning: "Rẽ, quẹo", example: "Turn right at the traffic lights." },
                { word: "Between", ipa: "/bɪˈtwiːn/", meaning: "Ở giữa", example: "My house is between two tall trees." },
                { word: "Far", ipa: "/fɑːr/", meaning: "Xa xôi", example: "Is it far from here to the bus stop?" }
            ],
            questions: [
                {
                    q: "Excuse me, how can I ______ to the post office?",
                    options: ["go", "get", "getting", "gets"],
                    answer: 1,
                    explanation: "Cụm từ chỉ đường thông dụng: 'how can I get to + địa điểm' (làm sao tôi đến được...)."
                },
                {
                    q: "The coffee shop is ______ the left side of the street.",
                    options: ["in", "at", "on", "to"],
                    answer: 2,
                    explanation: "Chỉ vị trí bên trái/phải dùng giới từ 'on': 'on the left side'."
                },
                {
                    q: "It takes about 10 minutes ______ walk there.",
                    options: ["to", "for", "with", "at"],
                    answer: 0,
                    explanation: "Cấu trúc: 'It takes + thời gian + to + V-nguyên mẫu' (Mất bao lâu để làm gì)."
                }
            ]
        }
    ],
    "A2_B2": [
        {
            title: "Kỹ năng công sở: Trao đổi Email & Họp nhóm",
            words: [
                { word: "Confirm", ipa: "/kənˈfɜːm/", meaning: "Xác nhận", example: "Please confirm your attendance by replying to this email." },
                { word: "Proposal", ipa: "/prəˈpəʊ.zəl/", meaning: "Đề xuất, bản kế hoạch", example: "We reviewed the marketing proposal this morning." },
                { word: "Feedback", ipa: "/ˈfiːd.bæk/", meaning: "Ý kiến phản hồi", example: "We appreciate your constructive feedback." },
                { word: "Urgent", ipa: "/ˈɜː.dʒənt/", meaning: "Khẩn cấp, gấp gáp", example: "I received an urgent message from the client." },
                { word: "Postpone", ipa: "/pəʊstˈpəʊn/", meaning: "Trì hoãn, dời lại", example: "The board decided to postpone the product launch." }
            ],
            questions: [
                {
                    q: "Could you please ______ your report before the end of the day?",
                    options: ["finalizing", "finalize", "finalized", "finals"],
                    answer: 1,
                    explanation: "Sau 'Could you please + V-bare', dùng động từ nguyên mẫu 'finalize' (hoàn thiện)."
                },
                {
                    q: "The manager was pleased because the team completed the project ______ schedule.",
                    options: ["ahead of", "over", "above", "in front of"],
                    answer: 0,
                    explanation: "Cụm từ cố định trong TOEIC: 'ahead of schedule' (trước thời hạn dự kiến)."
                },
                {
                    q: "We must find an effective way to ______ our customer satisfaction.",
                    options: ["increase", "increasing", "increased", "increases"],
                    answer: 0,
                    explanation: "Sau 'way to + V-bare', chọn động từ nguyên mẫu 'increase'."
                }
            ]
        },
        {
            title: "Môi trường doanh nghiệp: Đàm phán & Hợp tác",
            words: [
                { word: "Agreement", ipa: "/əˈɡriː.mənt/", meaning: "Sự đồng thuận, hợp đồng", example: "Both companies reached a mutual agreement." },
                { word: "Opportunity", ipa: "/ˌɒp.əˈtʃuː.nə.ti/", meaning: "Cơ hội tốt", example: "This partnership brings great business opportunities." },
                { word: "Efficient", ipa: "/ɪˈfɪʃ.ənt/", meaning: "Hiệu quả, năng suất", example: "The new software makes our workflow much more efficient." },
                { word: "Budget", ipa: "/ˈbʌdʒ.ɪt/", meaning: "Ngân sách chi tiêu", example: "We need to stay within our allocated quarterly budget." },
                { word: "Notify", ipa: "/ˈnəʊ.tɪ.faɪ/", meaning: "Thông báo cho ai biết", example: "We will notify you as soon as the results are available." }
            ],
            questions: [
                {
                    q: "Neither the manager nor the staff members ______ willing to postpone the deadline.",
                    options: ["was", "were", "is", "be"],
                    answer: 1,
                    explanation: "Cấu trúc 'Neither A nor B + V chia theo B': 'staff members' là số nhiều ở quá khứ/hiện tại -> dùng 'were'."
                },
                {
                    q: "The finance department is reviewing the ______ for the upcoming quarter.",
                    options: ["budget", "budgetary", "budgeting", "budgeted"],
                    answer: 0,
                    explanation: "Cần danh từ làm tân ngữ sau mạo từ 'the' -> chọn danh từ 'budget' (ngân sách)."
                },
                {
                    q: "Our supervisor always encourages us ______ our communication skills.",
                    options: ["improving", "to improve", "improve", "improved"],
                    answer: 1,
                    explanation: "Cấu trúc: 'encourage someone to do something' (khích lệ ai làm gì) -> chọn 'to improve'."
                }
            ]
        }
    ],
    "B1_C1": [
        {
            title: "Lãnh đạo & Chiến lược kinh doanh toàn cầu",
            words: [
                { word: "Strategic", ipa: "/strəˈtiː.dʒɪk/", meaning: "Mang tính chiến lược", example: "Making strategic decisions is vital for long-term growth." },
                { word: "Diversify", ipa: "/daɪˈvɜː.sɪ.faɪ/", meaning: "Đa dạng hóa", example: "The enterprise aims to diversify its product portfolio." },
                { word: "Sustainable", ipa: "/səˈsteɪ.nə.bəl/", meaning: "Bền vững, lâu dài", example: "We adopt sustainable practices to protect the environment." },
                { word: "Benchmark", ipa: "/ˈbentʃ.mɑːk/", meaning: "Tiêu chuẩn đối sánh", example: "Our quality standards serve as an industry benchmark." },
                { word: "Incentive", ipa: "/ɪnˈsen.tɪv/", meaning: "Động lực, sự khuyến khích", example: "Financial incentives were offered to boost productivity." }
            ],
            questions: [
                {
                    q: "Had the company conducted thorough research, they ______ such heavy financial losses.",
                    options: ["would not suffer", "would not have suffered", "will not suffer", "did not suffer"],
                    answer: 1,
                    explanation: "Đảo ngữ câu điều kiện loại 3: 'Had + S + PII, S + would have + PII' (diễn tả điều trái ngược quá khứ)."
                },
                {
                    q: "The executive board unanimously approved the ______ expansion into Southeast Asian markets.",
                    options: ["propose", "proposal", "proposed", "proposing"],
                    answer: 2,
                    explanation: "Cần phân từ quá khứ đóng vai trò tính từ (proposed expansion = việc mở rộng đã được đề xuất) đứng trước danh từ 'expansion'."
                },
                {
                    q: "Not only ______ the quarterly target, but the sales team also doubled customer retention.",
                    options: ["did they exceed", "they exceeded", "they have exceeded", "do they exceed"],
                    answer: 0,
                    explanation: "Đảo ngữ với 'Not only': đảo trợ động từ lên trước chủ ngữ -> 'did they exceed'."
                }
            ]
        }
    ]
};
