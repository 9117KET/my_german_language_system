// app.js - German Language Learning Player
// Modes: listen (passive), shadow (listen + repeat), recall (active recall)

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
let mode = "listen";          // listen | shadow | recall
let category = "all";
let shuffle = false;
let autoAdvance = true;
let queue = [];
let queueIndex = 0;
let revealed = false;
let audio = new Audio();
let autoTimer = null;

// Recall session stats
let sessionGot = 0;
let sessionMissed = 0;
let sessionTotal = 0;

// Missed phrase weights: id -> count of misses
let missedWeights = JSON.parse(localStorage.getItem("missedWeights") || "{}");

// ---- DOM refs ----
const tabEls = document.querySelectorAll(".tab");
const categorySelect = document.getElementById("category-select");
const shuffleBtn = document.getElementById("shuffle-btn");
const autoBtn = document.getElementById("auto-btn");
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
    // Weight missed phrases: appear (1 + missCount) times
    const weighted = [];
    for (const p of source) {
      const w = 1 + (missedWeights[p.id] || 0);
      for (let i = 0; i < w; i++) weighted.push(p);
    }
    source = weighted;
  }

  if (shuffle) {
    source = [...source].sort(() => Math.random() - 0.5);
  }

  queue = source;
  queueIndex = 0;
}

function init() {
  if (typeof PHRASES === "undefined" || PHRASES.length === 0) {
    emptyState.style.display = "block";
    return;
  }
  buildCategorySelect();
  buildQueue();
  renderCard();
  setupEvents();
}

// ---- Render ----
function renderCard() {
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

  // Reset state
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
    englishEl.classList.add("hidden");   // hide translation - listen first
    revealHint.style.display = "block";
    revealHint.textContent = "Tap card to see translation";
    recallButtons.classList.remove("visible");
    statsBar.style.display = "none";
    statusText.textContent = "Listen and repeat aloud";
    loadAndPlay(p);
  } else if (mode === "recall") {
    germanEl.classList.add("hidden");    // hide German - you produce it
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
  audio.play().catch(() => {
    statusText.textContent = "Tap play to start";
  });
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
  queueIndex = Math.max(0, Math.min(queue.length - 1, queueIndex + delta));
  renderCard();
}

// ---- Events ----
function setupEvents() {
  // Mode tabs
  tabEls.forEach(tab => {
    tab.addEventListener("click", () => {
      mode = tab.dataset.mode;
      tabEls.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      if (mode === "recall") { sessionGot = 0; sessionMissed = 0; sessionTotal = 0; }
      buildQueue();
      renderCard();
    });
  });

  // Category filter
  categorySelect.addEventListener("change", () => {
    category = categorySelect.value;
    buildQueue();
    renderCard();
  });

  // Shuffle
  shuffleBtn.addEventListener("click", () => {
    shuffle = !shuffle;
    shuffleBtn.classList.toggle("active", shuffle);
    buildQueue();
    renderCard();
  });

  // Auto-advance toggle
  autoBtn.addEventListener("click", () => {
    autoAdvance = !autoAdvance;
    autoBtn.classList.toggle("active", autoAdvance);
    autoBtn.textContent = autoAdvance ? "Auto: ON" : "Auto: OFF";
    if (!autoAdvance) clearAutoTimer();
  });

  // Play/pause button
  playBtn.addEventListener("click", () => {
    const p = queue[queueIndex];
    if (!p) return;
    if (audio.paused) {
      if (!audio.src || audio.src === window.location.href) {
        loadAndPlay(p);
      } else {
        audio.play();
      }
    } else {
      audio.pause();
      clearAutoTimer();
    }
  });

  // Audio events
  audio.addEventListener("play", () => { statusText.textContent = "Playing..."; });
  audio.addEventListener("pause", () => { statusText.textContent = "Paused"; });
  audio.addEventListener("ended", () => {
    statusText.textContent = "Done";
    if (mode === "listen") {
      scheduleAutoAdvance(3000);
    } else if (mode === "shadow") {
      // Pause for user to shadow, then auto-advance
      statusText.textContent = "Repeat aloud!";
      scheduleAutoAdvance(5000);
    }
  });
  audio.addEventListener("error", () => { statusText.textContent = "Audio error"; });

  // Tap card to reveal (shadow mode: translation, recall mode: German + audio)
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

  // Recall: Got it / Missed
  gotItBtn.addEventListener("click", () => {
    const p = queue[queueIndex];
    sessionGot++;
    sessionTotal++;
    if (missedWeights[p.id] > 0) missedWeights[p.id]--;
    if (missedWeights[p.id] === 0) delete missedWeights[p.id];
    localStorage.setItem("missedWeights", JSON.stringify(missedWeights));
    advance(1);
  });

  missedBtn.addEventListener("click", () => {
    const p = queue[queueIndex];
    sessionMissed++;
    sessionTotal++;
    missedWeights[p.id] = (missedWeights[p.id] || 0) + 1;
    localStorage.setItem("missedWeights", JSON.stringify(missedWeights));
    advance(1);
  });

  // Prev/Next
  prevBtn.addEventListener("click", () => advance(-1));
  nextBtn.addEventListener("click", () => advance(1));

  // Keyboard shortcuts (desktop)
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); advance(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); advance(-1); }
    if (e.key === "p" || e.key === "P") playBtn.click();
    if (e.key === "r" || e.key === "R") cardEl.click();
    if (e.key === "g" || e.key === "G") gotItBtn.click();
    if (e.key === "m" || e.key === "M") missedBtn.click();
  });
}

// ---- Start ----
document.addEventListener("DOMContentLoaded", init);
