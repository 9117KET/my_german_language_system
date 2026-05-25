# Option B - OpenAI Realtime API

**Status:** Future upgrade path (not yet implemented)
**Trigger:** Upgrade when 1-1.5s latency of Option A feels unnatural, or when Deepgram VAD cuts you off mid-sentence too often.

---

## What It Is

A single WebSocket connection that handles STT + LLM + TTS all in one pipeline. The same technology used by **Praktika AI** (confirmed by OpenAI case study: https://openai.com/index/praktika/).

The key advantage over Option A is **semantic VAD** - the model itself understands conversational context and knows when you've truly finished a thought, not just paused mid-sentence. For example: "Wie heißt..." with a 2-second pause = incomplete question, so it waits. Energy-based VAD (Option A) would fire after 1 second of silence regardless.

---

## Cost (personal daily use, ~30 min/day)

- Audio input: $0.06/min x ~15 min = $0.90/day
- Audio output: $0.24/min x ~15 min = $3.60/day
- **~$4.50/day → ~$100-135/month**

Cached audio (repeated phrases, system prompt audio) is ~50% cheaper. Practical cost closer to $80-100/month.

Current pricing page: https://openai.com/api/pricing/

---

## Latency

- First AI audio response: ~600ms after user finishes speaking
- Subsequent turns: ~400-600ms
- Feels like a real conversation (human response time is 200-1500ms)

---

## How It Works Technically

Single persistent WebSocket (browser -> Vercel proxy -> OpenAI):

```
Browser mic (PCM16 audio) 
  -> base64 chunks via input_audio_buffer.append events
  -> OpenAI processes in real-time
  -> response.audio.delta events stream audio back
  -> Browser plays audio chunks as they arrive
```

**Key events:**
- `input_audio_buffer.append` - send mic audio
- `response.audio.delta` - receive AI speech audio
- `response.audio_transcript.delta` - receive AI text
- `input_audio_buffer.speech_started` - VAD detected user speaking
- `input_audio_buffer.speech_stopped` - VAD detected user stopped

**VAD config:**
```javascript
{
  turn_detection: {
    type: "semantic_vad",      // or "server_vad" for energy-based
    eagerness: "balanced",     // "low" = waits longer, "high" = responds faster
    create_response: true,     // auto-respond when turn ends
    interrupt_response: true   // user can barge in
  }
}
```

---

## What Needs to Change vs Option A

| Component | Option A | Option B |
|---|---|---|
| STT | Deepgram WebSocket proxy | Removed - OpenAI handles |
| LLM | Groq via `/api/chat` | Removed - OpenAI handles |
| TTS | ElevenLabs streaming | Removed - OpenAI handles |
| Server proxy | `api/deepgram-proxy.js` | New `api/realtime-proxy.js` |
| Client audio | MediaRecorder -> WebSocket | Same pattern |
| Voice quality | ElevenLabs (excellent) | OpenAI built-in (good, not as expressive) |

**Teacher personality modes** still work the same way - system prompt controls personality. The system prompt is set once when the WebSocket session starts.

---

## Implementation Outline

### Server: `api/realtime-proxy.js`

Vercel does not natively support persistent WebSocket upgrades in standard serverless functions. Options:
1. Use Vercel Edge Functions (supports WebSocket via `upgrade` header)
2. Use a small Node.js server on Railway/Fly.io as the WebSocket proxy
3. Use OpenAI's client library directly in the browser with a short-lived session token (preferred for simplicity)

**Recommended approach - ephemeral session tokens:**
```javascript
// api/realtime-session.js (serverless, no WebSocket needed)
// Client calls this to get a short-lived token, then connects to OpenAI directly
const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
  method: "POST",
  headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
  body: JSON.stringify({
    model: "gpt-4o-realtime-preview",
    voice: "alloy",
    instructions: buildSystemPrompt(teacherMode, scenario)
  })
});
const { client_secret } = await response.json();
// Return client_secret.value to browser - valid for 60 seconds
```

Browser then connects directly to OpenAI Realtime using the ephemeral token. No persistent proxy needed.

### Client: `app.js` changes

Replace the Deepgram WebSocket section with:
```javascript
// 1. Fetch ephemeral token from your server
const { token } = await fetch('/api/realtime-session').then(r => r.json());

// 2. Connect directly to OpenAI Realtime
const pc = new RTCPeerConnection();
const audioEl = document.createElement('audio');
pc.ontrack = e => { audioEl.srcObject = e.streams[0]; audioEl.play(); };

// Add mic track
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
pc.addTrack(stream.getTracks()[0]);

// Data channel for events
const dc = pc.createDataChannel('oai-events');
dc.onmessage = e => handleRealtimeEvent(JSON.parse(e.data));

// WebRTC offer/answer with OpenAI
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);
const answer = await fetch("https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/sdp"
  },
  body: offer.sdp
}).then(r => r.text());
await pc.setRemoteDescription({ type: "answer", sdp: answer });
```

Note: OpenAI Realtime supports both WebSocket and WebRTC. WebRTC is simpler for browser-native integration.

---

## Useful Resources

- OpenAI Realtime API overview: https://platform.openai.com/docs/guides/realtime
- Realtime API reference: https://platform.openai.com/docs/api-reference/realtime
- WebRTC integration guide: https://platform.openai.com/docs/guides/realtime-webrtc
- Praktika AI case study: https://openai.com/index/praktika/
- Latency deep dive: https://openai.com/index/delivering-low-latency-voice-ai-at-scale/
