// app.js - German Language Learning Player
// Modes: listen (passive), shadow (listen + repeat), recall (active recall), ai (AI Chat)

const CATEGORIES = {
  all: "All Islands",
  morning_routine: "Morning Routine",
  job_search: "Job Search",
  german_class: "German Class",
  hirschsprach_cafe: "Hirschsprach Café",
  describe_surroundings: "Describe Surroundings",
  inner_thoughts: "Inner Thoughts",
  daily_life: "Daily Life",
  greetings: "Greetings & Small Talk",
  food_drink: "Food & Eating Out",
  shopping: "Shopping",
  health: "Health & Pharmacy",
  travel: "Travel & Directions",
  social: "Social Plans",
  hobbies: "Hobbies & Free Time",
  core_structures: "Core Structures",
  university_life: "Uni & Studium",
  phone_digital: "Handy & Digitales",
  bureaucracy: "Behörden & Bürokratie",
};

// ---- Grammar Tags (phrase ID → grammar structure labels) ----
const GRAMMAR_TAGS = {
  1:["Perfekt"], 2:["Modal","Infinitiv"], 3:["Fragewort","Modal"],
  4:["Präsens","Dativ"], 5:["Perfekt"], 6:["Präsens","Adjektiv"],
  7:["Perfekt"], 8:["Perfekt"], 9:["Modal","Konjunktion"],
  10:["Präsens","Adjektiv"], 11:["Präsens"], 12:["Perfekt"],
  13:["Präsens"], 14:["Präteritum"], 15:["Präsens","Nebensatz-dass"],
  16:["Präsens","Adjektiv"], 17:["Perfekt"], 18:["Präsens"],
  19:["Präsens","Adjektiv"], 20:["Präsens","Nebensatz-dass"],
  21:["Modal","Imperativ"], 22:["Perfekt","Negation"],
  23:["Fragewort"], 24:["Fragewort"], 25:["Modal","Komparativ"],
  26:["Präsens","seit"], 27:["Präsens"], 28:["Modal"],
  29:["Präsens","Negation"], 30:["Modal","Infinitiv"],
  31:["Präsens"], 32:["Präsens","Dativ"], 33:["Präsens","Infinitivsatz"],
  34:["Perfekt"], 35:["Fragewort","Meinungsausdruck"],
  36:["Präsens","Meinungsausdruck"], 37:["Präsens"],
  38:["Konjunktiv-II","Infinitivsatz"], 39:["Präsens","Temporalsatz"],
  40:["Präsens","Adjektiv"],
  41:["Präsens","Akkusativ"], 42:["Präsens","Adjektiv"],
  43:["Präsens","Adjektiv"], 44:["Präsens"], 45:["Präsens","Adjektiv"],
  46:["Präsens"], 47:["Präsens","Adjektiv"], 48:["Präsens","Infinitiv"],
  49:["Präsens","Genitiv"], 50:["Präsens"],
  51:["Präsens","Nebensatz-dass"], 52:["Präsens","Nebensatz-ob"],
  53:["Modal","Infinitiv"], 54:["Präsens","Nebensatz-ob"],
  55:["Präsens"], 56:["Präsens"], 57:["Präsens","Reflexiv"],
  58:["Modal","Infinitiv"], 59:["Präsens","Relativsatz"], 60:["Präsens","Adjektiv"],
  61:["Präsens"], 62:["Präteritum"], 63:["Modal"],
  64:["Modal","Fragewort"], 65:["Präsens"], 66:["Perfekt"],
  67:["Präsens"], 68:["Präsens","Komparativ"], 69:["Perfekt"], 70:["Präsens","Adjektiv"],
  71:["Fragewort"], 72:["Präsens"], 73:["Infinitivsatz"],
  74:["Fragewort"], 75:["Präsens"], 76:["Fragewort","seit"],
  77:["Präsens","seit"], 78:["Fragewort"], 79:["Fragewort"], 80:["Imperativ"],
  81:["Fragewort","Modal"], 82:["Konjunktiv-II"], 83:["Präsens","Fragewort"],
  84:["Imperativ"], 85:["Präteritum","Adjektiv"], 86:["Konjunktiv-II"],
  87:["Fragewort"], 88:["Modal","Infinitiv"], 89:["Präsens","Negation"], 90:["Perfekt"],
  91:["Präsens","Akkusativ"], 92:["Fragewort","Modal"], 93:["Fragewort"],
  94:["Fragewort"], 95:["Fragewort","Komparativ"], 96:["Präsens"],
  97:["Modal","Nebensatz-wenn"], 98:["Fragewort"], 99:["Fragewort"], 100:["Präsens","Akkusativ"],
  101:["Präsens","Negation"], 102:["Präsens","seit"], 103:["Präsens","Nebensatz-dass"],
  104:["Fragewort","Modal"], 105:["Fragewort","Modal"], 106:["Präsens"],
  107:["Präsens","Dativ"], 108:["Präsens"], 109:["Präsens","Akkusativ"],
  110:["Modal","Fragewort"],
  111:["Fragewort","Komparativ"], 112:["Fragewort"], 113:["Akkusativ"],
  114:["Fragewort"], 115:["Präsens"], 116:["Perfekt","Fragewort"],
  117:["Imperativ","Separierbar"], 118:["Fragewort"], 119:["Fragewort"], 120:["Fragewort","Modal"],
  121:["Fragewort"], 122:["Modal","Infinitiv"], 123:["Präsens"],
  124:["Präsens","Negation"], 125:["Fragewort","Modal"], 126:["Fragewort","Modal"],
  127:["Präsens","Reflexiv"], 128:["Dativ"], 129:["Konjunktiv-II","Modal"],
  130:["Präteritum","Adjektiv"],
  131:["Fragewort","Komparativ"], 132:["Präsens","Dativ"], 133:["Präsens"],
  134:["Präsens","Häufigkeit"], 135:["Fragewort"], 136:["Präsens","Reflexiv"],
  137:["Komparativ","Infinitivsatz"], 138:["Präsens"], 139:["Infinitivsatz","um-zu"],
  140:["Präsens"],
  141:["Präteritum"], 142:["Präteritum","Nebensatz-dass"],
  143:["Präteritum"], 144:["Präteritum"], 145:["Präteritum","als-Satz"],
  146:["Relativsatz","Akkusativ"], 147:["Relativsatz","Nominativ"],
  148:["Relativsatz","mit-Dativ"], 149:["Relativsatz","Nominativ"],
  150:["Relativsatz","Modal"], 151:["Passiv","Präsens"],
  152:["Passiv","Perfekt"], 153:["Passiv","Perfekt"], 154:["Passiv","Modal"],
  155:["Konjunktiv-II","wenn-Satz"], 156:["Konjunktiv-II","würde"],
  157:["Konjunktiv-II","Ratschlag"], 158:["Konjunktiv-II","wäre"],
  159:["Nebensatz-weil"], 160:["Nebensatz-obwohl"],
  161:["Nebensatz-nachdem","Perfekt"], 162:["Nebensatz-damit"],
  163:["Futur-I"], 164:["Futur-I"], 165:["Plusquamperfekt"],
  166:["Präsens","Akkusativ"], 167:["Präsens"],
  168:["Präsens","Negation","Modal"], 169:["Modal","Reflexiv","Infinitiv"],
  170:["Präteritum","Dativ"], 171:["Modal","Reflexiv","Separierbar"],
  172:["Plusquamperfekt","Komparativ"], 173:["Perfekt","Akkusativ"],
  174:["Modal","Fragewort"], 175:["Perfekt","Separierbar"],
  176:["Präsens","Separierbar"], 177:["Präsens","Konjunktion"],
  178:["Modal","Dativ"], 179:["Perfekt","Dativ"],
  180:["Präsens","Separierbar"], 181:["Modal","Separierbar","Infinitivsatz"],
  182:["Präsens","Fragewort"], 183:["Präsens","Separierbar"],
  184:["Perfekt","Separierbar","Akkusativ"], 185:["Modal","Dativ","Akkusativ"],
  186:["Präsens","Akkusativ"], 187:["Präsens","Separierbar"],
  188:["Modal","Fragewort","Reflexiv"], 189:["Präsens","Akkusativ"],
  190:["Modal","Fragewort","Separierbar"], 191:["Perfekt","Konjunktion","Negation"],
  192:["Präsens","Adjektiv"], 193:["Modal","Separierbar","Akkusativ"],
  194:["Präsens","Adjektiv"], 195:["Fragewort","Präsens","Akkusativ"],
};

// ---- Conversation Scenarios ----
const SCENARIOS = {
  hirschsprach_cafe: {
    title: "Language Café Chat",
    goal: "Have a natural conversation about your week, interests, or language learning",
    starter: "Hallo! Schön, dass du wieder da bist. Wie war deine Woche so?",
  },
  shopping: {
    title: "Shopping for Clothes",
    goal: "Find and buy a suitable item of clothing",
    starter: "Guten Tag! Kann ich Ihnen helfen? Suchen Sie etwas Bestimmtes?",
  },
  health: {
    title: "Doctor's Appointment",
    goal: "Describe your symptoms and get advice",
    starter: "Guten Morgen! Nehmen Sie bitte Platz. Was führt Sie heute zu mir?",
  },
  travel: {
    title: "At the Train Station",
    goal: "Buy a train ticket and find out the platform and departure time",
    starter: "Guten Tag! Was kann ich für Sie tun?",
  },
  greetings: {
    title: "Meeting Someone New",
    goal: "Introduce yourself and get to know each other",
    starter: "Oh, hallo! Du bist neu hier, oder? Ich bin Markus — und du?",
  },
  food_drink: {
    title: "At the Restaurant",
    goal: "Order food and drinks and ask about the menu",
    starter: "Guten Abend! Herzlich willkommen. Haben Sie schon gewählt, oder brauchen Sie noch einen Moment?",
  },
  job_search: {
    title: "Job Interview",
    goal: "Answer interview questions and ask about the position",
    starter: "Guten Tag! Schön, Sie kennenzulernen. Erzählen Sie mir bitte kurz etwas über sich.",
  },
  social: {
    title: "Planning a Weekend",
    goal: "Agree on what to do and when to meet",
    starter: "Hey! Hast du am Wochenende schon was vor? Ich hätte da eine Idee!",
  },
  university_life: {
    title: "Study Session",
    goal: "Discuss coursework, exams, or university life with a classmate",
    starter: "Hey, hast du schon für die Klausur nächste Woche gelernt? Ich weiß gar nicht wo ich anfangen soll!",
  },
  phone_digital: {
    title: "Phone & Tech Chat",
    goal: "Handle a real-life phone situation or sort out a tech problem in German",
    starter: "Hallo? Kannst du mich hören? Ich habe hier gerade kaum Netz. Was wolltest du mir sagen?",
  },
  bureaucracy: {
    title: "Government Office",
    goal: "Navigate a visit to a German authority and ask about your paperwork",
    starter: "Guten Tag, nehmen Sie bitte Platz. Womit kann ich Ihnen heute helfen?",
  },
};

// ---- Grammar Topics (for Grammar tab) ----
const GRAMMAR_TOPICS = [
  { id:"Perfekt", title:"Perfekt (Present Perfect)",
    rule:"haben/sein + Partizip II. Used for past events in spoken German.",
    ids:[1,5,8,12,17,34,66,69,90,173,175,179,184,191] },
  { id:"Präteritum", title:"Präteritum (Simple Past)",
    rule:"Common in writing and narratives. Key forms: war, hatte, ging, kam, sprach, sah, stand.",
    ids:[14,62,85,130,141,142,143,144,145,170] },
  { id:"Modal", title:"Modal Verbs (können, müssen, wollen...)",
    rule:"Modal verb in position 2, infinitive goes to the end. Konjunktiv II: könnte, müsste, etc.",
    ids:[2,9,21,25,28,63,64,104,150,168,169,171,174,178,181,185,188,190,193] },
  { id:"Relativsatz", title:"Relative Clauses (Relativsätze)",
    rule:"der/die/das matches the noun's gender. Verb goes to the end of the relative clause.",
    ids:[146,147,148,149,150] },
  { id:"Konjunktiv-II", title:"Konjunktiv II (Conditional)",
    rule:"würde + infinitive for hypotheticals. Polite requests. hätte/wäre for haben/sein.",
    ids:[38,82,86,129,155,156,157,158] },
  { id:"Passiv", title:"Passive Voice (Passiv)",
    rule:"werden + Partizip II. The focus shifts to the action, not the person doing it.",
    ids:[151,152,153,154] },
  { id:"Nebensatz", title:"Subordinate Clauses (weil, obwohl, nachdem, damit, dass, wenn)",
    rule:"The conjunction sends the verb to the very end of the clause. Main clause can come first or second.",
    ids:[15,20,37,39,52,54,97,159,160,161,162] },
  { id:"Futur-I", title:"Future Tense (Futur I)",
    rule:"werden + infinitive. Present tense + time expression also works (very common in spoken German).",
    ids:[163,164] },
  { id:"Plusquamperfekt", title:"Past Perfect (Plusquamperfekt)",
    rule:"hatte/war + Partizip II. Used for events that happened before another past event.",
    ids:[165,172] },
  { id:"Fragewort", title:"Question Words (Fragewörter)",
    rule:"Wer/Was/Wo/Woher/Wann/Wie/Warum — verb comes directly after the question word.",
    ids:[3,23,24,64,74,78,79,81,94,111,119,125,126,131,135,174,182,188,190,195] },
  { id:"Separierbar", title:"Separable Verbs (Trennbare Verben)",
    rule:"The prefix splits off to the end of the main clause. Common prefixes: ab-, an-, auf-, aus-, ein-, mit-, nach-, vor-, zurück-, aus-. In subordinate clauses the verb stays together.",
    ids:[117,171,175,176,180,181,183,184,187,190,193] },
  { id:"Reflexiv", title:"Reflexive Verbs (Reflexivverben)",
    rule:"Use a reflexive pronoun (mich/dich/sich/uns/euch) that refers back to the subject. Common verbs: sich anmelden, sich aufteilen, sich beeilen, sich fühlen, sich vorstellen.",
    ids:[57,127,136,169,171,188] },
];

// ---- State ----
let mode = "listen";
let category = "all";
let shuffle = false;
let autoAdvance = true;
let queue = [];
let queueIndex = 0;
let revealed = false;
let audio = new Audio();
let autoTimer = null;

let sessionGot = 0;
let sessionMissed = 0;
let sessionTotal = 0;

let loop = false;
let repeatCount = parseInt(localStorage.getItem("repeatCount") || "1");
let currentRepeat = 0;

// SRS state
let srsData = {};
let srsSettings = { autoGrade: false };
let practiceNowId = null;
let progressFilter = "due";

// Grammar + Vocab state
let grammarFilter = "all";
let grammarTopicFilter = null;
const vocabCache = {};

// Words mode state
let wordsSRS = {};
let wordsQueue = [];
let wordsIndex = 0;
let wordRevealed = false;
let wordsShuffled = false;
let wordsDirection = "de_en"; // "de_en" | "en_de"
let wordsMode = "flashcard";  // "flashcard" | "mc"
let wordsSessionCorrect = 0;
let wordsSessionTotal = 0;

// Recall voice state
let recallRecognition = null;
let recallIsRecording = false;

// AI state
let aiMode = "translate";
let aiAudio = null;
let recognition = null;
let isRecording = false;
let lastAIResult = null;
let countdownTimer = null;

// Mini-player state
let miniPhrases = [];
let miniIndex = 0;
let miniRevealed = false;

// Chat state
let convoHistory = [];
let convoMessages = [];
let convoScenario = null;
let convoSessionId = null;
let chatRecognition = null;
let chatIsRecording = false;

// ---- DOM refs (player) ----
const tabEls = document.querySelectorAll(".tab");
const categorySelect = document.getElementById("category-select");
const shuffleBtn = document.getElementById("shuffle-btn");
const autoBtn = document.getElementById("auto-btn");
const loopBtn = document.getElementById("loop-btn");
const cardEl = document.getElementById("card");
const categoryBadge = document.getElementById("category-badge");
const germanEl = document.getElementById("german-text");
const englishEl = document.getElementById("english-text");
const revealHint = document.getElementById("reveal-hint");
const playBtn = document.getElementById("play-btn");
const statusText = document.getElementById("status-text");
const phraseNum = document.getElementById("phrase-num");
const progressBar = document.getElementById("progress-bar");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const recallButtons = document.getElementById("recall-buttons");
const gotItBtn = document.getElementById("got-it-btn");
const missedBtn = document.getElementById("missed-btn");
const counterEl = document.getElementById("counter");
const emptyState = document.getElementById("empty-state");
const statsBar = document.getElementById("stats-bar");
const statGot = document.getElementById("stat-got");
const statMissed = document.getElementById("stat-missed");
const statTotal = document.getElementById("stat-total");

// Player-only elements to hide when AI tab is active
const playerEls = ["card", "audio-bar", "recall-buttons", "stats-bar", "nav-buttons", "empty-state"];

// ---- DOM refs (AI panel) ----
const aiPanel = document.getElementById("ai-panel");
const aiSubBtns = document.querySelectorAll(".ai-sub-btn");
const aiCategorySelect = document.getElementById("ai-category-select");
const aiMicBtn = document.getElementById("ai-mic-btn");
const aiLangHint = document.getElementById("ai-lang-hint");
const aiMicStatus = document.getElementById("ai-mic-status");
const aiTextInput = document.getElementById("ai-text-input");
const aiSendBtn = document.getElementById("ai-send-btn");
const aiResultCard = document.getElementById("ai-result-card");
const aiSpinner = document.getElementById("ai-spinner");
const aiResultBody = document.getElementById("ai-result-body");
const aiReplayBtn = document.getElementById("ai-replay-btn");
const aiSaveBtn = document.getElementById("ai-save-btn");
const aiSavedCount = document.getElementById("ai-saved-count");
const aiExportBtn = document.getElementById("ai-export-btn");
const aiClearBtn = document.getElementById("ai-clear-btn");
const aiSavedList = document.getElementById("ai-saved-list");

// ---- SRS Algorithm ----

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function getSrsRecord(id) {
  return srsData[String(id)] || {
    interval: 0, easeFactor: 2.5, dueDate: null,
    lastReviewed: null, totalReviews: 0, totalCorrect: 0, archived: false
  };
}

function isDue(id) {
  const r = getSrsRecord(id);
  return r.dueDate === null || r.dueDate <= todayStr();
}

function getStatus(id) {
  const r = getSrsRecord(id);
  if (r.archived) return "archived";
  if (r.dueDate === null) return "new";
  if (r.interval >= 21) return "mastered";
  if (isDue(id)) return "due";
  return "upcoming";
}

function getNextInterval(interval, ef, correct) {
  if (!correct) return 1;
  if (interval === 0) return 1;
  if (interval === 1) return 3;
  return Math.round(interval * ef);
}

function saveSrsData() {
  localStorage.setItem("srsData", JSON.stringify(srsData));
}

function updateOnGotIt(id) {
  const r = getSrsRecord(id);
  const newEF = Math.min(3.0, Math.max(1.3, r.easeFactor + 0.1));
  const newInterval = getNextInterval(r.interval, newEF, true);
  const due = new Date();
  due.setDate(due.getDate() + newInterval);
  srsData[String(id)] = {
    ...r, interval: newInterval, easeFactor: newEF,
    dueDate: due.toISOString().split("T")[0],
    lastReviewed: todayStr(),
    totalReviews: r.totalReviews + 1,
    totalCorrect: r.totalCorrect + 1
  };
  saveSrsData();
}

function updateOnMissed(id) {
  const r = getSrsRecord(id);
  const newEF = Math.max(1.3, r.easeFactor - 0.2);
  const due = new Date();
  due.setDate(due.getDate() + 1);
  srsData[String(id)] = {
    ...r, interval: 1, easeFactor: newEF,
    dueDate: due.toISOString().split("T")[0],
    lastReviewed: todayStr(),
    totalReviews: r.totalReviews + 1
  };
  saveSrsData();
}

function migrateMissedWeights() {
  const old = JSON.parse(localStorage.getItem("missedWeights") || "null");
  if (!old) return;
  const existing = JSON.parse(localStorage.getItem("srsData") || "{}");
  for (const [idStr, missCount] of Object.entries(old)) {
    if (existing[idStr] || missCount === 0) continue;
    const due = new Date();
    due.setDate(due.getDate() + 1);
    existing[idStr] = {
      interval: 1, easeFactor: Math.max(1.3, 2.5 - missCount * 0.1),
      dueDate: due.toISOString().split("T")[0], lastReviewed: null,
      totalReviews: missCount, totalCorrect: 0, archived: false
    };
  }
  localStorage.setItem("srsData", JSON.stringify(existing));
  localStorage.removeItem("missedWeights");
}

// ---- Voice Matching ----

function normalizeGerman(text) {
  return text.toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

function isVoiceMatch(transcript, phraseGerman) {
  const aWords = new Set(normalizeGerman(transcript).split(" ").filter(Boolean));
  const bWords = new Set(normalizeGerman(phraseGerman).split(" ").filter(Boolean));
  if (!aWords.size) return false;
  let intersection = 0;
  for (const w of aWords) { if (bWords.has(w)) intersection++; }
  const union = new Set([...aWords, ...bWords]).size;
  return (intersection / union) >= 0.75;
}

// ---- Init ----
function buildCategorySelect() {
  categorySelect.innerHTML = "";
  for (const [val, label] of Object.entries(CATEGORIES)) {
    const opt = document.createElement("option");
    opt.value = val;
    opt.textContent = label;
    categorySelect.appendChild(opt);
  }
}

function buildQueue() {
  let source = category === "all" ? PHRASES : PHRASES.filter(p => p.category === category);

  source = source.filter(p => !getSrsRecord(p.id).archived);

  if (mode === "listen" || mode === "shadow") {
    source = source.filter(p => p.audio);
  }

  if (grammarFilter !== "all") {
    source = source.filter(p => (GRAMMAR_TAGS[p.id] || []).some(t => t.startsWith(grammarFilter)));
  }

  if (mode === "recall") {
    const statusOrder = { new: 0, due: 0, upcoming: 1, mastered: 2 };
    source = [...source].sort((a, b) => {
      const sa = statusOrder[getStatus(a.id)] ?? 1;
      const sb = statusOrder[getStatus(b.id)] ?? 1;
      if (sa !== sb) return sa - sb;
      const ra = getSrsRecord(a.id);
      const rb = getSrsRecord(b.id);
      if (ra.dueDate && rb.dueDate) return ra.dueDate.localeCompare(rb.dueDate);
      return 0;
    });
    if (practiceNowId !== null) {
      const idx = source.findIndex(p => p.id === practiceNowId);
      if (idx > 0) { const [item] = source.splice(idx, 1); source.unshift(item); }
      practiceNowId = null;
    }
  }

  if (shuffle && mode !== "recall") source = [...source].sort(() => Math.random() - 0.5);
  queue = source;
  queueIndex = 0;
}

function init() {
  migrateMissedWeights();
  srsData = JSON.parse(localStorage.getItem("srsData") || "{}");
  srsSettings = JSON.parse(localStorage.getItem("srsSettings") || '{"autoGrade":false}');

  if (typeof PHRASES === "undefined" || PHRASES.length === 0) {
    emptyState.style.display = "block";
  }
  const repeatBtn = document.getElementById("repeat-btn");
  repeatBtn.textContent = repeatCount > 1 ? `Repeat: ${repeatCount}x` : "Repeat";
  repeatBtn.classList.toggle("active", repeatCount > 1);

  buildCategorySelect();
  buildQueue();
  renderCard();
  setupEvents();
  initAI();
  setupRecallSpeech();
  initWordsPanel();
}

// ---- Render (player) ----
function renderCard() {
  if (mode === "ai" || mode === "progress" || mode === "vocab" || mode === "grammar" || mode === "words") return;

  if (!queue.length) {
    emptyState.style.display = "block";
    cardEl.style.display = "none";
    return;
  }
  emptyState.style.display = "none";
  cardEl.style.display = "block";

  const p = queue[queueIndex];
  categoryBadge.textContent = CATEGORIES[p.category] || p.category;
  counterEl.textContent = `${queueIndex + 1} / ${queue.length}`;
  phraseNum.textContent = `#${p.id} - ${CATEGORIES[p.category] || p.category}`;
  progressBar.style.width = `${((queueIndex + 1) / queue.length) * 100}%`;

  revealed = false;
  currentRepeat = 0;
  clearAutoTimer();
  audio.pause();

  // Hide recall-specific elements by default; recall branch shows them
  document.getElementById("recall-srs-bar").style.display = "none";
  document.getElementById("recall-voice-area").style.display = "none";
  document.getElementById("srs-status-badge").style.display = "none";
  if (recallIsRecording) recallRecognition.stop();
  document.getElementById("recall-transcript").textContent = "";

  if (mode === "listen") {
    germanEl.classList.remove("hidden");
    englishEl.classList.remove("hidden");
    revealHint.style.display = "none";
    recallButtons.classList.remove("visible");
    statsBar.style.display = "none";
    statusText.textContent = "Playing...";
    loadAndPlay(p);
  } else if (mode === "shadow") {
    germanEl.classList.remove("hidden");
    englishEl.classList.add("hidden");
    revealHint.style.display = "block";
    revealHint.textContent = "Tap card to see translation";
    recallButtons.classList.remove("visible");
    statsBar.style.display = "none";
    statusText.textContent = "Listen and repeat aloud";
    loadAndPlay(p);
  } else if (mode === "recall") {
    germanEl.classList.add("hidden");
    englishEl.classList.remove("hidden");
    revealHint.style.display = "block";
    revealHint.textContent = "Tap mic or card to reveal";
    recallButtons.classList.remove("visible");
    statsBar.style.display = "flex";
    statGot.textContent = sessionGot;
    statMissed.textContent = sessionMissed;
    statTotal.textContent = sessionTotal;
    statusText.textContent = "Produce German from memory";
    document.getElementById("recall-srs-bar").style.display = "flex";
    document.getElementById("recall-voice-area").style.display = "flex";
    const st = getStatus(p.id);
    const badge = document.getElementById("srs-status-badge");
    badge.style.display = "inline-block";
    badge.className = `srs-badge srs-${st}`;
    badge.textContent = st;
    renderRecallModeHeader();
  }

  // Grammar tag chips
  const tagContainer = document.getElementById("grammar-tag-container");
  const tags = GRAMMAR_TAGS[p.id] || [];
  tagContainer.innerHTML = tags.slice(0, 3).map(t =>
    `<span class="grammar-chip" onclick="openGrammarTopic('${t}')">${t}</span>`
  ).join("");
  tagContainer.style.display = tags.length ? "flex" : "none";

  // Tappable words
  germanEl.innerHTML = p.german.split(/(\s+)/).map(tok =>
    /\s+/.test(tok) ? tok :
    `<span class="tap-word" data-word="${tok.replace(/[.,!?;:]/g, "")}">${tok}</span>`
  ).join("");
  englishEl.textContent = p.english;
}

function loadAndPlay(p) {
  if (!p.audio) {
    statusText.textContent = "No audio yet - run generate_audio.py";
    return;
  }
  audio.src = p.audio;
  audio.play().catch(() => { statusText.textContent = "Tap play to start"; });
}

// ---- Auto-advance ----
function clearAutoTimer() {
  if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
}

function scheduleAutoAdvance(delayMs) {
  if (!autoAdvance || mode === "recall") return;
  autoTimer = setTimeout(() => advance(1), delayMs);
}

// ---- Navigation ----
function advance(delta) {
  clearAutoTimer();
  const next = queueIndex + delta;
  if (next >= queue.length) {
    queueIndex = loop ? 0 : queue.length - 1;
  } else {
    queueIndex = Math.max(0, next);
  }
  renderCard();
}

// ---- Show/hide panels when switching tabs ----
function showPlayerPanel() {
  document.getElementById("controls-bar").style.display = "flex";
  aiPanel.style.display = "none";
  document.getElementById("progress-panel").style.display = "none";
  document.getElementById("vocab-panel").style.display = "none";
  document.getElementById("grammar-panel").style.display = "none";
  document.getElementById("words-panel").style.display = "none";
  playerEls.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "";
  });
}

function showAIPanel() {
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
  document.getElementById("progress-panel").style.display = "none";
  document.getElementById("vocab-panel").style.display = "none";
  document.getElementById("grammar-panel").style.display = "none";
  document.getElementById("words-panel").style.display = "none";
  aiPanel.style.display = "flex";
  renderAISavedList();
}

// ---- Events (player) ----
function setupEvents() {
  tabEls.forEach(tab => {
    tab.addEventListener("click", () => {
      const newMode = tab.dataset.mode;
      tabEls.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      if (newMode === "ai") {
        mode = "ai";
        showAIPanel();
      } else if (newMode === "progress") {
        mode = "progress";
        showProgressPanel();
      } else if (newMode === "vocab") {
        mode = "vocab";
        showVocabPanel();
      } else if (newMode === "grammar") {
        mode = "grammar";
        showGrammarPanel(null);
      } else if (newMode === "words") {
        mode = "words";
        showWordsPanel();
      } else {
        mode = newMode;
        showPlayerPanel();
        if (mode === "recall") { sessionGot = 0; sessionMissed = 0; sessionTotal = 0; }
        buildQueue();
        renderCard();
      }
    });
  });

  categorySelect.addEventListener("change", () => {
    category = categorySelect.value;
    buildQueue();
    renderCard();
  });

  document.getElementById("grammar-filter").addEventListener("change", (e) => {
    grammarFilter = e.target.value;
    buildQueue();
    renderCard();
  });

  shuffleBtn.addEventListener("click", () => {
    shuffle = !shuffle;
    shuffleBtn.classList.toggle("active", shuffle);
    buildQueue();
    renderCard();
  });

  autoBtn.addEventListener("click", () => {
    autoAdvance = !autoAdvance;
    autoBtn.classList.toggle("active", autoAdvance);
    autoBtn.textContent = autoAdvance ? "Auto ✓" : "Auto";
    if (!autoAdvance) clearAutoTimer();
  });

  loopBtn.addEventListener("click", () => {
    loop = !loop;
    loopBtn.classList.toggle("active", loop);
    loopBtn.textContent = loop ? "Loop ✓" : "Loop";
  });

  document.getElementById("repeat-btn").addEventListener("click", () => {
    repeatCount = repeatCount >= 3 ? 1 : repeatCount + 1;
    localStorage.setItem("repeatCount", String(repeatCount));
    const btn = document.getElementById("repeat-btn");
    btn.textContent = repeatCount > 1 ? `Repeat: ${repeatCount}x` : "Repeat";
    btn.classList.toggle("active", repeatCount > 1);
  });

  playBtn.addEventListener("click", () => {
    const p = queue[queueIndex];
    if (!p) return;
    if (audio.paused) {
      const audioFile = p.audio ? p.audio.split('/').pop() : '';
      if (!audio.src || audio.src === window.location.href || !audio.src.endsWith(audioFile)) loadAndPlay(p);
      else audio.play();
    } else {
      audio.pause();
      clearAutoTimer();
    }
  });

  audio.addEventListener("play", () => { statusText.textContent = "Playing..."; });
  audio.addEventListener("pause", () => { statusText.textContent = "Paused"; });
  audio.addEventListener("ended", () => {
    currentRepeat++;
    if (currentRepeat < repeatCount) {
      if (mode === "listen") {
        statusText.textContent = `Again (${currentRepeat + 1}/${repeatCount})`;
        autoTimer = setTimeout(() => audio.play().catch(() => {}), 1500);
      } else if (mode === "shadow") {
        statusText.textContent = `Repeat aloud! (${currentRepeat}/${repeatCount})`;
        autoTimer = setTimeout(() => audio.play().catch(() => {}), 4000);
      }
    } else {
      currentRepeat = 0;
      statusText.textContent = "Done";
      if (mode === "listen") scheduleAutoAdvance(3000);
      else if (mode === "shadow") { statusText.textContent = "Done"; scheduleAutoAdvance(5000); }
    }
  });
  audio.addEventListener("error", () => { statusText.textContent = "Audio error"; });

  cardEl.addEventListener("click", (e) => {
    if (e.target.closest("#audio-bar") || e.target.closest("#recall-buttons")) return;
    const p = queue[queueIndex];
    if (!p || revealed) return;
    if (mode === "shadow") {
      revealed = true;
      englishEl.classList.remove("hidden");
      revealHint.style.display = "none";
    } else if (mode === "recall") {
      revealRecallCard();
    }
  });

  gotItBtn.addEventListener("click", () => {
    const p = queue[queueIndex];
    sessionGot++; sessionTotal++;
    updateOnGotIt(p.id);
    renderRecallModeHeader();
    advance(1);
  });

  missedBtn.addEventListener("click", () => {
    const p = queue[queueIndex];
    sessionMissed++; sessionTotal++;
    updateOnMissed(p.id);
    renderRecallModeHeader();
    advance(1);
  });

  prevBtn.addEventListener("click", () => advance(-1));
  nextBtn.addEventListener("click", () => advance(1));

  document.getElementById("recall-mic-btn").addEventListener("click", () => {
    if (!recallRecognition) return;
    if (recallIsRecording) { recallRecognition.stop(); }
    else { document.getElementById("recall-transcript").textContent = ""; recallRecognition.start(); }
  });

  document.getElementById("recall-autograde-toggle").addEventListener("click", () => {
    srsSettings.autoGrade = !srsSettings.autoGrade;
    localStorage.setItem("srsSettings", JSON.stringify(srsSettings));
    renderRecallModeHeader();
  });

  document.querySelectorAll(".prog-filter").forEach(btn => {
    btn.addEventListener("click", () => { progressFilter = btn.dataset.filter; renderProgressTab(); });
  });

  // Tappable word vocab lookup
  germanEl.addEventListener("click", (e) => {
    const span = e.target.closest(".tap-word");
    if (!span) return;
    const word = span.dataset.word;
    if (word && word.length > 1) openVocabPopup(word);
  });

  // Vocab modal close
  document.getElementById("vocab-modal-close").addEventListener("click", () => {
    document.getElementById("vocab-modal").style.display = "none";
  });
  document.getElementById("vocab-modal").addEventListener("click", (e) => {
    if (e.target === document.getElementById("vocab-modal")) {
      document.getElementById("vocab-modal").style.display = "none";
    }
  });

  // Vocab panel search/filter
  document.getElementById("vocab-panel-search").addEventListener("input", (e) => {
    renderVocabPanel(e.target.value);
  });

  document.addEventListener("keydown", (e) => {
    if (mode === "ai" || mode === "progress" || mode === "vocab" || mode === "grammar" || mode === "words") return;
    if (e.key === "Escape") { document.getElementById("vocab-modal").style.display = "none"; return; }
    if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); advance(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); advance(-1); }
    if (e.key === "p" || e.key === "P") playBtn.click();
    if (e.key === "r" || e.key === "R") cardEl.click();
    if (e.key === "g" || e.key === "G") gotItBtn.click();
    if (e.key === "m" || e.key === "M") missedBtn.click();
  });
}

// ---- AI Chat ----

function initAI() {
  aiCategorySelect.innerHTML = "";
  for (const [val, label] of Object.entries(CATEGORIES)) {
    if (val === "all") continue;
    const opt = document.createElement("option");
    opt.value = val;
    opt.textContent = label;
    if (val === "hirschsprach_cafe") opt.selected = true;
    aiCategorySelect.appendChild(opt);
  }
  renderAISavedList();
  setupAIEvents();
  setupSpeechRecognition();
  initChat();
}

function setupAIEvents() {
  aiSubBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      aiMode = btn.dataset.aimode;
      aiSubBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      if (aiMode === "chat") {
        document.getElementById("ai-tc-panel").style.display = "none";
        document.getElementById("ai-chat-panel").style.display = "flex";
      } else {
        document.getElementById("ai-tc-panel").style.display = "flex";
        document.getElementById("ai-chat-panel").style.display = "none";
        aiLangHint.textContent = aiMode === "translate" ? "Speak in English" : "Sprechen Sie Deutsch";
        document.getElementById("ai-category-row").style.display = aiMode === "translate" ? "flex" : "none";
        clearAIResult();
        if (recognition) recognition.lang = aiMode === "translate" ? "en-US" : "de-DE";
      }
    });
  });

  aiMicBtn.addEventListener("click", toggleRecording);
  aiSendBtn.addEventListener("click", () => { cancelCountdown(); sendToAI(aiTextInput.value.trim()); });
  aiTextInput.addEventListener("keydown", e => { if (e.key === "Enter") { cancelCountdown(); sendToAI(aiTextInput.value.trim()); } });
  aiTextInput.addEventListener("input", () => { if (countdownTimer) { cancelCountdown(); aiMicStatus.textContent = "Tap Send or mic"; } });
  aiReplayBtn.addEventListener("click", () => { if (lastAIResult?.audio_base64) playBase64Audio(lastAIResult.audio_base64); });
  aiSaveBtn.addEventListener("click", saveCurrentPhrase);
  aiExportBtn.addEventListener("click", exportAIPhrases);
  aiClearBtn.addEventListener("click", () => {
    if (confirm("Clear all saved AI phrases?")) {
      localStorage.removeItem("ai_phrases");
      renderAISavedList();
    }
  });

  document.getElementById("mini-practice-btn").addEventListener("click", openMiniPlayer);
  document.getElementById("mini-close-btn").addEventListener("click", closeMiniPlayer);
  document.getElementById("mini-shuffle-btn").addEventListener("click", () => {
    miniPhrases = [...miniPhrases].sort(() => Math.random() - 0.5);
    miniIndex = 0;
    renderMiniCard();
  });
  document.getElementById("mini-card").addEventListener("click", () => {
    if (!miniRevealed) miniRevealCard();
  });
  document.getElementById("mini-got-it-btn").addEventListener("click", () => miniAdvance());
  document.getElementById("mini-skip-btn").addEventListener("click", () => miniAdvance());
  document.getElementById("mini-replay-btn").addEventListener("click", () => {
    const p = miniPhrases[miniIndex];
    if (p?.audio_base64) playBase64Audio(p.audio_base64);
  });
}

function setupSpeechRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    aiMicBtn.style.display = "none";
    aiLangHint.style.display = "none";
    aiMicStatus.textContent = "Mic not supported in this browser - use text input below";
    return;
  }
  recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onstart = () => {
    isRecording = true;
    aiMicBtn.classList.add("recording");
    aiMicStatus.textContent = "Listening...";
  };
  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    aiTextInput.value = text;
    startCountdown(text);
  };
  recognition.onerror = (e) => {
    aiMicStatus.textContent = `Could not hear you (${e.error}). Try typing instead.`;
    stopRecording();
  };
  recognition.onend = () => stopRecording();
}

function cancelCountdown() {
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
}

function startCountdown(text) {
  cancelCountdown();
  let count = 3;
  aiMicStatus.textContent = `Sending in ${count}… (tap Send to go now)`;
  countdownTimer = setInterval(() => {
    count--;
    if (count > 0) {
      aiMicStatus.textContent = `Sending in ${count}… (tap Send to go now)`;
    } else {
      cancelCountdown();
      sendToAI(aiTextInput.value.trim() || text);
    }
  }, 1000);
}

function toggleRecording() {
  if (!recognition) return;
  if (isRecording) { recognition.stop(); }
  else {
    recognition.lang = aiMode === "translate" ? "en-US" : "de-DE";
    recognition.start();
  }
}

function stopRecording() {
  isRecording = false;
  aiMicBtn.classList.remove("recording");
  if (!lastAIResult) aiMicStatus.textContent = "Tap mic to start";
}

async function sendToAI(text) {
  if (!text) return;
  cancelCountdown();
  clearAIResult();
  aiResultCard.style.display = "flex";
  aiSpinner.style.display = "block";
  aiMicStatus.textContent = "Processing...";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: aiMode, text }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Server error");

    lastAIResult = result;
    aiSpinner.style.display = "none";
    renderAIResult(result);
    playBase64Audio(result.audio_base64);
    aiMicStatus.textContent = "Done";
    aiTextInput.value = "";
  } catch (err) {
    aiSpinner.style.display = "none";
    aiResultBody.innerHTML = `<span style="color:var(--red)">Error: ${err.message}</span>`;
    aiMicStatus.textContent = "Error - try again";
  }
}

function renderAIResult(result) {
  if (aiMode === "translate") {
    if (result.category && aiCategorySelect.querySelector(`option[value="${result.category}"]`)) {
      aiCategorySelect.value = result.category;
    }
    const islandLabel = CATEGORIES[result.category];
    const hint = islandLabel ? `<div class="ai-category-hint">Suggested island: ${islandLabel}</div>` : "";
    aiResultBody.innerHTML = `
      <div class="ai-english">You: "${result.english}"</div>
      <div class="ai-german">${result.german}</div>
      ${hint}
    `;
  } else {
    const badge = result.is_correct ? `<div class="ai-correct-badge">✓ Perfect German!</div>` : "";
    aiResultBody.innerHTML = `
      <div class="ai-original">You said: "${result.original}"</div>
      ${badge}
      <div class="ai-corrected">${result.corrected}</div>
      <div class="ai-explanation">${result.explanation}</div>
    `;
  }
}

function playBase64Audio(base64) {
  if (!base64) return;
  if (aiAudio) aiAudio.pause();
  aiAudio = new Audio(`data:audio/mp3;base64,${base64}`);
  aiAudio.play().catch(() => {});
}

function clearAIResult() {
  lastAIResult = null;
  aiResultCard.style.display = "none";
  aiSpinner.style.display = "none";
  aiResultBody.innerHTML = "";
}

function saveCurrentPhrase() {
  if (!lastAIResult) return;
  const german = aiMode === "translate" ? lastAIResult.german : lastAIResult.corrected;
  const english = aiMode === "translate" ? lastAIResult.english : lastAIResult.original;
  const cat = aiCategorySelect.value;
  const audio_base64 = lastAIResult.audio_base64 || null;

  const saved = JSON.parse(localStorage.getItem("ai_phrases") || "[]");
  saved.push({ german, english, category: cat, audio_base64, created_date: new Date().toISOString().split("T")[0] });
  localStorage.setItem("ai_phrases", JSON.stringify(saved));

  aiSaveBtn.textContent = "Saved!";
  setTimeout(() => { aiSaveBtn.textContent = "+ Save phrase"; }, 1500);
  renderAISavedList();
}

function renderAISavedList() {
  const saved = JSON.parse(localStorage.getItem("ai_phrases") || "[]");
  aiSavedCount.textContent = `Saved: ${saved.length}`;
  if (!saved.length) { aiSavedList.innerHTML = ""; return; }
  aiSavedList.innerHTML = [...saved].reverse().map((p, revIdx) => {
    const idx = saved.length - 1 - revIdx;
    return `
      <div class="ai-saved-item">
        <div class="saved-german">${p.german}</div>
        <div class="saved-english">${p.english}</div>
        <div class="ai-saved-meta">
          <span class="saved-category">${CATEGORIES[p.category] || p.category}</span>
          ${p.audio_base64 ? `<button class="ai-saved-play-btn" onclick="playAISavedPhrase(${idx})">▶ Play</button>` : ""}
        </div>
      </div>
    `;
  }).join("");
}

function playAISavedPhrase(idx) {
  const saved = JSON.parse(localStorage.getItem("ai_phrases") || "[]");
  const p = saved[idx];
  if (p?.audio_base64) playBase64Audio(p.audio_base64);
}

function exportAIPhrases() {
  const saved = JSON.parse(localStorage.getItem("ai_phrases") || "[]");
  if (!saved.length) { alert("No saved phrases to export yet."); return; }
  const blob = new Blob([JSON.stringify(saved, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `ai_phrases_${new Date().toISOString().split("T")[0]}.json`;
  a.click();
}

// ---- Recall Voice ----

function setupRecallSpeech() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { document.getElementById("recall-mic-btn").style.display = "none"; return; }
  recallRecognition = new SR();
  recallRecognition.continuous = false;
  recallRecognition.interimResults = false;
  recallRecognition.lang = "de-DE";
  recallRecognition.onstart = () => {
    recallIsRecording = true;
    document.getElementById("recall-mic-btn").classList.add("recording");
    document.getElementById("recall-transcript").textContent = "Listening...";
  };
  recallRecognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    document.getElementById("recall-transcript").textContent = `"${text}"`;
    handleRecallVoice(text);
  };
  recallRecognition.onerror = (e) => {
    document.getElementById("recall-transcript").textContent = `Error: ${e.error}`;
    recallIsRecording = false;
    document.getElementById("recall-mic-btn").classList.remove("recording");
  };
  recallRecognition.onend = () => {
    recallIsRecording = false;
    document.getElementById("recall-mic-btn").classList.remove("recording");
  };
}

function handleRecallVoice(transcript) {
  const p = queue[queueIndex];
  if (!p) return;
  revealRecallCard();
  if (srsSettings.autoGrade && isVoiceMatch(transcript, p.german)) {
    setTimeout(() => gotItBtn.click(), 700);
  }
}

function revealRecallCard() {
  if (revealed) return;
  revealed = true;
  germanEl.classList.remove("hidden");
  revealHint.style.display = "none";
  recallButtons.classList.add("visible");
  loadAndPlay(queue[queueIndex]);
}

function renderRecallModeHeader() {
  const dueCount = PHRASES.filter(p => {
    const r = getSrsRecord(p.id);
    return !r.archived && isDue(p.id);
  }).length;
  document.getElementById("recall-due-count").textContent =
    dueCount > 0 ? `${dueCount} due today` : "All caught up!";
  const btn = document.getElementById("recall-autograde-toggle");
  btn.textContent = `Auto-grade: ${srsSettings.autoGrade ? "ON" : "OFF"}`;
  btn.classList.toggle("active", srsSettings.autoGrade);
}

// ---- Progress Tab ----

function showProgressPanel() {
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
  aiPanel.style.display = "none";
  document.getElementById("progress-panel").style.display = "flex";
  renderProgressTab();
}

function renderProgressTab() {
  const counts = { new: 0, due: 0, upcoming: 0, mastered: 0, archived: 0 };
  for (const p of PHRASES) { const s = getStatus(p.id); if (counts[s] !== undefined) counts[s]++; }
  document.getElementById("prog-due-val").textContent = counts.due + counts.new;
  document.getElementById("prog-upcoming-val").textContent = counts.upcoming;
  document.getElementById("prog-mastered-val").textContent = counts.mastered;
  document.getElementById("prog-new-val").textContent = counts.new;

  document.querySelectorAll(".prog-filter").forEach(b => b.classList.toggle("active", b.dataset.filter === progressFilter));

  let filtered = PHRASES.filter(p => {
    if (progressFilter === "all") return true;
    if (progressFilter === "due") return ["due", "new"].includes(getStatus(p.id));
    return getStatus(p.id) === progressFilter;
  });
  if (progressFilter === "upcoming") {
    filtered.sort((a, b) => (getSrsRecord(a.id).dueDate || "").localeCompare(getSrsRecord(b.id).dueDate || ""));
  }

  const list = document.getElementById("progress-list");
  if (!filtered.length) { list.innerHTML = `<div class="prog-empty">Nothing here yet.</div>`; return; }
  list.innerHTML = filtered.map(p => {
    const r = getSrsRecord(p.id);
    const st = getStatus(p.id);
    const dueLabel = r.dueDate ? (isDue(p.id) ? "Due now" : `Due ${r.dueDate}`) : "Never reviewed";
    return `
      <div class="prog-item">
        <div class="prog-item-top">
          <span class="srs-badge srs-${st}">${st}</span>
          <span class="prog-interval">Interval: ${r.interval}d &middot; EF: ${r.easeFactor.toFixed(1)}</span>
        </div>
        <div class="prog-german">${p.german}</div>
        <div class="prog-english">${p.english}</div>
        <div class="prog-meta">${dueLabel} &middot; ${r.totalCorrect}/${r.totalReviews} correct</div>
        <div class="prog-actions">
          <button class="prog-btn" onclick="practiceNow(${p.id})">Practice Now</button>
          <button class="prog-btn" onclick="resetSrs(${p.id})">Reset</button>
          ${r.archived
            ? `<button class="prog-btn warn" onclick="restorePhrase(${p.id})">Restore</button>`
            : `<button class="prog-btn warn" onclick="archivePhrase(${p.id})">Archive</button>`}
        </div>
      </div>`;
  }).join("");
}

function practiceNow(phraseId) {
  practiceNowId = phraseId;
  mode = "recall";
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.mode === "recall"));
  sessionGot = 0; sessionMissed = 0; sessionTotal = 0;
  showPlayerPanel();
  buildQueue();
  renderCard();
}

function resetSrs(phraseId) {
  if (!confirm("Reset SRS data for this phrase?")) return;
  delete srsData[String(phraseId)];
  saveSrsData();
  renderProgressTab();
}

function archivePhrase(phraseId) {
  srsData[String(phraseId)] = { ...getSrsRecord(phraseId), archived: true };
  saveSrsData();
  renderProgressTab();
}

function restorePhrase(phraseId) {
  srsData[String(phraseId)] = { ...getSrsRecord(phraseId), archived: false };
  saveSrsData();
  renderProgressTab();
}

// ---- Vocab Popup ----

async function openVocabPopup(word) {
  const modal = document.getElementById("vocab-modal");
  modal.style.display = "flex";
  document.getElementById("vocab-spinner").style.display = "block";
  document.getElementById("vocab-result").style.display = "none";
  document.getElementById("vocab-spinner").textContent = "Looking up...";

  if (vocabCache[word]) {
    renderVocabResult(vocabCache[word]);
    return;
  }
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "vocab", text: word }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Server error");
    vocabCache[word] = data;
    renderVocabResult(data);
  } catch (err) {
    document.getElementById("vocab-spinner").textContent = `Error: ${err.message}`;
  }
}

function renderVocabResult(data) {
  document.getElementById("vocab-spinner").style.display = "none";
  document.getElementById("vocab-result").style.display = "block";
  const articleHtml = data.article && data.article !== "none"
    ? `<span class="vocab-article">${data.article}</span> ` : "";
  document.getElementById("vocab-word-main").innerHTML =
    `${articleHtml}<span class="vocab-word-text">${data.word || ""}</span>`;
  document.getElementById("vocab-pos-badge").textContent = data.pos || "";
  document.getElementById("vocab-def").textContent = data.definition || "";
  document.getElementById("vocab-example-text").textContent = data.example || "";
  document.getElementById("vocab-tip-text").textContent = data.tip || "";
}

// ---- Vocab Tab ----

const STOP_WORDS = new Set([
  "ich","du","er","sie","es","wir","ihr","sich","mir","mich","dir","dich","uns","euch",
  "der","die","das","ein","eine","einen","einem","einer","eines","den","dem","des",
  "und","oder","aber","auch","denn","wenn","weil","dass","ob","als","wie","damit",
  "ist","bin","bist","sind","war","waren","sein","haben","hat","habe","hatte","hatten",
  "nicht","kein","keine","keinen","so","noch","schon","sehr","nur","hier","da","dort",
  "an","auf","in","von","zu","aus","mit","bei","nach","vor","über","unter","für","gegen",
  "bis","durch","ohne","um","am","im","ins","zum","zur","beim","vom","was","wer","wo",
  "wann","wie","warum","woher","wohin","welche","welchen","welchem","welches","mal"
]);

function extractVocabWords() {
  const map = new Map();
  for (const p of PHRASES) {
    const tokens = p.german.replace(/[.,!?;:]/g, "").split(/\s+/).filter(Boolean);
    for (const tok of tokens) {
      const key = tok.toLowerCase();
      if (key.length < 3 || STOP_WORDS.has(key)) continue;
      if (!map.has(key)) map.set(key, { display: tok, count: 0, phraseIds: [] });
      const entry = map.get(key);
      entry.count++;
      if (!entry.phraseIds.includes(p.id)) entry.phraseIds.push(p.id);
    }
  }
  return [...map.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .map(([key, val]) => ({ key, ...val }));
}

function renderVocabPanel(search = "") {
  const words = extractVocabWords();
  const filtered = search
    ? words.filter(w => w.key.includes(search.toLowerCase()))
    : words;
  const list = document.getElementById("vocab-panel-list");
  if (!filtered.length) { list.innerHTML = `<div class="prog-empty">No words found.</div>`; return; }
  list.innerHTML = filtered.slice(0, 100).map(w => `
    <div class="vocab-item" onclick="openVocabPopup('${w.display.replace(/'/g, "\\'")}')">
      <span class="vocab-item-word">${w.display}</span>
      <span class="vocab-item-count">${w.count}×</span>
    </div>
  `).join("");
}

function showVocabPanel() {
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
  aiPanel.style.display = "none";
  document.getElementById("progress-panel").style.display = "none";
  document.getElementById("grammar-panel").style.display = "none";
  document.getElementById("vocab-panel").style.display = "flex";
  document.getElementById("vocab-panel-search").value = "";
  renderVocabPanel();
}

// ---- Grammar Tab ----

function showGrammarPanel(filterTag = null) {
  grammarTopicFilter = filterTag;
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
  aiPanel.style.display = "none";
  document.getElementById("progress-panel").style.display = "none";
  document.getElementById("vocab-panel").style.display = "none";
  document.getElementById("grammar-panel").style.display = "flex";
  renderGrammarTab(filterTag);
}

function renderGrammarTab(filterTag = null) {
  const topics = filterTag
    ? GRAMMAR_TOPICS.filter(t => filterTag.startsWith(t.id) || t.id === filterTag)
    : GRAMMAR_TOPICS;
  const list = document.getElementById("grammar-list");
  if (!topics.length) {
    list.innerHTML = `<div class="prog-empty">No grammar topic found for "${filterTag}".</div>`;
    return;
  }
  list.innerHTML = topics.map(topic => {
    const examples = topic.ids.map(id => PHRASES.find(p => p.id === id)).filter(Boolean);
    return `
      <div class="grammar-topic">
        <div class="gt-header">${topic.title}</div>
        <div class="gt-rule">${topic.rule}</div>
        <div class="gt-examples">
          ${examples.slice(0, 4).map(p => `
            <div class="gt-example" onclick="practiceNow(${p.id})">
              <div class="gt-german">${p.german}</div>
              <div class="gt-english">${p.english}</div>
            </div>`).join("")}
        </div>
        <button class="prog-btn gt-explain-btn" data-topic-id="${topic.id}" data-topic-title="${topic.title}">Ask AI to explain deeper ›</button>
      </div>`;
  }).join("");

  document.querySelectorAll(".gt-explain-btn").forEach(btn => {
    btn.addEventListener("click", () => explainGrammar(btn.dataset.topicId, btn.dataset.topicTitle, btn));
  });
}

async function explainGrammar(topicId, topicTitle, btn) {
  btn.textContent = "Loading...";
  btn.disabled = true;
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "grammar", text: topicTitle }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Server error");
    const expDiv = document.createElement("div");
    expDiv.className = "gt-ai-explanation";
    expDiv.textContent = data.explanation || "No explanation returned.";
    btn.parentElement.insertBefore(expDiv, btn);
    btn.remove();
  } catch (err) {
    btn.textContent = "Error - try again";
    btn.disabled = false;
  }
}

function openGrammarTopic(tagId) {
  mode = "grammar";
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.mode === "grammar"));
  showGrammarPanel(tagId);
}

// ---- Conversation Chat ----

function initChat() {
  setupChatSpeech();
  startConversation(null);

  document.getElementById("chat-scenario-select").addEventListener("change", (e) => {
    startConversation(e.target.value || null);
  });
  document.getElementById("chat-new-btn").addEventListener("click", () => {
    startConversation(document.getElementById("chat-scenario-select").value || null);
  });
  document.getElementById("chat-history-btn").addEventListener("click", showChatHistory);
  document.getElementById("chat-history-close").addEventListener("click", () => {
    document.getElementById("chat-history-panel").style.display = "none";
  });
  document.getElementById("chat-hint-btn").addEventListener("click", requestHint);
  document.getElementById("chat-send-btn").addEventListener("click", () => {
    const text = document.getElementById("chat-input").value.trim();
    if (text) sendConvoMessage(text);
  });
  document.getElementById("chat-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const text = document.getElementById("chat-input").value.trim();
      if (text) sendConvoMessage(text);
    }
  });
  document.getElementById("chat-mic-btn").addEventListener("click", () => {
    if (!chatRecognition) return;
    if (chatIsRecording) { chatRecognition.stop(); }
    else { chatRecognition.start(); }
  });
}

function setupChatSpeech() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { document.getElementById("chat-mic-btn").style.display = "none"; return; }
  chatRecognition = new SR();
  chatRecognition.continuous = false;
  chatRecognition.interimResults = false;
  chatRecognition.lang = "de-DE";
  chatRecognition.onstart = () => {
    chatIsRecording = true;
    document.getElementById("chat-mic-btn").classList.add("recording");
  };
  chatRecognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    document.getElementById("chat-input").value = text;
    sendConvoMessage(text);
  };
  chatRecognition.onerror = () => {
    chatIsRecording = false;
    document.getElementById("chat-mic-btn").classList.remove("recording");
  };
  chatRecognition.onend = () => {
    chatIsRecording = false;
    document.getElementById("chat-mic-btn").classList.remove("recording");
  };
}

function startConversation(scenarioKey) {
  convoScenario = scenarioKey || null;
  convoHistory = [];
  convoMessages = [];
  convoSessionId = Date.now().toString();
  document.getElementById("chat-hint-area").style.display = "none";
  document.getElementById("chat-history-panel").style.display = "none";

  if (convoScenario && SCENARIOS[convoScenario]) {
    const s = SCENARIOS[convoScenario];
    convoMessages.push({ role: "assistant", text: s.starter, correction: null, audio_base64: null, timestamp: new Date().toISOString() });
    convoHistory.push({ role: "assistant", content: s.starter });
  }

  renderChatGoal();
  renderChatMessages();
}

async function sendConvoMessage(text) {
  if (!text.trim()) return;
  document.getElementById("chat-input").value = "";
  document.getElementById("chat-hint-area").style.display = "none";

  const userMsg = { role: "user", text: text.trim(), correction: null, audio_base64: null, timestamp: new Date().toISOString() };
  convoMessages.push(userMsg);
  convoHistory.push({ role: "user", content: text.trim() });
  renderChatMessages();
  scrollChatToBottom();
  showChatTyping(true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "convo", text: text.trim(), history: convoHistory.slice(-20), scenario: convoScenario }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Server error");
    showChatTyping(false);

    convoMessages[convoMessages.length - 1].correction = data.correction || null;
    convoMessages.push({ role: "assistant", text: data.reply, correction: null, audio_base64: data.audio_base64 || null, timestamp: new Date().toISOString() });
    convoHistory.push({ role: "assistant", content: data.reply });

    renderChatMessages();
    scrollChatToBottom();
    saveConvoSession();
  } catch (err) {
    showChatTyping(false);
    convoMessages.push({ role: "assistant", text: `Error: ${err.message}`, correction: null, audio_base64: null, timestamp: new Date().toISOString() });
    renderChatMessages();
    scrollChatToBottom();
  }
}

async function requestHint() {
  const hintArea = document.getElementById("chat-hint-area");
  const hintChips = document.getElementById("chat-hint-chips");
  hintChips.innerHTML = `<span class="hint-loading">Getting ideas...</span>`;
  hintArea.style.display = "block";
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "hint", text: "hint", history: convoHistory.slice(-6), scenario: convoScenario }),
    });
    const data = await res.json();
    const hints = Array.isArray(data.hints) ? data.hints : [];
    hintChips.innerHTML = hints.map(h =>
      `<button class="hint-chip" onclick="selectHint(this, '${h.replace(/'/g, "\\'")}')">${h}</button>`
    ).join("");
  } catch {
    hintChips.innerHTML = `<span class="hint-loading">Could not get hints.</span>`;
  }
}

function selectHint(btn, hintText) {
  document.querySelectorAll(".hint-chip").forEach(c => c.classList.remove("selected"));
  btn.classList.add("selected");
  document.getElementById("chat-hint-chips").insertAdjacentHTML("beforeend",
    `<div class="hint-selected-note">Idea: "${hintText}" — write this in German below</div>`
  );
}

function renderChatMessages() {
  const container = document.getElementById("chat-messages");
  if (!convoMessages.length) {
    const hasScenario = convoScenario && SCENARIOS[convoScenario];
    container.innerHTML = `<div class="chat-empty">${hasScenario ? "Conversation started — reply in German below." : "Start chatting in German below."}</div>`;
    return;
  }
  container.innerHTML = convoMessages.map((msg, idx) => {
    const isUser = msg.role === "user";
    const corrHtml = msg.correction
      ? `<div class="chat-correction">
           <span class="corr-de">${msg.correction.corrected}</span>
           <span class="corr-en">${msg.correction.explanation}</span>
         </div>`
      : "";
    const audioBtn = !isUser && msg.audio_base64
      ? `<button class="chat-play-btn" onclick="playChatAudio(${idx})">&#9654;</button>`
      : "";
    return `<div class="chat-row ${isUser ? "user-row" : "ai-row"}">
      <div class="chat-bubble ${isUser ? "user-bubble" : "ai-bubble"}">
        <div class="chat-text">${msg.text}</div>
        ${audioBtn}
      </div>
      ${corrHtml}
    </div>`;
  }).join("");
}

function playChatAudio(idx) {
  const msg = convoMessages[idx];
  if (msg?.audio_base64) playBase64Audio(msg.audio_base64);
}

function scrollChatToBottom() {
  const el = document.getElementById("chat-messages");
  el.scrollTop = el.scrollHeight;
}

function showChatTyping(show) {
  document.getElementById("chat-typing").style.display = show ? "block" : "none";
  if (show) scrollChatToBottom();
}

function renderChatGoal() {
  const banner = document.getElementById("chat-goal-banner");
  if (convoScenario && SCENARIOS[convoScenario]) {
    banner.style.display = "flex";
    document.getElementById("chat-goal-text").textContent = `Goal: ${SCENARIOS[convoScenario].goal}`;
  } else {
    banner.style.display = "none";
  }
}

function saveConvoSession() {
  if (convoMessages.length < 2) return;
  const sessions = JSON.parse(localStorage.getItem("convo_sessions") || "[]");
  const idx = sessions.findIndex(s => s.id === convoSessionId);
  const session = {
    id: convoSessionId,
    date: new Date().toISOString().split("T")[0],
    title: convoScenario && SCENARIOS[convoScenario] ? SCENARIOS[convoScenario].title : "Free Chat",
    scenarioKey: convoScenario,
    messages: convoMessages.map(m => ({ role: m.role, text: m.text, correction: m.correction || null })),
  };
  if (idx >= 0) sessions[idx] = session;
  else sessions.unshift(session);
  localStorage.setItem("convo_sessions", JSON.stringify(sessions.slice(0, 20)));
}

function showChatHistory() {
  const panel = document.getElementById("chat-history-panel");
  const list = document.getElementById("chat-history-list");
  const sessions = JSON.parse(localStorage.getItem("convo_sessions") || "[]");
  if (!sessions.length) {
    list.innerHTML = `<div class="prog-empty">No past conversations yet.</div>`;
  } else {
    list.innerHTML = sessions.map((s, i) => {
      const corrections = s.messages.filter(m => m.correction).length;
      return `<div class="history-item" onclick="loadConvoSession(${i})">
        <div class="history-title">${s.title}</div>
        <div class="history-meta">${s.date} &middot; ${s.messages.length} messages${corrections ? ` &middot; ${corrections} corrections` : ""}</div>
      </div>`;
    }).join("");
  }
  panel.style.display = "flex";
}

function loadConvoSession(idx) {
  const sessions = JSON.parse(localStorage.getItem("convo_sessions") || "[]");
  const s = sessions[idx];
  if (!s) return;
  convoSessionId = s.id;
  convoScenario = s.scenarioKey;
  convoHistory = s.messages.map(m => ({ role: m.role, content: m.text }));
  convoMessages = s.messages.map(m => ({ ...m, audio_base64: null }));
  document.getElementById("chat-scenario-select").value = s.scenarioKey || "";
  document.getElementById("chat-history-panel").style.display = "none";
  renderChatGoal();
  renderChatMessages();
  scrollChatToBottom();
}

// ---- AI Mini-Player ----

function openMiniPlayer() {
  const saved = JSON.parse(localStorage.getItem("ai_phrases") || "[]");
  if (!saved.length) return;
  miniPhrases = [...saved];
  miniIndex = 0;
  miniRevealed = false;
  document.getElementById("ai-saved-section").style.display = "none";
  document.getElementById("ai-mini-player").style.display = "flex";
  renderMiniCard();
}

function closeMiniPlayer() {
  document.getElementById("ai-mini-player").style.display = "none";
  document.getElementById("ai-saved-section").style.display = "flex";
  if (aiAudio) aiAudio.pause();
}

function renderMiniCard() {
  miniRevealed = false;
  const p = miniPhrases[miniIndex];
  const total = miniPhrases.length;

  document.getElementById("mini-count").textContent = `${miniIndex + 1} / ${total}`;
  document.getElementById("mini-english").textContent = p.english;
  document.getElementById("mini-german").textContent = p.german;
  document.getElementById("mini-german").style.display = "none";
  document.getElementById("mini-hint").style.display = "block";
  document.getElementById("mini-player-btns").style.display = "none";
  document.getElementById("mini-replay-btn").style.display = "none";
  document.getElementById("mini-no-audio").style.display = "none";
  document.getElementById("mini-category").textContent = CATEGORIES[p.category] || p.category;
}

function miniRevealCard() {
  miniRevealed = true;
  const p = miniPhrases[miniIndex];
  document.getElementById("mini-german").style.display = "block";
  document.getElementById("mini-hint").style.display = "none";
  document.getElementById("mini-player-btns").style.display = "flex";

  if (p.audio_base64) {
    document.getElementById("mini-replay-btn").style.display = "inline-flex";
    playBase64Audio(p.audio_base64);
  } else {
    document.getElementById("mini-no-audio").style.display = "block";
  }
}

function miniAdvance() {
  if (miniIndex < miniPhrases.length - 1) {
    miniIndex++;
    renderMiniCard();
  } else {
    // End of deck
    document.getElementById("mini-german").style.display = "none";
    document.getElementById("mini-hint").style.display = "none";
    document.getElementById("mini-player-btns").style.display = "none";
    document.getElementById("mini-replay-btn").style.display = "none";
    document.getElementById("mini-no-audio").style.display = "none";
    document.getElementById("mini-english").textContent = "All done!";
    document.getElementById("mini-count").textContent = `${miniPhrases.length} / ${miniPhrases.length}`;
    document.getElementById("mini-category").textContent = "";
  }
}

// ---- Words Mode ----

function loadWordsSRS() {
  wordsSRS = JSON.parse(localStorage.getItem("wordsSRS") || "{}");
}

function saveWordsSRS() {
  localStorage.setItem("wordsSRS", JSON.stringify(wordsSRS));
}

function getWordRecord(id) {
  return wordsSRS[String(id)] || {
    interval: 0, easeFactor: 2.5, dueDate: null,
    lastReviewed: null, totalReviews: 0, totalCorrect: 0,
  };
}

function isWordDue(id) {
  const r = getWordRecord(id);
  return r.dueDate === null || r.dueDate <= todayStr();
}

function getWordStatus(id) {
  const r = getWordRecord(id);
  if (!r.dueDate) return "new";
  if (r.interval >= 21) return "mastered";
  if (isWordDue(id)) return "due";
  return "upcoming";
}

function updateWordSRS(id, rating) {
  const r = getWordRecord(id);
  let interval = r.interval;
  let ef = r.easeFactor;

  if (rating === "miss") {
    interval = 1;
    ef = Math.max(1.3, ef - 0.2);
  } else if (rating === "hard") {
    interval = Math.max(1, interval === 0 ? 1 : Math.round(interval * 1.2));
    ef = Math.max(1.3, ef - 0.15);
  } else if (rating === "good") {
    if (interval === 0) interval = 1;
    else if (interval === 1) interval = 3;
    else interval = Math.round(interval * ef);
  } else if (rating === "easy") {
    if (interval === 0) interval = 3;
    else if (interval === 1) interval = 4;
    else interval = Math.round(interval * ef * 1.3);
    ef = Math.min(3.0, ef + 0.1);
  }

  const due = new Date();
  due.setDate(due.getDate() + interval);
  wordsSRS[String(id)] = {
    ...r,
    interval,
    easeFactor: ef,
    dueDate: due.toISOString().split("T")[0],
    lastReviewed: todayStr(),
    totalReviews: r.totalReviews + 1,
    totalCorrect: r.totalCorrect + (rating !== "miss" ? 1 : 0),
  };
  saveWordsSRS();
}

function buildWordsQueue() {
  const tierVal = document.getElementById("word-tier-select").value;
  const posVal = document.getElementById("word-pos-filter").value;

  let source = (typeof WORDS !== "undefined" ? WORDS : []);
  if (tierVal !== "all") source = source.filter(w => w.tier === parseInt(tierVal));
  if (posVal !== "all") source = source.filter(w => w.pos === posVal);

  if (wordsShuffled) {
    // Shuffle within due/new and upcoming groups separately to keep priority
    const dueGroup = source.filter(w => isWordDue(w.id));
    const upcomingGroup = source.filter(w => !isWordDue(w.id));
    source = [
      ...dueGroup.sort(() => Math.random() - 0.5),
      ...upcomingGroup.sort(() => Math.random() - 0.5),
    ];
  } else {
    source = [...source].sort((a, b) => {
      const aDue = isWordDue(a.id) ? 0 : 1;
      const bDue = isWordDue(b.id) ? 0 : 1;
      if (aDue !== bDue) return aDue - bDue;
      return a.tier - b.tier || a.id - b.id;
    });
  }

  wordsQueue = source;
  wordsIndex = 0;
}

function updateWordsStatsBar() {
  const source = typeof WORDS !== "undefined" ? WORDS : [];
  let mastered = 0, due = 0;
  for (const w of source) {
    const st = getWordStatus(w.id);
    if (st === "mastered") mastered++;
    else if (st === "due" || st === "new") due++;
  }
  document.getElementById("words-mastered-count").textContent = `${mastered} mastered`;
  document.getElementById("words-due-count").textContent = `${due} due`;
  document.getElementById("words-total-count").textContent = `/ ${source.length}`;

  const sessionEl = document.getElementById("words-session-stats");
  if (wordsSessionTotal > 0) {
    const pct = Math.round((wordsSessionCorrect / wordsSessionTotal) * 100);
    sessionEl.textContent = `${wordsSessionCorrect}/${wordsSessionTotal} (${pct}%)`;
    sessionEl.style.display = "inline";
  } else {
    sessionEl.style.display = "none";
  }
}

const WORD_POS_LABELS = {
  verb: "Verb", noun: "Nomen", adj: "Adj.", adv: "Adv.",
  prep: "Präp.", conj: "Konj.", pron: "Pron.",
};

function renderWordCard() {
  if (!wordsQueue.length) {
    document.getElementById("word-card").innerHTML =
      `<div style="text-align:center;padding:24px;color:var(--text-dim)">No words match the current filter.</div>`;
    document.getElementById("word-position").textContent = "0 / 0";
    updateWordsStatsBar();
    return;
  }

  const w = wordsQueue[wordsIndex];
  wordRevealed = false;

  // Meta chips
  document.getElementById("word-tier-chip").textContent = `T${w.tier}`;
  const posBadge = document.getElementById("word-pos-badge");
  posBadge.textContent = WORD_POS_LABELS[w.pos] || w.pos;
  posBadge.className = `wpos-${w.pos}`;

  // SRS status chip
  const statusChip = document.getElementById("word-srs-status-chip");
  const wst = getWordStatus(w.id);
  statusChip.textContent = wst;
  statusChip.className = `srs-badge srs-${wst}`;
  statusChip.style.display = "inline-block";

  const mainRow = document.getElementById("word-main-row");
  const enPromptRow = document.getElementById("word-en-prompt-row");
  const sentenceDe = document.getElementById("word-sentence-de");

  if (wordsDirection === "de_en") {
    document.getElementById("word-article-el").textContent = w.article || "";
    document.getElementById("word-german-el").textContent = w.german;
    sentenceDe.innerHTML = w.example_de || "";
    mainRow.style.display = "flex";
    enPromptRow.style.display = "none";
    document.getElementById("word-tts-btn").style.display = "inline-block";
  } else {
    document.getElementById("word-en-prompt-el").textContent = w.english;
    sentenceDe.innerHTML = w.example_en ? `<em style="color:var(--text-dim)">${w.example_en}</em>` : "";
    mainRow.style.display = "none";
    enPromptRow.style.display = "flex";
    // TTS plays German - hide before reveal in production mode
    document.getElementById("word-tts-btn").style.display = "none";
  }

  // Mnemonic hint (useful in both directions for memory aid)
  const mnemonicEl = document.getElementById("word-mnemonic-el");
  const hintBtn = document.getElementById("word-hint-btn");
  if (w.mnemonic) {
    mnemonicEl.textContent = w.mnemonic;
    mnemonicEl.style.display = "none";
    hintBtn.style.display = "inline-block";
  } else {
    mnemonicEl.style.display = "none";
    hintBtn.style.display = "none";
  }

  document.getElementById("word-translation-area").style.display = "none";

  const mcChoices = document.getElementById("word-mc-choices");
  if (wordsMode === "mc") {
    document.getElementById("word-reveal-btn").style.display = "none";
    mcChoices.style.display = "flex";
    renderMCChoices(w);
  } else {
    document.getElementById("word-reveal-btn").style.display = "block";
    mcChoices.style.display = "none";
  }

  document.getElementById("word-position").textContent = `${wordsIndex + 1} / ${wordsQueue.length}`;
  updateWordsStatsBar();
}

function revealWordTranslation() {
  if (wordRevealed) return;
  wordRevealed = true;
  const w = wordsQueue[wordsIndex];

  if (wordsDirection === "de_en") {
    document.getElementById("word-english-el").textContent = w.english;
    document.getElementById("word-sentence-en-el").textContent = w.example_en || "";
  } else {
    // EN→DE: reveal the German word as the answer
    const answerText = w.article ? `${w.article} ${w.german}` : w.german;
    document.getElementById("word-english-el").textContent = answerText;
    document.getElementById("word-sentence-en-el").innerHTML = w.example_de || "";
    // Show TTS now that German is revealed
    document.getElementById("word-tts-btn").style.display = "inline-block";
  }

  document.getElementById("word-translation-area").style.display = "flex";
  document.getElementById("word-reveal-btn").style.display = "none";
}

function generateMCChoices(correctWord) {
  const all = typeof WORDS !== "undefined" ? WORDS : [];
  // Prefer same POS and tier for plausible distractors
  let pool = all.filter(w => w.id !== correctWord.id && w.pos === correctWord.pos && w.tier === correctWord.tier);
  if (pool.length < 3) pool = all.filter(w => w.id !== correctWord.id && w.pos === correctWord.pos);
  if (pool.length < 3) pool = all.filter(w => w.id !== correctWord.id);
  const distractors = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
  return [...distractors, correctWord].sort(() => Math.random() - 0.5);
}

function renderMCChoices(correctWord) {
  const choices = generateMCChoices(correctWord);
  const container = document.getElementById("word-mc-choices");
  container.innerHTML = choices.map(w => {
    const label = wordsDirection === "de_en"
      ? w.english
      : (w.article ? `${w.article} ${w.german}` : w.german);
    return `<button class="word-mc-btn" data-id="${w.id}" onclick="handleMCChoice(${w.id}, ${correctWord.id})">${label}</button>`;
  }).join("");
}

function handleMCChoice(selectedId, correctId) {
  document.querySelectorAll(".word-mc-btn").forEach(btn => {
    btn.disabled = true;
    const btnId = parseInt(btn.dataset.id);
    if (btnId === correctId) btn.classList.add("mc-correct");
    else if (btnId === selectedId) btn.classList.add("mc-wrong");
  });

  const isCorrect = selectedId === correctId;
  wordsSessionTotal++;
  if (isCorrect) wordsSessionCorrect++;
  updateWordSRS(correctId, isCorrect ? "good" : "miss");
  updateWordsStatsBar();

  setTimeout(() => {
    if (wordsIndex < wordsQueue.length - 1) {
      wordsIndex++;
    } else {
      buildWordsQueue();
    }
    renderWordCard();
  }, isCorrect ? 700 : 1400);
}

function handleWordSRS(rating) {
  if (!wordsQueue.length) return;
  const w = wordsQueue[wordsIndex];
  updateWordSRS(w.id, rating);
  wordsSessionTotal++;
  if (rating !== "miss") wordsSessionCorrect++;
  if (wordsIndex < wordsQueue.length - 1) {
    wordsIndex++;
  } else {
    buildWordsQueue();
  }
  renderWordCard();
}

function wordTTS() {
  if (!wordsQueue.length) return;
  const w = wordsQueue[wordsIndex];
  const text = w.example_de ? w.example_de.replace(/<[^>]+>/g, "") : w.german;
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "de-DE";
  utt.rate = 0.88;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utt);
}

function showWordsPanel() {
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
  aiPanel.style.display = "none";
  document.getElementById("progress-panel").style.display = "none";
  document.getElementById("vocab-panel").style.display = "none";
  document.getElementById("grammar-panel").style.display = "none";
  document.getElementById("words-panel").style.display = "flex";
  wordsSessionCorrect = 0;
  wordsSessionTotal = 0;
  buildWordsQueue();
  renderWordCard();
}

function initWordsPanel() {
  loadWordsSRS();

  document.getElementById("word-tier-select").addEventListener("change", () => {
    buildWordsQueue();
    renderWordCard();
  });
  document.getElementById("word-pos-filter").addEventListener("change", () => {
    buildWordsQueue();
    renderWordCard();
  });
  document.getElementById("word-reveal-btn").addEventListener("click", revealWordTranslation);
  document.getElementById("word-hint-btn").addEventListener("click", () => {
    const el = document.getElementById("word-mnemonic-el");
    el.style.display = el.style.display === "none" ? "block" : "none";
  });
  document.getElementById("word-tts-btn").addEventListener("click", wordTTS);
  document.getElementById("word-prev-btn").addEventListener("click", () => {
    if (wordsIndex > 0) { wordsIndex--; renderWordCard(); }
  });
  document.getElementById("word-next-btn").addEventListener("click", () => {
    if (wordsIndex < wordsQueue.length - 1) { wordsIndex++; renderWordCard(); }
  });

  document.getElementById("word-shuffle-btn").addEventListener("click", () => {
    wordsShuffled = !wordsShuffled;
    const btn = document.getElementById("word-shuffle-btn");
    btn.textContent = wordsShuffled ? "Shuffle ✓" : "Shuffle";
    btn.classList.toggle("active", wordsShuffled);
    buildWordsQueue();
    renderWordCard();
  });

  document.getElementById("word-dir-btn").addEventListener("click", () => {
    wordsDirection = wordsDirection === "de_en" ? "en_de" : "de_en";
    const btn = document.getElementById("word-dir-btn");
    btn.textContent = wordsDirection === "de_en" ? "DE→EN" : "EN→DE";
    btn.classList.toggle("active", wordsDirection === "en_de");
    renderWordCard();
  });

  document.getElementById("word-mc-btn").addEventListener("click", () => {
    wordsMode = wordsMode === "flashcard" ? "mc" : "flashcard";
    const btn = document.getElementById("word-mc-btn");
    btn.textContent = wordsMode === "mc" ? "MC ✓" : "MC";
    btn.classList.toggle("active", wordsMode === "mc");
    renderWordCard();
  });
}

// ---- Start ----
document.addEventListener("DOMContentLoaded", init);
