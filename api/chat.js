// Vercel serverless function - proxies Gemini (AI) and ElevenLabs (TTS)
// No npm packages needed - uses Node 18+ native fetch

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const EL_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "onwK4e9ZLuTAKqWW03F9";
const GEMINI_MODEL = "gemini-2.0-flash";

async function callGemini(prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.candidates[0].content.parts[0].text.trim();
}

async function callElevenLabs(text) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": EL_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs ${res.status}: ${err}`);
  }
  const buf = await res.arrayBuffer();
  return Buffer.from(buf).toString("base64");
}

function stripMarkdown(text) {
  return text.trim().replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (!GEMINI_KEY) return res.status(500).json({ error: "GEMINI_API_KEY not configured in Vercel environment variables" });
  if (!EL_KEY) return res.status(500).json({ error: "ELEVENLABS_API_KEY not configured in Vercel environment variables" });

  const { mode, text } = req.body || {};
  if (!text || !text.trim()) return res.status(400).json({ error: "No text provided" });

  try {
    if (mode === "translate") {
      const german = await callGemini(
        `Translate the following English sentence into natural, conversational German. ` +
        `Return ONLY the German translation with no explanation, no quotes, nothing else.\n\nEnglish: ${text}`
      );
      const audio_base64 = await callElevenLabs(german);
      return res.json({ german, english: text, audio_base64 });
    }

    if (mode === "correct") {
      const raw = await callGemini(
        `A German language learner said the following (possibly incorrect) German sentence: "${text}"\n\n` +
        `Respond with ONLY a JSON object and nothing else (no markdown, no code block):\n` +
        `{"corrected":"the corrected German sentence","is_correct":true,"explanation":"what was wrong in one sentence, or 'Perfect!' if already correct"}`
      );
      const result = JSON.parse(stripMarkdown(raw));
      const audio_base64 = await callElevenLabs(result.corrected);
      return res.json({ ...result, original: text, audio_base64 });
    }

    return res.status(400).json({ error: "mode must be translate or correct" });
  } catch (err) {
    console.error("[api/chat]", err.message);
    return res.status(500).json({ error: err.message });
  }
};
