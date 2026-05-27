// Tests for api/chat.js
// Uses Node built-in test runner (no npm install needed).
// Run: node --test tests/chat.test.js

const { test, describe, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");

const handler = require("../api/chat.js");
const { buildConvoSystemPrompt, parseJSON, TEACHER_PERSONALITIES, LEVEL_DESCRIPTIONS } = handler;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mockRes() {
  const res = {
    statusCode: 200,
    _headers: {},
    body: null,
    setHeader(k, v) { this._headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; },
    end() { return this; },
  };
  return res;
}

function loadChatHandler(envVars = {}) {
  Object.entries(envVars).forEach(([k, v]) => { process.env[k] = v; });
  const key = require.resolve("../api/chat.js");
  delete require.cache[key];
  return require("../api/chat.js");
}

function groqFetch(content) {
  return async (url) => {
    if (url.includes("groq")) {
      return {
        ok: true,
        json: async () => ({ choices: [{ message: { content } }] }),
      };
    }
    if (url.includes("elevenlabs")) {
      return { ok: true, arrayBuffer: async () => new ArrayBuffer(8) };
    }
    throw new Error(`Unexpected fetch: ${url}`);
  };
}

// ---------------------------------------------------------------------------
// parseJSON
// ---------------------------------------------------------------------------

describe("parseJSON", () => {
  test("parses clean JSON string", () => {
    const result = parseJSON('{"reply":"Hallo","correction":null,"needs_repetition":false}');
    assert.equal(result.reply, "Hallo");
    assert.equal(result.correction, null);
    assert.equal(result.needs_repetition, false);
  });

  test("strips markdown code fences before parsing", () => {
    const result = parseJSON('```json\n{"reply":"Gut","correction":null}\n```');
    assert.equal(result.reply, "Gut");
  });

  test("extracts JSON when model prepends plain text (quota-exceeded bug fix)", () => {
    const raw = 'Ich gehe ins Restaurant. {"reply":"Ich gehe ins Restaurant.","correction":null,"needs_repetition":false}';
    const result = parseJSON(raw);
    assert.ok(result !== null, "should extract JSON from mixed string");
    assert.equal(result.reply, "Ich gehe ins Restaurant.");
    assert.equal(result.needs_repetition, false);
  });

  test("extracts JSON when model appends plain text after JSON", () => {
    const raw = '{"reply":"Super!","correction":null,"needs_repetition":false} Viel Erfolg!';
    const result = parseJSON(raw);
    assert.ok(result !== null, "should extract JSON when text follows it");
    assert.equal(result.reply, "Super!");
  });

  test("returns null for completely unparseable content", () => {
    const result = parseJSON("Das ist kein JSON hier.");
    assert.equal(result, null);
  });

  test("returns null for empty string", () => {
    assert.equal(parseJSON(""), null);
  });

  test("parses needs_repetition: true correctly", () => {
    const raw = JSON.stringify({
      reply: "Kannst du das nochmal sagen?",
      correction: { original: "ich gehe zu Schule", corrected: "ich gehe zur Schule", explanation: "Use 'zur' with feminine nouns." },
      needs_repetition: true,
    });
    const result = parseJSON(raw);
    assert.equal(result.needs_repetition, true);
    assert.equal(result.correction.corrected, "ich gehe zur Schule");
  });
});

// ---------------------------------------------------------------------------
// TEACHER_PERSONALITIES
// ---------------------------------------------------------------------------

describe("TEACHER_PERSONALITIES", () => {
  test("has all four modes", () => {
    assert.ok(TEACHER_PERSONALITIES.caring, "caring missing");
    assert.ok(TEACHER_PERSONALITIES.strict, "strict missing");
    assert.ok(TEACHER_PERSONALITIES.blunt, "blunt missing");
    assert.ok(TEACHER_PERSONALITIES.socratic, "socratic missing");
  });

  test("caring mode is warm and encouraging", () => {
    const p = TEACHER_PERSONALITIES.caring.toLowerCase();
    assert.ok(p.includes("warm") || p.includes("encouraging") || p.includes("coach"));
  });

  test("strict mode explicitly corrects errors", () => {
    const p = TEACHER_PERSONALITIES.strict.toLowerCase();
    assert.ok(p.includes("correct") || p.includes("explicit") || p.includes("rigorous"));
  });

  test("blunt mode is direct and brief", () => {
    const p = TEACHER_PERSONALITIES.blunt.toLowerCase();
    assert.ok(p.includes("blunt") || p.includes("direct") || p.includes("short"));
  });

  test("socratic mode uses questions instead of direct correction", () => {
    const p = TEACHER_PERSONALITIES.socratic.toLowerCase();
    assert.ok(p.includes("question") || p.includes("ask") || p.includes("socratic"));
  });
});

// ---------------------------------------------------------------------------
// buildConvoSystemPrompt - core
// ---------------------------------------------------------------------------

describe("buildConvoSystemPrompt - core", () => {
  test("includes personality text for each mode", () => {
    for (const mode of ["caring", "strict", "blunt", "socratic"]) {
      const prompt = buildConvoSystemPrompt(null, mode, "b1");
      assert.ok(prompt.includes(TEACHER_PERSONALITIES[mode]), `${mode} personality missing`);
    }
  });

  test("falls back to caring for unknown teacherMode", () => {
    const prompt = buildConvoSystemPrompt(null, "nonexistent", "b1");
    assert.ok(prompt.includes(TEACHER_PERSONALITIES.caring));
  });

  test("falls back to caring when teacherMode is undefined", () => {
    const prompt = buildConvoSystemPrompt(null, undefined, "b1");
    assert.ok(prompt.includes(TEACHER_PERSONALITIES.caring));
  });

  test("includes scenario role for known keys", () => {
    assert.ok(buildConvoSystemPrompt("shopping", "caring", "b1").includes("shop assistant"));
    assert.ok(buildConvoSystemPrompt("health", "caring", "b1").includes("doctor"));
    assert.ok(buildConvoSystemPrompt("food_drink", "caring", "b1").includes("waiter"));
  });

  test("omits role line for unknown scenario key", () => {
    const prompt = buildConvoSystemPrompt("unknown_key", "caring", "b1");
    assert.ok(!prompt.includes("You are playing the role of"));
  });

  test("omits role line when scenarioKey is null", () => {
    const prompt = buildConvoSystemPrompt(null, "caring", "b1");
    assert.ok(!prompt.startsWith("You are playing the role of"));
  });

  test("includes language level description", () => {
    for (const level of ["a1", "a2", "b1", "b2", "c1"]) {
      const prompt = buildConvoSystemPrompt(null, "caring", level);
      assert.ok(prompt.includes(LEVEL_DESCRIPTIONS[level]), `level ${level} description missing`);
    }
  });
});

// ---------------------------------------------------------------------------
// buildConvoSystemPrompt - correction enforcement rules (new feature)
// ---------------------------------------------------------------------------

describe("buildConvoSystemPrompt - correction enforcement", () => {
  test("always includes needs_repetition in JSON format instruction", () => {
    for (const mode of ["caring", "strict", "blunt", "socratic"]) {
      const prompt = buildConvoSystemPrompt(null, mode, "b1");
      assert.ok(prompt.includes("needs_repetition"), `needs_repetition missing for mode: ${mode}`);
    }
  });

  test("instructs AI to handle English input", () => {
    const prompt = buildConvoSystemPrompt(null, "caring", "b1");
    const lower = prompt.toLowerCase();
    assert.ok(lower.includes("english"), "prompt should address English input detection");
  });

  test("instructs AI to require repetition on errors", () => {
    const prompt = buildConvoSystemPrompt(null, "strict", "b1");
    const lower = prompt.toLowerCase();
    assert.ok(
      lower.includes("repeat") || lower.includes("repetition") || lower.includes("wieder"),
      "prompt should require repetition on errors"
    );
  });

  test("instructs AI to set needs_repetition true when there is an error", () => {
    const prompt = buildConvoSystemPrompt(null, "caring", "b1");
    assert.ok(prompt.includes("needs_repetition: true"), "should instruct needs_repetition: true for errors");
  });

  test("instructs AI to set needs_repetition false when there is no error", () => {
    const prompt = buildConvoSystemPrompt(null, "caring", "b1");
    assert.ok(prompt.includes("needs_repetition: false"), "should instruct needs_repetition: false for success");
  });

  test("without awaitingRepetition: no REPETITION CHECK block", () => {
    const prompt = buildConvoSystemPrompt(null, "caring", "b1", null);
    assert.ok(!prompt.includes("REPETITION CHECK"), "should not have REPETITION CHECK without context");
  });

  test("with awaitingRepetition: includes REPETITION CHECK block", () => {
    const ctx = { corrected: "Ich gehe zur Schule.", original: "Ich gehe zu Schule." };
    const prompt = buildConvoSystemPrompt(null, "caring", "b1", ctx);
    assert.ok(prompt.includes("REPETITION CHECK"), "REPETITION CHECK block missing");
  });

  test("with awaitingRepetition: includes the corrected form in prompt", () => {
    const ctx = { corrected: "Ich gehe zur Schule.", original: "Ich gehe zu Schule." };
    const prompt = buildConvoSystemPrompt(null, "caring", "b1", ctx);
    assert.ok(prompt.includes("Ich gehe zur Schule."), "corrected form should appear in prompt");
  });

  test("with awaitingRepetition: instructs AI to evaluate attempt and advance if correct", () => {
    const ctx = { corrected: "Ich möchte Kaffee.", original: "Ich will Kaffee." };
    const prompt = buildConvoSystemPrompt(null, "caring", "b1", ctx);
    const lower = prompt.toLowerCase();
    assert.ok(
      lower.includes("advance") || lower.includes("correct") || lower.includes("evaluate"),
      "prompt should instruct AI to evaluate the repetition attempt"
    );
  });

  test("awaitingRepetition context works for all teacher modes", () => {
    const ctx = { corrected: "Das ist gut.", original: "Das ist good." };
    for (const mode of ["caring", "strict", "blunt", "socratic"]) {
      const prompt = buildConvoSystemPrompt(null, mode, "b1", ctx);
      assert.ok(prompt.includes("Das ist gut."), `corrected form missing for mode: ${mode}`);
    }
  });
});

// ---------------------------------------------------------------------------
// Handler routing tests
// ---------------------------------------------------------------------------

describe("handler routing", () => {
  afterEach(() => {
    delete process.env.GROQ_API_KEY;
    delete process.env.GROQ_KEY;
    delete process.env.ELEVENLABS_API_KEY;
    if (global._chatFetchOrig) {
      global.fetch = global._chatFetchOrig;
      delete global._chatFetchOrig;
    }
  });

  test("OPTIONS returns 200", async () => {
    const h = loadChatHandler();
    const res = mockRes();
    await h({ method: "OPTIONS", body: {} }, res);
    assert.equal(res.statusCode, 200);
  });

  test("GET returns 405", async () => {
    const h = loadChatHandler();
    const res = mockRes();
    await h({ method: "GET", body: {} }, res);
    assert.equal(res.statusCode, 405);
  });

  test("missing GROQ_KEY returns 500 with groq mention", async () => {
    const h = loadChatHandler();
    const res = mockRes();
    await h({ method: "POST", body: { mode: "convo", text: "Hallo" } }, res);
    assert.equal(res.statusCode, 500);
    assert.ok(res.body?.error?.toLowerCase().includes("groq"));
  });

  test("unknown mode returns 400", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });
    global._chatFetchOrig = global.fetch;
    global.fetch = async () => { throw new Error("should not reach network"); };
    const res = mockRes();
    await h({ method: "POST", body: { mode: "unknown_mode", text: "test" } }, res);
    assert.equal(res.statusCode, 400);
    assert.equal(res.body?.error, "unknown mode");
  });

  test("missing text returns 400 for convo mode", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });
    const res = mockRes();
    await h({ method: "POST", body: { mode: "convo", text: "" } }, res);
    assert.equal(res.statusCode, 400);
  });
});

// ---------------------------------------------------------------------------
// convo mode - response shape and needs_repetition
// ---------------------------------------------------------------------------

describe("convo mode - needs_repetition", () => {
  afterEach(() => {
    delete process.env.GROQ_API_KEY;
    delete process.env.ELEVENLABS_API_KEY;
    if (global._chatFetchOrig) { global.fetch = global._chatFetchOrig; delete global._chatFetchOrig; }
  });

  test("returns needs_repetition: false when AI signals no error", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });
    global._chatFetchOrig = global.fetch;
    global.fetch = groqFetch(JSON.stringify({ reply: "Gut gemacht!", correction: null, needs_repetition: false }));

    const res = mockRes();
    await h({ method: "POST", body: { mode: "convo", text: "Ich gehe zur Schule.", teacherMode: "caring" } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.needs_repetition, false);
    assert.equal(res.body.correction, null);
  });

  test("returns needs_repetition: true when AI detects a grammar error", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });
    global._chatFetchOrig = global.fetch;
    global.fetch = groqFetch(JSON.stringify({
      reply: "Du meinst: 'Ich gehe zur Schule.' Kannst du das nochmal sagen?",
      correction: { original: "Ich gehe zu Schule.", corrected: "Ich gehe zur Schule.", explanation: "Use 'zur' with feminine nouns." },
      needs_repetition: true,
    }));

    const res = mockRes();
    await h({ method: "POST", body: { mode: "convo", text: "Ich gehe zu Schule.", teacherMode: "strict" } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.needs_repetition, true);
    assert.ok(res.body.correction !== null, "correction should be non-null when error detected");
    assert.equal(res.body.correction.corrected, "Ich gehe zur Schule.");
  });

  test("returns needs_repetition: true when AI detects English input", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });
    global._chatFetchOrig = global.fetch;
    global.fetch = groqFetch(JSON.stringify({
      reply: "Du meinst: 'Ich möchte ins Kino gehen.' Versuch es auf Deutsch!",
      correction: { original: "I want to go to the cinema", corrected: "Ich möchte ins Kino gehen.", explanation: "Try saying this in German" },
      needs_repetition: true,
    }));

    const res = mockRes();
    await h({ method: "POST", body: { mode: "convo", text: "I want to go to the cinema", teacherMode: "caring" } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.needs_repetition, true);
    assert.equal(res.body.correction.corrected, "Ich möchte ins Kino gehen.");
  });

  test("needs_repetition defaults to false when AI omits it", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });
    global._chatFetchOrig = global.fetch;
    // AI omits needs_repetition field entirely
    global.fetch = groqFetch(JSON.stringify({ reply: "Sehr gut!", correction: null }));

    const res = mockRes();
    await h({ method: "POST", body: { mode: "convo", text: "Hallo", teacherMode: "caring" } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.needs_repetition, false);
  });

  test("response always contains needs_repetition field", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });
    global._chatFetchOrig = global.fetch;
    global.fetch = groqFetch(JSON.stringify({ reply: "Hallo!", correction: null, needs_repetition: false }));

    const res = mockRes();
    await h({ method: "POST", body: { mode: "convo", text: "Hi", teacherMode: "caring" } }, res);
    assert.ok("needs_repetition" in res.body, "needs_repetition must always be present in response");
  });

  test("reply, correction, needs_repetition, and audio_base64 all present", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });
    global._chatFetchOrig = global.fetch;
    global.fetch = groqFetch(JSON.stringify({ reply: "Toll!", correction: null, needs_repetition: false }));

    const res = mockRes();
    await h({ method: "POST", body: { mode: "convo", text: "Hallo", teacherMode: "caring" } }, res);
    assert.equal(res.statusCode, 200);
    assert.ok("reply" in res.body);
    assert.ok("correction" in res.body);
    assert.ok("needs_repetition" in res.body);
    assert.ok("audio_base64" in res.body);
  });
});

// ---------------------------------------------------------------------------
// convo mode - awaitingRepetition context
// ---------------------------------------------------------------------------

describe("convo mode - awaitingRepetition context", () => {
  afterEach(() => {
    delete process.env.GROQ_API_KEY;
    delete process.env.ELEVENLABS_API_KEY;
    if (global._chatFetchOrig) { global.fetch = global._chatFetchOrig; delete global._chatFetchOrig; }
  });

  test("includes REPETITION CHECK in Groq system prompt when awaitingRepetition is provided", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });

    let capturedSystem = null;
    global._chatFetchOrig = global.fetch;
    global.fetch = async (url, opts) => {
      if (url.includes("groq")) {
        const body = JSON.parse(opts.body);
        capturedSystem = body.messages.find(m => m.role === "system")?.content || "";
        return { ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify({ reply: "Sehr gut!", correction: null, needs_repetition: false }) } }] }) };
      }
      if (url.includes("elevenlabs")) return { ok: true, arrayBuffer: async () => new ArrayBuffer(8) };
    };

    const res = mockRes();
    await h({
      method: "POST",
      body: {
        mode: "convo",
        text: "Ich gehe zur Schule.",
        teacherMode: "caring",
        awaitingRepetition: { corrected: "Ich gehe zur Schule.", original: "Ich gehe zu Schule." },
      },
    }, res);

    assert.ok(capturedSystem.includes("REPETITION CHECK"), "REPETITION CHECK missing from system prompt");
    assert.ok(capturedSystem.includes("Ich gehe zur Schule."), "corrected form missing from system prompt");
  });

  test("does NOT include REPETITION CHECK in system prompt when awaitingRepetition is absent", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });

    let capturedSystem = null;
    global._chatFetchOrig = global.fetch;
    global.fetch = async (url, opts) => {
      if (url.includes("groq")) {
        const body = JSON.parse(opts.body);
        capturedSystem = body.messages.find(m => m.role === "system")?.content || "";
        return { ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify({ reply: "Hallo!", correction: null, needs_repetition: false }) } }] }) };
      }
      if (url.includes("elevenlabs")) return { ok: true, arrayBuffer: async () => new ArrayBuffer(8) };
    };

    const res = mockRes();
    await h({ method: "POST", body: { mode: "convo", text: "Hallo", teacherMode: "caring" } }, res);
    assert.ok(!capturedSystem.includes("REPETITION CHECK"), "REPETITION CHECK should not appear without context");
  });

  test("convo sends teacherMode in system prompt", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });

    let capturedSystem = null;
    global._chatFetchOrig = global.fetch;
    global.fetch = async (url, opts) => {
      if (url.includes("groq")) {
        const body = JSON.parse(opts.body);
        capturedSystem = body.messages.find(m => m.role === "system")?.content || "";
        return { ok: true, json: async () => ({ choices: [{ message: { content: '{"reply":"Hallo!","correction":null,"needs_repetition":false}' } }] }) };
      }
      if (url.includes("elevenlabs")) return { ok: true, arrayBuffer: async () => new ArrayBuffer(8) };
    };

    const res = mockRes();
    await h({ method: "POST", body: { mode: "convo", text: "Hallo", teacherMode: "socratic" } }, res);
    assert.ok(capturedSystem.includes(TEACHER_PERSONALITIES.socratic));
  });

  test("uses response_format json_object in Groq request", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });

    let capturedBody = null;
    global._chatFetchOrig = global.fetch;
    global.fetch = async (url, opts) => {
      if (url.includes("groq")) {
        capturedBody = JSON.parse(opts.body);
        return { ok: true, json: async () => ({ choices: [{ message: { content: '{"reply":"Gut!","correction":null,"needs_repetition":false}' } }] }) };
      }
      if (url.includes("elevenlabs")) return { ok: true, arrayBuffer: async () => new ArrayBuffer(8) };
    };

    const res = mockRes();
    await h({ method: "POST", body: { mode: "convo", text: "Hallo", teacherMode: "caring" } }, res);
    assert.equal(capturedBody?.response_format?.type, "json_object", "response_format json_object not set");
  });
});

// ---------------------------------------------------------------------------
// greeting mode
// ---------------------------------------------------------------------------

describe("greeting mode", () => {
  afterEach(() => {
    delete process.env.GROQ_API_KEY;
    delete process.env.ELEVENLABS_API_KEY;
    if (global._chatFetchOrig) { global.fetch = global._chatFetchOrig; delete global._chatFetchOrig; }
  });

  test("returns reply, correction: null, needs_repetition: false, and audio_base64", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });
    global._chatFetchOrig = global.fetch;
    global.fetch = groqFetch('{"reply":"Hallo! Wie war dein Tag?","correction":null,"needs_repetition":false}');

    const res = mockRes();
    await h({ method: "POST", body: { mode: "greeting", scenario: null, teacherMode: "caring" } }, res);
    assert.equal(res.statusCode, 200);
    assert.ok(typeof res.body.reply === "string" && res.body.reply.length > 0);
    assert.equal(res.body.correction, null, "greeting must always have null correction");
    assert.equal(res.body.needs_repetition, false, "greeting must always have needs_repetition: false");
    assert.ok(typeof res.body.audio_base64 === "string");
  });

  test("does not require text field", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });
    global._chatFetchOrig = global.fetch;
    global.fetch = groqFetch('{"reply":"Guten Tag!","correction":null}');

    const res = mockRes();
    await h({ method: "POST", body: { mode: "greeting" } }, res);
    assert.equal(res.statusCode, 200);
  });

  test("includes teacherMode personality in Groq system prompt", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });

    let capturedSystem = null;
    global._chatFetchOrig = global.fetch;
    global.fetch = async (url, opts) => {
      if (url.includes("groq")) {
        const body = JSON.parse(opts.body);
        capturedSystem = body.messages.find(m => m.role === "system")?.content || "";
        return { ok: true, json: async () => ({ choices: [{ message: { content: '{"reply":"Guten Tag!","correction":null}' } }] }) };
      }
      if (url.includes("elevenlabs")) return { ok: true, arrayBuffer: async () => new ArrayBuffer(8) };
    };

    const res = mockRes();
    await h({ method: "POST", body: { mode: "greeting", teacherMode: "strict" } }, res);
    assert.ok(capturedSystem.includes(TEACHER_PERSONALITIES.strict));
  });
});

// ---------------------------------------------------------------------------
// ElevenLabs fallback - quota exceeded / failure returns null audio, not 500
// ---------------------------------------------------------------------------

describe("ElevenLabs fallback", () => {
  afterEach(() => {
    delete process.env.GROQ_API_KEY;
    delete process.env.ELEVENLABS_API_KEY;
    if (global._chatFetchOrig) { global.fetch = global._chatFetchOrig; delete global._chatFetchOrig; }
  });

  test("convo mode returns 200 with null audio_base64 when ElevenLabs returns 401 quota_exceeded", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });
    global._chatFetchOrig = global.fetch;
    global.fetch = async (url) => {
      if (url.includes("groq")) {
        return { ok: true, json: async () => ({ choices: [{ message: { content: '{"reply":"Hallo!","correction":null,"needs_repetition":false}' } }] }) };
      }
      if (url.includes("elevenlabs")) {
        return {
          ok: false,
          text: async () => JSON.stringify({ detail: { type: "invalid_request", code: "quota_exceeded", message: "Quota exceeded." } }),
        };
      }
    };

    const res = mockRes();
    await h({ method: "POST", body: { mode: "convo", text: "Hallo", teacherMode: "caring" } }, res);
    assert.equal(res.statusCode, 200, "should return 200 even when ElevenLabs quota is exceeded");
    assert.equal(res.body.audio_base64, null, "audio_base64 should be null on ElevenLabs failure");
    assert.equal(res.body.reply, "Hallo!", "reply should still be present");
  });

  test("greeting returns 200 with null audio_base64 when ElevenLabs fails", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });
    global._chatFetchOrig = global.fetch;
    global.fetch = async (url) => {
      if (url.includes("groq")) {
        return { ok: true, json: async () => ({ choices: [{ message: { content: '{"reply":"Hallo!","correction":null}' } }] }) };
      }
      if (url.includes("elevenlabs")) return { ok: false, text: async () => "Service Unavailable" };
    };

    const res = mockRes();
    await h({ method: "POST", body: { mode: "greeting" } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.audio_base64, null);
    assert.ok(res.body.reply);
  });

  test("translate mode returns 200 with null audio_base64 when ElevenLabs network error", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });
    global._chatFetchOrig = global.fetch;
    global.fetch = async (url) => {
      if (url.includes("groq")) {
        return { ok: true, json: async () => ({ choices: [{ message: { content: '{"german":"Ich gehe nach Hause.","category":"daily_life"}' } }] }) };
      }
      if (url.includes("elevenlabs")) throw new Error("Network timeout");
    };

    const res = mockRes();
    await h({ method: "POST", body: { mode: "translate", text: "I am going home" } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.audio_base64, null);
    assert.ok(res.body.german);
  });
});

// ---------------------------------------------------------------------------
// JSON robustness - model output with plain text before JSON
// ---------------------------------------------------------------------------

describe("JSON robustness in convo mode", () => {
  afterEach(() => {
    delete process.env.GROQ_API_KEY;
    delete process.env.ELEVENLABS_API_KEY;
    if (global._chatFetchOrig) { global.fetch = global._chatFetchOrig; delete global._chatFetchOrig; }
  });

  test("extracts reply cleanly when model prepends plain text before JSON", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });
    global._chatFetchOrig = global.fetch;
    // Simulate the model outputting text then JSON (the bug that was fixed)
    global.fetch = async (url) => {
      if (url.includes("groq")) {
        return {
          ok: true,
          json: async () => ({
            choices: [{
              message: {
                content: 'Das ist richtig! {"reply":"Das ist richtig!","correction":null,"needs_repetition":false}',
              },
            }],
          }),
        };
      }
      if (url.includes("elevenlabs")) return { ok: true, arrayBuffer: async () => new ArrayBuffer(8) };
    };

    const res = mockRes();
    await h({ method: "POST", body: { mode: "convo", text: "Hallo", teacherMode: "caring" } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.reply, "Das ist richtig!", "reply should not include the raw JSON string");
    assert.ok(!res.body.reply.includes('"reply"'), "reply must not contain raw JSON keys");
  });

  test("extracts reply when model wraps JSON in markdown fences", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });
    global._chatFetchOrig = global.fetch;
    global.fetch = async (url) => {
      if (url.includes("groq")) {
        return {
          ok: true,
          json: async () => ({
            choices: [{
              message: { content: '```json\n{"reply":"Sehr gut!","correction":null,"needs_repetition":false}\n```' },
            }],
          }),
        };
      }
      if (url.includes("elevenlabs")) return { ok: true, arrayBuffer: async () => new ArrayBuffer(8) };
    };

    const res = mockRes();
    await h({ method: "POST", body: { mode: "convo", text: "Hallo", teacherMode: "caring" } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.reply, "Sehr gut!");
  });
});
