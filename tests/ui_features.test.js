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

  test("#speak-improve-btn exists (hidden initially)", () => {
    assert.ok(html.includes('id="speak-improve-btn"'), "#speak-improve-btn missing");
  });

  test("#speak-improve-area exists (hidden initially)", () => {
    assert.ok(html.includes('id="speak-improve-area"'), "#speak-improve-area missing");
  });

  test("#speak-improve-text element exists", () => {
    assert.ok(html.includes('id="speak-improve-text"'), "#speak-improve-text missing");
  });

  test("#speak-improve-notes element exists", () => {
    assert.ok(html.includes('id="speak-improve-notes"'), "#speak-improve-notes missing");
  });

  test("#speak-copy-btn exists", () => {
    assert.ok(html.includes('id="speak-copy-btn"'), "#speak-copy-btn missing");
  });

  test("#speak-add-phrases-btn exists", () => {
    assert.ok(html.includes('id="speak-add-phrases-btn"'), "#speak-add-phrases-btn missing");
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

  test("#speak-improve-area styles present", () => {
    assert.ok(css.includes("#speak-improve-area"), "#speak-improve-area CSS missing");
  });

  test("#speak-improve-btn styles present", () => {
    assert.ok(css.includes("#speak-improve-btn"), "#speak-improve-btn CSS missing");
  });

  test("#speak-copy-btn styles present", () => {
    assert.ok(css.includes("#speak-copy-btn"), "#speak-copy-btn CSS missing");
  });

  test("#speak-copy-btn.copied state styled", () => {
    assert.ok(css.includes("#speak-copy-btn.copied"), "#speak-copy-btn.copied CSS missing");
  });

  test("#speak-improve-notes list styles present", () => {
    assert.ok(css.includes("#speak-improve-notes"), "#speak-improve-notes CSS missing");
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

  test("speakGetImproved function is defined", () => {
    assert.ok(appJs.includes("async function speakGetImproved("), "speakGetImproved missing");
  });

  test("speakGetImproved posts to speak-improve API mode", () => {
    const start = appJs.indexOf("async function speakGetImproved(");
    const end = appJs.indexOf("\nfunction ", start + 1);
    const body = appJs.slice(start, end);
    assert.ok(body.includes('"speak-improve"'), "speakGetImproved must POST to speak-improve mode");
  });

  test("speakGetImproved shows notes when returned", () => {
    const start = appJs.indexOf("async function speakGetImproved(");
    const end = appJs.indexOf("\nfunction ", start + 1);
    const body = appJs.slice(start, end);
    assert.ok(body.includes("speak-improve-notes"), "speakGetImproved must render notes");
  });

  test("speakCopyImproved copies to clipboard", () => {
    assert.ok(appJs.includes("function speakCopyImproved("), "speakCopyImproved missing");
    const start = appJs.indexOf("function speakCopyImproved(");
    const end = appJs.indexOf("\nfunction ", start + 1);
    const body = appJs.slice(start, end);
    assert.ok(body.includes("navigator.clipboard.writeText"), "speakCopyImproved must use clipboard API");
  });

  test("speakAddPhrasesToStarters adds to STARTERS array", () => {
    assert.ok(appJs.includes("function speakAddPhrasesToStarters("), "speakAddPhrasesToStarters missing");
    const start = appJs.indexOf("function speakAddPhrasesToStarters(");
    const end = appJs.indexOf("\nfunction ", start + 1);
    const body = appJs.slice(start, end);
    assert.ok(body.includes("STARTERS.push"), "speakAddPhrasesToStarters must push to STARTERS");
  });

  test("improve-btn click is wired up in setupSpeakPanel", () => {
    const start = appJs.indexOf("function setupSpeakPanel(");
    const end = appJs.indexOf("\nfunction ", start + 1);
    const body = appJs.slice(start, end);
    assert.ok(body.includes("speak-improve-btn"), "speak-improve-btn not wired in setupSpeakPanel");
    assert.ok(body.includes("speakGetImproved"), "speakGetImproved not wired in setupSpeakPanel");
  });

  test("copy-btn click is wired up in setupSpeakPanel", () => {
    const start = appJs.indexOf("function setupSpeakPanel(");
    const end = appJs.indexOf("\nfunction ", start + 1);
    const body = appJs.slice(start, end);
    assert.ok(body.includes("speak-copy-btn"), "speak-copy-btn not wired in setupSpeakPanel");
    assert.ok(body.includes("speakCopyImproved"), "speakCopyImproved not wired in setupSpeakPanel");
  });

  test("speakTimeUp shows improve-btn when transcript is present", () => {
    const start = appJs.indexOf("async function speakTimeUp(");
    const end = appJs.indexOf("\nfunction ", start + 1);
    const body = appJs.slice(start, end);
    assert.ok(body.includes("speak-improve-btn"), "speakTimeUp must show/hide speak-improve-btn");
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

  test("speak-improve mode exists in api/chat.js", () => {
    assert.ok(chatJs.includes('"speak-improve"'), "speak-improve mode missing from api/chat.js");
  });

  test("speak-improve returns improved, notes, and new_phrases", () => {
    const start = chatJs.indexOf('"speak-improve"');
    const end = chatJs.indexOf("\n    if (mode", start + 1);
    const body = chatJs.slice(start, end);
    assert.ok(body.includes("improved"), "speak-improve must return improved field");
    assert.ok(body.includes("notes"), "speak-improve must return notes field");
    assert.ok(body.includes("new_phrases"), "speak-improve must return new_phrases field");
  });

  test("speak-improve prompt instructs AI to write a natural response and notes", () => {
    const start = chatJs.indexOf('"speak-improve"');
    const end = chatJs.indexOf("\n    if (mode", start + 1);
    const body = chatJs.slice(start, end);
    assert.ok(body.includes("notes"), "prompt must ask for change notes");
    assert.ok(body.includes("new_phrases") || body.includes("phrases"), "prompt must ask for reusable phrases");
  });

  test("speak-improve has error fallback", () => {
    const start = chatJs.indexOf('"speak-improve"');
    const end = chatJs.indexOf("\n    if (mode", start + 1);
    const body = chatJs.slice(start, end);
    assert.ok(body.includes("catch"), "speak-improve must have error fallback");
  });
});

// ---------------------------------------------------------------------------
// Feature 3: Think in German (Inner Monologue)
// ---------------------------------------------------------------------------

function loadMonologuePrompts() {
  const content = readFile("app.js");
  const start = content.indexOf("const MONOLOGUE_PROMPTS = [");
  assert.ok(start !== -1, "MONOLOGUE_PROMPTS not found in app.js");
  const end = content.indexOf("let monologuePromptIndex", start);
  assert.ok(end !== -1, "monologuePromptIndex not found after MONOLOGUE_PROMPTS");
  const snippet = content.slice(start, end).trim().replace(/\bconst\s+/g, "");
  const ctx = {};
  vm.runInNewContext(snippet, ctx);
  return ctx.MONOLOGUE_PROMPTS;
}

describe("think in german — MONOLOGUE_PROMPTS data", () => {
  const prompts = loadMonologuePrompts();

  test("MONOLOGUE_PROMPTS has at least 15 entries", () => {
    assert.ok(prompts.length >= 15, `Expected >= 15 prompts, got ${prompts.length}`);
  });

  test("every prompt has required fields: id, cat, prompt", () => {
    const missing = prompts.filter(p => !p.id || !p.cat || !p.prompt);
    assert.equal(missing.length, 0,
      `Prompts missing fields: ${missing.map(p => p.id).join(", ")}`
    );
  });

  test("prompt ids are unique", () => {
    const ids = prompts.map(p => p.id);
    assert.equal(new Set(ids).size, ids.length, "Duplicate prompt ids found");
  });

  test("all prompts are non-empty strings", () => {
    const bad = prompts.filter(p => typeof p.prompt !== "string" || p.prompt.trim() === "");
    assert.equal(bad.length, 0, "Some prompts have empty prompt text");
  });

  test("course-related prompts are included", () => {
    const n = prompts.filter(p => p.cat === "course").length;
    assert.ok(n >= 3, `Expected >= 3 course prompts, got ${n}`);
  });

  test("reflection prompts are included", () => {
    const n = prompts.filter(p => p.cat === "reflect").length;
    assert.ok(n >= 3, `Expected >= 3 reflect prompts, got ${n}`);
  });
});

describe("think in german — HTML structure", () => {
  const html = readFile("index.html");

  test("monologue tab exists in sidebar nav", () => {
    assert.ok(html.includes('data-mode="monologue"'), "monologue tab not found");
  });

  test("#monologue-panel element exists", () => {
    assert.ok(html.includes('id="monologue-panel"'), "#monologue-panel missing");
  });

  test("#monologue-prompt-text element exists", () => {
    assert.ok(html.includes('id="monologue-prompt-text"'), "#monologue-prompt-text missing");
  });

  test("#monologue-input textarea exists", () => {
    assert.ok(html.includes('id="monologue-input"'), "#monologue-input missing");
  });

  test("#monologue-submit-btn exists and starts disabled", () => {
    assert.ok(html.includes('id="monologue-submit-btn"'), "#monologue-submit-btn missing");
    assert.ok(html.includes('id="monologue-submit-btn" disabled'), "#monologue-submit-btn should be disabled initially");
  });

  test("#monologue-reflection-area exists", () => {
    assert.ok(html.includes('id="monologue-reflection-area"'), "#monologue-reflection-area missing");
  });

  test("#monologue-new-prompt-btn exists", () => {
    assert.ok(html.includes('id="monologue-new-prompt-btn"'), "#monologue-new-prompt-btn missing");
  });

  test("#monologue-streak-badge exists", () => {
    assert.ok(html.includes('id="monologue-streak-badge"'), "#monologue-streak-badge missing");
  });

  test("#monologue-count-num exists", () => {
    assert.ok(html.includes('id="monologue-count-num"'), "#monologue-count-num missing");
  });
});

describe("think in german — CSS", () => {
  const css = readFile("style.css");

  test("#monologue-panel styles present", () => {
    assert.ok(css.includes("#monologue-panel"), "#monologue-panel CSS missing");
  });

  test("#monologue-input styles present", () => {
    assert.ok(css.includes("#monologue-input"), "#monologue-input CSS missing");
  });

  test("#monologue-submit-btn disabled state styled", () => {
    assert.ok(css.includes("#monologue-submit-btn:disabled"), "#monologue-submit-btn:disabled CSS missing");
  });

  test("#monologue-prompt-card styles present", () => {
    assert.ok(css.includes("#monologue-prompt-card"), "#monologue-prompt-card CSS missing");
  });

  test("#monologue-streak-badge visible class styled", () => {
    assert.ok(css.includes("#monologue-streak-badge.visible"), "#monologue-streak-badge.visible CSS missing");
  });
});

describe("think in german — app.js functions", () => {
  const appJs = readFile("app.js");

  test("showMonologuePanel function is defined", () => {
    assert.ok(appJs.includes("function showMonologuePanel("), "showMonologuePanel missing");
  });

  test("submitMonologue function is defined", () => {
    assert.ok(appJs.includes("async function submitMonologue("), "submitMonologue missing");
  });

  test("recordMonologueDone function is defined", () => {
    assert.ok(appJs.includes("function recordMonologueDone("), "recordMonologueDone missing");
  });

  test("setupMonologuePanel is called in init()", () => {
    assert.ok(appJs.includes("setupMonologuePanel()"), "setupMonologuePanel() not called");
  });

  test("monologue mode included in renderCard guard", () => {
    const guardMatch = appJs.match(/if \(mode === "ai"[^)]+\) return;/g);
    assert.ok(guardMatch && guardMatch.length > 0, "renderCard guard not found");
    assert.ok(guardMatch.some(g => g.includes('"monologue"')), "monologue not in renderCard guard");
  });

  test("monologue mode handled in setupEvents tab click", () => {
    assert.ok(appJs.includes('newMode === "monologue"'), "monologue mode not handled in setupEvents");
  });

  test("submitMonologue posts to monologue-reflect API mode", () => {
    const start = appJs.indexOf("async function submitMonologue(");
    const end = appJs.indexOf("\nfunction ", start + 1);
    const body = appJs.slice(start, end);
    assert.ok(body.includes('"monologue-reflect"'), "submitMonologue must POST to monologue-reflect mode");
  });

  test("recordMonologueDone updates daily count and streak", () => {
    const start = appJs.indexOf("function recordMonologueDone(");
    const end = appJs.indexOf("\nfunction ", start + 1);
    const body = appJs.slice(start, end);
    assert.ok(body.includes("monologue_done_"), "daily count key missing");
    assert.ok(body.includes("monologue_streak"), "streak key missing");
  });

  test("submit button enables only after 10+ chars", () => {
    const start = appJs.indexOf("function setupMonologuePanel(");
    const end = appJs.indexOf("\nfunction ", start + 1);
    const body = appJs.slice(start, end);
    assert.ok(body.includes("< 10"), "10-char minimum check missing");
  });

  test("all show*Panel functions hide #monologue-panel", () => {
    const panels = ["showPlayerPanel", "showAIPanel", "showProgressPanel",
                    "showVocabPanel", "showGrammarPanel", "showWordsPanel",
                    "showStartersPanel", "showSpeakPanel"];
    for (const fn of panels) {
      const start = appJs.indexOf(`function ${fn}(`);
      assert.ok(start !== -1, `${fn} not found`);
      const end = appJs.indexOf("\nfunction ", start + 1);
      const body = appJs.slice(start, end);
      assert.ok(body.includes('"monologue-panel"'), `${fn} does not hide #monologue-panel`);
    }
  });
});

describe("think in german — api/chat.js", () => {
  const chatJs = readFile("api/chat.js");

  test("monologue-reflect mode exists in api/chat.js", () => {
    assert.ok(chatJs.includes('"monologue-reflect"'), "monologue-reflect mode missing from api/chat.js");
  });

  test("monologue-reflect uses thought prompt from request body", () => {
    const start = chatJs.indexOf('"monologue-reflect"');
    const end = chatJs.indexOf("\n    if (mode", start + 1);
    const body = chatJs.slice(start, end);
    assert.ok(body.includes("thoughtPrompt") || body.includes("prompt"), "monologue-reflect must use prompt");
  });

  test("monologue-reflect returns reflection field", () => {
    const start = chatJs.indexOf('"monologue-reflect"');
    const end = chatJs.indexOf("\n    if (mode", start + 1);
    const body = chatJs.slice(start, end);
    assert.ok(body.includes("reflection"), "monologue-reflect response must include reflection");
  });

  test("monologue-reflect has error fallback", () => {
    const start = chatJs.indexOf('"monologue-reflect"');
    const end = chatJs.indexOf("\n    if (mode", start + 1);
    const body = chatJs.slice(start, end);
    assert.ok(body.includes("catch"), "monologue-reflect must have error fallback");
  });
});

// ---------------------------------------------------------------------------
// Mobile bottom nav: 4 primary tabs + "More" sheet
// ---------------------------------------------------------------------------

describe("mobile more-nav — index.html", () => {
  const html = readFile("index.html");

  test("nav has group labels for desktop sidebar", () => {
    for (const label of ["Practice", "Conversation", "Vocabulary", "Grammar", "Explore"]) {
      assert.ok(
        html.includes(`<div class="nav-group-label">${label}</div>`),
        `Missing nav group label: ${label}`
      );
    }
  });

  test("all 15 mode tabs still exist", () => {
    const modes = ["today", "listen", "shadow", "stories", "recall", "ai", "progress", "vocab", "grammar",
      "words", "drills", "starters", "speak", "monologue", "games"];
    for (const m of modes) {
      assert.ok(html.includes(`data-mode="${m}"`), `Missing tab: ${m}`);
    }
  });
});

describe("mobile more-nav — app.js", () => {
  const appJs = readFile("app.js");

  test("setupMobileMoreNav function is defined", () => {
    assert.ok(appJs.includes("function setupMobileMoreNav()"), "setupMobileMoreNav not defined");
  });

  test("setupMobileMoreNav is called in init()", () => {
    const start = appJs.indexOf("function init()");
    const end = appJs.indexOf("function renderCard");
    assert.ok(appJs.slice(start, end).includes("setupMobileMoreNav()"), "setupMobileMoreNav not called in init");
  });

  test("primary mobile modes are today/recall/speak/ai", () => {
    assert.ok(
      /MOBILE_PRIMARY_MODES\s*=\s*\["today",\s*"recall",\s*"speak",\s*"ai"\]/.test(appJs),
      "MOBILE_PRIMARY_MODES mismatch"
    );
  });

  test("more sheet groups cover every non-primary mode", () => {
    const start = appJs.indexOf("const MORE_SHEET_GROUPS");
    const end = appJs.indexOf("];", start);
    const block = appJs.slice(start, end);
    for (const m of ["listen", "shadow", "stories", "starters", "monologue", "words", "vocab", "grammar", "drills", "games", "progress"]) {
      assert.ok(block.includes(`"${m}"`), `Mode missing from MORE_SHEET_GROUPS: ${m}`);
    }
  });

  test("tab click handler closes sheet and syncs More state", () => {
    const start = appJs.indexOf("tabEls.forEach(tab => {");
    const end = appJs.indexOf("categorySelect.addEventListener", start);
    const block = appJs.slice(start, end);
    assert.ok(block.includes("closeMoreSheet()"), "tab click must close more sheet");
    assert.ok(block.includes("updateMoreTabState()"), "tab click must sync More tab state");
  });

  test("programmatic tab switches sync More state", () => {
    const pn = appJs.indexOf("function practiceNow");
    assert.ok(appJs.slice(pn, pn + 400).includes("updateMoreTabState()"), "practiceNow must sync More state");
    const gt = appJs.indexOf("function openGrammarTopic");
    assert.ok(appJs.slice(gt, gt + 400).includes("updateMoreTabState()"), "openGrammarTopic must sync More state");
  });
});

describe("mobile more-nav — style.css", () => {
  const css = readFile("style.css");

  test("more sheet styles exist", () => {
    for (const sel of ["#more-sheet {", "#more-sheet-inner {", ".more-group-label {", ".more-item {", ".more-item.active {"]) {
      assert.ok(css.includes(sel), `Missing CSS: ${sel}`);
    }
  });

  test("more-tab hidden on desktop", () => {
    assert.ok(css.includes("#more-tab { display: none; }"), "#more-tab must be hidden by default (desktop)");
  });

  test("mobile bar shows only primary tabs plus More", () => {
    const mq = css.indexOf("MOBILE LAYOUT");
    const block = css.slice(mq, mq + 4000);
    assert.ok(block.includes("#mode-tabs .tab { display: none; }"), "non-primary tabs must be hidden on mobile");
    for (const m of ["today", "recall", "speak", "ai"]) {
      assert.ok(block.includes(`.tab[data-mode="${m}"]`), `primary tab ${m} not shown on mobile`);
    }
    assert.ok(block.includes("#mode-tabs #more-tab"), "More tab not shown on mobile");
  });

  test("mobile tab bar no longer horizontally scrolls", () => {
    const mq = css.indexOf("MOBILE LAYOUT");
    const block = css.slice(mq, mq + 4000);
    assert.ok(!block.includes("overflow-x: auto;\n    overflow-y: hidden;"), "tab bar should not scroll horizontally");
  });

  test("nav group labels hidden on mobile", () => {
    const mq = css.indexOf("MOBILE LAYOUT");
    const block = css.slice(mq, mq + 4000);
    assert.ok(block.includes(".nav-group-label { display: none; }"), "group labels must be hidden on mobile");
  });
});

// ---------------------------------------------------------------------------
// Today guided session, due badges, drill mistake bank
// ---------------------------------------------------------------------------

describe("today session — index.html", () => {
  const html = readFile("index.html");

  test("today tab exists and is the default active tab", () => {
    assert.ok(html.includes('class="tab active" data-mode="today"'), "Today tab must be active by default");
  });

  test("#today-panel and its parts exist", () => {
    for (const id of ["today-panel", "today-summary", "today-start-btn", "today-plan",
      "today-phrases-due", "today-words-due", "today-mistakes-count", "today-streak-num",
      "today-mistakes-hint", "today-fix-mistakes-btn"]) {
      assert.ok(html.includes(`id="${id}"`), `Missing #${id}`);
    }
  });

  test("session bar exists with steps, label, and action buttons", () => {
    for (const id of ["today-session-bar", "tsb-steps", "tsb-label", "tsb-next-btn", "tsb-skip-btn", "tsb-end-btn"]) {
      assert.ok(html.includes(`id="${id}"`), `Missing #${id}`);
    }
  });

  test("recall and words tabs carry badge spans", () => {
    const matches = html.match(/<span class="tab-badge"><\/span>/g) || [];
    assert.ok(matches.length >= 2, "Expected badge spans on recall and words tabs");
  });
});

describe("today session — app.js", () => {
  const appJs = readFile("app.js");

  test("TODAY_STEPS covers phrases, words, speak, think in order", () => {
    const start = appJs.indexOf("const TODAY_STEPS");
    const end = appJs.indexOf("];", start);
    const block = appJs.slice(start, end);
    const order = ["phrases", "words", "speak", "think"];
    let pos = -1;
    for (const id of order) {
      const next = block.indexOf(`id: "${id}"`);
      assert.ok(next > pos, `TODAY_STEPS out of order or missing: ${id}`);
      pos = next;
    }
  });

  test("core session functions are defined", () => {
    for (const fn of ["showTodayPanel", "renderTodayPanel", "startTodaySession",
      "enterTodayStep", "advanceTodayStep", "completeTodaySession", "endTodaySession",
      "renderTodaySessionBar", "setupTodayPanel", "updateTabBadges"]) {
      assert.ok(appJs.includes(`function ${fn}(`), `${fn} not defined`);
    }
  });

  test("mode defaults to today and init lands on the Today panel", () => {
    assert.ok(appJs.includes('let mode = "today";'), "default mode must be today");
    const start = appJs.indexOf("function init()");
    const end = appJs.indexOf("function renderCard");
    const block = appJs.slice(start, end);
    assert.ok(block.includes("setupTodayPanel()"), "setupTodayPanel not called in init");
    assert.ok(block.includes("showTodayPanel()"), "showTodayPanel not called in init");
    assert.ok(block.includes("updateTabBadges()"), "updateTabBadges not called in init");
  });

  test("today mode included in renderCard and keydown guards", () => {
    const guards = appJs.match(/mode === "games" \|\| mode === "today"/g) || [];
    assert.ok(guards.length >= 2, "today missing from mode guards");
  });

  test("grading paths feed the session counters", () => {
    const gotIt = appJs.indexOf("function updateOnGotIt");
    assert.ok(appJs.slice(gotIt, gotIt + 600).includes("todayOnPhraseGraded()"), "updateOnGotIt must call todayOnPhraseGraded");
    const missed = appJs.indexOf("function updateOnMissed");
    assert.ok(appJs.slice(missed, missed + 600).includes("todayOnPhraseGraded()"), "updateOnMissed must call todayOnPhraseGraded");
    const word = appJs.indexOf("function handleWordSRS");
    assert.ok(appJs.slice(word, word + 400).includes("todayOnWordGraded()"), "handleWordSRS must call todayOnWordGraded");
    const speak = appJs.indexOf("async function speakTimeUp");
    assert.ok(appJs.slice(speak, speak + 500).includes("todayOnSpeakDone()"), "speakTimeUp must call todayOnSpeakDone");
    const mono = appJs.indexOf("async function submitMonologue");
    assert.ok(appJs.slice(mono, mono + 1600).includes("todayOnThinkDone()"), "submitMonologue must call todayOnThinkDone");
  });

  test("saving SRS data refreshes the tab badges", () => {
    const p = appJs.indexOf("function saveSrsData()");
    assert.ok(appJs.slice(p, p + 200).includes("updateTabBadges()"), "saveSrsData must refresh badges");
    const w = appJs.indexOf("function saveWordsSRS()");
    assert.ok(appJs.slice(w, w + 200).includes("updateTabBadges()"), "saveWordsSRS must refresh badges");
  });

  test("today streak uses its own localStorage key", () => {
    assert.ok(appJs.includes('"today_streak"'), "today_streak key missing");
  });
});

describe("drill mistake bank — app.js", () => {
  const appJs = readFile("app.js");

  test("bank CRUD functions are defined", () => {
    for (const fn of ["getDrillMistakeBank", "saveDrillMistakeBank", "addDrillMistake",
      "clearDrillMistake", "openMistakeReviewSession", "buildDrillQueueItem"]) {
      assert.ok(appJs.includes(`function ${fn}(`), `${fn} not defined`);
    }
  });

  test("answerDrill records misses and clears on correct", () => {
    const p = appJs.indexOf("function answerDrill");
    const block = appJs.slice(p, p + 1200);
    assert.ok(block.includes("clearDrillMistake(item.srcItem)"), "answerDrill must clear mistakes on correct");
    assert.ok(block.includes("addDrillMistake("), "answerDrill must record mistakes");
  });

  test("grammar sprint records misses and clears on correct", () => {
    const p = appJs.indexOf("function gsPickAnswer");
    const block = appJs.slice(p, p + 1200);
    assert.ok(block.includes("addDrillMistake("), "gsPickAnswer must record mistakes");
    assert.ok(block.includes("clearDrillMistake(item)"), "gsPickAnswer must clear mistakes on correct");
  });

  test("drills panel renders a mistake review card when bank is non-empty", () => {
    const p = appJs.indexOf("function renderDrillSetsPanel");
    const block = appJs.slice(p, p + 1500);
    assert.ok(block.includes("drill-mistakes-card"), "mistake review card missing from drills grid");
    assert.ok(block.includes("openMistakeReviewSession"), "mistake card must open review session");
  });

  test("bank persists under drillMistakeBank key", () => {
    assert.ok(appJs.includes('"drillMistakeBank"'), "drillMistakeBank key missing");
  });
});

// ---------------------------------------------------------------------------
// Stories: AI graded reader
// ---------------------------------------------------------------------------

describe("stories — index.html", () => {
  const html = readFile("index.html");

  test("stories tab exists in nav", () => {
    assert.ok(html.includes('data-mode="stories"'), "Stories tab not found");
  });

  test("#stories-panel and its parts exist", () => {
    for (const id of ["stories-panel", "stories-setup", "story-level-select", "story-type-select",
      "story-topic-select", "story-vocab-preview", "story-generate-btn", "story-loading",
      "story-error", "story-view", "story-title", "story-body", "story-quiz",
      "story-quiz-list", "story-play-all-btn", "story-show-en-btn", "story-new-btn"]) {
      assert.ok(html.includes(`id="${id}"`), `Missing #${id}`);
    }
  });

  test("level select covers a1-c1 and defaults to b1", () => {
    const start = html.indexOf('id="story-level-select"');
    const block = html.slice(start, html.indexOf("</select>", start));
    for (const lvl of ["a1", "a2", "b1", "b2", "c1"]) {
      assert.ok(block.includes(`value="${lvl}"`), `Missing level ${lvl}`);
    }
    assert.ok(block.includes('value="b1" selected'), "b1 should be default");
  });

  test("vocab modal has add-to-words button", () => {
    assert.ok(html.includes('id="vocab-add-btn"'), "Missing #vocab-add-btn");
  });
});

describe("stories — app.js", () => {
  const appJs = readFile("app.js");

  test("core story functions are defined", () => {
    for (const fn of ["showStoriesPanel", "pickStoryTargetWords", "generateStory",
      "renderStory", "renderStoryQuiz", "handleStoryQuizAnswer", "storyPlayAll",
      "storyStopPlayAll", "setupStoriesPanel", "storyWrapTapWords"]) {
      assert.ok(appJs.includes(`function ${fn}(`), `${fn} not defined`);
    }
  });

  test("setupStoriesPanel is called in init()", () => {
    const start = appJs.indexOf("function init()");
    const end = appJs.indexOf("function renderCard");
    assert.ok(appJs.slice(start, end).includes("setupStoriesPanel()"), "setupStoriesPanel not called in init");
  });

  test("stories mode included in renderCard and keydown guards", () => {
    const matches = appJs.match(/mode === "today" \|\| mode === "stories"/g) || [];
    assert.ok(matches.length >= 2, "stories missing from mode guards");
  });

  test("stories mode handled in setupEvents tab click", () => {
    assert.ok(appJs.includes('newMode === "stories"'), "stories not handled in tab click");
  });

  test("target word picker prefers due then weak then new at level", () => {
    const p = appJs.indexOf("function pickStoryTargetWords");
    const block = appJs.slice(p, p + 1200);
    assert.ok(block.includes('getWordStatus(w.id)'), "must use word SRS status");
    assert.ok(block.includes("easeFactor"), "must consider weak words by ease factor");
    assert.ok(block.includes("tier"), "must fall back to tier-appropriate new words");
  });

  test("generateStory posts story mode with level and target words", () => {
    const p = appJs.indexOf("async function generateStory");
    const block = appJs.slice(p, p + 1800);
    assert.ok(block.includes('mode: "story"'), "must post mode story");
    assert.ok(block.includes("targetWords"), "must send target words");
    assert.ok(block.includes("storyType"), "must send story type");
  });

  test("last story persists in localStorage", () => {
    assert.ok(appJs.includes('"lastStory"'), "lastStory key missing");
    assert.ok(appJs.includes('"stories_read_count"'), "stories_read_count key missing");
  });

  test("quiz completion records a read", () => {
    const p = appJs.indexOf("function handleStoryQuizAnswer");
    const block = appJs.slice(p, p + 1500);
    assert.ok(block.includes("recordStoryRead()"), "quiz completion must record a story read");
  });

  test("story words open the vocab popup via delegation", () => {
    const p = appJs.indexOf("function setupStoriesPanel");
    const block = appJs.slice(p, p + 3500);
    assert.ok(block.includes("openVocabPopup"), "tap-words must open vocab popup");
  });

  test("vocab modal can add matched words to SRS as due", () => {
    const p = appJs.indexOf("function renderVocabResult");
    const block = appJs.slice(p, p + 2000);
    assert.ok(block.includes("vocab-add-btn"), "renderVocabResult must wire the add button");
    assert.ok(block.includes("dueDate: todayStr()"), "added words must be due immediately");
  });
});

describe("stories — api/chat.js", () => {
  const chatJs = readFile("api/chat.js");

  test("story mode exists and runs before the text guard", () => {
    const storyIdx = chatJs.indexOf('mode === "story"');
    const guardIdx = chatJs.indexOf('if (!text || !text.trim())');
    assert.ok(storyIdx !== -1, "story mode missing");
    assert.ok(storyIdx < guardIdx, "story mode must not require learner text");
  });

  test("story mode uses level descriptions and target words", () => {
    const p = chatJs.indexOf('mode === "story"');
    const block = chatJs.slice(p, p + 3500);
    assert.ok(block.includes("LEVEL_DESCRIPTIONS"), "must constrain by CEFR level");
    assert.ok(block.includes("targetWords"), "must accept target words");
    assert.ok(block.includes("comprehension questions"), "must request comprehension questions");
  });

  test("story mode validates sentences and clamps answers", () => {
    const p = chatJs.indexOf('mode === "story"');
    const block = chatJs.slice(p, p + 8000);
    assert.ok(block.includes("Array.isArray(result.sentences)"), "must validate sentences array");
    assert.ok(block.includes("catch"), "must have error fallback");
  });
});

// ---------------------------------------------------------------------------
// Unified error log and weakness profile
// ---------------------------------------------------------------------------

describe("error profile — index.html", () => {
  const html = readFile("index.html");

  test("error profile section exists in Progress panel", () => {
    for (const id of ["error-profile-section", "error-log-count", "error-analyze-btn",
      "error-practice-btn", "error-toggle-list-btn", "error-clear-btn",
      "error-patterns", "error-log-list", "error-profile-status"]) {
      assert.ok(html.includes(`id="${id}"`), `Missing #${id}`);
    }
  });

  test("error section lives inside the progress panel", () => {
    const progStart = html.indexOf('id="progress-panel"');
    const progEnd = html.indexOf('id="vocab-panel"');
    const section = html.indexOf('id="error-profile-section"');
    assert.ok(section > progStart && section < progEnd, "error section must be inside #progress-panel");
  });
});

describe("error profile — app.js", () => {
  const appJs = readFile("app.js");

  test("error log functions are defined", () => {
    for (const fn of ["getErrorLog", "logError", "renderErrorProfileSection",
      "renderErrorPatterns", "analyzeErrorProfile", "practiceErrorDrills",
      "openErrorDrillSession", "setupErrorProfileSection"]) {
      assert.ok(appJs.includes(`function ${fn}(`), `${fn} not defined`);
    }
  });

  test("log is capped and deduplicated", () => {
    const p = appJs.indexOf("function logError");
    const block = appJs.slice(p, p + 900);
    assert.ok(appJs.includes("ERROR_LOG_MAX"), "ERROR_LOG_MAX missing");
    assert.ok(block.includes("log.some(e => e.original === original"), "must dedupe identical corrections");
    assert.ok(block.includes("original.toLowerCase() === corrected.toLowerCase()"), "must skip non-corrections");
  });

  test("all six correction paths feed the log", () => {
    assert.ok(/logError\(aiMode, result\.original/.test(appJs), "correct/write path must log");
    assert.ok(/logError\("chat",/.test(appJs), "chat correction path must log");
    assert.ok(/logError\("recall",/.test(appJs), "recall-check path must log");
    assert.ok(/logError\("speak",/.test(appJs), "speak sample path must log");
    assert.ok(/logError\("talkbox",/.test(appJs), "talkbox sample path must log");
  });

  test("chat path skips translation prompts", () => {
    const p = appJs.indexOf('logError("chat"');
    const before = appJs.slice(p - 300, p);
    assert.ok(before.includes("try saying"), "must filter 'try saying' translation corrections");
  });

  test("practice opens a drill session from generated drills", () => {
    const p = appJs.indexOf("function openErrorDrillSession");
    const block = appJs.slice(p, p + 800);
    assert.ok(block.includes('"__errorlog__"'), "must use the __errorlog__ set key");
    assert.ok(block.includes("buildDrillQueueItem"), "must reuse the drill queue builder");
  });

  test("progress panel renders the error section", () => {
    const p = appJs.indexOf("function showProgressPanel");
    const block = appJs.slice(p, p + 1200);
    assert.ok(block.includes("renderErrorProfileSection()"), "showProgressPanel must render error section");
  });

  test("analysis result is cached by error count", () => {
    assert.ok(appJs.includes('"errorProfileCache"'), "errorProfileCache key missing");
  });

  test("setupErrorProfileSection is called in init()", () => {
    const start = appJs.indexOf("function init()");
    const end = appJs.indexOf("function renderCard");
    assert.ok(appJs.slice(start, end).includes("setupErrorProfileSection()"), "not wired in init");
  });
});

describe("error profile — api/chat.js", () => {
  const chatJs = readFile("api/chat.js");

  test("error-profile mode exists and validates input", () => {
    const p = chatJs.indexOf('mode === "error-profile"');
    assert.ok(p !== -1, "error-profile mode missing");
    const block = chatJs.slice(p, p + 2500);
    assert.ok(block.includes("Array.isArray(errors)"), "must validate errors array");
    assert.ok(block.includes("patterns"), "must return patterns");
    assert.ok(block.includes("catch"), "must have error fallback");
  });

  test("error-drills mode builds gap-fills from corrected sentences", () => {
    const p = chatJs.indexOf('mode === "error-drills"');
    assert.ok(p !== -1, "error-drills mode missing");
    const block = chatJs.slice(p, p + 3000);
    assert.ok(block.includes('d.sentence.includes("___")'), "must validate gap marker");
    assert.ok(block.includes("distractors"), "must include distractors");
    assert.ok(block.includes("catch"), "must have error fallback");
  });

  test("both error modes run before the text guard", () => {
    const guardIdx = chatJs.indexOf('if (!text || !text.trim())');
    assert.ok(chatJs.indexOf('mode === "error-profile"') < guardIdx, "error-profile must not require text");
    assert.ok(chatJs.indexOf('mode === "error-drills"') < guardIdx, "error-drills must not require text");
  });
});

// ---------------------------------------------------------------------------
// telc B2 exam simulator
// ---------------------------------------------------------------------------

describe("telc exam — exam_data.js", () => {
  const dataJs = readFile("exam_data.js");

  function loadExamData() {
    const ctx = {};
    vm.runInNewContext(dataJs + "\nthis.W = EXAM_WRITE_TASKS; this.T = EXAM_SPEAK_TOPICS; this.S = EXAM_SPEAK_STRUCTURE; this.F = EXAM_SB_FALLBACK;", ctx);
    return ctx;
  }
  const data = loadExamData();

  test("at least 6 writing tasks, each with exactly 4 Leitpunkte", () => {
    assert.ok(data.W.length >= 6, `Expected >= 6 tasks, got ${data.W.length}`);
    const bad = data.W.filter(t => !t.points || t.points.length !== 4);
    assert.equal(bad.length, 0, `Tasks without 4 points: ${bad.map(t => t.id).join(", ")}`);
  });

  test("writing tasks cover all four telc letter types", () => {
    const types = new Set(data.W.map(t => t.type));
    for (const ty of ["Beschwerde", "Anfrage", "Bewerbung", "Leserbrief"]) {
      assert.ok(types.has(ty), `Missing letter type: ${ty}`);
    }
  });

  test("at least 10 presentation topics with German and English", () => {
    assert.ok(data.T.length >= 10, `Expected >= 10 topics, got ${data.T.length}`);
    const bad = data.T.filter(t => !t.de || !t.en);
    assert.equal(bad.length, 0, "Topics missing de/en");
  });

  test("presentation structure has the four telc parts", () => {
    assert.equal(data.S.length, 4, "Expected 4 structure points");
  });

  test("fallback Sprachbausteine test has 10 valid items matching the text gaps", () => {
    assert.equal(data.F.items.length, 10, "Fallback must have 10 items");
    for (const it of data.F.items) {
      assert.ok(data.F.text.includes(`[${it.num}]`), `Gap [${it.num}] missing from text`);
      assert.equal(it.options.length, 3, `Item ${it.num} must have 3 options`);
      assert.ok(it.answer >= 0 && it.answer < 3, `Item ${it.num} answer out of range`);
      assert.ok(it.sentence.includes("___"), `Item ${it.num} sentence must contain ___`);
      assert.ok(it.rule, `Item ${it.num} missing rule`);
    }
  });
});

describe("telc exam — index.html", () => {
  const html = readFile("index.html");

  test("exam tab exists in nav under Exam group", () => {
    assert.ok(html.includes('data-mode="exam"'), "exam tab missing");
    assert.ok(html.includes('<div class="nav-group-label">Exam</div>'), "Exam group label missing");
  });

  test("exam panel views and key elements exist", () => {
    for (const id of ["exam-panel", "exam-landing", "exam-task-grid",
      "exam-sb-view", "exam-sb-start-btn", "exam-sb-text", "exam-sb-items", "exam-sb-submit-btn", "exam-sb-result",
      "exam-write-view", "exam-write-type", "exam-write-input", "exam-write-submit-btn", "exam-write-scores", "exam-write-model",
      "exam-speak-view", "exam-speak-topic", "exam-speak-prep-btn", "exam-speak-talk-btn", "exam-speak-transcript", "exam-speak-scores"]) {
      assert.ok(html.includes(`id="${id}"`), `Missing #${id}`);
    }
  });

  test("exam_data.js is loaded with a fallback guard", () => {
    assert.ok(html.includes('src="exam_data.js"'), "exam_data.js not loaded");
    assert.ok(html.includes("EXAM_WRITE_TASKS === 'undefined'"), "fallback guard missing");
  });
});

describe("telc exam — app.js", () => {
  const appJs = readFile("app.js");

  test("core exam functions are defined", () => {
    for (const fn of ["showExamPanel", "showExamLanding", "openExamSb", "examSbStart",
      "examSbSubmit", "openExamWrite", "examWriteStart", "examWriteSubmit",
      "openExamSpeak", "examSpeakStartPrep", "examSpeakFinish", "examStartRecording",
      "examStopRecording", "setupExamPanel"]) {
      assert.ok(appJs.includes(`function ${fn}(`), `${fn} not defined`);
    }
  });

  test("exam mode wired into tab click, guards, More sheet, and init", () => {
    assert.ok(appJs.includes('newMode === "exam"'), "exam not handled in tab click");
    const guards = appJs.match(/mode === "exam"\) return;/g) || [];
    assert.ok(guards.length >= 2, "exam missing from renderCard/keydown guards");
    const moreStart = appJs.indexOf("const MORE_SHEET_GROUPS");
    const moreBlock = appJs.slice(moreStart, appJs.indexOf("];", moreStart));
    assert.ok(moreBlock.includes('"exam"'), "exam missing from MORE_SHEET_GROUPS");
    const init = appJs.slice(appJs.indexOf("function init()"), appJs.indexOf("function renderCard"));
    assert.ok(init.includes("setupExamPanel()"), "setupExamPanel not called in init");
  });

  test("Sprachbausteine falls back to the built-in test on API failure", () => {
    const p = appJs.indexOf("async function examSbStart");
    const block = appJs.slice(p, p + 1600);
    assert.ok(block.includes("EXAM_SB_FALLBACK"), "must fall back to EXAM_SB_FALLBACK");
    assert.ok(block.includes("examShuffleItemOptions"), "must shuffle option order");
  });

  test("wrong Sprachbausteine items feed the drill mistake bank", () => {
    const p = appJs.indexOf("function examSbSubmit");
    const block = appJs.slice(p, p + 2200);
    assert.ok(block.includes("addDrillMistake("), "wrong items must enter the mistake bank");
  });

  test("writing and speaking corrections feed the error log", () => {
    const w = appJs.indexOf("async function examWriteSubmit");
    assert.ok(appJs.slice(w, w + 3000).includes('logError("exam"'), "write corrections must be logged");
    const s = appJs.indexOf("async function examSpeakFinish");
    assert.ok(appJs.slice(s, s + 3000).includes('logError("exam"'), "speak corrections must be logged");
  });

  test("timers use real telc durations", () => {
    assert.ok(appJs.includes("examSbSecondsLeft = 600"), "Sprachbausteine should be 10 min");
    assert.ok(appJs.includes("examWriteSecondsLeft = 1800"), "Writing should be 30 min");
    assert.ok(appJs.includes("examSpeakSecondsLeft = 120"), "Speaking should be 2 min");
  });

  test("write submit requires at least 50 words", () => {
    assert.ok(appJs.includes("words < 50"), "50-word minimum missing");
  });
});

describe("telc exam — api/chat.js", () => {
  const chatJs = readFile("api/chat.js");

  test("all three exam modes exist", () => {
    for (const m of ["exam-sprachbausteine", "exam-write-feedback", "exam-speak-feedback"]) {
      assert.ok(chatJs.includes(`mode === "${m}"`), `${m} mode missing`);
    }
  });

  test("exam-sprachbausteine validates items and has fallback", () => {
    const p = chatJs.indexOf('mode === "exam-sprachbausteine"');
    const block = chatJs.slice(p, p + 3000);
    assert.ok(block.includes("Array.isArray(it.options)"), "must validate options");
    assert.ok(block.includes("catch"), "must have error fallback");
  });

  test("exam graders score on telc criteria", () => {
    const w = chatJs.indexOf('mode === "exam-write-feedback"');
    const wBlock = chatJs.slice(w, w + 3500);
    for (const c of ["inhalt", "kommunikation", "korrektheit", "wortschatz"]) {
      assert.ok(wBlock.includes(c), `write grader missing criterion: ${c}`);
    }
    const s = chatJs.indexOf('mode === "exam-speak-feedback"');
    const sBlock = chatJs.slice(s, s + 3500);
    for (const c of ["aufgabe", "fluessigkeit", "korrektheit", "ausdruck"]) {
      assert.ok(sBlock.includes(c), `speak grader missing criterion: ${c}`);
    }
  });

  test("exam graders return corrections and a model", () => {
    for (const m of ["exam-write-feedback", "exam-speak-feedback"]) {
      const p = chatJs.indexOf(`mode === "${m}"`);
      const block = chatJs.slice(p, p + 3500);
      assert.ok(block.includes("corrections"), `${m} must return corrections`);
      assert.ok(block.includes("model"), `${m} must return a model`);
    }
  });
});

// ---------------------------------------------------------------------------
// API response hardening
// ---------------------------------------------------------------------------

describe("api response parsing — app.js", () => {
  const appJs = readFile("app.js");

  test("parseApiResponse helper is defined and explains missing backend", () => {
    assert.ok(appJs.includes("async function parseApiResponse(res)"), "parseApiResponse not defined");
    assert.ok(appJs.includes("AI backend not reachable"), "helper must explain unreachable backend");
    assert.ok(appJs.includes('"vercel dev"'), "helper must mention vercel dev");
  });

  test("no raw res.json() calls remain on /api responses", () => {
    const raw = (appJs.match(/await res\.json\(\)/g) || []).length;
    assert.equal(raw, 0, `Found ${raw} raw res.json() calls - use parseApiResponse(res)`);
  });

  test("helper still surfaces server JSON error bodies", () => {
    const p = appJs.indexOf("async function parseApiResponse");
    const block = appJs.slice(p, p + 700);
    assert.ok(block.includes("JSON.parse"), "must parse JSON bodies regardless of status");
    assert.ok(block.includes('startsWith("{")'), "must detect JSON bodies before throwing");
  });
});

describe("today session — style.css", () => {
  const css = readFile("style.css");

  test("today panel and session bar styles exist", () => {
    for (const sel of ["#today-panel {", "#today-session-bar {", ".today-stat {",
      ".today-plan-row {", "#today-start-btn {", ".tsb-dot {", ".tab-badge {"]) {
      assert.ok(css.includes(sel), `Missing CSS: ${sel}`);
    }
  });

  test("badge hidden until marked visible", () => {
    assert.ok(css.includes(".tab-badge.visible"), ".tab-badge.visible rule missing");
  });
});
