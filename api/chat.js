// Vercel serverless function - proxies Groq (AI) and ElevenLabs (TTS)
// No npm packages needed - uses Node 18+ native fetch

const GROQ_KEY = process.env.GROQ_API_KEY || process.env.GROQ_KEY;
const EL_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "onwK4e9ZLuTAKqWW03F9";

// llama-3.1-8b-instant: fast, free, 14,400 req/day, excellent for translation
const GROQ_MODEL = "llama-3.1-8b-instant";

async function callGroq(prompt, retried = false) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.3,
    }),
  });

  if (res.status === 429 && !retried) {
    const body = await res.json();
    // Extract wait time from Groq's error message e.g. "try again in 1.21s"
    const match = body?.error?.message?.match(/try again in ([\d.]+)s/i);
    const waitMs = match ? Math.ceil(parseFloat(match[1]) * 1000) + 200 : 2000;
    await new Promise(r => setTimeout(r, waitMs));
    return callGroq(prompt, true);
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.choices[0].message.content.trim();
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

  if (!GROQ_KEY) return res.status(500).json({ error: "GROQ_KEY not configured in Vercel environment variables" });
  if (!EL_KEY) return res.status(500).json({ error: "ELEVENLABS_API_KEY not configured in Vercel environment variables" });

  const { mode, text } = req.body || {};
  if (!text || !text.trim()) return res.status(400).json({ error: "No text provided" });

  try {
    if (mode === "translate") {
      const german = await callGroq(
        `Translate to natural conversational German. Return ONLY the German sentence, nothing else.\nEnglish: ${text}`
      );
      const audio_base64 = await callElevenLabs(german);
      return res.json({ german, english: text, audio_base64 });
    }

    if (mode === "correct") {
      const raw = await callGroq(
        `Correct this German sentence from a learner: "${text}"\n` +
        `Reply with ONLY this JSON (no markdown): {"corrected":"...","is_correct":true/false,"explanation":"one sentence or 'Perfect!'"}`
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
