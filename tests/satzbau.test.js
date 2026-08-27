// Tests for the Satzbau Lab game (satzbau_data.js + the pure helpers in app.js)
// Run: node --test tests/satzbau.test.js

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");

function readFile(name) {
  return fs.readFileSync(path.join(ROOT, name), "utf8");
}

// ---------------------------------------------------------------------------
// Load SATZBAU_LEVELS from satzbau_data.js
// ---------------------------------------------------------------------------
function loadLevels() {
  const code = readFile("satzbau_data.js").replace(/\bconst\s+/g, "");
  const ctx = {};
  vm.runInNewContext(code, ctx);
  return ctx.SATZBAU_LEVELS;
}

// ---------------------------------------------------------------------------
// Extract the pure, DOM-free helpers from app.js
// ---------------------------------------------------------------------------
function loadHelpers() {
  const appJs = readFile("app.js");

  function extractFn(name) {
    const start = appJs.indexOf(`function ${name}(`);
    assert.ok(start !== -1, `function ${name} not found in app.js`);
    const after = appJs.slice(start + 1);
    const endRel = after.search(/\nfunction /);
    return appJs.slice(start, start + 1 + endRel).trim();
  }

  const ctx = {};
  vm.runInNewContext(
    [extractFn("slShuffle"), extractFn("slNormalize"), extractFn("slStripTags")].join("\n\n"),
    ctx
  );
  return ctx;
}

const LEVELS = loadLevels();
const { slShuffle, slNormalize, slStripTags } = loadHelpers();

const VALID_POS = ["verb", "subj", "frage", "conj", "temp", "manner", "local", "erg", "dativ", "akk"];
const VALID_CEFR = ["A1", "A2", "B1", "B2"];
const VALID_EFFECT = ["end", "pos0", "pos1"];

// Punctuation- and case-insensitive token key, so "wichtig." and "wichtig" match.
function tokenKey(t) {
  return t.toLowerCase().replace(/[.,!?;:"“”„'()\-–]/g, "");
}

// LEVELS comes out of a vm realm, so its Array methods produce vm-realm arrays.
// Rebuild in this realm to keep deepEqual's prototype check happy.
function allItems() {
  const out = [];
  for (const lv of LEVELS) for (const it of lv.items) out.push({ it, lv });
  return out;
}

describe("satzbau_data.js — levels", () => {
  test("has 14 levels and every level is well formed", () => {
    assert.equal(LEVELS.length, 14);
    for (const lv of LEVELS) {
      assert.ok(lv.id, "level missing id");
      assert.ok(lv.label, `${lv.id}: missing label`);
      assert.ok(VALID_CEFR.includes(lv.cefr), `${lv.id}: bad cefr ${lv.cefr}`);
      assert.match(lv.color, /^#[0-9a-f]{6}$/i, `${lv.id}: bad color`);
      assert.ok(lv.rule, `${lv.id}: missing rule`);
      assert.ok(Array.isArray(lv.items) && lv.items.length >= 10, `${lv.id}: needs >= 10 items`);
    }
  });

  test("level ids are unique", () => {
    const ids = LEVELS.map(l => l.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  test("B2 is the emphasis — at least 6 levels", () => {
    const b2 = LEVELS.filter(l => l.cefr === "B2");
    assert.ok(b2.length >= 6, `only ${b2.length} B2 levels`);
  });

  test("levels are ordered by ascending CEFR", () => {
    const rank = { A1: 0, A2: 1, B1: 2, B2: 3 };
    for (let i = 1; i < LEVELS.length; i++) {
      assert.ok(
        rank[LEVELS[i].cefr] >= rank[LEVELS[i - 1].cefr],
        `${LEVELS[i].id} (${LEVELS[i].cefr}) comes after ${LEVELS[i - 1].id} (${LEVELS[i - 1].cefr})`
      );
    }
  });

  test("every rule card has a headline, diagram, points and examples", () => {
    for (const lv of LEVELS) {
      const r = lv.rule;
      assert.ok(r.headline && r.headline.length > 20, `${lv.id}: weak headline`);
      assert.ok(Array.isArray(r.diagram) && r.diagram.length >= 3, `${lv.id}: diagram too short`);
      assert.ok(Array.isArray(r.points) && r.points.length >= 3, `${lv.id}: needs >= 3 points`);
      assert.ok(Array.isArray(r.examples) && r.examples.length >= 3, `${lv.id}: needs >= 3 examples`);
      for (const e of r.examples) {
        assert.ok(e.de && e.en, `${lv.id}: example missing de/en`);
      }
      if (r.contrast) {
        assert.ok(r.contrast.a && r.contrast.b && r.contrast.note, `${lv.id}: incomplete contrast`);
      }
    }
  });

  test("every diagram chunk uses a real .satz-part colour key", () => {
    for (const lv of LEVELS) {
      for (const d of lv.rule.diagram) {
        assert.ok(d.text, `${lv.id}: diagram chunk without text`);
        assert.ok(VALID_POS.includes(d.pos), `${lv.id}: bad diagram pos "${d.pos}"`);
      }
    }
  });
});

describe("satzbau_data.js — items", () => {
  test("item ids are unique across every level", () => {
    const ids = allItems().map(({ it }) => it.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    assert.deepEqual(dupes, [], `duplicate ids: ${dupes.join(", ")}`);
  });

  test("every item has a type and a non-empty why", () => {
    for (const { it, lv } of allItems()) {
      assert.ok(["order", "conj", "fix"].includes(it.type), `${lv.id}/${it.id}: bad type ${it.type}`);
      assert.ok(it.why && slStripTags(it.why).trim().length > 10, `${lv.id}/${it.id}: weak why`);
    }
  });

  test("all three mechanics are represented in the curriculum", () => {
    const types = new Set(allItems().map(({ it }) => it.type));
    for (const t of ["order", "conj", "fix"]) {
      assert.ok(types.has(t), `no ${t} items anywhere`);
    }
  });

  test("order items rebuild a well-formed German sentence", () => {
    for (const { it, lv } of allItems()) {
      if (it.type !== "order") continue;
      assert.ok(it.en, `${lv.id}/${it.id}: missing English prompt`);
      assert.ok(it.parts.length >= 3, `${lv.id}/${it.id}: needs >= 3 parts`);
      for (const p of it.parts) {
        assert.ok(p.text && p.text.trim(), `${lv.id}/${it.id}: empty part`);
        assert.ok(VALID_POS.includes(p.pos), `${lv.id}/${it.id}: bad pos "${p.pos}"`);
      }
      const sentence = it.parts.map(p => p.text).join(" ");
      assert.match(sentence, /^[A-ZÄÖÜ]/, `${lv.id}/${it.id}: not capitalised — ${sentence}`);
      assert.match(sentence, /[.?]$/, `${lv.id}/${it.id}: no end punctuation — ${sentence}`);
      assert.ok(!/\s{2,}/.test(sentence), `${lv.id}/${it.id}: double space — ${sentence}`);
    }
  });

  test("order alternatives, where given, normalise to a different string", () => {
    for (const { it, lv } of allItems()) {
      if (it.type !== "order" || !it.alts || !it.alts.length) continue;
      const target = slNormalize(it.parts.map(p => p.text).join(" "));
      for (const alt of it.alts) {
        assert.notEqual(slNormalize(alt), target, `${lv.id}/${it.id}: alt duplicates the target`);
      }
    }
  });

  test("conj items offer the answer plus complete alternatives", () => {
    for (const { it, lv } of allItems()) {
      if (it.type !== "conj") continue;
      assert.ok(it.clauseA && it.clauseB, `${lv.id}/${it.id}: missing clause`);
      assert.ok(it.options.length >= 3, `${lv.id}/${it.id}: needs >= 3 options`);
      assert.ok(
        it.options.some(o => o.word === it.answer),
        `${lv.id}/${it.id}: answer "${it.answer}" is not among the options`
      );
      const words = it.options.map(o => o.word);
      assert.equal(new Set(words).size, words.length, `${lv.id}/${it.id}: duplicate option`);
      for (const o of it.options) {
        assert.ok(o.word, `${lv.id}/${it.id}: option without word`);
        assert.ok(VALID_EFFECT.includes(o.effect), `${lv.id}/${it.id}: bad effect "${o.effect}"`);
        assert.ok(o.result && /[.?]$/.test(o.result), `${lv.id}/${it.id}: option "${o.word}" has no full result sentence`);
        assert.ok(o.note && o.note.length > 10, `${lv.id}/${it.id}: option "${o.word}" has a weak note`);
        assert.ok(
          slNormalize(o.result).includes(slNormalize(o.word)),
          `${lv.id}/${it.id}: result for "${o.word}" does not contain that word`
        );
      }
    }
  });

  test("fix items differ only in word order, and badIndex points at the culprit", () => {
    for (const { it, lv } of allItems()) {
      if (it.type !== "fix") continue;
      assert.notEqual(it.wrong, it.correct, `${lv.id}/${it.id}: wrong === correct`);
      assert.match(it.correct, /^[A-ZÄÖÜ]/, `${lv.id}/${it.id}: correct not capitalised`);
      assert.match(it.correct, /[.?]$/, `${lv.id}/${it.id}: correct has no end punctuation`);

      const wrongToks = it.wrong.split(/\s+/);
      const correctToks = it.correct.split(/\s+/);
      assert.ok(
        Number.isInteger(it.badIndex) && it.badIndex >= 0 && it.badIndex < wrongToks.length,
        `${lv.id}/${it.id}: badIndex ${it.badIndex} out of range`
      );

      // Same words in both, only rearranged — guards against typos in authored pairs.
      const a = wrongToks.map(tokenKey).sort().join("|");
      const b = correctToks.map(tokenKey).sort().join("|");
      assert.equal(a, b, `${lv.id}/${it.id}: wrong and correct are not the same words rearranged`);

      // The flagged token must actually have moved.
      const flagged = tokenKey(wrongToks[it.badIndex]);
      assert.notEqual(
        flagged,
        tokenKey(correctToks[it.badIndex] || ""),
        `${lv.id}/${it.id}: token at badIndex ${it.badIndex} ("${wrongToks[it.badIndex]}") did not move`
      );
    }
  });
});

describe("app.js — pure Satzbau helpers", () => {
  test("slNormalize strips punctuation, case and extra spacing", () => {
    assert.equal(slNormalize("Ich  lerne Deutsch."), "ich lerne deutsch");
    assert.equal(
      slNormalize("Ich lerne Deutsch, weil ich hier wohne."),
      slNormalize("ich   lerne deutsch weil ich hier wohne")
    );
    assert.notEqual(slNormalize("Ich lerne Deutsch."), slNormalize("Deutsch lerne ich."));
  });

  test("slStripTags removes the inline markup used in why-lines", () => {
    assert.equal(slStripTags("<em>weil</em> sends the verb back"), "weil sends the verb back");
    assert.equal(slStripTags(null), "");
  });

  test("slShuffle keeps every element exactly once", () => {
    const src = LEVELS[0].items.slice();
    const out = slShuffle(src.slice());
    assert.equal(out.length, src.length);
    assert.deepEqual(
      out.map(i => i.id).sort((a, b) => a - b),
      src.map(i => i.id).sort((a, b) => a - b)
    );
  });

  test("a scrambled order item reassembles into its target sentence", () => {
    const { it: item } = allItems().find(({ it }) => it.type === "order");
    const target = item.parts.map(p => p.text).join(" ");

    const scrambled = slShuffle(item.parts.slice());
    const reassembled = scrambled
      .slice()
      .sort((a, b) => item.parts.indexOf(a) - item.parts.indexOf(b))
      .map(p => p.text)
      .join(" ");

    assert.equal(slNormalize(reassembled), slNormalize(target));
  });
});
