// Tests for the gap-fill drill sets in drills_data.js
// Run: node --test tests/drills_data.test.js

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");

function loadDrillSets() {
  const code = fs.readFileSync(path.join(ROOT, "drills_data.js"), "utf8").replace(/\bconst\s+/g, "");
  const ctx = {};
  vm.runInNewContext(code, ctx);
  return ctx.DRILL_SETS;
}

const DRILL_SETS = loadDrillSets();
const allItems = Object.values(DRILL_SETS).flatMap(set => set.items);

describe("drill sets", () => {
  test("every set has a label, subtitle, colour and items", () => {
    for (const [key, set] of Object.entries(DRILL_SETS)) {
      assert.ok(set.label && set.subtitle && set.color, `${key} is missing label/subtitle/color`);
      assert.ok(Array.isArray(set.items) && set.items.length > 0, `${key} has no items`);
    }
  });

  test("ids are unique across all sets", () => {
    const ids = allItems.map(i => i.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  test("sentences are unique, since the mistake bank keys on them", () => {
    const sentences = allItems.map(i => i.sentence);
    assert.equal(new Set(sentences).size, sentences.length);
  });

  test("every item has exactly one blank", () => {
    for (const item of allItems) {
      assert.equal(item.sentence.split("___").length - 1, 1, `item ${item.id}`);
    }
  });

  test("every item has three distinct distractors that differ from the answer", () => {
    for (const item of allItems) {
      assert.equal(item.distractors.length, 3, `item ${item.id}`);
      assert.equal(new Set(item.distractors).size, 3, `item ${item.id}`);
      assert.ok(!item.distractors.includes(item.answer), `item ${item.id}`);
      assert.ok(item.rule, `item ${item.id} has no rule`);
    }
  });

  test("text is safe to insert as HTML", () => {
    for (const item of allItems) {
      for (const s of [item.sentence, item.answer, ...item.distractors]) {
        assert.ok(!/[<>]/.test(s), `item ${item.id}`);
      }
    }
  });
});

describe("telc B1 sets from Modelltest 1", () => {
  test("all six sets are present", () => {
    for (const key of ["b1_verbende", "b1_brief_woerter", "b1_brief_bausteine", "b1_sprechen_saetze", "b1_sb_teil2", "b1_lesen_umschreiben"]) {
      assert.ok(DRILL_SETS[key], key);
    }
  });
});
