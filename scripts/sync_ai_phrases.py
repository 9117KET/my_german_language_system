"""
Sync AI-translated phrases from your phone to the local phrase bank.

How to use:
1. In the web player AI tab, tap "Export JSON" on your phone
2. Move the downloaded ai_phrases_YYYY-MM-DD.json to the project root
3. Run: python scripts/sync_ai_phrases.py --file ai_phrases_2026-05-17.json
4. Then commit and push to update Vercel

This adds the phrases to phrases.csv and generates ElevenLabs audio for each.
"""
import argparse
import csv
import json
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).parent.parent
PHRASES_FILE = ROOT / "phrases.csv"


def main() -> None:
    parser = argparse.ArgumentParser(description="Sync AI phrases from browser export to phrase bank")
    parser.add_argument("--file", required=True, help="Path to exported JSON file (e.g. ai_phrases_2026-05-17.json)")
    args = parser.parse_args()

    input_file = Path(args.file)
    if not input_file.is_absolute():
        input_file = ROOT / input_file
    if not input_file.exists():
        print(f"Error: {input_file} not found")
        sys.exit(1)

    phrases = json.loads(input_file.read_text(encoding="utf-8"))
    print(f"Found {len(phrases)} phrases to import")

    with open(PHRASES_FILE, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    next_id = max(int(r["id"]) for r in rows) + 1 if rows else 1
    today = date.today().isoformat()
    new_count = 0

    for p in phrases:
        row = {
            "id": str(next_id),
            "german": p["german"],
            "english": p["english"],
            "category": p.get("category", "daily_life"),
            "audio_file": "",
            "created_date": p.get("created_date", today),
        }
        rows.append(row)
        print(f"  [{next_id}] {p['english'][:45]} -> {p['german'][:45]}")
        next_id += 1
        new_count += 1

    with open(PHRASES_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "german", "english", "category", "audio_file", "created_date"])
        writer.writeheader()
        for row in rows:
            writer.writerow({k: v for k, v in row.items() if k is not None})

    print(f"\nAdded {new_count} phrases to phrases.csv")
    print("\nNext steps:")
    print("  python scripts/generate_audio.py      # generate audio for new phrases")
    print("  git add audio/ data.js phrases.csv")
    print("  git commit -m 'Add AI translated phrases'")
    print("  git push                               # triggers Vercel redeploy")


if __name__ == "__main__":
    main()
