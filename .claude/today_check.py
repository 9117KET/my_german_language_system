"""Browser smoke test: Today session, due badges, drill mistake bank, mobile nav."""
import sys
sys.stdout.reconfigure(encoding="utf-8")
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8123/index.html"
OUT = r".claude"
results = []

def check(name, ok, detail=""):
    results.append((name, ok, detail))
    print(("PASS " if ok else "FAIL ") + name + (f" -- {detail}" if detail else ""))

# Seed: one phrase due yesterday, one word due yesterday, one drill mistake
SEED = """
(() => {
  const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  localStorage.setItem("srsData", JSON.stringify({
    "1": { interval: 1, easeFactor: 2.5, dueDate: y, lastReviewed: y, totalReviews: 1, totalCorrect: 1, archived: false }
  }));
  localStorage.setItem("wordsSRS", JSON.stringify({
    "1": { interval: 1, easeFactor: 2.5, dueDate: y, lastReviewed: y, totalReviews: 1, totalCorrect: 1 }
  }));
  localStorage.setItem("drillMistakeBank", JSON.stringify({
    "Ich warte ___ den Bus.": {
      setKey: "akkusativ", sentence: "Ich warte ___ den Bus.", answer: "auf",
      distractors: ["an", "mit", "zu"], rule: "warten + auf + Akkusativ", misses: 2, ts: Date.now()
    }
  }));
})()
"""

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(URL)
    page.evaluate(SEED)
    page.reload()
    page.wait_for_timeout(800)

    # 1. Lands on Today panel
    today_shown = page.evaluate("getComputedStyle(document.getElementById('today-panel')).display !== 'none'")
    check("lands on Today panel", today_shown)

    # 2. Bottom bar has today/recall/speak/ai/more, no overflow
    visible = page.evaluate("""
      [...document.querySelectorAll('#mode-tabs .tab')]
        .filter(t => getComputedStyle(t).display !== 'none')
        .map(t => t.dataset.mode || t.id)
    """)
    check("bar = today/recall/speak/ai/more", visible == ["today", "recall", "speak", "ai", "more-tab"], str(visible))
    sw = page.evaluate("document.documentElement.scrollWidth")
    check("no horizontal overflow", sw <= 390, f"scrollWidth={sw}")

    # 3. Due badges visible on recall tab and More button (words is in sheet)
    recall_badge = page.evaluate("""
      (() => { const b = document.querySelector('.tab[data-mode="recall"] .tab-badge');
        return b && b.classList.contains('visible') ? b.textContent : null; })()
    """)
    more_badge = page.evaluate("""
      (() => { const b = document.querySelector('#more-tab .tab-badge');
        return b && b.classList.contains('visible') ? b.textContent : null; })()
    """)
    check("recall badge shows 1 due", recall_badge == "1", str(recall_badge))
    check("More badge shows 1 due word", more_badge == "1", str(more_badge))

    # 4. Today panel stats and mistakes hint
    stats = page.evaluate("""
      ({ phrases: document.getElementById('today-phrases-due').textContent,
         words: document.getElementById('today-words-due').textContent,
         mistakes: document.getElementById('today-mistakes-count').textContent })
    """)
    check("Today stats: 1 phrase, 1 word, 1 mistake",
          stats == {"phrases": "1", "words": "1", "mistakes": "1"}, str(stats))
    hint_shown = page.evaluate("document.getElementById('today-mistakes-hint').style.display !== 'none'")
    check("mistakes hint visible", hint_shown)
    page.screenshot(path=OUT + r"\t1_today.png")

    # 5. Start session -> recall mode, session bar visible with Phrases label
    page.click("#today-start-btn")
    page.wait_for_timeout(400)
    in_recall = page.evaluate("document.querySelector('.tab[data-mode=\\'recall\\']').classList.contains('active')")
    bar_shown = page.evaluate("document.getElementById('today-session-bar').style.display !== 'none'")
    label = page.evaluate("document.getElementById('tsb-label').textContent")
    check("session starts in Recall", in_recall and bar_shown, f"label={label}")
    check("bar shows phrase progress", "Phrases 0/" in label, label)
    page.screenshot(path=OUT + r"\t2_session_recall.png")

    # 6. Grade phrases via the Got it button until step completes
    target = page.evaluate("todaySession.phrasesTarget")
    for _ in range(int(target)):
        page.evaluate("document.getElementById('card').click()")  # reveal
        page.wait_for_timeout(100)
        page.evaluate("document.getElementById('got-it-btn').click()")
        page.wait_for_timeout(150)
    cont_shown = page.evaluate("document.getElementById('tsb-next-btn').style.display !== 'none'")
    check(f"phrase step completes after {target} grades", cont_shown,
          page.evaluate("document.getElementById('tsb-label').textContent"))
    page.screenshot(path=OUT + r"\t3_step_done.png")

    # 7. Continue -> words step; grade words until complete
    page.click("#tsb-next-btn")
    page.wait_for_timeout(400)
    in_words = page.evaluate("getComputedStyle(document.getElementById('words-panel')).display !== 'none'")
    check("continues to Words step", in_words)
    wtarget = int(page.evaluate("todaySession.wordsTarget"))
    for _ in range(wtarget):
        page.evaluate("handleWordSRS('good')")
        page.wait_for_timeout(60)
    cont2 = page.evaluate("document.getElementById('tsb-next-btn').style.display !== 'none'")
    check(f"word step completes after {wtarget} grades", cont2)

    # 8. Continue -> speak; skip -> think; simulate think done -> finish
    page.click("#tsb-next-btn")
    page.wait_for_timeout(300)
    in_speak = page.evaluate("getComputedStyle(document.getElementById('speak-panel')).display !== 'none'")
    check("continues to Speak step", in_speak)
    page.click("#tsb-skip-btn")  # skip speak (mic not available headless)
    page.wait_for_timeout(300)
    in_think = page.evaluate("getComputedStyle(document.getElementById('monologue-panel')).display !== 'none'")
    check("skips to Think step", in_think)
    page.evaluate("todayOnThinkDone()")  # simulate successful reflection
    page.wait_for_timeout(200)
    finish_label = page.evaluate("document.getElementById('tsb-next-btn').textContent")
    check("last step shows Finish", "Finish" in finish_label, finish_label)
    page.click("#tsb-next-btn")
    page.wait_for_timeout(400)
    back_on_today = page.evaluate("getComputedStyle(document.getElementById('today-panel')).display !== 'none'")
    bar_gone = page.evaluate("document.getElementById('today-session-bar').style.display === 'none'")
    streak = page.evaluate("document.getElementById('today-streak-num').textContent")
    btn_txt = page.evaluate("document.getElementById('today-start-btn').textContent")
    check("session completes back on Today", back_on_today and bar_gone)
    check("streak recorded as 1", streak == "1", streak)
    check("button shows done state", "Done today" in btn_txt, btn_txt)
    page.screenshot(path=OUT + r"\t4_complete.png")

    # 9. Drills panel shows mistake review card; answering correctly clears it
    page.evaluate("document.querySelector('.more-item[data-mode=\\'drills\\']') ? null : document.getElementById('more-tab').click()")
    page.wait_for_timeout(200)
    page.evaluate("document.querySelector('.more-item[data-mode=\\'drills\\']').click()")
    page.wait_for_timeout(300)
    card_shown = page.evaluate("!!document.querySelector('.drill-mistakes-card')")
    check("mistake review card in Drills", card_shown)
    page.screenshot(path=OUT + r"\t5_drills.png")
    page.evaluate("openMistakeReviewSession()")
    page.wait_for_timeout(300)
    page.evaluate("answerDrill('auf')")  # correct answer clears it
    page.wait_for_timeout(200)
    bank_size = page.evaluate("Object.keys(getDrillMistakeBank()).length")
    check("correct answer clears mistake from bank", bank_size == 0, f"bank={bank_size}")

    # 10. Wrong answers get recorded from a normal drill session
    page.evaluate("document.getElementById('drill-close').click()")
    page.evaluate("openDrillSetSession('akkusativ')")
    page.wait_for_timeout(200)
    wrong = page.evaluate("""
      (() => { const item = drillQueue[drillIdx];
        const w = item.options.find(o => o.toLowerCase() !== item.blank.toLowerCase());
        answerDrill(w); return w; })()
    """)
    page.wait_for_timeout(200)
    bank_size2 = page.evaluate("Object.keys(getDrillMistakeBank()).length")
    check("wrong drill answer recorded in bank", bank_size2 == 1, f"bank={bank_size2}")
    page.evaluate("document.getElementById('drill-close').click()")

    # 11. Desktop: Today tab visible at top, badges inline
    page.set_viewport_size({"width": 1280, "height": 800})
    page.wait_for_timeout(300)
    first_tab = page.evaluate("document.querySelector('#mode-tabs .tab').dataset.mode")
    check("Today is first sidebar tab", first_tab == "today", first_tab)
    page.screenshot(path=OUT + r"\t6_desktop.png")

    check("no JS page errors", not errors, "; ".join(errors[:3]))
    browser.close()

failed = [r for r in results if not r[1]]
print(f"\n{len(results) - len(failed)}/{len(results)} checks passed")
sys.exit(1 if failed else 0)
