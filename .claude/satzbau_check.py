"""Browser smoke test: Satzbau Lab — level map, rule card, all three item types, sprint, mobile fit."""
import sys
sys.stdout.reconfigure(encoding="utf-8")
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8123/index.html"
results = []


def check(name, ok, detail=""):
    results.append((name, ok, detail))
    print(("PASS " if ok else "FAIL ") + name + (f" -- {detail}" if detail else ""))


def visible(page, el_id):
    return page.evaluate(
        "id => { const e = document.getElementById(id);"
        " return !!e && getComputedStyle(e).display !== 'none'; }",
        el_id,
    )


with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))

    page.goto(URL)
    page.wait_for_timeout(800)

    # ---- data loaded ----
    n_levels = page.evaluate("SATZBAU_LEVELS.length")
    n_items = page.evaluate("SATZBAU_LEVELS.reduce((a,l)=>a+l.items.length,0)")
    check("satzbau_data.js loaded", n_levels == 14, f"{n_levels} levels, {n_items} items")

    # ---- open the game the way a user does: Games tab, then the card ----
    page.evaluate("document.querySelector('.tab[data-mode=\"games\"]').click()")
    page.wait_for_timeout(400)
    check("games tab hides the today panel", not visible(page, "today-panel"))
    page.evaluate("document.getElementById('game-card-satzbaulab').click()")
    page.wait_for_timeout(400)
    check("satzbau-view visible", visible(page, "satzbau-view"))
    check("games landing hidden", not visible(page, "games-landing"))
    check("level map visible", visible(page, "sl-map-section"))
    cards = page.evaluate("document.querySelectorAll('.sl-level-card').length")
    check("level map renders 14 cards", cards == 14, f"{cards} cards")
    chips = page.evaluate(
        "[...document.querySelectorAll('#sl-level-grid .sl-cefr-chip')].map(e=>e.textContent).join(',')"
    )
    check("CEFR chips rendered", chips.startswith("A1,A1,A1,A2"), chips)

    # ---- rule card ----
    page.evaluate("slOpenLevel('nebensatz')")
    page.wait_for_timeout(300)
    check("learn card visible", visible(page, "sl-learn-section"))
    check(
        "rule diagram uses .satz-part chips",
        page.evaluate("document.querySelectorAll('#sl-rule-diagram .satz-part').length") >= 3,
    )
    check(
        "rule points + examples rendered",
        page.evaluate("document.querySelectorAll('#sl-rule-points li').length") >= 3
        and page.evaluate("document.querySelectorAll('#sl-rule-examples .sl-example').length") >= 3,
    )
    check("contrast block rendered", visible(page, "sl-rule-contrast"))
    page.screenshot(path=".claude/satzbau_learn.png")

    # ---- play: order item ----
    page.evaluate("""
      slStartLevel('nebensatz');
      // force an order item to the front of the queue
      const i = slQueue.findIndex(x => x.type === 'order');
      slQueue.unshift(slQueue.splice(i,1)[0]);
      slIdx = 0; slRenderItem();
    """)
    page.wait_for_timeout(300)
    check("play section visible", visible(page, "sl-play-section"))
    check("build zone + bank tiles rendered", page.evaluate("document.querySelectorAll('.sl-tile-bank').length") >= 3)

    # build it correctly by placing parts in target order
    page.evaluate("""
      const item = slCurrent();
      slBuilt = item.parts.slice();
      slBank = [];
      slRenderOrder();
      slCheck();
    """)
    page.wait_for_timeout(300)
    check("correct order item is graded correct", page.evaluate("slCorrect") == 1)
    check("feedback shown with why line", visible(page, "sl-feedback")
          and len(page.evaluate("document.getElementById('sl-feedback-why').textContent")) > 10)
    check("correct sentence shown as labelled chips",
          page.evaluate("document.querySelectorAll('#sl-feedback-correct .satz-part').length") >= 3)
    page.screenshot(path=".claude/satzbau_order.png")

    # ---- play: wrong order logs an error ----
    page.evaluate("localStorage.setItem('errorLog','[]')")
    page.evaluate("""
      slNext();
      const i = slQueue.findIndex((x,ix) => x.type === 'order' && ix >= slIdx);
      if (i > -1) { slQueue.unshift(slQueue.splice(i,1)[0]); slIdx = 0; }
      slRenderItem();
      const item = slCurrent();
      slBuilt = item.parts.slice().reverse();
      slBank = [];
      slRenderOrder();
      slCheck();
    """)
    page.wait_for_timeout(300)
    log = page.evaluate("JSON.parse(localStorage.getItem('errorLog')||'[]')")
    check("wrong answer writes to errorLog", len(log) == 1, f"{len(log)} entries")
    check("errorLog source is 'satzbau'", bool(log) and log[0]["source"] == "satzbau")
    check("'satzbau' has a display label", page.evaluate("ERROR_SOURCE_LABELS.satzbau") == "Satzbau")

    # ---- play: conj item ----
    page.evaluate("""
      slStartLevel('pos0');
      const i = slQueue.findIndex(x => x.type === 'conj');
      slQueue.unshift(slQueue.splice(i,1)[0]);
      slIdx = 0; slRenderItem();
      slPickConj(slCurrent().answer);
    """)
    page.wait_for_timeout(300)
    check("conj options rendered", page.evaluate("document.querySelectorAll('.sl-conj-option').length") >= 3)
    check("conj result shown", visible(page, "sl-conj-result"))
    check("conj correct answer scores", page.evaluate("slCorrect") == 1)
    page.screenshot(path=".claude/satzbau_conj.png")

    # ---- play: fix item ----
    page.evaluate("""
      slStartLevel('nebensatz');
      const i = slQueue.findIndex(x => x.type === 'fix');
      slQueue.unshift(slQueue.splice(i,1)[0]);
      slIdx = 0; slRenderItem();
      slPickFix(slCurrent().badIndex);
    """)
    page.wait_for_timeout(300)
    check("fix tokens rendered", page.evaluate("document.querySelectorAll('.sl-fix-token').length") >= 4)
    check("correct fix pick scores", page.evaluate("slCorrect") == 1)
    check("fix marks the culprit green",
          page.evaluate("document.querySelectorAll('.sl-fix-token.correct').length") == 1)
    page.screenshot(path=".claude/satzbau_fix.png")

    # ---- level completion persists progress ----
    page.evaluate("localStorage.setItem('satzbau_progress','{}')")
    page.evaluate("slStartLevel('v2'); slCorrect = 5; slIdx = slQueue.length; slFinishLevel()")
    page.wait_for_timeout(300)
    check("done section visible", visible(page, "sl-done-section"))
    prog = page.evaluate("JSON.parse(localStorage.getItem('satzbau_progress')||'{}')")
    check("progress saved for the level", prog.get("v2", {}).get("best") == 5, str(prog.get("v2")))
    streak = page.evaluate("getSatzbauStreak()")
    check("day streak recorded", streak >= 1, f"streak={streak}")

    # ---- sprint ----
    page.evaluate("slOpenSprintSetup()")
    check("sprint setup visible", visible(page, "sl-sprint-section"))
    page.evaluate("slSprintBand='B2'; slSprintDur=60; slStartSprint()")
    page.wait_for_timeout(400)
    check("sprint running", page.evaluate("slSprint") is True)
    check("timer visible", visible(page, "sl-timer"))
    pool = page.evaluate("slSprintPool('B2').length")
    check("B2 sprint pool is non-empty", pool > 50, f"{pool} items")
    page.evaluate("slEndSprint()")
    page.wait_for_timeout(200)
    check("sprint ends cleanly", page.evaluate("slSprint") is False and visible(page, "sl-done-section"))
    page.screenshot(path=".claude/satzbau_sprint.png")

    # ---- navigation back out ----
    page.evaluate("slShowMap(); slBack()")
    page.wait_for_timeout(300)
    check("back returns to games landing", visible(page, "games-landing") and not visible(page, "satzbau-view"))

    # ---- mobile fit ----
    page.evaluate("openSatzbauLab()")
    page.wait_for_timeout(300)
    width = page.evaluate("document.documentElement.scrollWidth")
    check("no horizontal overflow at 390px", width <= 390, f"scrollWidth={width}")
    page.screenshot(path=".claude/satzbau_map.png", full_page=True)

    check("no JS page errors", not errors, "; ".join(errors[:3]))
    browser.close()

failed = [r for r in results if not r[1]]
print(f"\n{len(results) - len(failed)}/{len(results)} checks passed")
sys.exit(1 if failed else 0)
