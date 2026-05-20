"""
Bulk-import phrases from a speech-to-text capture file.

How to use (Mikel's method):
  1. For a few days, narrate your life out loud in English.
     Use your phone's speech-to-text to capture everything you say.
  2. Paste all that text into a file called import_me.txt in the project root.
  3. Run: python scripts/bulk_import.py --file import_me.txt --category morning_routine

The script uses Claude to split the text into individual sentences,
translate each one to natural German, then adds them all to phrases.csv
and generates audio for each.
"""
import argparse
import csv
import json
import os
import sys
from datetime import date
from pathlib import Path

import anthropic
from dotenv import load_dotenv

ROOT = Path(__file__).parent.parent
load_dotenv(ROOT / ".env")

PHRASES_FILE = ROOT / "phrases.csv"
VALID_CATEGORIES = [
    "morning_routine",
    "job_search",
    "german_class",
    "hirschsprach_cafe",
    "describe_surroundings",
    "inner_thoughts",
    "daily_life",
    "university_life",
    "phone_digital",
    "bureaucracy",
]

SYSTEM_PROMPT = """You are a German language assistant helping build a personal phrase bank.
You will receive a block of English text (narrated speech, captured via speech-to-text).
Your job is to:
1. Split it into individual, standalone sentences (remove filler words like "um", "uh", "like")
2. Translate each sentence into natural, conversational German
3. Return a JSON array of objects: [{\"english\": \"...\", \"german\": \"...\"}]

Rules:
- Each sentence should be something a person would naturally say in conversation
- Use natural German (not overly formal), appropriate for everyday speech
- If a sentence is too vague or just noise, skip it
- Return ONLY the JSON array, no explanation
"""


def translate_block(client: anthropic.Anthropic, text: str) -> list[dict]:
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": text}],
    )
    raw = message.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())


def main() -> None:
    parser = argparse.ArgumentParser(description="Bulk import phrases from a speech-to-text file")
    parser.add_argument("--file", required=True, help="Path to text file with English sentences (e.g. import_me.txt)")
    parser.add_argument(
        "--category",
        required=True,
        choices=VALID_CATEGORIES,
        help=f"Language Island for all imported phrases: {', '.join(VALID_CATEGORIES)}",
    )
    args = parser.parse_args()

    input_file = Path(args.file)
    if not input_file.is_absolute():
        input_file = ROOT / input_file
    if not input_file.exists():
        print(f"Error: File not found: {input_file}")
        sys.exit(1)

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY not set in .env")
        sys.exit(1)

    text = input_file.read_text(encoding="utf-8")
    print(f"Translating {len(text)} characters via Claude...")

    client = anthropic.Anthropic(api_key=api_key)
    phrases = translate_block(client, text)
    print(f"Got {len(phrases)} sentences to import.")

    with open(PHRASES_FILE, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    next_id = max(int(r["id"]) for r in rows) + 1 if rows else 1
    today = date.today().isoformat()
    new_ids = []

    for p in phrases:
        row = {
            "id": str(next_id),
            "german": p["german"],
            "english": p["english"],
            "category": args.category,
            "audio_file": "",
            "created_date": today,
        }
        rows.append(row)
        new_ids.append(str(next_id))
        print(f"  [{next_id}] {p['english'][:50]} -> {p['german'][:50]}")
        next_id += 1

    with open(PHRASES_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "german", "english", "category", "audio_file", "created_date"])
        writer.writeheader()
        writer.writerows(rows)

    print(f"\nAdded {len(new_ids)} phrases to phrases.csv")
    print("Generating audio for all new phrases...")

    sys.path.insert(0, str(Path(__file__).parent))
    from generate_audio import main as gen_main
    for phrase_id in new_ids:
        gen_main(only_id=phrase_id)

    print(f"\nDone. {len(new_ids)} new phrases are ready to use.")


if __name__ == "__main__":
    main()
