"""
One-time script to tag all phrases in data.js with CEFR levels (a1/a2/b1/b2/c1/c2).
Reads PHRASES from data.js, sends batches to Claude API, writes level field back to data.js.

Usage:
  python scripts/tag_phrases_cefr.py

Requires ANTHROPIC_API_KEY in environment or .env file.
"""

import re
import json
import os
import sys
from pathlib import Path

try:
    import anthropic
except ImportError:
    print("Install dependencies first: pip install -r scripts/requirements.txt")
    sys.exit(1)

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

ROOT = Path(__file__).parent.parent
DATA_FILE = ROOT / "data.js"
BATCH_SIZE = 25

PROMPT_TEMPLATE = """Assign a CEFR level (a1, a2, b1, b2, c1, or c2) to each German phrase below.

Base your decision on:
- Vocabulary complexity (common everyday words = A1/A2, topic-specific = B1/B2, abstract/formal = C1/C2)
- Grammar structures used (present tense = A1, Perfekt/Modal = A2, Konjunktiv/Passiv = B2+)
- Sentence complexity (simple = A1/A2, compound clauses = B1+, complex constructions = C1+)

Return ONLY a JSON array with objects {{"id": <number>, "level": "<cefr>"}}.
No explanation, no markdown, just the JSON array.

Phrases:
{phrases}"""


def extract_phrases(js_content: str) -> list[dict]:
    """Extract phrase objects from data.js content."""
    match = re.search(r'const PHRASES\s*=\s*(\[[\s\S]*?\]);', js_content)
    if not match:
        raise ValueError("Could not find PHRASES array in data.js")
    return json.loads(match.group(1))


def tag_batch(client: anthropic.Anthropic, phrases: list[dict]) -> dict[int, str]:
    """Send a batch to Claude and return {id: level} mapping."""
    phrases_text = "\n".join(
        f'ID {p["id"]}: {p["german"]} / {p["english"]}'
        for p in phrases
    )
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        messages=[{"role": "user", "content": PROMPT_TEMPLATE.format(phrases=phrases_text)}]
    )
    raw = message.content[0].text.strip()
    # Strip markdown code fences if present
    raw = re.sub(r'^```(?:json)?\s*', '', raw)
    raw = re.sub(r'\s*```$', '', raw)
    raw = raw.strip()
    results = json.loads(raw)
    return {item["id"]: item["level"] for item in results}


def inject_levels(js_content: str, levels: dict[int, str]) -> str:
    """Add level field to each phrase object in the JS source."""
    match = re.search(r'(const PHRASES\s*=\s*)(\[[\s\S]*?\]);', js_content)
    if not match:
        raise ValueError("Could not find PHRASES array in data.js")

    phrases = json.loads(match.group(2))
    for p in phrases:
        if p["id"] in levels and "level" not in p:
            p["level"] = levels[p["id"]]

    new_array = json.dumps(phrases, ensure_ascii=False, indent=2)
    start, end = match.start(2), match.end(2)
    return js_content[:start] + new_array + js_content[end:]


def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY not set.")
        sys.exit(1)

    js_content = DATA_FILE.read_text(encoding="utf-8")
    phrases = extract_phrases(js_content)
    print(f"Found {len(phrases)} phrases")

    already_tagged = sum(1 for p in phrases if "level" in p)
    if already_tagged:
        print(f"{already_tagged} phrases already have a level field - skipping those")
        phrases = [p for p in phrases if "level" not in p]

    if not phrases:
        print("All phrases already tagged.")
        return

    client = anthropic.Anthropic(api_key=api_key)
    all_levels: dict[int, str] = {}

    batches = [phrases[i:i + BATCH_SIZE] for i in range(0, len(phrases), BATCH_SIZE)]
    for i, batch in enumerate(batches, 1):
        print(f"Tagging batch {i}/{len(batches)} ({len(batch)} phrases)...")
        try:
            levels = tag_batch(client, batch)
            all_levels.update(levels)
        except Exception as e:
            print(f"  Batch {i} failed: {e}")
            print("  Continuing with next batch...")

    print(f"Tagged {len(all_levels)} phrases. Writing to data.js...")
    updated = inject_levels(js_content, all_levels)
    DATA_FILE.write_text(updated, encoding="utf-8")

    # Quick stats
    from collections import Counter
    counts = Counter(all_levels.values())
    for level in ["a1", "a2", "b1", "b2", "c1", "c2"]:
        print(f"  {level.upper()}: {counts.get(level, 0)}")
    print("Done.")


if __name__ == "__main__":
    main()
