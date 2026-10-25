// Tests for review ordering and the daily new-card allowance.
// Run: node --test tests/srs_order.test.js

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");
const appJs = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
const styleCss = fs.readFileSync(path.join(ROOT, "style.css"), "utf8");

function loadReviewOrder() {
  const start = appJs.indexOf("// ---- Review order & daily new allowance ----");
  const end = appJs.indexOf("// ---- end review order ----");
  assert.ok(start !== -1 && end !== -1, "Could not locate the review order block in app.js");
  const ctx = {};
  vm.runInNewContext(appJs.slice(start, end) +
    "\nthis.api = { srsBucket, orderForReview, countForToday, newAllowance, NEW_PHRASES_PER_DAY, NEW_WORDS_PER_DAY };", ctx);
  return ctx.api;
}

function bodyOf(name) {
  const start = appJs.indexOf(`function ${name}(`);
  assert.ok(start !== -1, `${name} not found`);
  const next = appJs.indexOf("\nfunction ", start + 1);
  return appJs.slice(start, next === -1 ? undefined : next);
}

const TODAY = "2026-10-25";
const fresh = { dueDate: null };
const rec = (dueDate, interval = 3) => ({ dueDate, interval });

describe("review order — buckets", () => {
  const { srsBucket } = loadReviewOrder();

  test("never seen is new", () => assert.equal(srsBucket(fresh, TODAY), "new"));
  test("due today or earlier is a review", () => {
    assert.equal(srsBucket(rec(TODAY), TODAY), "review");
    assert.equal(srsBucket(rec("2026-10-01"), TODAY), "review");
  });
  test("a mastered card that has come due is still a review", () => {
    assert.equal(srsBucket(rec("2026-10-20", 40), TODAY), "review");
  });
  test("due in the future is later", () => assert.equal(srsBucket(rec("2026-10-26"), TODAY), "later"));
});

describe("review order — queue", () => {
  const { orderForReview } = loadReviewOrder();
  const records = {
    1: fresh, 2: fresh, 3: fresh,
    4: rec("2026-10-24"),
    5: rec("2026-11-30", 40),
    6: rec("2026-10-10", 30),   // mastered and long overdue
    7: rec("2026-10-28"),
  };
  const items = [1, 2, 3, 4, 5, 6, 7].map(id => ({ id }));
  const recordOf = id => records[id];

  test("reviews come before every new card, most overdue first", () => {
    const ids = Array.from(orderForReview(items, recordOf, TODAY, false), i => i.id);
    assert.deepEqual(ids, [6, 4, 1, 2, 3, 7, 5]);
  });

  test("shuffle mixes within groups, never across them", () => {
    for (let n = 0; n < 20; n++) {
      const ids = Array.from(orderForReview(items, recordOf, TODAY, true), i => i.id);
      assert.deepEqual(ids.slice(0, 2).sort(), [4, 6]);
      assert.deepEqual(ids.slice(2, 5).sort(), [1, 2, 3]);
      assert.deepEqual(ids.slice(5).sort(), [5, 7]);
    }
  });

  test("does not mutate the input list", () => {
    const copy = items.map(i => i.id);
    orderForReview(items, recordOf, TODAY, false);
    assert.deepEqual(items.map(i => i.id), copy);
  });
});

describe("daily new allowance", () => {
  const { countForToday, newAllowance, NEW_PHRASES_PER_DAY, NEW_WORDS_PER_DAY } = loadReviewOrder();

  test("limits are positive and modest", () => {
    assert.ok(NEW_PHRASES_PER_DAY > 0 && NEW_PHRASES_PER_DAY <= 20);
    assert.ok(NEW_WORDS_PER_DAY > 0 && NEW_WORDS_PER_DAY <= 30);
  });

  test("a fresh start owes the allowance, not the whole bank", () => {
    const items = Array.from({ length: 349 }, (_, i) => ({ id: i }));
    const c = countForToday(items, () => fresh, TODAY, 10);
    assert.deepEqual({ ...c }, { due: 0, fresh: 349, newToday: 10 });
  });

  test("archived cards are not counted", () => {
    const items = [{ id: 1 }, { id: 2 }];
    const c = countForToday(items, id => (id === 1 ? { dueDate: null, archived: true } : rec(TODAY)), TODAY, 10);
    assert.deepEqual({ ...c }, { due: 1, fresh: 0, newToday: 0 });
  });

  test("allowance shrinks with today's introductions and resets the next day", () => {
    const log = { date: TODAY, phrases: [1, 2, 3], words: [] };
    assert.equal(newAllowance(log, "phrases", 10, TODAY), 7);
    assert.equal(newAllowance(log, "words", 20, TODAY), 20);
    assert.equal(newAllowance(log, "phrases", 10, "2026-10-26"), 10);
    assert.equal(newAllowance({ date: TODAY, phrases: Array(12).fill(0) }, "phrases", 10, TODAY), 0);
    assert.equal(newAllowance(null, "phrases", 10, TODAY), 10);
  });
});

describe("review order — wiring", () => {
  test("both queues use the shared ordering", () => {
    assert.match(bodyOf("buildQueue"), /orderForReview\(/);
    assert.match(bodyOf("buildWordsQueue"), /orderForReview\(/);
  });

  test("every grading path records a first sighting", () => {
    assert.match(bodyOf("updateOnGotIt"), /noteIntroduced\("phrases"/);
    assert.match(bodyOf("updateOnMissed"), /noteIntroduced\("phrases"/);
    assert.match(bodyOf("updateWordSRS"), /noteIntroduced\("words"/);
  });

  test("callers pass the record getters themselves, which take an id", () => {
    // An `item => getSrsRecord(item.id)` wrapper receives an id, reads .id off
    // a number, and every card looks unseen.
    assert.match(bodyOf("buildQueue"), /orderForReview\(source, getSrsRecord,/);
    assert.match(bodyOf("buildWordsQueue"), /orderForReview\(source, getWordRecord,/);
    assert.match(bodyOf("countDuePhrases"), /countForToday\(.*, getSrsRecord, today/);
    assert.match(bodyOf("countDueWords"), /countForToday\(.*, getWordRecord, today/);
  });

  test("counts and badges use the allowance, not the whole unseen bank", () => {
    assert.doesNotMatch(appJs, /\.due \+ (phrases|words)\.fresh/);
    assert.match(bodyOf("updateTabBadges"), /newToday/);
    assert.match(bodyOf("renderRecallModeHeader"), /countDuePhrases\(\)/);
    assert.match(bodyOf("updateWordsStatsBar"), /countDueWords\(\)/);
    assert.match(bodyOf("renderProgressTab"), /countDuePhrases\(\)/);
  });
});

describe("mobile tap targets", () => {
  test("level chips, starter chips and AI toolbar buttons reach 44px", () => {
    const rule = styleCss.match(/#mobile-level-bar \.level-chip,\s*\.starter-cat-chip,\s*#mini-practice-btn,\s*#ai-export-btn,\s*#ai-clear-btn\s*\{\s*min-height:\s*44px;/);
    assert.ok(rule, "44px floor rule for chips and toolbar buttons is missing");
  });
});
