// Tests for syncing review progress across devices, plus small header fixes.
// Run: node --test tests/sync_merge.test.js

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");
const appJs = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");

function loadMerge() {
  const start = appJs.indexOf("// ---- SRS sync merge ----");
  const end = appJs.indexOf("// ---- end SRS sync merge ----");
  assert.ok(start !== -1 && end !== -1, "Could not locate the SRS sync merge block in app.js");
  const ctx = {};
  vm.runInNewContext(appJs.slice(start, end) +
    "\nthis.api = { stampChangedRecords, isNewerRecord, mergeSrsStores, mergeIntroLogs };", ctx);
  // Round-trip through JSON so results are plain objects of this realm.
  const plain = fn => (...args) => JSON.parse(JSON.stringify(fn(...args)));
  return { ...ctx.api, mergeSrsStores: plain(ctx.api.mergeSrsStores), mergeIntroLogs: plain(ctx.api.mergeIntroLogs) };
}

function bodyOf(name) {
  const start = appJs.indexOf(`function ${name}(`);
  assert.ok(start !== -1, `${name} not found`);
  const next = appJs.indexOf("\nfunction ", start + 1);
  return appJs.slice(start, next === -1 ? undefined : next);
}

const TODAY = "2026-10-25";
const rec = (extra) => ({ interval: 3, easeFactor: 2.5, dueDate: "2026-10-28", lastReviewed: "2026-10-25", totalReviews: 2, totalCorrect: 2, ...extra });

describe("sync merge — stamping", () => {
  const { stampChangedRecords } = loadMerge();

  test("only records that changed get a new stamp", () => {
    const saved = { 1: rec({ changedAt: 100 }), 2: rec({ changedAt: 100 }) };
    const store = { 1: rec({ changedAt: 100 }), 2: rec({ changedAt: 100, totalReviews: 3 }), 3: rec() };
    stampChangedRecords(store, saved, 500);
    assert.equal(store[1].changedAt, 100);
    assert.equal(store[2].changedAt, 500);
    assert.equal(store[3].changedAt, 500);
  });
});

describe("sync merge — records", () => {
  const { isNewerRecord, mergeSrsStores } = loadMerge();

  test("the later stamp wins", () => {
    assert.equal(isNewerRecord(rec({ changedAt: 2 }), rec({ changedAt: 1 })), true);
    assert.equal(isNewerRecord(rec({ changedAt: 1 }), rec({ changedAt: 2 })), false);
  });

  test("unstamped records fall back to last review, then review count", () => {
    assert.equal(isNewerRecord(rec({ lastReviewed: "2026-10-25" }), rec({ lastReviewed: "2026-10-20" })), true);
    assert.equal(isNewerRecord(rec({ totalReviews: 5 }), rec({ totalReviews: 4 })), true);
    assert.equal(isNewerRecord(rec(), rec()), false, "a tie keeps the local record");
  });

  test("cards from both devices survive, newest change per card", () => {
    const local = { 1: rec({ changedAt: 10, interval: 3 }), 2: rec({ changedAt: 50, interval: 7 }) };
    const remote = { 1: rec({ changedAt: 20, interval: 9 }), 2: rec({ changedAt: 40, interval: 1 }), 3: rec({ changedAt: 5 }) };
    const merged = mergeSrsStores(local, remote);
    assert.deepEqual(Object.keys(merged).sort(), ["1", "2", "3"]);
    assert.equal(merged[1].interval, 9);
    assert.equal(merged[2].interval, 7);
  });

  test("a card missing on the other device is never deleted", () => {
    const merged = mergeSrsStores({ 1: rec({ changedAt: 1 }) }, {});
    assert.ok(merged[1]);
  });

  test("a reset travels: a fresh record with a newer stamp beats old progress", () => {
    const reset = { interval: 0, easeFactor: 2.5, dueDate: null, lastReviewed: null, totalReviews: 0, totalCorrect: 0, archived: false, changedAt: 99 };
    const merged = mergeSrsStores({ 1: rec({ changedAt: 10, totalReviews: 12 }) }, { 1: reset });
    assert.equal(merged[1].dueDate, null);
  });

  test("garbage from the blob is ignored", () => {
    const merged = mergeSrsStores({ 1: rec() }, { 1: null, 2: "x" });
    assert.deepEqual(Object.keys(merged), ["1"]);
  });
});

describe("sync merge — today's new cards", () => {
  const { mergeIntroLogs } = loadMerge();

  test("first sightings on both devices count against one allowance", () => {
    const merged = mergeIntroLogs({ date: TODAY, phrases: [1, 2], words: [9] }, { date: TODAY, phrases: [2, 3], words: [] }, TODAY);
    assert.deepEqual(merged, { date: TODAY, phrases: [1, 2, 3], words: [9] });
  });

  test("yesterday's log from either side is dropped", () => {
    const merged = mergeIntroLogs({ date: "2026-10-24", phrases: [1] }, { date: TODAY, phrases: [4], words: [] }, TODAY);
    assert.deepEqual(merged, { date: TODAY, phrases: [4], words: [] });
    assert.deepEqual(mergeIntroLogs(undefined, undefined, TODAY), { date: TODAY, phrases: [], words: [] });
  });
});

describe("sync — wiring", () => {
  test("the payload carries phrase and word progress and today's log", () => {
    const body = bodyOf("buildSyncPayload");
    assert.match(body, /srs: readStore\("srsData"\)/);
    assert.match(body, /wordsSrs: readStore\("wordsSRS"\)/);
    assert.match(body, /newIntro: getNewIntroLog\(\)/);
  });

  test("a push pulls and merges first, and gives up if it could not read", () => {
    assert.match(bodyOf("syncPush"), /if \(!\(await syncPull\(\)\)\) return;/);
  });

  test("a pull merges reviews into storage and memory", () => {
    assert.match(bodyOf("mergeSyncData"), /mergeSyncedReviews\(remote\)/);
    const body = bodyOf("mergeSyncedReviews");
    assert.match(body, /srsData = mergeSrsStores\(/);
    assert.match(body, /wordsSRS = mergeSrsStores\(/);
  });

  test("every save stamps changes and schedules a push", () => {
    for (const fn of ["saveSrsData", "saveWordsSRS"]) {
      assert.match(bodyOf(fn), /stampChangedRecords\(/, `${fn} must stamp`);
      assert.match(bodyOf(fn), /scheduleSyncPush\(\)/, `${fn} must schedule a push`);
    }
  });

  test("resetting a phrase writes a fresh record instead of deleting it", () => {
    assert.doesNotMatch(bodyOf("resetSrs"), /delete srsData/);
  });
});

describe("header fixes", () => {
  test("the XP header says which number is today's and which is the total", () => {
    const body = bodyOf("renderXPBar");
    assert.match(body, /XP today`/);
    assert.match(body, /XP total`/);
  });

  test("the phrase position counter only shows in the phrase player", () => {
    assert.match(appJs, /const COUNTER_MODES = \["listen", "recall", "shadow"\];/);
    assert.match(bodyOf("updateCounterVisibility"), /counterEl\.hidden = /);
  });
});
