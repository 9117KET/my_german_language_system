import csv
import json
import os
import re
import sys
from pathlib import Path

from dotenv import load_dotenv
from elevenlabs import ElevenLabs, VoiceSettings

load_dotenv(Path(__file__).parent.parent / ".env")

# --- Voice config (change VOICE_ID to swap to a different German voice) ---
# To find German voices: go to elevenlabs.io → Voices → filter by German
# Recommended free-tier German voices: "Daniel" or search for native German speakers
VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "onwK4e9ZLuTAKqWW03F9")  # Daniel (German)
MODEL_ID = "eleven_multilingual_v2"
VOICE_SETTINGS = VoiceSettings(stability=0.5, similarity_boost=0.75)

ROOT = Path(__file__).parent.parent
PHRASES_FILE = ROOT / "phrases.csv"
AUDIO_DIR = ROOT / "audio"
DATA_JS = ROOT / "data.js"


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[äöüß]", lambda m: {"ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss"}[m.group()], text)
    text = re.sub(r"[^a-z0-9]+", "_", text)
    return text[:40].strip("_")


def generate_single(client: ElevenLabs, phrase_id: str, german: str) -> str:
    AUDIO_DIR.mkdir(exist_ok=True)
    filename = f"{int(phrase_id):03d}_{slugify(german)}.mp3"
    filepath = AUDIO_DIR / filename

    audio_stream = client.text_to_speech.convert(
        voice_id=VOICE_ID,
        text=german,
        model_id=MODEL_ID,
        voice_settings=VOICE_SETTINGS,
    )

    with open(filepath, "wb") as f:
        for chunk in audio_stream:
            f.write(chunk)

    return f"audio/{filename}"


def write_data_js(rows: list[dict]) -> None:
    phrases = [
        {
            "id": int(row["id"]),
            "german": row["german"],
            "english": row["english"],
            "category": row["category"],
            "audio": row["audio_file"],
        }
        for row in rows
    ]
    DATA_JS.write_text(
        f"const PHRASES = {json.dumps(phrases, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8",
    )


def main(only_id: str | None = None) -> None:
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key:
        print("Error: ELEVENLABS_API_KEY not set in .env")
        sys.exit(1)

    client = ElevenLabs(api_key=api_key)

    with open(PHRASES_FILE, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    updated = False
    total = len(rows)

    for i, row in enumerate(rows):
        if only_id and row["id"] != only_id:
            continue
        if row["audio_file"]:
            continue

        print(f"[{i + 1}/{total}] Generating: {row['german'][:60]}...")
        try:
            path = generate_single(client, row["id"], row["german"])
            row["audio_file"] = path
            updated = True
            print(f"         -> {path}")
        except Exception as e:
            print(f"         -> Error: {e}")

    if updated:
        with open(PHRASES_FILE, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=["id", "german", "english", "category", "audio_file", "created_date"])
            writer.writeheader()
            for row in rows:
                writer.writerow({k: v for k, v in row.items() if k is not None})
        print("\nUpdated phrases.csv")

    write_data_js(rows)
    print("Updated data.js")


if __name__ == "__main__":
    id_arg = sys.argv[1] if len(sys.argv) > 1 else None
    main(only_id=id_arg)
