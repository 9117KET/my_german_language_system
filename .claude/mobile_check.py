"""Quick mobile-viewport smoke test for the new bottom nav + More sheet."""
import sys
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8123/index.html"
OUT = r".claude"

results = []

def check(name, ok, detail=""):
    results.append((name, ok, detail))
    print(("PASS " if ok else "FAIL ") + name + (f" -- {detail}" if detail else ""))

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(URL)
    page.wait_for_timeout(800)

    # 1. No horizontal page scroll
    sw = page.evaluate("document.documentElement.scrollWidth")
    iw = page.evaluate("window.innerWidth")
    check("no horizontal page overflow", sw <= iw, f"scrollWidth={sw} innerWidth={iw}")

    # 2. Tab bar does not scroll horizontally
    tab_sw = page.evaluate("document.getElementById('mode-tabs').scrollWidth")
    tab_cw = page.evaluate("document.getElementById('mode-tabs').clientWidth")
    check("tab bar fits without scroll", tab_sw <= tab_cw + 1, f"scrollWidth={tab_sw} clientWidth={tab_cw}")

    # 3. Exactly 5 visible items in bottom bar
    visible = page.evaluate("""
      [...document.querySelectorAll('#mode-tabs .tab')]
        .filter(t => getComputedStyle(t).display !== 'none')
        .map(t => t.dataset.mode || t.id)
    """)
    check("5 visible bar items", len(visible) == 5, str(visible))

    page.screenshot(path=OUT + r"\shot_1_bar.png")

    # 4. Open More sheet
    page.click("#more-tab")
    page.wait_for_timeout(300)
    sheet_visible = page.evaluate("document.getElementById('more-sheet').style.display !== 'none'")
    check("More sheet opens", sheet_visible)
    item_count = page.evaluate("document.querySelectorAll('.more-item').length")
    check("sheet has the overflow tabs", item_count == 12, f"count={item_count}")
    page.screenshot(path=OUT + r"\shot_2_sheet.png")

    # 5. Tap Words in sheet -> words panel shows, sheet closes, More marked active
    page.click('.more-item[data-mode="words"]')
    page.wait_for_timeout(300)
    words_shown = page.evaluate("getComputedStyle(document.getElementById('words-panel')).display !== 'none'")
    sheet_closed = page.evaluate("document.getElementById('more-sheet').style.display === 'none'")
    more_active = page.evaluate("document.getElementById('more-tab').classList.contains('active')")
    check("Words panel opens from sheet", words_shown)
    check("sheet closes after selection", sheet_closed)
    check("More button highlighted for sheet mode", more_active)
    page.screenshot(path=OUT + r"\shot_3_words.png")

    # 6. Back to a primary tab -> More loses highlight
    page.click('.tab[data-mode="recall"]')
    page.wait_for_timeout(300)
    more_active2 = page.evaluate("document.getElementById('more-tab').classList.contains('active')")
    recall_active = page.evaluate("document.querySelector('.tab[data-mode=\\'recall\\']').classList.contains('active')")
    check("primary tab regains highlight", recall_active and not more_active2)
    page.screenshot(path=OUT + r"\shot_4_recall.png")

    # 7. Sheet item active state syncs when reopened
    page.click("#more-tab")
    page.wait_for_timeout(200)
    active_items = page.evaluate("[...document.querySelectorAll('.more-item.active')].map(i => i.dataset.mode)")
    check("no stale active item in sheet", active_items == [], str(active_items))
    page.click("#more-tab")  # close again

    # 8. Desktop viewport: More tab hidden, group labels visible, all tabs shown
    page.set_viewport_size({"width": 1280, "height": 800})
    page.wait_for_timeout(300)
    more_hidden = page.evaluate("getComputedStyle(document.getElementById('more-tab')).display === 'none'")
    labels_visible = page.evaluate("getComputedStyle(document.querySelector('.nav-group-label')).display !== 'none'")
    tabs_visible = page.evaluate("""
      [...document.querySelectorAll('#mode-tabs .tab[data-mode]')]
        .filter(t => getComputedStyle(t).display !== 'none').length
    """)
    total_tabs = page.evaluate("document.querySelectorAll('#mode-tabs .tab[data-mode]').length")
    check("More hidden on desktop", more_hidden)
    check("group labels visible on desktop", labels_visible)
    check("all tabs visible on desktop", tabs_visible == total_tabs, f"visible={tabs_visible}/{total_tabs}")
    page.screenshot(path=OUT + r"\shot_5_desktop.png")

    check("no JS page errors", not errors, "; ".join(errors[:3]))

    browser.close()

failed = [r for r in results if not r[1]]
print(f"\n{len(results) - len(failed)}/{len(results)} checks passed")
sys.exit(1 if failed else 0)
