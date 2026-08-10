# Tutor Mode — Live AI Teacher (Design Doc)

**Status: NOT BUILT — future feature.** Researched and designed 2026-07-10. This doc captures the full proposal, market/API research, and codebase-specific integration plan so implementation can start cold from this file.

---

## 1. The idea in one paragraph

A **live, voice-first AI German tutor** inside this app, built on the **Gemini Live API** (the same technology behind Google AI Studio's screen-share stream mode, but as a developer API we control). Unlike AI Studio or commercial tutor apps, our tutor is **grounded in the learner's own data**: it reads `wordsSRS` (due/lapsing words), `errorLog` (recurring grammar mistakes), and the drill mistake bank *before* the session, steers the conversation to attack exactly those weaknesses, and *after* the session writes new vocabulary, mistakes, and XP back into the system — so today's conversation shapes tomorrow's Today session, and vice versa. Optional screen share lets the tutor teach directly from the official telc B2 course book, replicating the €700/month Zoom lessons on the learner's own schedule.

**The moat:** the closed loop *conversation ⇄ SRS/errorLog*. No third-party app has your learner state; AI Studio forgets everything when the tab closes.

---

## 2. Why this and not alternatives (research, July 2026)

### Existing commercial tutors
- **Langua** (~$24/mo) — best conversation depth + ElevenLabs voices; no book integration, no exportable SRS/error state. https://languatalk.com/blog/whats-the-best-ai-for-language-learning/
- **TalkPal, Praktika (~$8/mo), Speak (~$20/mo)** — roleplay/curriculum focused, beginner-leaning, closed data. https://www.lingualive.ai/blog/best-ai-language-tutor-2026
- None target telc B2 with the learner's own error history. None can read the official course book with you.

### Google AI Studio (current workaround)
Free, screen share works great — but: zero memory between sessions, no tools/persistence, no curriculum, can't write to our SRS. It's a demo surface, not a tutor.

### Voice API choice
| | Gemini Live API | OpenAI Realtime (gpt-realtime) |
|---|---|---|
| Audio + **video/screen frames** simultaneously | ✅ (frames up to 1 FPS) | ❌ (audio only) |
| Price (audio) | ~$3/1M in, $12/1M out tokens → **~$0.002–0.01/min** | $32/1M in, $64/1M out → **$0.18–0.46/min uncached** |
| ~30 min/day for a month | **single-digit €/month** | ~€100+/month |
| Languages / German | 70 languages, native-audio voices | good German |
| Barge-in, tool calling, transcription | ✅ all | ✅ all |
| Status | GA on Vertex (I/O 2026); preview models on AI Studio API | GA |

**Decision: Gemini Live API** for the realtime layer. Screen-share support + ~50× lower cost is decisive. (OpenAI Realtime remains documented as `docs/ai-options/option-b-openai-realtime.md` for the non-tutor AI tab.)

Sources: https://ai.google.dev/gemini-api/docs/live-api · https://ai.google.dev/gemini-api/docs/pricing · https://byteiota.com/gemini-live-api-production-vertex-ai/ · https://hackernoon.com/openai-realtime-api-pricing-in-2026-real-world-data-from-4000-measured-sessions

### Relationship to the existing AI tab (Option A)
The AI conversation tab (Deepgram STT + Groq + ElevenLabs TTS, ~1–1.5 s latency, turn-based) stays as-is — it's cheap and good for structured correction drills. Tutor Mode is a **new tab** for continuous, interruptible, screen-aware lessons. Think: AI tab = practice partner; Tutor tab = teacher.

---

## 3. Architecture

```
Browser (Tutor tab)                        Vercel serverless              Google
┌──────────────────────────┐              ┌────────────────────┐
│ mic (getUserMedia)       │── POST ────▶ │ api/gemini-token.js│──▶ mint ephemeral token
│ screen (getDisplayMedia) │◀─ token ──── │ (GEMINI_API_KEY)   │    (v1alpha auth_tokens)
│                          │              └────────────────────┘
│ WebSocket ◀──────────────┼────────────────────────────────────▶ Live API (BidiGenerateContent)
│  ├─ PCM16 16 kHz up      │
│  ├─ PCM16 24 kHz down    │
│  ├─ 1 fps JPEG frames up │  (screen-share mode)
│  └─ toolCall ⇄ toolResponse — executed LOCALLY against app state
│
│ localStorage state: wordsSRS, errorLog, drill mistake bank, xpState
│ post-session: POST api/chat.js mode:"tutor-report" (Groq text pass over transcript)
└──────────────────────────┘
```

### 3.1 Token endpoint — `api/gemini-token.js`
Clone the pattern of `api/deepgram-token.js` (short-lived key minted server-side, real key never ships to browser):

- Env var: `GEMINI_API_KEY` (Vercel project **my-german-language-system** — note: repo was once linked to a stale Vercel project).
- Endpoint mints an **ephemeral token** via the `v1alpha` auth-tokens provisioning service with a config like:

```json
{
  "config": {
    "uses": 1,
    "expireTime": "<now + 30 min>",
    "newSessionExpireTime": "<now + 2 min>",
    "liveConnectConstraints": {
      "model": "<live model, see 3.2>",
      "config": { "sessionResumption": {}, "responseModalities": ["AUDIO"] }
    }
  }
}
```

- Browser connects with the token in an `access_token` query param (or `Authorization: Token <token>` header):
  `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?access_token=...`
- Locking `liveConnectConstraints` server-side prevents a leaked token being reused with a different/expensive model.

> ⚠️ **Verify at build time** (docs move fast): exact REST path for token creation, current model IDs, and full setup-message schema. Authoritative pages: https://ai.google.dev/gemini-api/docs/ephemeral-tokens and https://ai.google.dev/gemini-api/docs/live-api (WebSocket reference + tools + session management subpages).

### 3.2 Model
As of mid-2026: `gemini-3.1-flash-live-preview` (per ephemeral-token docs) or the GA native-audio model (`gemini-2.5-flash-native-audio` family on Vertex). Pick the newest **native-audio** Live model available on the AI Studio (generativelanguage) API at build time — native audio gives the natural voice + affective dialog.

### 3.3 Audio plumbing (browser)
- **Up:** `getUserMedia` → `AudioWorklet` → downsample to **16 kHz mono PCM16 little-endian** → base64 chunks in `realtimeInput.audio` messages (`mimeType: "audio/pcm;rate=16000"`).
- **Down:** server sends **24 kHz PCM16** in `serverContent.modelTurn.parts[].inlineData` → queue into Web Audio (`AudioBufferSourceNode` chain). On `serverContent.interrupted` (barge-in), flush the playback queue immediately.
- **Screen share (Phase 2):** `getDisplayMedia` → draw video to canvas → JPEG at ~1 fps, ~768px wide → send as `realtimeInput` media chunks. Also support a one-shot "photograph the book page" upload for higher fidelity than 1 fps streaming.
- Enable `inputAudioTranscription` + `outputAudioTranscription` in setup so we get text transcripts of both sides — needed for the session log, on-screen captions, and the post-session report.

### 3.4 Tools — where the product lives
Declared in the Live `setup` message; executed **locally in the browser** against the same state everything else uses. On `toolCall` → run function → reply with `toolResponse.functionResponses` (echo the call `id`).

| Tool | Maps to existing code (app.js) | Notes |
|---|---|---|
| `get_learner_profile()` | level (B2), telc goal, `getGlobalStreak()`, XP level | Called once at session start via system-prompt instruction |
| `get_due_words(limit)` | `wordsSRS` records (due first, then lapsing) | Give German + English + last-seen |
| `get_recent_errors(limit)` | `errorLog` (localStorage) | The tutor steers conversation to re-elicit these structures |
| `get_drill_mistakes()` | `getDrillMistakeBank()` | |
| `log_error(original, corrected, explanation)` | `logError("tutor", ...)` | **Convention: every new correction path must call logError** |
| `add_word_to_srs(german, english, article, pos)` | same shape as word-search save path (`wordsSRS[key] = {...}`) | |
| `award_xp(amount, label)` | `awardXP(n, "Tutor")` | **Convention: every grading path calls awardXP**; cap per session |
| `end_session_summary(text)` | stores summary for the report card | Tutor calls this when wrapping up |

Post-session, also call the `today*` hooks if a Tutor step is ever added to the guided Today session (see `todayOnSpeakDone()` as the model).

### 3.5 System prompt
Reuse the persona machinery from `api/chat.js`: `TEACHER_PERSONALITIES` (caring/strict/blunt/socratic), `LEVEL_DESCRIPTIONS.b2`, and the CASE RULES block. Add tutor-specific framing:
- Speak German at B2, explain in German first, English on request.
- Open every session by calling `get_recent_errors` + `get_due_words`; weave ≥5 due words into the conversation and engineer situations that force the learner to produce previously-wrong structures.
- Correct with the specific rule named (same style as existing prompts), then make the learner repeat the corrected form.
- When screen share is active: read the visible exercise, work through it item by item, never just give answers — elicit first.
- Call `log_error` for every correction and `add_word_to_srs` for every new word the learner asks about.

### 3.6 Post-session report (text-model pass)
Voice models correct well inline but shallowly. After the session, send the full transcript to a **new mode in `api/chat.js`** (e.g. `mode: "tutor-report"`, same Groq pattern as `error-profile`): returns graded feedback (reuse the telc A/B/C criteria style from `exam-speak-feedback`), a corrections list (each fed to `logError`), new-vocab list, and 3 focus points for next session. Persist per-session reports (localStorage + existing `/api/sync` blob) so the tutor's `get_learner_profile` can reference "last session we worked on X".

### 3.7 Session limits & resumption
Live API sessions have connection-time limits (historically ~10–15 min audio, less with video; GA raised/changed these). Enable `sessionResumption` in setup, store the resumption handle from server messages, and auto-reconnect transparently. Also handle `goAway` warnings. Verify current limits at build time (session-management doc under the Live API section).

---

## 4. UI integration (codebase-specific)

New tab `data-mode="tutor"`:

1. **index.html** — add `.tab[data-mode="tutor"]` in `#mode-tabs` + a `#tutor-panel` section. Panel: teacher-personality picker (reuse `.teacher-btn` styles), big start/stop call button, live captions area (both transcripts), screen-share toggle, session timer, post-session report card view.
2. **app.js tab click handler** (`setupEvents()`, the `tabEls.forEach` block) — add `else if (newMode === "tutor") { mode = "tutor"; showTutorPanel(); }` and hide `#tutor-panel` at the top alongside today/stories/exam. **Leaving the tab must hard-stop the WebSocket + mic/screen tracks** (money + privacy).
3. **Panel-hiding arrays** — `showTodayPanel()`, and the two other functions with the `["progress-panel", ..., "exam-panel"]` arrays: add `"tutor-panel"`. `showTutorPanel()` itself mimics `showTodayPanel()` (hide `controls-bar`, `playerEls`, recall els, `aiPanel`, all listed panels).
4. **Mobile nav** — tabs not in `MORE_SHEET_GROUPS` are invisible on mobile. Add `"tutor"` to the `Conversation` group (or make it a `MOBILE_PRIMARY_MODES` entry replacing one of the four if it proves central).
5. **XP/streak** — session minutes → XP via `awardXP` (e.g. 2 XP/min, capped), so Tutor Mode feeds the global streak/level system like every other feature.
6. **Sync** — tutor session reports ride the existing `/api/sync` Vercel Blob payload.

---

## 5. Phased build plan

**Phase 1 — Grounded voice tutor (MVP, ~the differentiator)**
- `api/gemini-token.js` + Tutor tab + WebSocket client + audio up/down + barge-in.
- Tools: `get_due_words`, `get_recent_errors`, `log_error`, `add_word_to_srs`, `award_xp`.
- Live captions from transcriptions. Hard stop on tab switch.
- ✅ Done when: a 10-min German conversation that (a) used ≥5 due words, (b) re-tested a past mistake, (c) wrote ≥1 new error into errorLog visible in the Drills mistake bank afterwards.

**Phase 2 — Screen/book mode**
- `getDisplayMedia` frames at 1 fps + one-shot page photo upload.
- Prompt addition for exercise walkthroughs.
- ✅ Done when: tutor can read a course-book exercise off the shared screen and run through it item by item.

**Phase 3 — Lesson engine + report cards**
- `mode: "tutor-report"` in api/chat.js; per-session report persisted + synced; report card UI.
- Structured session types mirroring telc B2 oral exam parts (Präsentation, Diskussion, Planung) and "missed class recovery" (feed it the unit you missed).
- Session resumption for 30+ min lessons.
- ✅ Done when: after each session a graded report exists and the *next* session's tutor references it.

**Phase 4 — Productize (sell it)**
- Accounts, per-user state (replace single-blob sync), usage metering/billing (Gemini cost is cents/user/day), landing page with your own B2 pass as the case study.

---

## 6. Costs (order of magnitude)

- Gemini Live audio: ~$0.002–0.01/min → 30 min/day ≈ **€1–5/month**. Screen frames add image tokens; still low single digits.
- Groq report pass: free tier covers it (existing usage pattern).
- Compare: current course €700/month; Langua €24/month.

## 7. Risks / open questions

- **Doc drift**: model names, token-endpoint path, and message schemas must be re-verified against ai.google.dev at build time (flagged inline above).
- **Session caps** with video may force the "photo the page" flow over continuous screen share.
- **Correction quality**: voice model inline corrections < human teacher on register/style — mitigated by the Phase 3 text-pass report; if insufficient, run a parallel low-frequency text-model "listener" on the live transcript.
- **Safari/iOS**: AudioWorklet + `getDisplayMedia` support is weaker; MVP targets desktop Chrome (where the Zoom-lesson replacement happens anyway).
- **API key exposure**: ephemeral tokens + server-side `liveConnectConstraints` lock; never ship `GEMINI_API_KEY` to the client.
- **Vercel**: token endpoint is a plain fetch, fits the existing `api/*.js` 30 s maxDuration config; the WebSocket goes browser↔Google directly, so no Vercel streaming limits apply.
