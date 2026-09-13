// Tests for the Übersetzer tab: the client-side CEFR level check (the part that
// makes this more than an LLM prompt) and the two new api/chat.js modes.
// Run: node --test tests/uebersetzer.test.js

const { test, describe, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");

function readFile(name) {
  return fs.readFileSync(path.join(ROOT, name), "utf8");
}

// ---------------------------------------------------------------------------
// Load WORDS and the DOM-free Übersetzer helpers out of app.js
// ---------------------------------------------------------------------------

function loadWords() {
  const code = readFile("words_data.js").replace(/^\s*const\s+WORDS\s*=/, "WORDS =");
  const ctx = {};
  vm.runInNewContext(code, ctx);
  return ctx.WORDS;
}

function loadHelpers() {
  const appJs = readFile("app.js");

  // Each helper is a top-level `function name(...)` that runs to the next
  // top-level `function`, same slicing the satzbau tests use.
  function extractFn(name) {
    const start = appJs.indexOf(`function ${name}(`);
    assert.ok(start !== -1, `function ${name} not found in app.js`);
    const after = appJs.slice(start + 1);
    const endRel = after.search(/\nfunction /);
    assert.ok(endRel !== -1, `could not find the end of ${name}`);
    return appJs.slice(start, start + 1 + endRel).trim();
  }

  function extractConst(name) {
    const re = new RegExp(`const ${name}\\s*=\\s*[\\s\\S]*?;\\n`, "m");
    const m = appJs.match(re);
    assert.ok(m, `const ${name} not found in app.js`);
    return m[0].replace(/^const /, "");
  }

  const ctx = {};
  vm.runInNewContext(
    [
      extractConst("UEB_SUFFIXES"),
      extractConst("UEB_LEVEL_TO_TIER"),
      extractConst("TIER_TO_CEFR"),
      extractConst("STOP_WORDS"),
      extractFn("uebStem"),
      extractFn("uebBuildLexicon"),
      extractFn("uebTokenize"),
      extractFn("checkLevelCompliance"),
    ].join("\n\n"),
    ctx
  );
  return ctx;
}

const WORDS = loadWords();
const H = loadHelpers();
const LEX = H.uebBuildLexicon(WORDS);

// checkLevelCompliance falls back to globals for the lexicon and stop words,
// neither of which exist in this realm, so always pass both explicitly.
// Its arrays come back carrying the vm realm's Array prototype, which
// assert/strict rejects on identity, so rebuild them in this realm.
function check(text, level) {
  const r = H.checkLevelCompliance(text, level, LEX, H.STOP_WORDS);
  return { ...r, aboveBand: [...r.aboveBand], offList: [...r.offList] };
}

function tokenize(text) {
  return [...H.uebTokenize(text)];
}

// ---------------------------------------------------------------------------
// uebStem
// ---------------------------------------------------------------------------

describe("uebStem", () => {
  test("strips the common German inflectional endings", () => {
    assert.equal(H.uebStem("gehen"), "geh");
    assert.equal(H.uebStem("gehe"), "geh");
    assert.equal(H.uebStem("wohnungen"), "wohn");
    assert.equal(H.uebStem("schönes"), "schön");
  });

  test("an inflected form and its lemma reach the same stem", () => {
    assert.equal(H.uebStem("arbeite"), H.uebStem("arbeiten"));
    assert.equal(H.uebStem("kleines"), H.uebStem("kleinen"));
  });

  test("never strips below three characters, so short words survive intact", () => {
    for (const w of ["ist", "bin", "ein", "und", "das", "wir"]) {
      assert.equal(H.uebStem(w), w, `${w} should not be stemmed away`);
    }
  });

  test("lowercases and drops punctuation and digits", () => {
    assert.equal(H.uebStem("Haus!"), H.uebStem("haus"));
    assert.equal(H.uebStem("B2-Niveau"), H.uebStem("bniveau"));
  });

  test("survives empty and nullish input", () => {
    assert.equal(H.uebStem(""), "");
    assert.equal(H.uebStem(null), "");
    assert.equal(H.uebStem(undefined), "");
  });
});

// ---------------------------------------------------------------------------
// uebTokenize
// ---------------------------------------------------------------------------

describe("uebTokenize", () => {
  test("splits a German sentence into lowercase word tokens", () => {
    assert.deepEqual(
      tokenize("Ich gehe heute nach Hause."),
      ["ich", "gehe", "heute", "nach", "hause"]
    );
  });

  test("keeps umlauts and ß, drops everything else", () => {
    assert.deepEqual(tokenize("Über 20 Straßen, wirklich?"), ["über", "straßen", "wirklich"]);
  });

  test("returns an empty array for empty input", () => {
    assert.deepEqual(tokenize(""), []);
    assert.deepEqual(tokenize("   "), []);
    assert.deepEqual(tokenize(null), []);
  });
});

// ---------------------------------------------------------------------------
// uebBuildLexicon
// ---------------------------------------------------------------------------

describe("uebBuildLexicon", () => {
  test("indexes the whole word list", () => {
    assert.ok(LEX.size > 500, `expected a substantial lexicon, got ${LEX.size}`);
  });

  test("every tier in the map is a real WORDS tier", () => {
    for (const tier of LEX.values()) {
      assert.ok([1, 2, 3, 4].includes(tier), `unexpected tier ${tier}`);
    }
  });

  test("core verbs land in tier 1", () => {
    assert.equal(LEX.get(H.uebStem("sein")), 1);
    assert.equal(LEX.get(H.uebStem("haben")), 1);
  });

  test("a stem shared across tiers keeps the easiest tier", () => {
    // Otherwise a common word could be flagged as above-band because some
    // rarer entry happened to share its stem.
    const shared = new Map();
    for (const w of WORDS) {
      for (const part of String(w.german).toLowerCase().split(/\s+/)) {
        const stem = H.uebStem(part);
        if (stem.length < 3) continue;
        if (!shared.has(stem)) shared.set(stem, []);
        shared.get(stem).push(w.tier);
      }
    }
    for (const [stem, tiers] of shared) {
      assert.equal(LEX.get(stem), Math.min(...tiers), `stem "${stem}" should keep its lowest tier`);
    }
  });

  test("tolerates junk entries without throwing", () => {
    const lex = H.uebBuildLexicon([null, {}, { german: "" }, { german: "Haus" }, { german: "Haus", tier: 2 }]);
    assert.equal(lex.get(H.uebStem("haus")), 2);
  });

  test("returns an empty map for no input", () => {
    assert.equal(H.uebBuildLexicon([]).size, 0);
    assert.equal(H.uebBuildLexicon(undefined).size, 0);
  });
});

// ---------------------------------------------------------------------------
// checkLevelCompliance - the actual differentiator
// ---------------------------------------------------------------------------

describe("checkLevelCompliance", () => {
  test("simple A1 German passes the A1 band", () => {
    const r = check("Ich habe ein Haus.", "a1");
    assert.equal(r.aboveBand.length, 0);
  });

  test("flags a word that WORDS places above the target band", () => {
    // Pick a real tier-4 word from the data rather than guessing one.
    const hard = WORDS.find(w => w.tier === 4 && /^[a-zäöüß]+$/i.test(w.german));
    assert.ok(hard, "expected at least one single-token tier-4 word");
    const r = check(`Ich muss ${hard.german} heute.`, "a1");
    assert.ok(
      r.aboveBand.some(x => H.uebStem(x.word) === H.uebStem(hard.german)),
      `expected "${hard.german}" to be flagged above A1, got ${JSON.stringify(r.aboveBand)}`
    );
  });

  test("the same word is fine at its own level", () => {
    const hard = WORDS.find(w => w.tier === 4 && /^[a-zäöüß]+$/i.test(w.german));
    const r = check(`Ich muss ${hard.german} heute.`, "b2");
    assert.equal(r.aboveBand.length, 0);
  });

  test("a stricter level flags at least as much as a looser one", () => {
    const text = "Ich möchte die Wohnung sehen, weil sie günstig ist.";
    const order = ["a1", "a2", "b1", "b2"];
    for (let i = 1; i < order.length; i++) {
      const looser = check(text, order[i]).aboveBand.length;
      const stricter = check(text, order[i - 1]).aboveBand.length;
      assert.ok(
        stricter >= looser,
        `${order[i - 1]} flagged ${stricter} but ${order[i]} flagged ${looser}`
      );
    }
  });

  test("b2 and c1 share the top band, so neither can flag anything", () => {
    const text = "Obwohl die Wohnung teuer ist, würde ich sie trotzdem nehmen.";
    assert.equal(check(text, "b2").aboveBand.length, 0);
    assert.equal(check(text, "c1").aboveBand.length, 0);
  });

  test("an unknown level falls back to the widest band instead of flagging everything", () => {
    const text = "Obwohl die Wohnung teuer ist, würde ich sie trotzdem nehmen.";
    assert.equal(check(text, "z9").aboveBand.length, 0);
    assert.equal(check(text, undefined).maxTier, 4);
  });

  test("reports each offending word once, however often it repeats", () => {
    const hard = WORDS.find(w => w.tier === 4 && /^[a-zäöüß]+$/i.test(w.german));
    const r = check(`${hard.german} ${hard.german} ${hard.german}`, "a1");
    const hits = r.aboveBand.filter(x => H.uebStem(x.word) === H.uebStem(hard.german));
    assert.equal(hits.length, 1);
  });

  test("carries the CEFR label for each flagged word", () => {
    const hard = WORDS.find(w => w.tier === 4 && /^[a-zäöüß]+$/i.test(w.german));
    const r = check(`Ich muss ${hard.german} heute.`, "a1");
    for (const w of r.aboveBand) {
      assert.match(w.cefr, /^(A1|A2|B1|B2)$/, `unexpected CEFR label ${w.cefr}`);
      assert.ok(w.tier > r.maxTier, "a flagged word must sit above the band");
    }
  });

  test("skips stop words, so grammar words never count as difficulty", () => {
    const r = check("Ich bin in der und das mit von zu", "a1");
    assert.equal(r.content, 0);
    assert.equal(r.aboveBand.length, 0);
  });

  test("the tier histogram accounts for every content word exactly once", () => {
    const r = check("Ich möchte morgen eine günstige Wohnung in der Stadt finden.", "b1");
    const summed = r.profile[1] + r.profile[2] + r.profile[3] + r.profile[4] + r.profile.off;
    assert.equal(summed, r.content);
  });

  test("words outside the 1000-word list land in offList, not in aboveBand", () => {
    // A nonsense token cannot be graded, so it must never fail a translation.
    const r = check("Ich sehe ein Xylophonquatschwort.", "a1");
    assert.ok(r.offList.includes("xylophonquatschwort"));
    assert.equal(r.aboveBand.length, 0);
  });

  test("offList is deduplicated too", () => {
    const r = check("Xylophonquatschwort Xylophonquatschwort", "a1");
    assert.equal(r.offList.filter(w => w === "xylophonquatschwort").length, 1);
  });

  test("empty text yields an empty, non-throwing report", () => {
    const r = check("", "b1");
    assert.equal(r.content, 0);
    assert.deepEqual(r.aboveBand, []);
    assert.deepEqual(r.offList, []);
    assert.equal(r.profile.off, 0);
  });

  test("matches inflected forms against their lemma in the word list", () => {
    // "gehen" is tier 1; "gehe" must resolve to it rather than falling off-list.
    const r = check("Ich gehe.", "a1");
    assert.equal(r.offList.length, 0);
  });
});

// ---------------------------------------------------------------------------
// api/chat.js - translate-level and translate-grade
// ---------------------------------------------------------------------------

function mockRes() {
  return {
    statusCode: 200,
    _headers: {},
    body: null,
    setHeader(k, v) { this._headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; },
    end() { return this; },
  };
}

function loadChatHandler() {
  process.env.GROQ_API_KEY = "fake";
  process.env.ELEVENLABS_API_KEY = "fake";
  const key = require.resolve("../api/chat.js");
  delete require.cache[key];
  return require("../api/chat.js");
}

// Captures the prompt so tests can assert on what was actually asked for.
function stubGroq(content) {
  const seen = { prompts: [] };
  global.fetch = async (url, opts) => {
    if (String(url).includes("groq")) {
      const body = JSON.parse(opts.body);
      seen.prompts.push(body.messages.map(m => m.content).join("\n"));
      seen.maxTokens = body.max_tokens;
      return { ok: true, json: async () => ({ choices: [{ message: { content } }] }) };
    }
    if (String(url).includes("elevenlabs")) {
      return { ok: true, arrayBuffer: async () => new ArrayBuffer(8) };
    }
    throw new Error(`Unexpected fetch: ${url}`);
  };
  return seen;
}

const LEVEL_REPLY = JSON.stringify({
  primary: "Ich suche eine Wohnung.",
  native: "Ich bin auf Wohnungssuche.",
  english: "I am looking for a flat.",
  difference: "The native version uses a compound noun instead of a verb.",
  grammar_note: "suchen takes the accusative.",
  used_due_words: ["Wohnung"],
  words: [{ de: "die Wohnung", en: "the flat" }],
});

describe("api/chat translate-level", () => {
  afterEach(() => {
    delete process.env.GROQ_API_KEY;
    delete process.env.ELEVENLABS_API_KEY;
    delete global.fetch;
  });

  test("returns both renderings plus the teaching fields", async () => {
    const h = loadChatHandler();
    stubGroq(LEVEL_REPLY);
    const res = mockRes();
    await h({ method: "POST", body: { mode: "translate-level", text: "I am looking for a flat", level: "b1" } }, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.primary, "Ich suche eine Wohnung.");
    assert.equal(res.body.native, "Ich bin auf Wohnungssuche.");
    assert.equal(res.body.difference, "The native version uses a compound noun instead of a verb.");
    assert.equal(res.body.grammar_note, "suchen takes the accusative.");
    assert.equal(res.body.level, "b1");
    assert.equal(res.body.direction, "en_de");
    assert.ok(res.body.audio_base64, "the level version should be spoken");
  });

  test("puts the requested level into the prompt", async () => {
    const h = loadChatHandler();
    const seen = stubGroq(LEVEL_REPLY);
    await h({ method: "POST", body: { mode: "translate-level", text: "hello", level: "a2" } }, mockRes());
    assert.match(seen.prompts[0], /A2/);
  });

  test("falls back to b1 for a level it does not know", async () => {
    const h = loadChatHandler();
    stubGroq(LEVEL_REPLY);
    const res = mockRes();
    await h({ method: "POST", body: { mode: "translate-level", text: "hello", level: "zz" } }, res);
    assert.equal(res.body.level, "b1");
  });

  test("passes the learner's due words through and caps them at 40", async () => {
    const h = loadChatHandler();
    const seen = stubGroq(LEVEL_REPLY);
    const due = Array.from({ length: 60 }, (_, i) => `Wort${i}`);
    await h({ method: "POST", body: { mode: "translate-level", text: "hello", level: "b1", dueWords: due } }, mockRes());
    assert.match(seen.prompts[0], /Wort0/);
    assert.match(seen.prompts[0], /Wort39/);
    // The cap is what keeps the request inside Groq's 8000 tokens/minute.
    assert.ok(!seen.prompts[0].includes("Wort40"), "should not send more than 40 due words");
  });

  test("omits the due-word instruction entirely when nothing is due", async () => {
    const h = loadChatHandler();
    const seen = stubGroq(LEVEL_REPLY);
    await h({ method: "POST", body: { mode: "translate-level", text: "hello", level: "b1", dueWords: [] } }, mockRes());
    assert.ok(!/due for review/.test(seen.prompts[0]));
  });

  test("ignores non-string entries in dueWords", async () => {
    const h = loadChatHandler();
    const seen = stubGroq(LEVEL_REPLY);
    await h({ method: "POST", body: { mode: "translate-level", text: "hi", level: "b1", dueWords: [null, 7, "Haus", "  "] } }, mockRes());
    assert.match(seen.prompts[0], /Haus/);
  });

  test("de_en asks for a simplified German rendering, not an English one", async () => {
    const h = loadChatHandler();
    const seen = stubGroq(LEVEL_REPLY);
    const res = mockRes();
    await h({ method: "POST", body: { mode: "translate-level", text: "Ungeachtet dessen...", level: "b1", direction: "de_en" } }, res);
    assert.equal(res.body.direction, "de_en");
    assert.match(seen.prompts[0], /READING/);
    assert.match(seen.prompts[0], /rewritten in German/);
  });

  test("an unrecognised direction falls back to en_de", async () => {
    const h = loadChatHandler();
    stubGroq(LEVEL_REPLY);
    const res = mockRes();
    await h({ method: "POST", body: { mode: "translate-level", text: "hi", direction: "klingon" } }, res);
    assert.equal(res.body.direction, "en_de");
  });

  test("caps the takeaway word list at five", async () => {
    const h = loadChatHandler();
    stubGroq(JSON.stringify({
      primary: "A", native: "B",
      words: Array.from({ length: 9 }, (_, i) => ({ de: `W${i}`, en: `w${i}` })),
    }));
    const res = mockRes();
    await h({ method: "POST", body: { mode: "translate-level", text: "hi" } }, res);
    assert.equal(res.body.words.length, 5);
  });

  test("drops malformed word entries", async () => {
    const h = loadChatHandler();
    stubGroq(JSON.stringify({ primary: "A", native: "B", words: [null, { en: "no german" }, { de: "das Haus", en: "house" }] }));
    const res = mockRes();
    await h({ method: "POST", body: { mode: "translate-level", text: "hi" } }, res);
    assert.deepEqual(res.body.words, [{ de: "das Haus", en: "house" }]);
  });

  test("tolerates a model that omits the optional fields", async () => {
    const h = loadChatHandler();
    stubGroq(JSON.stringify({ primary: "Ich gehe." }));
    const res = mockRes();
    await h({ method: "POST", body: { mode: "translate-level", text: "I go", level: "a1" } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.primary, "Ich gehe.");
    // With no native version the panel falls back to showing the level one.
    assert.equal(res.body.native, "Ich gehe.");
    assert.equal(res.body.difference, "");
    assert.deepEqual(res.body.words, []);
    assert.deepEqual(res.body.used_due_words, []);
  });

  test("echoes the source back as english for en_de", async () => {
    const h = loadChatHandler();
    stubGroq(JSON.stringify({ primary: "Ich gehe." }));
    const res = mockRes();
    await h({ method: "POST", body: { mode: "translate-level", text: "I go home", direction: "en_de" } }, res);
    assert.equal(res.body.english, "I go home");
  });

  test("502s rather than rendering an empty card when the model returns junk", async () => {
    const h = loadChatHandler();
    stubGroq("I could not do that, sorry.");
    const res = mockRes();
    await h({ method: "POST", body: { mode: "translate-level", text: "hi" } }, res);
    assert.equal(res.statusCode, 502);
    assert.match(res.body.error, /level-checked/);
  });

  test("400s when there is no text at all", async () => {
    const h = loadChatHandler();
    stubGroq(LEVEL_REPLY);
    const res = mockRes();
    await h({ method: "POST", body: { mode: "translate-level", text: "   " } }, res);
    assert.equal(res.statusCode, 400);
  });
});

const GRADE_REPLY = JSON.stringify({
  is_correct: false,
  corrected: "Ich helfe dem Mann.",
  feedback: "Very close - just the case to fix.",
  grammar_note: "helfen takes the Dativ, so den becomes dem.",
  score: 70,
});

describe("api/chat translate-grade", () => {
  afterEach(() => {
    delete process.env.GROQ_API_KEY;
    delete process.env.ELEVENLABS_API_KEY;
    delete global.fetch;
  });

  test("returns a verdict, a correction and the rule", async () => {
    const h = loadChatHandler();
    stubGroq(GRADE_REPLY);
    const res = mockRes();
    await h({ method: "POST", body: { mode: "translate-grade", text: "Ich helfe den Mann.", source: "I help the man", level: "b1" } }, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.is_correct, false);
    assert.equal(res.body.corrected, "Ich helfe dem Mann.");
    assert.equal(res.body.original, "Ich helfe den Mann.");
    assert.match(res.body.grammar_note, /Dativ/);
    assert.equal(res.body.score, 70);
    assert.ok(res.body.audio_base64);
  });

  test("marks against the learner's level, not against a native speaker", async () => {
    const h = loadChatHandler();
    const seen = stubGroq(GRADE_REPLY);
    await h({ method: "POST", body: { mode: "translate-grade", text: "Ich gehe.", source: "I go", level: "a2" } }, mockRes());
    assert.match(seen.prompts[0], /A2/);
    assert.match(seen.prompts[0], /not against a native speaker/);
  });

  test("400s without a source to grade against", async () => {
    const h = loadChatHandler();
    stubGroq(GRADE_REPLY);
    const res = mockRes();
    await h({ method: "POST", body: { mode: "translate-grade", text: "Ich gehe." } }, res);
    assert.equal(res.statusCode, 400);
    assert.match(res.body.error, /source/i);
  });

  test("clamps a nonsense score into 0-100", async () => {
    const h = loadChatHandler();
    stubGroq(JSON.stringify({ is_correct: true, corrected: "Ich gehe.", score: 5000 }));
    const res = mockRes();
    await h({ method: "POST", body: { mode: "translate-grade", text: "Ich gehe.", source: "I go" } }, res);
    assert.equal(res.body.score, 100);
  });

  test("a missing score becomes 0 rather than NaN", async () => {
    const h = loadChatHandler();
    stubGroq(JSON.stringify({ is_correct: true, corrected: "Ich gehe." }));
    const res = mockRes();
    await h({ method: "POST", body: { mode: "translate-grade", text: "Ich gehe.", source: "I go" } }, res);
    assert.equal(res.body.score, 0);
  });

  test("keeps the attempt as the correction when the model returns none", async () => {
    // The panel compares corrected against original to decide whether to show
    // a correction at all, so these must not silently diverge.
    const h = loadChatHandler();
    stubGroq(JSON.stringify({ is_correct: true }));
    const res = mockRes();
    await h({ method: "POST", body: { mode: "translate-grade", text: "Ich gehe.", source: "I go" } }, res);
    assert.equal(res.body.corrected, "Ich gehe.");
    assert.equal(res.body.corrected, res.body.original);
  });

  test("502s on unparseable model output", async () => {
    const h = loadChatHandler();
    stubGroq("no json here");
    const res = mockRes();
    await h({ method: "POST", body: { mode: "translate-grade", text: "Ich gehe.", source: "I go" } }, res);
    assert.equal(res.statusCode, 502);
  });
});

// ---------------------------------------------------------------------------
// Wiring - a tab missing from any of these is invisible or dead
// ---------------------------------------------------------------------------

describe("Übersetzer wiring", () => {
  const appJs = readFile("app.js");
  const indexHtml = readFile("index.html");
  const styleCss = readFile("style.css");

  test("the tab and the panel both exist in index.html", () => {
    assert.match(indexHtml, /data-mode="uebersetzer"/);
    assert.match(indexHtml, /id="ueb-panel"/);
  });

  test("the router handles the mode and the panel is set up on init", () => {
    assert.match(appJs, /newMode === "uebersetzer"/);
    assert.match(appJs, /showUebPanel\(\)/);
    assert.match(appJs, /\n {2}setupUebPanel\(\);/);
  });

  test("the mode is in MORE_SHEET_GROUPS, or it does not exist on a phone", () => {
    const start = appJs.indexOf("const MORE_SHEET_GROUPS = [");
    const groups = appJs.slice(start, appJs.indexOf("];", start));
    assert.match(groups, /"uebersetzer"/);
  });

  test("every other panel hides ueb-panel when it takes over", () => {
    // Each show*Panel lists the full set of panels; games-panel marks the sites.
    const hides = (appJs.match(/getElementById\("games-panel"\)\.style\.display = "none"/g) || []).length;
    const uebHides = (appJs.match(/getElementById\("ueb-panel"\)\.style\.display = "none"/g) || []).length;
    // showUebPanel hides games-panel but shows ueb-panel, so it is the single
    // site that legitimately has no matching hide.
    assert.equal(uebHides, hides - 1, "ueb-panel must be hidden wherever games-panel is");
    assert.match(appJs, /getElementById\("ueb-panel"\)\.style\.display = "flex"/);
  });

  test("grading feeds the global XP layer and the error log", () => {
    const start = appJs.indexOf("function renderUebGrade(");
    const body = appJs.slice(start, appJs.indexOf("\nfunction ", start + 1));
    assert.match(body, /awardXP\(/);
    assert.match(body, /logError\("uebersetzer"/);
  });

  test("every element the panel script touches exists in the markup", () => {
    const start = appJs.indexOf("// ---- Übersetzer (level-aware translator) ----");
    const section = appJs.slice(start, appJs.indexOf("// ---- Start ----"));
    const ids = new Set(
      [...section.matchAll(/getElementById\("(ueb-[a-z0-9-]+)"\)/g)].map(m => m[1])
    );
    assert.ok(ids.size > 10, `expected the panel to touch many ids, saw ${ids.size}`);
    for (const id of ids) {
      // ueb-stricter-btn is created by renderUebLevelCheck, not by the markup.
      if (id === "ueb-stricter-btn") continue;
      assert.ok(indexHtml.includes(`id="${id}"`), `#${id} is used in app.js but missing from index.html`);
    }
  });

  test("the panel is styled, including at phone width", () => {
    assert.match(styleCss, /#ueb-panel\s*\{/);
    assert.match(styleCss, /\.ueb-level-chip\s*\{/);
    assert.match(styleCss, /#ueb-level-chips\s*\{/);
    const mobile = styleCss.slice(styleCss.lastIndexOf("@media (max-width: 560px)"));
    assert.match(mobile, /#ueb-dir-btn/);
  });
});
