// telc Deutsch B2 exam simulator data
// - EXAM_WRITE_TASKS: Schriftlicher Ausdruck tasks (formal letter, 4 Leitpunkte, 30 min)
// - EXAM_SPEAK_TOPICS: Muendliche Pruefung Teil 1 presentation topics
// - EXAM_SB_FALLBACK: built-in Sprachbausteine test used when the API is unavailable

const EXAM_WRITE_TASKS = [
  {
    id: "beschwerde_online",
    type: "Beschwerde",
    title: "Beschwerde: Online-Bestellung",
    situation: "Sie haben vor drei Wochen einen Laptop bei einem Online-Shop bestellt und per Vorkasse bezahlt. Der Laptop ist immer noch nicht angekommen. Auf zwei E-Mails hat der Kundenservice nicht reagiert. Schreiben Sie an die Geschäftsleitung.",
    points: [
      "Grund Ihres Schreibens",
      "Beschreiben Sie das Problem genau (Bestellung, Bezahlung, Kontaktversuche)",
      "Fordern Sie eine Lösung (Lieferung oder Geld zurück)",
      "Setzen Sie eine Frist und nennen Sie Konsequenzen",
    ],
  },
  {
    id: "beschwerde_kurs",
    type: "Beschwerde",
    title: "Beschwerde: Sprachkurs",
    situation: "Sie besuchen einen teuren Deutschkurs. Im Prospekt wurden kleine Gruppen (maximal 8 Personen) und moderne Unterrichtsräume versprochen. In Wirklichkeit sind Sie 16 Personen in einem kleinen Raum ohne funktionierende Technik. Schreiben Sie an die Kursleitung.",
    points: [
      "Grund Ihres Schreibens",
      "Vergleichen Sie die Versprechen im Prospekt mit der Realität",
      "Beschreiben Sie die Folgen für Ihr Lernen",
      "Fordern Sie eine konkrete Lösung",
    ],
  },
  {
    id: "anfrage_sprachschule",
    type: "Anfrage",
    title: "Anfrage: Intensivkurs",
    situation: "Sie möchten im Sommer einen vierwöchigen Intensivkurs Deutsch (Niveau B2/C1) in München besuchen. Sie haben die Website einer Sprachschule gefunden, aber wichtige Informationen fehlen. Schreiben Sie an die Schule.",
    points: [
      "Grund Ihres Schreibens und Ihre Situation",
      "Fragen Sie nach Terminen und Preisen",
      "Fragen Sie nach Unterkunftsmöglichkeiten",
      "Bitten Sie um Informationen zur Prüfungsvorbereitung",
    ],
  },
  {
    id: "bewerbung_nebenjob",
    type: "Bewerbung",
    title: "Bewerbung: Nebenjob",
    situation: "Eine internationale Firma in Ihrer Stadt sucht Werkstudenten (m/w/d) für den Bereich Kundenbetreuung. Gefordert werden gute Deutschkenntnisse, Teamfähigkeit und zeitliche Flexibilität. Schreiben Sie eine Bewerbung.",
    points: [
      "Grund Ihres Schreibens (Wo haben Sie die Anzeige gesehen?)",
      "Stellen Sie sich und Ihre aktuelle Situation vor",
      "Erklären Sie, warum Sie für die Stelle geeignet sind",
      "Fragen Sie nach den nächsten Schritten",
    ],
  },
  {
    id: "leserbrief_homeoffice",
    type: "Leserbrief",
    title: "Leserbrief: Homeoffice",
    situation: "In einer Zeitung haben Sie einen Artikel mit dem Titel \"Homeoffice macht unproduktiv und einsam\" gelesen. Sie haben dazu eine andere Meinung und eigene Erfahrungen. Schreiben Sie einen Leserbrief an die Redaktion.",
    points: [
      "Grund Ihres Schreibens (Bezug auf den Artikel)",
      "Sagen Sie Ihre Meinung zum Thema",
      "Berichten Sie von eigenen Erfahrungen",
      "Machen Sie einen Vorschlag, wie man Homeoffice gut gestalten kann",
    ],
  },
  {
    id: "leserbrief_socialmedia",
    type: "Leserbrief",
    title: "Leserbrief: Soziale Medien",
    situation: "Eine Online-Zeitung hat einen Artikel veröffentlicht: \"Soziale Medien sollten erst ab 18 erlaubt sein\". Die Leser werden um ihre Meinung gebeten. Schreiben Sie einen Kommentar an die Redaktion.",
    points: [
      "Grund Ihres Schreibens",
      "Nennen Sie Vorteile und Nachteile von sozialen Medien für junge Menschen",
      "Sagen Sie klar Ihre eigene Meinung zum Verbot",
      "Schlagen Sie eine Alternative zum Verbot vor",
    ],
  },
  {
    id: "anfrage_wohnung",
    type: "Anfrage",
    title: "Anfrage: Wohnungsanzeige",
    situation: "Sie ziehen in zwei Monaten für Ihr Studium nach Hamburg und haben online eine interessante Wohnungsanzeige gefunden (2 Zimmer, möbliert). Einige wichtige Punkte sind aber unklar. Schreiben Sie an den Vermieter.",
    points: [
      "Grund Ihres Schreibens und Ihre Situation",
      "Fragen Sie nach den genauen Kosten (Miete, Nebenkosten, Kaution)",
      "Fragen Sie nach der Verfügbarkeit und Mindestmietdauer",
      "Bitten Sie um einen Besichtigungstermin",
    ],
  },
];

const EXAM_SPEAK_TOPICS = [
  { id: "online_shopping", de: "Einkaufen im Internet", en: "Online shopping" },
  { id: "homeoffice", de: "Arbeiten im Homeoffice", en: "Working from home" },
  { id: "social_media", de: "Soziale Medien im Alltag", en: "Social media in daily life" },
  { id: "auslandsstudium", de: "Ein Studium im Ausland", en: "Studying abroad" },
  { id: "vegetarisch", de: "Vegetarische und vegane Ernährung", en: "Vegetarian and vegan diets" },
  { id: "autofrei", de: "Autofreie Innenstädte", en: "Car-free city centers" },
  { id: "lernen", de: "Lebenslanges Lernen", en: "Lifelong learning" },
  { id: "stadt_land", de: "Wohnen in der Stadt oder auf dem Land", en: "Living in the city or countryside" },
  { id: "smartphone", de: "Smartphones im Alltag", en: "Smartphones in everyday life" },
  { id: "ehrenamt", de: "Ehrenamtliche Arbeit", en: "Volunteer work" },
  { id: "fast_fashion", de: "Fast Fashion und Konsum", en: "Fast fashion and consumption" },
  { id: "ki", de: "Künstliche Intelligenz im Alltag", en: "AI in everyday life" },
];

// telc presentation structure (Teil 1): what the examiner expects to hear
const EXAM_SPEAK_STRUCTURE = [
  "Einleitung: Worüber sprechen Sie? Warum ist das Thema aktuell?",
  "Ihre persönlichen Erfahrungen mit dem Thema",
  "Die Situation in Ihrem Heimatland",
  "Vor- und Nachteile + Ihre Meinung am Schluss",
];

const EXAM_SB_FALLBACK = {
  title: "Bewerbung um ein Praktikum",
  text: "Sehr geehrte Damen und Herren,\n\nmit großem Interesse habe ich Ihre Anzeige [1] ein Praktikum im Bereich Marketing gelesen. Zurzeit studiere ich Betriebswirtschaft [2] der Universität Bremen und möchte meine theoretischen Kenntnisse in der Praxis [3].\n\nWährend meines Studiums habe ich bereits Erfahrungen im Online-Marketing gesammelt, [4] ich für den Social-Media-Auftritt einer studentischen Initiative verantwortlich war. Außerdem kann ich gut mit Stress [5], weil ich neben dem Studium in einem Café arbeite.\n\nIch würde mich freuen, [6] Sie mir die Möglichkeit geben, Ihr Team kennenzulernen. [7] Fragen stehe ich Ihnen jederzeit gern zur Verfügung. Bitte teilen Sie mir mit, [8] ich mich persönlich bei Ihnen vorstellen kann.\n\n[9] freundlichen Grüßen\nAnna Petrova\n\nPS: Meinen Lebenslauf finden Sie [10] Anhang.",
  items: [
    { num: 1,  options: ["für", "über", "von"],                  answer: 0, rule: "die Anzeige für + Akkusativ (an ad for something)", sentence: "Ich habe Ihre Anzeige ___ ein Praktikum gelesen." },
    { num: 2,  options: ["an", "auf", "bei"],                    answer: 0, rule: "studieren an + Dativ (an der Universität)",          sentence: "Ich studiere ___ der Universität Bremen." },
    { num: 3,  options: ["anwenden", "anzuwenden", "angewendet"],answer: 0, rule: "Modal verb möchte + plain infinitive at the end",    sentence: "Ich möchte meine Kenntnisse in der Praxis ___." },
    { num: 4,  options: ["als", "wenn", "ob"],                   answer: 0, rule: "als for a single period in the past",                sentence: "Ich habe Erfahrungen gesammelt, ___ ich dafür verantwortlich war." },
    { num: 5,  options: ["umgehen", "umzugehen", "umgegangen"],  answer: 0, rule: "können + plain infinitive (mit etwas umgehen)",      sentence: "Ich kann gut mit Stress ___." },
    { num: 6,  options: ["wenn", "ob", "dass"],                  answer: 0, rule: "sich freuen, wenn + condition",                      sentence: "Ich würde mich freuen, ___ Sie mir die Möglichkeit geben." },
    { num: 7,  options: ["Bei", "Für", "Mit"],                   answer: 0, rule: "bei Fragen = in case of questions (fixed phrase)",   sentence: "___ Fragen stehe ich Ihnen gern zur Verfügung." },
    { num: 8,  options: ["wann", "dass", "weil"],                answer: 0, rule: "Indirect W-question: mitteilen, wann ...",           sentence: "Bitte teilen Sie mir mit, ___ ich mich vorstellen kann." },
    { num: 9,  options: ["Mit", "Bei", "Von"],                   answer: 0, rule: "Fixed closing formula: Mit freundlichen Grüßen",     sentence: "___ freundlichen Grüßen" },
    { num: 10, options: ["im", "am", "beim"],                    answer: 0, rule: "im Anhang = attached (in dem Anhang)",               sentence: "Meinen Lebenslauf finden Sie ___ Anhang." },
  ],
};

// EXAM_LV_FALLBACK / EXAM_HV_FALLBACK: built-in Leseverstehen and Hörverstehen tasks,
// used when the API is unavailable or rate-limited (the Groq free tier allows only
// 8000 tokens per minute, so a burst of practice can hit the limit). Same shape as the
// API responses, so the UI does not care where a task came from.

const EXAM_LV_FALLBACK = {
  1: {
    part: 1,
    instructions: "Lesen Sie die fünf Texte und die Überschriften. Welche Überschrift passt zu welchem Text?",
    headings: [
      "Weniger Autos, mehr Platz zum Leben",              // 0
      "Wenn der Arbeitsweg zum Wohnzimmer wird",          // 1
      "Alte Gebäude, neue Ideen",                         // 2
      "Sport auf Rezept",                                 // 3
      "Einkaufen ohne Verpackung",                        // 4
      "Der Preis der schnellen Mode",                     // 5
      "Lernen ohne Klassenzimmer",                        // 6
      "Wenn Nachbarn zu Gärtnern werden",                 // 7
    ],
    texts: [
      {
        num: 1,
        text: "Immer mehr deutsche Städte sperren ihre Innenstädte für den Autoverkehr. Wo früher Parkplätze waren, stehen heute Bänke, Bäume und Fahrradständer. Händler befürchteten zunächst Umsatzeinbußen, doch Untersuchungen zeigen das Gegenteil: Wer zu Fuß unterwegs ist, bleibt länger und gibt mehr Geld aus. Die Aufenthaltsqualität steigt spürbar.",
        answer: 0,
        rule: "The text is about closing city centres to cars and the space that frees up.",
      },
      {
        num: 2,
        text: "Seit der Pandemie arbeitet rund ein Viertel der Beschäftigten zumindest teilweise von zu Hause. Viele schätzen die gesparte Fahrzeit und die freie Einteilung des Tages. Fachleute warnen jedoch vor der Vermischung von Beruf und Privatleben: Wer am Küchentisch arbeitet, macht seltener Pausen und schaltet abends schwerer ab.",
        answer: 1,
        rule: "The topic is working from home and the blurring of work and private life.",
      },
      {
        num: 3,
        text: "Eine stillgelegte Fabrik in Leipzig beherbergt heute Ateliers, eine Kletterhalle und ein Theater. Abriss wäre teurer gewesen als der Umbau, rechnet die Stadt vor. Zudem spart die Weiternutzung große Mengen an Baustoffen. Ähnliche Projekte entstehen derzeit in mehreren ostdeutschen Städten.",
        answer: 2,
        rule: "Old industrial buildings are being converted rather than demolished.",
      },
      {
        num: 4,
        text: "In einem Hamburger Laden gibt es weder Plastiktüten noch abgepackte Ware. Kundinnen und Kunden bringen eigene Gläser und Dosen mit und füllen Reis, Nudeln oder Waschmittel selbst ab. Der Laden verkauft dadurch nur so viel, wie tatsächlich gebraucht wird — auch Lebensmittelabfälle gehen zurück.",
        answer: 4,
        rule: "The shop sells unpackaged goods that customers fill into their own containers.",
      },
      {
        num: 5,
        text: "Immer mehr Ärztinnen und Ärzte verschreiben ihren Patienten Bewegung statt Tabletten. Bei Rückenschmerzen, Bluthochdruck und leichten Depressionen gilt regelmäßiges Training inzwischen als wirksame Behandlung. Einige Krankenkassen übernehmen bereits einen Teil der Kosten für entsprechende Kurse.",
        answer: 3,
        rule: "Doctors prescribe exercise instead of medication, and insurers pay for it.",
      },
    ],
  },

  2: {
    part: 2,
    instructions: "Lesen Sie den Text und beantworten Sie die Fragen. Nur eine Antwort ist richtig.",
    title: "Die Vier-Tage-Woche auf dem Prüfstand",
    text: "Seit einigen Jahren wird in Deutschland intensiv über die Vier-Tage-Woche diskutiert. Was lange als Wunschdenken einzelner Gewerkschaften galt, ist inzwischen in mehreren Branchen Realität geworden. Rund fünfzig deutsche Unternehmen haben das Modell in einem gemeinsamen Versuch über sechs Monate erprobt — bei vollem Lohnausgleich, also ohne Kürzung der Gehälter.\n\nDie Ergebnisse fielen überwiegend positiv aus. In den beteiligten Betrieben sank der Krankenstand deutlich, und die Zahl der Kündigungen ging spürbar zurück. Besonders bemerkenswert: Die Produktivität blieb in den meisten Fällen konstant, in einigen Unternehmen stieg sie sogar leicht an. Die Beschäftigten berichteten von geringerem Stress und mehr Zeit für Familie und Erholung.\n\nDie Erklärung dafür liegt weniger im freien Tag selbst als in den Veränderungen, die er erzwingt. Wer ein Fünftel seiner Arbeitszeit verliert, muss Abläufe überdenken. In vielen Betrieben wurden Besprechungen radikal gekürzt oder ganz gestrichen, Zuständigkeiten klarer verteilt und Arbeitsschritte automatisiert, die zuvor jahrelang unangetastet geblieben waren. Der Zeitdruck wirkte gewissermaßen als Reformmotor.\n\nAllerdings lässt sich das Modell nicht überall gleich leicht übertragen. In der Industrie, in Krankenhäusern und im Einzelhandel hängt die Leistung unmittelbar an der Anwesenheit von Personal. Fällt ein Arbeitstag weg, muss er durch zusätzliche Kräfte ersetzt werden — und die sind auf einem angespannten Arbeitsmarkt kaum zu finden. Kritiker verweisen zudem darauf, dass die Teilnahme an solchen Versuchen freiwillig ist: Es melden sich vor allem Unternehmen, die ohnehin gut organisiert sind und dem Modell positiv gegenüberstehen.\n\nWirtschaftsverbände warnen deshalb vor voreiligen Schlüssen und fordern längere Untersuchungszeiträume. Sechs Monate seien zu kurz, um dauerhafte Effekte zu belegen; ein Neuigkeitseffekt könne die Ergebnisse verzerren. Befürworter halten dagegen, dass die Vier-Tage-Woche angesichts des Fachkräftemangels ohnehin zum entscheidenden Argument im Wettbewerb um gute Bewerber werde. Wer heute Personal sucht, konkurriere nicht mehr nur über das Gehalt.",
    questions: [
      {
        num: 1,
        q: "Was war bei dem beschriebenen Versuch mit der Vier-Tage-Woche der Fall?",
        options: [
          "Die Beschäftigten mussten auf einen Teil ihres Gehalts verzichten.",
          "Die Beschäftigten erhielten weiterhin ihr volles Gehalt.",
          "Die Beschäftigten arbeiteten die fehlende Zeit später nach.",
        ],
        answer: 1,
        rule: "The text says the trial ran \"bei vollem Lohnausgleich, also ohne Kürzung der Gehälter\".",
      },
      {
        num: 2,
        q: "Wie entwickelte sich die Produktivität in den beteiligten Unternehmen?",
        options: [
          "Sie blieb meist gleich und stieg teilweise sogar an.",
          "Sie sank leicht, was die Betriebe aber in Kauf nahmen.",
          "Sie schwankte so stark, dass keine Aussage möglich war.",
        ],
        answer: 0,
        rule: "\"Die Produktivität blieb in den meisten Fällen konstant, in einigen Unternehmen stieg sie sogar leicht an.\"",
      },
      {
        num: 3,
        q: "Worauf führt der Text die positiven Effekte vor allem zurück?",
        options: [
          "Auf die zusätzliche Erholung durch den freien Tag.",
          "Auf die Umstellung der Arbeitsabläufe, die der Zeitverlust erzwingt.",
          "Auf die bessere technische Ausstattung der Betriebe.",
        ],
        answer: 1,
        rule: "\"Die Erklärung dafür liegt weniger im freien Tag selbst als in den Veränderungen, die er erzwingt.\"",
      },
      {
        num: 4,
        q: "Warum ist das Modell in Krankenhäusern schwerer umzusetzen?",
        options: [
          "Weil die Beschäftigten dort kein Interesse daran haben.",
          "Weil gesetzliche Vorschriften es ausdrücklich verbieten.",
          "Weil die Leistung an die Anwesenheit von Personal gebunden ist.",
        ],
        answer: 2,
        rule: "The text names industry, hospitals and retail, where output depends directly on staff being present.",
      },
      {
        num: 5,
        q: "Was kritisieren die Wirtschaftsverbände an den bisherigen Ergebnissen?",
        options: [
          "Der Untersuchungszeitraum sei zu kurz für sichere Aussagen.",
          "Die Unternehmen hätten die Zahlen bewusst geschönt.",
          "Die Beschäftigten seien gar nicht befragt worden.",
        ],
        answer: 0,
        rule: "They call six months too short and warn of a novelty effect distorting the results.",
      },
    ],
  },

  3: {
    part: 3,
    instructions: "Lesen Sie die Situationen und die Anzeigen. Welche Anzeige passt zu welcher Situation? Manche Situationen haben keine passende Anzeige.",
    ads: [
      { title: "Volkshochschule: Deutsch B2", text: "Prüfungsvorbereitung telc B2, dienstags und donnerstags 18–20 Uhr, 12 Wochen, 180 €. Kleine Gruppen bis 12 Personen. Einstufungstest erforderlich." },
      { title: "Konversationskurs Spanisch", text: "Spanisch sprechen für Fortgeschrittene, mittwochs 19–20:30 Uhr, 95 € für 10 Termine. Muttersprachliche Leitung, Niveau B1 aufwärts." },
      { title: "Schwimmkurs für Erwachsene", text: "Anfängerkurs im Hallenbad Nord, samstags 9–10 Uhr, 8 Termine, 120 €. Auch für Menschen ohne jede Vorerfahrung geeignet." },
      { title: "Fahrradwerkstatt zum Selbermachen", text: "Offene Werkstatt, freitags 16–20 Uhr. Werkzeug kostenlos, Beratung durch Ehrenamtliche. Ersatzteile gegen Spende. Keine Anmeldung nötig." },
      { title: "Klavierunterricht", text: "Einzelunterricht für Kinder ab 6 Jahren, 45 Minuten, 35 € pro Stunde. Nachmittags von Montag bis Freitag, Stadtteil Südstadt." },
      { title: "Nachhilfe Mathematik", text: "Für Schülerinnen und Schüler der Klassen 5 bis 10, online oder vor Ort, 22 € pro Stunde. Termine nach Absprache, auch in den Ferien." },
      { title: "Gemeinschaftsgarten sucht Mitglieder", text: "Freie Beete im Stadtteilgarten ab April, 40 € Jahresbeitrag inklusive Wasser und Werkzeug. Gemeinsame Arbeitseinsätze einmal im Monat." },
      { title: "Yoga am Morgen", text: "Hatha-Yoga für alle Niveaus, montags und mittwochs 7–8 Uhr, 10er-Karte 110 €. Matten werden gestellt, Duschen vorhanden." },
      { title: "Chor sucht Stimmen", text: "Gemischter Chor probt donnerstags 19:30–21:30 Uhr. Notenkenntnisse nicht erforderlich, Probemonat kostenlos, danach 15 € monatlich." },
      { title: "Computerkurs für Senioren", text: "Smartphone und Internet verstehen, montags 10–11:30 Uhr, 6 Termine, 60 €. Eigene Geräte können mitgebracht werden." },
      { title: "Kochkurs: Vegetarisch kochen", text: "Samstags 17–20 Uhr, 65 € inklusive Zutaten und Getränken, maximal 10 Teilnehmende. Rezepte zum Mitnehmen." },
      { title: "Laufgruppe im Stadtpark", text: "Gemeinsames Laufen für Einsteiger, dienstags 18:30 Uhr, kostenlos. Treffpunkt am Haupteingang, keine Anmeldung." },
    ],
    situations: [
      { num: 1, text: "Frau Weber möchte sich gezielt auf ihre telc-B2-Prüfung vorbereiten und kann abends nach der Arbeit.", answer: 0, rule: "Ad a is exactly telc B2 exam preparation in the evening." },
      { num: 2, text: "Herr Novak hat noch nie schwimmen gelernt und sucht einen Kurs am Wochenende.", answer: 2, rule: "Ad c is a beginners' course on Saturdays, explicitly for people with no experience." },
      { num: 3, text: "Ein Student möchte sein defektes Fahrrad selbst reparieren, hat aber kein Werkzeug.", answer: 3, rule: "Ad d lends tools free of charge in an open workshop." },
      { num: 4, text: "Eine Mutter sucht Mathematik-Nachhilfe für ihren Sohn in der 8. Klasse, auch während der Ferien.", answer: 5, rule: "Ad f covers grades 5–10 and offers appointments during the holidays." },
      { num: 5, text: "Herr Yilmaz möchte vor der Arbeit Sport machen und sucht ein Angebot am frühen Morgen.", answer: 7, rule: "Ad h runs 7–8 a.m. on Mondays and Wednesdays." },
      { num: 6, text: "Eine Rentnerin möchte lernen, wie sie ihr eigenes Smartphone besser nutzt.", answer: 9, rule: "Ad j is a smartphone and internet course for seniors, own devices welcome." },
      { num: 7, text: "Ein Ehepaar möchte gemeinsam singen, kann aber keine Noten lesen.", answer: 8, rule: "Ad i states that reading music is not required." },
      { num: 8, text: "Eine Familie möchte im Sommer eigenes Gemüse anbauen, hat aber keinen eigenen Garten.", answer: 6, rule: "Ad g offers beds in a community garden from April." },
      { num: 9, text: "Ein Berufstätiger sucht einen Italienischkurs für Anfänger am Abend.", answer: 12, rule: "No ad offers Italian — ad b is Spanish, and for advanced learners." },
      { num: 10, text: "Ein Vater sucht Gitarrenunterricht für seine zehnjährige Tochter.", answer: 12, rule: "Ad e offers piano, not guitar, so no ad matches." },
    ],
  },
};

const EXAM_HV_FALLBACK = {
  1: {
    part: 1,
    title: "Fünf kurze Durchsagen",
    script: "Liebe Fahrgäste, die Linie S4 fährt heute wegen Bauarbeiten nur bis zum Hauptbahnhof. Von dort nutzen Sie bitte den Ersatzverkehr mit Bussen. Wir rechnen mit etwa zwanzig Minuten längerer Fahrzeit.\n\nGuten Tag, hier ist die Praxis Dr. Behrens. Ihr Termin am Donnerstag um 15 Uhr muss leider verschoben werden. Wir bieten Ihnen stattdessen Freitag um 9 Uhr an. Bitte rufen Sie kurz zurück.\n\nAchtung, eine Durchsage für unsere Kunden: Die Obst- und Gemüseabteilung schließt heute bereits um 18 Uhr wegen einer Inventur. Alle übrigen Abteilungen haben wie gewohnt bis 20 Uhr geöffnet.\n\nHallo Sabine, ich bin's, Markus. Ich stehe im Stau auf der A7 und schaffe es nicht pünktlich ins Kino. Geh schon mal rein, ich komme etwa eine halbe Stunde später.\n\nLiebe Studierende, die Bibliothek bleibt am kommenden Montag geschlossen. Rückgaben können Sie in den Automaten im Erdgeschoss einwerfen, der rund um die Uhr erreichbar ist.",
    items: [
      { num: 1, statement: "Die Linie S4 fällt heute vollständig aus.", answer: false, rule: "It runs as far as the Hauptbahnhof; only beyond that a replacement bus is needed." },
      { num: 2, statement: "Der Arzttermin wird auf einen anderen Tag verlegt.", answer: true, rule: "Thursday 3 p.m. is moved to Friday 9 a.m." },
      { num: 3, statement: "Das ganze Geschäft schließt heute um 18 Uhr.", answer: false, rule: "Only the fruit and vegetable department closes early; the rest stays open until 8 p.m." },
      { num: 4, statement: "Markus kommt später ins Kino.", answer: true, rule: "He is stuck in traffic and will arrive about half an hour late." },
      { num: 5, statement: "Am Montag können keine Bücher zurückgegeben werden.", answer: false, rule: "Returns are possible around the clock via the machine on the ground floor." },
    ],
  },
  2: {
    part: 2,
    title: "Interview: Lärm in der Stadt",
    script: "Willkommen zu unserer Sendung Stadt und Gesundheit. Mein Gast ist heute Frau Dr. Annika Reuter vom Institut für Umweltmedizin. Frau Reuter, Lärm gilt inzwischen als ernstes Gesundheitsrisiko. Ist das nicht übertrieben? Nein, ganz und gar nicht. Nach unseren Erhebungen fühlen sich etwa sechzig Prozent der Stadtbewohner regelmäßig durch Lärm gestört, und der Straßenverkehr ist dabei mit Abstand die wichtigste Quelle. Fluglärm folgt erst mit deutlichem Abstand. Und was macht Lärm mit dem Körper? Entscheidend ist, dass der Körper auch im Schlaf reagiert. Der Blutdruck steigt, Stresshormone werden ausgeschüttet — und das geschieht, ohne dass die Betroffenen aufwachen. Wer über Jahre an einer lauten Straße schläft, hat ein messbar höheres Risiko für Herz-Kreislauf-Erkrankungen. Was hilft denn konkret? Am wirksamsten ist es, den Lärm dort zu verringern, wo er entsteht. Leisere Straßenbeläge und Tempo 30 in der Nacht bringen erfahrungsgemäß mehr als jedes Schallschutzfenster, denn ein Fenster hilft nur, solange es geschlossen ist. Und was raten Sie den Betroffenen persönlich? Das Schlafzimmer wenn möglich zur ruhigen Seite des Hauses legen. Das ist banal, aber es wirkt. Vielen Dank für das Gespräch.",
    items: [
      { num: 1, statement: "Etwa 60 Prozent der Stadtbewohner fühlen sich regelmäßig durch Lärm gestört.", answer: true, rule: "Dr. Reuter gives exactly this figure." },
      { num: 2, statement: "Fluglärm ist die wichtigste Lärmquelle in der Stadt.", answer: false, rule: "Road traffic is by far the main source; air traffic follows well behind." },
      { num: 3, statement: "Der Körper reagiert auf Lärm auch dann, wenn man nicht aufwacht.", answer: true, rule: "Blood pressure rises and stress hormones are released during sleep." },
      { num: 4, statement: "Lärm in der Nacht erhöht das Risiko für Herz-Kreislauf-Erkrankungen.", answer: true, rule: "Years of sleeping on a loud street measurably raise that risk." },
      { num: 5, statement: "Schallschutzfenster sind die wirksamste Maßnahme gegen Lärm.", answer: false, rule: "Reducing noise at the source is more effective; a window only helps while closed." },
      { num: 6, statement: "Tempo 30 in der Nacht kann den Lärm verringern.", answer: true, rule: "She names quieter road surfaces and a 30 km/h night limit as effective." },
      { num: 7, statement: "Frau Reuter empfiehlt, das Schlafzimmer zur lauten Straßenseite zu legen.", answer: false, rule: "She advises the quiet side of the building." },
      { num: 8, statement: "Frau Reuter hält die Sorge um Lärm für übertrieben.", answer: false, rule: "Asked whether it is exaggerated she answers \"Nein, ganz und gar nicht\"." },
    ],
  },
};
