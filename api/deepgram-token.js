// Returns a short-lived Deepgram key for direct browser WebSocket use.
// Requires DEEPGRAM_API_KEY and DEEPGRAM_PROJECT_ID in Vercel env vars.
// Returns 404 if not configured (client falls back to Web Speech API).

const DEEPGRAM_KEY = process.env.DEEPGRAM_API_KEY;
const DEEPGRAM_PROJECT_ID = process.env.DEEPGRAM_PROJECT_ID;

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  if (!DEEPGRAM_KEY || !DEEPGRAM_PROJECT_ID) {
    return res.status(404).json({ error: "Deepgram not configured" });
  }

  try {
    const response = await fetch(
      `https://api.deepgram.com/v1/projects/${DEEPGRAM_PROJECT_ID}/keys`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${DEEPGRAM_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: "Browser STT session",
          scopes: ["usage:write"],
          time_to_live_in_seconds: 120,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Deepgram key creation failed: ${err}`);
    }

    const data = await response.json();
    return res.json({ key: data.key });
  } catch (err) {
    console.error("[deepgram-token]", err.message);
    return res.status(500).json({ error: err.message });
  }
};
