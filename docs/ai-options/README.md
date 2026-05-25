# AI Conversation Partner - Option Reference

This folder documents the three approaches researched for building the real-time German conversation partner. **Option A is currently implemented.** Options B and C are here for future reference if you want to upgrade.

---

## Quick Comparison

| | Option A (Current) | Option B | Option C |
|---|---|---|---|
| **Stack** | Deepgram + Groq + ElevenLabs | OpenAI Realtime API | ElevenLabs Conversational AI |
| **Monthly cost** | ~$18-20 | ~$100-135 | ~$60-90 |
| **Latency** | ~1.0-1.5s | ~600ms | ~800ms-1s |
| **VAD** | Deepgram endpoint detection | Semantic (best - won't cut mid-thought) | Managed (unknown) |
| **Voice quality** | ElevenLabs (excellent) | OpenAI (good) | ElevenLabs (excellent) |
| **Teacher personality control** | Full | Full | Limited |
| **Build complexity** | Medium | Medium | Low |
| **Real reference** | - | Praktika AI uses this | - |

---

## When to upgrade

**Upgrade to Option B** if:
- The 1-1.5s latency feels unnatural after regular use
- You find yourself getting cut off mid-sentence while pausing to think
- You start using the app 45+ min/day (experience matters more than cost at that point)

**Upgrade to Option C** if:
- You want to experiment with custom voice cloning for teacher personalities
- You want the lowest-effort maintenance path
- Option A becomes unreliable for some reason

---

## Files in this folder

- `option-b-openai-realtime.md` - Full technical reference for OpenAI Realtime API upgrade
- `option-c-elevenlabs-conversational.md` - Full technical reference for ElevenLabs Agents upgrade
