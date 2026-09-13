// Vercel serverless function - proxies Groq (AI) and ElevenLabs (TTS)
// No npm packages needed - uses Node 18+ native fetch

const GROQ_KEY = process.env.GROQ_API_KEY || process.env.GROQ_KEY;
const EL_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "onwK4e9ZLuTAKqWW03F9";

// openai/gpt-oss-120b: fast, strong German, 131k context, reliable JSON output.
// It is a reasoning model, so `reasoning_effort: "low"` keeps the hidden reasoning
// short - without it the reasoning tokens eat the max_tokens budget and the JSON
// answer gets truncated mid-string (finish_reason "length" -> parseJSON returns null).
const GROQ_MODEL = "openai/gpt-oss-120b";
const REASONING_EFFORT = "low";

// Reasoning tokens are billed against max_tokens, so every budget below has to leave
// room for them on top of the visible answer.
const DEFAULT_MAX_TOKENS = 700;

async function callGroq(prompt, attempt = 1, maxTokens = DEFAULT_MAX_TOKENS) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      reasoning_effort: REASONING_EFFORT,
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.3,
    }),
    signal: AbortSignal.timeout(12000),
  });

  if (!res.ok) {
    const { retry, waitMs, body } = await groqRetryDelay(res);
    if (retry && attempt < MAX_GROQ_ATTEMPTS) {
      await new Promise(r => setTimeout(r, waitMs));
      return callGroq(prompt, attempt + 1, maxTokens);
    }
    throw new Error(`Groq ${res.status}: ${body}`);
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

// Two transient Groq failures are worth retrying rather than surfacing:
//  - 429: the free tier allows only 8000 tokens/minute, and max_tokens counts toward
//    that, so the bigger exam generations bump into it in normal use.
//  - 400 json_validate_failed: JSON mode occasionally rejects the model's own output
//    (a stray brace). A plain retry usually succeeds.
const MAX_GROQ_ATTEMPTS = 3;

async function groqRetryDelay(res) {
  const body = await res.text();
  if (res.status === 429) {
    // Groq reports how long to wait, e.g. "try again in 2.63s".
    const match = body.match(/try again in ([\d.]+)s/i);
    return { retry: true, waitMs: match ? Math.ceil(parseFloat(match[1]) * 1000) + 200 : 2000, body };
  }
  if (res.status === 400 && body.includes("json_validate_failed")) {
    return { retry: true, waitMs: 250, body };
  }
  return { retry: false, waitMs: 0, body };
}

async function callGroqMessages(messages, maxTokens = DEFAULT_MAX_TOKENS, attempt = 1) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: GROQ_MODEL, reasoning_effort: REASONING_EFFORT, messages, max_tokens: maxTokens, temperature: 0.7, response_format: { type: "json_object" } }),
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) {
    const { retry, waitMs, body } = await groqRetryDelay(res);
    if (retry && attempt < MAX_GROQ_ATTEMPTS) {
      await new Promise(r => setTimeout(r, waitMs));
      return callGroqMessages(messages, maxTokens, attempt + 1);
    }
    throw new Error(`Groq ${res.status}: ${body}`);
  }
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
      ], 500);
      const parsed = parseJSON(raw);
      const reply = parsed?.reply || raw;
      const audio_base64 = await callElevenLabs(reply);
      return res.json({ reply, correction: null, needs_repetition: false, audio_base64 });
    } catch (err) {
      console.error("[api/chat greeting]", err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  // story mode - generates a graded reader story or the next episode of an
  // ongoing series (comprehensible-input loop: recurring characters, a
  // cliffhanger per episode, and SRS target words re-woven across days)
  if (mode === "story") {
    const { level, storyType, topic, targetWords, series } = req.body || {};
    const lvl = LEVEL_DESCRIPTIONS[level] ? level : "b1";
    const sentenceCount = { a1: 8, a2: 10, b1: 12, b2: 14, c1: 14 }[lvl];
    const words = Array.isArray(targetWords) ? targetWords.slice(0, 8).filter(w => typeof w === "string") : [];
    const isDialogue = storyType === "dialogue";
    const form = isDialogue
      ? `a dialogue between two named people (prefix each sentence with the speaker's name and a colon, e.g. "Lena: ...")`
      : `a short story with a small narrative arc (setup, a complication, a resolution)`;
    const isSeries = series && typeof series === "object";
    const GENRE_HOOKS = {
      krimi: "a light detective/mystery serial (a small crime or puzzle in a German city, clues, suspects)",
      comedy: "a comedy serial about chaotic flatmates in a German WG (misunderstandings, absurd everyday situations)",
      romance: "a warm romantic serial (two people who keep almost meeting, small-town Germany)",
      scifi: "a light science-fiction serial (something strange has appeared in an ordinary German town)",
      abenteuer: "an adventure serial (a journey across German-speaking countries with a goal and obstacles)",
    };
    try {
      const systemPrompt =
        `You are an author of German graded readers. You write engaging, natural German at exactly the requested CEFR level. ` +
        `Learners must understand 95-98% of the words, so keep vocabulary at or below the level. Always return ONLY valid JSON.`;
      let userPrompt;
      if (isSeries) {
        const ep = Math.max(1, parseInt(series.episode, 10) || 1);
        const genreDesc = GENRE_HOOKS[series.genre] || GENRE_HOOKS.krimi;
        const prevCtx = ep > 1 && series.summary
          ? `This is episode ${ep}. Continue directly from the story so far.\n` +
            `Story so far: ${String(series.summary).slice(0, 900)}\n` +
            (series.characters ? `Recurring characters (keep names and personalities consistent): ${String(series.characters).slice(0, 300)}\n` : "") +
            (series.cliffhanger ? `The last episode ended on this cliffhanger - resolve or advance it early in this episode: ${String(series.cliffhanger).slice(0, 300)}\n` : "")
          : `This is episode 1. Introduce 2-3 memorable recurring characters and the setting.\n`;
        userPrompt =
          `Write episode ${ep} of ${genreDesc}, in German, for a ${lvl.toUpperCase()} learner.\n` +
          prevCtx +
          `Level constraint: ${LEVEL_DESCRIPTIONS[lvl]}\n` +
          (words.length ? `Weave these target words naturally into the text (use as many as fit, inflected forms are fine): ${words.join(", ")}\n` : "") +
          `Length: exactly ${sentenceCount} sentences. END the episode on a small cliffhanger that makes the reader want the next episode.\n\n` +
          `Then write 3 comprehension questions IN GERMAN at the same level, each with 3 short answer options (exactly one correct).\n\n` +
          `Return ONLY this JSON shape:\n` +
          `{"title":"German episode title","title_en":"English title","sentences":[{"de":"German sentence","en":"English translation"}],` +
          `"questions":[{"q":"German question","options":["opt A","opt B","opt C"],"answer":0}],` +
          `"used_words":["target words you actually used"],` +
          `"summary":"2-3 English sentences summarizing the WHOLE story so far including this episode (for continuing next time)",` +
          `"characters":"comma-separated recurring character names with a 3-word description each",` +
          `"cliffhanger":"one English sentence: the open question this episode ends on"}`;
      } else {
        userPrompt =
          `Write ${form} in German for a ${lvl.toUpperCase()} learner.\n` +
          `Level constraint: ${LEVEL_DESCRIPTIONS[lvl]}\n` +
          `Topic: ${topic || "everyday life in Germany (pick something concrete and slightly surprising)"}\n` +
          (words.length ? `Weave these target words naturally into the text (use as many as fit, inflected forms are fine): ${words.join(", ")}\n` : "") +
          `Length: exactly ${sentenceCount} sentences.\n\n` +
          `Then write 3 comprehension questions IN GERMAN at the same level, each with 3 short answer options (exactly one correct).\n\n` +
          `Return ONLY this JSON shape:\n` +
          `{"title":"German title","title_en":"English title","sentences":[{"de":"German sentence","en":"English translation"}],` +
          `"questions":[{"q":"German question","options":["opt A","opt B","opt C"],"answer":0}],` +
          `"used_words":["target words you actually used"]}`;
      }
      const raw = await callGroqMessages([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ], 1700);
      const result = parseJSON(raw);
      if (!result || !Array.isArray(result.sentences) || result.sentences.length < 3) {
        throw new Error("Story generation returned invalid JSON");
      }
      const sentences = result.sentences
        .filter(s => s && typeof s.de === "string" && s.de.trim())
        .map(s => ({ de: s.de.trim(), en: (s.en || "").trim() }));
      const questions = (Array.isArray(result.questions) ? result.questions : [])
        .filter(q => q && q.q && Array.isArray(q.options) && q.options.length >= 2)
        .slice(0, 3)
        .map(q => ({
          q: String(q.q),
          options: q.options.slice(0, 3).map(String),
          answer: Math.min(Math.max(parseInt(q.answer, 10) || 0, 0), Math.min(q.options.length, 3) - 1),
        }));
      const payload = {
        title: result.title || "Eine Geschichte",
        title_en: result.title_en || "",
        level: lvl,
        sentences,
        questions,
        used_words: Array.isArray(result.used_words) ? result.used_words : [],
      };
      if (isSeries) {
        payload.episode = Math.max(1, parseInt(series.episode, 10) || 1);
        payload.summary = String(result.summary || "");
        payload.characters = String(result.characters || "");
        payload.cliffhanger = String(result.cliffhanger || "");
      }
      return res.json(payload);
    } catch (err) {
      console.error("[api/chat story]", err.message);
      return res.status(500).json({ error: "Could not generate a story right now. Try again." });
    }
  }

  // error-profile mode - clusters the learner's logged mistakes into weakness patterns
  if (mode === "error-profile") {
    const { errors } = req.body || {};
    if (!Array.isArray(errors) || !errors.length) {
      return res.status(400).json({ error: "No errors provided" });
    }
    try {
      const errorList = errors.slice(-30).map((e, i) =>
        `${i + 1}. [${e.source || "unknown"}] They said: "${e.original}" -> Corrected: "${e.corrected}"${e.explanation ? ` (${e.explanation})` : ""}`
      ).join("\n");
      const raw = await callGroqMessages([
        { role: "system", content: "You are a German language diagnostician. You find recurring error patterns in a learner's mistakes. Always return ONLY valid JSON." },
        { role: "user", content:
          `Here are recent mistakes from a B1-B2 German learner (their attempt -> the correction):\n\n${errorList}\n\n` +
          `Identify the 2-3 most important RECURRING grammar/vocabulary patterns behind these mistakes. ` +
          `Order by how much fixing it would improve their German.\n\n` +
          `Return ONLY this JSON:\n` +
          `{"patterns":[{"title":"short pattern name, e.g. 'Dativ after prepositions'",` +
          `"description":"2 sentences in English: what they keep doing wrong and the rule",` +
          `"tip":"one memorable tip in English",` +
          `"examples":["one short correct German example sentence","another"]}]}`,
        },
      ], 900);
      const result = parseJSON(raw);
      const patterns = (result && Array.isArray(result.patterns) ? result.patterns : [])
        .slice(0, 3)
        .map(p => ({
          title: String(p.title || "Pattern"),
          description: String(p.description || ""),
          tip: String(p.tip || ""),
          examples: Array.isArray(p.examples) ? p.examples.slice(0, 2).map(String) : [],
        }));
      if (!patterns.length) throw new Error("No patterns returned");
      return res.json({ patterns });
    } catch (err) {
      console.error("[api/chat error-profile]", err.message);
      return res.status(500).json({ error: "Could not analyze your mistakes right now. Try again." });
    }
  }

  // error-drills mode - turns the learner's own mistakes into gap-fill drills
  if (mode === "error-drills") {
    const { errors } = req.body || {};
    if (!Array.isArray(errors) || !errors.length) {
      return res.status(400).json({ error: "No errors provided" });
    }
    try {
      const errorList = errors.slice(-12).map((e, i) =>
        `${i + 1}. They said: "${e.original}" -> Corrected: "${e.corrected}"${e.explanation ? ` (${e.explanation})` : ""}`
      ).join("\n");
      const raw = await callGroqMessages([
        { role: "system", content: "You write German gap-fill drills targeted at a learner's own mistakes. Always return ONLY valid JSON." },
        { role: "user", content:
          `Here are a German learner's recent corrected mistakes:\n\n${errorList}\n\n` +
          `Create up to 8 gap-fill drills from the CORRECTED sentences. For each: take the corrected sentence ` +
          `(or a short natural variation of it), replace the word the learner originally got wrong with "___", ` +
          `and give 3 plausible wrong options targeting the same confusion.\n` +
          `Keep sentences short (max 12 words). The answer must be exactly the word removed.\n\n` +
          `Return ONLY this JSON:\n` +
          `{"drills":[{"sentence":"German sentence with ___ for the gap","answer":"the missing word",` +
          `"distractors":["wrong1","wrong2","wrong3"],"rule":"one short English sentence naming the rule"}]}`,
        },
      ], 1200);
      const result = parseJSON(raw);
      const drills = (result && Array.isArray(result.drills) ? result.drills : [])
        .filter(d => d && typeof d.sentence === "string" && d.sentence.includes("___") &&
                     d.answer && Array.isArray(d.distractors) && d.distractors.length >= 2)
        .slice(0, 8)
        .map(d => ({
          sentence: d.sentence.trim(),
          answer: String(d.answer).trim(),
          distractors: d.distractors.slice(0, 3).map(String),
          rule: String(d.rule || ""),
        }));
      if (!drills.length) throw new Error("No usable drills returned");
      return res.json({ drills });
    } catch (err) {
      console.error("[api/chat error-drills]", err.message);
      return res.status(500).json({ error: "Could not build drills from your mistakes right now. Try again." });
    }
  }

  // exam-sprachbausteine - generates a telc B2 Sprachbausteine gap test
  if (mode === "exam-sprachbausteine") {
    // Alignment between the letter and the answer list has to be structural, not
    // trusted: asked for markers [1]..[10] the model routinely writes only 4-5 of
    // them while still returning 10 items, which renders questions that have no
    // gap to answer. So the model marks every gap with a plain "___" (it keeps
    // that count far more reliably) and the server numbers them by position.
    const buildSbTest = (result) => {
      if (!result || typeof result.text !== "string") return null;
      const items = (Array.isArray(result.items) ? result.items : [])
        .filter(it => it && Array.isArray(it.options) && it.options.length >= 2 &&
                      typeof it.answer === "number" && it.answer >= 0 && it.answer < it.options.length);

      const parts = result.text.split("___");
      const gapCount = parts.length - 1;
      // One gap per item, both in reading order. A mismatch means the model lost
      // track, and guessing which item belongs to which gap would mislabel answers.
      if (gapCount !== items.length || gapCount < 8) return null;

      // Number the gaps by position, so they read 1,2,3... down the letter.
      let text = parts[0];
      for (let i = 1; i < parts.length; i++) text += "[" + i + "]" + parts[i];

      return {
        title: result.title || "Formeller Brief",
        text,
        items: items.slice(0, gapCount).map((it, i) => ({
          num: i + 1,
          options: it.options.slice(0, 3).map(String),
          answer: it.answer,
          rule: String(it.rule || ""),
          sentence: String(it.sentence || "").includes("___") ? String(it.sentence) : "",
        })),
      };
    };

    const sbSystem = "You write telc Deutsch B2 'Sprachbausteine Teil 1' practice tests: a formal German letter with exactly 10 grammar gaps. Always return ONLY valid JSON.";
    const sbUser =
      `Write a formal German letter (B2 level, 130-170 words) containing exactly 10 gaps.\n` +
      `Pick a realistic scenario (complaint, inquiry, application, cancellation...).\n` +
      `Each gap tests ONE grammar point: prepositions, conjunctions, pronouns, articles/cases, verb forms, or fixed formal phrases.\n\n` +
      `HOW TO MARK THE GAPS - this is the part that must be exact:\n` +
      `1. Write each gap as three underscores: ___ . Use no other marker, and no numbers.\n` +
      `2. The letter must contain exactly 10 occurrences of ___ . Count them before you answer.\n` +
      `3. Each ___ REPLACES the missing word, so the correct answer must NOT also appear next to it.\n` +
      `   WRONG: "jedoch ___ fehlten zwei Artikel" when the answer is "fehlten".\n` +
      `   RIGHT: "jedoch ___ zwei Artikel".\n` +
      `4. Spread the gaps over the whole letter, not only the opening sentences.\n` +
      `5. Separate paragraphs with a blank line, including after the salutation and before the closing.\n\n` +
      `Then give exactly 10 items, in the SAME ORDER as the gaps appear in the letter.\n` +
      `Each item has 3 options where exactly ONE is correct.\n\n` +
      `Return ONLY this JSON:\n` +
      `{"title":"short letter title","text":"the full letter using ___ for each of the 10 gaps",` +
      `"items":[{"options":["a","b","c"],"answer":0,"rule":"one short English sentence naming the rule",` +
      `"sentence":"the single sentence from the letter containing ___"}]}`;

    try {
      let payload = buildSbTest(parseJSON(await callGroqMessages(
        [{ role: "system", content: sbSystem }, { role: "user", content: sbUser }], 3500)));
      if (!payload) {
        // One stricter retry before the client falls back to the built-in test.
        payload = buildSbTest(parseJSON(await callGroqMessages([
          { role: "system", content: sbSystem },
          { role: "user", content: sbUser +
            `\n\nYour previous attempt was rejected: the number of ___ gaps in the letter did not equal the number of items. ` +
            `Write the letter first, count the ___ occurrences, then write exactly that many items in the same order.` },
        ], 3500)));
      }
      if (!payload) throw new Error("Sprachbausteine generation returned invalid JSON");
      return res.json(payload);
    } catch (err) {
      console.error("[api/chat exam-sb]", err.message);
      return res.status(500).json({ error: "Could not generate a test right now." });
    }
  }

  // exam-write-feedback - grades a telc B2 Schriftlicher Ausdruck letter
  if (mode === "exam-write-feedback") {
    const { task, points } = req.body || {};
    if (!text || !text.trim()) return res.status(400).json({ error: "No letter provided" });
    try {
      const raw = await callGroqMessages([
        { role: "system", content: "You are a strict but fair telc Deutsch B2 examiner grading 'Schriftlicher Ausdruck' (formal letter). Always return ONLY valid JSON." },
        { role: "user", content:
          `The task:\n"${task || "Formal letter"}"\n` +
          `Required content points:\n${(points || []).map((p, i) => `${i + 1}. ${p}`).join("\n")}\n\n` +
          `The learner's letter:\n"""${text}"""\n\n` +
          `Grade it like a telc B2 examiner on these criteria, each scored A (very good), B (acceptable), C (insufficient):\n` +
          `- inhalt: Are all 4 content points addressed appropriately?\n` +
          `- kommunikation: Structure, register (formal!), connectors, letter conventions (greeting, closing)\n` +
          `- korrektheit: Grammar accuracy\n` +
          `- wortschatz: Range and precision of vocabulary\n\n` +
          `Also list up to 5 concrete corrections (their sentence -> corrected) and write a short model letter (B2 level, covers all points, 120-160 words).\n\n` +
          `Return ONLY this JSON:\n` +
          `{"scores":{"inhalt":"A|B|C","kommunikation":"A|B|C","korrektheit":"A|B|C","wortschatz":"A|B|C"},` +
          `"points_covered":[true,false,true,true],` +
          `"overall":"2-3 sentences in English: overall verdict and the single most important thing to improve",` +
          `"corrections":[{"original":"...","corrected":"...","explanation":"short English rule"}],` +
          `"model":"the model letter in German"}`,
        },
      ], 1700);
      const result = parseJSON(raw);
      if (!result || !result.scores) throw new Error("Invalid grading JSON");
      return res.json({
        scores: result.scores,
        points_covered: Array.isArray(result.points_covered) ? result.points_covered.slice(0, 4) : [],
        overall: String(result.overall || ""),
        corrections: (Array.isArray(result.corrections) ? result.corrections : [])
          .filter(c => c && c.original && c.corrected).slice(0, 5),
        model: String(result.model || ""),
      });
    } catch (err) {
      console.error("[api/chat exam-write]", err.message);
      return res.status(500).json({ error: "Could not grade your letter right now." });
    }
  }

  // exam-speak-feedback - grades a telc B2 presentation (Muendliche Pruefung Teil 1)
  if (mode === "exam-speak-feedback") {
    const { topic } = req.body || {};
    if (!text || !text.trim()) return res.status(400).json({ error: "No transcript provided" });
    try {
      const raw = await callGroqMessages([
        { role: "system", content: "You are a telc Deutsch B2 examiner grading the short presentation (Muendliche Pruefung Teil 1). Always return ONLY valid JSON." },
        { role: "user", content:
          `Presentation topic: "${topic || "unknown"}"\n` +
          `Expected structure: introduction, own experiences, situation in their home country, pros/cons + own opinion.\n\n` +
          `Transcript of the learner's presentation:\n"""${text}"""\n\n` +
          `Grade like a telc B2 examiner, each criterion A (very good), B (acceptable), C (insufficient):\n` +
          `- aufgabe: Task fulfillment - did they cover the expected structure and stay on topic?\n` +
          `- fluessigkeit: Flow and length (estimate from transcript - very short = C)\n` +
          `- korrektheit: Grammar accuracy\n` +
          `- ausdruck: Vocabulary range, B2-level structures, connectors\n\n` +
          `Also: up to 4 concrete corrections from their speech, and a model outline of 4-6 German sentences they could have said.\n\n` +
          `Return ONLY this JSON:\n` +
          `{"scores":{"aufgabe":"A|B|C","fluessigkeit":"A|B|C","korrektheit":"A|B|C","ausdruck":"A|B|C"},` +
          `"overall":"2-3 sentences in English: verdict plus the most important improvement",` +
          `"corrections":[{"original":"...","corrected":"...","explanation":"short English rule"}],` +
          `"model":"4-6 German sentences as a model presentation outline"}`,
        },
      ], 1400);
      const result = parseJSON(raw);
      if (!result || !result.scores) throw new Error("Invalid grading JSON");
      return res.json({
        scores: result.scores,
        overall: String(result.overall || ""),
        corrections: (Array.isArray(result.corrections) ? result.corrections : [])
          .filter(c => c && c.original && c.corrected).slice(0, 4),
        model: String(result.model || ""),
      });
    } catch (err) {
      console.error("[api/chat exam-speak]", err.message);
      return res.status(500).json({ error: "Could not grade your presentation right now." });
    }
  }

  // exam-leseverstehen - generates one of the three telc B2 Leseverstehen parts.
  // Teil 1: match 5 short texts to headings (more headings than texts, so guessing
  //         by elimination does not work). Teil 2: one long text, 5 MC questions.
  // Teil 3: match 10 situations to 12 small ads, where some situations have no match.
  if (mode === "exam-leseverstehen") {
    const part = [1, 2, 3].includes(req.body?.part) ? req.body.part : 2;

    // Every part is graded by index, so an option/answer pair that points outside the
    // list would silently mark a right answer wrong. Validate before trusting it.
    const validPick = (it, listLen) =>
      it && typeof it.answer === "number" && it.answer >= 0 && it.answer < listLen;

    const buildLv = (result) => {
      if (!result) return null;

      if (part === 1) {
        const headings = (Array.isArray(result.headings) ? result.headings : []).map(String);
        const texts = (Array.isArray(result.texts) ? result.texts : [])
          .filter(t => t && typeof t.text === "string" && validPick(t, headings.length));
        if (headings.length < 7 || texts.length < 4) return null;
        return {
          part: 1,
          instructions: "Lesen Sie die fünf Texte und die Überschriften. Welche Überschrift passt zu welchem Text?",
          headings,
          texts: texts.slice(0, 5).map((t, i) => ({
            num: i + 1,
            text: String(t.text),
            answer: t.answer,
            rule: String(t.why || ""),
          })),
        };
      }

      if (part === 3) {
        const ads = (Array.isArray(result.ads) ? result.ads : [])
          .filter(a => a && a.title && a.text)
          .map(a => ({ title: String(a.title), text: String(a.text) }));
        // "no matching ad" is a real telc answer, encoded as index === ads.length.
        const situations = (Array.isArray(result.situations) ? result.situations : [])
          .filter(s => s && typeof s.text === "string" &&
                       typeof s.answer === "number" && s.answer >= 0 && s.answer <= ads.length);
        if (ads.length < 8 || situations.length < 6) return null;
        return {
          part: 3,
          instructions: "Lesen Sie die Situationen und die Anzeigen. Welche Anzeige passt zu welcher Situation? Manche Situationen haben keine passende Anzeige.",
          ads,
          situations: situations.slice(0, 10).map((s, i) => ({
            num: i + 1,
            text: String(s.text),
            answer: s.answer,
            rule: String(s.why || ""),
          })),
        };
      }

      const questions = (Array.isArray(result.questions) ? result.questions : [])
        .filter(q => q && q.q && Array.isArray(q.options) && q.options.length >= 2 && validPick(q, q.options.length));
      if (typeof result.text !== "string" || result.text.length < 200 || questions.length < 4) return null;
      return {
        part: 2,
        instructions: "Lesen Sie den Text und beantworten Sie die Fragen. Nur eine Antwort ist richtig.",
        title: String(result.title || "Lesetext"),
        text: result.text,
        questions: questions.slice(0, 5).map((q, i) => ({
          num: i + 1,
          q: String(q.q),
          options: q.options.slice(0, 3).map(String),
          answer: q.answer,
          rule: String(q.why || ""),
        })),
      };
    };

    const lvPrompts = {
      1: `Write a telc Deutsch B2 "Leseverstehen Teil 1" task.\n` +
         `Produce 5 short German texts (55-75 words each) on one broad theme (e.g. Arbeitswelt, Umwelt, Bildung, Gesundheit).\n` +
         `Each text is a distinct angle on the theme so exactly one heading fits it.\n` +
         `Produce 8 German headings: the 5 correct ones plus 3 plausible distractors that fit no text.\n` +
         `Shuffle the headings so the correct ones are not in text order.\n\n` +
         `Return ONLY this JSON:\n` +
         `{"headings":["Überschrift a","..."],` +
         `"texts":[{"text":"the German text","answer":0,"why":"one short English sentence: the phrase in the text that makes this heading fit"}]}\n` +
         `"answer" is the 0-based index into "headings".`,
      2: `Write a telc Deutsch B2 "Leseverstehen Teil 2" task.\n` +
         `Produce ONE German text of 380-450 words: a journalistic article on a current topic (Arbeitswelt, Digitalisierung, Umwelt, Bildung, Gesundheit, Stadtleben...).\n` +
         `B2 register: complex sentences, connectors, some idiomatic vocabulary. Separate paragraphs with a blank line.\n` +
         `Then write 5 comprehension questions in German, each with 3 options and exactly ONE correct answer.\n` +
         `Test comprehension and inference, not word-spotting: the correct option must paraphrase the text rather than repeat its wording.\n` +
         `Ask the questions in the order the information appears in the text.\n\n` +
         `Return ONLY this JSON:\n` +
         `{"title":"German article title","text":"the full article",` +
         `"questions":[{"q":"German question","options":["a","b","c"],"answer":0,"why":"one short English sentence naming the line of the text that proves it"}]}`,
      3: `Write a telc Deutsch B2 "Leseverstehen Teil 3" task.\n` +
         `Produce 12 short German small-ads (Anzeigen) of 20-35 words each, all from one domain (e.g. Kurse, Wohnungen, Dienstleistungen, Freizeit).\n` +
         `Then produce 10 German situations of one sentence each, describing what a person needs.\n` +
         `Exactly 8 situations match one ad each; 2 situations match NO ad - for those set "answer" to 12.\n` +
         `Make the distractor ads close but wrong on one concrete detail (price, time, level, location).\n\n` +
         `Return ONLY this JSON:\n` +
         `{"ads":[{"title":"short ad title","text":"the ad body"}],` +
         `"situations":[{"text":"the German situation","answer":0,"why":"one short English sentence naming the detail that decides it"}]}\n` +
         `"answer" is the 0-based index into "ads", or 12 for "no matching ad".`,
    };

    try {
      const raw = await callGroqMessages([
        { role: "system", content: "You write telc Deutsch B2 Leseverstehen practice tasks. Always return ONLY valid JSON." },
        { role: "user", content: lvPrompts[part] },
      ], 2600);
      const payload = buildLv(parseJSON(raw));
      if (!payload) throw new Error("Leseverstehen generation returned invalid JSON");
      return res.json(payload);
    } catch (err) {
      console.error("[api/chat exam-lv]", err.message);
      return res.status(500).json({ error: "Could not generate a reading task right now." });
    }
  }

  // exam-hoerverstehen - generates a telc B2 Hörverstehen task: a spoken German
  // passage plus richtig/falsch statements. The script is synthesised with the same
  // TTS the rest of the app uses, so the learner hears it instead of reading it.
  if (mode === "exam-hoerverstehen") {
    const part = [1, 2].includes(req.body?.part) ? req.body.part : 2;
    const spec = part === 1
      ? { words: "90-120", count: 5, kind: "five short public announcements or voicemail messages, each 2-3 sentences, separated by a blank line",
          focus: "Globalverstehen: each statement is about the main point of one announcement" }
      : { words: "170-220", count: 8, kind: "one radio interview between a Moderator and one expert guest, written as a flowing dialogue",
          focus: "Detailverstehen: the statements test specific details, numbers, and opinions" };

    try {
      const raw = await callGroqMessages([
        { role: "system", content: "You write telc Deutsch B2 Hörverstehen practice tasks. Always return ONLY valid JSON." },
        { role: "user", content:
          `Write a German listening script of ${spec.words} words: ${spec.kind}.\n` +
          `Natural spoken B2 German on a realistic topic (Arbeit, Umwelt, Gesundheit, Bildung, Stadtleben, Technik).\n` +
          `Write it to be READ ALOUD: no speaker labels like "Moderator:", no stage directions, no bullet points - only the words that are spoken.\n\n` +
          `Then write exactly ${spec.count} German statements about the script (${spec.focus}).\n` +
          `Each statement is RICHTIG or FALSCH. Make about half of them FALSCH.\n` +
          `A FALSCH statement must contradict the script on a concrete point, not just be unmentioned.\n` +
          `Put the statements in the order the information is heard.\n\n` +
          `Return ONLY this JSON:\n` +
          `{"title":"short German title","script":"the full spoken script",` +
          `"items":[{"statement":"German statement","answer":true,"why":"one short English sentence quoting the part of the script that decides it"}]}`,
        },
      ], 2500);
      const result = parseJSON(raw);
      const items = (result && Array.isArray(result.items) ? result.items : [])
        .filter(it => it && typeof it.statement === "string" && typeof it.answer === "boolean")
        .slice(0, spec.count)
        .map((it, i) => ({
          num: i + 1,
          statement: String(it.statement),
          answer: it.answer,
          rule: String(it.why || ""),
        }));
      if (!result || typeof result.script !== "string" || items.length < 4) {
        throw new Error("Hörverstehen generation returned invalid JSON");
      }

      // Audio is the whole point of this task, but a TTS outage should not throw the
      // task away - the client falls back to a "read the script" mode instead.
      const audio_base64 = await callElevenLabs(result.script);
      return res.json({
        part,
        title: String(result.title || "Hörverstehen"),
        script: result.script,
        items,
        audio_base64,
      });
    } catch (err) {
      console.error("[api/chat exam-hv]", err.message);
      return res.status(500).json({ error: "Could not generate a listening task right now." });
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

    // ---- Übersetzer: level-aware translation ----
    // A general translator answers one question: what does this mean? A learner
    // needs two - what a native actually says, and what they themselves could
    // have produced at their current level. The gap between those two IS the
    // lesson, so both come back in one response and the panel shows them together.
    //
    // Direction changes what each field means, but the shape stays the same so
    // the panel renders both without branching:
    //   en_de: primary = German at the target level, native = natural German,
    //          english = the source echoed back.
    //   de_en: primary = the same German simplified to the target level,
    //          native = the original German, english = the real translation.
    if (mode === "translate-level") {
      const level = LEVEL_DESCRIPTIONS[req.body?.level] ? req.body.level : "b1";
      const direction = req.body?.direction === "de_en" ? "de_en" : "en_de";

      // Weaving the learner's own due vocabulary into the output is the part a
      // general translator structurally cannot do. Capped at 40 words because the
      // Groq free tier allows 8000 tokens/minute and max_tokens counts toward it.
      const dueWords = Array.isArray(req.body?.dueWords)
        ? req.body.dueWords.filter(w => typeof w === "string" && w.trim()).slice(0, 40)
        : [];
      const dueCtx = dueWords.length
        ? `\nWords this learner has due for review: ${dueWords.join(", ")}\n` +
          `Use the ones that fit naturally in "primary". Never force one in or bend the meaning to fit it. ` +
          `Report the ones you actually used in "used_due_words".\n`
        : "";

      const taskCtx = direction === "de_en"
        ? `The learner is READING this German and wants to understand it:\n"${text}"\n\n` +
          `- "primary": the same meaning rewritten in German at ${level.toUpperCase()}, so they can read it unaided.\n` +
          `- "native": the original German, unchanged.\n` +
          `- "english": a faithful English translation of the original.\n`
        : `The learner wants to SAY this in German:\n"${text}"\n\n` +
          `- "primary": the German a ${level.toUpperCase()} learner could realistically produce themselves.\n` +
          `- "native": the German a native speaker would actually use here, with no simplification.\n` +
          `- "english": the learner's original English, unchanged.\n`;

      const raw = await callGroq(
        `You are a German tutor writing for one learner at level ${level.toUpperCase()}.\n` +
        `Target level: ${LEVEL_DESCRIPTIONS[level]}\n\n` +
        taskCtx + dueCtx +
        `\nAlso return:\n` +
        `- "difference": one sentence in English naming what the native version does that the ${level.toUpperCase()} version avoids (a tense, a case, a connector, an idiom). If they are identical, say "Same - your level already covers this."\n` +
        `- "grammar_note": one sentence in English naming the single most useful rule at work, e.g. "weil sends the verb to the end" or "mit takes Dativ".\n` +
        `- "words": up to 5 words from the native version worth learning, as {"de":"...","en":"..."}. Give German nouns their article.\n\n` +
        `Return ONLY this JSON, no markdown:\n` +
        `{"primary":"...","native":"...","english":"...","difference":"...","grammar_note":"...","used_due_words":[],"words":[{"de":"...","en":"..."}]}`,
        1, 900
      );
      const parsed = parseJSON(raw);
      if (!parsed || !parsed.primary) {
        return res.status(502).json({ error: "The translator could not produce a level-checked answer. Try shorter text." });
      }
      const primary = String(parsed.primary).trim();
      // Speak the level version - that is the one the learner is meant to reproduce.
      const audio_base64 = await callElevenLabs(primary);
      return res.json({
        primary,
        native: String(parsed.native || primary).trim(),
        english: String(parsed.english || (direction === "en_de" ? text : "")).trim(),
        difference: String(parsed.difference || "").trim(),
        grammar_note: String(parsed.grammar_note || "").trim(),
        used_due_words: Array.isArray(parsed.used_due_words) ? parsed.used_due_words.slice(0, 10) : [],
        words: Array.isArray(parsed.words) ? parsed.words.filter(w => w && w.de).slice(0, 5) : [],
        level,
        direction,
        audio_base64,
      });
    }

    // ---- Übersetzer: grade the learner's own attempt ----
    // The one thing no translator can offer, because it requires withholding the
    // answer first: the learner translates, then gets marked against their level.
    if (mode === "translate-grade") {
      const level = LEVEL_DESCRIPTIONS[req.body?.level] ? req.body.level : "b1";
      const source = String(req.body?.source || "").trim();
      if (!source) return res.status(400).json({ error: "No source text to grade against" });
      const raw = await callGroq(
        `A German learner at level ${level.toUpperCase()} was asked to translate this:\n"${source}"\n\n` +
        `Their attempt:\n"${text}"\n\n` +
        `Target level: ${LEVEL_DESCRIPTIONS[level]}\n` +
        `Judge the attempt against ${level.toUpperCase()}, not against a native speaker. Never mark a correct ${level.toUpperCase()} sentence wrong for being simple.\n` +
        `GERMAN CASE RULES (name the specific one you apply):\n` +
        `- Akkusativ (wen?/was?): masc. der->den, ein->einen. After durch, für, gegen, ohne, um.\n` +
        `- Dativ (wem?): dem/der/dem/den. After mit, aus, bei, nach, seit, von, zu, außer, gegenüber.\n` +
        `- Wechselpräpositionen (an/auf/in/über/unter/vor/neben/hinter/zwischen): Wo?=Dativ, Wohin?=Akkusativ.\n` +
        `- Dative-only verbs: helfen, danken, gefallen, gehören, passen, schmecken, antworten, folgen.\n` +
        `- Verb-second in main clauses; verb-final after weil/dass/wenn/obwohl.\n\n` +
        `Return ONLY this JSON, no markdown:\n` +
        `{"is_correct":true/false,"corrected":"the corrected German, or their sentence unchanged if it was already right","feedback":"one encouraging sentence in English","grammar_note":"one sentence naming the rule they broke, or 'Nothing to fix.'","score":0-100}`,
        1, 700
      );
      const parsed = parseJSON(raw);
      if (!parsed) return res.status(502).json({ error: "Could not grade that attempt. Try again." });
      const corrected = String(parsed.corrected || text).trim();
      const audio_base64 = await callElevenLabs(corrected);
      return res.json({
        is_correct: !!parsed.is_correct,
        corrected,
        original: text,
        feedback: String(parsed.feedback || "").trim(),
        grammar_note: String(parsed.grammar_note || "").trim(),
        score: Math.max(0, Math.min(100, Number(parsed.score) || 0)),
        level,
        audio_base64,
      });
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
          `- If incorrect: name the specific rule that's broken, describe the error pattern, then give ONE short hint (in English) that steers them toward the right form without writing it out\n` +
          `- If incorrect, also copy the exact word or short phrase FROM THEIR ATTEMPT (verbatim, same spelling/casing) that is misplaced or wrong, so it can be highlighted for them\n` +
          `- If incorrect, also write a short DIFFERENT German example sentence (different vocabulary/topic than their attempt) that demonstrates the same grammar pattern correctly. Leave the specific tricky part as "___" so it's a scaffold, not a giveaway - e.g. for a verb-position error: "Heute ___ ich ins Büro. (verb goes here, right after the time word)" - the bracketed note after the example must be in English\n\n` +
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
          `{"is_correct":true/false,"feedback":"1-2 sentences: if correct, name what they got right; if wrong, name the specific rule broken WITHOUT writing the corrected form","error_text":"if correct empty string; if wrong, the exact word/phrase copied verbatim from their attempt that is the problem","hint":"if correct leave empty string; if wrong, one short English tip steering toward the right form without revealing it","example":"if correct empty string; if wrong, a short different German example sentence demonstrating the same pattern with '___' for the tricky part, followed by a short English note in parentheses explaining what goes in the blank and why"}`
        );
        const result = JSON.parse(stripMarkdown(raw));
        return res.json({
          is_correct: result.is_correct,
          feedback: result.feedback,
          error_text: result.error_text || "",
          hint: result.hint,
          example: result.example || "",
        });
      } catch {
        return res.json({ is_correct: false, feedback: "Could not evaluate your answer. Try again.", hint: "" });
      }
    }

    if (mode === "speak-check") {
      const { prompt: scenario } = req.body;
      try {
        const raw = await callGroq(
          `A German learner was given this speaking scenario:\n"${scenario}"\n\n` +
          `They spoke in German and this was transcribed:\n"${text}"\n\n` +
          `Your task — reply ONLY this JSON, no markdown:\n` +
          `{\n` +
          `  "sample": "A corrected, natural German version of what they said. Fix grammar, word order, and phrasing while keeping their ideas and voice. Write as a B1-B2 learner would naturally say it — 2-4 conversational sentences. If the transcript is empty or very short, write a short natural German response to the scenario anyway.",\n` +
          `  "feedback": "1-2 sentences in English: name one specific thing they did well (quote a word or phrase they used), then give one concrete improvement tip."\n` +
          `}`,
          1, 700
        );
        const result = JSON.parse(stripMarkdown(raw));
        return res.json({
          feedback: result.feedback || "Good effort! Keep practicing.",
          sample: result.sample || "",
        });
      } catch {
        return res.json({ feedback: "Great effort speaking! Keep going — fluency comes from repetition.", sample: "" });
      }
    }

    if (mode === "speak-improve") {
      const { prompt: scenario } = req.body;
      try {
        const raw = await callGroq(
          `A German learner was given this speaking scenario:\n"${scenario}"\n\n` +
          `They said (transcribed):\n"${text}"\n\n` +
          `Your task:\n` +
          `1. Write a natural, complete German response to the scenario that a B1-B2 learner could realistically say. Keep it conversational, not textbook-perfect.\n` +
          `2. Give 2-3 short notes (one sentence each) explaining what you changed or added vs the learner's attempt. Be specific: name the phrase or structure. Use bold for the key phrase in each note.\n` +
          `3. Identify up to 2 short phrases from the improved version that would be useful as standalone conversation starters. For each, give the German phrase, its English meaning, and the CEFR level (a1/a2/b1/b2).\n\n` +
          `Reply with ONLY this JSON, no markdown fences:\n` +
          `{"improved":"the full natural German response","notes":["note 1","note 2","note 3"],"new_phrases":[{"german":"...","english":"...","level":"b1"},{"german":"...","english":"...","level":"a2"}]}`
        );
        const result = JSON.parse(stripMarkdown(raw));
        return res.json({
          improved: result.improved,
          notes: result.notes || [],
          new_phrases: result.new_phrases || [],
        });
      } catch {
        return res.json({ improved: text, notes: [], new_phrases: [] });
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
      const raw = await callGroqMessages(messages, 800);
      const parsed = parseJSON(raw);
      const reply = parsed?.reply || raw;
      const correction = parsed?.correction || null;
      const needs_repetition = parsed?.needs_repetition || false;
      const audio_base64 = await callElevenLabs(reply);
      return res.json({ reply, correction, needs_repetition, audio_base64 });
    }

    if (mode === "game-word-info") {
      const { wordData } = req.body;
      if (!wordData) return res.status(400).json({ error: "No wordData" });
      try {
        const articlePart = wordData.article ? `${wordData.article} ` : "";
        const raw = await callGroq(
          `You are a German language expert. Return ONLY valid JSON (no markdown, no code fences):\n` +
          `{\n` +
          `  "article": "${wordData.article || ""}",\n` +
          `  "plural": null,\n` +
          `  "forms": "",\n` +
          `  "example": "",\n` +
          `  "example_en": "",\n` +
          `  "tip": ""\n` +
          `}\n\n` +
          `Fill in the fields for this German word:\n` +
          `Word: ${articlePart}${wordData.german} — ${wordData.english} (${wordData.pos})\n` +
          `- article: correct article (der/die/das), or empty string for verbs/adj\n` +
          `- plural: for nouns the plural form like "die Arbeiten", for others null\n` +
          `- forms: for nouns the Genitiv singular; for verbs "ich/du/er" Präsens; for adj the comparative; for others leave empty\n` +
          `- example: one natural B1 German sentence using this word\n` +
          `- example_en: English translation of that sentence\n` +
          `- tip: one short memory tip or usage note, max 12 words`
        );
        let result;
        try { result = JSON.parse(stripMarkdown(raw)); } catch { result = {}; }
        return res.json({
          article:    result.article    || wordData.article || "",
          plural:     result.plural     || null,
          forms:      result.forms      || "",
          example:    result.example    || (wordData.example_de || "").replace(/<[^>]+>/g, ""),
          example_en: result.example_en || wordData.example_en || "",
          tip:        result.tip        || "",
        });
      } catch {
        return res.json({
          article: wordData.article || "", plural: null, forms: "",
          example: (wordData.example_de || "").replace(/<[^>]+>/g, ""),
          example_en: wordData.example_en || "", tip: "",
        });
      }
    }

    if (mode === "talkbox-feedback") {
      const { prompt: cardPrompt, category } = req.body;
      try {
        const raw = await callGroq(
          `A German learner was given this speaking prompt (category: ${category || "general"}):\n"${cardPrompt}"\n\n` +
          `They responded in German (transcript):\n"${text}"\n\n` +
          `Your task — reply ONLY this JSON, no markdown:\n` +
          `{\n` +
          `  "sample": "A model German response to the prompt — natural, complete, B1-B2 level, 2-4 sentences. Build on any good phrases from their attempt but fix errors and fill gaps. Write as a real person would answer, not a textbook.",\n` +
          `  "feedback": "One encouraging sentence in English naming something specific they did well or attempted.",\n` +
          `  "grammar_tip": "One very short grammar observation in English — max 10 words.",\n` +
          `  "vocab_note": "One vocabulary tip in English — a word they used well or a useful alternative — max 12 words."\n` +
          `}`,
          1, 700
        );
        const result = JSON.parse(stripMarkdown(raw));
        return res.json({
          feedback: result.feedback || "Good effort — keep speaking!",
          sample: result.sample || "",
          grammar_tip: result.grammar_tip || "",
          vocab_note: result.vocab_note || "",
        });
      } catch {
        return res.json({
          feedback: "Great effort speaking in German! Consistency is key — keep going.",
          sample: "",
          grammar_tip: "",
          vocab_note: "",
        });
      }
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
