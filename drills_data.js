// drills_data.js — Gap-fill drill sets for prepositions, conjunctions, and connectors
// Each item: { id, sentence (with ___), answer, distractors[3], rule }

const DRILL_SETS = {
  // ---- telc B1 sets built from Examberg Modelltest 1 feedback (26 Oct 2026) ----

  b1_verbende: {
    label: "telc B1 · Verb ans Ende",
    subtitle: "weil · dass · ob · obwohl vs. deshalb · aber — the #1 mistake in MT01 writing and speaking",
    color: "#ef4444",
    items: [
      { id: 1001, sentence: "Ich möchte im Sommer reisen, weil ___.", answer: "ich noch nie am Meer war", distractors: ["ich war noch nie am Meer", "war ich noch nie am Meer", "ich noch nie war am Meer"], rule: "weil sends the conjugated verb to the END: …, weil ich noch nie am Meer war." },
      { id: 1002, sentence: "Ich lerne Deutsch, weil ___.", answer: "ich in Deutschland arbeiten möchte", distractors: ["ich möchte in Deutschland arbeiten", "möchte ich in Deutschland arbeiten", "ich in Deutschland möchte arbeiten"], rule: "Modal verb in a weil-clause: infinitive first, modal verb last — arbeiten möchte." },
      { id: 1003, sentence: "Ich suche jetzt eine Stelle, weil ___.", answer: "ich meinen Bachelor abgeschlossen habe", distractors: ["ich habe meinen Bachelor abgeschlossen", "ich meinen Bachelor habe abgeschlossen", "habe ich meinen Bachelor abgeschlossen"], rule: "Perfekt in a weil-clause: Partizip II, then haben/sein at the very end (MT01 speaking feedback)." },
      { id: 1004, sentence: "Ich gehe gern in den Sportverein, weil ___.", answer: "man dort viele Menschen kennenlernen kann", distractors: ["man kann dort viele Menschen kennenlernen", "man dort kann viele Menschen kennenlernen", "man dort viele Menschen kann kennenlernen"], rule: "weil + modal verb: kennenlernen kann at the end. MT01: 'weil man kann viele Menschen' was cut off and wrong." },
      { id: 1005, sentence: "Schade, dass ___.", answer: "du im Haus bleiben musstest", distractors: ["du musstest im Haus bleiben", "du im Haus musstest bleiben", "musstest du im Haus bleiben"], rule: "dass sends the verb to the end: …, dass du im Haus bleiben musstest." },
      { id: 1006, sentence: "Ich freue mich zu hören, dass ___.", answer: "es dir gut geht", distractors: ["es geht dir gut", "geht es dir gut", "es dir geht gut"], rule: "dass-clause: conjugated verb last — dass es dir gut geht." },
      { id: 1007, sentence: "Ich habe wenig Geld, deshalb ___.", answer: "fahre ich mit dem Zug", distractors: ["ich fahre mit dem Zug", "ich mit dem Zug fahre", "fahre mit dem Zug ich"], rule: "deshalb takes position 1, so the verb comes straight after it (position 2): deshalb fahre ich …" },
      { id: 1008, sentence: "Ich komme gern mit, aber ___.", answer: "ich habe nicht viel Geld", distractors: ["habe ich nicht viel Geld", "ich nicht viel Geld habe", "ich habe viel nicht Geld"], rule: "aber / und / oder / denn do not change word order: subject, then verb." },
      { id: 1009, sentence: "Obwohl es geregnet hat, ___.", answer: "sind wir spazieren gegangen", distractors: ["wir sind spazieren gegangen", "wir spazieren gegangen sind", "sind spazieren gegangen wir"], rule: "When the Nebensatz comes first, the main clause starts with the verb: Obwohl …, sind wir …" },
      { id: 1010, sentence: "Wenn du Zeit hast, ___.", answer: "können wir die Reise zusammen planen", distractors: ["wir können die Reise zusammen planen", "wir die Reise zusammen planen können", "können die Reise wir zusammen planen"], rule: "Nebensatz first → main clause begins with the verb: Wenn …, können wir …" },
      { id: 1011, sentence: "Ich weiß noch nicht, ob ___.", answer: "ich im August Urlaub bekomme", distractors: ["ich bekomme im August Urlaub", "bekomme ich im August Urlaub", "ich im August bekomme Urlaub"], rule: "ob works like dass: the verb goes to the end." },
      { id: 1012, sentence: "Ich plane die Reise gern, weil ___.", answer: "ich das schon im August für meine Familie gemacht habe", distractors: ["ich habe das schon im August für meine Familie gemacht", "habe ich das schon im August für meine Familie gemacht", "ich das schon im August für meine Familie habe gemacht"], rule: "Your MT01 letter, line 7: weil + Perfekt → gemacht habe at the end." },
    ]
  },

  b1_brief_woerter: {
    label: "telc B1 · Brief: Rechtschreibung",
    subtitle: "Brief · freue · Schüler · Geld · planen · ist · für · und — spelling and English words from your MT01 letter",
    color: "#f97316",
    items: [
      { id: 1101, sentence: "Danke für deinen ___!", answer: "Brief", distractors: ["Brif", "Schrifft", "Breif"], rule: "der Brief (ie). für + Akkusativ → deinen Brief." },
      { id: 1102, sentence: "Ich ___ mich sehr auf den Sommer.", answer: "freue", distractors: ["frue", "freu", "freüe"], rule: "sich freuen: ich freue mich (eu)." },
      { id: 1103, sentence: "Wir sind noch ___ und haben nicht viel Geld.", answer: "Schüler", distractors: ["schuler", "Schuler", "Schüller"], rule: "der Schüler / die Schüler — nouns are capitalised, and it is ü." },
      { id: 1104, sentence: "Ich habe nicht genug ___ für einen Luxusurlaub.", answer: "Geld", distractors: ["Gelt", "gehts", "Gelder"], rule: "das Geld — 'nicht genug Geld haben'." },
      { id: 1105, sentence: "Ich helfe dir gern, die Reise zu ___.", answer: "planen", distractors: ["plannen", "planned", "plänen"], rule: "planen has ONE n. zu + Infinitiv at the end." },
      { id: 1106, sentence: "Ich habe die Reise letztes Jahr ___.", answer: "geplant", distractors: ["geplannen", "geplannt", "planen"], rule: "Partizip II of planen: geplant (regular verb: ge- + plan + -t)." },
      { id: 1107, sentence: "Ein günstiger Urlaub ___ auch eine gute Idee.", answer: "ist", distractors: ["is", "sind", "bist"], rule: "German 'ist' — never the English 'is'." },
      { id: 1108, sentence: "Das ist ein guter Vorschlag ___ mich.", answer: "für", distractors: ["fur", "for", "vor"], rule: "für (with ü) + Akkusativ. 'vor' means 'in front of / before'." },
      { id: 1109, sentence: "Ich fahre gern ans Meer ___ in die Berge.", answer: "und", distractors: ["and", "un", "unt"], rule: "German 'und' — English words cost marks in Formale Richtigkeit." },
      { id: 1110, sentence: "Deine Idee finde ich sehr ___.", answer: "gut", distractors: ["good", "gud", "guten"], rule: "After 'finden … sehr' the adjective has no ending: sehr gut." },
      { id: 1111, sentence: "Mir geht es sehr gut, und ___?", answer: "dir", distractors: ["du", "dich", "dein"], rule: "Wie geht es dir? – Mir geht es gut, und dir? (Dativ). Not 'ich bin sehr gut und du'." },
      { id: 1112, sentence: "Ich habe niemanden, mit ___ ich reisen kann.", answer: "dem", distractors: ["den", "der", "wem"], rule: "Relative pronoun after mit → Dativ: mit dem ich reisen kann." },
      { id: 1113, sentence: "Leider hat es die ganze Zeit ___.", answer: "geregnet", distractors: ["geregnen", "regnet", "geregent"], rule: "regnen → es hat geregnet." },
      { id: 1114, sentence: "Ich kann dir bei der Planung ___.", answer: "helfen", distractors: ["hilfen", "helfe", "geholfen"], rule: "Modal verb (kann) + infinitive at the end: helfen." },
    ]
  },

  b1_brief_bausteine: {
    label: "telc B1 · Brief: Anrede, Inhalt, Schluss",
    subtitle: "Greeting, the weekend Leitpunkt you missed, suggestions, and a proper closing",
    color: "#eab308",
    items: [
      { id: 1201, sentence: "___ Annika, vielen Dank für deinen Brief.", answer: "Liebe", distractors: ["Lieber", "Liebes", "Sehr geehrte"], rule: "Informal letter to a woman: Liebe …; to a man: Lieber …; 'Sehr geehrte' is only for formal letters." },
      { id: 1202, sentence: "___ Herr Müller, ich schreibe Ihnen wegen der Anzeige.", answer: "Sehr geehrter", distractors: ["Sehr geehrte", "Lieber geehrter", "Hallo geehrter"], rule: "Formal letter to a man: Sehr geehrter Herr …; to a woman: Sehr geehrte Frau …" },
      { id: 1203, sentence: "Vielen Dank für deine ___. Ich habe mich sehr darüber gefreut.", answer: "Nachricht", distractors: ["Brief", "Schreiben", "Grüße"], rule: "deine → feminine noun: die Nachricht. (der Brief → deinen Brief)." },
      { id: 1204, sentence: "___ letzten Wochenende war ich mit Freunden im Park.", answer: "Am", distractors: ["Im", "An", "Bei"], rule: "am + Wochenende / Tag. This is the Leitpunkt you left out in MT01 — always answer all four." },
      { id: 1205, sentence: "Letztes Wochenende ___ ich meine Tante besucht.", answer: "habe", distractors: ["bin", "hatte", "war"], rule: "besuchen takes haben in the Perfekt: ich habe besucht." },
      { id: 1206, sentence: "Am Samstag ___ ich nach Hamburg gefahren.", answer: "bin", distractors: ["habe", "war", "hatte"], rule: "Verbs of movement (fahren, gehen, fliegen) take sein: ich bin gefahren." },
      { id: 1207, sentence: "Was hältst du ___ einer Städtereise?", answer: "von", distractors: ["über", "für", "an"], rule: "halten von + Dativ — 'what do you think of …?'" },
      { id: 1208, sentence: "Ich schlage vor, ___ wir in einer Jugendherberge übernachten.", answer: "dass", distractors: ["das", "ob", "weil"], rule: "Ich schlage vor, dass … (conjunction, two s). 'das' is an article/pronoun." },
      { id: 1209, sentence: "Ich finde deine Idee gut, im Sommer zusammen zu ___.", answer: "reisen", distractors: ["reise", "gereist", "reist"], rule: "zu + Infinitiv at the end: …, zusammen zu reisen. (MT01 line 4)" },
      { id: 1210, sentence: "Lass bald wieder von ___ hören.", answer: "dir", distractors: ["dich", "du", "dein"], rule: "von + Dativ → von dir. A closing sentence was missing from your MT01 letter." },
      { id: 1211, sentence: "Ich freue mich auf ___ Antwort.", answer: "deine", distractors: ["deinen", "dein", "deiner"], rule: "die Antwort; auf + Akkusativ → deine Antwort." },
      { id: 1212, sentence: "Viele ___ Kinlo", answer: "Grüße", distractors: ["Grüßen", "Gruße", "Grüß"], rule: "'Viele Grüße' or 'Liebe Grüße' — not 'Vielen Grüße' (MT01 line 8)." },
      { id: 1213, sentence: "Es wäre schön, wenn du im Sommer Zeit ___.", answer: "hättest", distractors: ["hast", "hattest", "hätten"], rule: "Konjunktiv II for wishes: Es wäre schön, wenn du Zeit hättest." },
    ]
  },

  b1_sprechen_saetze: {
    label: "telc B1 · Sprechen: ganze Sätze",
    subtitle: "Finish every sentence, ask your partner, plan together — from your MT01 speaking report",
    color: "#22c55e",
    items: [
      { id: 1301, sentence: "Im Jugendzentrum kann man ___.", answer: "Spiele mit anderen spielen", distractors: ["Spiele", "mit anderen Spiele", "spielen Spiele mit anderen"], rule: "Never stop after the object: 'man kann Spiele' is unfinished. Modal + … + infinitive at the end." },
      { id: 1302, sentence: "Ja, ich bringe auch die Getränke ___.", answer: "mit", distractors: ["mitbringen", "dabei", "zusammen"], rule: "Separable verb mitbringen → ich bringe … mit. MT01: 'Ja, mit' alone is not an answer." },
      { id: 1303, sentence: "Wer ___ sich um das Essen?", answer: "kümmert", distractors: ["kümmern", "bringt", "macht"], rule: "sich kümmern um + Akk — the standard Teil 3 question for dividing tasks." },
      { id: 1304, sentence: "Das ___ ich gern übernehmen.", answer: "kann", distractors: ["kannst", "können", "bin"], rule: "Teil 3: offer to take a task — Das kann ich übernehmen." },
      { id: 1305, sentence: "Wie ___ es mit Samstagnachmittag?", answer: "wäre", distractors: ["war", "würde", "hätte"], rule: "Suggestion phrase: Wie wäre es mit + Dativ?" },
      { id: 1306, sentence: "Das finde ich nicht so gut, ___ das zu teuer ist.", answer: "weil", distractors: ["denn", "deshalb", "aber"], rule: "Disagree WITH a reason. weil → verb at the end (ist)." },
      { id: 1307, sentence: "Also, fassen wir ___: Wir treffen uns um 15 Uhr am Bahnhof.", answer: "zusammen", distractors: ["zusammenfassen", "gemeinsam", "alles"], rule: "End Teil 3 with a summary: Also, fassen wir zusammen: …" },
      { id: 1308, sentence: "Und du? ___ machst du in deiner Freizeit?", answer: "Was", distractors: ["Wie", "Wo", "Wer"], rule: "Teil 1: ask your partner questions too. MT01 feedback: you rarely asked any." },
      { id: 1309, sentence: "___ lange lernst du schon Deutsch?", answer: "Wie", distractors: ["Was", "Wann", "Seit"], rule: "Wie lange …? — duration. Answer: Seit zwei Jahren." },
      { id: 1310, sentence: "In meinem Text ___ es um das Thema Freizeit.", answer: "geht", distractors: ["gibt", "ist", "handelt"], rule: "Teil 2 opener: In meinem Text geht es um … ('handelt' needs 'sich': handelt es sich um)." },
      { id: 1311, sentence: "In Kamerun ist das anders. ___ treffen sich die Familien jeden Sonntag.", answer: "Dort", distractors: ["Wo", "Woher", "Dahin"], rule: "Add an example from your own country. Dort in position 1 → verb second." },
      { id: 1312, sentence: "Ich habe selbst erlebt, dass Sport ___.", answer: "gegen Stress hilft", distractors: ["hilft gegen Stress", "gegen Stress helfen", "hilft Stress gegen"], rule: "Give a reason or example after your opinion — and dass sends the verb to the end." },
      { id: 1313, sentence: "Entschuldigung, können Sie das bitte ___?", answer: "wiederholen", distractors: ["wiederholt", "nochmal", "sagen"], rule: "Didn't understand? Ask — silence costs points, a question does not." },
    ]
  },

  b1_sb_teil2: {
    label: "telc B1 · Sprachbausteine Teil 2",
    subtitle: "Connectors and word types in letters — your weakest Teil in MT01 (1/10)",
    color: "#06b6d4",
    items: [
      { id: 1401, sentence: "Leider kann ich nicht kommen, ___ ich am Samstag arbeiten muss.", answer: "da", distractors: ["denn", "deshalb", "trotzdem"], rule: "da = weil (verb at the end). 'denn' would need normal word order: denn ich muss …" },
      { id: 1402, sentence: "Ich habe die ganze Woche gearbeitet. ___ bin ich jetzt sehr müde.", answer: "Deshalb", distractors: ["Weil", "Denn", "Obwohl"], rule: "Deshalb + verb in position 2 = consequence." },
      { id: 1403, sentence: "Das Wetter war schlecht. ___ hatten wir viel Spaß.", answer: "Trotzdem", distractors: ["Obwohl", "Deshalb", "Weil"], rule: "Trotzdem + verb = contrast ('nevertheless'). Obwohl would need a Nebensatz." },
      { id: 1404, sentence: "Kannst du mir sagen, ___ der Kurs beginnt?", answer: "wann", distractors: ["wenn", "als", "ob"], rule: "Indirect question about time → wann. wenn = if / whenever." },
      { id: 1405, sentence: "___ ich ein Kind war, habe ich in Bamenda gewohnt.", answer: "Als", distractors: ["Wenn", "Wann", "Ob"], rule: "als = one period/event in the past. wenn = repeated or future." },
      { id: 1406, sentence: "Ich interessiere mich sehr ___ diesen Kurs.", answer: "für", distractors: ["an", "über", "auf"], rule: "sich interessieren für + Akkusativ." },
      { id: 1407, sentence: "Ich warte noch ___ deine Antwort.", answer: "auf", distractors: ["für", "an", "nach"], rule: "warten auf + Akkusativ." },
      { id: 1408, sentence: "Bitte ruf mich an, ___ du noch Fragen hast.", answer: "falls", distractors: ["dass", "ob", "damit"], rule: "falls = in case / if. Verb at the end." },
      { id: 1409, sentence: "Ich spare jeden Monat Geld, ___ ich im Sommer reisen kann.", answer: "damit", distractors: ["dass", "weil", "um"], rule: "damit = so that (purpose). Verb at the end." },
      { id: 1410, sentence: "Ich lerne jeden Tag, ___ die Prüfung zu bestehen.", answer: "um", distractors: ["damit", "für", "zu"], rule: "um … zu + Infinitiv = in order to (same subject in both parts)." },
      { id: 1411, sentence: "Der Kurs ist sehr ___, aber er hilft mir viel.", answer: "anstrengend", distractors: ["anstrengen", "Anstrengung", "angestrengt"], rule: "After 'ist sehr' you need an adjective. Decide the word TYPE first, then the meaning." },
      { id: 1412, sentence: "Gestern habe ich die ___ bekommen, dass der Kurs ausfällt.", answer: "Nachricht", distractors: ["Bericht", "informiert", "benachrichtigen"], rule: "After 'die' you need a feminine noun: die Nachricht." },
      { id: 1413, sentence: "Ich möchte mich für die schöne Zeit bei euch ___.", answer: "bedanken", distractors: ["danken", "Dank", "bedankt"], rule: "sich bedanken für … bei jemandem. 'danken' has no 'sich'." },
    ]
  },

  b1_lesen_umschreiben: {
    label: "telc B1 · Lesen: Umschreiben erkennen",
    subtitle: "The right answer uses DIFFERENT words from the text — Lesen Teil 2 was 0/5 in MT01",
    color: "#8b5cf6",
    items: [
      { id: 1501, sentence: "Im Text: „Die Kosten übernimmt der Arbeitgeber.“ Das heißt: Die Firma ___ alles.", answer: "bezahlt", distractors: ["verdient", "spart", "bekommt"], rule: "Kosten übernehmen = bezahlen." },
      { id: 1502, sentence: "Im Text: „Der Kurs findet morgen nicht statt.“ Das heißt: Der Kurs ___ morgen aus.", answer: "fällt", distractors: ["fängt", "sieht", "geht"], rule: "nicht stattfinden = ausfallen." },
      { id: 1503, sentence: "Im Text: „Eine Anmeldung ist nicht nötig.“ Das heißt: Man muss sich ___ anmelden.", answer: "nicht", distractors: ["vorher", "schriftlich", "sofort"], rule: "nicht nötig = man muss nicht. Watch for negations — they are the classic trap." },
      { id: 1504, sentence: "Im Text: „Die Wohnung ist ab sofort frei.“ Das heißt: Man kann ___ einziehen.", answer: "gleich", distractors: ["erst nächstes Jahr", "nicht", "nur im Sommer"], rule: "ab sofort = ab jetzt = gleich." },
      { id: 1505, sentence: "Im Text: „Er hat seine Meinung geändert.“ Das heißt: Er denkt jetzt ___.", answer: "anders", distractors: ["genauso", "gleich", "nichts"], rule: "die Meinung ändern = jetzt anders denken." },
      { id: 1506, sentence: "Im Text: „Früher fuhr sie jeden Tag Auto, heute nimmt sie das Fahrrad.“ Das heißt: Sie fährt ___ Auto.", answer: "nicht mehr", distractors: ["immer noch", "jeden Tag", "öfter"], rule: "früher … heute = a change. Trap: the answer about 'früher' is no longer true." },
      { id: 1507, sentence: "Im Text: „Die Veranstaltung ist kostenlos.“ Das heißt: Man muss ___ bezahlen.", answer: "nichts", distractors: ["wenig", "viel", "vorher"], rule: "kostenlos = gratis = man zahlt nichts." },
      { id: 1508, sentence: "Im Text: „Kinder unter 6 Jahren haben freien Eintritt.“ Das heißt: Ein fünfjähriges Kind ___.", answer: "zahlt nichts", distractors: ["zahlt die Hälfte", "darf nicht hinein", "braucht ein Ticket"], rule: "freier Eintritt = man zahlt keinen Eintritt. Check the number: 5 < 6." },
      { id: 1509, sentence: "Im Text: „Sie bereut ihre Entscheidung nicht.“ Das heißt: Sie ist mit ihrer Entscheidung ___.", answer: "zufrieden", distractors: ["unzufrieden", "unsicher", "fertig"], rule: "etwas nicht bereuen = damit zufrieden sein. Double negation → positive." },
      { id: 1510, sentence: "Im Text: „Die Öffnungszeiten wurden verlängert.“ Das heißt: Das Geschäft ist ___ geöffnet.", answer: "länger", distractors: ["kürzer", "nicht mehr", "nur morgens"], rule: "verlängern = länger machen." },
      { id: 1511, sentence: "Im Text: „Die Mehrheit der Befragten war dagegen.“ Das heißt: ___ Leute wollten es nicht.", answer: "Die meisten", distractors: ["Wenige", "Alle", "Keine"], rule: "die Mehrheit = die meisten (not alle)." },
      { id: 1512, sentence: "Im Text: „Das Angebot gilt nur bis Freitag.“ Das heißt: Ab Samstag ___ es das Angebot nicht mehr.", answer: "gibt", distractors: ["kauft", "sucht", "macht"], rule: "gelten bis = nach diesem Tag gibt es das nicht mehr." },
      { id: 1513, sentence: "Im Text: „Er konnte sich nicht entscheiden.“ Das heißt: Er wusste nicht, ___ er nehmen sollte.", answer: "was", distractors: ["dass", "weil", "obwohl"], rule: "sich nicht entscheiden können = nicht wissen, was man nehmen soll. Indirect question → was." },
    ]
  },

  akkusativ: {
    label: "Akkusativ-Präpositionen",
    subtitle: "durch · für · gegen · ohne · um · bis",
    color: "#4a9eff",
    items: [
      { id: 101, sentence: "Wir gehen gerne ___ den Wald spazieren.", answer: "durch", distractors: ["für", "ohne", "um"], rule: "durch + Akkusativ — 'through a space'; always accusative" },
      { id: 102, sentence: "Dieses Buch ist ___ Anfänger.", answer: "für", distractors: ["durch", "gegen", "ohne"], rule: "für + Akkusativ — 'intended for'; always accusative" },
      { id: 103, sentence: "Viele Leute demonstrierten ___ das neue Gesetz.", answer: "gegen", distractors: ["für", "durch", "ohne"], rule: "gegen + Akkusativ — 'against'; always accusative" },
      { id: 104, sentence: "Sie verlässt das Haus nie ___ ihren Regenschirm.", answer: "ohne", distractors: ["durch", "für", "gegen"], rule: "ohne + Akkusativ — 'without'; always accusative" },
      { id: 105, sentence: "Das Konzert beginnt ___ 20 Uhr.", answer: "um", distractors: ["bis", "für", "durch"], rule: "um + Akkusativ — used for clock times ('at 8 o'clock'); always accusative" },
      { id: 106, sentence: "Bitte warte, ___ ich zurückkomme.", answer: "bis", distractors: ["um", "für", "ohne"], rule: "bis + Akkusativ — 'until'; always accusative" },
      { id: 107, sentence: "Die Kinder rennen ___ den ganzen Block.", answer: "um", distractors: ["durch", "bis", "für"], rule: "um + Akkusativ — 'around' (encircling); always accusative" },
      { id: 108, sentence: "Regelmäßiger Sport ist gut ___ die Gesundheit.", answer: "für", distractors: ["gegen", "ohne", "durch"], rule: "für + Akkusativ — 'good for'; always accusative" },
      { id: 109, sentence: "Er nimmt ein Mittel ___ die Erkältung.", answer: "gegen", distractors: ["für", "durch", "ohne"], rule: "gegen + Akkusativ — medication 'against' an illness; always accusative" },
      { id: 110, sentence: "Ich kann morgens nicht arbeiten ___ meinen Kaffee.", answer: "ohne", distractors: ["durch", "für", "gegen"], rule: "ohne + Akkusativ — 'without'; always accusative" },
      { id: 111, sentence: "Kannst du ___ Montag damit fertig sein?", answer: "bis", distractors: ["um", "für", "ohne"], rule: "bis + Akkusativ — 'by (a deadline)'; always accusative" },
      { id: 112, sentence: "Das Regenwasser fließt ___ die Rohre.", answer: "durch", distractors: ["für", "ohne", "um"], rule: "durch + Akkusativ — 'through'; always accusative" },
    ]
  },

  dativ: {
    label: "Dativ-Präpositionen",
    subtitle: "aus · bei · gegenüber · mit · nach · seit · von · zu · außer",
    color: "#a78bfa",
    items: [
      { id: 201, sentence: "Ich fahre ___ meiner Familie in den Urlaub.", answer: "mit", distractors: ["nach", "von", "bei"], rule: "mit + Dativ — 'together with'; always dative" },
      { id: 202, sentence: "Sie wohnt gerade ___ ihrer Schwester.", answer: "bei", distractors: ["mit", "von", "nach"], rule: "bei + Dativ — 'at someone's place'; always dative" },
      { id: 203, sentence: "Das Café liegt direkt ___ der Kirche.", answer: "gegenüber", distractors: ["bei", "nach", "von"], rule: "gegenüber + Dativ — 'opposite/across from'; always dative" },
      { id: 204, sentence: "___ dem Unterricht gehen wir zusammen essen.", answer: "nach", distractors: ["seit", "bei", "aus"], rule: "nach + Dativ — 'after' (time); always dative" },
      { id: 205, sentence: "Er kommt ___ einer kleinen Stadt in Bayern.", answer: "aus", distractors: ["von", "nach", "bei"], rule: "aus + Dativ — origin 'from'; always dative" },
      { id: 206, sentence: "Ich lerne Deutsch ___ über zwei Jahren.", answer: "seit", distractors: ["nach", "bei", "aus"], rule: "seit + Dativ — 'since/for' (ongoing duration); always dative" },
      { id: 207, sentence: "Das Paket kommt ___ meinem Bruder.", answer: "von", distractors: ["mit", "nach", "bei"], rule: "von + Dativ — 'from' (sender); always dative" },
      { id: 208, sentence: "___ mir weiß niemand die richtige Antwort.", answer: "außer", distractors: ["seit", "von", "nach"], rule: "außer + Dativ — 'except for'; always dative" },
      { id: 209, sentence: "Ich fahre nächsten Sommer ___ Japan.", answer: "nach", distractors: ["von", "zu", "bei"], rule: "nach + Dativ — 'to' countries/cities (no article); always dative" },
      { id: 210, sentence: "Das Buch handelt ___ einem jungen Detektiv.", answer: "von", distractors: ["mit", "nach", "bei"], rule: "von + Dativ — 'about' (a book is about sth.); always dative" },
      { id: 211, sentence: "Ich gehe heute Abend ___ einem Freund.", answer: "zu", distractors: ["mit", "von", "nach"], rule: "zu + Dativ — 'to someone's place'; always dative" },
      { id: 212, sentence: "Sie grüßt mich immer ___ einem freundlichen Lächeln.", answer: "mit", distractors: ["nach", "von", "bei"], rule: "mit + Dativ — 'with' (manner/accompaniment); always dative" },
    ]
  },

  wechsel_wo: {
    label: "Wechselpräpositionen — Wo?",
    subtitle: "Location → Dativ: an · auf · in · über · unter · neben · vor · hinter · zwischen",
    color: "#34d399",
    items: [
      { id: 301, sentence: "Das Buch liegt ___ dem Tisch.", answer: "auf", distractors: ["unter", "neben", "hinter"], rule: "auf + Dativ (wo?) — on a horizontal surface; location → always dative" },
      { id: 302, sentence: "Das Bild hängt ___ der Wand.", answer: "an", distractors: ["auf", "über", "vor"], rule: "an + Dativ (wo?) — on a vertical surface; location → dative" },
      { id: 303, sentence: "Ich wohne ___ dem Stadtzentrum.", answer: "in", distractors: ["an", "auf", "vor"], rule: "in + Dativ (wo?) — inside a place; location → dative" },
      { id: 304, sentence: "Die Katze schläft ___ dem Sofa.", answer: "auf", distractors: ["unter", "an", "vor"], rule: "auf + Dativ (wo?) — location on a surface; dative" },
      { id: 305, sentence: "Der Hund liegt ___ dem Bett.", answer: "unter", distractors: ["auf", "vor", "an"], rule: "unter + Dativ (wo?) — below/under; location → dative" },
      { id: 306, sentence: "Er sitzt ___ mir in der Vorlesung.", answer: "neben", distractors: ["vor", "hinter", "über"], rule: "neben + Dativ (wo?) — next to; location → dative" },
      { id: 307, sentence: "Die Schuhe stehen ___ der Tür.", answer: "vor", distractors: ["hinter", "an", "neben"], rule: "vor + Dativ (wo?) — in front of; location → dative" },
      { id: 308, sentence: "Die Lampe hängt ___ dem Esstisch.", answer: "über", distractors: ["an", "auf", "vor"], rule: "über + Dativ (wo?) — above; location → dative" },
      { id: 309, sentence: "Die Kinder spielen ___ dem Haus.", answer: "hinter", distractors: ["vor", "neben", "an"], rule: "hinter + Dativ (wo?) — behind; location → dative" },
      { id: 310, sentence: "Das Café liegt ___ dem Hotel und der Bank.", answer: "zwischen", distractors: ["an", "neben", "vor"], rule: "zwischen + Dativ (wo?) — between; location → dative" },
      { id: 311, sentence: "Er wartet ___ dem Eingang.", answer: "an", distractors: ["vor", "neben", "in"], rule: "an + Dativ (wo?) — at a specific point; location → dative" },
      { id: 312, sentence: "Er saß ___ dem Fernseher und schaute einen Film.", answer: "vor", distractors: ["hinter", "neben", "an"], rule: "vor + Dativ (wo?) — in front of; location → dative" },
    ]
  },

  wechsel_wohin: {
    label: "Wechselpräpositionen — Wohin?",
    subtitle: "Direction → Akkusativ: an · auf · in · über · unter · neben · vor · hinter · zwischen",
    color: "#f59e0b",
    items: [
      { id: 401, sentence: "Stell das Buch ___ den Tisch.", answer: "auf", distractors: ["unter", "neben", "hinter"], rule: "auf + Akkusativ (wohin?) — onto a surface; direction → always accusative" },
      { id: 402, sentence: "Häng das Bild ___ die Wand.", answer: "an", distractors: ["auf", "über", "vor"], rule: "an + Akkusativ (wohin?) — onto a vertical surface; direction → accusative" },
      { id: 403, sentence: "Wir gehen ___ die Stadt.", answer: "in", distractors: ["an", "auf", "vor"], rule: "in + Akkusativ (wohin?) — into a place; direction → accusative" },
      { id: 404, sentence: "Die Katze springt ___ das Sofa.", answer: "auf", distractors: ["unter", "an", "vor"], rule: "auf + Akkusativ (wohin?) — onto; direction → accusative" },
      { id: 405, sentence: "Schieb die Kiste ___ das Bett.", answer: "unter", distractors: ["auf", "vor", "an"], rule: "unter + Akkusativ (wohin?) — to beneath; direction → accusative" },
      { id: 406, sentence: "Setz dich ___ mich!", answer: "neben", distractors: ["vor", "hinter", "über"], rule: "neben + Akkusativ (wohin?) — to sit next to; direction → accusative" },
      { id: 407, sentence: "Stell die Schuhe ___ die Tür.", answer: "vor", distractors: ["hinter", "an", "neben"], rule: "vor + Akkusativ (wohin?) — to in front of; direction → accusative" },
      { id: 408, sentence: "Häng die Lampe ___ den Esstisch.", answer: "über", distractors: ["an", "auf", "vor"], rule: "über + Akkusativ (wohin?) — to above; direction → accusative" },
      { id: 409, sentence: "Der Ball rollt ___ das Haus.", answer: "hinter", distractors: ["vor", "neben", "an"], rule: "hinter + Akkusativ (wohin?) — to behind; direction → accusative" },
      { id: 410, sentence: "Stell den Stuhl ___ den Tisch und das Regal.", answer: "zwischen", distractors: ["an", "neben", "vor"], rule: "zwischen + Akkusativ (wohin?) — to between; direction → accusative" },
      { id: 411, sentence: "Er lehnt das Fahrrad ___ die Wand.", answer: "an", distractors: ["vor", "neben", "in"], rule: "an + Akkusativ (wohin?) — up against; direction → accusative" },
      { id: 412, sentence: "Sie setzt sich ___ den Fernseher, um besser zu sehen.", answer: "vor", distractors: ["hinter", "neben", "an"], rule: "vor + Akkusativ (wohin?) — in front of (direction); accusative" },
    ]
  },

  koord: {
    label: "Koordinierende Konjunktionen",
    subtitle: "und · aber · oder · denn · sondern · doch",
    color: "#f87171",
    items: [
      { id: 501, sentence: "Ich lerne Deutsch, ___ ich reise gern nach Deutschland.", answer: "denn", distractors: ["aber", "und", "oder"], rule: "denn — 'because' (coordinating); no word-order change, unlike weil" },
      { id: 502, sentence: "Sie ist nicht pessimistisch, ___ realistisch.", answer: "sondern", distractors: ["aber", "und", "denn"], rule: "sondern — 'but rather'; only after negation, replacing the negated item" },
      { id: 503, sentence: "Er mag Kaffee, ___ er trinkt keinen nach 18 Uhr.", answer: "aber", distractors: ["und", "oder", "denn"], rule: "aber — 'but/however' (contrast); no word-order change" },
      { id: 504, sentence: "Möchtest du Wasser ___ Saft?", answer: "oder", distractors: ["und", "aber", "denn"], rule: "oder — 'or' (choice between alternatives)" },
      { id: 505, sentence: "Ich lerne Vokabeln ___ höre Podcasts auf Deutsch.", answer: "und", distractors: ["aber", "oder", "denn"], rule: "und — 'and' (addition); no word-order change" },
      { id: 506, sentence: "Er arbeitete die ganze Nacht, ___ er schaffte es dennoch nicht.", answer: "doch", distractors: ["aber", "und", "oder"], rule: "doch — 'yet/however' (strong concession, emphatic contrast); similar to aber" },
      { id: 507, sentence: "Er kommt nicht zur Party, ___ er muss arbeiten.", answer: "denn", distractors: ["aber", "oder", "und"], rule: "denn — 'because' (coordinating); verb stays in position 2" },
      { id: 508, sentence: "Das ist nicht mein Fehler, ___ deiner.", answer: "sondern", distractors: ["aber", "und", "denn"], rule: "sondern — after 'nicht...', replaces with the correct alternative" },
      { id: 509, sentence: "Ich spiele Gitarre ___ singe manchmal dabei.", answer: "und", distractors: ["aber", "oder", "denn"], rule: "und — 'and'; connects two activities" },
      { id: 510, sentence: "Das Wetter war schlecht, ___ wir gingen trotzdem spazieren.", answer: "aber", distractors: ["denn", "und", "oder"], rule: "aber — 'but' (unexpected contrast with previous clause)" },
      { id: 511, sentence: "Willst du zu Hause bleiben ___ kommst du mit?", answer: "oder", distractors: ["und", "aber", "denn"], rule: "oder — 'or' (alternative question)" },
      { id: 512, sentence: "Er hat viel gelernt, ___ er bestand die Prüfung nicht.", answer: "aber", distractors: ["denn", "und", "sondern"], rule: "aber — 'but' (unexpected negative result)" },
    ]
  },

  subord: {
    label: "Subordnierende Konjunktionen",
    subtitle: "weil · da · obwohl · wenn · als · dass · damit · während · nachdem · bevor · ob · falls",
    color: "#fb7185",
    items: [
      { id: 601, sentence: "Ich bin früh aufgestanden, ___ ich einen frühen Zug erwischen musste.", answer: "weil", distractors: ["obwohl", "damit", "als"], rule: "weil — 'because'; subordinating → verb goes to end of clause" },
      { id: 602, sentence: "___ es stark regnet, nehme ich immer einen Schirm mit.", answer: "wenn", distractors: ["als", "weil", "obwohl"], rule: "wenn — 'when/if' (habitual/future condition); verb to end" },
      { id: 603, sentence: "Er ist zur Schule gegangen, ___ er krank war.", answer: "obwohl", distractors: ["weil", "wenn", "damit"], rule: "obwohl — 'although' (unexpected contrast); verb to end" },
      { id: 604, sentence: "Ich weiß nicht, ___ er heute kommt.", answer: "ob", distractors: ["dass", "wenn", "weil"], rule: "ob — 'whether/if' (indirect yes/no question); verb to end" },
      { id: 605, sentence: "___ ich jung war, haben wir kein Internet gehabt.", answer: "als", distractors: ["wenn", "weil", "obwohl"], rule: "als — 'when' (one-time past event/period); NOT wenn; verb to end" },
      { id: 606, sentence: "Sie schreibt Nachrichten, ___ sie in der Vorlesung sitzt.", answer: "während", distractors: ["als", "wenn", "dass"], rule: "während — 'while' (simultaneous actions); verb to end" },
      { id: 607, sentence: "Ich glaube, ___ sie heute krank ist.", answer: "dass", distractors: ["ob", "wenn", "weil"], rule: "dass — 'that' (indirect statement); verb to end" },
      { id: 608, sentence: "Lern hart, ___ du die Prüfung bestehst.", answer: "damit", distractors: ["weil", "obwohl", "wenn"], rule: "damit — 'so that' (purpose, different subjects in each clause); verb to end" },
      { id: 609, sentence: "___ wir gegessen hatten, gingen wir spazieren.", answer: "nachdem", distractors: ["bevor", "während", "als"], rule: "nachdem — 'after'; often with Perfekt/Plusquamperfekt; verb to end" },
      { id: 610, sentence: "Ruf mich an, ___ du Zeit hast.", answer: "wenn", distractors: ["als", "bevor", "weil"], rule: "wenn — 'when' (present/future condition); verb to end" },
      { id: 611, sentence: "___ du gehst, vergiss nicht deinen Ausweis.", answer: "bevor", distractors: ["nachdem", "wenn", "als"], rule: "bevor — 'before'; verb to end" },
      { id: 612, sentence: "___ du das Buch nicht mehr brauchst, kannst du es mir geben.", answer: "falls", distractors: ["wenn", "ob", "weil"], rule: "falls — 'in case/if' (possibility that may not happen); verb to end" },
    ]
  },

  adverbial: {
    label: "Adverbiale Konnektoren",
    subtitle: "deshalb · trotzdem · jedoch · außerdem · dann · danach · zuerst · schließlich · nämlich · also",
    color: "#fbbf24",
    items: [
      { id: 701, sentence: "Ich bin sehr müde. ___ gehe ich früh ins Bett.", answer: "deshalb", distractors: ["trotzdem", "jedoch", "außerdem"], rule: "deshalb — 'therefore'; causes verb-subject inversion at start of clause" },
      { id: 702, sentence: "Es regnet stark. ___ gehen wir spazieren.", answer: "trotzdem", distractors: ["deshalb", "jedoch", "außerdem"], rule: "trotzdem — 'nevertheless/anyway'; concessive; causes inversion" },
      { id: 703, sentence: "Das Essen war lecker. ___ war es zu teuer.", answer: "jedoch", distractors: ["trotzdem", "deshalb", "außerdem"], rule: "jedoch — 'however' (contrast/limitation); causes inversion" },
      { id: 704, sentence: "Ich lerne Deutsch. ___ lerne ich auch Spanisch.", answer: "außerdem", distractors: ["jedoch", "trotzdem", "deshalb"], rule: "außerdem — 'furthermore/in addition'; causes inversion; additive" },
      { id: 705, sentence: "Ich dusche, und ___ esse ich Frühstück.", answer: "dann", distractors: ["danach", "zuerst", "schließlich"], rule: "dann — 'then' (immediate next step in a sequence)" },
      { id: 706, sentence: "Zuerst lerne ich Vokabeln. ___ mache ich die Grammatikübungen.", answer: "danach", distractors: ["dann", "zuerst", "schließlich"], rule: "danach — 'after that/afterwards'; causes inversion" },
      { id: 707, sentence: "___ wasche ich mir die Hände. Dann esse ich.", answer: "zuerst", distractors: ["dann", "danach", "schließlich"], rule: "zuerst — 'first of all'; causes inversion when starting a clause" },
      { id: 708, sentence: "Er hat lange überlegt. ___ hat er sich entschieden.", answer: "schließlich", distractors: ["dann", "danach", "trotzdem"], rule: "schließlich — 'finally/in the end' (after a process); causes inversion" },
      { id: 709, sentence: "Er kommt nicht. Er hat ___ keine Zeit.", answer: "nämlich", distractors: ["also", "jedoch", "außerdem"], rule: "nämlich — 'you see/namely' (explanation); goes after the verb, NEVER starts a sentence" },
      { id: 710, sentence: "Ich habe keine Zeit. ___ muss ich mich beeilen.", answer: "also", distractors: ["jedoch", "trotzdem", "außerdem"], rule: "also — 'so/therefore' (logical conclusion); causes inversion" },
      { id: 711, sentence: "Das Projekt war schwierig. ___ haben wir es erfolgreich abgeschlossen.", answer: "trotzdem", distractors: ["deshalb", "außerdem", "jedoch"], rule: "trotzdem — 'despite that'; concessive; causes inversion" },
      { id: 712, sentence: "Die Prüfung war sehr wichtig. ___ hatte ich viel gelernt.", answer: "deshalb", distractors: ["trotzdem", "außerdem", "jedoch"], rule: "deshalb — 'that's why' (causal consequence); causes inversion" },
    ]
  },

  dacompounds: {
    label: "Da- & Wo-Verbindungen",
    subtitle: "davon · damit · darauf · daran · darüber · dafür · dabei · dazu · dadurch + worauf · wofür · wovon ...",
    color: "#60a5fa",
    items: [
      { id: 801, sentence: "Was hältst du _____? Ich finde die Idee sehr gut.", answer: "davon", distractors: ["damit", "daran", "darüber"], rule: "davon — 'about/of it' (replaces von + das/etwas); for things, not people" },
      { id: 802, sentence: "Ich freue mich _____, dass ich die Prüfung bestanden habe.", answer: "darüber", distractors: ["davon", "dafür", "daran"], rule: "darüber — 'about it' (replaces über + das); dar- before vowels" },
      { id: 803, sentence: "Kannst du dich noch _____ erinnern?", answer: "daran", distractors: ["darauf", "davon", "dabei"], rule: "daran — 'of it' (replaces an + das); sich erinnern an → daran" },
      { id: 804, sentence: "Ich habe lange _____ gewartet.", answer: "darauf", distractors: ["davon", "daran", "dabei"], rule: "darauf — 'for it' (replaces auf + das); warten auf → darauf warten" },
      { id: 805, sentence: "Ich bin _____, aber mein Kollege ist dagegen.", answer: "dafür", distractors: ["dagegen", "davon", "damit"], rule: "dafür — 'for it/in favor' (replaces für + das)" },
      { id: 806, sentence: "Er hat mir _____ geholfen, den Umzug zu organisieren.", answer: "dabei", distractors: ["davon", "daran", "dafür"], rule: "dabei — 'with that/in doing so'; helfen bei → dabei helfen" },
      { id: 807, sentence: "Er hat keine Lust _____.", answer: "dazu", distractors: ["davon", "darauf", "dabei"], rule: "dazu — 'for it/to it' (replaces zu + das); Lust zu etwas → Lust dazu" },
      { id: 808, sentence: "Ich höre täglich Podcasts auf Deutsch. _____ verbessert sich mein Deutsch.", answer: "dadurch", distractors: ["davon", "daran", "dabei"], rule: "dadurch — 'through that/thereby' (replaces durch + das)" },
      { id: 809, sentence: "_____ hast du keine Angst?", answer: "Wovor", distractors: ["Womit", "Wovon", "Woran"], rule: "Wovor — question for davor; Angst vor etwas → Wovor hast du Angst?" },
      { id: 810, sentence: "_____ wartest du?", answer: "Worauf", distractors: ["Womit", "Wovon", "Woran"], rule: "Worauf — question for darauf; warten auf → Worauf wartest du?" },
      { id: 811, sentence: "_____ interessierst du dich?", answer: "Wofür", distractors: ["Womit", "Woran", "Worüber"], rule: "Wofür — question for dafür; sich interessieren für → Wofür interessierst du dich?" },
      { id: 812, sentence: "_____ träumst du?", answer: "Wovon", distractors: ["Womit", "Woran", "Worauf"], rule: "Wovon — question for davon; träumen von → Wovon träumst du?" },
    ]
  },

  verbprep: {
    label: "Verben mit Präpositionen",
    subtitle: "warten auf · denken an · sich freuen auf/über · sprechen über · ...",
    color: "#c084fc",
    items: [
      { id: 901, sentence: "Ich warte ___ deinen Anruf.", answer: "auf", distractors: ["nach", "von", "bei"], rule: "warten auf + Akkusativ — 'to wait for'" },
      { id: 902, sentence: "Wir müssen ___ das Problem sprechen.", answer: "über", distractors: ["von", "mit", "nach"], rule: "sprechen über + Akkusativ — 'to talk about'" },
      { id: 903, sentence: "Er interessiert sich sehr ___ Geschichte.", answer: "für", distractors: ["an", "über", "nach"], rule: "sich interessieren für + Akkusativ — 'to be interested in'" },
      { id: 904, sentence: "Ich denke oft ___ meine Familie.", answer: "an", distractors: ["über", "von", "bei"], rule: "denken an + Akkusativ — 'to think of/about'" },
      { id: 905, sentence: "Darf ich Sie ___ Ihren Namen bitten?", answer: "um", distractors: ["für", "nach", "von"], rule: "bitten um + Akkusativ — 'to ask for'" },
      { id: 906, sentence: "Er träumt ___ einer Weltreise.", answer: "von", distractors: ["über", "nach", "bei"], rule: "träumen von + Dativ — 'to dream of'" },
      { id: 907, sentence: "Ich kann mich vollständig ___ dich verlassen.", answer: "auf", distractors: ["für", "von", "mit"], rule: "sich verlassen auf + Akkusativ — 'to rely on'" },
      { id: 908, sentence: "Sie kümmert sich liebevoll ___ ihre Kinder.", answer: "um", distractors: ["für", "nach", "von"], rule: "sich kümmern um + Akkusativ — 'to take care of'" },
      { id: 909, sentence: "Er leidet ___ starken Migränen.", answer: "unter", distractors: ["über", "von", "nach"], rule: "leiden unter + Dativ — 'to suffer from'" },
      { id: 910, sentence: "Wasser besteht ___ Wasserstoff und Sauerstoff.", answer: "aus", distractors: ["von", "mit", "unter"], rule: "bestehen aus + Dativ — 'to consist of'" },
      { id: 911, sentence: "Sie freut sich sehr ___ ihr gutes Ergebnis.", answer: "über", distractors: ["auf", "für", "von"], rule: "sich freuen über + Akkusativ — 'happy about' a past/present event" },
      { id: 912, sentence: "Ich freue mich schon ___ das Konzert nächste Woche.", answer: "auf", distractors: ["über", "für", "von"], rule: "sich freuen auf + Akkusativ — 'looking forward to' a future event" },
      { id: 913, sentence: "Er fragt ___ dem Weg zum Bahnhof.", answer: "nach", distractors: ["von", "über", "bei"], rule: "fragen nach + Dativ — 'to ask about/for directions'" },
      { id: 914, sentence: "Wir beginnen ___ dem ersten Kapitel.", answer: "mit", distractors: ["nach", "für", "von"], rule: "beginnen mit + Dativ — 'to begin with'" },
      { id: 915, sentence: "Sie ärgert sich ___ den ständigen Lärm.", answer: "über", distractors: ["von", "nach", "mit"], rule: "sich ärgern über + Akkusativ — 'to be annoyed about'" },
    ]
  }
};
