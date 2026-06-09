// Tests for the Games / Word Search feature
// Run: node --test tests/games.test.js

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
// Load GAME_ISLAND_SETS from games_data.js
// ---------------------------------------------------------------------------
function loadGameIslandSets() {
  const code = readFile("games_data.js").replace(/\bconst\s+/g, "");
  const ctx = {};
  vm.runInNewContext(code, ctx);
  return ctx.GAME_ISLAND_SETS;
}

// ---------------------------------------------------------------------------
// Load WORDS from words_data.js
// ---------------------------------------------------------------------------
function loadWords() {
  const code = readFile("words_data.js").replace(/\bconst\s+/g, "");
  const ctx = {};
  vm.runInNewContext(code, ctx);
  return ctx.WORDS;
}

// ---------------------------------------------------------------------------
// Extract and run the pure word-search algorithms from app.js
// No DOM, no global state — just constants + pure functions.
// ---------------------------------------------------------------------------
function loadWsAlgorithms() {
  const appJs = readFile("app.js");

  // Helper: extract from "const NAME =" to the next "const " or "function " top-level line
  function extractConst(name) {
    const start = appJs.indexOf(`const ${name} =`);
    assert.ok(start !== -1, `${name} not found in app.js`);
    // find next line starting with "const " or "function " or "let "
    const after = appJs.slice(start + 1);
    const endRel = after.search(/\nconst |\nfunction |\nlet /);
    return appJs.slice(start, start + 1 + endRel).trim();
  }

  function extractFn(name) {
    const start = appJs.indexOf(`function ${name}(`);
    assert.ok(start !== -1, `function ${name} not found in app.js`);
    const after = appJs.slice(start + 1);
    const endRel = after.search(/\nfunction /);
    return appJs.slice(start, start + 1 + endRel).trim();
  }

  const code = [
    extractConst("WS_GRID_SIZE"),
    extractConst("WS_DIRECTIONS"),
    extractConst("WS_FILL_POOL"),
    extractFn("wsFilterCandidates"),
    extractFn("wsShuffle"),
    extractFn("wsGenerateGrid"),
    extractFn("wsSnapToAxis"),
    extractFn("wsProjectOnAxis"),
  ].join("\n\n");

  const ctx = { Array, Math, console };
  vm.runInNewContext(code, ctx);
  return ctx;
}

// ===========================================================================
// 1. GAME_ISLAND_SETS — data integrity
// ===========================================================================

describe("games_data.js — GAME_ISLAND_SETS structure", () => {
  const sets = loadGameIslandSets();

  test("GAME_ISLAND_SETS is a non-null object", () => {
    assert.equal(typeof sets, "object");
    assert.ok(sets !== null);
  });

  test("has all 8 expected island keys", () => {
    const expected = [
      "morning_routine", "job_search", "food_drink", "greetings",
      "travel", "health", "shopping", "social",
    ];
    for (const key of expected) {
      assert.ok(Object.hasOwn(sets, key), `Missing island: ${key}`);
    }
  });

  test("every island has a non-empty label", () => {
    for (const [key, val] of Object.entries(sets)) {
      assert.ok(
        typeof val.label === "string" && val.label.trim().length > 0,
        `${key} missing label`
      );
    }
  });

  test("every island has a color string starting with #", () => {
    for (const [key, val] of Object.entries(sets)) {
      assert.ok(
        typeof val.color === "string" && val.color.startsWith("#"),
        `${key} has invalid color: ${val.color}`
      );
    }
  });

  test("every island has a wordIds array with at least 8 IDs", () => {
    for (const [key, val] of Object.entries(sets)) {
      assert.ok(Array.isArray(val.wordIds), `${key}.wordIds is not an array`);
      assert.ok(
        val.wordIds.length >= 8,
        `${key} has only ${val.wordIds.length} word IDs — need >= 8`
      );
    }
  });

  test("all wordIds are positive integers", () => {
    for (const [key, val] of Object.entries(sets)) {
      for (const id of val.wordIds) {
        assert.ok(
          Number.isInteger(id) && id > 0,
          `${key} has invalid wordId: ${id}`
        );
      }
    }
  });

  test("no duplicate wordIds within a single island set", () => {
    for (const [key, val] of Object.entries(sets)) {
      const ids = val.wordIds;
      const unique = new Set(ids);
      assert.equal(
        unique.size, ids.length,
        `${key} has duplicate wordIds`
      );
    }
  });
});

// ===========================================================================
// 2. Cross-reference: wordIds must resolve to real, grid-suitable words
// ===========================================================================

describe("games_data.js — wordIds cross-reference with words_data.js", () => {
  const sets = loadGameIslandSets();
  const WORDS = loadWords();
  const wordById = new Map(WORDS.map(w => [w.id, w]));

  test("words_data.js loaded and non-empty", () => {
    assert.ok(WORDS.length > 0, "WORDS array is empty");
  });

  test("every wordId in every island resolves to a word in WORDS", () => {
    const missing = [];
    for (const [key, val] of Object.entries(sets)) {
      for (const id of val.wordIds) {
        if (!wordById.has(id)) missing.push(`${key}:${id}`);
      }
    }
    assert.equal(
      missing.length, 0,
      `wordIds not found in WORDS: ${missing.join(", ")}`
    );
  });

  test("every referenced word has german.length between 5 and 11", () => {
    const bad = [];
    for (const [key, val] of Object.entries(sets)) {
      for (const id of val.wordIds) {
        const w = wordById.get(id);
        if (!w) continue;
        const len = w.german.length;
        if (len < 5 || len > 11) bad.push(`${key}:id=${id} "${w.german}" (len=${len})`);
      }
    }
    assert.equal(
      bad.length, 0,
      `Words outside 5–11 char range: ${bad.join(", ")}`
    );
  });

  test("no referenced word contains a space", () => {
    const bad = [];
    for (const [key, val] of Object.entries(sets)) {
      for (const id of val.wordIds) {
        const w = wordById.get(id);
        if (w && w.german.includes(" ")) bad.push(`${key}:id=${id} "${w.german}"`);
      }
    }
    assert.equal(bad.length, 0, `Words with spaces: ${bad.join(", ")}`);
  });
});

// ===========================================================================
// 3. index.html — HTML structure
// ===========================================================================

describe("games feature — index.html structure", () => {
  const html = readFile("index.html");

  test("Games tab exists with data-mode='games'", () => {
    assert.ok(html.includes('data-mode="games"'), "Games tab missing");
  });

  test("Games tab has a tab-label span", () => {
    const tabStart = html.indexOf('data-mode="games"');
    const tabEnd = html.indexOf("</div>", tabStart);
    const tabHtml = html.slice(tabStart, tabEnd);
    assert.ok(tabHtml.includes("Games"), "Games tab label missing");
  });

  test("#games-panel element exists", () => {
    assert.ok(html.includes('id="games-panel"'), "#games-panel missing");
  });

  test("#games-landing element exists inside #games-panel", () => {
    const panelStart = html.indexOf('id="games-panel"');
    const panelEnd = html.indexOf('</div><!-- end #games-panel -->', panelStart);
    const panel = html.slice(panelStart, panelEnd);
    assert.ok(panel.includes('id="games-landing"'), "#games-landing missing");
  });

  test("#game-card-wordsearch element exists", () => {
    assert.ok(html.includes('id="game-card-wordsearch"'), "#game-card-wordsearch missing");
  });

  test("#wordsearch-view element exists", () => {
    assert.ok(html.includes('id="wordsearch-view"'), "#wordsearch-view missing");
  });

  test("#ws-topbar, #ws-mode-tabs exist", () => {
    assert.ok(html.includes('id="ws-topbar"'), "#ws-topbar missing");
    assert.ok(html.includes('id="ws-mode-tabs"'), "#ws-mode-tabs missing");
  });

  test("Vocabulary and Island mode buttons exist", () => {
    assert.ok(html.includes('data-wsmode="vocab"'), "Vocabulary mode button missing");
    assert.ok(html.includes('data-wsmode="island"'), "Island mode button missing");
  });

  test("#ws-tier-select and #ws-island-select exist", () => {
    assert.ok(html.includes('id="ws-tier-select"'), "#ws-tier-select missing");
    assert.ok(html.includes('id="ws-island-select"'), "#ws-island-select missing");
  });

  test("tier select has all 4 tier options", () => {
    assert.ok(html.includes('value="1"'), "Tier 1 option missing");
    assert.ok(html.includes('value="2"'), "Tier 2 option missing");
    assert.ok(html.includes('value="3"'), "Tier 3 option missing");
    assert.ok(html.includes('value="4"'), "Tier 4 option missing");
  });

  test("#ws-new-puzzle-btn and #ws-hint-btn exist", () => {
    assert.ok(html.includes('id="ws-new-puzzle-btn"'), "#ws-new-puzzle-btn missing");
    assert.ok(html.includes('id="ws-hint-btn"'), "#ws-hint-btn missing");
  });

  test("#ws-word-list, #ws-grid, #ws-word-count exist", () => {
    assert.ok(html.includes('id="ws-word-list"'), "#ws-word-list missing");
    assert.ok(html.includes('id="ws-grid"'), "#ws-grid missing");
    assert.ok(html.includes('id="ws-word-count"'), "#ws-word-count missing");
  });

  test("#ws-word-popup modal exists outside .app-layout", () => {
    const appLayoutEnd = html.indexOf("</div><!-- end .app-layout -->");
    const popupPos = html.indexOf('id="ws-word-popup"');
    assert.ok(popupPos !== -1, "#ws-word-popup missing");
    assert.ok(
      popupPos > appLayoutEnd,
      "#ws-word-popup must be outside .app-layout (it is a modal overlay)"
    );
  });

  test("popup inner elements all present", () => {
    for (const id of [
      "ws-popup-article", "ws-popup-word", "ws-popup-pos",
      "ws-popup-english", "ws-popup-forms", "ws-popup-example",
      "ws-popup-tip", "ws-popup-spinner", "ws-popup-add-btn", "ws-popup-continue-btn",
    ]) {
      assert.ok(html.includes(`id="${id}"`), `#${id} missing from popup`);
    }
  });

  test("games_data.js script tag added before app.js", () => {
    const gamesScriptPos = html.indexOf('src="games_data.js"');
    const appScriptPos = html.indexOf('src="app.js"');
    assert.ok(gamesScriptPos !== -1, "games_data.js script tag missing");
    assert.ok(
      gamesScriptPos < appScriptPos,
      "games_data.js must be loaded before app.js"
    );
  });

  test("games_data.js has a fallback guard before the script tag", () => {
    const guard = html.indexOf("GAME_ISLAND_SETS");
    assert.ok(guard !== -1, "GAME_ISLAND_SETS fallback guard missing");
  });

  test("#games-streak-badge element exists", () => {
    assert.ok(html.includes('id="games-streak-badge"'), "#games-streak-badge missing");
  });

  test("#ws-hint-msg element exists", () => {
    assert.ok(html.includes('id="ws-hint-msg"'), "#ws-hint-msg missing");
  });
});

// ===========================================================================
// 4. style.css — CSS rules
// ===========================================================================

describe("games feature — style.css", () => {
  const css = readFile("style.css");

  test("#games-panel rule defined", () => {
    assert.ok(css.includes("#games-panel {"), "#games-panel CSS missing");
  });

  test(".game-card rule defined", () => {
    assert.ok(css.includes(".game-card {"), ".game-card CSS missing");
  });

  test(".game-card:hover rule defined", () => {
    assert.ok(css.includes(".game-card:hover"), ".game-card:hover CSS missing");
  });

  test(".game-card-soon rule defined", () => {
    assert.ok(css.includes(".game-card-soon"), ".game-card-soon CSS missing");
  });

  test("#ws-grid rule with touch-action:none defined", () => {
    const idx = css.indexOf("#ws-grid {");
    assert.ok(idx !== -1, "#ws-grid CSS missing");
    const block = css.slice(idx, idx + 400);
    assert.ok(
      block.includes("touch-action: none"),
      "#ws-grid must have touch-action: none (prevents scroll hijack during drag)"
    );
  });

  test(".ws-cell rule defined with aspect-ratio", () => {
    const idx = css.indexOf(".ws-cell {");
    assert.ok(idx !== -1, ".ws-cell CSS missing");
    const block = css.slice(idx, idx + 300);
    assert.ok(block.includes("aspect-ratio"), ".ws-cell must have aspect-ratio for square cells");
  });

  test(".ws-cell.selecting rule defined for drag highlight", () => {
    assert.ok(css.includes(".ws-cell.selecting {"), ".ws-cell.selecting CSS missing");
  });

  test(".ws-cell.ws-wrong-flash rule defined", () => {
    assert.ok(css.includes(".ws-cell.ws-wrong-flash {"), ".ws-cell.ws-wrong-flash CSS missing");
  });

  test("all 8 found-word color slots defined (.ws-found-0 through .ws-found-7)", () => {
    for (let i = 0; i <= 7; i++) {
      assert.ok(
        css.includes(`.ws-cell.ws-found-${i} {`),
        `.ws-cell.ws-found-${i} CSS missing`
      );
    }
  });

  test("@keyframes wsCellPulse defined for hint animation", () => {
    assert.ok(css.includes("@keyframes wsCellPulse"), "@keyframes wsCellPulse missing");
  });

  test(".ws-hint-pulse rule defined", () => {
    assert.ok(css.includes(".ws-hint-pulse {"), ".ws-hint-pulse CSS missing");
  });

  test("#ws-word-popup overlay rule defined", () => {
    assert.ok(css.includes("#ws-word-popup {"), "#ws-word-popup CSS missing");
  });

  test("#ws-word-popup-inner bottom-sheet shape (border-radius top corners)", () => {
    const idx = css.indexOf("#ws-word-popup-inner {");
    assert.ok(idx !== -1, "#ws-word-popup-inner CSS missing");
    const block = css.slice(idx, idx + 400);
    assert.ok(
      block.includes("border-radius"),
      "#ws-word-popup-inner must define border-radius for bottom-sheet shape"
    );
  });

  test("#ws-popup-add-btn and #ws-popup-continue-btn both styled", () => {
    assert.ok(css.includes("#ws-popup-add-btn {"), "#ws-popup-add-btn CSS missing");
    assert.ok(css.includes("#ws-popup-continue-btn {"), "#ws-popup-continue-btn CSS missing");
  });

  test("#ws-popup-add-btn has disabled state", () => {
    assert.ok(css.includes("#ws-popup-add-btn:disabled"), "#ws-popup-add-btn:disabled CSS missing");
  });

  test(".ws-target-word and .ws-target-word.found defined", () => {
    assert.ok(css.includes(".ws-target-word {"), ".ws-target-word CSS missing");
    assert.ok(css.includes(".ws-target-word.found {"), ".ws-target-word.found CSS missing");
  });

  test("#games-panel has mobile media query override", () => {
    // any mobile media query block that mentions #games-panel before the next @-rule
    const re = /@media \(max-width: 767px\)[^@]*#games-panel/;
    assert.ok(re.test(css), "#games-panel not in any mobile media query");
  });
});

// ===========================================================================
// 5. app.js — function presence and integration
// ===========================================================================

describe("games feature — app.js function definitions", () => {
  const appJs = readFile("app.js");

  const requiredFunctions = [
    "showGamesPanel",
    "initGamesPanel",
    "showGamesLanding",
    "openWordSearch",
    "exitWordSearch",
    "wsGetWordPool",
    "wsFilterCandidates",
    "wsGenerateAndRender",
    "wsGenerateGrid",
    "renderWsGrid",
    "renderWsWordList",
    "wsOnPointerDown",
    "wsOnPointerMove",
    "wsOnPointerUp",
    "wsSnapToAxis",
    "wsProjectOnAxis",
    "wsApplyHighlight",
    "wsGetCell",
    "wsCheckMatch",
    "wsMarkFound",
    "wsPuzzleComplete",
    "wsShowWordPopup",
    "closeWordPopup",
    "addWordToSRS",
    "handleWsHint",
    "getGamesStreak",
    "recordGamesStreak",
    "updateGamesStreakBadge",
    "saveWsPuzzleState",
  ];

  for (const fn of requiredFunctions) {
    test(`${fn}() is defined`, () => {
      assert.ok(
        appJs.includes(`function ${fn}(`),
        `function ${fn} missing from app.js`
      );
    });
  }
});

describe("games feature — app.js integration points", () => {
  const appJs = readFile("app.js");

  test("games mode added to renderCard guard", () => {
    const guards = appJs.match(/if \(mode === "ai"[^)]+\) return;/g) || [];
    assert.ok(guards.length > 0, "renderCard guard not found");
    assert.ok(
      guards.some(g => g.includes('"games"')),
      '"games" not in renderCard early-return guard'
    );
  });

  test("games mode handled in setupEvents tab click", () => {
    assert.ok(
      appJs.includes('newMode === "games"'),
      'games mode not handled in setupEvents tab click'
    );
    assert.ok(
      appJs.includes("showGamesPanel()"),
      "showGamesPanel() not called from tab click handler"
    );
  });

  test("initGamesPanel() is called inside init()", () => {
    const initStart = appJs.indexOf("function init(");
    assert.ok(initStart !== -1, "init() not found");
    const initEnd = appJs.indexOf("\nfunction ", initStart + 1);
    const initBody = appJs.slice(initStart, initEnd);
    assert.ok(initBody.includes("initGamesPanel()"), "initGamesPanel() not called in init()");
  });

  test("showGamesPanel hides all other feature panels", () => {
    const start = appJs.indexOf("function showGamesPanel(");
    assert.ok(start !== -1, "showGamesPanel not found");
    const end = appJs.indexOf("\nfunction ", start + 1);
    const body = appJs.slice(start, end);
    // aiPanel is referenced by variable, not string ID — check for variable usage
    assert.ok(
      body.includes("aiPanel.style.display"),
      "showGamesPanel must hide aiPanel"
    );
    // The rest use getElementById("panel-id")
    const panels = [
      "progress-panel", "vocab-panel", "grammar-panel",
      "words-panel", "drills-panel", "starters-panel", "speak-panel",
      "monologue-panel",
    ];
    for (const p of panels) {
      assert.ok(
        body.includes(`"${p}"`),
        `showGamesPanel does not hide #${p}`
      );
    }
  });

  test("all other show*Panel functions hide #games-panel", () => {
    const targets = [
      "showPlayerPanel", "showAIPanel", "showProgressPanel",
      "showVocabPanel", "showGrammarPanel", "showWordsPanel",
      "showDrillsPanel", "showStartersPanel", "showSpeakPanel",
      "showMonologuePanel",
    ];
    for (const fn of targets) {
      const start = appJs.indexOf(`function ${fn}(`);
      assert.ok(start !== -1, `${fn} not found in app.js`);
      const end = appJs.indexOf("\nfunction ", start + 1);
      const body = appJs.slice(start, end);
      assert.ok(
        body.includes('"games-panel"'),
        `${fn} does not hide #games-panel`
      );
    }
  });

  test("ws_streak localStorage key used in streak functions", () => {
    assert.ok(appJs.includes('"ws_streak"'), '"ws_streak" localStorage key missing');
  });

  test("ws_found_words localStorage key used in markFound", () => {
    assert.ok(appJs.includes('"ws_found_words"'), '"ws_found_words" localStorage key missing');
  });

  test("ws_total_found localStorage key used", () => {
    assert.ok(appJs.includes('"ws_total_found"'), '"ws_total_found" localStorage key missing');
  });

  test("wsShowWordPopup fetches /api/chat with game-word-info mode", () => {
    const start = appJs.indexOf("function wsShowWordPopup(");
    const end = appJs.indexOf("\nfunction ", start + 1);
    const body = appJs.slice(start, end);
    assert.ok(body.includes('"/api/chat"'), "wsShowWordPopup must fetch /api/chat");
    assert.ok(body.includes('"game-word-info"'), 'must use mode "game-word-info"');
  });

  test("wsShowWordPopup shows static data immediately then enriches async", () => {
    const start = appJs.indexOf("function wsShowWordPopup(");
    const end = appJs.indexOf("\nfunction ", start + 1);
    const body = appJs.slice(start, end);
    assert.ok(body.includes("ws-popup-word").valueOf(), "must set ws-popup-word immediately");
    assert.ok(body.includes(".then("), "must update popup with .then() (async enrichment)");
    assert.ok(body.includes(".catch("), "must handle fetch errors gracefully");
    assert.ok(body.includes(".finally("), "must hide spinner in finally block");
  });

  test("addWordToSRS calls loadWordsSRS and saveWordsSRS", () => {
    const start = appJs.indexOf("function addWordToSRS(");
    const end = appJs.indexOf("\nfunction ", start + 1);
    const body = appJs.slice(start, end);
    assert.ok(body.includes("loadWordsSRS()"), "addWordToSRS must call loadWordsSRS()");
    assert.ok(body.includes("saveWordsSRS()"), "addWordToSRS must call saveWordsSRS()");
  });

  test("addWordToSRS sets correct SRS entry shape (interval, easeFactor, etc.)", () => {
    const start = appJs.indexOf("function addWordToSRS(");
    const end = appJs.indexOf("\nfunction ", start + 1);
    const body = appJs.slice(start, end);
    assert.ok(body.includes("interval"), "SRS entry must include interval");
    assert.ok(body.includes("easeFactor"), "SRS entry must include easeFactor");
    assert.ok(body.includes("archived"), "SRS entry must include archived flag");
  });

  test("handleWsHint limits to 3 hints per puzzle", () => {
    const start = appJs.indexOf("function handleWsHint(");
    const end = appJs.indexOf("\nfunction ", start + 1);
    const body = appJs.slice(start, end);
    assert.ok(body.includes("wsHintsUsed"), "handleWsHint must track wsHintsUsed");
    assert.ok(body.includes("3"), "handleWsHint must enforce a limit of 3");
  });

  test("wsPuzzleComplete calls recordGamesStreak", () => {
    const start = appJs.indexOf("function wsPuzzleComplete(");
    const end = appJs.indexOf("\nfunction ", start + 1);
    const body = appJs.slice(start, end);
    assert.ok(body.includes("recordGamesStreak()"), "wsPuzzleComplete must record the streak");
  });

  test("ws state variables declared at module level", () => {
    for (const v of ["wsCurrentPuzzle", "wsIsDragging", "wsHintsUsed", "wsWsMode"]) {
      assert.ok(appJs.includes(`let ${v}`), `let ${v} not declared in app.js`);
    }
  });
});

// ===========================================================================
// 6. Word Search algorithm — pure function unit tests
// ===========================================================================

describe("word search algorithm — wsFilterCandidates", () => {
  const { wsFilterCandidates } = loadWsAlgorithms();

  test("removes words shorter than 5 chars", () => {
    const pool = [
      { german: "sein", english: "to be" },      // 4 chars - exclude
      { german: "haben", english: "to have" },    // 5 chars - include
      { german: "können", english: "can" },        // 6 chars - include
    ];
    const result = wsFilterCandidates(pool);
    assert.ok(!result.find(w => w.german === "sein"), '"sein" (4) should be excluded');
    assert.ok(result.find(w => w.german === "haben"), '"haben" (5) should be included');
    assert.ok(result.find(w => w.german === "können"), '"können" (6) should be included');
  });

  test("removes words longer than 11 chars", () => {
    const pool = [
      { german: "Verspätung", english: "delay" },       // 10 - include
      { german: "Krankenhaus", english: "hospital" },    // 11 - include
      { german: "Freundschaft", english: "friendship" }, // 12 - exclude
    ];
    const result = wsFilterCandidates(pool);
    assert.ok(result.find(w => w.german === "Verspätung"), "10-char word should be included");
    assert.ok(result.find(w => w.german === "Krankenhaus"), "11-char word should be included");
    assert.ok(!result.find(w => w.german === "Freundschaft"), "12-char word should be excluded");
  });

  test("removes words containing spaces", () => {
    const pool = [
      { german: "sich fühlen", english: "to feel" },  // has space - exclude
      { german: "spielen", english: "to play" },       // no space - include
    ];
    const result = wsFilterCandidates(pool);
    assert.ok(!result.find(w => w.german === "sich fühlen"), "words with spaces must be excluded");
    assert.ok(result.find(w => w.german === "spielen"), '"spielen" should be included');
  });

  test("accepts umlaut words (ä, ö, ü, ß count as one char each)", () => {
    const pool = [{ german: "Frühstück", english: "breakfast" }]; // 9 chars
    const result = wsFilterCandidates(pool);
    assert.equal(result.length, 1, "Frühstück (9 chars) should pass the filter");
  });
});

// Helper: compare [dr, dc] direction ignoring VM cross-context Array identity
function dirEqual(actual, expected) {
  return actual[0] === expected[0] && actual[1] === expected[1];
}

describe("word search algorithm — wsSnapToAxis", () => {
  const { wsSnapToAxis } = loadWsAlgorithms();

  test("pure right → [0, 1]", () => {
    const dir = wsSnapToAxis(0, 5);
    assert.ok(dirEqual(dir, [0, 1]), `expected [0,1] got [${dir}]`);
  });

  test("pure down → [1, 0]", () => {
    const dir = wsSnapToAxis(5, 0);
    assert.ok(dirEqual(dir, [1, 0]), `expected [1,0] got [${dir}]`);
  });

  test("pure left → [0, -1]", () => {
    const dir = wsSnapToAxis(0, -5);
    assert.ok(dirEqual(dir, [0, -1]), `expected [0,-1] got [${dir}]`);
  });

  test("pure up → [-1, 0]", () => {
    const dir = wsSnapToAxis(-5, 0);
    assert.ok(dirEqual(dir, [-1, 0]), `expected [-1,0] got [${dir}]`);
  });

  test("diagonal down-right → [1, 1]", () => {
    const dir = wsSnapToAxis(4, 4);
    assert.ok(dirEqual(dir, [1, 1]), `expected [1,1] got [${dir}]`);
  });

  test("diagonal up-left → [-1, -1]", () => {
    const dir = wsSnapToAxis(-3, -3);
    assert.ok(dirEqual(dir, [-1, -1]), `expected [-1,-1] got [${dir}]`);
  });

  test("diagonal down-left → [1, -1]", () => {
    const dir = wsSnapToAxis(3, -3);
    assert.ok(dirEqual(dir, [1, -1]), `expected [1,-1] got [${dir}]`);
  });

  test("diagonal up-right → [-1, 1]", () => {
    const dir = wsSnapToAxis(-3, 3);
    assert.ok(dirEqual(dir, [-1, 1]), `expected [-1,1] got [${dir}]`);
  });

  test("snap to nearest axis for slightly off-diagonal input", () => {
    // Mostly horizontal (dc >> dr), should snap to [0,1]
    const dir = wsSnapToAxis(1, 8);
    assert.ok(dirEqual(dir, [0, 1]), `expected [0,1] got [${dir}]`);
  });
});

describe("word search algorithm — wsProjectOnAxis", () => {
  const { wsProjectOnAxis } = loadWsAlgorithms();

  test("horizontal axis uses |dc|", () => {
    assert.equal(wsProjectOnAxis(0, 5, [0, 1]), 5);
    assert.equal(wsProjectOnAxis(1, 5, [0, 1]), 5);
  });

  test("vertical axis uses |dr|", () => {
    assert.equal(wsProjectOnAxis(5, 0, [1, 0]), 5);
    assert.equal(wsProjectOnAxis(5, 2, [1, 0]), 5);
  });

  test("diagonal axis uses max(|dr|, |dc|)", () => {
    assert.equal(wsProjectOnAxis(4, 3, [1, 1]), 4);
    assert.equal(wsProjectOnAxis(2, 5, [1, 1]), 5);
  });
});

describe("word search algorithm — wsGenerateGrid", () => {
  const { wsGenerateGrid } = loadWsAlgorithms();
  const G = 12; // WS_GRID_SIZE — const doesn't export from VM context, use known value

  const sampleWords = [
    { german: "spielen", english: "to play" },
    { german: "Arbeit", english: "work" },
    { german: "trinken", english: "to drink" },
    { german: "Wetter", english: "weather" },
    { german: "kaufen", english: "to buy" },
    { german: "Freund", english: "friend" },
  ];

  test("WS_GRID_SIZE constant is 12 in app.js source", () => {
    const appJs = readFile("app.js");
    assert.ok(
      appJs.includes("const WS_GRID_SIZE = 12"),
      "WS_GRID_SIZE must be 12 in app.js"
    );
  });

  test("returns grid of correct dimensions (12×12)", () => {
    const { grid } = wsGenerateGrid(sampleWords);
    assert.equal(grid.length, G, "grid must have 12 rows");
    for (let r = 0; r < G; r++) {
      assert.equal(grid[r].length, G, `row ${r} must have 12 columns`);
    }
  });

  test("every cell is a non-empty single uppercase character", () => {
    const { grid } = wsGenerateGrid(sampleWords);
    for (let r = 0; r < 12; r++) {
      for (let c = 0; c < 12; c++) {
        const cell = grid[r][c];
        assert.ok(typeof cell === "string" && cell.length === 1,
          `cell [${r}][${c}] must be a single char, got: "${cell}"`);
        assert.ok(cell === cell.toUpperCase() || /[ÄÖÜß]/.test(cell),
          `cell [${r}][${c}] must be uppercase, got: "${cell}"`);
      }
    }
  });

  test("placed words appear correctly in the grid", () => {
    const { grid, placed } = wsGenerateGrid(sampleWords);
    assert.ok(placed.length >= 4, `Only ${placed.length} words placed — expected >= 4`);

    for (const p of placed) {
      const { letters, r0, c0, dr, dc } = p;
      for (let i = 0; i < letters.length; i++) {
        const r = r0 + i * dr;
        const c = c0 + i * dc;
        assert.equal(
          grid[r][c], letters[i],
          `Word "${p.word.german}" letter[${i}]="${letters[i]}" not at grid[${r}][${c}]="${grid[r][c]}"`
        );
      }
    }
  });

  test("placed word positions stay within grid bounds", () => {
    const { placed } = wsGenerateGrid(sampleWords);
    for (const p of placed) {
      const { letters, r0, c0, dr, dc } = p;
      for (let i = 0; i < letters.length; i++) {
        const r = r0 + i * dr;
        const c = c0 + i * dc;
        assert.ok(r >= 0 && r < G, `row ${r} out of bounds for word "${p.word.german}"`);
        assert.ok(c >= 0 && c < G, `col ${c} out of bounds for word "${p.word.german}"`);
      }
    }
  });

  test("letters array stored on placed matches the word uppercased", () => {
    const { placed } = wsGenerateGrid(sampleWords);
    for (const p of placed) {
      const expected = Array.from(p.word.german.toUpperCase());
      assert.deepEqual(p.letters, expected,
        `letters mismatch for "${p.word.german}"`);
    }
  });

  test("colorIdx cycles 0–7", () => {
    const { placed } = wsGenerateGrid(sampleWords);
    for (const p of placed) {
      assert.ok(
        p.colorIdx >= 0 && p.colorIdx <= 7,
        `colorIdx ${p.colorIdx} out of 0–7 range`
      );
    }
  });

  test("discovered flag starts as false on all placed words", () => {
    const { placed } = wsGenerateGrid(sampleWords);
    for (const p of placed) {
      assert.equal(p.discovered, false,
        `"${p.word.german}" discovered must start false`);
    }
  });

  test("no two placed words share overlapping cells with conflicting letters", () => {
    const { grid, placed } = wsGenerateGrid(sampleWords);
    // Re-verify: each cell is either a fill character or belongs to exactly one word
    // (or two words that share the same letter at that position)
    const cellOwners = {};
    for (const p of placed) {
      const { letters, r0, c0, dr, dc } = p;
      for (let i = 0; i < letters.length; i++) {
        const r = r0 + i * dr;
        const c = c0 + i * dc;
        const key = `${r},${c}`;
        if (cellOwners[key]) {
          // Allowed overlap: both words have the same letter here
          assert.equal(
            cellOwners[key].letter, letters[i],
            `Conflicting letters at [${r}][${c}]: "${cellOwners[key].letter}" vs "${letters[i]}"`
          );
        } else {
          cellOwners[key] = { letter: letters[i] };
        }
      }
    }
  });
});

// ===========================================================================
// 7. api/chat.js — game-word-info mode
// ===========================================================================

describe("games feature — api/chat.js game-word-info mode", () => {
  const chatJs = readFile("api/chat.js");

  test('game-word-info mode handler exists', () => {
    assert.ok(
      chatJs.includes('mode === "game-word-info"'),
      '"game-word-info" mode not found in api/chat.js'
    );
  });

  function getGameWordInfoBlock() {
    const start = chatJs.indexOf('mode === "game-word-info"');
    assert.ok(start !== -1);
    // End at next top-level "if (mode" or "return res.status(400)"
    const afterStart = chatJs.slice(start);
    const endRel = afterStart.indexOf("\n    return res.status(400)");
    return afterStart.slice(0, endRel > 0 ? endRel : 2000);
  }

  test("reads wordData from req.body", () => {
    const block = getGameWordInfoBlock();
    assert.ok(block.includes("wordData"), "must read wordData from req.body");
  });

  test("calls callGroq to generate enriched word info", () => {
    const block = getGameWordInfoBlock();
    assert.ok(block.includes("callGroq("), "must call callGroq for enrichment");
  });

  test("response includes article, plural, forms, example, example_en, tip fields", () => {
    const block = getGameWordInfoBlock();
    for (const field of ["article", "plural", "forms", "example", "example_en", "tip"]) {
      assert.ok(block.includes(field), `response must include "${field}" field`);
    }
  });

  test("falls back to static wordData on parse error", () => {
    const block = getGameWordInfoBlock();
    assert.ok(block.includes("catch"), "must have a catch block as fallback");
    assert.ok(
      block.includes("wordData.example_de") || block.includes("wordData.article"),
      "fallback must use static wordData fields"
    );
  });

  test("does NOT call ElevenLabs (no TTS needed for word info)", () => {
    const block = getGameWordInfoBlock();
    assert.ok(
      !block.includes("callElevenLabs"),
      "game-word-info must not call ElevenLabs"
    );
  });

  test("strips HTML marks from example_de in fallback", () => {
    const block = getGameWordInfoBlock();
    assert.ok(
      block.includes("replace(/<[^>]+>/g"),
      "fallback must strip HTML <mark> tags from example_de"
    );
  });

  test("returns 400 if wordData is missing from request", () => {
    const block = getGameWordInfoBlock();
    assert.ok(
      block.includes("No wordData") || block.includes("status(400)"),
      "must return 400 when wordData is missing"
    );
  });
});
