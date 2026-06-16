"""Browser smoke test for the unified error log + weakness profile (API mocked)."""
import json
import sys
sys.stdout.reconfigure(encoding="utf-8")
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8123/index.html"
OUT = r".claude"
results = []

def check(name, ok, detail=""):
    results.append((name, ok, detail))
    print(("PASS " if ok else "FAIL ") + name + (f" -- {detail}" if detail else ""))

MOCK_PROFILE = {
    "patterns": [
        {"title": "Dativ after prepositions", "description": "You keep using Akkusativ articles after mit/zu/bei. These prepositions always take Dativ.",
         "tip": "mit-aus-bei-nach-seit-von-zu: always Dativ!", "examples": ["Ich fahre mit dem Bus.", "Sie wohnt bei ihrer Tante."]},
        {"title": "Verb-second word order", "description": "After a fronted time adverb the verb must come second, before the subject.",
         "tip": "Time first? Verb stays second: 'Heute gehe ich...'", "examples": ["Heute gehe ich ins Kino."]},
    ]
}

MOCK_DRILLS = {
    "drills": [
        {"sentence": "Ich fahre mit ___ Bus zur Uni.", "answer": "dem", "distractors": ["den", "der", "das"], "rule": "mit takes Dativ"},
        {"sentence": "Heute ___ ich ins Kino.", "answer": "gehe", "distractors": ["ich gehe", "gehen", "geht"], "rule": "Verb second after fronted adverb"},
    ]
}

MOCK_CORRECT = {
    "original": "Ich gehe zu die Schule",
    "corrected": "Ich gehe zur Schule",
    "is_correct": False,
    "explanation": "zu takes Dativ - zu der = zur",
    "audio_base64": None,
}

SEED_ERRORS = [
    {"ts": 1, "source": "chat", "original": "Ich fahre mit den Bus", "corrected": "Ich fahre mit dem Bus", "explanation": "mit takes Dativ"},
    {"ts": 2, "source": "recall", "original": "Heute ich gehe ins Kino", "corrected": "Heute gehe ich ins Kino", "explanation": "Verb second"},
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))

    def handle_api(route):
        body = json.loads(route.request.post_data or "{}")
        m = body.get("mode")
        if m == "error-profile":
            route.fulfill(json=MOCK_PROFILE)
        elif m == "error-drills":
            route.fulfill(json=MOCK_DRILLS)
        elif m == "correct":
            route.fulfill(json=MOCK_CORRECT)
        else:
            route.fulfill(status=400, json={"error": "unmocked mode"})

    page.route("**/api/chat", handle_api)
    page.goto(URL)
    page.evaluate(f"localStorage.setItem('errorLog', JSON.stringify({json.dumps(SEED_ERRORS)}))")
    page.reload()
    page.wait_for_timeout(700)

    # 1. Capture hook: a wrong "correct" result lands in the log
    page.evaluate("document.querySelector('.tab[data-mode=\\'ai\\']').click()")
    page.wait_for_timeout(300)
    page.evaluate("document.querySelector('.ai-sub-btn[data-aimode=\\'correct\\']').click()")
    page.wait_for_timeout(200)
    page.evaluate("sendToAI('Ich gehe zu die Schule')")
    page.wait_for_timeout(600)
    log_len = page.evaluate("JSON.parse(localStorage.getItem('errorLog')).length")
    last = page.evaluate("JSON.parse(localStorage.getItem('errorLog')).slice(-1)[0]")
    check("wrong Correct result captured in log", log_len == 3 and last["source"] == "correct",
          f"len={log_len}, last={last.get('source')}")

    # duplicate submission does not double-log
    page.evaluate("sendToAI('Ich gehe zu die Schule')")
    page.wait_for_timeout(500)
    log_len2 = page.evaluate("JSON.parse(localStorage.getItem('errorLog')).length")
    check("duplicate correction deduped", log_len2 == 3, f"len={log_len2}")

    # 2. Progress panel shows the section via More sheet
    page.click("#more-tab")
    page.wait_for_timeout(250)
    page.evaluate("document.querySelector('.more-item[data-mode=\\'progress\\']').click()")
    page.wait_for_timeout(400)
    section_shown = page.evaluate("getComputedStyle(document.getElementById('error-profile-section')).display !== 'none'")
    count_txt = page.evaluate("document.getElementById('error-log-count').textContent")
    check("My Mistakes section visible in Progress", section_shown, count_txt)
    check("count reflects log size", "3" in count_txt, count_txt)

    # 3. Show list renders entries
    page.evaluate("document.getElementById('error-toggle-list-btn').click()")
    page.wait_for_timeout(200)
    items = page.evaluate("document.querySelectorAll('.error-log-item').length")
    check("error list renders entries", items == 3, f"items={items}")
    page.screenshot(path=OUT + r"\e1_list.png")

    # 4. Analyze -> patterns render and cache persists
    page.evaluate("document.getElementById('error-analyze-btn').click()")
    page.wait_for_timeout(600)
    cards = page.evaluate("document.querySelectorAll('.error-pattern-card').length")
    first_title = page.evaluate("document.querySelector('.error-pattern-title')?.textContent || ''")
    check("analysis renders pattern cards", cards == 2, f"cards={cards}, first={first_title}")
    cached = page.evaluate("!!localStorage.getItem('errorProfileCache')")
    check("analysis cached", cached)
    page.screenshot(path=OUT + r"\e2_patterns.png")

    # 5. Practice my mistakes -> drill modal opens with generated items
    page.evaluate("document.getElementById('error-practice-btn').click()")
    page.wait_for_timeout(600)
    modal_shown = page.evaluate("document.getElementById('drill-modal').style.display !== 'none'")
    chip = page.evaluate("document.getElementById('drill-tag-chip').textContent")
    n_choices = page.evaluate("document.querySelectorAll('.drill-choice').length")
    check("drill modal opens from mistakes", modal_shown and "My Mistakes" in chip, f"chip={chip}")
    check("drill has answer options", n_choices == 4, f"choices={n_choices}")
    page.screenshot(path=OUT + r"\e3_drill.png")

    # 6. Wrong answer in the error drill feeds the mistake bank
    wrong = page.evaluate("""
      (() => { const item = drillQueue[drillIdx];
        const w = item.options.find(o => o.toLowerCase() !== item.blank.toLowerCase());
        answerDrill(w); return w; })()
    """)
    page.wait_for_timeout(300)
    bank = page.evaluate("Object.keys(getDrillMistakeBank()).length")
    check("wrong error-drill answer feeds mistake bank", bank == 1, f"bank={bank}")
    page.evaluate("document.getElementById('drill-close').click()")

    # 7. Clear works (auto-accept confirm)
    page.on("dialog", lambda d: d.accept())
    page.evaluate("document.getElementById('error-clear-btn').click()")
    page.wait_for_timeout(300)
    cleared = page.evaluate("localStorage.getItem('errorLog')")
    section_hidden = page.evaluate("document.getElementById('error-profile-section').style.display === 'none'")
    check("clear removes log and hides section", cleared is None and section_hidden)

    check("no JS page errors", not errors, "; ".join(errors[:3]))
    browser.close()

failed = [r for r in results if not r[1]]
print(f"\n{len(results) - len(failed)}/{len(results)} checks passed")
sys.exit(1 if failed else 0)

