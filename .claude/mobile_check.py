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
    check("4 visible bar items", len(visible) == 4, str(visible))

    page.screenshot(path=OUT + r"\shot_1_bar.png")

    # 4. Open More sheet
    page.click("#more-tab")
    page.wait_for_timeout(300)
    sheet_visible = page.evaluate("document.getElementById('more-sheet').style.display !== 'none'")
    check("More sheet opens", sheet_visible)
    item_count = page.evaluate("document.querySelectorAll('.more-item').length")
    check("sheet has the overflow tabs", item_count == 13, f"count={item_count}")
    page.screenshot(path=OUT + r"\shot_2_sheet.png")

    # 5. Tap Vocab in sheet -> panel shows, sheet closes, More marked active
    page.click('.more-item[data-mode="vocab"]')
    page.wait_for_timeout(300)
    words_shown = page.evaluate("getComputedStyle(document.getElementById('vocab-panel')).display !== 'none'")
    sheet_closed = page.evaluate("document.getElementById('more-sheet').style.display === 'none'")
    more_active = page.evaluate("document.getElementById('more-tab').classList.contains('active')")
    check("Vocab panel opens from sheet", words_shown)
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

    # 9. Mobile-first layer: touch floor, thumb-zone session bar, PWA hooks
    page.set_viewport_size({"width": 390, "height": 844})
    page.click('.tab[data-mode="today"]')
    page.wait_for_timeout(400)

    small = page.evaluate("""
      [...document.querySelectorAll('#today-start-btn, #mode-tabs .tab, #today-summary .today-row')]
        .filter(el => el.offsetParent !== null && el.getBoundingClientRect().height < 52)
        .map(el => (el.id || el.className) + ':' + Math.round(el.getBoundingClientRect().height))
    """)
    check("every visible target clears 52px", not small, str(small[:4]))

    hero = page.evaluate("!!document.getElementById('today-hero-title').textContent.trim()")
    check("resume hero has copy", hero)

    rows = page.evaluate("document.querySelectorAll('#today-summary .today-row').length")
    check("attention rows render", rows == 3, f"rows={rows}")

    page.screenshot(path=OUT + r"\shot_6_today_mobile.png")

    page.click("#today-start-btn")
    page.wait_for_timeout(500)
    nav_hidden = page.evaluate("getComputedStyle(document.querySelector('.app-sidebar')).display === 'none'")
    bar_bottom = page.evaluate("""
      (() => {
        const b = document.getElementById('today-session-bar');
        const r = b.getBoundingClientRect();
        return getComputedStyle(b).position === 'fixed' && r.bottom >= window.innerHeight - 2;
      })()
    """)
    check("bottom nav steps aside during a session", nav_hidden)
    check("session bar sits in the thumb zone", bar_bottom)
    page.screenshot(path=OUT + r"\shot_7_session.png")

    manifest = page.evaluate("!!document.querySelector('link[rel=manifest]')")
    touch_icon = page.evaluate('!!document.querySelector("link[rel=\'apple-touch-icon\']")')
    check("manifest linked", manifest)
    check("apple touch icon linked", touch_icon)

    check("no JS page errors", not errors, "; ".join(errors[:3]))

    browser.close()

failed = [r for r in results if not r[1]]
print(f"\n{len(results) - len(failed)}/{len(results)} checks passed")
sys.exit(1 if failed else 0)
