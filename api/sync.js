// Vercel serverless function - cross-device sync of the story series,
// episode archive and read count, stored as one JSON blob per sync code
// in a private Vercel Blob store (BLOB_READ_WRITE_TOKEN injected by Vercel).

const { put, get } = require("@vercel/blob");

const ID_RX = /^[a-z0-9][a-z0-9-]{7,63}$/;
const MAX_BYTES = 900000;

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({ error: "Sync storage not configured (BLOB_READ_WRITE_TOKEN missing)" });
  }

  const { op, id, data } = req.body || {};
  if (!ID_RX.test(id || "")) {
    return res.status(400).json({ error: "Invalid sync code" });
  }
  const pathname = `sync/${id}.json`;

  try {
    if (op === "push") {
      if (!data || typeof data !== "object") return res.status(400).json({ error: "No data" });
      const body = JSON.stringify(data);
      if (body.length > MAX_BYTES) return res.status(413).json({ error: "Sync payload too large" });
      await put(pathname, body, {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
      });
      return res.json({ ok: true, savedAt: data.savedAt || Date.now() });
    }

    if (op === "pull") {
      const result = await get(pathname, { access: "private" });
      if (!result || !result.stream) return res.json({ data: null });
      const text = await new Response(result.stream).text();
      let parsed = null;
      try { parsed = JSON.parse(text); } catch {}
      return res.json({ data: parsed });
    }

    return res.status(400).json({ error: "unknown op" });
  } catch (err) {
    console.error("[api/sync]", err.message);
    return res.status(500).json({ error: "Sync failed. Try again." });
  }
};
