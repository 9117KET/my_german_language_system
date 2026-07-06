// Tests for the XP/streak motivation layer and the Palteca-style
// comprehensible-input story series (episodes, cliffhangers, word self-rate).
// Run: node --test tests/rewards.test.js

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");

function readFile(name) {
  return fs.readFileSync(path.join(ROOT, name), "utf8");
}

const appJs = readFile("app.js");
const html = readFile("index.html");
const css = readFile("style.css");
const chatJs = readFile("api/chat.js");

// ---------------------------------------------------------------------------
// XP engine — pure-logic tests run in a VM with a localStorage stub
// ---------------------------------------------------------------------------

function extractSection(src, startMarker, endMarker) {
  const start = src.indexOf(startMarker);
  const end = src.indexOf(endMarker, start);
  assert.ok(start !== -1, `Marker not found: ${startMarker}`);
  assert.ok(end !== -1, `Marker not found: ${endMarker}`);
  return src.slice(start, end);
}

function makeXPContext(now = new Date("2026-07-06T12:00:00")) {
  // date helpers + XP section from app.js, isolated from the DOM
  const dateSection = extractSection(appJs, "function toLocalDateStr", "function getSrsRecord");
  const xpSection = extractSection(appJs, "const XP_DAILY_GOAL", "// ---- Voice Matching ----");
  const store = {};
  const ctx = {
    localStorage: {
      getItem: k => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: k => { delete store[k]; },
    },
    document: {
      getElementById: () => null,
      createElement: () => ({ classList: { add() {}, remove() {}, toggle() {} }, style: {}, appendChild() {}, addEventListener() {}, remove() {} }),
      body: { appendChild() {} },
    },
    requestAnimationFrame: () => {},
    setTimeout: () => {},
    Date,
    JSON,
    Math,
    String,
    Array,
    Object,
    parseInt,
  };
  vm.createContext(ctx);
  vm.runInContext(dateSection + "\n" + xpSection, ctx);
  return { ctx, store };
}

describe("XP engine — awardXP / streak / levels", () => {
  test("awardXP accumulates total and today's XP", () => {
    const { ctx } = makeXPContext();
    vm.runInContext("awardXP(10, 'Test'); awardXP(5, 'Test');", ctx);
    assert.equal(vm.runInContext("xpState.total", ctx), 15);
    assert.equal(vm.runInContext("xpToday()", ctx), 15);
  });

  test("streak counts consecutive days with >= XP_STREAK_MIN", () => {
    const { ctx } = makeXPContext();
    vm.runInContext(`
      loadXPState();
      xpState.days[daysAgoStr(0)] = 12;
      xpState.days[daysAgoStr(1)] = 40;
      xpState.days[daysAgoStr(2)] = 15;
      xpState.days[daysAgoStr(3)] = 3;   // below threshold breaks the chain
      xpState.days[daysAgoStr(4)] = 50;
      saveXPState();
    `, ctx);
    assert.equal(vm.runInContext("getGlobalStreak()", ctx), 3);
  });

  test("streak survives when today has no XP yet (counts from yesterday)", () => {
    const { ctx } = makeXPContext();
    vm.runInContext(`
      loadXPState();
      xpState.days[daysAgoStr(1)] = 30;
      xpState.days[daysAgoStr(2)] = 30;
      saveXPState();
    `, ctx);
    assert.equal(vm.runInContext("getGlobalStreak()", ctx), 2);
  });

  test("streak is 0 when neither today nor yesterday hit the minimum", () => {
    const { ctx } = makeXPContext();
    vm.runInContext(`
      loadXPState();
      xpState.days[daysAgoStr(2)] = 100;
      saveXPState();
    `, ctx);
    assert.equal(vm.runInContext("getGlobalStreak()", ctx), 0);
  });

  test("levels are ordered and level-up is monotonic in XP", () => {
    const { ctx } = makeXPContext();
    const levels = vm.runInContext("XP_LEVELS", ctx);
    assert.ok(levels.length >= 5, "expected at least 5 levels");
    for (let i = 1; i < levels.length; i++) {
      assert.ok(levels[i].xp > levels[i - 1].xp, `level ${i} threshold must grow`);
      assert.ok(levels[i].title, `level ${i} needs a title`);
    }
    vm.runInContext("loadXPState(); xpState.total = 450; saveXPState();", ctx);
    assert.equal(vm.runInContext("getXPLevel().title", ctx), "Wortsammler");
  });

  test("xpLastNDays returns n entries ending today", () => {
    const { ctx } = makeXPContext();
    const week = vm.runInContext("xpLastNDays(7)", ctx);
    assert.equal(week.length, 7);
    assert.equal(week[6].date, vm.runInContext("todayStr()", ctx));
  });
});

// ---------------------------------------------------------------------------
// Local-date helpers (regression: UTC dates shifted the day boundary)
// ---------------------------------------------------------------------------

describe("local date helpers", () => {
  test("todayStr uses local time, not UTC", () => {
    const { ctx } = makeXPContext();
    const expected = (() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    })();
    assert.equal(vm.runInContext("todayStr()", ctx), expected);
  });

  test("no remaining UTC day-string computations in app.js", () => {
    assert.ok(!/toISOString\(\)\.slice\(0, ?10\)/.test(appJs),
      "found toISOString().slice(0,10) — use todayStr()/daysAgoStr() instead");
  });
});

// ---------------------------------------------------------------------------
// XP hooks — every grading path must award XP
// ---------------------------------------------------------------------------

describe("XP hooks in grading paths", () => {
  const hooks = [
    ["phrase correct", /totalCorrect: r\.totalCorrect \+ 1\s*\};\s*saveSrsData\(\);\s*awardXP\(/],
    ["word grading", /saveWordsSRS\(\);\s*awardXP\(/],
    ["story read", /awardXP\(15, "Geschichte"\)/],
    ["exam task", /awardXP\(25, "Prüfungsaufgabe"\)/],
    ["speak scenario", /awardXP\(10, "Sprechen"\)/],
    ["think prompt", /awardXP\(10, "Denken"\)/],
    ["today session bonus", /awardXP\(20, "Session komplett"\)/],
    ["drill (non-phrase)", /awardXP\(isCorrect \? 3 : 1, "Drill"\)/],
  ];
  for (const [name, rx] of hooks) {
    test(`${name} awards XP`, () => {
      assert.ok(rx.test(appJs), `missing awardXP hook: ${name}`);
    });
  }
});

// ---------------------------------------------------------------------------
// UI wiring — new elements exist in the HTML and are styled
// ---------------------------------------------------------------------------

describe("motivation/series UI wiring", () => {
  const ids = [
    "xp-topbar", "xp-streak", "xp-level", "xp-goal-fill", "xp-goal-label", "xp-total",
    "story-series-select", "story-genre-select", "story-series-status", "story-series-reset",
    "story-episode-chip", "story-cliffhanger", "story-word-rate", "story-word-rate-list",
    "progress-results", "res-words-met", "res-words-solid", "res-streak", "res-xp-week",
    "res-stories", "xp-week-chart",
  ];
  for (const id of ids) {
    test(`index.html has #${id}`, () => {
      assert.ok(html.includes(`id="${id}"`), `missing element: #${id}`);
    });
  }

  test("style.css styles the XP bar, toasts, celebration and series UI", () => {
    for (const sel of ["#xp-topbar", ".xp-toast", "#celebrate-overlay", ".confetti",
                       "#story-series-status", ".story-rate-btn", "#progress-results", ".xpw-bar"]) {
      assert.ok(css.includes(sel), `missing CSS: ${sel}`);
    }
  });

  test("app.js wires series controls and word-rate delegation", () => {
    assert.ok(appJs.includes('getElementById("story-series-select").addEventListener'));
    assert.ok(appJs.includes('getElementById("story-series-reset").addEventListener'));
    assert.ok(appJs.includes('closest(".story-rate-btn")'));
    assert.ok(appJs.includes("function storyRateWord"));
    assert.ok(appJs.includes("function renderResultsCard"));
    assert.ok(appJs.includes("loadXPState();"), "init must load XP state");
  });
});

// ---------------------------------------------------------------------------
// Episode archive — re-read past episodes, continue the series
// ---------------------------------------------------------------------------

describe("story episode archive", () => {
  test("archive helpers and episode list exist", () => {
    for (const fn of ["getEpisodeArchive", "saveEpisodeToArchive", "openArchivedEpisode", "renderEpisodeList"]) {
      assert.ok(appJs.includes(`function ${fn}(`), `${fn} not defined`);
    }
    assert.ok(html.includes('id="story-episode-list"'), "episode list container missing");
    assert.ok(css.includes(".story-episode-chip-btn"), "episode chip CSS missing");
  });

  test("episodes are archived on generation, quiz completion, and word rating", () => {
    const gen = appJs.slice(appJs.indexOf("async function generateStory"), appJs.indexOf("function storyWrapTapWords"));
    assert.ok(gen.includes("saveEpisodeToArchive(currentStory)"), "generateStory must archive the episode");
    const quiz = appJs.slice(appJs.indexOf("function handleStoryQuizAnswer"), appJs.indexOf("function renderStoryWordRate"));
    assert.ok(quiz.includes("saveEpisodeToArchive(currentStory)"), "quiz completion must sync the archive");
    const rate = appJs.slice(appJs.indexOf("function storyRateWord"), appJs.indexOf("function storySpeakSentence"));
    assert.ok(rate.includes("saveEpisodeToArchive(currentStory)"), "word rating must sync the archive");
  });

  test("archive replaces same episode instead of duplicating and is capped", () => {
    const block = appJs.slice(appJs.indexOf("function saveEpisodeToArchive"), appJs.indexOf("function openArchivedEpisode"));
    assert.ok(block.includes("findIndex"), "must replace an existing entry for the same genre+episode");
    assert.ok(block.includes("slice(-40)"), "archive must be capped");
  });

  test("chip clicks reopen archived episodes via delegation", () => {
    assert.ok(appJs.includes('closest(".story-episode-chip-btn")'), "chip delegation missing");
    assert.ok(appJs.includes("openArchivedEpisode(parseInt"), "chip click must open the archived episode");
  });

  test("series reset clears the archive too", () => {
    const block = appJs.slice(appJs.indexOf("function resetStorySeries"), appJs.indexOf("function getEpisodeArchive"));
    assert.ok(block.includes("storyEpisodeArchive"), "reset must clear the episode archive");
  });
});

// ---------------------------------------------------------------------------
// API — story mode supports serialized episodes
// ---------------------------------------------------------------------------

describe("api/chat.js story series support", () => {
  test("accepts a series param and returns continuation fields", () => {
    assert.ok(chatJs.includes("series"), "series param missing");
    assert.ok(chatJs.includes("cliffhanger"), "cliffhanger field missing");
    assert.ok(chatJs.includes("payload.episode"), "episode passthrough missing");
    assert.ok(chatJs.includes("payload.summary"), "summary passthrough missing");
    assert.ok(chatJs.includes("payload.characters"), "characters passthrough missing");
  });

  test("episode 1 introduces characters; later episodes continue the summary", () => {
    assert.ok(chatJs.includes("Introduce 2-3 memorable recurring characters"));
    assert.ok(chatJs.includes("Continue directly from the story so far"));
    assert.ok(chatJs.includes("END the episode on a small cliffhanger"));
  });

  test("plain story mode (no series) still returns the original shape", () => {
    assert.ok(chatJs.includes(`Write ${"$"}{form} in German`) || /Write \$\{form\} in German/.test(chatJs),
      "one-off story prompt missing");
  });
});
