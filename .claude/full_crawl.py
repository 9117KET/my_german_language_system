"""Comprehensive end-to-end crawler for the language-learning SPA.

Walks every navigation tab and exercises the core interaction of each feature
(Recall, Words, Drills, Stories, telc-B2 Exam, all 5 Games, AI sub-modes, Today
session, Progress) on both desktop and mobile, with all /api backends mocked so
the run is deterministic and offline.

It collects JS page errors and console errors (tagged by the area being exercised)
and prints a severity-sorted report. Exits non-zero if any ERROR/CONSOLE row
remains, so it doubles as a CI gate.

Prereq: a static server on http://127.0.0.1:8123 serving the repo root, e.g.
    python -m http.server 8123 --bind 127.0.0.1

Run:    python .claude/full_crawl.py          (headless)
        CRAWL_HEADED=1 python .claude/full_crawl.py   (visible browser)
"""
import json
import os
import sys
import time

sys.stdout.reconfigure(encoding="utf-8")
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8123/index.html"
SHOTS = os.path.join(os.path.dirname(__file__), "crawl_shots")
os.makedirs(SHOTS, exist_ok=True)
HEADED = os.environ.get("CRAWL_HEADED") == "1"

rows = []            # (severity, area, message)
js_errors = []       # (area, message)
console_errors = []  # (area, message)
modes_seen = set()
current = ["load"]


def rec(sev, area, msg):
    rows.append((sev, area, msg))
    print(f"{sev:7} [{area:9}] {msg}")


# ---- /api mock: tailor the response shape per mode ----------------------------
def mock_chat(route):
    try:
        body = json.loads(route.request.post_data or "{}")
    except Exception:
        body = {}
    m = body.get("mode", "")
    modes_seen.add(m)
    if m == "translate":
        payload = {"german": "Ich gehe nach Hause.", "english": "I go home.",
                   "category": "daily", "is_correct": True}
    elif m in ("correct", "write-check"):
        payload = {"corrected": "Ich gehe nach Hause.", "original": "ich gehen nach hause",
                   "explanation": "Konjugation korrigiert.", "is_correct": False}
    elif m == "recall-check":
        payload = {"is_correct": True, "feedback": "Sehr gut, das ist korrekt!", "hint": ""}
    elif m == "speak-check":
        payload = {"feedback": "Gute Aussprache, achte auf den Artikel.", "is_correct": True}
    elif m == "speak-improve":
        payload = {"improved": "Ich würde gerne ins Kino gehen.", "german": "Ich würde gerne ins Kino gehen."}
    elif m == "chat":
        payload = {"reply": "Hallo! Schön, dich zu sehen. Wie geht es dir?",
                   "correction": None, "hint": "Antworte auf Deutsch."}
    elif m == "story":
        payload = {"title": "Der verlorene Schlüssel", "title_en": "The Lost Key", "level": "b1",
                   "sentences": [
                       {"de": "Lena wartet auf den Bus.", "en": "Lena waits for the bus."},
                       {"de": "Sie sucht ihren Schlüssel.", "en": "She looks for her key."},
                       {"de": "Der Schlüssel ist weg.", "en": "The key is gone."},
                       {"de": "Am Ende findet sie ihn.", "en": "In the end she finds it."}],
                   "questions": [
                       {"q": "Worauf wartet Lena?", "options": ["Auf den Zug", "Auf den Bus"], "answer": 1},
                       {"q": "Was sucht sie?", "options": ["Den Schlüssel", "Das Handy"], "answer": 0}],
                   "used_words": ["warten", "suchen"],
                   "episode": body.get("series", {}).get("episode", 1) if isinstance(body.get("series"), dict) else None,
                   "summary": "Lena lost her key and found it.",
                   "characters": "Lena: curious student",
                   "cliffhanger": "Who put the key back?"}
    elif m == "exam-sprachbausteine":
        payload = {"title": "Reklamation", "text": "Sehr geehrte Damen und Herren, ___ ...",
                   "items": [{"num": i + 1, "options": ["seit", "vor", "ab"], "answer": 0,
                              "rule": f"Rule {i + 1}", "sentence": f"Testsatz {i + 1} mit ___."}
                             for i in range(10)]}
    elif m == "exam-write-feedback":
        payload = {"scores": {"inhalt": "B", "kommunikation": "A", "korrektheit": "C", "wortschatz": "B"},
                   "points_covered": [True, True, False, True],
                   "overall": "Solid attempt; tighten case endings.",
                   "corrections": [{"original": "mit den Bus", "corrected": "mit dem Bus",
                                    "explanation": "mit takes Dativ"}],
                   "model": "Sehr geehrte Damen und Herren,\n\nhiermit ...\n\nMit freundlichen Grüßen"}
    elif m == "exam-speak-feedback":
        payload = {"scores": {"aufgabe": "B", "fluessigkeit": "B", "korrektheit": "B", "ausdruck": "A"},
                   "overall": "Good structure.",
                   "corrections": [{"original": "die Leute kauft", "corrected": "die Leute kaufen",
                                    "explanation": "Plural subject"}],
                   "model": "Ich möchte über das Thema sprechen ..."}
    elif m == "error-profile":
        payload = {"summary": "Häufigste Fehler: Kasus nach Präpositionen.",
                   "patterns": [{"label": "Dativ nach Präpositionen", "count": 3, "tip": "mit/nach/bei + Dativ"}]}
    elif m == "error-drills":
        payload = {"items": [{"sentence": "Ich fahre mit ___ Bus.", "options": ["dem", "den", "der"],
                              "answer": 0, "rule": "mit + Dativ"}]}
    elif m == "vocab":
        payload = {"word": "warten", "article": "none", "pos": "Verb",
                   "definition": "to wait", "example": "Ich warte auf den Bus.", "tip": "warten + auf + Akk."}
    else:
        # Unknown mode: return a permissive superset so the flow keeps running,
        # but record it so coverage gaps are visible.
        rec("INFO", current[0], f"unmocked /api mode '{m}' -> generic fallback")
        payload = {"reply": "ok", "feedback": "ok", "corrected": "ok", "explanation": "ok",
                   "is_correct": True, "german": "ok", "english": "ok", "sentences": [], "items": []}
    route.fulfill(status=200, content_type="application/json", body=json.dumps(payload))


def build_seed_script(browser):
    """Pre-flight: read real PHRASE/WORD ids (they are `const`s, not window props,
    and only exist after data.js runs), then build an init-script that seeds the
    SRS stores so Recall/Words/Today exercise the *due* path, not just new cards.
    Seeding must run via add_init_script BEFORE the first navigation: a plain
    localStorage write + reload gets clobbered because the in-memory `srsData`
    binding is unreachable from page.evaluate (it is a script-scope `let`)."""
    pre = browser.new_page()
    pre.goto(URL, wait_until="networkidle")
    pre.wait_for_timeout(500)
    ids = pre.evaluate("""()=>({ph:(typeof PHRASES!=='undefined'?PHRASES:[]).slice(0,12).map(p=>p.id),
                               w:(typeof WORDS!=='undefined'?WORDS:[]).slice(0,12).map(x=>x.id)})""")
    pre.close()
    past = "2020-01-01"
    rec_for = lambda arr: {str(i): {"interval": 1, "easeFactor": 2.5, "dueDate": past,
                                    "lastReviewed": past, "totalReviews": 2, "totalCorrect": 1,
                                    "archived": False} for i in arr}
    srs = json.dumps(json.dumps(rec_for(ids["ph"])))
    wsrs = json.dumps(json.dumps(rec_for(ids["w"])))
    rec("INFO", "seed", f"seeding {len(ids['ph'])} phrases + {len(ids['w'])} words as due")
    return f"localStorage.setItem('srsData', {srs}); localStorage.setItem('wordsSRS', {wsrs});"


def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=not HEADED)
        seed_script = build_seed_script(browser)
        page = browser.new_page(viewport={"width": 1280, "height": 880})
        page.add_init_script(seed_script)
        page.on("pageerror", lambda e: (js_errors.append((current[0], str(e))),
                                        rec("ERROR", current[0], str(e)[:140])))
        page.on("console", lambda mm: (console_errors.append((current[0], mm.text)),
                                       rec("CONSOLE", current[0], mm.text[:140]))
                if mm.type == "error" else None)
        page.on("dialog", lambda d: d.accept())
        page.route("**/api/chat", mock_chat)
        page.route("**/api/deepgram-token",
                   lambda r: r.fulfill(status=200, content_type="application/json",
                                       body='{"token":"mock","key":"mock"}'))
        # /api/sync: pull -> empty store, push -> ok
        page.route("**/api/sync", lambda r: r.fulfill(
            status=200, content_type="application/json",
            body='{"data": null}' if '"pull"' in (r.request.post_data or "") else '{"ok": true}'))

        # ---- helpers (defined against `page`) --------------------------------
        def goto_tab(mode):
            current[0] = mode
            page.evaluate("""(m)=>{const t=document.querySelector(`#mode-tabs [data-mode="${m}"]`)
                || document.querySelector(`.tab[data-mode="${m}"]`); if(t) t.click();}""", mode)
            page.wait_for_timeout(400)

        def click(sel):
            return page.evaluate("""(s)=>{const e=document.querySelector(s);
                if(e){e.click(); return true;} return false;}""", sel)

        def visible(sel):
            # Note: don't rely on offsetParent — it is null for position:fixed elements
            # (e.g. the drill modal), which would falsely report them as hidden.
            return page.evaluate("""(s)=>{const e=document.querySelector(s); if(!e) return false;
                const st=getComputedStyle(e); const r=e.getBoundingClientRect();
                return st.display!=='none'&&st.visibility!=='hidden'&&
                       parseFloat(st.opacity||'1')>0&&r.width>0&&r.height>0;}""", sel)

        def count(sel):
            return page.eval_on_selector_all(sel, "els=>els.length")

        def shot(name):
            page.screenshot(path=os.path.join(SHOTS, name + ".png"))

        def probe(area, fn):
            """Run a deep flow, isolating failures so one broken feature can't abort the crawl."""
            current[0] = area
            before = len(js_errors)
            try:
                fn()
            except Exception as e:
                rec("WARN", area, f"flow raised: {str(e)[:90]}")
            if len(js_errors) == before:
                rec("OK", area, "flow completed without JS errors")

        # ---- load (SRS already seeded via add_init_script) -------------------
        page.goto(URL, wait_until="networkidle")
        page.wait_for_timeout(700)

        # ---- 1. desktop tab sweep -------------------------------------------
        tabs = page.eval_on_selector_all("#mode-tabs [data-mode]",
                                         "els=>[...new Set(els.map(e=>e.getAttribute('data-mode')))]")
        rec("INFO", "sweep", f"{len(tabs)} nav tabs: {tabs}")
        # listen/recall/shadow share the flashcard UI (#card-area) instead of a *-panel.
        CARD_MODES = {"listen", "recall", "shadow"}
        for m in tabs:
            goto_tab(m)
            if m in CARD_MODES:
                panel = page.evaluate("""()=>{const e=document.getElementById('card-area');
                    if(!e||getComputedStyle(e).display==='none') return null;
                    return {id:'card-area', len:(e.innerText||'').trim().length};}""")
            else:
                panel = page.evaluate("""()=>{const v=[...document.querySelectorAll('[id$=\"-panel\"]')]
                    .filter(p=>getComputedStyle(p).display!=='none'&&p.getBoundingClientRect().width>0);
                    return v.length? {id:v[0].id, len:(v[0].innerText||'').trim().length}:null;}""")
            if not panel:
                rec("WARN", m, "no visible panel/card-area after tab click")
            elif panel["len"] < 5:
                rec("WARN", m, f"panel {panel['id']} renders nearly empty (len={panel['len']})")
            else:
                rec("OK", m, f"panel {panel['id']} visible (len={panel['len']})")
            shot(f"tab_{m}")

        # ---- 2. deep per-feature flows --------------------------------------
        def f_recall():
            goto_tab("recall")
            if not visible("#card"):
                rec("WARN", "recall", "no card visible (queue empty?)"); return
            click("#card")  # tap to reveal
            page.wait_for_timeout(250)
            got0 = page.evaluate("+document.getElementById('stat-got').textContent")
            if not click("#got-it-btn"):
                rec("WARN", "recall", "#got-it-btn not present after reveal"); return
            page.wait_for_timeout(250)
            got1 = page.evaluate("+document.getElementById('stat-got').textContent")
            rec("OK" if got1 == got0 + 1 else "WARN", "recall",
                f"Got counter {got0}->{got1} after grading")
            # MC mode toggle: choices render as .phrase-mc-btn inside #phrase-mc-choices
            if click("#phrase-mc-btn"):
                page.wait_for_timeout(300)
                n_choices = count("#phrase-mc-choices .phrase-mc-btn")
                rec("OK" if n_choices >= 2 else "WARN", "recall", f"MC mode rendered {n_choices} choices")
        probe("recall", f_recall)

        def f_words():
            goto_tab("words")
            if not visible("#word-card"):
                rec("WARN", "words", "no word card visible"); return
            click("#word-reveal-btn")
            page.wait_for_timeout(250)
            before = page.evaluate("Object.keys(JSON.parse(localStorage.getItem('wordsSRS')||'{}')).length")
            if not click(".word-srs-btn.word-good"):
                rec("WARN", "words", "Good grade button missing after reveal"); return
            page.wait_for_timeout(250)
            after = page.evaluate("Object.keys(JSON.parse(localStorage.getItem('wordsSRS')||'{}')).length")
            rec("OK", "words", f"graded; wordsSRS entries {before}->{after}")
        probe("words", f_words)

        def f_drills():
            goto_tab("drills")
            n = count(".drill-set-card")
            if not n:
                rec("WARN", "drills", "no drill set cards"); return
            click(".drill-set-card:not(.drill-mistakes-card)")
            page.wait_for_timeout(400)
            if not visible("#drill-modal"):
                rec("WARN", "drills", "drill modal did not open"); return
            if not click(".drill-choice"):
                rec("WARN", "drills", "no drill choices to answer"); return
            page.wait_for_timeout(300)
            fb = page.evaluate("(document.getElementById('drill-feedback')||{}).textContent||''")
            rec("OK", "drills", f"answered; feedback shown={bool(fb.strip())}")
            click("#drill-close")
        probe("drills", f_drills)

        def f_stories():
            goto_tab("stories")
            if not click("#story-generate-btn"):
                rec("WARN", "stories", "no generate button"); return
            page.wait_for_timeout(700)
            ns = count(".story-sentence")
            rec("OK" if ns else "WARN", "stories", f"{ns} sentences rendered")
            # answer quiz (first option of each)
            page.evaluate("""()=>document.querySelectorAll('.story-quiz-opt[data-oi=\"0\"]')
                .forEach(o=>o.click())""")
            page.wait_for_timeout(300)
            res = page.evaluate("(document.getElementById('story-quiz-result')||{}).textContent||''")
            rec("OK" if res.strip() else "WARN", "stories", f"quiz result='{res.strip()[:30]}'")
            # Palteca loop: word self-rate panel after the quiz feeds wordsSRS
            n_rate = count("#story-word-rate-list .story-rate-btn")
            if n_rate:
                click(".story-rate-btn.know")
                page.wait_for_timeout(200)
                rated = count(".story-rate-row.rated")
                rec("OK" if rated else "WARN", "stories", f"word self-rate graded {rated} word(s)")
            else:
                rec("INFO", "stories", "no target-word rate rows (no due/new words?)")
            # XP should have accrued from story completion
            xp = page.evaluate("JSON.parse(localStorage.getItem('xp_state')||'{}').total||0")
            rec("OK" if xp > 0 else "WARN", "stories", f"XP total after story={xp}")
            # Episode archive: chip list appears and reopens the episode
            n_arch = page.evaluate("JSON.parse(localStorage.getItem('storyEpisodeArchive')||'[]').length")
            rec("OK" if n_arch >= 1 else "WARN", "stories", f"episode archive entries={n_arch}")
            if click(".story-episode-chip-btn"):
                page.wait_for_timeout(300)
                reopened = page.evaluate("document.querySelectorAll('.story-sentence').length")
                rec("OK" if reopened else "WARN", "stories", f"re-opened archived episode ({reopened} sentences)")
        probe("stories", f_stories)

        def f_exam():
            goto_tab("exam")
            if count(".exam-task-card") != 3:
                rec("WARN", "exam", f"expected 3 task cards, got {count('.exam-task-card')}")
            # Sprachbausteine
            click("#exam-card-sb"); page.wait_for_timeout(150)
            click("#exam-sb-start-btn"); page.wait_for_timeout(600)
            n_items = count(".exam-sb-item")
            if n_items:
                page.evaluate("""()=>{for(let qi=0;qi<examSbData.items.length;qi++){
                    const oi=examSbData.items[qi].answer;
                    const o=document.querySelector(`.exam-sb-opt[data-qi="${qi}"][data-oi="${oi}"]`);
                    if(o)o.click();}}""")
                page.wait_for_timeout(150)
                click("#exam-sb-submit-btn"); page.wait_for_timeout(300)
                score = page.evaluate("(document.querySelector('.exam-score-big')||{}).textContent||''")
                rec("OK", "exam", f"Sprachbausteine scored '{score.strip()}'")
            else:
                rec("WARN", "exam", "Sprachbausteine rendered no items")
            click("#exam-sb-back"); page.wait_for_timeout(150)
            # Schreiben
            click("#exam-card-write"); page.wait_for_timeout(200)
            letter = "Sehr geehrte Damen und Herren, " + "ich schreibe wegen meiner Bestellung. " * 12 + "Mit freundlichen Grüßen"
            page.evaluate("document.getElementById('exam-write-type').value='Beschwerde'")
            click("#exam-write-start-btn"); page.wait_for_timeout(250)
            page.evaluate("""(t)=>{const el=document.getElementById('exam-write-input');
                el.value=t; el.dispatchEvent(new Event('input',{bubbles:true}));}""", letter)
            page.wait_for_timeout(200)
            if page.evaluate("!document.getElementById('exam-write-submit-btn').disabled"):
                click("#exam-write-submit-btn"); page.wait_for_timeout(1000)
                chips = count("#exam-write-scores .exam-score-chip")
                rec("OK" if chips == 4 else "WARN", "exam", f"Schreiben feedback chips={chips}")
            else:
                rec("WARN", "exam", "Schreiben submit stayed disabled")
            click("#exam-write-back"); page.wait_for_timeout(150)
            # Präsentation
            click("#exam-card-speak"); page.wait_for_timeout(300)
            structure = count("#exam-speak-structure li")
            rec("OK" if structure else "WARN", "exam", f"Präsentation structure points={structure}")
            done = page.evaluate("localStorage.getItem('exam_tasks_done')")
            rec("INFO", "exam", f"exam_tasks_done={done}")
        probe("exam", f_exam)

        def f_games():
            goto_tab("games")
            cards = count(".game-card")
            rec("INFO", "games", f"{cards} game launchers")
            for fn_name, gid, check_sel in [
                ("openWordSearch", "game-card-wordsearch", "#wordsearch-view"),
                ("openGrammarSprint", "game-card-grammarsprint", "#grammarsprint-view"),
                ("openListeningBlitz", "game-card-listeningblitz", "#lb-options-grid, .lb-option"),
                ("openSentenceBuilder", "game-card-sentencebuilder", "#sb-bank-tiles, .sb-tile"),
                ("openTalkBox", "game-card-talkbox", "#talkbox-view"),
            ]:
                goto_tab("games")
                before = len(js_errors)
                click("#" + gid)
                page.wait_for_timeout(500)
                ok = page.evaluate("""(s)=>s.split(',').some(x=>{const e=document.querySelector(x.trim());
                    return e && e.offsetParent!==null;})""", check_sel)
                tag = "OK" if (ok and len(js_errors) == before) else "WARN"
                rec(tag, "games", f"{gid} opened (view visible={ok})")
            # exercise grammar sprint one answer
            goto_tab("games"); click("#game-card-grammarsprint"); page.wait_for_timeout(300)
            if click("#gs-start-btn"):
                page.wait_for_timeout(500)
                if click("#gs-answer-grid button, .gs-answer-btn"):
                    page.wait_for_timeout(300)
                    rec("OK", "games", "Grammar Sprint accepted an answer")
            # exercise sentence builder
            goto_tab("games"); click("#game-card-sentencebuilder"); page.wait_for_timeout(400)
            tiles = count("#sb-bank-tiles .sb-tile, #sb-bank-tiles button")
            if tiles:
                page.evaluate("""()=>document.querySelectorAll('#sb-bank-tiles .sb-tile, #sb-bank-tiles button')
                    .forEach(t=>t.click())""")
                page.wait_for_timeout(200)
                click("#sb-check-btn")
                page.wait_for_timeout(300)
                rec("OK", "games", f"Sentence Builder assembled {tiles} tiles + checked")
        probe("games", f_games)

        def f_ai():
            goto_tab("ai")
            for mode in ["translate", "correct", "write"]:
                click(f'.ai-sub-btn[data-aimode="{mode}"]')
                page.wait_for_timeout(200)
                page.evaluate("""(t)=>{const el=document.getElementById('ai-text-input');
                    if(el){el.value=t; el.dispatchEvent(new Event('input',{bubbles:true}));}}""",
                    "Ich gehen nach Hause" if mode != "translate" else "I am going home")
                click("#ai-send-btn")
                page.wait_for_timeout(500)
                body = page.evaluate("(document.getElementById('ai-result-body')||{}).innerText||''")
                rec("OK" if body.strip() else "WARN", "ai", f"{mode} -> result len={len(body.strip())}")
            # chat sub-mode
            click('.ai-sub-btn[data-aimode="chat"]'); page.wait_for_timeout(300)
            rec("OK" if visible("#ai-chat-panel") else "WARN", "ai",
                f"chat panel visible={visible('#ai-chat-panel')}")
        probe("ai", f_ai)

        def f_today():
            goto_tab("today")
            rec("INFO", "today", "phrases_due=" +
                str(page.evaluate("(document.getElementById('today-phrases-due')||{}).textContent||'?'")) +
                " words_due=" +
                str(page.evaluate("(document.getElementById('today-words-due')||{}).textContent||'?'")))
            if click("#today-start-btn"):
                page.wait_for_timeout(400)
                rec("OK" if visible("#today-session-bar") else "WARN", "today",
                    f"session bar visible={visible('#today-session-bar')}")
                dots = count("#tsb-steps .tsb-dot")
                rec("OK" if dots == 5 else "WARN", "today",
                    f"session shows {dots} step dots (expect 5 incl. story)")
        probe("today", f_today)

        def f_progress():
            goto_tab("progress")
            rec("OK" if visible("#progress-summary") or visible("#progress-list") else "WARN",
                "progress", "progress dashboard rendered")
            # sync card: create a code, expect linked row + syncId persisted
            if click("#sync-create-btn"):
                page.wait_for_timeout(400)
                sid = page.evaluate("localStorage.getItem('syncId')||''")
                linked = visible("#sync-linked-row")
                rec("OK" if sid and linked else "WARN", "progress",
                    f"sync code created '{sid}' (linked row={linked})")
                status = page.evaluate("(document.getElementById('sync-status')||{}).textContent||''")
                rec("OK" if "✓" in status or "Synced" in status else "WARN", "progress",
                    f"sync push status='{status[:40]}'")
            else:
                rec("WARN", "progress", "sync create button missing")
        probe("progress", f_progress)

        # ---- 3. mobile pass --------------------------------------------------
        current[0] = "mobile"
        page.set_viewport_size({"width": 390, "height": 844})
        page.wait_for_timeout(400)
        goto_tab("today")
        if click("#more-tab"):
            page.wait_for_timeout(300)
            items = count("#more-sheet .more-item, #more-sheet [data-mode]")
            rec("OK" if items else "WARN", "mobile", f"More sheet exposes {items} items")
            shot("mobile_more_sheet")
            # open each overflow item once, watch for errors
            overflow = page.eval_on_selector_all("#more-sheet .more-item[data-mode]",
                                                  "els=>els.map(e=>e.getAttribute('data-mode'))")
            for m in overflow:
                before = len(js_errors)
                current[0] = "mobile:" + m
                click("#more-tab"); page.wait_for_timeout(150)
                page.evaluate("""(m)=>{const e=document.querySelector(`#more-sheet .more-item[data-mode="${m}"]`);
                    if(e)e.click();}""", m)
                page.wait_for_timeout(300)
                if len(js_errors) > before:
                    rec("WARN", "mobile", f"errors opening '{m}' via More sheet")
            rec("OK", "mobile", f"opened {len(overflow)} overflow tabs via More sheet")
        else:
            rec("WARN", "mobile", "#more-tab not present at 390px")
        sw = page.evaluate("document.documentElement.scrollWidth")
        rec("OK" if sw <= 392 else "WARN", "mobile", f"horizontal scrollWidth={sw} (<=392 ok)")

        browser.close()


run()

# ---- report ------------------------------------------------------------------
order = {"ERROR": 0, "CONSOLE": 1, "WARN": 2, "INFO": 3, "OK": 4}
print("\n" + "=" * 60)
print("CRAWL SUMMARY")
print("=" * 60)
buckets = {}
for sev, area, msg in rows:
    buckets.setdefault(sev, 0)
    buckets[sev] += 1
for sev in ["ERROR", "CONSOLE", "WARN", "INFO", "OK"]:
    if sev in buckets:
        print(f"  {sev:7}: {buckets[sev]}")
print(f"  /api modes exercised: {sorted(modes_seen)}")

hard = buckets.get("ERROR", 0) + buckets.get("CONSOLE", 0)
warns = [r for r in rows if r[0] == "WARN"]
if warns:
    print("\nWARN details:")
    for _, area, msg in warns:
        print(f"  [{area}] {msg}")

print(f"\n{'FAIL' if hard else 'PASS'} - {hard} blocking (ERROR/CONSOLE) issue(s)")
sys.exit(1 if hard else 0)
