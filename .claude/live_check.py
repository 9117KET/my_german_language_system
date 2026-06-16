"""Drive the DEPLOYED app and capture every /api/chat request + response."""
import sys
sys.stdout.reconfigure(encoding="utf-8")
from playwright.sync_api import sync_playwright

URL = "https://my-german-language-system.vercel.app"

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))

    api_log = []
    def on_response(resp):
        if "/api/" in resp.url:
            try:
                body = resp.text()
            except Exception as ex:
                body = f"<unreadable: {ex}>"
            api_log.append((resp.request.method, resp.url.split(".app")[-1], resp.status, len(body or ""), (body or "")[:120]))
    page.on("response", on_response)

    page.goto(URL)
    page.wait_for_timeout(1200)

    # AI tab -> Correct mode -> send a sentence
    page.evaluate("document.querySelector('.tab[data-mode=\\'ai\\']').click()")
    page.wait_for_timeout(400)
    page.evaluate("document.querySelector('.ai-sub-btn[data-aimode=\\'correct\\']').click()")
    page.wait_for_timeout(200)
    page.evaluate("sendToAI('Ich gehe zu die Schule')")
    page.wait_for_timeout(6000)
    result_text = page.evaluate("document.getElementById('ai-result-body').textContent.slice(0, 200)")
    print("CORRECT result:", result_text)

    # Stories -> generate
    page.click("#more-tab")
    page.wait_for_timeout(300)
    page.evaluate("document.querySelector('.more-item[data-mode=\\'stories\\']').click()")
    page.wait_for_timeout(300)
    page.evaluate("document.getElementById('story-generate-btn').click()")
    page.wait_for_timeout(9000)
    story_err = page.evaluate("document.getElementById('story-error').textContent")
    story_title = page.evaluate("document.getElementById('story-title').textContent")
    print("STORY title:", story_title, "| error:", story_err or "(none)")

    print("\nAPI calls observed:")
    for m, u, s, ln, b in api_log:
        print(f"  {m} {u} -> {s} len={ln} body[:120]={b!r}")
    print("\nJS page errors:", errors or "(none)")
    browser.close()
