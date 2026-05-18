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
};

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
}

// ---- Render (player) ----
function renderCard() {
  if (mode === "ai") return;

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
  audio.src = "";

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

  germanEl.textContent = p.german;
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
  playerEls.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "";
  });
}

function showAIPanel() {
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
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

  shuffleBtn.addEventListener("click", () => {
    shuffle = !shuffle;
    shuffleBtn.classList.toggle("active", shuffle);
    buildQueue();
    renderCard();
  });

  autoBtn.addEventListener("click", () => {
    autoAdvance = !autoAdvance;
    autoBtn.classList.toggle("active", autoAdvance);
    autoBtn.textContent = autoAdvance ? "Auto: ON" : "Auto: OFF";
    if (!autoAdvance) clearAutoTimer();
  });

  loopBtn.addEventListener("click", () => {
    loop = !loop;
    loopBtn.classList.toggle("active", loop);
    loopBtn.textContent = loop ? "Loop: ON" : "Loop";
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
      if (!audio.src || audio.src === window.location.href) loadAndPlay(p);
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
      else if (mode === "shadow") { statusText.textContent = "Repeat aloud!"; scheduleAutoAdvance(5000); }
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

  document.addEventListener("keydown", (e) => {
    if (mode === "ai" || mode === "progress") return;
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
}

function setupAIEvents() {
  aiSubBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      aiMode = btn.dataset.aimode;
      aiSubBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      aiLangHint.textContent = aiMode === "translate" ? "Speak in English" : "Sprechen Sie Deutsch";
      document.getElementById("ai-category-row").style.display = aiMode === "translate" ? "flex" : "none";
      clearAIResult();
      if (recognition) recognition.lang = aiMode === "translate" ? "en-US" : "de-DE";
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

  const saved = JSON.parse(localStorage.getItem("ai_phrases") || "[]");
  saved.push({ german, english, category: cat, created_date: new Date().toISOString().split("T")[0] });
  localStorage.setItem("ai_phrases", JSON.stringify(saved));

  aiSaveBtn.textContent = "Saved!";
  setTimeout(() => { aiSaveBtn.textContent = "+ Save phrase"; }, 1500);
  renderAISavedList();
}

function renderAISavedList() {
  const saved = JSON.parse(localStorage.getItem("ai_phrases") || "[]");
  aiSavedCount.textContent = `Saved: ${saved.length}`;
  aiSavedList.innerHTML = saved.slice().reverse().map(p => `
    <div class="ai-saved-item">
      <div class="saved-german">${p.german}</div>
      <div class="saved-english">${p.english}</div>
      <div class="saved-category">${CATEGORIES[p.category] || p.category}</div>
    </div>
  `).join("");
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

// ---- Start ----
document.addEventListener("DOMContentLoaded", init);
