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
