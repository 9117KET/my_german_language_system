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
