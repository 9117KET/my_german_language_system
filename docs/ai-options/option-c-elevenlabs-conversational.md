# Option C - ElevenLabs Conversational AI (Agents)

**Status:** Future upgrade path (not yet implemented)
**Trigger:** Consider if you want custom voice cloning for teacher personalities, or if you want to reduce maintenance burden and don't mind less personality customization.

---

## What It Is

ElevenLabs' managed conversational AI platform. They bundle STT + LLM + their high-quality TTS into one service. You configure an "Agent" via their dashboard or API, then embed it in your app via WebSocket.

Main advantage over Option A: their TTS is world-class (ElevenLabs built their reputation on voice quality), and you can clone a custom voice for each teacher personality (e.g., a warm grandmother voice for Caring mode, a sharp Berlin accent for Blunt mode).

---

## Cost (personal daily use, ~30 min/day)

- ~$0.07-0.10/min x 30 min = ~$2.10-3.00/day
- **~$60-90/month**
- Pricing is credit-based (1 credit = 1 character of TTS output roughly)
- Conversational AI billed per minute of conversation
- Current pricing: https://elevenlabs.io/pricing
- Conversational AI FAQ: https://help.elevenlabs.io/hc/en-us/articles/29298065878929

---

## Latency

- Sub-second (they co-locate STT, LLM, and TTS services)
- Approximately 800ms-1s in practice
- Better than Option A (~1.0-1.5s), worse than Option B (~600ms)

---

## How It Works Technically

```
Browser mic
  -> ElevenLabs Conversational AI WebSocket
  -> Their managed STT pipeline
  -> Their LLM backend (GPT-4 or Claude, configurable)
  -> Their TTS (ElevenLabs quality)
  -> Audio streams back to browser
```

They handle all VAD and turn-taking internally. You don't control the details.

---

## What You Gain vs Option A

- **Custom voice cloning:** Record 1-3 minutes of a target voice, clone it, use it as the teacher voice. Could have distinctly different voices for each personality mode.
- **Simpler maintenance:** No Deepgram proxy to maintain, no streaming audio pipeline.
- **Voice expressiveness:** ElevenLabs TTS is notably more expressive than other providers.

---

## What You Lose vs Option A

- **Personality depth:** System prompts go through their abstraction layer. Less fine-grained control than directly prompting Groq.
- **LLM choice:** Locked to their supported LLM backends. Can't use Groq's speed advantage.
- **Transparency:** VAD behavior, turn-taking, and interruption handling are all managed internally - harder to debug or tune.
- **Cost:** 3-4x more expensive than Option A.

---

## Implementation Outline

### 1. Create an Agent via ElevenLabs dashboard

Go to https://elevenlabs.io/app/conversational-ai and create an Agent:
- Set language to German
- Set system prompt (teacher personality)
- Select voice (or clone a custom one)
- Note the `agent_id`

Or create programmatically:
```javascript
// api/create-agent.js (one-time setup)
const agent = await fetch("https://api.elevenlabs.io/v1/convai/agents/create", {
  method: "POST",
  headers: {
    "xi-api-key": process.env.ELEVENLABS_API_KEY,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "German Teacher - Caring",
    conversation_config: {
      agent: {
        prompt: { prompt: TEACHER_PERSONALITIES.caring },
        language: "de"
      },
      tts: { voice_id: "your-cloned-voice-id" }
    }
  })
});
```

For 4 personality modes, create 4 agents (one per personality). Switch agents when user changes mode.

### 2. Browser connection

Use their JavaScript SDK:
```bash
npm install @11labs/client
```

```javascript
import { Conversation } from '@11labs/client';

const conversation = await Conversation.startSession({
  agentId: AGENT_IDS[teacherMode],
  onMessage: ({ message, source }) => {
    // message = transcript text
    // source = "user" or "ai"
    appendChatBubble(message, source);
  },
  onError: (error) => console.error(error),
});

// Stop
await conversation.endSession();
```

No WebSocket management needed - the SDK handles everything.

### 3. Teacher personality with 4 agents

```javascript
const AGENT_IDS = {
  caring:   "agent_id_caring",    // from ElevenLabs dashboard
  strict:   "agent_id_strict",
  blunt:    "agent_id_blunt",
  socratic: "agent_id_socratic"
};
```

When user switches personality, end current session and start a new one with the correct agent ID.

---

## Voice Cloning for Teacher Personalities

One unique feature: you can record sample audio for each personality and clone a distinct voice.

Example voices to clone:
- **Caring:** Record warm, slow, grandmotherly German speech (~3 min)
- **Strict:** Record crisp, authoritative German speech
- **Blunt:** Record fast, colloquial Berlin-accent German
- **Socratic:** Record thoughtful, questioning German speech

Steps:
1. Go to https://elevenlabs.io/app/voice-lab
2. Click "Add a Generative or Cloned Voice"
3. Upload recordings
4. Use the cloned voice ID in your agent config

---

## Useful Resources

- ElevenLabs Conversational AI: https://elevenlabs.io/conversational-ai
- JavaScript SDK: https://github.com/elevenlabs/elevenlabs-js
- Agent API reference: https://elevenlabs.io/docs/conversational-ai/api-reference
- Voice cloning guide: https://elevenlabs.io/docs/voices/voice-lab/instant-voice-cloning
- Pricing: https://elevenlabs.io/pricing
