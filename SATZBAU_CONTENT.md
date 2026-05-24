# Satzbau Content Guide

Phrases without audio are automatically excluded from Listen and Shadow modes (`buildQueue` filters `p.audio` as falsy). So adding new phrases here with `"audio": ""` is safe - they appear in Recall, Grammar, and Words modes only.

To generate audio for any batch of phrases, run:
```
python scripts/generate_audio.py
```
or for individual phrases:
```
python scripts/add_phrase.py
```

---

## How to Add New Satzbau Phrases

### 1. Add to `data.js`
```json
{
  "id": <next available ID>,
  "german": "German sentence.",
  "english": "English translation.",
  "category": "satzbau",
  "audio": ""
}
```

### 2. Add grammar tags in `app.js` (GRAMMAR_TAGS object)
Available Satzbau tags:
- `SatzbauAussage` - statement, verb at position 2
- `Inversion` - non-subject occupies position 1
- `SatzbauWFrage` - W-question word order
- `SatzbauJaNein` - yes/no question, verb at position 1
- `TeKaMoLo` - temporal/manner/local adverb ordering
- `NebensatzVerb` - subordinate clause, verb at end
- `Nebensatz-weil` / `Nebensatz-wenn` / `Nebensatz-damit` / `Nebensatz-dass` - specific conjunctions

### 3. Add to the matching GRAMMAR_TOPIC's `ids` array in `app.js`
Find the relevant topic (SatzbauAussage, SatzbauWFrage, etc.) and add the new phrase ID.

### 4. (Optional) Add a breakdown entry to the topic's `breakdown` array
```javascript
{ phraseId: <ID>, parts: [
  { text: "Heute",        label: "Temporal",  pos: "temp" },
  { text: "lerne",        label: "Verb",      pos: "verb" },
  { text: "ich",          label: "Subj.",     pos: "subj" },
  { text: "Deutsch",      label: "Erg.",      pos: "erg"  }
]}
```

Position color keys: `verb` (red), `subj` (blue), `frage` (amber), `conj` (gray), `temp` (cyan), `manner` (purple), `local` (green), `erg` (slate).

---

## Content Backlog - More Sentences to Add

### Aussagen - More Inversion examples (Video 1)
These demonstrate verb-stays-at-2 with different elements at position 1:

| German | English | Tags |
|--------|---------|------|
| Heute Abend tanze ich Bachata im Tanzstudio. | This evening I dance bachata at the dance studio. | SatzbauAussage, Inversion |
| Nach dem Sprachcafé gehe ich meistens noch einkaufen. | After the language café I usually still go shopping. | SatzbauAussage, Inversion, Separierbar |
| Seit meinem Abschluss lerne ich täglich Deutsch. | Since my graduation I learn German daily. | SatzbauAussage, Inversion, seit |
| Auf dem Tennisplatz treffe ich oft neue Leute. | On the tennis court I often meet new people. | SatzbauAussage, Inversion |
| Zweimal pro Woche spiele ich Tischtennis mit Kommilitonen. | Twice a week I play table tennis with fellow students. | SatzbauAussage, Inversion |
| Für meine Masterbewerbung brauche ich ein B1-Zertifikat. | For my master's application I need a B1 certificate. | SatzbauAussage, Inversion |

### W-Fragen - More examples (Video 1)
| German | English | Tags |
|--------|---------|------|
| Wer kann mir bei meiner Bewerbung helfen? | Who can help me with my application? | SatzbauWFrage, Fragewort, Modal |
| Woher weißt du, dass das Programm gut ist? | How do you know that the programme is good? | SatzbauWFrage, Fragewort, Nebensatz-dass |
| Wie lange dauert der B1-Kurs bei IQ Lingua? | How long does the B1 course at IQ Lingua take? | SatzbauWFrage, Fragewort |
| Was brauchst du für ein Masterstudium in Deutschland? | What do you need for a master's in Germany? | SatzbauWFrage, Fragewort |

### Ja/Nein-Fragen - More examples (Video 1)
| German | English | Tags |
|--------|---------|------|
| Bist du schon beim Sprachcafé gewesen? | Have you already been to the language café? | SatzbauJaNein, Perfekt |
| Lernst du Klavier bei einem Lehrer? | Are you learning piano with a teacher? | SatzbauJaNein |
| Hast du die Bewerbung schon abgeschickt? | Have you already sent off the application? | SatzbauJaNein, Perfekt, Separierbar |
| Gibt es in Bremen einen guten Bachata-Kurs? | Is there a good bachata course in Bremen? | SatzbauJaNein |

### Nebensatz - Temporal types (Video 2)
| German | English | Tags |
|--------|---------|------|
| Seitdem ich täglich Deutsch lerne, fühle ich mich sicherer beim Sprechen. | Since I learn German daily, I feel more confident speaking. | NebensatzVerb, Nebensatz-seitdem, Reflexiv |
| Während er Fahrrad fährt, hört er deutsche Podcasts. | While he cycles, he listens to German podcasts. | NebensatzVerb, Nebensatz-während |
| Ich warte, bis ich das B1-Zertifikat habe, bevor ich mich bewerbe. | I'll wait until I have the B1 certificate before applying. | NebensatzVerb, Nebensatz-bis |
| Nachdem ich den Kurs abgeschlossen habe, mache ich die offizielle Prüfung. | After I finish the course, I'll take the official exam. | NebensatzVerb, Nebensatz-nachdem, Perfekt |

### Nebensatz - Inverted order (Nebensatz first, Video 2)
| German | English | Tags |
|--------|---------|------|
| Damit ich die Prüfung bestehe, lerne ich jeden Tag. | So that I pass the exam, I study every day. | NebensatzVerb, Nebensatz-damit, Inversion |
| Obwohl der Kurs anspruchsvoll ist, macht er mir Spaß. | Although the course is demanding, I enjoy it. | NebensatzVerb, Nebensatz-obwohl, Inversion |
| Da ich in Deutschland bleiben möchte, ist Deutsch sehr wichtig für mich. | Since I want to stay in Germany, German is very important to me. | NebensatzVerb, Nebensatz-weil, Inversion |

### TeKaMoLo - More examples (Video 1)
| German | English | Tags |
|--------|---------|------|
| Ich gehe jeden Abend alleine zu Fuß nach Hause. | I walk home alone every evening. | TeKaMoLo, SatzbauAussage |
| Sie schreibt morgen früh mit dem Laptop ihre Bewerbung. | She writes her application on her laptop tomorrow morning. | TeKaMoLo, SatzbauAussage |
| Wir spielen jeden Sonntag zusammen Basketball auf dem Sportplatz. | We play basketball together on the sports court every Sunday. | TeKaMoLo, SatzbauAussage |

### Trennbare Verben in Nebensatz (Video 2 bonus)
Separable verbs stay together (prefix+verb merged) at the very end of a subordinate clause:

| German | English | Tags |
|--------|---------|------|
| Ich rufe dich an, wenn ich fertig bin. | I'll call you when I'm done. | NebensatzVerb, Nebensatz-wenn, Separierbar |
| Kannst du mich anrufen, sobald du Zeit hast? | Can you call me as soon as you have time? | NebensatzVerb, Separierbar, Modal |
| Ich mache das Fenster auf, weil es so warm ist. | I'm opening the window because it's so warm. | NebensatzVerb, Nebensatz-weil, Separierbar |

---

## Sentence Structure Quick Reference

### Aussagen (Statements)
```
Pos 1       | Pos 2 | Pos 3  | Pos 4+
------------|-------|--------|------------------
Ich         | lerne | heute  | Deutsch.       (Subject first)
Heute       | lerne | ich    | Deutsch.       (Inversion: Time first)
In Bremen   | lerne | ich    | Deutsch.       (Inversion: Place first)
Seit Juli   | lerne | ich    | täglich Deutsch. (Inversion)
```

### W-Fragen
```
Pos 1     | Pos 2   | Pos 3  | Pos 4+
----------|---------|--------|----------
Was       | lernst  | du     | gerade?
Wann      | beginnt | der    | Kurs?
Wo        | kann    | ich    | Deutsch üben?
```

### Ja/Nein-Fragen
```
Pos 1    | Pos 2 | Pos 3+
---------|-------|------------
Lernst   | du    | Deutsch?
Hast     | du    | Deutsch gelernt?
Kannst   | du    | mir helfen?
```

### TeKaMoLo (after verb)
```
Subj | Verb | Te (wann?)    | Ka (warum?) | Mo (wie?)       | Lo (wo/wohin?)
-----|------|---------------|-------------|-----------------|---------------
Ich  | gehe | jeden Abend   |             | zu Fuß          | nach Hause.
Ich  | fahre| morgen früh   |             | mit dem Fahrrad | zur Prüfung.
```

### Nebensatz (Subordinate Clause)
```
Hauptsatz,          | Konj.  | Subj. | ... | VERB (Ende!)
--------------------|--------|-------|-----|-------------
Ich lerne Deutsch,  | weil   | ich   | ... | bleiben möchte.
Ich frage,          | ob     | er    | ... | kommt.
Das Buch,           | das    | ich   | ... | gekauft habe, ...
```
