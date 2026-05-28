// Tests for the CEFR level filter feature.
// Covers: data integrity (phrases, grammar topics, words), filter logic for all 4 modes.
// Run: node --test tests/cefr.test.js

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");
const VALID_LEVELS = new Set(["a1", "a2", "b1", "b2", "c1", "c2"]);

// ---------------------------------------------------------------------------
// Load data from source files
// ---------------------------------------------------------------------------

function loadPhrases() {
  const content = fs.readFileSync(path.join(ROOT, "data.js"), "utf8");
  const match = content.match(/const PHRASES\s*=\s*(\[[\s\S]*?\]);/);
  assert.ok(match, "Could not find PHRASES array in data.js");
  return JSON.parse(match[1]);
}

function loadWords() {
  const content = fs.readFileSync(path.join(ROOT, "words_data.js"), "utf8");
  // Strip `const` so the assignment becomes a global property on the vm context
  const script = content.replace(/^\s*const\s+WORDS\s*=/, "WORDS =");
  const ctx = {};
  vm.runInNewContext(script, ctx);
  return ctx.WORDS;
}

function loadGrammarTopics() {
  const content = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
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
// Mirror of filter logic from app.js (kept in sync manually)
// ---------------------------------------------------------------------------

const TIER_TO_CEFR = { 1: "a1", 2: "a2", 3: "b1", 4: "b2" };

function filterPhrases(phrases, cefrFilter) {
  if (cefrFilter === "all") return phrases;
  return phrases.filter(p => p.level === cefrFilter);
}

function filterWords(words, cefrFilter) {
  if (cefrFilter === "all") return words;
  return words.filter(w => TIER_TO_CEFR[w.tier] === cefrFilter);
}

function filterGrammarTopics(topics, cefrFilter) {
  if (cefrFilter === "all") return topics;
  return topics.filter(t => t.level === cefrFilter);
}

function extractVocabWords(phrases) {
  const STOP_WORDS = new Set(["ich", "du", "er", "sie", "es", "wir", "ihr", "die", "der", "das",
    "ein", "eine", "und", "ist", "bin", "hat", "haben", "sein", "mit", "in", "auf", "für",
    "von", "zu", "an", "dem", "den", "des", "nach", "aus", "bei", "wie", "was", "dass"]);
  const map = new Map();
  for (const p of phrases) {
    const tokens = p.german.replace(/[.,!?;:]/g, "").split(/\s+/).filter(Boolean);
    for (const tok of tokens) {
      const key = tok.toLowerCase();
      if (key.length < 3 || STOP_WORDS.has(key)) continue;
      if (!map.has(key)) map.set(key, { display: tok, count: 0, phraseIds: [] });
      const entry = map.get(key);
      entry.count++;
      if (!entry.phraseIds.includes(p.id)) entry.phraseIds.push(p.id);
    }
  }
  return [...map.entries()].map(([key, val]) => ({ key, ...val }));
}

// ---------------------------------------------------------------------------
// Data integrity: phrases
// ---------------------------------------------------------------------------

describe("CEFR data integrity — phrases", () => {
  const PHRASES = loadPhrases();

  test("all 349 phrases are present", () => {
    assert.equal(PHRASES.length, 349);
  });

  test("every phrase has a level field", () => {
    const missing = PHRASES.filter(p => !("level" in p));
    assert.equal(missing.length, 0, `${missing.length} phrases missing level: ${missing.map(p => p.id).join(", ")}`);
  });

  test("every phrase level is a valid CEFR value", () => {
    const invalid = PHRASES.filter(p => !VALID_LEVELS.has(p.level));
    assert.equal(invalid.length, 0, `Invalid levels: ${invalid.map(p => `#${p.id}=${p.level}`).join(", ")}`);
  });

  test("at least 3 different levels are represented", () => {
    const levels = new Set(PHRASES.map(p => p.level));
    assert.ok(levels.size >= 3, `Only ${levels.size} levels used: ${[...levels].join(", ")}`);
  });

  test("no single level has more than 60% of all phrases", () => {
    const counts = {};
    for (const p of PHRASES) counts[p.level] = (counts[p.level] || 0) + 1;
    for (const [level, count] of Object.entries(counts)) {
      const pct = count / PHRASES.length;
      assert.ok(pct <= 0.60, `Level ${level} has ${Math.round(pct * 100)}% of phrases (expected ≤60%)`);
    }
  });

  test("A1 phrases exist and are simpler than B2", () => {
    const a1 = PHRASES.filter(p => p.level === "a1");
    const b2 = PHRASES.filter(p => p.level === "b2");
    assert.ok(a1.length > 0, "No A1 phrases found");
    // A1 should have more phrases than B2 (beginner content is more common here)
    assert.ok(a1.length >= b2.length, `Expected more A1 (${a1.length}) than B2 (${b2.length}) phrases`);
  });
});

// ---------------------------------------------------------------------------
// Data integrity: grammar topics
// ---------------------------------------------------------------------------

describe("CEFR data integrity — grammar topics", () => {
  const TOPICS = loadGrammarTopics();

  test("grammar topics array is non-empty", () => {
    assert.ok(TOPICS.length > 0, "GRAMMAR_TOPICS is empty");
  });

  test("every grammar topic has a level field", () => {
    const missing = TOPICS.filter(t => !("level" in t));
    assert.equal(missing.length, 0, `Topics missing level: ${missing.map(t => t.id).join(", ")}`);
  });

  test("every grammar topic level is a valid CEFR value", () => {
    const invalid = TOPICS.filter(t => !VALID_LEVELS.has(t.level));
    assert.equal(invalid.length, 0, `Invalid topic levels: ${invalid.map(t => `${t.id}=${t.level}`).join(", ")}`);
  });

  test("at least 3 different levels are represented across grammar topics", () => {
    const levels = new Set(TOPICS.map(t => t.level));
    assert.ok(levels.size >= 3, `Only ${levels.size} levels: ${[...levels].join(", ")}`);
  });

  test("Fragewort is tagged A1", () => {
    const topic = TOPICS.find(t => t.id === "Fragewort");
    assert.ok(topic, "Fragewort topic not found");
    assert.equal(topic.level, "a1");
  });

  test("Perfekt is tagged A2", () => {
    const topic = TOPICS.find(t => t.id === "Perfekt");
    assert.ok(topic, "Perfekt topic not found");
    assert.equal(topic.level, "a2");
  });

  test("Konjunktiv-II is tagged B2", () => {
    const topic = TOPICS.find(t => t.id === "Konjunktiv-II");
    assert.ok(topic, "Konjunktiv-II topic not found");
    assert.equal(topic.level, "b2");
  });

  test("Passiv is tagged B2", () => {
    const topic = TOPICS.find(t => t.id === "Passiv");
    assert.ok(topic, "Passiv topic not found");
    assert.equal(topic.level, "b2");
  });

  test("Präteritum is tagged B1", () => {
    const topic = TOPICS.find(t => t.id === "Präteritum");
    assert.ok(topic, "Präteritum topic not found");
    assert.equal(topic.level, "b1");
  });
});

// ---------------------------------------------------------------------------
// Data integrity: words
// ---------------------------------------------------------------------------

describe("CEFR data integrity — words", () => {
  const WORDS = loadWords();

  test("words array is non-empty", () => {
    assert.ok(WORDS.length > 0);
  });

  test("every word has a tier in 1-4", () => {
    const bad = WORDS.filter(w => ![1, 2, 3, 4].includes(w.tier));
    assert.equal(bad.length, 0, `Words with bad tier: ${bad.map(w => w.id).slice(0, 5).join(", ")}`);
  });

  test("TIER_TO_CEFR covers all tiers used in words_data.js", () => {
    const tiers = new Set(WORDS.map(w => w.tier));
    for (const tier of tiers) {
      assert.ok(TIER_TO_CEFR[tier], `Tier ${tier} has no CEFR mapping`);
    }
  });

  test("tier 1 maps to a1, tier 2 to a2, tier 3 to b1, tier 4 to b2", () => {
    assert.equal(TIER_TO_CEFR[1], "a1");
    assert.equal(TIER_TO_CEFR[2], "a2");
    assert.equal(TIER_TO_CEFR[3], "b1");
    assert.equal(TIER_TO_CEFR[4], "b2");
  });
});

// ---------------------------------------------------------------------------
// Filter logic: phrases
// ---------------------------------------------------------------------------

describe("phrase filter logic", () => {
  const PHRASES = loadPhrases();

  test("'all' returns all phrases unchanged", () => {
    const result = filterPhrases(PHRASES, "all");
    assert.equal(result.length, PHRASES.length);
  });

  test("selecting a level returns only phrases with that level", () => {
    for (const level of ["a1", "a2", "b1", "b2"]) {
      const result = filterPhrases(PHRASES, level);
      const wrong = result.filter(p => p.level !== level);
      assert.equal(wrong.length, 0, `Level ${level} filter returned phrases with wrong level`);
    }
  });

  test("b1 filter excludes a1 and a2 phrases", () => {
    const result = filterPhrases(PHRASES, "b1");
    const shouldBeExcluded = result.filter(p => p.level === "a1" || p.level === "a2");
    assert.equal(shouldBeExcluded.length, 0);
  });

  test("a1 filter excludes b1 and b2 phrases", () => {
    const result = filterPhrases(PHRASES, "a1");
    const shouldBeExcluded = result.filter(p => p.level === "b1" || p.level === "b2");
    assert.equal(shouldBeExcluded.length, 0);
  });

  test("c2 filter returns empty (no c2 phrases in current data)", () => {
    const result = filterPhrases(PHRASES, "c2");
    assert.equal(result.length, 0);
  });

  test("a1 + a2 + b1 + b2 counts sum to total phrase count", () => {
    const counts = ["a1", "a2", "b1", "b2", "c1", "c2"]
      .reduce((sum, l) => sum + filterPhrases(PHRASES, l).length, 0);
    assert.equal(counts, PHRASES.length);
  });
});

// ---------------------------------------------------------------------------
// Filter logic: words
// ---------------------------------------------------------------------------

describe("word filter logic", () => {
  const WORDS = loadWords();

  test("'all' returns all words unchanged", () => {
    assert.equal(filterWords(WORDS, "all").length, WORDS.length);
  });

  test("b1 filter returns only tier-3 words", () => {
    const result = filterWords(WORDS, "b1");
    const wrongTier = result.filter(w => w.tier !== 3);
    assert.equal(wrongTier.length, 0, "b1 filter should return only tier-3 words");
  });

  test("a1 filter returns only tier-1 words", () => {
    const result = filterWords(WORDS, "a1");
    const wrongTier = result.filter(w => w.tier !== 1);
    assert.equal(wrongTier.length, 0, "a1 filter should return only tier-1 words");
  });

  test("b1 filter excludes tier-1 and tier-4 words", () => {
    const result = filterWords(WORDS, "b1");
    const bad = result.filter(w => w.tier === 1 || w.tier === 4);
    assert.equal(bad.length, 0);
  });

  test("c1 filter returns empty (no tier maps to c1)", () => {
    const result = filterWords(WORDS, "c1");
    assert.equal(result.length, 0);
  });

  test("tier counts across all CEFR levels sum to total word count", () => {
    const sum = ["a1", "a2", "b1", "b2"].reduce((s, l) => s + filterWords(WORDS, l).length, 0);
    assert.equal(sum, WORDS.length);
  });
});

// ---------------------------------------------------------------------------
// Filter logic: grammar topics
// ---------------------------------------------------------------------------

describe("grammar topic filter logic", () => {
  const TOPICS = loadGrammarTopics();

  test("'all' returns all topics", () => {
    assert.equal(filterGrammarTopics(TOPICS, "all").length, TOPICS.length);
  });

  test("b2 filter returns only b2-tagged topics", () => {
    const result = filterGrammarTopics(TOPICS, "b2");
    const wrong = result.filter(t => t.level !== "b2");
    assert.equal(wrong.length, 0);
    assert.ok(result.length > 0, "Expected at least one B2 grammar topic");
  });

  test("a1 filter returns only a1-tagged topics", () => {
    const result = filterGrammarTopics(TOPICS, "a1");
    const wrong = result.filter(t => t.level !== "a1");
    assert.equal(wrong.length, 0);
    assert.ok(result.length > 0, "Expected at least one A1 grammar topic");
  });

  test("b2 filter includes Konjunktiv-II and Passiv", () => {
    const result = filterGrammarTopics(TOPICS, "b2");
    const ids = result.map(t => t.id);
    assert.ok(ids.includes("Konjunktiv-II"), "Konjunktiv-II missing from b2 filter");
    assert.ok(ids.includes("Passiv"), "Passiv missing from b2 filter");
  });

  test("a1 filter includes Fragewort", () => {
    const result = filterGrammarTopics(TOPICS, "a1");
    const ids = result.map(t => t.id);
    assert.ok(ids.includes("Fragewort"), "Fragewort missing from a1 filter");
  });

  test("a1 filter excludes Konjunktiv-II", () => {
    const result = filterGrammarTopics(TOPICS, "a1");
    const ids = result.map(t => t.id);
    assert.ok(!ids.includes("Konjunktiv-II"), "Konjunktiv-II should not appear in a1 filter");
  });

  test("all level counts sum to total topic count", () => {
    const sum = [...VALID_LEVELS].reduce((s, l) => s + filterGrammarTopics(TOPICS, l).length, 0);
    assert.equal(sum, TOPICS.length);
  });
});

// ---------------------------------------------------------------------------
// Vocab extraction respects phrase filter
// ---------------------------------------------------------------------------

describe("vocab extraction with CEFR filter", () => {
  const PHRASES = loadPhrases();

  test("extractVocabWords on all phrases returns more words than on a1 only", () => {
    const allWords = extractVocabWords(PHRASES);
    const a1Words = extractVocabWords(filterPhrases(PHRASES, "a1"));
    assert.ok(allWords.length > a1Words.length,
      "Filtering to A1 phrases should yield fewer vocab words than all phrases");
  });

  test("word unique to a b1 phrase does not appear in a1 vocab", () => {
    const b1Phrases = filterPhrases(PHRASES, "b1");
    const a1Phrases = filterPhrases(PHRASES, "a1");

    // Find a word that only appears in b1 phrases (not in a1 phrases)
    const b1Vocab = new Set(extractVocabWords(b1Phrases).map(w => w.key));
    const a1Vocab = new Set(extractVocabWords(a1Phrases).map(w => w.key));

    // There should be words in b1 that are not in a1
    const exclusiveB1Words = [...b1Vocab].filter(w => !a1Vocab.has(w));
    assert.ok(exclusiveB1Words.length > 0, "Expected some words exclusive to B1 phrases");
  });

  test("extractVocabWords on empty array returns empty array", () => {
    const result = extractVocabWords([]);
    assert.equal(result.length, 0);
  });

  test("each vocab word has key, display, count, and phraseIds fields", () => {
    const words = extractVocabWords(PHRASES.slice(0, 10));
    assert.ok(words.length > 0);
    for (const w of words) {
      assert.ok("key" in w, "missing key");
      assert.ok("display" in w, "missing display");
      assert.ok("count" in w && w.count > 0, "missing/invalid count");
      assert.ok(Array.isArray(w.phraseIds) && w.phraseIds.length > 0, "missing phraseIds");
    }
  });
});
