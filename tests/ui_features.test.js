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
