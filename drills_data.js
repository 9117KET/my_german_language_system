// drills_data.js — Gap-fill drill sets for prepositions, conjunctions, and connectors
// Each item: { id, sentence (with ___), answer, distractors[3], rule }

const DRILL_SETS = {
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
