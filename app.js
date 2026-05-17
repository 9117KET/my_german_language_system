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

let missedWeights = JSON.parse(localStorage.getItem("missedWeights") || "{}");

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

  if (mode === "recall") {
    const weighted = [];
    for (const p of source) {
      const w = 1 + (missedWeights[p.id] || 0);
      for (let i = 0; i < w; i++) weighted.push(p);
    }
    source = weighted;
  }

  if (shuffle) source = [...source].sort(() => Math.random() - 0.5);
  queue = source;
  queueIndex = 0;
}

function init() {
  if (typeof PHRASES === "undefined" || PHRASES.length === 0) {
    emptyState.style.display = "block";
  }
  buildCategorySelect();
  buildQueue();
  renderCard();
  setupEvents();
  initAI();
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
  clearAutoTimer();
  audio.pause();
  audio.src = "";

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
    revealHint.textContent = "Say it in German, then tap to reveal";
    recallButtons.classList.remove("visible");
    statsBar.style.display = "flex";
    statGot.textContent = sessionGot;
    statMissed.textContent = sessionMissed;
    statTotal.textContent = sessionTotal;
    statusText.textContent = "Produce German from memory";
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
      mode = tab.dataset.mode;
      tabEls.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      if (mode === "ai") {
        showAIPanel();
      } else {
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
    statusText.textContent = "Done";
    if (mode === "listen") scheduleAutoAdvance(3000);
    else if (mode === "shadow") { statusText.textContent = "Repeat aloud!"; scheduleAutoAdvance(5000); }
  });
  audio.addEventListener("error", () => { statusText.textContent = "Audio error"; });

  cardEl.addEventListener("click", (e) => {
    if (e.target.closest("#audio-bar") || e.target.closest("#recall-buttons")) return;
    const p = queue[queueIndex];
    if (!p || revealed) return;
    revealed = true;
    if (mode === "shadow") {
      englishEl.classList.remove("hidden");
      revealHint.style.display = "none";
    } else if (mode === "recall") {
      germanEl.classList.remove("hidden");
      revealHint.style.display = "none";
      recallButtons.classList.add("visible");
      loadAndPlay(p);
    }
  });

  gotItBtn.addEventListener("click", () => {
    const p = queue[queueIndex];
    sessionGot++; sessionTotal++;
    if (missedWeights[p.id] > 0) missedWeights[p.id]--;
    if (missedWeights[p.id] === 0) delete missedWeights[p.id];
    localStorage.setItem("missedWeights", JSON.stringify(missedWeights));
    advance(1);
  });

  missedBtn.addEventListener("click", () => {
    const p = queue[queueIndex];
    sessionMissed++; sessionTotal++;
    missedWeights[p.id] = (missedWeights[p.id] || 0) + 1;
    localStorage.setItem("missedWeights", JSON.stringify(missedWeights));
    advance(1);
  });

  prevBtn.addEventListener("click", () => advance(-1));
  nextBtn.addEventListener("click", () => advance(1));

  document.addEventListener("keydown", (e) => {
    if (mode === "ai") return;
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
    aiResultBody.innerHTML = `
      <div class="ai-english">You: "${result.english}"</div>
      <div class="ai-german">${result.german}</div>
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

// ---- Start ----
document.addEventListener("DOMContentLoaded", init);
