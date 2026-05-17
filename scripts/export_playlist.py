"""
Export a playlist MP3 for phone listening.

Concatenates all (or one category's) MP3s with silence between each phrase.

Usage:
    python scripts/export_playlist.py                           # all phrases -> playlists/all.mp3
    python scripts/export_playlist.py --category morning_routine  # one island
    python scripts/export_playlist.py --shuffle                 # random order

Requirements: pydub + ffmpeg
  Install ffmpeg: https://ffmpeg.org/download.html
  Or on Windows with winget: winget install ffmpeg
"""
import argparse
import csv
import os
import random
from pathlib import Path

from dotenv import load_dotenv
from pydub import AudioSegment

ROOT = Path(__file__).parent.parent
load_dotenv(ROOT / ".env")

PHRASES_FILE = ROOT / "phrases.csv"
AUDIO_DIR = ROOT / "audio"
PLAYLISTS_DIR = ROOT / "playlists"

SILENCE_BETWEEN_MS = 2500   # 2.5s gap between phrases
SILENCE_REPEAT_GAP_MS = 4000  # 4s gap - long enough to try shadowing


def main() -> None:
    parser = argparse.ArgumentParser(description="Export an MP3 playlist for phone listening")
    parser.add_argument("--category", default=None, help="Filter by Language Island category (default: all)")
    parser.add_argument("--shuffle", action="store_true", help="Randomise phrase order")
    parser.add_argument(
        "--mode",
        choices=["listen", "shadow"],
        default="listen",
        help="listen: phrase plays once | shadow: phrase plays, gap to repeat, plays again",
    )
    args = parser.parse_args()

    with open(PHRASES_FILE, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    if args.category:
        rows = [r for r in rows if r["category"] == args.category]

    rows = [r for r in rows if r["audio_file"]]

    if not rows:
        print("No phrases with audio found. Run generate_audio.py first.")
        return

    if args.shuffle:
        random.shuffle(rows)

    gap = AudioSegment.silent(duration=SILENCE_BETWEEN_MS)
    repeat_gap = AudioSegment.silent(duration=SILENCE_REPEAT_GAP_MS)

    combined = AudioSegment.empty()
    for i, row in enumerate(rows):
        audio_path = ROOT / row["audio_file"]
        if not audio_path.exists():
            print(f"Warning: Missing audio file {audio_path}, skipping.")
            continue

        segment = AudioSegment.from_mp3(audio_path)

        if args.mode == "shadow":
            combined += segment + repeat_gap + segment + gap
        else:
            combined += segment + gap

        print(f"[{i + 1}/{len(rows)}] {row['german'][:60]}")

    PLAYLISTS_DIR.mkdir(exist_ok=True)
    category_label = args.category or "all"
    mode_label = f"_{args.mode}" if args.mode == "shadow" else ""
    shuffle_label = "_shuffled" if args.shuffle else ""
    out_path = PLAYLISTS_DIR / f"{category_label}{mode_label}{shuffle_label}.mp3"

    combined.export(out_path, format="mp3")
    duration_min = len(combined) / 1000 / 60
    print(f"\nExported: {out_path} ({duration_min:.1f} min, {len(rows)} phrases)")
    print("Sync this file to your phone via OneDrive.")


if __name__ == "__main__":
    main()
