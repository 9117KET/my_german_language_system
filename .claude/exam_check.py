"""Browser smoke test for the telc B2 exam simulator (API mocked)."""
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

MOCK_SB = {
    "title": "Reklamation",
    "text": "Sehr geehrte Damen und Herren, [1] drei Wochen warte ich [2] meine Bestellung. " +
            "Ich bitte Sie, mir mitzuteilen, [3] die Ware geliefert wird. [4] einer Woche habe ich Ihnen geschrieben, " +
            "aber niemand hat [5] gemeldet. Ich erwarte, dass Sie das Problem [6] lösen. " +
            "Falls ich keine Antwort [7], werde ich vom Kauf [8]. Bitte senden Sie mir eine Bestätigung [9] E-Mail. [10] freundlichen Grüßen",
    "items": [
        {"num": i + 1, "options": opts, "answer": 0, "rule": f"Rule {i + 1}", "sentence": f"Testsatz {i + 1} mit ___."}
        for i, opts in enumerate([
            ["seit", "vor", "ab"], ["auf", "für", "über"], ["wann", "ob", "dass"],
            ["Vor", "Seit", "Bei"], ["sich", "mich", "uns"], ["umgehend", "umgehen", "gegangen"],
            ["erhalte", "erhalten", "erhielt"], ["zurücktreten", "zurückzutreten", "zurückgetreten"],
            ["per", "mit", "von"], ["Mit", "Bei", "Von"],
        ])
    ],
}

MOCK_WRITE = {
    "scores": {"inhalt": "B", "kommunikation": "A", "korrektheit": "C", "wortschatz": "B"},
    "points_covered": [True, True, False, True],
    "overall": "Solid attempt. Your biggest lever is grammatical accuracy, especially case endings after prepositions.",
    "corrections": [
        {"original": "Ich warte auf die Antwort seit drei Wochen", "corrected": "Ich warte seit drei Wochen auf die Antwort", "explanation": "Time before object"},
        {"original": "mit den Bus", "corrected": "mit dem Bus", "explanation": "mit takes Dativ"},
    ],
    "model": "Sehr geehrte Damen und Herren,\n\nhiermit möchte ich mich über ... beschweren.\n\nMit freundlichen Grüßen",
}

MOCK_SPEAK = {
    "scores": {"aufgabe": "B", "fluessigkeit": "B", "korrektheit": "B", "ausdruck": "A"},
    "overall": "Good structure and vocabulary. Lengthen the pros-and-cons section next time.",
    "corrections": [
        {"original": "die Leute kauft", "corrected": "die Leute kaufen", "explanation": "Plural subject needs plural verb"},
    ],
    "model": "Ich möchte über das Thema Online-Einkaufen sprechen. Ich kaufe selbst oft im Internet ein...",
}

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("dialog", lambda d: d.accept())

    def handle_api(route):
        body = json.loads(route.request.post_data or "{}")
        m = body.get("mode")
        if m == "exam-sprachbausteine":
            route.fulfill(json=MOCK_SB)
        elif m == "exam-write-feedback":
            route.fulfill(json=MOCK_WRITE)
        elif m == "exam-speak-feedback":
            route.fulfill(json=MOCK_SPEAK)
        else:
            route.fulfill(status=400, json={"error": "unmocked mode"})

    page.route("**/api/chat", handle_api)
    page.goto(URL)
    page.wait_for_timeout(700)

    # 1. Exam reachable via More sheet
    page.click("#more-tab")
    page.wait_for_timeout(250)
    has_item = page.evaluate("!!document.querySelector('.more-item[data-mode=\\'exam\\']')")
    check("telc B2 appears in More sheet (Exam group)", has_item)
    page.evaluate("document.querySelector('.more-item[data-mode=\\'exam\\']').click()")
    page.wait_for_timeout(300)
    landing = page.evaluate("getComputedStyle(document.getElementById('exam-landing')).display !== 'none'")
    cards = page.evaluate("document.querySelectorAll('.exam-task-card').length")
    check("exam landing shows 3 task cards", landing and cards == 3, f"cards={cards}")
    page.screenshot(path=OUT + r"\x1_landing.png")

    # --- Sprachbausteine ---
    page.evaluate("document.getElementById('exam-card-sb').click()")
    page.wait_for_timeout(200)
    page.evaluate("document.getElementById('exam-sb-start-btn').click()")
    page.wait_for_timeout(600)
    n_items = page.evaluate("document.querySelectorAll('.exam-sb-item').length")
    timer_shown = page.evaluate("document.getElementById('exam-sb-timer').style.display !== 'none'")
    check("SB test renders 10 items with timer", n_items == 10 and timer_shown, f"items={n_items}")
    submit_disabled = page.evaluate("document.getElementById('exam-sb-submit-btn').disabled")
    check("submit disabled until all answered", submit_disabled)

    # answer: correct for 0-7, wrong for 8-9
    page.evaluate("""
      (() => {
        for (let qi = 0; qi < 10; qi++) {
          const correct = examSbData.items[qi].answer;
          const oi = qi < 8 ? correct : (correct + 1) % examSbData.items[qi].options.length;
          document.querySelector(`.exam-sb-opt[data-qi="${qi}"][data-oi="${oi}"]`).click();
        }
      })()
    """)
    page.wait_for_timeout(200)
    submit_enabled = page.evaluate("!document.getElementById('exam-sb-submit-btn').disabled")
    check("submit enables after all answered", submit_enabled)
    page.evaluate("document.getElementById('exam-sb-submit-btn').click()")
    page.wait_for_timeout(300)
    score = page.evaluate("document.querySelector('.exam-score-big').textContent")
    bank = page.evaluate("Object.keys(getDrillMistakeBank()).length")
    check("SB scores 8/10", "8 / 10" in score, score)
    check("2 wrong SB items feed mistake bank", bank == 2, f"bank={bank}")
    page.screenshot(path=OUT + r"\x2_sb_result.png")

    # --- Schriftlicher Ausdruck ---
    page.evaluate("document.getElementById('exam-sb-back').click()")
    page.wait_for_timeout(200)
    page.evaluate("document.getElementById('exam-card-write').click()")
    page.wait_for_timeout(200)
    page.evaluate("document.getElementById('exam-write-type').value = 'Beschwerde'")
    page.evaluate("document.getElementById('exam-write-start-btn').click()")
    page.wait_for_timeout(300)
    points = page.evaluate("document.querySelectorAll('#exam-write-points li').length")
    w_timer = page.evaluate("document.getElementById('exam-write-timer').textContent")
    check("write task shows 4 Leitpunkte and 30:00 timer", points == 4 and w_timer == "30:00", f"points={points}, timer={w_timer}")

    letter = "Sehr geehrte Damen und Herren, " + "ich schreibe Ihnen wegen meiner Bestellung. " * 12 + "Mit freundlichen Grüßen"
    page.evaluate(f"""
      (() => {{
        const el = document.getElementById('exam-write-input');
        el.value = {json.dumps(letter)};
        el.dispatchEvent(new Event('input', {{bubbles: true}}));
      }})()
    """)
    page.wait_for_timeout(200)
    wc = page.evaluate("document.getElementById('exam-write-wordcount').textContent")
    can_submit = page.evaluate("!document.getElementById('exam-write-submit-btn').disabled")
    check("word count updates and unlocks submit", can_submit, wc)
    err_before = page.evaluate("JSON.parse(localStorage.getItem('errorLog') || '[]').length")
    page.evaluate("document.getElementById('exam-write-submit-btn').click()")
    page.wait_for_timeout(600)
    chips = page.evaluate("document.querySelectorAll('#exam-write-scores .exam-score-chip').length")
    covered = page.evaluate("document.querySelectorAll('#exam-write-points-covered .exam-point-row').length")
    err_after = page.evaluate("JSON.parse(localStorage.getItem('errorLog') || '[]').length")
    check("write result shows 4 criteria chips + Leitpunkte check", chips == 4 and covered == 4, f"chips={chips}, covered={covered}")
    check("write corrections feed error log", err_after == err_before + 2, f"{err_before}->{err_after}")
    page.evaluate("document.getElementById('exam-write-model-toggle').click()")
    page.wait_for_timeout(150)
    model_shown = page.evaluate("document.getElementById('exam-write-model').style.display !== 'none'")
    check("model letter toggles", model_shown)
    page.screenshot(path=OUT + r"\x3_write_result.png")

    # --- Präsentation ---
    page.evaluate("document.getElementById('exam-write-back').click()")
    page.wait_for_timeout(200)
    page.evaluate("document.getElementById('exam-card-speak').click()")
    page.wait_for_timeout(300)
    topic = page.evaluate("document.getElementById('exam-speak-topic').textContent")
    structure = page.evaluate("document.querySelectorAll('#exam-speak-structure li').length")
    check("speak setup shows topic + 4 structure points", bool(topic) and structure == 4, f"topic={topic}")
    t1 = topic
    page.evaluate("document.getElementById('exam-speak-newtopic-btn').click()")
    page.wait_for_timeout(150)

    page.evaluate("document.getElementById('exam-speak-prep-btn').click()")
    page.wait_for_timeout(300)
    phase = page.evaluate("document.getElementById('exam-speak-phase').textContent")
    check("prep phase starts with 1:00 timer", phase == "Vorbereitung", phase)

    # skip waiting: jump to talk phase, inject transcript, finish
    page.evaluate("clearInterval(examSpeakTimerInt); examSpeakTimerInt = null; examSpeakReadyToTalk()")
    page.wait_for_timeout(150)
    page.evaluate("document.getElementById('exam-speak-talk-btn').click()")
    page.wait_for_timeout(400)
    page.evaluate("""
      examSpeakChunks.push('Ich möchte über das Thema sprechen. Die Leute kauft heute viel im Internet. Es gibt Vorteile und Nachteile.');
      examSpeakFinish();
    """)
    page.wait_for_timeout(700)
    s_chips = page.evaluate("document.querySelectorAll('#exam-speak-scores .exam-score-chip').length")
    s_model = page.evaluate("document.getElementById('exam-speak-model').textContent.length > 0")
    err_final = page.evaluate("JSON.parse(localStorage.getItem('errorLog') || '[]').length")
    check("speak result shows 4 criteria chips + model", s_chips == 4 and s_model, f"chips={s_chips}")
    check("speak correction feeds error log", err_final == err_after + 1, f"{err_after}->{err_final}")
    done = page.evaluate("localStorage.getItem('exam_tasks_done')")
    check("3 exam tasks recorded", done == "3", f"done={done}")
    page.screenshot(path=OUT + r"\x4_speak_result.png")

    # Desktop sanity
    page.set_viewport_size({"width": 1280, "height": 800})
    page.wait_for_timeout(300)
    tab_visible = page.evaluate("getComputedStyle(document.querySelector('.tab[data-mode=\\'exam\\']')).display !== 'none'")
    check("telc B2 tab visible on desktop sidebar", tab_visible)
    sw = page.evaluate("document.documentElement.scrollWidth")
    check("no horizontal overflow", sw <= 1280, f"scrollWidth={sw}")

    check("no JS page errors", not errors, "; ".join(errors[:3]))
    browser.close()

failed = [r for r in results if not r[1]]
print(f"\n{len(results) - len(failed)}/{len(results)} checks passed")
sys.exit(1 if failed else 0)
