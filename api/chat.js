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
      max_tokens: 200,
      temperature: 0.3,
    }),
    signal: AbortSignal.timeout(12000),
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
        model_id: "eleven_turbo_v2_5",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
      signal: AbortSignal.timeout(15000),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs ${res.status}: ${err}`);
  }
  const buf = await res.arrayBuffer();
  return Buffer.from(buf).toString("base64");
}

async function callGroqMessages(messages, maxTokens = 350, retried = false) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: GROQ_MODEL, messages, max_tokens: maxTokens, temperature: 0.7 }),
    signal: AbortSignal.timeout(12000),
  });
  if (res.status === 429 && !retried) {
    const body = await res.json();
    const match = body?.error?.message?.match(/try again in ([\d.]+)s/i);
    const waitMs = match ? Math.ceil(parseFloat(match[1]) * 1000) + 200 : 2000;
    await new Promise(r => setTimeout(r, waitMs));
    return callGroqMessages(messages, maxTokens, true);
  }
  if (!res.ok) { const err = await res.text(); throw new Error(`Groq ${res.status}: ${err}`); }
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

function buildConvoSystemPrompt(scenarioKey) {
  const SCENARIO_ROLES = {
    hirschsprach_cafe: "a friendly German native speaker at a language café",
    shopping:          "a helpful shop assistant in a German clothing store",
    health:            "a German doctor at a standard clinic",
    travel:            "a ticket office employee at a German train station",
    greetings:         "a new German-speaking colleague meeting you for the first time",
    food_drink:        "a waiter at a German restaurant",
    job_search:        "an HR manager conducting a job interview",
    social:            "a German friend planning a weekend activity together",
  };
  const roleCtx = scenarioKey && SCENARIO_ROLES[scenarioKey]
    ? `You are playing the role of ${SCENARIO_ROLES[scenarioKey]}.\n`
    : "";
  return `${roleCtx}You are a helpful German conversation partner for a B1 learner.

RULES:
1. Reply in natural German, B1 level, maximum 2-3 short sentences.
2. Model these high-frequency structures: Perfekt, modal verbs, common subordinate clauses (dass/weil/wenn), polite Konjunktiv II.
3. Check the learner's last message for ONE grammar or vocabulary error.
4. Return ONLY valid JSON, no markdown, no extra text:
   {"reply":"...","correction":null}
   or
   {"reply":"...","correction":{"original":"...","corrected":"...","explanation":"one sentence in English"}}
5. Set correction to null if the learner's message had no errors.
6. Be encouraging and keep the conversation flowing naturally.`;
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

  const { mode, text, history, scenario } = req.body || {};

  // hint mode doesn't require user text
  if (mode === "hint") {
    const lastExchanges = (history || []).slice(-6).map(m => `${m.role}: ${m.content}`).join("\n");
    const scenarioCtx = scenario ? `Scenario: ${scenario.replace(/_/g, " ")}.` : "Free conversation.";
    const raw = await callGroq(
      `A B1 German learner needs ideas for what to say next in a conversation.\n${scenarioCtx}\n\nRecent messages:\n${lastExchanges || "(just starting)"}\n\nGive exactly 3 short ideas in English for what the learner could say or ask next. Practical, B1-appropriate.\nReturn ONLY a JSON array: ["idea 1","idea 2","idea 3"]`
    );
    let hints;
    try { hints = JSON.parse(stripMarkdown(raw)); } catch { hints = ["Ask how they are doing", "Share something about your day", "Ask a follow-up question"]; }
    return res.json({ hints });
  }

  if (!text || !text.trim()) return res.status(400).json({ error: "No text provided" });

  try {
    if (mode === "translate") {
      const raw = await callGroq(
        `Translate to natural conversational German and pick the best category.\n\n` +
        `Return ONLY this JSON (no markdown): {"german":"...","category":"..."}\n\n` +
        `Categories: morning_routine (waking up/breakfast), job_search (jobs/work/interviews), german_class (learning German), hirschsprach_cafe (café/meeting people/opinions), describe_surroundings (weather/places/senses), inner_thoughts (feelings/reflections), daily_life (errands/transport), greetings (introductions/small talk), food_drink (restaurants/ordering food), shopping (buying things/prices), health (illness/doctor/pharmacy), travel (directions/getting around), social (plans with friends/events), hobbies (free time/interests)\n\n` +
        `English: ${text}`
      );
      let german, category;
      try {
        const parsed = JSON.parse(stripMarkdown(raw));
        german = parsed.german;
        category = parsed.category || null;
      } catch {
        german = raw.replace(/^["']|["']$/g, "").trim();
        category = null;
      }
      const audio_base64 = await callElevenLabs(german);
      return res.json({ german, english: text, category, audio_base64 });
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

    if (mode === "vocab") {
      const raw = await callGroq(
        `Explain this German word for a B1 learner.\n` +
        `Return ONLY this JSON (no markdown):\n` +
        `{"word":"canonical/infinitive form","article":"der/die/das or none","pos":"Nomen/Verb/Adjektiv/Adverb/Konjunktion/etc","definition":"short English definition","example":"short German example sentence","tip":"one grammar or gender tip"}\n\n` +
        `Word: ${text}`
      );
      const result = JSON.parse(stripMarkdown(raw));
      return res.json(result);
    }

    if (mode === "grammar") {
      const explanation = await callGroq(
        `You are a German teacher. Explain "${text}" for a B1 learner in 3-4 sentences. ` +
        `Give 2 short original example sentences. Be concise and clear.`
      );
      return res.json({ explanation });
    }

    if (mode === "convo") {
      const systemPrompt = buildConvoSystemPrompt(scenario);
      const messages = [
        { role: "system", content: systemPrompt },
        ...(history || []).slice(-20),
        { role: "user", content: text },
      ];
      const raw = await callGroqMessages(messages, 350);
      let reply, correction;
      try {
        const parsed = JSON.parse(stripMarkdown(raw));
        reply = parsed.reply || raw;
        correction = parsed.correction || null;
      } catch {
        reply = raw;
        correction = null;
      }
      const audio_base64 = await callElevenLabs(reply);
      return res.json({ reply, correction, audio_base64 });
    }

    return res.status(400).json({ error: "unknown mode" });
  } catch (err) {
    console.error("[api/chat]", err.message);
    return res.status(500).json({ error: err.message });
  }
};
