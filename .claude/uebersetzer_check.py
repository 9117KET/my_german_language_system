"""Smoke test for the Übersetzer tab (level-aware translator).

A plain static server has no /api functions, so window.fetch is stubbed with
canned translate-level / translate-grade payloads. That is deliberate: the point
of this tab is the client-side CEFR check and the render path around it, and both
run without a backend. The stub also lets the test count requests, which is how
it proves a level change re-checks the text locally instead of calling the API.

Run:  npm run serve      (in one terminal)
      python .claude/uebersetzer_check.py
"""
import json
import sys

from playwright.sync_api import sync_playwright

# German output and the check badges carry non-ASCII, which the default
# Windows console encoding (cp1252) cannot print.
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

URL = "http://127.0.0.1:8123/index.html"
OUT = r".claude"

# "abschließen" is a real tier-4 (B2) entry in words_data.js, so asking for A1
# must flag it. "haben"/"Haus" are tier 1 and must not be flagged.
LEVEL_PAYLOAD = {
    "primary": "Ich will das Haus abschließen.",
    "native": "Ich würde das Haus gerne abschließen.",
    "english": "I want to lock the house.",
    "difference": "The native version uses Konjunktiv II (würde) for politeness.",
    "grammar_note": "abschließen is separable: the prefix goes to the end.",
    "used_due_words": ["Haus"],
    "words": [{"de": "abschließen", "en": "to lock"}, {"de": "der Quatschbegriff", "en": "nonsense"}],
    "level": "a1",
    "direction": "en_de",
    "audio_base64": None,
}

GRADE_PAYLOAD = {
    "is_correct": False,
    "corrected": "Ich helfe dem Mann.",
    "original": "Ich helfe den Mann.",
    "feedback": "Very close - just the case to fix.",
    "grammar_note": "helfen takes the Dativ, so den becomes dem.",
    "score": 70,
    "level": "a1",
    "audio_base64": None,
}

STUB = """
(() => {
  window.__uebCalls = [];
  const real = window.fetch;
  window.fetch = async (url, opts) => {
    if (String(url).includes("/api/chat") && opts && opts.body) {
      const body = JSON.parse(opts.body);
      window.__uebCalls.push(body);
      const canned = { "translate-level": LEVEL_JSON, "translate-grade": GRADE_JSON }[body.mode];
      if (canned) {
        return new Response(JSON.stringify(canned), {
          status: 200, headers: { "Content-Type": "application/json" },
        });
      }
    }
    return real(url, opts);
  };
})();
"""

results = []


def check(name, ok, detail=""):
    results.append((name, ok, detail))
    print(("PASS " if ok else "FAIL ") + name + (f" -- {detail}" if detail else ""))


def visible(page, sel):
    return page.evaluate(f"getComputedStyle(document.querySelector('{sel}')).display !== 'none'")

with sync_playwright() as p:
    browser = p.chromium.launch()

    # ---- Desktop pass: the full flow ----
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.add_init_script(
        STUB.replace("LEVEL_JSON", json.dumps(LEVEL_PAYLOAD)).replace("GRADE_JSON", json.dumps(GRADE_PAYLOAD))
    )
    # Start from A1 so the tier-4 word in the canned reply is genuinely off-level.
    page.add_init_script("localStorage.setItem('uebLevel', 'a1');")
    page.goto(URL)
    page.wait_for_timeout(800)

    # 1. Tab opens the panel
    page.click('.tab[data-mode="uebersetzer"]')
    page.wait_for_timeout(300)
    check("panel opens from the tab", visible(page, "#ueb-panel"))
    check("level badge reflects the stored level",
          page.inner_text("#ueb-level-badge").strip() == "A1",
          page.inner_text("#ueb-level-badge"))
    check("A1 chip is the active one",
          page.evaluate("document.querySelector('.ueb-level-chip.active').dataset.level") == "a1")

    # 2. Buttons stay disabled until there is text, and the counter tracks it
    check("translate disabled while empty",
          page.evaluate("document.getElementById('ueb-translate-btn').disabled"))
    page.fill("#ueb-input", "I want to lock the house.")
    page.wait_for_timeout(150)
    check("counter updates on input",
          page.inner_text("#ueb-char-count").startswith("25/"),
          page.inner_text("#ueb-char-count"))
    check("translate enabled with text",
          not page.evaluate("document.getElementById('ueb-translate-btn').disabled"))

    # 3. Translate renders both renderings plus the teaching cards
    page.click("#ueb-translate-btn")
    page.wait_for_timeout(600)
    check("result area shows", visible(page, "#ueb-result"))
    check("level version rendered",
          page.inner_text("#ueb-primary-text").strip() == LEVEL_PAYLOAD["primary"],
          page.inner_text("#ueb-primary-text"))
    check("native version rendered alongside it",
          visible(page, "#ueb-native-card")
          and page.inner_text("#ueb-native-text").strip() == LEVEL_PAYLOAD["native"])
    check("the difference is explained", visible(page, "#ueb-diff-card"))
    check("the rule is named", visible(page, "#ueb-rule-card"))
    check("the English source is echoed", visible(page, "#ueb-english-card"))

    # 4. The CEFR check - the part that is not just an LLM prompt
    badge = page.inner_text("#ueb-level-check-badge")
    check("level check flags the B2 word at A1", "above A1" in badge, badge)
    flagged = page.evaluate("[...document.querySelectorAll('.ueb-over-word')].map(e => e.textContent.trim())")
    check("abschließen is the flagged word",
          any("abschließen" in f for f in flagged), str(flagged))
    check("the stricter re-ask is offered",
          page.evaluate("!!document.getElementById('ueb-stricter-btn')"))
    check("tier histogram rendered",
          visible(page, "#ueb-profile-card")
          and page.evaluate("document.querySelectorAll('.ueb-profile-row').length") > 0)

    # 5. Words card: only entries that exist in WORDS can join the SRS
    rows = page.evaluate("""
      [...document.querySelectorAll('.ueb-word-row')].map(r => ({
        de: r.querySelector('.ueb-word-de').textContent,
        btn: r.querySelector('.ueb-word-add').textContent,
        disabled: r.querySelector('.ueb-word-add').disabled,
      }))
    """)
    check("both takeaway words listed", len(rows) == 2, str(rows))
    real_word = next((r for r in rows if "abschließen" in r["de"]), None)
    fake_word = next((r for r in rows if "Quatsch" in r["de"]), None)
    check("a real word offers + Words", real_word and not real_word["disabled"], str(real_word))
    check("an unknown word is not addable", fake_word and fake_word["disabled"], str(fake_word))

    # Adding it must schedule the word as due today.
    page.click(".ueb-word-row:has-text('abschließen') .ueb-word-add")
    page.wait_for_timeout(200)
    srs_count = page.evaluate("Object.keys(JSON.parse(localStorage.getItem('wordsSRS') || '{}')).length")
    check("adding a word writes it to wordsSRS", srs_count >= 1, f"count={srs_count}")

    page.screenshot(path=OUT + r"\ueb_1_result.png", full_page=True)

    # 6. Changing level re-checks locally, with no extra API call
    calls_before = page.evaluate("window.__uebCalls.length")
    page.click('.ueb-level-chip[data-level="b2"]')
    page.wait_for_timeout(300)
    calls_after = page.evaluate("window.__uebCalls.length")
    badge_b2 = page.inner_text("#ueb-level-check-badge")
    check("switching level costs no API call", calls_after == calls_before,
          f"{calls_before} -> {calls_after}")
    check("the same sentence passes at B2", "checked" in badge_b2, badge_b2)

    # 7. Direction toggle relabels the input and the button
    page.click('.ueb-level-chip[data-level="a1"]')
    page.click("#ueb-dir-btn")
    page.wait_for_timeout(250)
    check("direction flips to DE -> EN", "DE" in page.inner_text("#ueb-dir-btn").split("→")[0])
    check("placeholder follows the direction",
          "German" in page.get_attribute("#ueb-input", "placeholder"),
          page.get_attribute("#ueb-input", "placeholder"))
    check("a direction change clears the stale result", not visible(page, "#ueb-result"))
    page.click("#ueb-dir-btn")
    page.wait_for_timeout(200)

    # 8. The self-attempt path: grade, log the error, award XP
    page.fill("#ueb-input", "I help the man.")
    page.wait_for_timeout(150)
    page.click("#ueb-try-btn")
    page.wait_for_timeout(250)
    check("attempt area opens", visible(page, "#ueb-attempt-area"))
    check("the answer is withheld until the attempt is made", not visible(page, "#ueb-result"))

    xp_before = page.evaluate("JSON.parse(localStorage.getItem('xp_state') || '{}').total || 0")
    page.fill("#ueb-attempt-input", "Ich helfe den Mann.")
    page.click("#ueb-attempt-check-btn")
    page.wait_for_timeout(800)
    check("verdict shown", visible(page, "#ueb-attempt-result"))
    check("the correction is shown", visible(page, "#ueb-attempt-corrected-wrap"))
    check("the broken rule is named",
          "Dativ" in page.inner_text("#ueb-attempt-rule"), page.inner_text("#ueb-attempt-rule"))
    log = page.evaluate("JSON.parse(localStorage.getItem('errorLog') || '[]')")
    check("the mistake reaches the error log",
          any(e.get("source") == "uebersetzer" for e in log), str(log[-1:] if log else log))
    xp_after = page.evaluate("JSON.parse(localStorage.getItem('xp_state') || '{}').total || 0")
    check("XP awarded for the graded attempt", xp_after > xp_before, f"{xp_before} -> {xp_after}")
    check("the comparison follows once the answer is earned", visible(page, "#ueb-result"))

    page.screenshot(path=OUT + r"\ueb_2_attempt.png", full_page=True)
    check("no page errors on desktop", not errors, "; ".join(errors[:3]))

    # ---- Mobile pass: a tab missing from the More sheet does not exist ----
    m = browser.new_page(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    merrors = []
    m.on("pageerror", lambda e: merrors.append(str(e)))
    m.add_init_script(
        STUB.replace("LEVEL_JSON", json.dumps(LEVEL_PAYLOAD)).replace("GRADE_JSON", json.dumps(GRADE_PAYLOAD))
    )
    m.goto(URL)
    m.wait_for_timeout(800)

    m.click("#more-tab")
    m.wait_for_timeout(300)
    in_sheet = m.evaluate("!!document.querySelector('.more-item[data-mode=\\'uebersetzer\\']')")
    check("reachable from the mobile More sheet", in_sheet)

    m.click('.more-item[data-mode="uebersetzer"]')
    m.wait_for_timeout(300)
    check("panel opens on mobile", visible(m, "#ueb-panel"))

    sw = m.evaluate("document.documentElement.scrollWidth")
    iw = m.evaluate("window.innerWidth")
    check("no horizontal overflow at 390px", sw <= iw, f"scrollWidth={sw} innerWidth={iw}")

    # Every control has to clear the touch floor the app sets in --tap.
    small = m.evaluate("""
      ['#ueb-dir-btn', '#ueb-translate-btn', '#ueb-try-btn']
        .map(s => [s, Math.round(document.querySelector(s).getBoundingClientRect().height)])
        .filter(([, h]) => h < 44)
    """)
    check("primary controls meet the touch floor", not small, str(small))

    m.fill("#ueb-input", "I want to lock the house.")
    m.wait_for_timeout(150)
    m.click("#ueb-translate-btn")
    m.wait_for_timeout(600)
    check("translation renders on mobile", visible(m, "#ueb-result"))
    sw2 = m.evaluate("document.documentElement.scrollWidth")
    check("still no overflow with a result on screen", sw2 <= iw, f"scrollWidth={sw2}")
    m.screenshot(path=OUT + r"\ueb_3_mobile.png", full_page=True)
    check("no page errors on mobile", not merrors, "; ".join(merrors[:3]))

    browser.close()

failed = [r for r in results if not r[1]]
print(f"\n{len(results) - len(failed)}/{len(results)} passed")
if failed:
    print("FAILURES:")
    for name, _, detail in failed:
        print(f"  - {name} {detail}")
sys.exit(1 if failed else 0)
