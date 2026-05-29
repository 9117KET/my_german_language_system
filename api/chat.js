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
  try {
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
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    return Buffer.from(buf).toString("base64");
  } catch {
    return null;
  }
}

async function callGroqMessages(messages, maxTokens = 350, retried = false) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: GROQ_MODEL, messages, max_tokens: maxTokens, temperature: 0.7, response_format: { type: "json_object" } }),
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

const LEVEL_DESCRIPTIONS = {
  a1: "Use ONLY very simple German: present tense (sein, haben, gehen), basic everyday words, maximum 5-7 words per sentence. No complex grammar at all.",
  a2: "Use simple German: present tense and Perfekt, basic modal verbs (können, müssen, wollen), simple conjunctions (und, aber, weil), maximum 8-10 words per sentence.",
  b1: "Use natural German: Perfekt, modal verbs, common subordinate clauses (dass/weil/wenn), polite Konjunktiv II (würde, könnte).",
  b2: "Use natural B2 German: all tenses, complex sentences, idiomatic phrases, varied vocabulary. No artificial simplification.",
  c1: "Use advanced C1 German: complex grammar, Konjunktiv I, formal and informal register as appropriate, idiomatic and nuanced language.",
};

const TEACHER_PERSONALITIES = {
  caring: `Teaching style: Warm, encouraging coach. When the learner makes an error, restate the correct form naturally in your reply without explicitly saying "that was wrong". Praise effort frequently. Keep the learner motivated.`,
  strict: `Teaching style: Rigorous Gymnasium professor. Correct every grammatical error explicitly and immediately before continuing. Name the rule (e.g. "Akkusativ requires 'einen'"). Require precision in case, conjugation, and register.`,
  blunt: `Teaching style: Blunt Berlin taxi driver. Direct, colloquial German, short sentences. State any mistake in one short sentence and move on. No encouragement, no hand-holding.`,
  socratic: `Teaching style: Socratic guide. Never correct directly. Instead ask a question that leads the learner to notice and fix their own error. Example: "Welchen Artikel benutzt man hier?" or "Ist das Verb richtig konjugiert?". Only continue after they self-correct.`,
};

function buildConvoSystemPrompt(scenarioKey, teacherMode, languageLevel, awaitingRepetition) {
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
  const personalityCtx = TEACHER_PERSONALITIES[teacherMode] || TEACHER_PERSONALITIES.caring;
  const levelCtx = LEVEL_DESCRIPTIONS[languageLevel] || LEVEL_DESCRIPTIONS.b1;

  const repetitionCtx = awaitingRepetition
    ? `\nREPETITION CHECK: The learner is now attempting to repeat the corrected form "${awaitingRepetition.corrected}". If their attempt is correct or very close, praise them briefly and advance the conversation (needs_repetition: false, correction: null). If still wrong, note the error kindly and ask once more (needs_repetition: true, fill correction).`
    : "";

  return `${roleCtx}You are a German conversation partner and language coach.
${personalityCtx}
Language level: ${levelCtx}
${repetitionCtx}
CASE RULES (use when correcting — name the specific rule in explanation):
- Akkusativ (wen?/was?): masc. der→den, ein→einen. After: durch, für, gegen, ohne, um.
- Dativ (wem?): dem/der/dem/den. After: mit, aus, bei, nach, seit, von, zu/zum/zur, außer, gegenüber.
- Dative-only verbs: helfen, danken, gefallen, gehören, passen, schmecken, schaden, antworten, folgen.
- Wechselpräpositionen (an/auf/hinter/in/neben/über/unter/vor/zwischen): Wo?=Dativ, Wohin?=Akkusativ.
- Genitive prepositions: wegen, trotz, während, außerhalb, innerhalb, aufgrund, statt.

RULES:
1. Reply in German matching the language level. Maximum 2-3 short sentences.
2. If the learner's message is in English: translate it to German, present the German phrase, and ask them to say it. Set needs_repetition: true. Fill correction as {"original":"(their English)","corrected":"(German translation)","explanation":"Try saying this in German"}.
3. If the learner made a German grammar or vocabulary error: correct it clearly naming the specific rule (e.g. "mit takes Dativ — dem not den"), provide the correct form, ask them to repeat it. Set needs_repetition: true. Fill correction.
4. If no error and no English input (or the repetition attempt was successful): advance the conversation naturally. Set needs_repetition: false. Set correction: null.
5. Return ONLY valid JSON, no markdown:
   {"reply":"...","correction":null,"needs_repetition":false}
   or
   {"reply":"...","correction":{"original":"...","corrected":"...","explanation":"one sentence naming the specific rule in English"},"needs_repetition":true}`;
}

function stripMarkdown(text) {
  return text.trim().replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();
}

function parseJSON(text) {
  const s = stripMarkdown(text);
  try { return JSON.parse(s); } catch {}
  const m = s.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  return null;
}

function isEnglish(text) {
  const s = " " + text.toLowerCase().trim() + " ";
  // German-specific characters = not English
  if (/[äöüß]/.test(s)) return false;
  // Common German words = not English
  if (/\b(ich|sie|du|wir|ihr|er|es|ist|sind|war|waren|haben|sein|und|oder|aber|auch|noch|schon|jetzt|hier|da|wie|was|wer|wenn|weil|dass|mit|für|auf|von|bei|nach|über|unter|nein|ja|bitte|danke|gerne|sehr|viel|gut|nicht)\b/.test(s)) return false;
  // Strong English markers = definitely English
  if (/\b(the|is|are|was|were|have|has|don't|doesn't|i'm|i'd|i'll|i've|you're|they're|we're|it's|there's|because|although|however|therefore|would|could|should|might|must|shall|going to|want to|need to)\b/.test(s)) return true;
  // Two or more moderate English markers = likely English
  const moderate = [' i ', ' you ', ' he ', ' she ', ' they ', ' we ', ' my ', ' your ', ' his ', ' her ', ' our ', ' their ', ' to ', ' of ', ' for ', ' on ', ' at ', ' by ', ' an '];
  return moderate.filter(w => s.includes(w)).length >= 2;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (!GROQ_KEY) return res.status(500).json({ error: "GROQ_KEY not configured in Vercel environment variables" });
  if (!EL_KEY) return res.status(500).json({ error: "ELEVENLABS_API_KEY not configured in Vercel environment variables" });

  const { mode, text, history, scenario, teacherMode, languageLevel, awaitingRepetition } = req.body || {};

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

  // greeting mode - AI opens the conversation, no learner text needed
  if (mode === "greeting") {
    try {
      const basePrompt = buildConvoSystemPrompt(scenario, teacherMode, languageLevel);
      const systemPrompt = basePrompt + "\n\nIMPORTANT: The conversation is just starting. Open with a warm, natural German greeting. Set correction: null and needs_repetition: false always.";
      const raw = await callGroqMessages([
        { role: "system", content: systemPrompt },
        { role: "user", content: "[CONVERSATION_START]" },
      ], 150);
      const parsed = parseJSON(raw);
      const reply = parsed?.reply || raw;
      const audio_base64 = await callElevenLabs(reply);
      return res.json({ reply, correction: null, needs_repetition: false, audio_base64 });
    } catch (err) {
      console.error("[api/chat greeting]", err.message);
      return res.status(500).json({ error: err.message });
    }
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
        `GERMAN CASE RULES (reference when explaining errors):\n` +
        `- Akkusativ (wen?/was? direct object): masc. der→den, ein→einen\n` +
        `- Dativ (wem? indirect/recipient): dem/der/dem/den; einem/einer/einem\n` +
        `- Akkusativ-only prepositions: durch, für, gegen, ohne, um, bis, entlang\n` +
        `- Dativ-only prepositions: mit, aus, bei, nach, seit, von, zu/zum/zur, außer, gegenüber\n` +
        `- Wechselpräpositionen (an/auf/hinter/in/neben/über/unter/vor/zwischen): Wo?=Dativ, Wohin?=Akkusativ\n` +
        `- Genitive prepositions: wegen, trotz, während, außerhalb, innerhalb, aufgrund, statt\n` +
        `- Dative-only verbs: helfen, danken, gefallen, gehören, passen, schmecken, antworten, schaden, folgen\n` +
        `Reply with ONLY this JSON (no markdown): {"corrected":"...","is_correct":true/false,"explanation":"one sentence naming the specific rule broken, or 'Perfect!'"}`
      );
      const result = JSON.parse(stripMarkdown(raw));
      const audio_base64 = await callElevenLabs(result.corrected);
      return res.json({ ...result, original: text, audio_base64 });
    }

    if (mode === "recall-check") {
      const { targetEnglish } = req.body;
      try {
        const raw = await callGroq(
          `A German learner was shown this English sentence: "${targetEnglish}"\n` +
          `Their German attempt: "${text}"\n\n` +
          `Evaluate their attempt. Be encouraging and pedagogically specific.\n` +
          `IMPORTANT: Do NOT write the correct German sentence anywhere in your response.\n` +
          `- If correct: praise them, name the grammar structures they used correctly (e.g. "Perfect Perfekt usage" or "Correct Akkusativ article")\n` +
          `- If incorrect: name the specific rule that's broken, describe the error pattern, then give ONE short hint that steers them toward the right form without writing it out\n\n` +
          `German grammar reference for naming errors:\n` +
          `- Verb must be at position 2 in main clauses (Verbzweitstellung). After a fronted adverb, subject and verb swap (inversion).\n` +
          `- Akkusativ (direct object, "wen/was"): masc. der->den, ein->einen\n` +
          `- Dativ (indirect object/recipient, "wem"): dem/der/dem/den; einem/einer/einem\n` +
          `- Akkusativ-only prepositions: durch, für, gegen, ohne, um, bis, entlang\n` +
          `- Dativ-only prepositions: mit, aus, bei, nach, seit, von, zu/zum/zur, außer, gegenüber\n` +
          `- Wechselpräpositionen (an/auf/hinter/in/neben/über/unter/vor/zwischen): Wo?=Dativ, Wohin?=Akkusativ\n` +
          `- Dative-only verbs: helfen, danken, gefallen, gehören, passen, schmecken, antworten, folgen\n` +
          `- Separable verbs: prefix splits to end in main clause\n` +
          `- Perfekt: haben/sein + Partizip II at the end\n` +
          `- Konjunktiv II: würde + infinitive, or hätte/wäre\n` +
          `- Subordinate clauses (weil, dass, wenn, obwohl, etc.): verb goes to the very end\n\n` +
          `Reply with ONLY this JSON, no markdown fences:\n` +
          `{"is_correct":true/false,"feedback":"1-2 sentences: if correct, name what they got right; if wrong, name the specific rule broken WITHOUT writing the corrected form","hint":"if correct leave empty string; if wrong, one short tip steering toward the right form without revealing it"}`
        );
        const result = JSON.parse(stripMarkdown(raw));
        return res.json({ is_correct: result.is_correct, feedback: result.feedback, hint: result.hint });
      } catch {
        return res.json({ is_correct: false, feedback: "Could not evaluate your answer. Try again.", hint: "" });
      }
    }

    if (mode === "speak-check") {
      const { prompt: scenario } = req.body;
      try {
        const raw = await callGroq(
          `A German learner was given this speaking scenario:\n"${scenario}"\n\n` +
          `They spoke for 60 seconds and this is what was transcribed:\n"${text}"\n\n` +
          `Give brief, encouraging fluency feedback (2-3 sentences max). Focus on:\n` +
          `- Did they attempt to address the scenario? (yes/partly/no)\n` +
          `- One specific thing they did well (a phrase, structure, or vocabulary choice)\n` +
          `- One concrete tip to improve fluency next time (not a grammar lecture - think mindset or sentence-starting strategy)\n\n` +
          `Do NOT rewrite their sentences. Do NOT list every error. The goal is building confidence to speak, not grammar perfection.\n` +
          `Reply with ONLY this JSON, no markdown:\n` +
          `{"feedback":"2-3 encouraging sentences with one strength and one fluency tip"}`
        );
        const result = JSON.parse(stripMarkdown(raw));
        return res.json({ feedback: result.feedback });
      } catch {
        return res.json({ feedback: "Great effort speaking for 60 seconds! Keep going - fluency comes from repetition." });
      }
    }

    if (mode === "monologue-reflect") {
      const { prompt: thoughtPrompt } = req.body;
      try {
        const raw = await callGroq(
          `A German learner was given this thought prompt:\n"${thoughtPrompt}"\n\n` +
          `They wrote the following in German:\n"${text}"\n\n` +
          `Give a warm, brief reflection (2-3 sentences). Your goal is to build their confidence to keep thinking in German, not to correct them. Focus on:\n` +
          `- One thing that reads naturally or shows good instinct (a word choice, a structure, a idea expressed well)\n` +
          `- One gentle nudge toward more natural German phrasing for the next time (not a grammar rule - think phrasing or word choice)\n\n` +
          `Do NOT list errors. Do NOT rewrite their sentences. Be the kind of mentor who makes them want to write more.\n` +
          `Reply with ONLY this JSON, no markdown:\n` +
          `{"reflection":"2-3 warm sentences with one strength and one gentle nudge"}`
        );
        const result = JSON.parse(stripMarkdown(raw));
        return res.json({ reflection: result.reflection });
      } catch {
        return res.json({ reflection: "Writing in German - even imperfectly - is exactly how fluency builds. Keep going!" });
      }
    }

    if (mode === "write-check") {
      const raw = await callGroq(
        `A German B1 learner wrote:\n"${text}"\n\n` +
        `Check ONLY for case/preposition errors (Akkusativ, Dativ, Genitiv article or preposition choice). ` +
        `Ignore minor spelling. If the sentence is grammatically correct, say so.\n\n` +
        `GERMAN CASE RULES:\n` +
        `- Akkusativ (wen?/was? direct object): masc. der→den, ein→einen\n` +
        `- Dativ (wem? indirect/recipient): dem/der/dem/den; einem/einer/einem\n` +
        `- Akkusativ prepositions: durch, für, gegen, ohne, um, bis, entlang\n` +
        `- Dativ prepositions: mit, aus, bei, nach, seit, von, zu/zum/zur, außer, gegenüber\n` +
        `- Wechselpräpositionen (an/auf/hinter/in/neben/über/unter/vor/zwischen): Wo?=Dativ, Wohin?=Akkusativ\n\n` +
        `Reply with ONLY this JSON (no markdown):\n` +
        `{"corrected":"the corrected sentence","is_correct":true/false,"explanation":"one sentence naming the specific rule broken, or 'Correct!'"}`
      );
      const result = JSON.parse(stripMarkdown(raw));
      return res.json({ ...result, original: text });
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
      // Intercept English input before handing off to the conversation model
      if (isEnglish(text) && !awaitingRepetition) {
        const translationRaw = await callGroq(
          `Translate to natural German (one sentence only): "${text}"\nReturn ONLY the German translation, no explanation, no quotes.`
        );
        const german = translationRaw.trim().replace(/^["']+|["']+$/g, "");
        const reply = `Du meinst: "${german}". Kannst du das auf Deutsch sagen?`;
        const correction = { original: text, corrected: german, explanation: "Try saying this in German" };
        const audio_base64 = await callElevenLabs(reply);
        return res.json({ reply, correction, needs_repetition: true, audio_base64 });
      }

      const systemPrompt = buildConvoSystemPrompt(scenario, teacherMode, languageLevel, awaitingRepetition);
      const messages = [
        { role: "system", content: systemPrompt },
        ...(history || []).slice(-20),
        { role: "user", content: text },
      ];
      const raw = await callGroqMessages(messages, 350);
      const parsed = parseJSON(raw);
      const reply = parsed?.reply || raw;
      const correction = parsed?.correction || null;
      const needs_repetition = parsed?.needs_repetition || false;
      const audio_base64 = await callElevenLabs(reply);
      return res.json({ reply, correction, needs_repetition, audio_base64 });
    }

    return res.status(400).json({ error: "unknown mode" });
  } catch (err) {
    console.error("[api/chat]", err.message);
    return res.status(500).json({ error: err.message });
  }
};

module.exports.buildConvoSystemPrompt = buildConvoSystemPrompt;
module.exports.parseJSON = parseJSON;
module.exports.TEACHER_PERSONALITIES = TEACHER_PERSONALITIES;
module.exports.LEVEL_DESCRIPTIONS = LEVEL_DESCRIPTIONS;
