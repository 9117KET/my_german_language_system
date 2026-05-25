// Tests for api/deepgram-token.js
// Run: node --test tests/deepgram-token.test.js

const { test, describe, afterEach } = require("node:test");
const assert = require("node:assert/strict");

function mockRes() {
  const res = {
    statusCode: 200,
    body: null,
    setHeader() { return this; },
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; },
    end() { return this; },
  };
  return res;
}

// Re-require the module fresh each test so env var changes take effect
function loadHandler() {
  // Clear require cache so env vars are re-read at module load time
  const key = require.resolve("../api/deepgram-token.js");
  delete require.cache[key];
  return require("../api/deepgram-token.js");
}

describe("deepgram-token handler", () => {
  afterEach(() => {
    delete process.env.DEEPGRAM_API_KEY;
    delete process.env.DEEPGRAM_PROJECT_ID;
    if (global._fetchOrig) {
      global.fetch = global._fetchOrig;
      delete global._fetchOrig;
    }
  });

  test("OPTIONS returns 200", async () => {
    const handler = loadHandler();
    const res = mockRes();
    await handler({ method: "OPTIONS" }, res);
    assert.equal(res.statusCode, 200);
  });

  test("GET returns 405", async () => {
    const handler = loadHandler();
    const res = mockRes();
    await handler({ method: "GET" }, res);
    assert.equal(res.statusCode, 405);
  });

  test("PUT returns 405", async () => {
    const handler = loadHandler();
    const res = mockRes();
    await handler({ method: "PUT" }, res);
    assert.equal(res.statusCode, 405);
  });

  test("returns 404 when DEEPGRAM_API_KEY is not set", async () => {
    delete process.env.DEEPGRAM_API_KEY;
    delete process.env.DEEPGRAM_PROJECT_ID;
    const handler = loadHandler();
    const res = mockRes();
    await handler({ method: "POST" }, res);
    assert.equal(res.statusCode, 404);
    assert.ok(res.body?.error?.toLowerCase().includes("not configured"));
  });

  test("returns 404 when only DEEPGRAM_API_KEY is set but not PROJECT_ID", async () => {
    process.env.DEEPGRAM_API_KEY = "fake-key";
    delete process.env.DEEPGRAM_PROJECT_ID;
    const handler = loadHandler();
    const res = mockRes();
    await handler({ method: "POST" }, res);
    assert.equal(res.statusCode, 404);
  });

  test("returns 404 when only DEEPGRAM_PROJECT_ID is set but not API_KEY", async () => {
    delete process.env.DEEPGRAM_API_KEY;
    process.env.DEEPGRAM_PROJECT_ID = "proj-123";
    const handler = loadHandler();
    const res = mockRes();
    await handler({ method: "POST" }, res);
    assert.equal(res.statusCode, 404);
  });

  test("calls Deepgram API with correct URL when env vars are set", async () => {
    process.env.DEEPGRAM_API_KEY = "test-api-key";
    process.env.DEEPGRAM_PROJECT_ID = "test-project-id";

    let capturedUrl = null;
    let capturedOpts = null;
    global._fetchOrig = global.fetch;
    global.fetch = async (url, opts) => {
      capturedUrl = url;
      capturedOpts = opts;
      return {
        ok: true,
        json: async () => ({ key: "ephemeral-key-abc123" }),
      };
    };

    const handler = loadHandler();
    const res = mockRes();
    await handler({ method: "POST" }, res);

    assert.ok(capturedUrl.includes("test-project-id"), "URL should contain project ID");
    assert.ok(capturedUrl.includes("deepgram.com"), "URL should point to Deepgram");
    assert.equal(capturedOpts.method, "POST");
    assert.ok(capturedOpts.headers.Authorization.includes("test-api-key"), "Authorization header should include API key");
  });

  test("sends correct scopes and TTL in Deepgram request body", async () => {
    process.env.DEEPGRAM_API_KEY = "test-api-key";
    process.env.DEEPGRAM_PROJECT_ID = "test-project-id";

    let capturedBody = null;
    global._fetchOrig = global.fetch;
    global.fetch = async (url, opts) => {
      capturedBody = JSON.parse(opts.body);
      return {
        ok: true,
        json: async () => ({ key: "ephemeral-key-abc123" }),
      };
    };

    const handler = loadHandler();
    const res = mockRes();
    await handler({ method: "POST" }, res);

    assert.ok(Array.isArray(capturedBody.scopes), "scopes should be an array");
    assert.ok(capturedBody.scopes.includes("usage:write"), "scopes should include usage:write");
    assert.ok(capturedBody.time_to_live_in_seconds > 0, "TTL should be positive");
    assert.ok(capturedBody.time_to_live_in_seconds <= 300, "TTL should be short-lived (<= 300s)");
  });

  test("returns { key } from Deepgram response on success", async () => {
    process.env.DEEPGRAM_API_KEY = "test-api-key";
    process.env.DEEPGRAM_PROJECT_ID = "test-project-id";

    global._fetchOrig = global.fetch;
    global.fetch = async () => ({
      ok: true,
      json: async () => ({ key: "ephemeral-key-abc123" }),
    });

    const handler = loadHandler();
    const res = mockRes();
    await handler({ method: "POST" }, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body?.key, "ephemeral-key-abc123");
  });

  test("returns 500 when Deepgram API returns non-ok status", async () => {
    process.env.DEEPGRAM_API_KEY = "test-api-key";
    process.env.DEEPGRAM_PROJECT_ID = "test-project-id";

    global._fetchOrig = global.fetch;
    global.fetch = async () => ({
      ok: false,
      text: async () => "Unauthorized",
    });

    const handler = loadHandler();
    const res = mockRes();
    await handler({ method: "POST" }, res);

    assert.equal(res.statusCode, 500);
    assert.ok(res.body?.error, "error field should be present");
  });

  test("returns 500 when fetch throws (network error)", async () => {
    process.env.DEEPGRAM_API_KEY = "test-api-key";
    process.env.DEEPGRAM_PROJECT_ID = "test-project-id";

    global._fetchOrig = global.fetch;
    global.fetch = async () => {
      throw new Error("Network failure");
    };

    const handler = loadHandler();
    const res = mockRes();
    await handler({ method: "POST" }, res);

    assert.equal(res.statusCode, 500);
    assert.ok(res.body?.error?.includes("Network failure"));
  });
});
