# German Language Learning System

Built on Mikel's 3-step polyglot method: Language Islands → Listening → Active Recall.

---

## Quick Setup

```bash
# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Install ffmpeg (needed for playlist export)
winget install ffmpeg

# 3. Copy .env.example -> .env and fill in your keys
copy .env.example .env

# 4. Generate all 70 audio files
python scripts/generate_audio.py

# 5. Open index.html in your browser or phone
```

### Getting your ElevenLabs API key
1. Sign up at elevenlabs.io (free tier = 10,000 chars/month)
2. Go to Profile -> API Key
3. Paste it in `.env` as `ELEVENLABS_API_KEY`

### Choosing a German voice
The default voice ID is Daniel (a native German speaker in ElevenLabs).
To change it: go to elevenlabs.io -> Voices -> filter "German" -> copy the Voice ID -> paste in `.env` as `ELEVENLABS_VOICE_ID`.

---

## Daily Routine (Mikel's 30-minute system)

| Time | Activity | Tool |
|------|----------|------|
| Morning (while getting ready) | Playlist on speaker, shadow each phrase aloud | `playlists/all.mp3` on phone |
| Commute | Earbuds, phrases on loop | Phone playlist |
| Lunch (10-15 min) | Active recall session | Web player - Recall mode |
| Evening commute | Audio + try speaking phrases aloud | Phone playlist |
| Before bed (20-30 min) | Active recall - sleep consolidates it | Web player - Recall mode |
| Any time a new phrase comes up | Add it immediately | `add_phrase.py` |
| Weekly | Export fresh playlist with new phrases | `export_playlist.py` |

---

## The Three Player Modes

Open `index.html` in your browser (works on phone via OneDrive link).

**Listen** - Audio plays automatically, German + English both shown. Use for passive absorption during commute.

**Shadow** - Audio plays, English is hidden. Listen, then tap the card to reveal translation. Repeat the phrase aloud to build muscle memory.

**Recall** - English shown only. Try to say the German aloud from memory, then tap the card to reveal + hear the audio. Tap "Got it" or "Missed". Phrases you miss appear more often automatically.

---

## Adding New Phrases

When a new phrase comes up at Hirschsprach Café or IQ Lingua:

```bash
python scripts/add_phrase.py \
  --german "Das ist mir egal." \
  --english "I don't care about that." \
  --category hirschsprach_cafe
```

Categories:
- `morning_routine`
- `job_search`
- `german_class`
- `hirschsprach_cafe`
- `describe_surroundings`
- `inner_thoughts`
- `daily_life`

---

## Bulk Import (Mikel's sentence-capture method)

For 2-3 days, narrate your entire life in English. Use your phone's speech-to-text to capture it. Then:

```bash
# 1. Paste all captured text into import_me.txt
# 2. Run:
python scripts/bulk_import.py --file import_me.txt --category morning_routine
```

Claude translates everything to natural German, adds it to `phrases.csv`, and generates audio automatically.

---

## Exporting Phone Playlists

```bash
# Full playlist (all phrases, listen mode)
python scripts/export_playlist.py

# One Language Island
python scripts/export_playlist.py --category hirschsprach_cafe

# Shadow mode playlist (phrase plays, 4s gap to repeat, plays again)
python scripts/export_playlist.py --mode shadow

# Shuffled
python scripts/export_playlist.py --shuffle
```

Output goes to `playlists/` folder. Sync via OneDrive to your phone and play in any music app.

---

## Keyboard Shortcuts (desktop)

| Key | Action |
|-----|--------|
| Space / Right arrow | Next phrase |
| Left arrow | Previous phrase |
| P | Play/Pause |
| R | Reveal (tap card) |
| G | Got it (recall mode) |
| M | Missed (recall mode) |

---

## Bonus: Pre-input Comprehension

Before watching any German YouTube video or podcast:
1. Get the transcript (YouTube: three-dot menu -> Show transcript)
2. Paste it into `import_me.txt`
3. Run `bulk_import.py` to add unknown sentences to your bank
4. Watch the video - you'll understand 70-90% instead of 10%

---

## Progress Timeline (Mikel's system)

- Week 1: Everything hard, can't recall much. Normal - keep going.
- Week 2: 20-30% recall without checking. Ear adjusting.
- Week 3: Patterns clicking, sentences coming faster.
- Week 4: Basic conversations possible on your practiced topics.
- Week 6: Genuinely conversational. Still making mistakes, but communicating.
