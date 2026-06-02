/* English translations of all NOVO ACADEMY courses.
   Mirrors data.js — same 22 courses, each with `lang: 'en'` and a fresh
   UID. Categories and topic labels are translated to English.

   Video IDs come from the Novogenia English YouTube channel content
   (Playlist_Genetic_Test_Consultation_Training_ENGLISH + 170-video list).
   Where no English equivalent video exists, `youtubeId` is omitted and the
   course becomes content-only until an English recording is available. */

// T helper — same numbered-thumbnail helper as data.js
const T = (n) => `/thumbnails/${String(n).padStart(2, '0')}.jpg`

/* ---- English category labels (must match the keys used in MAIN_CATEGORIES_EN) ---- */
export const CATEGORIES_EN = {
  WEIGHT: 'The Gene-Diet',
  NUTRITION: 'Eat Healthy by Your Genes',
  PERFORMANCE: 'Athletic Performance',
  DETOX: 'Detoxification',
  BURNOUT: 'Burnout and Stress',
  BIOAGE: 'Biological Age',
  SUPP: 'Personalized Supplementation',
  BEAUTY: 'Healthy Skin and Appearance',
  PHARMA: 'Drug Intolerance',
  LEGAL: 'Legally Safe Advertising with Products',
}

export const TOPIC_WB_EN     = 'Scientific Basis'
export const TOPIC_REPORT_EN = 'Consultation Training'
export const TOPIC_FAQ_EN    = 'Frequently Asked Questions'

export const COURSES_EN = [

  /* ======== Weight Management ======== */
  {
    id: 'wm-sci-en',
    uid: 'e8c9a2f1-3b4d-4567-8901-2345abcdef01',
    lang: 'en',
    category: CATEGORIES_EN.WEIGHT,
    topic: TOPIC_WB_EN,
    contentType: 'course',
    description: 'How genetics determines weight gain, exercise response, and the right diet — explained scientifically.',
    longDescription:
      'In this training, Dr. Daniel Wallerstorfer explains why people gain weight differently from the same calories, why exercise works wonders for some and not for others, and how genetic variants in fat vs. carb metabolism shape the right diet strategy.',
    bullets: [
      'Why the same calories affect people differently',
      'Carb-sensitive vs. fat-sensitive genotypes',
      'Exercise responders vs. non-responders',
      'Personalized diet strategy from genetics',
    ],
    thumbnail: '/thumbnails/course-nutrition.jpg',
    introQuestionsHeader: 'This training answers:',
    introQuestions: [
      'Why do some people gain weight on carbs, others on fat?',
      'Why does exercise work for some but not others?',
      'How do we identify the right diet strategy from genes?',
      'What is the Jo-Yo Effect and how is it genetic?',
    ],
    brandNoticeAboveVideos: true,
    youtubeId: 'p02EmbTNRqE',
    postVideoText:
      'With this background you can discuss the science behind the Gene-Diet with your clients, distinguish carb-sensitive from fat-sensitive genotypes, and explain why a personalized strategy outperforms generic advice.',
    questions: [
      {
        q: 'Why do two people on the same calorie surplus gain weight at different rates?',
        options: [
          'It is purely a matter of willpower',
          'Genetic variants (e.g. FABP2, PPARG, FTO) change how efficiently fat and carbs are stored — the same calories translate into different amounts of body fat',
          'Hydration is the only factor',
          'There is no real difference',
        ],
        correct: 1,
      },
      {
        q: 'How much does the response to exercise genetically vary between individuals?',
        options: [
          'Not at all — exercise works equally for everyone',
          'By roughly a factor of 2-3 — some people are strong exercise-responders, others are non-responders',
          'By up to 50 times',
          'Only by 5%',
        ],
        correct: 1,
      },
      {
        q: 'A client is genetically a strong carb-sensitive type. Which strategy fits?',
        options: [
          'Standard low-fat diet for everyone',
          'Eat as many carbs as possible',
          'Lower carb share, higher protein, moderate good fats — and match the carb load to the exercise day',
          'Skip both fat and carbs',
        ],
        correct: 2,
      },
      {
        q: 'What is the Yo-Yo effect and why is it partly genetic?',
        options: [
          'A toy that affects metabolism',
          'The pattern of regaining weight after a diet — some people have genetic variants (e.g. in adiponectin / leptin pathways) that increase appetite rebound and slow basal metabolism after weight loss',
          'A purely behavioural issue with no biology',
          'Something only women experience',
        ],
        correct: 1,
      },
      {
        q: 'Why does a personalized program outperform standard advice?',
        options: [
          'It uses more expensive ingredients',
          'A Novogenia pilot study (139 participants) showed a 2.4× higher weight-loss success with genetic personalization versus standard counselling — because the strategy actually matches the underlying biology',
          'It works only on paper',
          'It is identical to standard advice',
        ],
        correct: 1,
      },
    ],
    hasDownload: true, hasText: false,
    documents: [
      // Slides + sample reports exist only in German — hidden in EN until translated.
      {
        title: 'NovoAcademy Science PDF - 2.4× More Weight Loss with Genetic Program',
        size: '610 KB',
        type: 'pdf',
        url: '/course-materials/scientific-reviews/Genetic_Weight_Loss_Study_2,4x.pdf',
      },
    ],
    brandNoticeAboveDownloads: true,
    initialWatched: false, initialTestPassed: false,
  },

  /* ===== Gene-Diet — Consultation Training (multi-video) ===== */
  {
    id: 'wm-report-en',
    uid: 'a2b3c4d5-e6f7-4890-1234-5678abcdef02',
    lang: 'en',
    category: CATEGORIES_EN.WEIGHT,
    topic: TOPIC_REPORT_EN,
    contentType: 'course',
    description: 'Walk through the genetic weight-management report chapter by chapter with your client.',
    longDescription:
      'This consultation training shows how to walk through the genetic weight-management report with your client. From nutritional type and exercise response through hunger/satiety, fat distribution and Jo-Yo effect, every chapter is explained with practical client examples.',
    bullets: [
      'Walk through the genetic report chapter by chapter',
      'Explain different result types (fat/carb sensitivity, exercise response, diet strategy)',
      'Apply daily menus, recipes, and food lists',
      'Answer typical client questions confidently',
    ],
    thumbnail: '/thumbnails/wm-report-cover.jpg',
    introQuestionsHeader: 'In this training you will learn:',
    introQuestions: [
      'How the report is structured and how to walk through it with clients',
      'How to explain fat and carb sensitivity in plain language',
      'How to interpret exercise response and diet strategy',
      'How daily menus, food list, and personalized recipes are used',
    ],
    brandNoticeAboveVideos: true,
    videoSegments: [
      { title: 'Introduction', youtubeId: 'mJ5joZYBtmk' },
      { title: 'Weight Analysis — Nutritional Type', youtubeId: 'iDJz6WEHLOw' },
      { title: 'Weight Analysis — Exercise and Calorie Type', youtubeId: 'sI73pZ0bPF4' },
      { title: 'Understanding the Science Tables', youtubeId: 'Fd8renx2EwE' },
      { title: 'Weight Analysis — Muscle Mass Loss', youtubeId: '1UFjgQppgMA' },
      { title: 'Weight Analysis — Hunger and Satiety', youtubeId: '2HgTRooIjaU' },
      { title: 'Weight Analysis — Fat Distribution', youtubeId: 'Ky-yFxo7lEs' },
      { title: 'Weight Analysis — Yo-Yo Effect', youtubeId: 'TSoBij5Drn4' },
      { title: 'Weight Analysis — Food List', youtubeId: 'BJ0sWv3bpVs' },
      { title: 'Weight Analysis — Food Item System', youtubeId: 'KhwgUetPahI' },
      { title: 'Weight Analysis — Exercise Tables', youtubeId: 'QCgqCo4Qqfk' },
      { title: 'Concluding Remarks', youtubeId: '425Pv9mfFmk' },
    ],
    postVideoText:
      'With this training you are ready to walk through the genetic report with your clients. The demo booklets below can serve as example reports for your own consultation practice.',
    questions: [
      {
        q: 'What do the weight icons in the food list show?',
        options: [
          'Whether the food is healthy in general',
          'Whether the macronutrient distribution (fat, carbs, protein) is favourable (green) or unfavourable (red) for your individual weight goal — also taking into account the calories per typical portion',
          'Only the calorie content',
          'Only the protein share',
        ],
        correct: 1,
      },
      {
        q: 'Are red-rated foods completely forbidden?',
        options: [
          'Yes — never eat them',
          'No — red foods should be the exception. Strongly red (4-6 icons) only rarely; mildly red (1-3 icons) more often. The goal is balance, not perfection.',
          'Yes, but only on weekdays',
          'Only for women',
        ],
        correct: 1,
      },
      {
        q: 'A client is a strong "exercise non-responder" (low ACE / ACTN3 response). What is the right advice?',
        options: [
          'Exercise is generally useless — give it up',
          'The main weight-loss lever is nutrition / calorie management. Exercise stays valuable for health and muscle preservation but is not the main weight-loss tool for this client',
          'Triple the training volume — eventually it must work',
          'Switch to only marathon running',
        ],
        correct: 1,
      },
      {
        q: 'A client of Asian descent (frequent ALDH2 defect) drinks 1-2 glasses of wine per week and asks if it is dangerous. Best answer?',
        options: [
          'No issue, drink as much as you like',
          'It is best to keep alcohol very low: in ALDH2 carriers the toxic acetaldehyde accumulates noticeably, raising long-term cancer risk on chronic consumption. Occasional small amounts are tolerable; daily intake is to be avoided',
          'Increase alcohol — it will train the enzyme',
          'Alcohol does not interact with genetics at all',
        ],
        correct: 1,
      },
      {
        q: 'How would you explain the "Yo-Yo effect" to the client based on the genetic report?',
        options: [
          'Lack of willpower — nothing more',
          'A genetic predisposition for stronger appetite rebound and slower basal metabolism after weight loss; the client benefits from gradual, stable diet change instead of crash diets',
          'A bug in the report',
          'Only affects people over 60',
        ],
        correct: 1,
      },
    ],
    // Demo reports exist only in German — hidden in EN until translated.
    documents: [],
    hasDownload: false, hasText: false,
    initialWatched: false, initialTestPassed: false,
  },

  /* ===== Gene-Diet — FAQ ===== */
  {
    id: 'wm-faq-en',
    uid: 'b3c4d5e6-f7a8-4901-2345-6789abcdef03',
    lang: 'en',
    category: CATEGORIES_EN.WEIGHT,
    topic: TOPIC_FAQ_EN,
    contentType: 'faq',
    description: 'Answers to typical client questions about the Gene-Diet and the Calorie Blocker.',
    longDescription:
      'A collection of the most common client questions about the Gene-Diet program, the genetic report, and the Calorie Blocker product. With collapsible answers for self-study.',
    bullets: [
      'What is the Gene-Diet?',
      'How does the genetic analysis work?',
      'How is the food list used?',
      'What is the Calorie Blocker?',
    ],
    thumbnail: T(5),
    faqGroups: [
      {
        title: 'What is the Gene-Diet?',
        items: [
          { q: 'What exactly is the Gene-Diet?', a: 'The Gene-Diet is a personalized weight-loss and nutrition program based on an analysis of your genes. Instead of a standard diet plan, you get an individual recommendation because your metabolism reacts genetically differently than others — to fat, carbohydrates, exercise, and even hunger.' },
          { q: 'What do I actually get?', a: 'You receive an individual report with your optimal ratio of fat, carbohydrates, and protein; a personalized food list with over 1,500 foods; a 4-week daily meal plan; a recipe book; and concrete exercise and movement recommendations that match your genetic profile.' },
          { q: 'How long are my recommendations valid?', a: 'Your genes do not change throughout your life, so the genetic results remain permanently valid. The evaluation, however, is continuously refined based on new research — over 770 improvements have been incorporated since program launch.' },
          { q: 'Do I need to repeat the test regularly?', a: 'No. Genes stay the same for life — an already-analyzed gene always returns the same result. What does keep improving is the evaluation itself, as new scientific findings are continuously incorporated.' },
        ],
      },
      {
        title: 'How does the genetic analysis work?',
        items: [
          { q: 'How does the Gene-Diet program work?', a: 'From your genetic dataset, the variants relevant for weight control are selected. From these, we calculate: how sensitive is your body to fat and carbohydrates? How effective is exercise for you? How effective is calorie reduction? Do you tend toward Yo-Yo effect, muscle loss, or belly fat? From these results, your optimal macro distribution and an individual nutrition plan emerge.' },
          { q: 'Isn\'t losing weight just about calorie deficit?', a: 'Not just. Studies show that people react genetically very differently to fat and carbohydrates — some hardly gain weight at a calorie surplus, others on the same calories gain much more. The effectiveness of exercise also varies genetically by a factor of 3.' },
          { q: 'Are there 7 different nutritional types?', a: 'Yes: Fat utilizer (higher fat share), Mixed type I-V (different mixed distributions), and Carb utilizer (higher carb share). Combined with individual factors like basal metabolic rate, exercise effectiveness, and Jo-Yo tendency, there are over 6,500 possible genetic profiles.' },
          { q: 'From what age is the program suitable for children?', a: 'The program is basically also applicable to children, but without calorie calculations, target-weight recommendations, daily menus, or recipe book — these are not meaningful for growing children. The recipe book is locked for children under 14.' },
        ],
      },
      {
        title: 'Calorie Blocker',
        items: [
          { q: 'What is the Calorie Blocker?', a: 'The Calorie Blocker is a personalized weight-loss product in microtransporter-pellet form. It contains an individual ratio of fat and carbohydrate blockers tailored to your DNA analysis. Combined with reduced calorie and fat intake, it demonstrably supports weight loss — combined with balanced diet and lifestyle it helps maintain weight.' },
          { q: 'How do I take the Calorie Blocker?', a: 'Daily before lunch and dinner with a large sip of water. The pellets should be swallowed whole, not chewed.' },
          { q: 'What are the active ingredients?', a: 'The fat blocker is Opuntia ficus-indica (OFI) — the fiber of the prickly pear cactus. This plant fiber forms a gel-like matrix in the GI tract that binds dietary fat and reduces its absorption. The carbohydrate blocker is Phaseolamin (from white beans) which inhibits alpha-amylase. Both are fully plant-based.' },
          { q: 'Is the Calorie Blocker vegan/vegetarian?', a: 'Yes. Both the fat blocker (Opuntia ficus-indica) and the carbohydrate blocker (Phaseolamin from white beans) are purely plant-based. The Calorie Blocker is suitable for vegetarians and vegans, gluten-free, lactose-free, and free of artificial colourings.' },
        ],
      },
    ],
    documents: [
      {
        title: 'NovoAcademy FAQ PDF - The Gene-Diet',
        size: '120 KB',
        type: 'pdf',
        url: '/course-materials/gene-diet/faq/Novogenia_FAQ_Gene_Diet_EN.pdf',
      },
    ],
    hasDownload: true, hasText: false,
    initialWatched: false,
  },

  /* ======== Eat Healthy by Your Genes ======== */
  {
    id: 'nut-sci-en',
    uid: 'c4d5e6f7-a8b9-4012-3456-789abcdef004',
    lang: 'en',
    category: CATEGORIES_EN.NUTRITION,
    topic: TOPIC_WB_EN,
    contentType: 'course',
    description: 'How genes determine the optimal nutrition for each person — explained scientifically.',
    longDescription:
      'In this training, Dr. Daniel Wallerstorfer explains why foods affect different people differently. You will learn which genetic variations control nutrient utilization, the reaction to salt, caffeine, folic acid & Co., and how these insights are used responsibly in personalized nutrition consultation.',
    bullets: [
      'Genetic variations in nutrient metabolism',
      'Why the same food affects people differently',
      'Studies on nutrigenetics',
      'Practical implementation in consultation',
    ],
    thumbnail: '/thumbnails/course-nutrition.jpg',
    youtubeId: 'pRU2p2Banno',
    introQuestionsHeader: 'This training answers:',
    introQuestions: [
      'Why are some foods healthy for some and unhealthy for others?',
      'What role do genes like MTHFR, CYP1A2, or ACE play in nutrient utilization?',
      'How does genetics relate to caffeine, salt, and folic acid sensitivity?',
      'What practical recommendations can be derived for the client?',
    ],
    postVideoText:
      'With understanding of these genetic foundations, you can discuss the food recommendations in the report with your clients on solid ground.',
    questions: [
      {
        q: 'Which gene breaks down caffeine in the body?',
        options: ['MTHFR', 'CYP1A2', 'FTO', 'COMT'],
        correct: 1,
      },
      {
        q: 'How does a functioning (fast) CYP1A2 variant change heart-attack risk with regular coffee consumption (according to large epidemiological studies)?',
        options: [
          'Risk remains unchanged',
          'Risk drops by roughly one third — the polyphenols stay protective and the caffeine clears quickly',
          'Risk doubles',
          'Risk rises by two thirds',
        ],
        correct: 1,
      },
      {
        q: 'And how does it change for slow caffeine-breakers (defective CYP1A2)?',
        options: [
          'Risk drops even more',
          'Risk stays the same as for fast breakers',
          'Risk rises by roughly two thirds — caffeine stays active longer and prolongs blood-pressure peaks',
          'There is no difference',
        ],
        correct: 2,
      },
      {
        q: 'What is the role of the MTHFR gene?',
        options: [
          'It breaks down caffeine',
          'It activates folic acid into the bioactive form methylfolate — without a working MTHFR the standard folic acid in supplements stays useless',
          'It regulates dopamine breakdown',
          'It determines skin colour',
        ],
        correct: 1,
      },
      {
        q: 'What does a blood test NOT show in case of an MTHFR defect?',
        options: [
          'The folic-acid level in blood',
          'Whether the folic acid is actually activated and biologically effective',
          'The Vitamin D level',
          'The iron level',
        ],
        correct: 1,
      },
      {
        q: 'How many genes does the full nutrition analysis consider?',
        options: ['About 10', 'About 25', 'About 60', 'Over 200'],
        correct: 2,
      },
    ],
    documents: [
      // Slides + Demo Reports exist only in German — hidden in EN until translated.
      { title: 'NovoAcademy Science PDF - Caffeine & CYP1A2 Variant', size: '244 KB', type: 'pdf', url: '/course-materials/scientific-reviews/Caffeine_Review.pdf' },
      { title: 'NovoAcademy Science PDF - Folic Acid & MTHFR Activation', size: '257 KB', type: 'pdf', url: '/course-materials/scientific-reviews/Folic_Acid_Review.pdf' },
      { title: 'NovoAcademy Science PDF - Vitamin D & VDR Gene', size: '368 KB', type: 'pdf', url: '/course-materials/scientific-reviews/Vitamin_D_Review.pdf' },
      { title: 'NovoAcademy Science PDF - Lactose Intolerance & Genetics', size: '259 KB', type: 'pdf', url: '/course-materials/scientific-reviews/Lactose_Review.pdf' },
      { title: 'NovoAcademy Science PDF - Salt, Blood Pressure & ACE Gene', size: '309 KB', type: 'pdf', url: '/course-materials/scientific-reviews/NaCl_Salt_Review.pdf' },
      { title: 'NovoAcademy Science PDF - HDL Cholesterol & Omega-3', size: '255 KB', type: 'pdf', url: '/course-materials/scientific-reviews/HDL_Omega3_Review.pdf' },
      { title: 'NovoAcademy Science PDF - Homocysteine & Heart Health', size: '271 KB', type: 'pdf', url: '/course-materials/scientific-reviews/Homocysteine_Review.pdf' },
      { title: 'NovoAcademy Science PDF - Iron Absorption & Genetics', size: '337 KB', type: 'pdf', url: '/course-materials/scientific-reviews/Iron_Review.pdf' },
      { title: 'NovoAcademy Science PDF - Selenium Requirement', size: '231 KB', type: 'pdf', url: '/course-materials/scientific-reviews/Selenium_Review.pdf' },
    ],
    hasDownload: true, hasText: false,
    initialWatched: false, initialTestPassed: false,
  },

  /* ===== Nutrition Consultation Training ===== */
  {
    id: 'nut-report-en',
    uid: 'd5e6f7a8-b9c0-4123-4567-89abcdef0005',
    lang: 'en',
    category: CATEGORIES_EN.NUTRITION,
    topic: TOPIC_REPORT_EN,
    contentType: 'course',
    description: 'Walk through the genetic nutrition report chapter by chapter with your client.',
    longDescription:
      'In this consultation training, Dr. Daniel Wallerstorfer explains chapter by chapter how to discuss the genetic nutrition report with your clients. From the structure of the report through individual nutrients (Vitamin D3, folic acid, iron, selenium, Q10, etc.) to metabolism, cholesterol, and triglyceride topics — all chapters of the report are walked through step by step.',
    bullets: [
      'Walk through the nutrition report chapter by chapter with the client',
      'Explain different gene variants (Vitamin D3, folic acid, iron, selenium, caffeine, Q10, etc.)',
      'Interpret effects on cholesterol, triglycerides, blood pressure & homocysteine',
      'Convey personalized food recommendations clearly',
    ],
    thumbnail: '/thumbnails/nut-report-cover.jpg',
    introQuestionsHeader: 'In this training you will learn:',
    introQuestions: [
      'How the nutrition report is structured',
      'How to explain the most important nutrient sensitivities clearly',
      'How genes influence cholesterol, triglycerides, blood pressure, and homocysteine',
      'How to translate food recommendations into practical advice',
    ],
    brandNoticeAboveVideos: true,
    videoSegments: [
      { title: 'Nutrition Analysis — Introduction', youtubeId: 'vIJroun2h-I' },
      { title: 'Caffeine and Coffee', youtubeId: 'IPIr-XoKIHM' },
      { title: 'Omega 3', youtubeId: 'Lfh3oYtMSDA' },
      { title: 'Folic Acid', youtubeId: '-C9O5SrbdZQ' },
      { title: 'Homocysteine', youtubeId: 'pYLWY_5frwQ' },
      { title: 'Coenzyme Q10', youtubeId: 'iS1W947McFs' },
      { title: 'Detox — Carcinogens', youtubeId: 'CxcnY6fnz5s' },
      { title: 'Detox — Chemicals and Heavy Metals', youtubeId: 'CyUqDSeZbJI' },
      { title: 'Free Radicals', youtubeId: 'PA73Rg4iP7k' },
      { title: 'Selenium', youtubeId: 'ikDamq8-8yo' },
      { title: 'Salt and Blood Pressure', youtubeId: 'pzF004M4ErE' },
      { title: 'Vitamin D (Part 1)', youtubeId: '8OyIc_fcdYg' },
      { title: 'Vitamin D (Part 2)', youtubeId: 'g5GKYyH11hc' },
      { title: 'Lactose and Calcium', youtubeId: 'zMb8ebBNGzA' },
      { title: 'Inflammation', youtubeId: 'dHuDD3Us238' },
      { title: 'LDL Cholesterol', youtubeId: 'PTvmWu1Rxrg' },
      { title: 'Triglycerides', youtubeId: 'mgfbGW-QKC4' },
      { title: 'Iron', youtubeId: '6dJMl02X9Tw' },
      { title: 'Methylation', youtubeId: 'wE834vw4aAs' },
      { title: 'Closing — Last Part', youtubeId: 'ofA7l21tMvQ' },
      { title: 'Principle of Food Rating', youtubeId: 'Y9lSzTXj72c' },
      { title: 'Food List', youtubeId: 'q8RNXZE5t5A' },
    ],
    postVideoText:
      'With this training you are ready to walk your clients through the genetic nutrition report with confidence. The demo booklets below can serve as example reports for your own consultation practice.',
    questions: [
      {
        q: 'A slow caffeine breaker (CYP1A2 defect) asks whether they should give up coffee entirely. Best consultation answer?',
        options: [
          'Yes, all coffee must be banned forever',
          'A reasonable alternative is decaffeinated coffee — it preserves the protective polyphenols without the prolonged caffeine effect. Caffeine sensitivity does not have to mean total abstinence',
          'Drink five cups a day to build tolerance',
          'Only black tea is allowed',
        ],
        correct: 1,
      },
      {
        q: 'How do you explain the Vitamin D recommendation to a client with a VDR variant?',
        options: [
          'Vitamin D works the same in everyone',
          'A VDR variant changes how strongly the cells respond to circulating Vitamin D — even at "normal" blood levels the biological effect can be reduced. Higher targeted intake (under monitoring) often makes sense',
          'Avoid Vitamin D — it is dangerous for them',
          'Only sun exposure works for them',
        ],
        correct: 1,
      },
      {
        q: 'Which dietary recommendation fits a client with a HFE-defect (iron-overload risk)?',
        options: [
          'Increase iron intake — they need more',
          'Reduce dietary iron load: less red meat, no iron-enriched supplements unless deficient by blood test. Excess iron accumulates and damages liver, heart, joints over decades',
          'Take iron supplements daily as a precaution',
          'No change needed',
        ],
        correct: 1,
      },
      {
        q: 'A client with an MTHFR variant takes standard folic acid tablets. What should you advise?',
        options: [
          'Keep taking standard folic acid — the variant has no effect',
          'Switch to methylfolate (the bioactive form). With an MTHFR defect, regular folic acid is poorly activated and largely useless for the client; methylfolate bypasses the activation step',
          'Stop all folate completely',
          'Eat only meat',
        ],
        correct: 1,
      },
      {
        q: 'How would you explain the salt recommendation to an ACE-positive client (salt-sensitive blood pressure)?',
        options: [
          'Salt does not matter — the recommendation is generic',
          'Salt sensitivity is genetic. In ACE-positive clients, salt intake measurably raises blood pressure. Reducing salt is a particularly powerful lever for them — much more so than for non-sensitive people',
          'Add extra salt — it stabilises blood pressure',
          'Only avoid sugar',
        ],
        correct: 1,
      },
    ],
    // Demo reports exist only in German — hidden in EN until translated.
    documents: [],
    hasDownload: false, hasText: false,
    initialWatched: false, initialTestPassed: false,
  },

  /* ===== Nutrition FAQ ===== */
  {
    id: 'nut-faq-en',
    uid: 'e6f7a8b9-c0d1-4234-5678-9abcdef00006',
    lang: 'en',
    category: CATEGORIES_EN.NUTRITION,
    topic: TOPIC_FAQ_EN,
    contentType: 'faq',
    description: 'Answers to typical client questions about the genetic nutrition analysis.',
    longDescription:
      'A collection of the most common client questions about the genetic nutrition analysis — how genes influence nutrient metabolism, what MTHFR, CYP1A2, and other genes mean, and how practical recommendations are derived.',
    bullets: [
      'Why does the same food affect people differently?',
      'What is the role of genetic variants?',
      'How are recommendations derived?',
      'What can the genetic analysis tell me — and what not?',
    ],
    thumbnail: T(7),
    faqGroups: [
      {
        title: 'Basics — Genes and Nutrition',
        items: [
          { q: 'Why does the same food affect people differently?', a: 'Because we metabolize nutrients genetically differently. The MTHFR gene, for example, determines whether your body can activate folic acid into the bioactive form. The CYP1A2 gene determines how fast you break down caffeine. Such variants change how a nutrient acts in YOUR body.' },
          { q: 'How many genes does the nutrition analysis consider?', a: 'About 60 nutrition-relevant gene variants. Among them: MTHFR (folate activation), CYP1A2 (caffeine breakdown), ACE (salt/blood pressure), VDR (vitamin D receptor), HFE (iron uptake), LCT (lactase persistence), and antioxidant defense genes (SOD, CAT, GPX).' },
          { q: 'Can the analysis tell me whether I should drink coffee?', a: 'Indirectly yes. The CYP1A2 gene shows whether you break down caffeine fast (Warrior) or slow. Slow breakers carry higher cardiovascular risk from caffeine — coffee is better avoided or replaced with decaf for the polyphenol benefits.' },
          { q: 'Is the analysis a substitute for a doctor or nutritionist?', a: 'No. It is an additional decision-making aid based on stable genetic data. Acute symptoms, diseases, or special diets always belong in the hands of an MD or registered dietitian.' },
        ],
      },
      {
        title: 'Key gene topics',
        items: [
          { q: 'What does an MTHFR defect mean for me?', a: 'MTHFR activates folic acid into methylfolate, the form your body can actually use. With a defect, you can take a lot of folic acid in a regular supplement and still have functional deficiency. Switching to methylfolate solves the problem.' },
          { q: 'I have an HFE variant — is iron supplementation dangerous for me?', a: 'It can be. Some HFE variants cause iron overload over decades — your body absorbs too much from food and stores it in liver, heart, joints. Iron supplements should only be taken if blood tests show a real deficiency.' },
          { q: 'Salt sensitivity (ACE) — does that mean I have to give up salt?', a: 'Not entirely. It means your blood pressure responds more strongly to salt than average. Reducing salt is a powerful lever in your case — much more so than for non-sensitive people.' },
        ],
      },
      {
        title: 'Practical questions',
        items: [
          { q: 'Should I stop eating my favourite foods if they are rated unfavourable?', a: 'No. The report is a long-term guide. Occasional consumption is fine. The goal is balance over weeks and months, not perfection on a single day.' },
          { q: 'How fast will I notice an effect?', a: 'It depends on what you change. Caffeine sensitivity feels different within days. Folic-acid switching shows in 2-3 months on blood markers. Long-term recommendations like reducing salt or sat. fats take 6-12 months to translate into measurable cardiovascular benefits.' },
          { q: 'Is the recommendation list set in stone?', a: 'No. The recommendations are derived from current scientific consensus. As research progresses, the report is updated periodically with no extra cost.' },
        ],
      },
    ],
    documents: [
      {
        title: 'NovoAcademy FAQ PDF - Eat Healthy by Your Genes',
        size: '118 KB',
        type: 'pdf',
        url: '/course-materials/nutrition/Novogenia_FAQ_Nutrition_EN.pdf',
      },
    ],
    hasDownload: true, hasText: false,
    initialWatched: false,
  },

  /* ======== Athletic Performance ======== */
  {
    id: 'pg-sci-en',
    uid: 'f7a8b9c0-d1e2-4345-6789-abcdef000007',
    lang: 'en',
    category: CATEGORIES_EN.PERFORMANCE,
    topic: TOPIC_WB_EN,
    contentType: 'course',
    description: 'Which genes determine athletic performance, regeneration, and injury risk.',
    longDescription:
      'This training explains the scientific basis behind performance genetics. You will learn which genes influence athlete type (sprint vs. endurance), connective tissue risk, and regeneration ability, and how an individual training profile is derived from these factors.',
    bullets: [
      'Sprint vs. endurance genes (ACTN3 & Co.)',
      'Connective tissue and injury risk (COL5A1, MMP3)',
      'Inflammation response and regeneration time',
      'Practical implementation in training planning',
    ],
    thumbnail: '/thumbnails/course-performance.jpg',
    youtubeId: 'cdsMJEPUv5A',
    introQuestionsHeader: 'This training answers:',
    introQuestions: [
      'How much of athletic talent is genetically determined?',
      'Which genes distinguish sprinters from marathon runners?',
      'How does genetics influence injury risk and regeneration?',
      'How can athletes train more efficiently with this knowledge?',
    ],
    postVideoText:
      'With this scientific background, you can advise athletes on a solid basis — about the right training stimulus, regeneration times, and genetically grounded supplements.',
    questions: [
      {
        q: 'Which gene is the best-known marker for sprint vs. endurance phenotype?',
        options: ['MTHFR', 'ACTN3', 'LCT', 'COMT'],
        correct: 1,
      },
      {
        q: 'A client has the ACTN3 RR genotype. What does this typically indicate?',
        options: [
          'Marathon-runner profile only',
          'Strong fast-twitch fibre expression — better suited to sprint, power, and explosive sports; pure endurance is still possible but not the natural strength',
          'No athletic talent at all',
          'Higher cardiovascular risk in any sport',
        ],
        correct: 1,
      },
      {
        q: 'Which genes are central for connective tissue stability and injury risk?',
        options: [
          'COL5A1, MMP3 — they shape collagen quality and turnover; unfavourable variants raise the risk of tendon and ligament injuries',
          'FTO and PPARG',
          'CYP1A2 and ADH',
          'No gene affects connective tissue',
        ],
        correct: 0,
      },
      {
        q: 'How does the training response between people genetically vary?',
        options: [
          'It is identical for everyone',
          'Roughly by a factor of 2-3 — some athletes adapt very strongly to the same stimulus, others barely',
          'Only mood determines the response',
          'It varies by a factor of 50',
        ],
        correct: 1,
      },
      {
        q: 'Why are antioxidants (Vit C, E, polyphenols) particularly relevant in sports?',
        options: [
          'They taste better than water',
          'Intense exercise produces large amounts of free radicals; genetically weak antioxidant defences (low SOD/CAT/GPX activity) mean longer regeneration and higher risk of micro-inflammation',
          'They only improve sleep',
          'They have no effect on athletes',
        ],
        correct: 1,
      },
    ],
    documents: [
      // Slides + Demo Reports exist only in German — hidden in EN until translated.
      { title: 'NovoAcademy Science PDF - Free Radicals & Oxidative Stress in Sports', size: '289 KB', type: 'pdf', url: '/course-materials/scientific-reviews/Free_Radicals_Review.pdf' },
    ],
    hasDownload: true, hasText: false,
    initialWatched: false, initialTestPassed: false,
  },

  /* ===== Athletic Performance FAQ ===== */
  {
    id: 'pg-faq-en',
    uid: 'a8b9c0d1-e2f3-4456-789a-bcdef0000008',
    lang: 'en',
    category: CATEGORIES_EN.PERFORMANCE,
    topic: TOPIC_FAQ_EN,
    contentType: 'faq',
    description: 'Answers to typical client questions about the genetic performance analysis.',
    longDescription:
      'A collection of the most important questions about genetics in sports — talent, injury risk, training control. With collapsible answers for self-study.',
    bullets: [
      'Talent vs. training — what is genetic?',
      'Injury risk and connective tissue genes',
      'Regeneration and nutrition',
      'Training control by genotype',
    ],
    thumbnail: T(11),
    faqGroups: [
      {
        title: 'Talent & Genetics in Sports',
        items: [
          { q: 'How large is the influence of genes on athletic performance?', a: 'Estimates vary between 30 and 70%, depending on the discipline. Talent (sprint fibers, VO2max potential, connective tissue stability) is predominantly genetically determined; the training response itself — how strongly the body reacts to a stimulus — also varies genetically by a factor of 2 to 3.' },
          { q: 'What is the difference between muscle volume and muscle strength?', a: 'Volume means more mass (bodybuilder goal) — training with 6-12 reps. Strength means more performance with less mass — training with 1-6 reps at heavy loads. Both training goals require different strategies and different rest periods.' },
          { q: 'Can I become a successful athlete with "bad" genes?', a: 'Yes. Genetics determines talent, but training, consistency and the right strategy make the decisive difference. Knowing your genetic weak points lets you compensate (e.g. antioxidant-rich nutrition, longer rest, careful warm-up).' },
        ],
      },
      {
        title: 'Injury risk & regeneration',
        items: [
          { q: 'My report shows unfavourable connective-tissue genes (COL5A1, MMP3). What should I do?', a: 'Train with extra care: thorough warm-up, less explosive loading until adapted, longer recovery between intense sessions, and good protein/Vit-C intake to support collagen synthesis. Avoid sudden volume jumps.' },
          { q: 'Why does the report recommend antioxidants for me?', a: 'Intense exercise generates large amounts of free radicals. If your antioxidant genes (SOD2, CAT, GPX) are weak, recovery is slower and micro-inflammation accumulates. Vitamin C, E, polyphenols and selenium directly support these defense systems.' },
          { q: 'What is a "deload" and how often should I do it?', a: 'A deload is a week of gentler training (e.g. first session at half the weight, second at two-thirds). It gives the body recovery time for repair and psychological reset. Typically every ~5 weeks, depending on your genetic regeneration and stress predisposition.' },
        ],
      },
      {
        title: 'Nutrition for athletes',
        items: [
          { q: 'How does the sport report relate to the nutrition report?', a: 'They complement each other. The sport report shows your performance profile, injury risk, and regeneration. The nutrition report tells you which fuel mix (fat/carb/protein) and which supplements support that profile.' },
          { q: 'Should I take protein powder?', a: 'Not necessarily. If you cover 1.6-2.0 g protein per kg body weight through real food and recover well between sessions, no powder is needed. If you struggle to hit those numbers, a clean protein powder can simplify intake.' },
        ],
      },
    ],
    documents: [
      {
        title: 'NovoAcademy FAQ PDF - Athletic Performance',
        size: '118 KB',
        type: 'pdf',
        url: '/course-materials/performance/Novogenia_FAQ_Performance_EN.pdf',
      },
    ],
    hasDownload: true, hasText: false,
    initialWatched: false,
  },

  /* ======== Detoxification ======== */
  {
    id: 'tx-sci-en',
    uid: 'b9c0d1e2-f3a4-4567-89ab-cdef00000009',
    lang: 'en',
    category: CATEGORIES_EN.DETOX,
    topic: TOPIC_WB_EN,
    contentType: 'course',
    description: 'How genes determine individual detoxification ability — from burnt foods through chemicals to alcohol and heavy metals.',
    longDescription:
      'In this training, Dr. Daniel Wallerstorfer explains the genetic foundations of detoxification. Which genes neutralize carcinogens from burnt and smoked foods? How do glutathione-S-transferases protect against chemicals? What role does selenium play, and why doesn\'t alcohol affect everyone the same?',
    bullets: [
      'Detoxification of burnt foods (CYP1A1, NAT2)',
      'Chemical detoxification & Glutathione-S-Transferases (GST)',
      'Antioxidant defense and selenium intake',
      'Alcohol and acetaldehyde breakdown (ADH, ALDH2)',
    ],
    thumbnail: T(27),
    youtubeId: 'DbRx4Kjqkes',
    introQuestionsHeader: 'This training answers:',
    introQuestions: [
      'Which genes control detoxification of burnt foods?',
      'How do glutathione-S-transferases work in chemical detoxification?',
      'What role does selenium play in oxidative stress protection?',
      'How does genetic alcohol breakdown differ between people?',
    ],
    postVideoText:
      'With this scientific background you can discuss the detoxification report with your clients on solid ground and derive individual protective strategies.',
    questions: [
      {
        q: 'Which gene family is central for detoxification of chemicals and heavy metals?',
        options: [
          'GST (Glutathione-S-Transferases)',
          'MTHFR (folate activation)',
          'LCT (lactase)',
          'CYP1A2 (caffeine breakdown)',
        ],
        correct: 0,
      },
      {
        q: 'PAHs (polycyclic aromatic hydrocarbons) form in burnt and smoked foods. What is true about their detoxification?',
        options: [
          'PAHs cannot be broken down at all',
          'PAH detoxification varies strongly by genotype — people with slow or defective CYP1A1/NAT2 variants carry a notably higher cancer risk from frequent burnt foods',
          'Everyone detoxifies PAHs at the same speed',
          'PAHs are excreted only through the skin',
        ],
        correct: 1,
      },
      {
        q: 'A client has a genetic GST defect (Glutathione-S-Transferase deficiency). What does it mean in practice?',
        options: [
          'Above-average detox capacity',
          'Reduced ability to neutralise environmental chemicals (pesticides, solvents, cigarette smoke) — she should actively avoid exposure and increase antioxidant intake',
          'No practical impact',
          'She should drink more coffee',
        ],
        correct: 1,
      },
      {
        q: 'What is the role of selenium in the antioxidant defense system?',
        options: [
          'It directly binds heavy metals in the blood',
          'Just a cosmetic trace element',
          'Selenium is an essential building block of Glutathione Peroxidase (GPX), one of the most important antioxidant enzymes — selenium deficiency reduces this defense and raises oxidative stress',
          'It is responsible for bone health',
        ],
        correct: 2,
      },
      {
        q: 'Why does alcohol tolerance differ so much between people?',
        options: [
          'Body weight alone',
          'ADH (alcohol → acetaldehyde) and ALDH2 (acetaldehyde → acetic acid) variants differ strongly between individuals. With ALDH2 defects — frequent in Asian populations — the toxic acetaldehyde accumulates: flush, nausea, markedly elevated cancer risk on chronic consumption',
          'Men and women break it down identically',
          'Alcohol is exhaled by everyone',
        ],
        correct: 1,
      },
      {
        q: 'A client shows several red zones in the detox report. Best fitting consultation approach?',
        options: [
          'Ignore — detox runs autonomously',
          'Stop eating altogether',
          'The genetic load cannot be fully corrected but can be compensated: avoid specific exposures (less burnt food, clean indoor environment), antioxidant-rich diet (Vit C/E, selenium, glutathione precursors), no smoking exposure, and regular exercise for sweat-based excretion',
          'Immediately see a doctor — the predisposition is a disease',
        ],
        correct: 2,
      },
    ],
    documents: [
      // Slides + NovoDaily Lifestyle Demo exist only in German — hidden in EN until translated.
      { title: 'NovoAcademy Science PDF - Genetic Detoxification Overview', size: '264 KB', type: 'pdf', url: '/course-materials/scientific-reviews/Detoxification_Review.pdf' },
      { title: 'NovoAcademy Science PDF - Chemical Detoxification & GST Variants', size: '281 KB', type: 'pdf', url: '/course-materials/scientific-reviews/Chemicals_Detox_Review.pdf' },
      { title: 'NovoAcademy Science PDF - Oxidative Stress & Antioxidant Genetics', size: '348 KB', type: 'pdf', url: '/course-materials/scientific-reviews/Oxidative_Stress_Review.pdf' },
      { title: 'NovoAcademy Science PDF - Selenium Need & Protection', size: '231 KB', type: 'pdf', url: '/course-materials/scientific-reviews/Selenium_Review.pdf' },
    ],
    hasDownload: true, hasText: false,
    initialWatched: false, initialTestPassed: false,
  },

  /* ===== Detox — Consultation ===== */
  {
    id: 'tx-report-en',
    uid: 'c0d1e2f3-a4b5-4678-9abc-def000000010',
    lang: 'en',
    category: CATEGORIES_EN.DETOX,
    topic: TOPIC_REPORT_EN,
    contentType: 'course',
    description: 'Walk through the genetic detoxification report chapter by chapter with your client.',
    longDescription:
      'This consultation training explains how to walk through the genetic detoxification report with your clients. From detoxification of burnt foods and chemicals through aging protection and selenium supply to alcohol and drug metabolism.',
    bullets: [
      'Walk through the detoxification report chapter by chapter',
      'Explain detox of burnt foods & chemicals clearly',
      'Frame aging protection against oxidative stress',
      'Advise on selenium supply and alcohol/drug metabolism',
    ],
    thumbnail: '/thumbnails/tx-report-cover.jpg',
    introQuestionsHeader: 'In this training you will learn:',
    introQuestions: [
      'How the detoxification report is structured',
      'Which genes control detox of burnt foods and chemicals',
      'How oxidative stress affects the aging process',
      'What recommendations result for selenium, alcohol, and drugs',
    ],
    brandNoticeAboveVideos: true,
    videoSegments: [
      { title: 'Detox — Carcinogens', youtubeId: 'CxcnY6fnz5s' },
      { title: 'Detox — Chemicals and Heavy Metals', youtubeId: 'CyUqDSeZbJI' },
      { title: 'Free Radicals (Oxidative Stress)', youtubeId: 'PA73Rg4iP7k' },
      { title: 'Selenium', youtubeId: 'ikDamq8-8yo' },
    ],
    postVideoText:
      'With this training you are ready to walk your clients through the detoxification report with confidence.',
    questions: [
      {
        q: 'A client likes burnt steak and BBQ. The detox report shows slow PAH detoxification. Your advice?',
        options: [
          'No issue — eat as much burnt food as desired',
          'Recommend reducing burnt / charred / smoked foods (PAH exposure), prefer gentler cooking methods, and pair with antioxidant-rich foods (vitamins C, E, polyphenols)',
          'Switch to a raw-food diet only',
          'Take more burnt food to train the enzyme',
        ],
        correct: 1,
      },
      {
        q: 'A client with reduced GPX activity (poor selenium-dependent antioxidant defense) — what fits best?',
        options: [
          'Ignore selenium intake entirely',
          'Targeted selenium supplementation in physiological doses (e.g. 50-100 µg/day from selenomethionine), antioxidant-rich diet, and reduction of oxidative load (smoking, alcohol, sun)',
          'High-dose selenium (500+ µg/day)',
          'Only Vitamin C, no selenium',
        ],
        correct: 1,
      },
      {
        q: 'How do you explain a "red zone" in the chemical detox section (GST defect)?',
        options: [
          'The client is allergic to all chemicals',
          'The body neutralises environmental chemicals less efficiently than average — practical reduction of exposure (cleaner air, fewer pesticides, fewer solvents at home) is especially important; antioxidant supply supports the remaining detox capacity',
          'It is a lab error',
          'Means the client should avoid all foods',
        ],
        correct: 1,
      },
      {
        q: 'A client of Asian descent shows ALDH2 defect. What is the consultation key point?',
        options: [
          'Drink more alcohol to overcome the variant',
          'Acetaldehyde — a known carcinogen — accumulates. Even moderate regular alcohol intake substantially raises long-term cancer risk. Recommendation: very low or zero alcohol',
          'No real concern',
          'Only avoid sugar',
        ],
        correct: 1,
      },
      {
        q: 'How do you frame the overall detoxification report for the client?',
        options: [
          'As a verdict — the genes determine fate',
          'As a roadmap — the genes show where the system is weaker; targeted reduction of specific exposures plus antioxidant-rich lifestyle compensates measurably over years',
          'As irrelevant — detoxification is autonomous',
          'As a medical diagnosis requiring treatment',
        ],
        correct: 1,
      },
    ],
    // NovoDaily Lifestyle Demo exists only in German — hidden in EN until translated.
    documents: [],
    hasDownload: false, hasText: false,
    initialWatched: false, initialTestPassed: false,
  },

  /* ======== Burnout and Stress ======== */
  {
    id: 'bo-sci-en',
    uid: 'd1e2f3a4-b5c6-4789-abcd-ef0000000011',
    lang: 'en',
    category: CATEGORIES_EN.BURNOUT,
    topic: TOPIC_WB_EN,
    contentType: 'course',
    description: 'How the COMT gene shapes individual stress processing — and why burnout risk is genetic.',
    longDescription:
      'In this training, Dr. Daniel Wallerstorfer explains the COMT gene and its role in dopamine breakdown, the Warrior vs. Worrier phenotype, BDNF and neuroplasticity, and how individual burnout risk can be derived from genetic profile.',
    bullets: [
      'COMT — central gene for dopamine breakdown',
      'Warrior vs. Worrier — two genotypes, two stress strategies',
      'BDNF, neuroplasticity, and resilience',
      'Practical recommendations from genetic profile',
    ],
    thumbnail: '/thumbnails/course-burnout.jpg',
    introQuestionsHeader: 'This training answers:',
    introQuestions: [
      'Which gene is central to individual stress processing?',
      'What is the difference between Warrior and Worrier?',
      'How is burnout risk genetic?',
      'What concrete lifestyle recommendations result from the profile?',
    ],
    postVideoText:
      'With this scientific background, you can discuss the burnout report with your clients on solid ground and derive individual stress management strategies.',
    questions: [
      {
        q: 'Which gene is the central driver of individual stress processing in the burnout analysis?',
        options: ['MTHFR', 'COMT', 'CYP1A2', 'FTO'],
        correct: 1,
      },
      {
        q: 'What distinguishes a "Warrior" from a "Worrier" genotype regarding COMT?',
        options: [
          'Warrior breaks down dopamine faster — peak performance under acute stress. Worrier breaks down slower — strong daily concentration, more vulnerable to chronic stress',
          'No real difference, only upbringing matters',
          'Worrier breaks down dopamine faster',
          'Warriors are immune to every form of stress',
        ],
        correct: 0,
      },
      {
        q: 'What does a "red zone" in the burnout report mean for the consultation?',
        options: [
          'The client already has burnout',
          'It is a technical error',
          'The client has an unfavourable genetic predisposition in this aspect — lifestyle measures are especially important because the risk is elevated',
          'The client should avoid the entire topic',
        ],
        correct: 2,
      },
      {
        q: 'Best fitting recommendation for a client with a slow COMT variant (Worrier)?',
        options: [
          'Actively seek stress — it makes them more productive',
          'Conscious recovery breaks, meditation, good sleep hygiene, and avoiding many simultaneous stress sources — because the stress signal lingers longer in the system',
          'Drastically increase caffeine to raise dopamine',
          'Avoid every form of strain, even sport',
        ],
        correct: 1,
      },
      {
        q: 'How should an unfavourable burnout predisposition be framed in the consultation?',
        options: [
          'As fate — nothing can be done',
          'As elevated risk, not fate — clients who know their stress sensitivity can act early (sleep, meditation, exercise, breaks). The genetic info is a tool, not a verdict.',
          'As irrelevant — genes don\'t affect stress',
          'As a disease requiring immediate treatment',
        ],
        correct: 1,
      },
      {
        q: 'Why does a slow dopamine breakdown (Worrier) also have everyday advantages?',
        options: [
          'It makes them immune to every stress',
          'It causes constantly high stress resistance',
          'Dopamine stays active longer — these people experience excitement, joy and reward more intensely; they are curious and exploratory. The downside emerges only under chronic stress when the body struggles to return to calm.',
          'It has no advantages, only disadvantages',
        ],
        correct: 2,
      },
    ],
    // NovoDaily Lifestyle Demo exists only in German — hidden in EN until translated.
    documents: [],
    hasDownload: false, hasText: false,
    initialWatched: false, initialTestPassed: false,
  },

  /* ===== Burnout — Consultation ===== */
  {
    id: 'bo-report-en',
    uid: 'e2f3a4b5-c6d7-4890-bcde-f00000000012',
    lang: 'en',
    category: CATEGORIES_EN.BURNOUT,
    topic: TOPIC_REPORT_EN,
    contentType: 'course',
    description: 'Walk through the burnout report step by step with your client.',
    longDescription:
      'In this consultation training, Dr. Daniel Wallerstorfer explains how to walk through the genetic burnout report with your clients and derive individual stress management strategies.',
    bullets: [
      'Walk through the burnout report structured',
      'Explain genetic stress predisposition clearly',
      'Derive individual lifestyle recommendations',
      'Recognize warning signals early',
    ],
    thumbnail: '/thumbnails/bo-report-cover.jpg',
    introQuestionsHeader: 'In this training you will learn:',
    introQuestions: [
      'How the burnout report is structured',
      'How to explain individual stress predisposition clearly',
      'How to derive concrete lifestyle recommendations',
    ],
    brandNoticeAboveVideos: true,
    /* Note: a dedicated English burnout video is not yet recorded; this
       course currently runs without a video block until one is available. */
    postVideoText:
      'With this training you can discuss the burnout report on solid ground with your clients. The demo booklet below can serve as an example report for your own consultation practice.',
    questions: [
      {
        q: 'A client shows a slow COMT variant (Worrier). What is the central piece of consultation?',
        options: [
          'No special advice needed',
          'Stress signals stay longer in the system — recommend deliberate recovery routines, sleep priority, meditation/breathing, and avoiding several simultaneous stressors. The genetic info is a tool to plan recovery actively, not to label the client',
          'Tell the client they will burn out',
          'Recommend high doses of caffeine',
        ],
        correct: 1,
      },
      {
        q: 'A Worrier client says she enjoys her detailed work and feels productive — should she change?',
        options: [
          'Yes, she must change personality',
          'No — the slow COMT variant also brings advantages (high concentration, intense reward experience, curiosity). The recommendation is recovery-focused, not personality-focused: keep the strengths but plan recovery to protect against chronic stress',
          'Quit her job',
          'Take medication immediately',
        ],
        correct: 1,
      },
      {
        q: 'What does a "red zone" in the burnout report mean for the consultation conversation?',
        options: [
          'The client already has burnout',
          'The client has an unfavourable genetic predisposition in this aspect — lifestyle measures are particularly important. It is an alert, not a diagnosis',
          'Lab error',
          'The client should avoid all topics',
        ],
        correct: 1,
      },
      {
        q: 'A Warrior-type client says he thrives under pressure — does he need to worry about burnout?',
        options: [
          'No, Warriors are immune',
          'Less acute risk than Worrier, but recovery still matters. A perceived lack of stress can mask under-stimulation in quiet phases. Recommend structure for daily concentration and adequate sleep',
          'Yes, switch to a low-stress job',
          'Increase stress as much as possible',
        ],
        correct: 1,
      },
      {
        q: 'How do you frame the overall burnout report for the client?',
        options: [
          'As a verdict — they will burn out',
          'As a tool: the report reveals the client\'s stress profile so recovery and lifestyle can be planned deliberately. It is not a verdict and not a diagnosis',
          'As irrelevant',
          'As a medical pathology requiring immediate treatment',
        ],
        correct: 1,
      },
    ],
    // NovoDaily Lifestyle Demo exists only in German — hidden in EN until translated.
    documents: [],
    hasDownload: false, hasText: false,
    initialWatched: false, initialTestPassed: false,
  },

  /* ===== Burnout FAQ ===== */
  {
    id: 'bo-faq-en',
    uid: 'f3a4b5c6-d7e8-4901-cdef-000000000013',
    lang: 'en',
    category: CATEGORIES_EN.BURNOUT,
    topic: TOPIC_FAQ_EN,
    contentType: 'faq',
    description: 'Answers to typical client questions about genetic stress and burnout predisposition.',
    longDescription:
      'A collection of the most common questions about the genetic burnout and stress analysis — what COMT and BDNF mean, how Warrior and Worrier types differ, and what concrete recommendations follow.',
    bullets: [
      'What is the COMT gene?',
      'What does Warrior vs. Worrier mean?',
      'How is burnout risk genetic?',
      'What recommendations follow from the profile?',
    ],
    thumbnail: T(15),
    faqGroups: [
      {
        title: 'Genetic basis of stress',
        items: [
          { q: 'What is the COMT gene and why is it important?', a: 'COMT (Catechol-O-Methyltransferase) breaks down dopamine, adrenaline, and noradrenaline in the prefrontal cortex. A common variant (Val158Met) determines how fast this breakdown happens — by a factor of 3-4 between fast and slow variants. This regulates how long a stress signal stays in the system.' },
          { q: 'What is the difference between Warrior and Worrier?', a: 'Warrior (Val/Val): dopamine is broken down fast — more resistant to acute stress, performs under pressure. Worrier (Met/Met): dopamine is broken down slowly — concentration-strong in daily life but vulnerable to chronic stress. About 50% are mixed type.' },
          { q: 'What about BDNF?', a: 'BDNF (Brain-Derived Neurotrophic Factor) supports neuron growth and resilience. The Met-variant (Val66Met) reduces BDNF secretion; carriers recover more slowly from stress and are more vulnerable to depression under chronic strain. BDNF can be raised by exercise, sleep, learning, intermittent fasting.' },
        ],
      },
      {
        title: 'Practical advice',
        items: [
          { q: 'I am a Worrier — am I doomed to burn out?', a: 'No. The slow COMT variant raises sensitivity, not destiny. Knowing the predisposition lets you act early: clear recovery routines, sleep priority, breathing or meditation, avoid stacking many stressors at once. Over years this prevents the system from running into chronic overload.' },
          { q: 'I am a Warrior — do I still need to worry about burnout?', a: 'Lower acute risk, but recovery still matters. A feeling of "stress-free" can mask under-stimulation in quiet periods. Plan structure for concentration phases and protect sleep.' },
          { q: 'What helps everyone, regardless of genotype?', a: 'Sleep (7-9 h), regular movement (especially endurance — raises BDNF and regulates cortisol), social contact, meaning at work, and avoiding stimulant abuse (alcohol, excessive caffeine).' },
        ],
      },
      {
        title: 'What to do with the result',
        items: [
          { q: 'A "red zone" came up in my report. Should I be worried?', a: 'No. A red zone marks elevated risk in one specific area, not a diagnosis. It is an invitation to act early — exactly the opposite of a fatalistic verdict.' },
          { q: 'Where do I find concrete recommendations for my genotype?', a: 'In the burnout report — it contains detailed recommendations on meditation, nutrition, movement, sleep hygiene, and coping strategies, tailored to your individual COMT profile and the other evaluated factors.' },
        ],
      },
    ],
    documents: [
      {
        title: 'NovoAcademy FAQ PDF - Burnout and Stress',
        size: '118 KB',
        type: 'pdf',
        url: '/course-materials/burnout/Novogenia_FAQ_Burnout_Stress_EN.pdf',
      },
    ],
    hasDownload: true, hasText: false,
    initialWatched: false,
  },

  /* ======== Biological Age ======== */
  {
    id: 'ba-sci-en',
    uid: 'a4b5c6d7-e8f9-4012-def0-000000000014',
    lang: 'en',
    category: CATEGORIES_EN.BIOAGE,
    topic: TOPIC_WB_EN,
    contentType: 'course',
    description: 'How biological age is genetically determined and influenced by lifestyle.',
    longDescription:
      'This training explains the scientific basis behind biological age determination. You will learn which genes influence telomere length and cell aging, how biological age differs from chronological age, and which lifestyle factors can measurably alter biological age.',
    bullets: [
      'Telomeres and cell aging — basics',
      'Chronological vs. biological age',
      'Genetic factors of aging (TERT, BICD1 & Co.)',
      'Anti-aging strategies with measurable effect',
    ],
    thumbnail: '/thumbnails/course-bioage.jpg',
    youtubeId: 'udTodouyDsA',
    introQuestionsHeader: 'This training answers:',
    introQuestions: [
      'What is the difference between chronological and biological age?',
      'How are telomeres measured and what do they tell us?',
      'Which genes influence cell aging?',
      'Which lifestyle measures demonstrably alter biological age?',
    ],
    postVideoText:
      'With this scientific basis, you can discuss the biological age analysis with your clients on solid ground.',
    questions: [
      {
        q: 'What is the difference between chronological and biological age?',
        options: [
          'No difference — they are identical',
          'Chronological age is the time since birth; biological age describes the actual cellular condition — influenced by lifestyle and genetics',
          'Biological age is always higher than chronological age',
          'Chronological age is lab-measured, biological age is estimated',
        ],
        correct: 1,
      },
      {
        q: 'Which cellular structures shorten with every cell division and are a key indicator of biological age?',
        options: ['Mitochondria', 'Ribosomes', 'Telomeres', 'Cell membranes'],
        correct: 2,
      },
      {
        q: 'What is the role of the enzyme telomerase?',
        options: [
          'It breaks down cells that have aged out',
          'It can repair and extend telomeres — slowing telomere shortening',
          'It produces free radicals',
          'It transports oxygen in the blood',
        ],
        correct: 1,
      },
      {
        q: 'A client has a genetically weak telomerase ("red zone"). Best consultation recommendation?',
        options: [
          'Ignore the predisposition — telomeres cannot be influenced',
          'Compensate the genetic weakness with lifestyle: antioxidant-rich diet, targeted nutrients (D3, Omega-3, Resveratrol), moderate regular exercise, good sleep and stress reduction',
          'Completely stop exercising — it generates oxidative stress',
          'See a doctor immediately — the variant is pathological',
        ],
        correct: 1,
      },
      {
        q: 'What did research show about Mediterranean diet and telomere length?',
        options: [
          'It extends telomeres measurably in everyone',
          'It only works in carriers of a specific genotype — others see no telomere effect. A clear example that the same lifestyle advice does not work the same for everyone',
          'It shortens telomeres — should be avoided',
          'It has no measurable effect on anyone',
        ],
        correct: 1,
      },
      {
        q: 'How should an unfavourable anti-aging predisposition be framed in the consultation?',
        options: [
          'As unchangeable fate — the client will age prematurely',
          'As irrelevant — genes don\'t matter for aging',
          'As elevated risk, not fate: clients who know their genetic weak spots can apply antioxidants, sleep, exercise and stress reduction more deliberately — the effects compound over years',
          'As a disease requiring immediate treatment',
        ],
        correct: 2,
      },
    ],
    documents: [
      // NovoDaily Lifestyle Demo exists only in German — hidden in EN until translated.
      { title: 'NovoAcademy Science PDF - Telomeres and Biological Age', size: '299 KB', type: 'pdf', url: '/course-materials/scientific-reviews/Telomeres_Biological_Age_Review.pdf' },
    ],
    hasDownload: true, hasText: false,
    initialWatched: false, initialTestPassed: false,
  },

  /* ===== Biological Age — Consultation ===== */
  {
    id: 'ba-report-en',
    uid: 'b5c6d7e8-f9a0-4123-ef00-000000000015',
    lang: 'en',
    category: CATEGORIES_EN.BIOAGE,
    topic: TOPIC_REPORT_EN,
    contentType: 'course',
    description: 'Walk through the biological age report with your client.',
    longDescription:
      'In this consultation training, Dr. Daniel Wallerstorfer explains how to walk through the genetic biological age and aging process report with your clients.',
    bullets: [
      'Walk through the biological age report structured',
      'Frame the aging process in genetic terms',
      'Derive concrete anti-aging recommendations',
      'How lifestyle influences biological age',
    ],
    thumbnail: '/thumbnails/ba-report-cover.jpg',
    introQuestionsHeader: 'In this training you will learn:',
    introQuestions: [
      'How the biological age report is structured',
      'How to explain the aging process clearly',
      'What concrete lifestyle recommendations can be derived',
    ],
    brandNoticeAboveVideos: true,
    /* Note: a dedicated English bio-age consultation video is not yet
       recorded; this course currently runs without a video block. */
    postVideoText:
      'With this training you can discuss the biological age report on solid ground with your clients. The demo booklet below can serve as an example report for your own consultation practice.',
    questions: [
      {
        q: 'How do you explain biological vs. chronological age to the client in plain language?',
        options: [
          'They are identical',
          '"Chronological age is the years since you were born. Biological age describes how old your cells actually are — two people of the same age can differ by 10-20 years biologically depending on genes and lifestyle"',
          'Biological age is just a marketing term',
          'It is the same as IQ',
        ],
        correct: 1,
      },
      {
        q: 'A client has weak telomerase ("red zone"). What is the practical advice?',
        options: [
          'Nothing can be done about it',
          'Strengthen the protection externally: antioxidant-rich diet (Vitamin C/E, polyphenols, selenium), targeted nutrients (Omega-3, D3, Resveratrol), moderate regular exercise (not extreme), 7-9 hours of sleep, stress reduction. Effects accumulate over years',
          'Take high-dose chemotherapy',
          'Eat only meat',
        ],
        correct: 1,
      },
      {
        q: 'A client asks: "Does Mediterranean diet help me get younger biologically?"',
        options: [
          'Yes, always',
          'It depends on genetics: studies show Mediterranean diet measurably extends telomeres only in carriers of a specific variant. For others, the effect is weaker. The report shows whether this client is in the responder group',
          'No, never',
          'Only for women',
        ],
        correct: 1,
      },
      {
        q: 'A young client (25y) asks: "Is the bio-age report even useful for me?"',
        options: [
          'No, only useful at 60+',
          'Yes — younger is the better time to start. Genetic weaknesses compound over decades; lifestyle adjustments at 25 have a much larger cumulative effect by 60 than starting late',
          'Only useful for athletes',
          'No, biological age is fixed',
        ],
        correct: 1,
      },
      {
        q: 'How should you frame the bio-age result for a stressed client with several "red zones"?',
        options: [
          'As inevitable decline',
          'As targeted opportunities: each red zone is a clear lever — Vit D3, Omega-3, antioxidant intake, sleep, stress reduction. The plan is action-oriented and motivating, not fatalistic',
          'As a medical emergency',
          'As untreatable disease',
        ],
        correct: 1,
      },
    ],
    // NovoDaily Lifestyle Demo exists only in German — hidden in EN until translated.
    documents: [],
    hasDownload: false, hasText: false,
    initialWatched: false, initialTestPassed: false,
  },

  /* ===== Biological Age FAQ ===== */
  {
    id: 'ba-faq-en',
    uid: 'c6d7e8f9-a0b1-4234-f000-000000000016',
    lang: 'en',
    category: CATEGORIES_EN.BIOAGE,
    topic: TOPIC_FAQ_EN,
    contentType: 'faq',
    description: 'Answers to typical client questions about the biological age analysis.',
    longDescription:
      'A collection of the most important questions about the telomere and anti-aging analysis. With collapsible answers for self-study.',
    bullets: [
      'What are telomeres and why do we age?',
      'How does my genetics affect biological age?',
      'Which nutrients and lifestyle measures help?',
      'Mediterranean diet — does it work for everyone?',
    ],
    thumbnail: '/thumbnails/ba-faq-cover.jpg',
    faqGroups: [
      {
        title: 'Basics — Telomeres & Aging',
        items: [
          { q: 'What are telomeres and why are they important for aging?', a: 'Telomeres are protective caps at the end of each chromosome — they contain no genes themselves, but protect genes from being lost during cell divisions. With each cell division, a small piece of telomere breaks off. After 50-70 divisions, they are used up; the cell goes into a sleep mode (senescence) and accumulates as an "old cell" in the body.' },
          { q: 'What is the difference between chronological and biological age?', a: 'Chronological age is your life time in years — fixed and unchangeable. Biological age shows how "old" your cells actually are. Two people with the same chronological age can have biological ages up to 20 years apart due to genetic predisposition and lifestyle.' },
          { q: 'What does telomerase do?', a: 'Telomerase is an enzyme that can repair / rebuild telomeres. Its activity is partly genetic — people with strong telomerase activity preserve telomeres better; those with reduced activity see faster telomere shortening, especially under oxidative stress.' },
          { q: 'Which genes are evaluated in the analysis?', a: 'Mainly telomerase and related genes (TERT, BICD1, PPARG) controlling telomere maintenance. They show how well your body can repair / preserve telomeres — a rough estimate of your genetic anti-aging capacity.' },
        ],
      },
      {
        title: 'What lifestyle does',
        items: [
          { q: 'Does Mediterranean diet work for everyone?', a: 'Surprisingly no. Studies show it extends telomeres only in people with a specific gene variant — others see no measurable effect on telomere length. A clear demonstration that the same lifestyle advice does not work the same in every individual.' },
          { q: 'Which nutrients support telomeres?', a: 'Vitamin D3, Omega-3, Vitamin E, Resveratrol, and Ginkgo. When the genetic protection system is weak, these nutrients can be used deliberately to slow telomere shortening.' },
          { q: 'Can I influence free radicals?', a: 'Yes — antioxidants in food (Vitamin C, E, polyphenols from berries, tea, etc.) neutralise free radicals before they damage cells. In genetically weakened antioxidant defences, an antioxidant-rich diet is especially important.' },
        ],
      },
      {
        title: 'Influence & expectations',
        items: [
          { q: 'How quickly will I see results from anti-aging measures?', a: 'Telomere effects are slow — months to years. Some intermediate markers (oxidative stress, inflammation, blood lipid profile) shift in weeks. The strongest impact of lifestyle on biological age compounds over decades.' },
          { q: 'What practical use does this knowledge give me?', a: 'You know whether you genetically lean toward faster or slower cell aging — and can act deliberately. With unfavourable predisposition, focus on: antioxidant-rich diet, targeted supplements (D3, Omega-3, Resveratrol), regular but not excessive exercise, good sleep, and stress reduction.' },
        ],
      },
    ],
    documents: [
      {
        title: 'NovoAcademy FAQ PDF - Biological Age',
        size: '118 KB',
        type: 'pdf',
        url: '/course-materials/bioage/Novogenia_FAQ_Biological_Age_EN.pdf',
      },
    ],
    hasDownload: true, hasText: false,
    initialWatched: false,
  },

  /* ======== Personalized Supplementation ======== */
  {
    id: 'supp-sci-en',
    uid: 'd7e8f9a0-b1c2-4345-0000-000000000017',
    lang: 'en',
    category: CATEGORIES_EN.SUPP,
    topic: TOPIC_WB_EN,
    contentType: 'course',
    description: 'How genetic individual micronutrient needs make personalized supplementation possible — explained scientifically.',
    longDescription:
      'In this training, Dr. Daniel Wallerstorfer explains why every person has different micronutrient needs and how genetically personalized supplementation works. You will learn the microtransporter technology — how competing nutrients (e.g., calcium and zinc) can be absorbed simultaneously and why slow-release for Vitamin C mimics a physiologically meaningful pattern.',
    bullets: [
      'Genetic individual nutrient needs',
      'Microtransporter technology',
      'Slow-release & separated absorption (Calcium/Zinc)',
      'Bioavailability of vitamins and minerals',
    ],
    thumbnail: T(15),
    coverImage: '/thumbnails/supp-sci-cover.jpg',
    introQuestionsHeader: 'This training answers:',
    introQuestions: [
      'Why does every person have different micronutrient needs?',
      'How does microtransporter technology solve competing nutrients?',
      'Why is Vitamin C released slow-release?',
      'How can Calcium and Zinc be absorbed simultaneously despite mutual blockade?',
    ],
    brandNoticeAboveVideos: true,
    youtubeId: 'TIHnA7J6EP4',
    postVideoText:
      'With this background you can discuss the logic behind personalized supplementation on solid ground with your clients and explain microtransporter technology clearly — including the practical applications in pellets and IV-based delivery.',
    questions: [
      {
        q: 'Why does every person have a different micronutrient need?',
        options: [
          'Cell counts vary',
          'Genetic variants change how the body absorbs, metabolises and uses each nutrient — the same intake leads to different blood levels',
          'It depends only on water consumption',
          'Stomach size varies',
        ],
        correct: 1,
      },
      {
        q: 'What is the core problem the microtransporter technology solves?',
        options: [
          'Tablets too large to swallow',
          'In standard pills many nutrients block each other on absorption, or disappear from the bloodstream too quickly to be useful',
          'Vitamins are expensive to produce',
          'Supplements taste bad',
        ],
        correct: 1,
      },
      {
        q: 'Why is Vitamin C released as slow-release?',
        options: [
          'Vitamin C is toxic in high doses',
          'It only works at very high doses',
          'Vitamin C has a half-life of about 30 minutes — releasing it gradually through the day mimics natural intake from food and keeps blood levels stable',
          'Slow-release is just a marketing term',
        ],
        correct: 2,
      },
      {
        q: 'How does microtransporter technology let Calcium and Zinc be absorbed simultaneously despite blocking each other?',
        options: [
          'Only one of the two is used',
          'Calcium and Zinc are chemically combined into a new compound',
          'They are simply packed into the same pill together',
          'Zinc is released in the upper intestine immediately, Calcium hours later in the lower intestine — taken together but released spatially and temporally separated, so they never compete for the same transporters',
        ],
        correct: 3,
      },
      {
        q: 'How many genes are analysed for the personalized supplementation report?',
        options: ['About 10', 'About 25', 'Over 60', 'Exactly 200'],
        correct: 2,
      },
      {
        q: 'What is the key advantage of personalized over standard supplementation?',
        options: [
          'It contains more vitamins per pill',
          'Dose, selection and release form match the individual genetic need — no "one size fits all"; the nutrient actually reaches the bloodstream instead of being excreted',
          'It is always cheaper',
          'It works on day 1',
        ],
        correct: 1,
      },
    ],
    documents: [
      // Slides exist only in German — hidden in EN until translated.
      { title: 'NovoAcademy Science PDF - Slow-Release Microtransporters — Pellet Technology', size: '305 KB', type: 'pdf', url: '/course-materials/scientific-reviews/Slow_Release_Pellets_Review.pdf' },
    ],
    hasDownload: true, hasText: false,
    initialWatched: false, initialTestPassed: false,
  },

  /* ===== Personalized Supplementation FAQ ===== */
  {
    id: 'supp-faq-en',
    uid: 'e8f9a0b1-c2d3-4456-0000-000000000018',
    lang: 'en',
    category: CATEGORIES_EN.SUPP,
    topic: TOPIC_FAQ_EN,
    contentType: 'faq',
    description: 'Answers to typical client questions about personalized supplementation and microtransporter technology.',
    longDescription:
      'A collection of the most important client questions around personalized supplementation — why not every pill works, what microtransporter technology really does differently, and how genetic information shapes the dosage.',
    bullets: [
      'What is the difference between standard and personalized supplementation?',
      'How does microtransporter technology work?',
      'How does the dosage adapt to genetic needs?',
      'What does personalized supplementation cost in comparison?',
    ],
    thumbnail: T(15),
    faqGroups: [
      {
        title: 'Basics — Why personalized?',
        items: [
          { q: 'Why do I need personalized supplementation at all?', a: 'Because your body genetically utilizes some nutrients better or worse than another person — and because your lifestyle (exercise, sleep, stress, nutrition) additionally shapes your individual need. Standard pills assume the "average person" and therefore cover many individual needs either too little or too much.' },
          { q: 'What is the difference from standard multivitamins from the drugstore?', a: 'Three main points: (1) The selection of nutrients and their dosage is tailored to your genes; (2) the release is timed (e.g., Slow-Release Vitamin C) to keep blood levels constant; (3) competing nutrients like Calcium and Zinc are released spatially and temporally separated so they don\'t block each other.' },
          { q: 'How many genes does the analysis consider?', a: 'Over 60 nutrient-relevant gene variants — including vitamin-metabolism genes (folate-MTHFR, Vit-D-VDR, Vit-B12-FUT2), mineral-absorption genes (iron-HFE, calcium-LCT), and antioxidant defense systems (GST, SOD, CAT).' },
        ],
      },
      {
        title: 'Microtransporter Technology',
        items: [
          { q: 'What are microtransporters?', a: 'Microtransporters are tiny pellets in the millimetre range, each carrying individual nutrients in specific protective shells. Each microtransporter "releases" at a different time and a different location in the GI tract — so even normally competing nutrients can be taken together but absorbed separately.' },
          { q: 'Why is Vitamin C released as slow-release?', a: 'Vitamin C has a very short biological half-life (~30 minutes). A single high dose is largely excreted unused. Slow-Release in the microtransporters mimics the natural, continuous intake from food across the day and keeps blood levels stable — physiologically much more sensible.' },
          { q: 'How does it work with Calcium and Zinc that block each other?', a: 'Calcium and Zinc compete for the same intestinal transporters — taking both together yields less of both. In the microtransporter technology, Zinc is released in the upper small intestine immediately, Calcium hours later in the deeper intestinal segment. Both are taken at once, but released at different places and times — no competition.' },
        ],
      },
      {
        title: 'Practical questions',
        items: [
          { q: 'Do I have to take the pills at fixed times?', a: 'We recommend a consistent time of day (e.g. with breakfast) to keep blood levels stable. You don\'t have to watch the minute — a rough routine is enough. The most important thing is taking them regularly at all.' },
          { q: 'How fast will I notice an effect?', a: 'It varies by nutrient. Some effects (e.g. better energy with B-vitamins) appear within days to weeks; others (e.g. bone metabolism with Vitamin D) develop over months. Personalized supplementation is not a fast-acting medication — it corrects long-term nutrient gaps.' },
          { q: 'Do I need supplementation forever?', a: 'For genetically caused metabolic weaknesses yes, because the predisposition lasts a lifetime. Lifestyle-driven needs (e.g. higher need during stress, exercise, illness) can change. The analysis also shows you where your genetics produce a permanently elevated need and where lifestyle adjustment alone is sufficient.' },
          { q: 'Can I combine supplementation with medications?', a: 'Generally yes — all nutrients are dosed in food-typical amounts. With chronic disease or long-term medication you should discuss this with your physician, because individual nutrients (e.g. Vitamin K, iron) can interact with certain drugs.' },
          { q: 'How does personalized cost compare to drugstore multivitamins?', a: 'Significantly more per day — typically 3-5× the cheapest drugstore products. In return you get a genetically tailored composition that probably actually gets absorbed instead of being largely excreted unused. The "per mg of vitamin" comparison is misleading; "per mg that actually reaches the blood" is more meaningful.' },
        ],
      },
    ],
    documents: [
      {
        title: 'NovoAcademy FAQ PDF - Personalized Supplementation',
        size: '120 KB',
        type: 'pdf',
        url: '/course-materials/supplements/Novogenia_FAQ_Personalized_Supplementation_EN.pdf',
      },
    ],
    hasDownload: true, hasText: false,
    initialWatched: false,
  },

  /* ======== Beauty ======== */
  {
    id: 'beauty-sci-en',
    uid: 'f9a0b1c2-d3e4-4567-0000-000000000019',
    lang: 'en',
    category: CATEGORIES_EN.BEAUTY,
    topic: TOPIC_WB_EN,
    contentType: 'course',
    description: 'How genes co-determine skin aging, wrinkle formation, UV sensitivity, and skin hydration — explained scientifically.',
    longDescription:
      'In this training, Dr. Daniel Wallerstorfer explains the genetic foundations of the DNAbeauty Control analysis. Which genes control collagen breakdown? Why does skin burn faster for some people? How does skin hydration relate to filaggrin and other genes? And what can be derived from this information for truly personalized skincare?',
    bullets: [
      'Genetic skin aging & collagen breakdown (MMP1)',
      'UV sensitivity and pigmentation (MC1R)',
      'Skin hydration & barrier function (FLG)',
      'Antioxidant defense systems of the skin (SOD, CAT, GPX)',
    ],
    thumbnail: T(1),
    youtubeId: 'IgNeWJ6tTng',
    introQuestionsHeader: 'This training answers:',
    introQuestions: [
      'Which genes control collagen breakdown and thus wrinkle formation?',
      'How does genetic UV sensitivity differ between people?',
      'What role do antioxidant genes play in skin aging?',
      'How does genetic skin hydration relate to the skincare routine?',
    ],
    postVideoText:
      'With this scientific background you can discuss the Beauty report on solid ground with your clients and derive individual care strategies from the genetic results.',
    questions: [
      {
        q: 'Which enzyme / gene is central for the breakdown of collagen in the skin and thus for wrinkle formation?',
        options: [
          'MTHFR — folate activation',
          'MMP1 — Matrix Metalloproteinase 1 (breaks down collagen)',
          'CYP1A2 — caffeine breakdown',
          'LCT — lactase persistence',
        ],
        correct: 1,
      },
      {
        q: 'A client carries a very active MMP1 variant. What does this mean for her skincare?',
        options: [
          'She needs no anti-aging measures',
          'Increased risk of early wrinkle formation — anti-aging measures (antioxidants, UV protection, collagen boosters, no smoking) are particularly important for her',
          'The variant only affects hair colour',
          'She should eat more carbs',
        ],
        correct: 1,
      },
      {
        q: 'Which statement about genetic UV sensitivity (e.g. MC1R) is correct?',
        options: [
          'Genetic variants do not influence UV sensitivity — only skin type matters',
          'Carriers of unfavourable variants burn more easily and have a higher risk of UV-related skin aging and skin cancer — strict UV protection is even more important',
          'At high genetic UV sensitivity, one should avoid sun completely, even in the shade',
          'Sunscreen works only for people with "normal" genes',
        ],
        correct: 1,
      },
      {
        q: 'Why are antioxidant genes like SOD2, CAT and GPX important for skin aging?',
        options: [
          'They produce free radicals',
          'They protect against oxidative stress, which causes DNA damage in skin cells — when these defenses are weak the skin ages measurably faster; antioxidants (vitamin C, E, polyphenols) become especially important',
          'They only influence the immune system, not the skin',
          'They produce pigment',
        ],
        correct: 1,
      },
      {
        q: 'Best fitting recommendation for a client with genetically reduced skin hydration (e.g. unfavourable FLG / filaggrin variants)?',
        options: [
          'Hot showers and strong soapy cleansers',
          'Increased use of moisture-binding and barrier-strengthening care (Hyaluronic acid, Ceramides, Glycerin), mild cleansers, avoid drying agents',
          'Skip skincare entirely — the skin regulates itself',
          'Only let water touch the skin once a week',
        ],
        correct: 1,
      },
      {
        q: 'What distinguishes the genetic skin analysis from a purely cosmetic consultation?',
        options: [
          'It is cheaper',
          'It identifies permanent genetic weak points of the skin instead of merely judging the current state — care and protection can be applied proactively for the long term rather than reactively',
          'It replaces every medical skin exam',
          'It is only useful for young people',
        ],
        correct: 1,
      },
    ],
    documents: [
      // Slides + Beauty Sensor Demo exist only in German — hidden in EN until translated.
      { title: 'NovoAcademy Science PDF - Telomeres & Skin Aging', size: '299 KB', type: 'pdf', url: '/course-materials/scientific-reviews/Telomeres_Biological_Age_Review.pdf' },
    ],
    hasDownload: true, hasText: false,
    initialWatched: false, initialTestPassed: false,
  },

  /* ===== Beauty FAQ ===== */
  {
    id: 'beauty-faq-en',
    uid: 'a0b1c2d3-e4f5-4678-0000-000000000020',
    lang: 'en',
    category: CATEGORIES_EN.BEAUTY,
    topic: TOPIC_FAQ_EN,
    contentType: 'faq',
    description: 'Answers to typical client questions about the genetically founded skin analysis (DNAbeauty Control).',
    longDescription:
      'A collection of the most important client questions around the genetic skin analysis: what it really tells you, which genes are considered, how practical care recommendations are derived, and what expectations are realistic.',
    bullets: [
      'What DNAbeauty Control really tells you — and what not',
      'How genetic skin analysis differs from cosmetic consultation',
      'Which genes we look at (MMP1, MC1R, FLG, …)',
      'What practical care recommendations look like',
    ],
    thumbnail: '/thumbnails/beauty-faq-cover.jpg',
    faqGroups: [
      {
        title: 'Basics — What the genetic skin analysis does',
        items: [
          { q: 'What is the genetic skin analysis (DNAbeauty Control)?', a: 'An analysis of your genes focusing on skin-relevant areas: collagen breakdown, UV sensitivity, pigmentation, skin hydration, antioxidant defense, and inflammation tendency. From your DNA dataset, over 20 skin-relevant gene variants are evaluated and translated into practical care and protection recommendations.' },
          { q: 'What is the difference from a cosmetic skin analysis?', a: 'Cosmetic skin analyses measure your skin\'s current state — hydration, sebum, pigmentation, etc. — and react to it. The genetic skin analysis shows you which properties and weaknesses are PERMANENTLY anchored in your genes. You can proactively prevent, instead of reactively treating when problems become visible.' },
          { q: 'How many genes are analysed?', a: 'Over 20 skin-relevant gene variants. Main areas: MMP1 (collagen breakdown, wrinkles), MC1R (UV sensitivity, pigmentation), FLG (filaggrin, skin hydration / barrier), SOD2/CAT/GPX (antioxidant defense), inflammation genes like IL6 and TNF-α.' },
          { q: 'How long is my result valid?', a: 'Your genes do not change throughout life — so the core results stay permanently valid. What gets refined: the evaluation itself, as new research is continuously incorporated.' },
        ],
      },
      {
        title: 'Genetics & Skin Aging — Understanding the result',
        items: [
          { q: 'What does an "active" MMP1 variant mean?', a: 'MMP1 (Matrix-Metalloproteinase 1) breaks down collagen in the skin. A genetically highly active variant leads to faster collagen breakdown — the skin loses firmness earlier, wrinkles form faster. Countermeasures: consistent UV protection, antioxidants, no smoking, retinoids or peptide-based care.' },
          { q: 'What does MC1R tell me about UV sensitivity?', a: 'MC1R controls production of Eumelanin (dark pigment, protective against UV) vs. Pheomelanin (reddish pigment, generates free radicals under UV). Unfavourable variants: faster sunburn, higher risk of UV damage and skin cancer — stricter sunscreen discipline needed.' },
          { q: 'Why is FLG (filaggrin) important for my skincare?', a: 'FLG produces filaggrin, a protein that holds the natural skin barrier together and binds moisture. With genetically reduced FLG activity, the skin barrier is weaker — moisture is lost faster, irritants penetrate more easily. Recommendation: barrier-strengthening care (Ceramides, Cholesterol, free fatty acids), mild cleansers, no drying surfactants.' },
          { q: 'Does this really affect my appearance measurably?', a: 'Yes, but not overnight. Genetic weaknesses compound over years. Two people of the same age can differ by 10-15 years biologically — depending on how well they compensate genetic weak spots with lifestyle.' },
        ],
      },
      {
        title: 'Practical recommendations & expectations',
        items: [
          { q: 'How quickly will I notice an effect from personalized care?', a: 'Some effects appear in weeks (hydration, glow, irritation), others only after months to years (wrinkle formation, pigmentation, skin structure). Personalized care is not a quick fix but a long-term protective strategy.' },
          { q: 'Do I need expensive creams?', a: 'Not necessarily. What matters is the right ingredients for your genetic predisposition — and those exist at every price point. What counts: active-ingredient concentration, formulation, and consistency of application. An affordable Vitamin C serum can outperform an expensive cream without active ingredients.' },
          { q: 'Is my lifestyle more important than my genes?', a: 'Both work together. Genes set the potential and the weak spots — lifestyle decides how much you compensate or amplify those weak spots. Rule of thumb: with genetically unfavourable predisposition, consistent lifestyle becomes even more important than with "lucky genes".' },
        ],
      },
    ],
    documents: [
      {
        title: 'NovoAcademy FAQ PDF - Healthy Skin and Appearance',
        size: '120 KB',
        type: 'pdf',
        url: '/course-materials/beauty/Novogenia_FAQ_Healthy_Skin_EN.pdf',
      },
    ],
    hasDownload: true, hasText: false,
    initialWatched: false,
  },

  /* ======== Drug Intolerance / Pharmacogenetics ======== */
  {
    id: 'pharma-sci-en',
    uid: 'b1c2d3e4-f5a6-4789-0000-000000000021',
    lang: 'en',
    category: CATEGORIES_EN.PHARMA,
    topic: TOPIC_WB_EN,
    contentType: 'course',
    description: 'How genetic variants influence drug metabolism and tolerance — explained scientifically.',
    longDescription:
      'In this training, Dr. Daniel Wallerstorfer explains why medications work differently in different people. You will learn how CYP enzymes break down active substances, what "fast" vs. "slow metabolizer" means, and how this knowledge guides safer prescribing decisions.',
    bullets: [
      'CYP enzymes & drug metabolism',
      'Fast and slow metabolizers',
      'Clinically relevant active substances (antidepressants, analgesics, anticoagulants, …)',
      'Practical relevance in consultation',
    ],
    thumbnail: T(24),
    youtubeId: 'SgzAZyUIx-0',
    introQuestionsHeader: 'This training answers:',
    introQuestions: [
      'Why do medications work differently in different people?',
      'Which CYP enzymes are responsible for breaking down the most important active substances?',
      'What does "fast" vs. "slow metabolizer" mean in clinical everyday life?',
      'Which medications are particularly relevant for pharmacogenetic consultation?',
    ],
    postVideoText:
      'With this background you can discuss the relevance of pharmacogenetic testing with clients and physicians — explaining why a dose that works for most can be too strong or too weak for a given individual depending on their CYP genotype.',
    questions: [
      {
        q: 'Why does the same medication work differently in different people?',
        options: [
          'It is a coincidence of mood',
          'Genetic variants in CYP enzymes change the speed at which the drug is broken down — fast metabolizers clear it too quickly (weaker effect), slow metabolizers accumulate it (stronger / toxic effect)',
          'Body weight is the only factor',
          'There is no real difference',
        ],
        correct: 1,
      },
      {
        q: 'What does "poor metabolizer" mean clinically?',
        options: [
          'The person cannot digest food properly',
          'Their CYP enzyme variant breaks down the drug very slowly, so the active substance accumulates — standard doses can lead to side effects or toxicity',
          'They need a larger dose to feel any effect',
          'It only affects mental health drugs',
        ],
        correct: 1,
      },
      {
        q: 'Which CYP enzyme is one of the most clinically relevant for drug metabolism?',
        options: [
          'CYP2D6 — involved in metabolizing antidepressants, beta-blockers, opioids and many other widely prescribed drugs',
          'CYP1B5',
          'CYP9Z1',
          'CYPX',
        ],
        correct: 0,
      },
      {
        q: 'How should a pharmacogenetic finding be used in practice?',
        options: [
          'As a reason to stop all medication',
          'As guidance for the prescribing physician — to choose alternative drugs or adjust dosing for the patient\'s metabolizer type, reducing side effects and improving efficacy',
          'It is only useful for research',
          'It replaces medical diagnosis',
        ],
        correct: 1,
      },
      {
        q: 'Why is pharmacogenetics important in consultation?',
        options: [
          'It is mainly a sales topic',
          'About 7% of all medications have clinically actionable pharmacogenetic guidelines — knowing the genotype before prescribing can prevent severe side effects and treatment failure',
          'It only matters for cancer drugs',
          'It is too rare to consider',
        ],
        correct: 1,
      },
    ],
    documents: [
      // Slides + Pharmaco Sensor Demo exist only in German — hidden in EN until translated.
      { title: 'NovoAcademy Science PDF - Caffeine & CYP1A2 Variant (Pharmacogenetics example)', size: '244 KB', type: 'pdf', url: '/course-materials/scientific-reviews/Caffeine_Review.pdf' },
    ],
    hasDownload: true, hasText: false,
    initialWatched: false,
  },

  /* ======== Legally Safe Advertising ======== */
  {
    id: 'legal-basics-en',
    uid: 'c2d3e4f5-a6b7-4890-0000-000000000022',
    lang: 'en',
    category: CATEGORIES_EN.LEGAL,
    topic: 'Advertising Guideline for Novogenia Products',
    contentType: 'training',
    description: 'Which advertising claims for gene analyses, blood tests, and supplements are legally safe — and which are subject to warning letters.',
    longDescription:
      'A text-based training (no video) on legally compliant advertising of Novogenia products. Source: Novogenia Advertising Guideline. You will learn how warning letters work, which statements are safe, which are critical — and which best practices Novogenia has developed in 13 years of practice.',
    bullets: [
      'How a warning letter works and what it costs',
      'Safe vs. risky advertising claims for blood tests, gene tests, and supplements',
      'The EU Health Claims for supplements',
      'Handling customer reviews and testimonials',
    ],
    thumbnail: T(24),
    introQuestionsHeader: 'In this training you will learn:',
    introQuestions: [
      'How warning-letter associations work and what costs to expect',
      'Which advertising claims for blood tests are legally safe',
      'Why genetic properties can be advertised safely but action recommendations are critical',
      'How to correctly apply Health Claims for supplements',
      'How to moderate customer reviews legally safely',
    ],
    articleSections: [
      {
        title: 'Advertising Novogenia products',
        paragraphs: [
          'Novogenia is at the forefront of scientific possibilities and offers established analysis procedures like blood tests but also advanced possibilities like gene analyses and personalized products. Since we are in the health sector, there are strict rules for advertising claims that must be observed. Particularly in Germany, there are warning-letter associations that look for unclear or misleading statements and issue warnings.',
          'We are firmly convinced that our recommendations are effective and consider the most advanced state of science. Unfortunately, what a product can do and what one is allowed to claim in advertising are sometimes different.',
        ],
      },
      {
        title: 'Advertising with blood tests',
        paragraphs: [
          'Blood tests are well established and only subject to minor advertising restrictions. The statements below are all uncritical.',
        ],
        bullets: [
          { tone: 'safe', text: '"We test blood."' },
          { tone: 'safe', text: '"We diagnose deficiencies."' },
          { tone: 'safe', text: '"We give micronutrient and nutrition recommendations."' },
          { tone: 'safe', text: '"We personalize supplements based on the result."' },
          { tone: 'safe', text: 'Symptoms of a deficiency (e.g. fatigue from iron deficiency) — best with a source citation (e.g. a medical association).' },
          { tone: 'safe', text: 'Testimonial: "I was often tired, the test identified iron deficiency, and it helped me" — permitted.' },
        ],
      },
      {
        title: 'Advertising with genetic tests',
        paragraphs: [
          'DNA analyses are not yet a standard method in every doctor\'s office. Warning-letter associations critically scrutinize technologies that are not yet considered standard practice by the majority of experts. DNA analysis is therefore under special observation.',
          'From the warning-letter association\'s view, a DNA analysis has two components: the scientifically validated analysis of the genetic properties (uncritical) and the action programme derived from it (critical).',
        ],
        bullets: [
          { tone: 'safe', text: 'Determination of the genetic properties — backed by current science.' },
          { tone: 'critical', text: 'Concrete nutrition, exercise or supplement recommendations derived from the genes — without specific randomized trials on that exact recommendation.' },
        ],
        callout: { tone: 'safe', text: 'Example: "Gene test proves that folic acid is ineffective for you" — permitted (study-backed).' },
      },
      {
        title: 'The safe variant — genetic properties only',
        paragraphs: [
          'The safe variant focuses on statements limited to the determined genetic properties — without deriving concrete action recommendations. All the formulations below are uncritical from the warning-letter perspective.',
        ],
        bullets: [
          { tone: 'safe', text: '"We analyse your genes and determine whether you gain weight more easily on fat or on carbohydrates."' },
          { tone: 'safe', text: '"You find out whether you respond more to exercise or to calorie reduction."' },
          { tone: 'safe', text: '"You learn whether your body can activate folic acid effectively."' },
          { tone: 'safe', text: '"You learn which talents your body has in competitive sports and how well your muscles respond to resistance training."' },
        ],
      },
      {
        title: 'The bolder variant — recommendations with a disclaimer',
        paragraphs: [
          'In this variant, the test is advertised as above — but action recommendations are communicated as logical conclusions, not as scientifically confirmed promises. With a disclaimer. Caveat: warning-letter associations do not always accept disclaimers.',
        ],
        bullets: [
          { tone: 'caveat', text: '"We analyse your genes and determine whether you gain weight more easily on fat or on carbohydrates. Based on this we derive logical conclusions and nutrition plans to use this insight.*"' },
          { tone: 'caveat', text: '"You learn whether your body can activate folic acid. Based on this, we recommend alternative micronutrients to take instead.*"' },
          { tone: 'critical', text: 'COUNTER-EXAMPLE: "Take methylfolate instead of folic acid" — critical without disclaimer, because there is no randomized trial on this exact specific recommendation.' },
        ],
        callout: { tone: 'caveat', text: '* Disclaimer note: The genetic properties are scientifically confirmed. The derived adjustments to micronutrient dosing or nutrition recommendations are not yet at the gold-standard level (randomized, placebo-controlled trials) for many effects and should be understood as experimental.' },
      },
      {
        title: 'Advertising personalized supplementation',
        paragraphs: [
          'The European Union has set up a clear regulatory framework for claims about the effect of supplements — the "Health Claims". These define exactly which effects can be advertised for each active ingredient.',
          'Regardless of how much science backs an effect, it is not allowed to promote it in advertising until the Health Claim has been approved by EFSA. Stick to the extensive list of permitted claims.',
        ],
        bullets: [
          { tone: 'safe', text: 'Personalization based on lifestyle and blood values — unproblematic.' },
          { tone: 'caveat', text: 'Personalization based on genetic analysis — only with a disclaimer (see "bolder variant").' },
          { tone: 'safe', text: 'Example health claim: "Contributes to normal skin" (with zinc), "Contributes to a normal immune system".' },
          { tone: 'safe', text: 'Example testimonial: "I take it because I have dry skin" — combined with the zinc Health Claim — permitted.' },
          { tone: 'critical', text: 'NOT permitted: any claim whose Health Claim has not been approved by EFSA (e.g. "heals your disease").' },
        ],
      },
      {
        title: 'Customer reviews and testimonials',
        paragraphs: [
          'If you offer a customer review system (e.g. on your website), you cannot control whether a customer makes impermissible statements (e.g. "Product X cured me"). This is permitted in principle but must be handled carefully.',
        ],
        bullets: [
          { tone: 'safe', text: 'On your own moderable system: clearly label statements as customer opinions and that you do not endorse them.' },
          { tone: 'safe', text: 'Statements that violate the Health Claims Regulation should be deleted.' },
          { tone: 'safe', text: 'For a massively wrong rating: add a corrective reply from the company.' },
          { tone: 'caveat', text: 'On external, non-moderable systems: declare them clearly and never selectively promote false statements.' },
          { tone: 'critical', text: 'Actively promoting or highlighting false statements — even when they are customer voices.' },
        ],
      },
    ],
    questions: [
      {
        q: 'What is a typical initial fee charged by a warning-letter association?',
        options: ['About 50 €', 'About 200 €', 'About 1,000 €', 'About 5,000 €'],
        correct: 1,
      },
      {
        q: 'What is the typical penalty for re-using a contested advertising claim?',
        options: ['About 200 €', 'About 1,000 €', 'About 5,000 €', 'About 50,000 €'],
        correct: 2,
      },
      {
        q: 'Which forms of advertising typically trigger warning letters?',
        options: [
          'Direct-sales materials and verbal consultation',
          'Broadly distributed advertising such as TV, magazines, and social media',
          'Print advertising only',
          'Websites without paid advertising',
        ],
        correct: 1,
      },
      {
        q: 'Which part of a DNA analysis is typically UNCRITICAL from a warning-letter association\'s view?',
        options: [
          'The concrete nutrition and sport plans',
          'The personalized micronutrient recommendations',
          'The scientific analysis of the genetic properties',
          'All statements about DNA tests are critical',
        ],
        correct: 2,
      },
      {
        q: 'Which part of a DNA analysis is typically CRITICAL?',
        options: [
          'Determining the gene variants',
          'The concrete action plans derived from them (nutrition, sport, supplements)',
          'Sample collection in the lab',
          'Explaining the science in the report',
        ],
        correct: 1,
      },
      {
        q: 'Which folic acid statement is SAFE under the advertising guideline?',
        options: [
          '"Take methylfolate instead of folic acid — it works better for you."',
          '"You learn whether your body can activate folic acid effectively."',
          '"Our test replaces a doctor\'s visit for folic acid questions."',
          '"Folic acid is generally ineffective."',
        ],
        correct: 1,
      },
      {
        q: 'What are EU Health Claims?',
        options: [
          'A list of forbidden advertising claims',
          'A framework of precisely defined effect claims permitted for supplements',
          'Studies on clinical efficacy',
          'A self-declaration by the manufacturer',
        ],
        correct: 1,
      },
      {
        q: 'Who carries legal responsibility for a reseller\'s advertising claims?',
        options: [
          'Novogenia is fully liable',
          'The partner / reseller themselves — Novogenia accepts no liability',
          'The warning-letter associations',
          'No one carries responsibility',
        ],
        correct: 1,
      },
      {
        q: 'How should a customer review containing an impermissible Health Claim (e.g. "the product cured me") be handled?',
        options: [
          'Leave it unchanged — customer opinions are always legally safe',
          'Clearly label it as a customer opinion; on moderable systems delete the impermissible statement or attach a corrective reply',
          'Disable all reviews immediately',
          'Report the customer',
        ],
        correct: 1,
      },
      {
        q: 'Which strategy for advertising personalized supplements is UNCRITICAL?',
        options: [
          'Advertising with concrete healing promises that are not in the Health Claims list',
          'Personalization based on lifestyle and blood values — both unproblematic',
          'Statements like "heals your disease"',
          'Advertising without an ingredient list',
        ],
        correct: 1,
      },
    ],
    // Advertising Guideline PDF exists only in German — hidden in EN until translated.
    documents: [],
    hasDownload: false, hasText: true,
    initialWatched: false, initialTestPassed: false,
  },

]

/* ---- English MAIN_CATEGORIES (display grouping) ---- */
export const MAIN_CATEGORIES_EN = [
  {
    title: 'Lifestyle DNA Analyses',
    sections: [
      CATEGORIES_EN.WEIGHT,
      CATEGORIES_EN.NUTRITION,
      CATEGORIES_EN.PERFORMANCE,
      CATEGORIES_EN.DETOX,
      CATEGORIES_EN.BURNOUT,
      CATEGORIES_EN.BIOAGE,
    ],
  },
  {
    title: 'Personalized Supplementation',
    sections: [CATEGORIES_EN.SUPP],
  },
  {
    title: 'Beauty',
    sections: [CATEGORIES_EN.BEAUTY],
  },
  {
    title: 'Additional Analyses',
    sections: [CATEGORIES_EN.PHARMA],
  },
  {
    title: 'Training for Partners and Resellers',
    sections: [CATEGORIES_EN.LEGAL],
  },
]

/* ---- English SECTION_PRODUCT_LABELS ---- */
export const SECTION_PRODUCT_LABELS_EN = {
  [CATEGORIES_EN.WEIGHT]:      'Shape, Weight Sensor',
  [CATEGORIES_EN.NUTRITION]:   'Nutrition, Nutrition Sensor',
  [CATEGORIES_EN.PERFORMANCE]: 'Performance, Performance Sensor',
  [CATEGORIES_EN.DETOX]:       'Detox, Toxo Sensor',
  [CATEGORIES_EN.BURNOUT]:     'Burnout',
  [CATEGORIES_EN.BIOAGE]:      'Bio Age, Biological Age Sensor',
  [CATEGORIES_EN.SUPP]:        'Novodailies, Nutrime Complete',
  [CATEGORIES_EN.BEAUTY]:      'Beauty, Beauty Sensor',
  [CATEGORIES_EN.PHARMA]:      'Pharmaco Sensor, Drug Response',
}
