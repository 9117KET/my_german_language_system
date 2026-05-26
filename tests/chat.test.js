// Tests for api/chat.js - teacher personality system and handler routing.
// Uses Node built-in test runner (no npm install needed).
// Run: node --test tests/chat.test.js

const { test, describe, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");

const handler = require("../api/chat.js");
const { buildConvoSystemPrompt, TEACHER_PERSONALITIES } = handler;

// ---- Pure function tests ----

describe("TEACHER_PERSONALITIES", () => {
  test("has all four modes", () => {
    assert.ok(TEACHER_PERSONALITIES.caring, "caring missing");
    assert.ok(TEACHER_PERSONALITIES.strict, "strict missing");
    assert.ok(TEACHER_PERSONALITIES.blunt, "blunt missing");
    assert.ok(TEACHER_PERSONALITIES.socratic, "socratic missing");
  });

  test("caring mode is warm and non-explicit about errors", () => {
    const p = TEACHER_PERSONALITIES.caring.toLowerCase();
    assert.ok(p.includes("warm") || p.includes("encouraging") || p.includes("coach"), "caring lacks warm/encouraging/coach");
  });

  test("strict mode explicitly corrects errors", () => {
    const p = TEACHER_PERSONALITIES.strict.toLowerCase();
    assert.ok(p.includes("correct") || p.includes("explicit") || p.includes("rigorous"), "strict lacks correction focus");
  });

  test("blunt mode is direct and brief", () => {
    const p = TEACHER_PERSONALITIES.blunt.toLowerCase();
    assert.ok(p.includes("blunt") || p.includes("direct") || p.includes("short"), "blunt lacks direct/short keywords");
  });

  test("socratic mode asks questions instead of correcting", () => {
    const p = TEACHER_PERSONALITIES.socratic.toLowerCase();
    assert.ok(p.includes("question") || p.includes("ask") || p.includes("socratic"), "socratic lacks question-based approach");
  });
});

describe("buildConvoSystemPrompt", () => {
  test("includes caring personality text by default", () => {
    const prompt = buildConvoSystemPrompt(null, "caring");
    assert.ok(prompt.includes(TEACHER_PERSONALITIES.caring));
  });

  test("includes strict personality text", () => {
    const prompt = buildConvoSystemPrompt(null, "strict");
    assert.ok(prompt.includes(TEACHER_PERSONALITIES.strict));
  });

  test("includes blunt personality text", () => {
    const prompt = buildConvoSystemPrompt(null, "blunt");
    assert.ok(prompt.includes(TEACHER_PERSONALITIES.blunt));
  });

  test("includes socratic personality text", () => {
    const prompt = buildConvoSystemPrompt(null, "socratic");
    assert.ok(prompt.includes(TEACHER_PERSONALITIES.socratic));
  });

  test("falls back to caring for unknown teacherMode", () => {
    const prompt = buildConvoSystemPrompt(null, "nonexistent");
    assert.ok(prompt.includes(TEACHER_PERSONALITIES.caring));
  });

  test("falls back to caring when teacherMode is undefined", () => {
    const prompt = buildConvoSystemPrompt(null, undefined);
    assert.ok(prompt.includes(TEACHER_PERSONALITIES.caring));
  });

  test("includes scenario role for known scenario key", () => {
    const prompt = buildConvoSystemPrompt("shopping", "caring");
    assert.ok(prompt.includes("shop assistant") || prompt.includes("shopping"), "shopping scenario role missing");
  });

  test("includes doctor role for health scenario", () => {
    const prompt = buildConvoSystemPrompt("health", "strict");
    assert.ok(prompt.includes("doctor"), "health scenario should mention doctor");
  });

  test("omits role line for unknown scenario key", () => {
    const prompt = buildConvoSystemPrompt("unknown_scenario", "caring");
    assert.ok(!prompt.startsWith("You are playing the role of"), "unknown scenario should not add role line");
  });

  test("omits role line when scenarioKey is null", () => {
    const prompt = buildConvoSystemPrompt(null, "caring");
    assert.ok(!prompt.startsWith("You are playing the role of"), "null scenario should not add role line");
  });

  test("always includes JSON format instruction", () => {
    for (const mode of ["caring", "strict", "blunt", "socratic"]) {
      const prompt = buildConvoSystemPrompt(null, mode);
      assert.ok(prompt.includes('"reply"'), `JSON instruction missing for mode: ${mode}`);
      assert.ok(prompt.includes('"correction"'), `correction field instruction missing for mode: ${mode}`);
    }
  });

  test("personality and scenario both present when both provided", () => {
    const prompt = buildConvoSystemPrompt("job_search", "strict");
    assert.ok(prompt.includes(TEACHER_PERSONALITIES.strict), "personality text missing");
    assert.ok(prompt.includes("HR") || prompt.includes("job"), "scenario text missing");
  });
});

// ---- Handler routing tests ----
// api/chat.js captures GROQ_KEY/EL_KEY at module load time, so each handler
// test that needs specific env var state must reload the module from a clean cache.

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
  // Apply env vars before re-requiring so module-level constants pick them up
  Object.entries(envVars).forEach(([k, v]) => { process.env[k] = v; });
  const key = require.resolve("../api/chat.js");
  delete require.cache[key];
  return require("../api/chat.js");
}

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
    const h = loadChatHandler(); // no env vars set
    const res = mockRes();
    await h({ method: "POST", body: { mode: "convo", text: "Hallo" } }, res);
    assert.equal(res.statusCode, 500);
    assert.ok(res.body?.error?.toLowerCase().includes("groq"), "error should mention GROQ");
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

  test("convo mode sends teacherMode in Groq system prompt", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });

    let capturedBody = null;
    global._chatFetchOrig = global.fetch;
    global.fetch = async (url, opts) => {
      if (url.includes("groq")) {
        capturedBody = JSON.parse(opts.body);
        return {
          ok: true,
          json: async () => ({
            choices: [{ message: { content: '{"reply":"Hallo!","correction":null}' } }],
          }),
        };
      }
      if (url.includes("elevenlabs")) {
        return { ok: true, arrayBuffer: async () => new ArrayBuffer(8) };
      }
      throw new Error(`Unexpected fetch to: ${url}`);
    };

    const res = mockRes();
    await h({
      method: "POST",
      body: { mode: "convo", text: "Hallo", history: [], scenario: null, teacherMode: "socratic" },
    }, res);

    assert.ok(capturedBody, "Groq was never called");
    const systemMsg = capturedBody.messages.find(m => m.role === "system");
    assert.ok(systemMsg, "No system message sent to Groq");
    assert.ok(
      systemMsg.content.includes(TEACHER_PERSONALITIES.socratic),
      "Socratic personality not in Groq system prompt"
    );
  });

  test("convo mode returns reply, correction, and audio_base64", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });

    global._chatFetchOrig = global.fetch;
    global.fetch = async (url) => {
      if (url.includes("groq")) {
        return {
          ok: true,
          json: async () => ({
            choices: [{
              message: {
                content: JSON.stringify({
                  reply: "Das ist richtig!",
                  correction: { original: "ich gehe", corrected: "ich gehe", explanation: "Perfect!" },
                }),
              },
            }],
          }),
        };
      }
      if (url.includes("elevenlabs")) {
        return { ok: true, arrayBuffer: async () => new ArrayBuffer(8) };
      }
    };

    const res = mockRes();
    await h({
      method: "POST",
      body: { mode: "convo", text: "Hallo", teacherMode: "caring" },
    }, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body?.reply, "Das ist richtig!");
    assert.ok(res.body?.correction !== undefined, "correction field missing");
    assert.ok(typeof res.body?.audio_base64 === "string", "audio_base64 should be a string");
  });

  test("greeting mode returns reply and audio without needing text", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });

    global._chatFetchOrig = global.fetch;
    global.fetch = async (url) => {
      if (url.includes("groq")) {
        return {
          ok: true,
          json: async () => ({
            choices: [{ message: { content: '{"reply":"Hallo! Wie war dein Tag?","correction":null}' } }],
          }),
        };
      }
      if (url.includes("elevenlabs")) {
        return { ok: true, arrayBuffer: async () => new ArrayBuffer(8) };
      }
    };

    const res = mockRes();
    await h({ method: "POST", body: { mode: "greeting", scenario: null, teacherMode: "caring" } }, res);

    assert.equal(res.statusCode, 200);
    assert.ok(typeof res.body?.reply === "string" && res.body.reply.length > 0, "reply should be non-empty string");
    assert.equal(res.body?.correction, null, "greeting should always have null correction");
    assert.ok(typeof res.body?.audio_base64 === "string", "audio_base64 should be a string");
  });

  test("greeting mode includes personality in Groq system prompt", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });

    let capturedSystem = null;
    global._chatFetchOrig = global.fetch;
    global.fetch = async (url, opts) => {
      if (url.includes("groq")) {
        const body = JSON.parse(opts.body);
        capturedSystem = body.messages.find(m => m.role === "system")?.content || "";
        return {
          ok: true,
          json: async () => ({
            choices: [{ message: { content: '{"reply":"Guten Tag!","correction":null}' } }],
          }),
        };
      }
      if (url.includes("elevenlabs")) {
        return { ok: true, arrayBuffer: async () => new ArrayBuffer(8) };
      }
    };

    const res = mockRes();
    await h({ method: "POST", body: { mode: "greeting", scenario: null, teacherMode: "strict" } }, res);

    assert.ok(capturedSystem.includes(TEACHER_PERSONALITIES.strict), "strict personality should be in greeting system prompt");
  });

  test("greeting mode does not require text field", async () => {
    const h = loadChatHandler({ GROQ_API_KEY: "fake", ELEVENLABS_API_KEY: "fake" });

    global._chatFetchOrig = global.fetch;
    global.fetch = async (url) => {
      if (url.includes("groq")) {
        return { ok: true, json: async () => ({ choices: [{ message: { content: '{"reply":"Hallo!","correction":null}' } }] }) };
      }
      if (url.includes("elevenlabs")) {
        return { ok: true, arrayBuffer: async () => new ArrayBuffer(8) };
      }
    };

    const res = mockRes();
    // No text field at all
    await h({ method: "POST", body: { mode: "greeting" } }, res);
    assert.equal(res.statusCode, 200, "greeting should work with no text field");
  });
});
