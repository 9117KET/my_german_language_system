"""Browser smoke test for the Stories graded-reader feature (API mocked)."""
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

MOCK_STORY = {
    "title": "Der verlorene Schlüssel",
    "title_en": "The Lost Key",
    "level": "b1",
    "sentences": [
        {"de": "Lena wartet auf den Bus vor der Universität.", "en": "Lena waits for the bus in front of the university."},
        {"de": "Sie sucht ihren Schlüssel in der Tasche.", "en": "She looks for her key in the bag."},
        {"de": "Der Schlüssel ist weg.", "en": "The key is gone."},
        {"de": "Am Ende findet sie ihn in ihrer Jacke.", "en": "In the end she finds it in her jacket."},
    ],
    "questions": [
        {"q": "Worauf wartet Lena?", "options": ["Auf den Zug", "Auf den Bus", "Auf eine Freundin"], "answer": 1},
        {"q": "Was sucht sie?", "options": ["Ihren Schlüssel", "Ihr Handy", "Ihre Brille"], "answer": 0},
        {"q": "Wo findet sie ihn?", "options": ["In der Tasche", "Im Bus", "In ihrer Jacke"], "answer": 2},
    ],
    "used_words": ["warten", "suchen"],
}

MOCK_VOCAB = {
    "word": "warten", "article": "none", "pos": "Verb",
    "definition": "to wait", "example": "Ich warte auf den Bus.", "tip": "warten + auf + Akkusativ",
}

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))

    def handle_api(route):
        body = json.loads(route.request.post_data or "{}")
        if body.get("mode") == "story":
            route.fulfill(json=MOCK_STORY)
        elif body.get("mode") == "vocab":
            route.fulfill(json=MOCK_VOCAB)
        else:
            route.fulfill(status=400, json={"error": "unmocked mode"})

    page.route("**/api/chat", handle_api)
    page.goto(URL)
    page.wait_for_timeout(700)

    # 1. Stories reachable via More sheet
    page.click("#more-tab")
    page.wait_for_timeout(250)
    has_item = page.evaluate("!!document.querySelector('.more-item[data-mode=\\'stories\\']')")
    check("Stories appears in More sheet (Practice group)", has_item)
    page.evaluate("document.querySelector('.more-item[data-mode=\\'stories\\']').click()")
    page.wait_for_timeout(300)
    panel_shown = page.evaluate("getComputedStyle(document.getElementById('stories-panel')).display !== 'none'")
    check("Stories panel opens", panel_shown)

    # 2. Vocab preview chips render
    chips = page.evaluate("document.querySelectorAll('.story-vocab-chip').length")
    check("target-word chips shown", chips > 0, f"chips={chips}")
    page.screenshot(path=OUT + r"\s1_setup.png")

    # 3. Generate story (mocked)
    page.click("#story-generate-btn")
    page.wait_for_timeout(600)
    view_shown = page.evaluate("document.getElementById('story-view').style.display !== 'none'")
    title = page.evaluate("document.getElementById('story-title').textContent")
    n_sentences = page.evaluate("document.querySelectorAll('.story-sentence').length")
    check("story renders", view_shown and n_sentences == 4, f"title={title}, sentences={n_sentences}")

    # 4. Target words highlighted
    highlighted = page.evaluate("document.querySelectorAll('.story-target-word').length")
    check("recycled words highlighted", highlighted > 0, f"highlighted={highlighted}")

    # 5. Sentence tap toggles translation (one click on the row, not a tap-word)
    page.evaluate("document.querySelector('.story-sentence[data-idx=\\'0\\']').click()")
    page.wait_for_timeout(150)
    en_visible = page.evaluate("""
      getComputedStyle(document.querySelector('.story-sentence[data-idx="0"] .story-sent-en')).display !== 'none'
    """)
    check("sentence tap reveals translation", en_visible)

    # 6. Show English toggle
    page.click("#story-show-en-btn")
    page.wait_for_timeout(100)
    all_en = page.evaluate("document.getElementById('story-body').classList.contains('show-english')")
    btn_txt = page.evaluate("document.getElementById('story-show-en-btn').textContent")
    check("Show English toggles all translations", all_en and "Hide" in btn_txt, btn_txt)
    page.screenshot(path=OUT + r"\s2_story.png")

    # 7. Tap a word -> vocab popup opens with add-to-words button
    page.evaluate("[...document.querySelectorAll('.tap-word')].find(w => w.dataset.word === 'wartet').click()")
    page.wait_for_timeout(600)
    modal_shown = page.evaluate("document.getElementById('vocab-modal').style.display !== 'none'")
    add_btn_shown = page.evaluate("document.getElementById('vocab-add-btn').style.display !== 'none'")
    check("word tap opens vocab popup", modal_shown)
    check("add-to-words button offered for known word", add_btn_shown)
    page.screenshot(path=OUT + r"\s3_vocab.png")
    if add_btn_shown:
        page.click("#vocab-add-btn")
        page.wait_for_timeout(200)
        added = page.evaluate("""
          (() => { const m = WORDS.find(w => w.german.toLowerCase() === 'warten');
            return m ? !!JSON.parse(localStorage.getItem('wordsSRS'))[String(m.id)] : false; })()
        """)
        check("word saved to SRS as due", added)
    page.evaluate("document.getElementById('vocab-modal').style.display = 'none'")

    # 8. Quiz: answer all three (2 right, 1 wrong) -> result + read count
    page.evaluate("document.querySelector('.story-quiz-opt[data-qi=\\'0\\'][data-oi=\\'1\\']').click()")  # right
    page.evaluate("document.querySelector('.story-quiz-opt[data-qi=\\'1\\'][data-oi=\\'2\\']').click()")  # wrong
    page.evaluate("document.querySelector('.story-quiz-opt[data-qi=\\'2\\'][data-oi=\\'2\\']').click()")  # right
    page.wait_for_timeout(300)
    result_txt = page.evaluate("document.getElementById('story-quiz-result').textContent")
    read_count = page.evaluate("localStorage.getItem('stories_read_count')")
    badge_txt = page.evaluate("document.getElementById('stories-read-badge').textContent")
    check("quiz grades and shows result", "2/3" in result_txt, result_txt)
    check("story read recorded", read_count == "1", f"count={read_count}, badge={badge_txt}")
    page.screenshot(path=OUT + r"\s4_quiz.png")

    # 9. Story persists across reload
    page.reload()
    page.wait_for_timeout(700)
    page.click("#more-tab")
    page.wait_for_timeout(200)
    page.evaluate("document.querySelector('.more-item[data-mode=\\'stories\\']').click()")
    page.wait_for_timeout(300)
    restored = page.evaluate("document.getElementById('story-title').textContent")
    check("last story restored after reload", restored == MOCK_STORY["title"], restored)

    # 10. No layout overflow on mobile
    sw = page.evaluate("document.documentElement.scrollWidth")
    check("no horizontal overflow", sw <= 390, f"scrollWidth={sw}")

    # 11. Desktop: Stories tab visible in Practice group
    page.set_viewport_size({"width": 1280, "height": 800})
    page.wait_for_timeout(300)
    tab_visible = page.evaluate("getComputedStyle(document.querySelector('.tab[data-mode=\\'stories\\']')).display !== 'none'")
    check("Stories tab visible on desktop sidebar", tab_visible)
    page.screenshot(path=OUT + r"\s5_desktop.png")

    check("no JS page errors", not errors, "; ".join(errors[:3]))
    browser.close()

failed = [r for r in results if not r[1]]
print(f"\n{len(results) - len(failed)}/{len(results)} checks passed")
sys.exit(1 if failed else 0)
