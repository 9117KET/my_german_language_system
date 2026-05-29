// Tests for drill rule-hint feedback and mobile CEFR level bar.
// Run: node --test tests/ui_features.test.js

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");

function readFile(name) {
  return fs.readFileSync(path.join(ROOT, name), "utf8");
}

function loadGrammarTopics() {
  const content = readFile("app.js");
  const start = content.indexOf("const GRAMMAR_TOPICS = [");
  const end = content.indexOf("// ---- State ----");
  assert.ok(start !== -1 && end !== -1, "Could not locate GRAMMAR_TOPICS in app.js");
  const snippet = content.slice(start, end).trim()
    .replace(/;\s*$/, "")
    .replace(/^\s*const\s+GRAMMAR_TOPICS\s*=/, "GRAMMAR_TOPICS =");
  const ctx = {};
  vm.runInNewContext(snippet, ctx);
  return ctx.GRAMMAR_TOPICS;
}

// ---------------------------------------------------------------------------
// Drill rule-hint: data integrity
// ---------------------------------------------------------------------------

describe("drill rule-hint — GRAMMAR_TOPICS data", () => {
  const TOPICS = loadGrammarTopics();

  test("every topic has a non-empty rule field", () => {
    const missing = TOPICS.filter(t => !t.rule || t.rule.trim() === "");
    assert.equal(
      missing.length, 0,
      `Topics missing rule: ${missing.map(t => t.id).join(", ")}`
    );
  });

  test("rule field is a string on every topic", () => {
    const bad = TOPICS.filter(t => typeof t.rule !== "string");
    assert.equal(bad.length, 0, `Topics with non-string rule: ${bad.map(t => t.id).join(", ")}`);
  });

  test("Perfekt rule mentions haben or sein", () => {
    const topic = TOPICS.find(t => t.id === "Perfekt");
    assert.ok(topic, "Perfekt topic not found");
    assert.ok(
      topic.rule.includes("haben") || topic.rule.includes("sein"),
      `Perfekt rule should mention haben/sein: "${topic.rule}"`
    );
  });

  test("Modal rule mentions infinitive", () => {
    const topic = TOPICS.find(t => t.id === "Modal");
    assert.ok(topic, "Modal topic not found");
    assert.ok(
      topic.rule.toLowerCase().includes("infinitive") || topic.rule.toLowerCase().includes("infinitiv"),
      `Modal rule should mention infinitive: "${topic.rule}"`
    );
  });

  test("Nebensatz rule mentions verb goes to end", () => {
    const topic = TOPICS.find(t => t.id === "Nebensatz");
    assert.ok(topic, "Nebensatz topic not found");
    assert.ok(
      topic.rule.toLowerCase().includes("end"),
      `Nebensatz rule should mention verb at end: "${topic.rule}"`
    );
  });
});

// ---------------------------------------------------------------------------
// Drill rule-hint: answerDrill source code
// ---------------------------------------------------------------------------

describe("drill rule-hint — answerDrill implementation", () => {
  const appJs = readFile("app.js");

  test("answerDrill looks up grammar topic by drillTag", () => {
    assert.ok(
      appJs.includes("GRAMMAR_TOPICS.find(t => t.id === drillTag)"),
      "answerDrill must look up GRAMMAR_TOPICS.find(t => t.id === drillTag)"
    );
  });

  test("answerDrill appends drill-rule-hint to feedback HTML", () => {
    assert.ok(
      appJs.includes("drill-rule-hint"),
      "answerDrill must reference drill-rule-hint class"
    );
  });

  test("correct feedback includes the rule hint variable", () => {
    const fnStart = appJs.indexOf("function answerDrill(");
    const fnEnd = appJs.indexOf("\nfunction ", fnStart + 1);
    const fnBody = appJs.slice(fnStart, fnEnd);
    assert.ok(fnBody.includes("ruleHint"), "answerDrill body must use ruleHint");
    assert.ok(
      fnBody.includes("`<span style=\"color:var(--green)\">✓ Correct!</span>${ruleHint}`"),
      "correct branch must append ruleHint"
    );
  });

  test("incorrect feedback includes the rule hint variable", () => {
    const fnStart = appJs.indexOf("function answerDrill(");
    const fnEnd = appJs.indexOf("\nfunction ", fnStart + 1);
    const fnBody = appJs.slice(fnStart, fnEnd);
    assert.ok(
      fnBody.includes("${ruleHint}`"),
      "incorrect branch must append ruleHint"
    );
  });
});

// ---------------------------------------------------------------------------
// Drill rule-hint: CSS
// ---------------------------------------------------------------------------

describe("drill rule-hint — CSS", () => {
  const css = readFile("style.css");

  test(".drill-rule-hint rule exists in style.css", () => {
    assert.ok(css.includes(".drill-rule-hint {"), "style.css must define .drill-rule-hint");
  });

  test(".drill-rule-hint has font-size 0.8rem", () => {
    const idx = css.indexOf(".drill-rule-hint {");
    assert.ok(idx !== -1);
    const block = css.slice(idx, idx + 300);
    assert.ok(block.includes("font-size: 0.8rem"), ".drill-rule-hint must have font-size: 0.8rem");
  });

  test(".drill-rule-hint has a left border", () => {
    const idx = css.indexOf(".drill-rule-hint {");
    const block = css.slice(idx, idx + 300);
    assert.ok(block.includes("border-left"), ".drill-rule-hint must have border-left for visual accent");
  });
});

// ---------------------------------------------------------------------------
// Mobile level bar: HTML
// ---------------------------------------------------------------------------

describe("mobile level bar — index.html", () => {
  const html = readFile("index.html");

  test("mobile-level-bar element exists", () => {
    assert.ok(html.includes('id="mobile-level-bar"'), "index.html must contain id=\"mobile-level-bar\"");
  });

  test("mobile-level-bar contains All chip", () => {
    const barStart = html.indexOf('id="mobile-level-bar"');
    assert.ok(barStart !== -1);
    const barEnd = html.indexOf("</div>", barStart + 500) + 6;
    const barHtml = html.slice(barStart, barEnd);
    assert.ok(
      barHtml.includes('data-level="all"'),
      "mobile-level-bar must include All chip"
    );
  });

  test("mobile-level-bar contains all six CEFR level chips", () => {
    const barStart = html.indexOf('id="mobile-level-bar"');
    const barEnd = html.indexOf("</div>", html.indexOf("</div>", barStart) + 1) + 6;
    const barHtml = html.slice(barStart, barEnd + 200);
    for (const level of ["a1", "a2", "b1", "b2", "c1", "c2"]) {
      assert.ok(
        barHtml.includes(`data-level="${level}"`),
        `mobile-level-bar is missing chip for level ${level}`
      );
    }
  });

  test("mobile-level-bar chips use level-chip class", () => {
    const barStart = html.indexOf('id="mobile-level-bar"');
    const barEnd = html.indexOf("</div>", html.indexOf("</div>", barStart) + 1) + 6;
    const barHtml = html.slice(barStart, barEnd + 200);
    assert.ok(barHtml.includes('class="level-chip'), "mobile-level-bar chips must use level-chip class");
  });

  test("mobile-level-bar appears before controls-bar in DOM order", () => {
    const mobileBarPos = html.indexOf('id="mobile-level-bar"');
    const controlsBarPos = html.indexOf('id="controls-bar"');
    assert.ok(
      mobileBarPos < controlsBarPos,
      "mobile-level-bar must appear before controls-bar in index.html"
    );
  });

  test("mobile-level-bar is inside app-main", () => {
    const mainStart = html.indexOf('class="app-main"');
    const mainEnd = html.indexOf("</main>", mainStart);
    const mobileBarPos = html.indexOf('id="mobile-level-bar"');
    assert.ok(
      mobileBarPos > mainStart && mobileBarPos < mainEnd,
      "mobile-level-bar must be inside .app-main"
    );
  });
});

// ---------------------------------------------------------------------------
// Mobile level bar: CSS
// ---------------------------------------------------------------------------

describe("mobile level bar — CSS", () => {
  const css = readFile("style.css");

  test("#mobile-level-bar is display:none by default", () => {
    const idx = css.indexOf("#mobile-level-bar {");
    assert.ok(idx !== -1, "style.css must define #mobile-level-bar outside media query");
    const block = css.slice(idx, idx + 100);
    assert.ok(block.includes("display: none"), "#mobile-level-bar default must be display: none");
  });

  test("#mobile-level-bar is display:flex inside mobile media query", () => {
    const mq = css.indexOf("@media (max-width: 767px)");
    assert.ok(mq !== -1, "Mobile media query not found");
    const mqBlock = css.slice(mq);
    const mobileBar = mqBlock.indexOf("#mobile-level-bar {");
    assert.ok(mobileBar !== -1, "#mobile-level-bar must be defined inside @media (max-width: 767px)");
    const block = mqBlock.slice(mobileBar, mobileBar + 200);
    assert.ok(block.includes("display: flex"), "#mobile-level-bar must be display: flex on mobile");
  });

  test("mobile bar hides scrollbar on webkit", () => {
    const mq = css.indexOf("@media (max-width: 767px)");
    const mqBlock = css.slice(mq);
    assert.ok(
      mqBlock.includes("#mobile-level-bar::-webkit-scrollbar"),
      "Mobile bar must hide scrollbar via ::-webkit-scrollbar"
    );
  });
});

// ---------------------------------------------------------------------------
// Mobile level bar: active-state sync in app.js
// ---------------------------------------------------------------------------

describe("mobile level bar — level chip sync in app.js", () => {
  const appJs = readFile("app.js");

  test("level chip click uses dataset.level comparison not identity", () => {
    assert.ok(
      appJs.includes("c.dataset.level === chip.dataset.level"),
      "Level chip active state must use dataset.level comparison to sync both chip sets"
    );
    assert.ok(
      !appJs.includes("c === chip"),
      "Identity comparison 'c === chip' must be removed (breaks multi-set sync)"
    );
  });
});

// ---------------------------------------------------------------------------
// Recall attempt system: HTML
// ---------------------------------------------------------------------------

describe("recall attempt system — index.html", () => {
  const html = readFile("index.html");

  test("recall-attempt-area element exists", () => {
    assert.ok(html.includes('id="recall-attempt-area"'), "index.html must contain recall-attempt-area");
  });

  test("recall-text-input textarea exists", () => {
    assert.ok(html.includes('id="recall-text-input"'), "index.html must contain recall-text-input textarea");
  });

  test("recall-attempt-mic-btn exists", () => {
    assert.ok(html.includes('id="recall-attempt-mic-btn"'), "index.html must contain recall-attempt-mic-btn");
  });

  test("recall-check-btn exists and is disabled by default", () => {
    assert.ok(html.includes('id="recall-check-btn"'), "index.html must contain recall-check-btn");
    const btnIdx = html.indexOf('id="recall-check-btn"');
    const surroundingHtml = html.slice(Math.max(0, btnIdx - 100), btnIdx + 100);
    assert.ok(surroundingHtml.includes("disabled"), "recall-check-btn must be disabled by default");
  });

  test("recall-ai-feedback element exists", () => {
    assert.ok(html.includes('id="recall-ai-feedback"'), "index.html must contain recall-ai-feedback");
  });

  test("recall-ai-feedback-body and recall-ai-feedback-actions exist", () => {
    assert.ok(html.includes('id="recall-ai-feedback-body"'), "missing recall-ai-feedback-body");
    assert.ok(html.includes('id="recall-ai-feedback-actions"'), "missing recall-ai-feedback-actions");
  });

  test("Try Again and Reveal Answer buttons exist in feedback", () => {
    assert.ok(html.includes('id="recall-try-again-btn"'), "missing recall-try-again-btn");
    assert.ok(html.includes('id="recall-reveal-btn"'), "missing recall-reveal-btn");
  });

  test("attempt area appears before recall-buttons in DOM order", () => {
    const attemptPos = html.indexOf('id="recall-attempt-area"');
    const buttonsPos = html.indexOf('id="recall-buttons"');
    assert.ok(attemptPos < buttonsPos, "recall-attempt-area must appear before recall-buttons");
  });

  test("old recall-voice-area is removed", () => {
    assert.ok(!html.includes('id="recall-voice-area"'), "old recall-voice-area should be removed");
    assert.ok(!html.includes('id="recall-transcript"'), "old recall-transcript should be removed");
  });
});

// ---------------------------------------------------------------------------
// Recall attempt system: CSS
// ---------------------------------------------------------------------------

describe("recall attempt system — CSS", () => {
  const css = readFile("style.css");

  test("#recall-attempt-area defined in CSS", () => {
    assert.ok(css.includes("#recall-attempt-area {"), "CSS must define #recall-attempt-area");
  });

  test(".recall-text-input defined with focus state", () => {
    assert.ok(css.includes(".recall-text-input {"), "CSS must define .recall-text-input");
    assert.ok(css.includes(".recall-text-input:focus"), "CSS must define .recall-text-input:focus");
  });

  test(".recall-check-btn has disabled and hover states", () => {
    assert.ok(css.includes(".recall-check-btn:disabled"), "CSS must define disabled state");
    assert.ok(css.includes(".recall-check-btn:not(:disabled):hover"), "CSS must define hover state");
  });

  test("recall feedback classes exist", () => {
    assert.ok(css.includes(".recall-feedback-correct"), "missing .recall-feedback-correct");
    assert.ok(css.includes(".recall-feedback-wrong"), "missing .recall-feedback-wrong");
    assert.ok(css.includes(".recall-feedback-hint"), "missing .recall-feedback-hint");
  });

  test(".recall-gotit-btn defined", () => {
    assert.ok(css.includes(".recall-gotit-btn"), "CSS must define .recall-gotit-btn");
  });
});

// ---------------------------------------------------------------------------
// Recall attempt system: app.js logic
// ---------------------------------------------------------------------------

describe("recall attempt system — app.js", () => {
  const appJs = readFile("app.js");

  test("setupRecallSpeech uses Deepgram WebSocket with German language", () => {
    assert.ok(
      appJs.includes("language=de"),
      "setupRecallSpeech must use Deepgram with language=de for German"
    );
  });

  test("setupRecallSpeech falls back to browser SpeechRecognition", () => {
    assert.ok(
      appJs.includes("window.SpeechRecognition || window.webkitSpeechRecognition"),
      "setupRecallSpeech must include SpeechRecognition fallback"
    );
  });

  test("check button posts to recall-check API mode", () => {
    assert.ok(
      appJs.includes(`mode: "recall-check"`),
      "check button must POST to /api/chat with mode recall-check"
    );
    assert.ok(
      appJs.includes("targetEnglish: p.english"),
      "recall-check request must include targetEnglish"
    );
  });

  test("correct result shows got-it button that clicks got-it-btn", () => {
    assert.ok(
      appJs.includes(`"got-it-btn"`),
      "correct feedback must trigger got-it-btn"
    );
    assert.ok(
      appJs.includes("recall-gotit-btn"),
      "correct feedback must render recall-gotit-btn"
    );
  });

  test("incorrect result shows try-again and reveal-answer buttons", () => {
    assert.ok(
      appJs.includes("recall-try-again-btn"),
      "incorrect feedback must include Try Again button"
    );
    assert.ok(
      appJs.includes("recall-reveal-btn"),
      "incorrect feedback must include Reveal Answer button"
    );
  });

  test("reveal button calls revealRecallCard", () => {
    assert.ok(
      appJs.includes("revealRecallCard()"),
      "Reveal Answer button must call revealRecallCard()"
    );
  });

  test("revealRecallCard hides attempt area and feedback", () => {
    const fnStart = appJs.indexOf("function revealRecallCard(");
    const fnEnd = appJs.indexOf("\nfunction ", fnStart + 1);
    const fnBody = appJs.slice(fnStart, fnEnd);
    assert.ok(fnBody.includes("recall-attempt-area"), "revealRecallCard must hide recall-attempt-area");
    assert.ok(fnBody.includes("recall-ai-feedback"), "revealRecallCard must hide recall-ai-feedback");
  });

  test("old voice state variables are removed", () => {
    assert.ok(!appJs.includes("let recallRecognition"), "recallRecognition variable must be removed");
    assert.ok(!appJs.includes("let recallIsRecording"), "recallIsRecording variable must be removed");
    assert.ok(!appJs.includes("handleRecallVoice"), "handleRecallVoice function must be removed");
  });
});

// ---------------------------------------------------------------------------
// Recall attempt system: API
// ---------------------------------------------------------------------------

describe("recall attempt system — api/chat.js", () => {
  const chatJs = readFile("api/chat.js");

  test("recall-check mode exists in api/chat.js", () => {
    assert.ok(
      chatJs.includes(`mode === "recall-check"`),
      "api/chat.js must handle recall-check mode"
    );
  });

  test("recall-check uses targetEnglish from request body", () => {
    assert.ok(
      chatJs.includes("targetEnglish"),
      "recall-check must read targetEnglish from req.body"
    );
  });

  test("recall-check prompt instructs AI not to reveal correct answer", () => {
    const modeStart = chatJs.indexOf(`mode === "recall-check"`);
    const modeBlock = chatJs.slice(modeStart, modeStart + 3000);
    assert.ok(
      modeBlock.includes("Do NOT write the correct German sentence"),
      "prompt must instruct AI not to reveal the correct answer"
    );
  });

  test("recall-check returns is_correct, feedback, hint - no corrected field", () => {
    const modeStart = chatJs.indexOf(`mode === "recall-check"`);
    const modeBlock = chatJs.slice(modeStart, modeStart + 3000);
    assert.ok(modeBlock.includes("is_correct"), "recall-check must return is_correct");
    assert.ok(modeBlock.includes("feedback"), "recall-check must return feedback");
    assert.ok(modeBlock.includes("hint"), "recall-check must return hint");
    assert.ok(!modeBlock.includes("callElevenLabs"), "recall-check must NOT call ElevenLabs");
  });

  test("recall-check has error handling fallback", () => {
    const modeStart = chatJs.indexOf(`mode === "recall-check"`);
    const modeBlock = chatJs.slice(modeStart, modeStart + 3000);
    assert.ok(
      modeBlock.includes("Could not evaluate"),
      "recall-check must have a user-friendly error fallback message"
    );
  });
});

// ---------------------------------------------------------------------------
// Recall MCQ: read correct phrase aloud before auto-advancing
// ---------------------------------------------------------------------------

describe("recall MCQ audio-before-advance — app.js", () => {
  const appJs = readFile("app.js");

  function getHandlePhraseMCBody() {
    const fnStart = appJs.indexOf("function handlePhraseMC(");
    assert.ok(fnStart !== -1, "handlePhraseMC function not found");
    const fnEnd = appJs.indexOf("\nfunction ", fnStart + 1);
    return appJs.slice(fnStart, fnEnd);
  }

  test("handlePhraseMC exists", () => {
    assert.ok(appJs.includes("function handlePhraseMC("), "handlePhraseMC must exist");
  });

  test("handlePhraseMC highlights mc-correct and mc-wrong buttons", () => {
    const body = getHandlePhraseMCBody();
    assert.ok(body.includes("mc-correct"), "must add mc-correct class to correct button");
    assert.ok(body.includes("mc-wrong"), "must add mc-wrong class to wrong button");
    assert.ok(body.includes("btn.disabled = true"), "must disable buttons after selection");
  });

  test("handlePhraseMC plays audio file when available via ended event", () => {
    const body = getHandlePhraseMCBody();
    assert.ok(
      body.includes(`addEventListener("ended"`),
      "must listen to audio ended event to advance after playback"
    );
    assert.ok(
      body.includes(`removeEventListener("ended"`),
      "must remove ended listener after it fires to prevent stacking"
    );
  });

  test("handlePhraseMC removes error listener alongside ended listener", () => {
    const body = getHandlePhraseMCBody();
    assert.ok(
      body.includes(`addEventListener("error"`),
      "must listen to audio error event as fallback"
    );
    assert.ok(
      body.includes(`removeEventListener("error"`),
      "must clean up error listener"
    );
  });

  test("handlePhraseMC falls back to speakGerman TTS when no audio file", () => {
    const body = getHandlePhraseMCBody();
    assert.ok(
      body.includes("speakGerman("),
      "must call speakGerman as TTS fallback when no audio file"
    );
  });

  test("handlePhraseMC advances via utter.onend when using TTS fallback", () => {
    const body = getHandlePhraseMCBody();
    assert.ok(
      body.includes("utter.onend"),
      "TTS fallback must advance on utter.onend, not a fixed timeout"
    );
  });

  test("handlePhraseMC has a safety timeout on audio.play() failure", () => {
    const body = getHandlePhraseMCBody();
    assert.ok(
      body.includes(".catch("),
      "must handle audio.play() promise rejection with a fallback timeout"
    );
  });

  test("handlePhraseMC does NOT use a single unconditional setTimeout for advance", () => {
    const body = getHandlePhraseMCBody();
    // Old code: setTimeout(() => advance(1), isCorrect ? 900 : 1600)
    // New code should not have advance(1) called from a top-level fixed timeout
    assert.ok(
      !body.includes("setTimeout(() => advance(1), isCorrect"),
      "must not use a single unconditional fixed timeout to advance (timing must follow audio)"
    );
  });

  test("handlePhraseMC updates SRS and session stats before playing audio", () => {
    const body = getHandlePhraseMCBody();
    const srsPos = body.indexOf("updateOnGotIt");
    const audioPos = body.indexOf("correctPhrase?.audio");
    assert.ok(srsPos !== -1, "updateOnGotIt must be present");
    assert.ok(audioPos !== -1, "audio playback block must be present");
    assert.ok(srsPos < audioPos, "SRS update must happen before audio playback");
  });

  test("handlePhraseMC finds correctPhrase from PHRASES array", () => {
    const body = getHandlePhraseMCBody();
    assert.ok(
      body.includes("PHRASES.find(p => p.id === correctId)"),
      "must look up correctPhrase from PHRASES by correctId"
    );
  });
});

// ---------------------------------------------------------------------------
// Feature 1: Conversation Starters
// ---------------------------------------------------------------------------

function loadStarters() {
  const content = readFile("app.js");
  const start = content.indexOf("const STARTER_CATEGORIES = {");
  const end = content.indexOf("// ---- State ----");
  assert.ok(start !== -1, "STARTER_CATEGORIES not found in app.js");
  assert.ok(end !== -1, "State section marker not found in app.js");
  const snippet = content.slice(start, end).trim()
    .replace(/\bconst\s+/g, "");
  const ctx = {};
  vm.runInNewContext(snippet, ctx);
  return { categories: ctx.STARTER_CATEGORIES, starters: ctx.STARTERS };
}

describe("conversation starters — data integrity", () => {
  const { categories, starters } = loadStarters();

  test("STARTER_CATEGORIES has the 5 expected keys", () => {
    const keys = Object.keys(categories);
    for (const k of ["classroom", "clarification", "answering", "social", "escape"]) {
      assert.ok(keys.includes(k), `Missing category: ${k}`);
    }
  });

  test("STARTERS array has at least 40 entries", () => {
    assert.ok(starters.length >= 40, `Expected >= 40 starters, got ${starters.length}`);
  });

  test("every starter has required fields: id, cat, german, english, level", () => {
    const missing = starters.filter(s =>
      !s.id || !s.cat || !s.german || !s.english || !s.level
    );
    assert.equal(missing.length, 0,
      `Starters missing fields: ${missing.map(s => s.id).join(", ")}`
    );
  });

  test("every starter cat is a valid STARTER_CATEGORIES key", () => {
    const validCats = Object.keys(categories);
    const bad = starters.filter(s => !validCats.includes(s.cat));
    assert.equal(bad.length, 0,
      `Starters with invalid cat: ${bad.map(s => s.id).join(", ")}`
    );
  });

  test("every starter level is a valid CEFR level", () => {
    const validLevels = ["a1", "a2", "b1", "b2", "c1", "c2"];
    const bad = starters.filter(s => !validLevels.includes(s.level));
    assert.equal(bad.length, 0,
      `Starters with invalid level: ${bad.map(s => s.id).join(", ")}`
    );
  });

  test("starter ids are unique", () => {
    const ids = starters.map(s => s.id);
    const unique = new Set(ids);
    assert.equal(unique.size, ids.length, "Duplicate starter ids found");
  });

  test("all 5 categories are represented", () => {
    const cats = new Set(starters.map(s => s.cat));
    for (const k of ["classroom", "clarification", "answering", "social", "escape"]) {
      assert.ok(cats.has(k), `Category '${k}' has no starters`);
    }
  });

  test("classroom has at least 8 starters", () => {
    const n = starters.filter(s => s.cat === "classroom").length;
    assert.ok(n >= 8, `Expected >= 8 classroom starters, got ${n}`);
  });

  test("escape/buy-time has at least 5 starters", () => {
    const n = starters.filter(s => s.cat === "escape").length;
    assert.ok(n >= 5, `Expected >= 5 escape starters, got ${n}`);
  });

  test("german phrases are non-empty strings", () => {
    const bad = starters.filter(s => typeof s.german !== "string" || s.german.trim() === "");
    assert.equal(bad.length, 0, "Some starters have empty german field");
  });
});

describe("conversation starters — HTML structure", () => {
  const html = readFile("index.html");

  test("starters tab exists in sidebar nav", () => {
    assert.ok(html.includes('data-mode="starters"'), "Starters tab not found");
  });

  test("#starters-panel element exists", () => {
    assert.ok(html.includes('id="starters-panel"'), "#starters-panel missing");
  });

  test("#starters-list element exists", () => {
    assert.ok(html.includes('id="starters-list"'), "#starters-list missing");
  });

  test("#starters-filter-bar exists", () => {
    assert.ok(html.includes('id="starters-filter-bar"'), "#starters-filter-bar missing");
  });

  test("filter chips cover all 5 categories", () => {
    for (const cat of ["classroom", "clarification", "answering", "social", "escape"]) {
      assert.ok(html.includes(`data-cat="${cat}"`), `Filter chip for '${cat}' missing`);
    }
  });

  test("#starter-practice-modal exists", () => {
    assert.ok(html.includes('id="starter-practice-modal"'), "#starter-practice-modal missing");
  });

  test("#starter-practice-german element exists", () => {
    assert.ok(html.includes('id="starter-practice-german"'), "#starter-practice-german missing");
  });

  test("#starter-mic-btn exists", () => {
    assert.ok(html.includes('id="starter-mic-btn"'), "#starter-mic-btn missing");
  });

  test("#starter-mark-done-btn exists", () => {
    assert.ok(html.includes('id="starter-mark-done-btn"'), "#starter-mark-done-btn missing");
  });

  test("#starters-progress-count exists", () => {
    assert.ok(html.includes('id="starters-progress-count"'), "#starters-progress-count missing");
  });
});

describe("conversation starters — CSS", () => {
  const css = readFile("style.css");

  test(".starter-card styles present", () => {
    assert.ok(css.includes(".starter-card"), ".starter-card CSS missing");
  });

  test(".practiced-today styles present", () => {
    assert.ok(css.includes(".practiced-today"), ".practiced-today CSS missing");
  });

  test(".starter-cat-badge styles present", () => {
    assert.ok(css.includes(".starter-cat-badge"), ".starter-cat-badge CSS missing");
  });

  test("#starter-practice-modal styles present", () => {
    assert.ok(css.includes("#starter-practice-modal"), "#starter-practice-modal CSS missing");
  });

  test(".starter-hear-btn styles present", () => {
    assert.ok(css.includes(".starter-hear-btn"), ".starter-hear-btn CSS missing");
  });

  test("#starter-mic-btn recording state styled", () => {
    assert.ok(css.includes("#starter-mic-btn.recording"), "#starter-mic-btn.recording CSS missing");
  });
});

describe("conversation starters — app.js functions", () => {
  const appJs = readFile("app.js");

  test("showStartersPanel function is defined", () => {
    assert.ok(appJs.includes("function showStartersPanel("), "showStartersPanel missing");
  });

  test("renderStartersPanel function is defined", () => {
    assert.ok(appJs.includes("function renderStartersPanel("), "renderStartersPanel missing");
  });

  test("openStarterPractice function is defined", () => {
    assert.ok(appJs.includes("function openStarterPractice("), "openStarterPractice missing");
  });

  test("closeStarterPractice function is defined", () => {
    assert.ok(appJs.includes("function closeStarterPractice("), "closeStarterPractice missing");
  });

  test("starterMarkDone function is defined", () => {
    assert.ok(appJs.includes("function starterMarkDone("), "starterMarkDone missing");
  });

  test("setupStarterPracticeModal is called in init()", () => {
    assert.ok(appJs.includes("setupStarterPracticeModal()"), "setupStarterPracticeModal() not called");
  });

  test("starters mode included in renderCard guard", () => {
    const guardMatch = appJs.match(/if \(mode === "ai"[^)]+\) return;/g);
    assert.ok(guardMatch && guardMatch.length > 0, "renderCard guard not found");
    assert.ok(guardMatch.some(g => g.includes('"starters"')), "starters not in renderCard guard");
  });

  test("starters mode handled in setupEvents tab click", () => {
    assert.ok(
      appJs.includes('newMode === "starters"'),
      "starters mode not handled in setupEvents"
    );
  });

  test("getStartersPracticedToday uses daily localStorage key", () => {
    assert.ok(
      appJs.includes("starters_practiced_"),
      "localStorage key pattern missing"
    );
  });

  test("markStarterPracticed updates localStorage set", () => {
    assert.ok(
      appJs.includes("function markStarterPracticed("),
      "markStarterPracticed function missing"
    );
    const fnStart = appJs.indexOf("function markStarterPracticed(");
    const fnEnd = appJs.indexOf("\nfunction ", fnStart + 1);
    const body = appJs.slice(fnStart, fnEnd);
    assert.ok(body.includes("localStorage.setItem"), "markStarterPracticed must call setItem");
  });

  test("startStarterMic attempts Deepgram token then falls back to SpeechRecognition", () => {
    const fnStart = appJs.indexOf("async function startStarterMic(");
    const fnEnd = appJs.indexOf("\nfunction ", fnStart + 1);
    const body = appJs.slice(fnStart, fnEnd);
    assert.ok(body.includes("/api/deepgram-token"), "Deepgram token fetch missing");
    assert.ok(body.includes("SpeechRecognition"), "SpeechRecognition fallback missing");
  });

  test("all show*Panel functions hide #starters-panel", () => {
    const panels = ["showPlayerPanel", "showAIPanel", "showProgressPanel",
                    "showVocabPanel", "showGrammarPanel", "showWordsPanel"];
    for (const fn of panels) {
      const start = appJs.indexOf(`function ${fn}(`);
      assert.ok(start !== -1, `${fn} not found`);
      const end = appJs.indexOf("\nfunction ", start + 1);
      const body = appJs.slice(start, end);
      assert.ok(
        body.includes('"starters-panel"'),
        `${fn} does not hide #starters-panel`
      );
    }
  });
});

// ---------------------------------------------------------------------------
// Feature 2: Just Say It (Speak panel)
// ---------------------------------------------------------------------------

function loadSpeakPrompts() {
  const content = readFile("app.js");
  const start = content.indexOf("const SPEAK_PROMPTS = [");
  assert.ok(start !== -1, "SPEAK_PROMPTS not found in app.js");
  const end = content.indexOf("const SPEAK_DURATION", start);
  assert.ok(end !== -1, "SPEAK_DURATION not found after SPEAK_PROMPTS");
  const snippet = content.slice(start, end).trim()
    .replace(/\bconst\s+/g, "");
  const ctx = {};
  vm.runInNewContext(snippet, ctx);
  return ctx.SPEAK_PROMPTS;
}

describe("just say it — SPEAK_PROMPTS data", () => {
  const prompts = loadSpeakPrompts();

  test("SPEAK_PROMPTS has at least 15 entries", () => {
    assert.ok(prompts.length >= 15, `Expected >= 15 prompts, got ${prompts.length}`);
  });

  test("every prompt has required fields: id, cat, prompt, hint", () => {
    const missing = prompts.filter(p => !p.id || !p.cat || !p.prompt || !p.hint);
    assert.equal(missing.length, 0,
      `Prompts missing fields: ${missing.map(p => p.id).join(", ")}`
    );
  });

  test("prompt ids are unique", () => {
    const ids = prompts.map(p => p.id);
    assert.equal(new Set(ids).size, ids.length, "Duplicate prompt ids found");
  });

  test("all prompts and hints are non-empty strings", () => {
    const bad = prompts.filter(p =>
      typeof p.prompt !== "string" || p.prompt.trim() === "" ||
      typeof p.hint !== "string" || p.hint.trim() === ""
    );
    assert.equal(bad.length, 0, "Some prompts have empty prompt or hint");
  });

  test("escape/buy-time scenarios are included", () => {
    const escapeCats = prompts.filter(p => p.cat === "escape");
    assert.ok(escapeCats.length >= 2, "Expected at least 2 escape scenarios");
  });

  test("classroom scenarios are included", () => {
    const classroomCats = prompts.filter(p => p.cat === "classroom");
    assert.ok(classroomCats.length >= 3, "Expected at least 3 classroom scenarios");
  });
});

describe("just say it — HTML structure", () => {
  const html = readFile("index.html");

  test("speak tab exists in sidebar nav", () => {
    assert.ok(html.includes('data-mode="speak"'), "Speak tab not found");
  });

  test("#speak-panel element exists", () => {
    assert.ok(html.includes('id="speak-panel"'), "#speak-panel missing");
  });

  test("#speak-scenario-text element exists", () => {
    assert.ok(html.includes('id="speak-scenario-text"'), "#speak-scenario-text missing");
  });

  test("#speak-timer-ring-wrap exists", () => {
    assert.ok(html.includes('id="speak-timer-ring-wrap"'), "#speak-timer-ring-wrap missing");
  });

  test("#speak-timer-arc SVG element exists", () => {
    assert.ok(html.includes('id="speak-timer-arc"'), "#speak-timer-arc missing");
  });

  test("#speak-start-btn exists", () => {
    assert.ok(html.includes('id="speak-start-btn"'), "#speak-start-btn missing");
  });

  test("#speak-skip-btn exists", () => {
    assert.ok(html.includes('id="speak-skip-btn"'), "#speak-skip-btn missing");
  });

  test("#speak-feedback-area exists", () => {
    assert.ok(html.includes('id="speak-feedback-area"'), "#speak-feedback-area missing");
  });

  test("#speak-transcript-area exists", () => {
    assert.ok(html.includes('id="speak-transcript-area"'), "#speak-transcript-area missing");
  });

  test("#speak-next-btn exists", () => {
    assert.ok(html.includes('id="speak-next-btn"'), "#speak-next-btn missing");
  });
});

describe("just say it — CSS", () => {
  const css = readFile("style.css");

  test("#speak-panel styles present", () => {
    assert.ok(css.includes("#speak-panel"), "#speak-panel CSS missing");
  });

  test("#speak-timer-arc styles present", () => {
    assert.ok(css.includes("#speak-timer-arc"), "#speak-timer-arc CSS missing");
  });

  test("stroke-dasharray constant set on timer arc", () => {
    assert.ok(css.includes("stroke-dasharray"), "stroke-dasharray missing from timer arc");
  });

  test("#speak-start-btn recording state styled", () => {
    assert.ok(css.includes("#speak-start-btn.recording"), "#speak-start-btn.recording CSS missing");
  });

  test("#speak-scenario-card styles present", () => {
    assert.ok(css.includes("#speak-scenario-card"), "#speak-scenario-card CSS missing");
  });
});

describe("just say it — app.js functions", () => {
  const appJs = readFile("app.js");

  test("showSpeakPanel function is defined", () => {
    assert.ok(appJs.includes("function showSpeakPanel("), "showSpeakPanel missing");
  });

  test("speakStartRecording function is defined", () => {
    assert.ok(appJs.includes("async function speakStartRecording("), "speakStartRecording missing");
  });

  test("speakTimeUp function is defined", () => {
    assert.ok(appJs.includes("async function speakTimeUp("), "speakTimeUp missing");
  });

  test("setupSpeakPanel is called in init()", () => {
    assert.ok(appJs.includes("setupSpeakPanel()"), "setupSpeakPanel() not called");
  });

  test("speak mode included in renderCard guard", () => {
    const guardMatch = appJs.match(/if \(mode === "ai"[^)]+\) return;/g);
    assert.ok(guardMatch && guardMatch.length > 0, "renderCard guard not found");
    assert.ok(guardMatch.some(g => g.includes('"speak"')), "speak not in renderCard guard");
  });

  test("speak mode handled in setupEvents tab click", () => {
    assert.ok(appJs.includes('newMode === "speak"'), "speak mode not handled in setupEvents");
  });

  test("speakStartRecording fetches Deepgram token", () => {
    const start = appJs.indexOf("async function speakStartRecording(");
    const end = appJs.indexOf("\nfunction ", start + 1);
    const body = appJs.slice(start, end);
    assert.ok(body.includes("/api/deepgram-token"), "Deepgram token fetch missing from speakStartRecording");
  });

  test("speakTimeUp calls recordSpeakDone for streak tracking", () => {
    const start = appJs.indexOf("async function speakTimeUp(");
    const end = appJs.indexOf("\nfunction ", start + 1);
    const body = appJs.slice(start, end);
    assert.ok(body.includes("recordSpeakDone()"), "speakTimeUp must call recordSpeakDone");
  });

  test("speakTimeUp posts to speak-check API mode", () => {
    const start = appJs.indexOf("async function speakTimeUp(");
    const end = appJs.indexOf("\nfunction ", start + 1);
    const body = appJs.slice(start, end);
    assert.ok(body.includes('"speak-check"'), "speakTimeUp must POST to speak-check mode");
  });

  test("getSpeakStreak uses localStorage speak_streak key", () => {
    assert.ok(appJs.includes("speak_streak"), "speak_streak localStorage key missing");
  });

  test("all show*Panel functions hide #speak-panel", () => {
    const panels = ["showPlayerPanel", "showAIPanel", "showProgressPanel",
                    "showVocabPanel", "showGrammarPanel", "showWordsPanel", "showStartersPanel"];
    for (const fn of panels) {
      const start = appJs.indexOf(`function ${fn}(`);
      assert.ok(start !== -1, `${fn} not found`);
      const end = appJs.indexOf("\nfunction ", start + 1);
      const body = appJs.slice(start, end);
      assert.ok(body.includes('"speak-panel"'), `${fn} does not hide #speak-panel`);
    }
  });
});

describe("just say it — api/chat.js", () => {
  const chatJs = readFile("api/chat.js");

  test("speak-check mode exists in api/chat.js", () => {
    assert.ok(chatJs.includes('"speak-check"'), "speak-check mode missing from api/chat.js");
  });

  test("speak-check uses scenario prompt from request body", () => {
    const start = chatJs.indexOf('"speak-check"');
    const end = chatJs.indexOf("\n    if (mode", start + 1);
    const body = chatJs.slice(start, end);
    assert.ok(body.includes("scenario") || body.includes("prompt"), "speak-check must use scenario/prompt");
  });

  test("speak-check returns feedback field", () => {
    const start = chatJs.indexOf('"speak-check"');
    const end = chatJs.indexOf("\n    if (mode", start + 1);
    const body = chatJs.slice(start, end);
    assert.ok(body.includes("feedback"), "speak-check response must include feedback");
  });

  test("speak-check has error fallback", () => {
    const start = chatJs.indexOf('"speak-check"');
    const end = chatJs.indexOf("\n    if (mode", start + 1);
    const body = chatJs.slice(start, end);
    assert.ok(body.includes("catch"), "speak-check must have error fallback");
  });
});
