"""
Add a single phrase to the phrase bank and immediately generate its audio.

Usage:
    python scripts/add_phrase.py --german "Das ist mir egal." --english "I don't care." --category hirschsprach_cafe
"""
import argparse
import csv
import os
import sys
from datetime import date
from pathlib import Path

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


def main() -> None:
    parser = argparse.ArgumentParser(description="Add a phrase to the learning system")
    parser.add_argument("--german", required=True, help="The German sentence")
    parser.add_argument("--english", required=True, help="The English translation")
    parser.add_argument(
        "--category",
        required=True,
        choices=VALID_CATEGORIES,
        help=f"Language Island category. Options: {', '.join(VALID_CATEGORIES)}",
    )
    args = parser.parse_args()

    with open(PHRASES_FILE, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    next_id = str(max(int(r["id"]) for r in rows) + 1) if rows else "1"

    new_row = {
        "id": next_id,
        "german": args.german,
        "english": args.english,
        "category": args.category,
        "audio_file": "",
        "created_date": date.today().isoformat(),
    }
    rows.append(new_row)

    with open(PHRASES_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "german", "english", "category", "audio_file", "created_date"])
        writer.writeheader()
        writer.writerows(rows)

    print(f"Added phrase #{next_id}: {args.german}")
    print("Generating audio...")

    sys.path.insert(0, str(Path(__file__).parent))
    from generate_audio import main as gen_main
    gen_main(only_id=next_id)

    print(f"\nDone. Phrase #{next_id} is ready to use.")


if __name__ == "__main__":
    main()
