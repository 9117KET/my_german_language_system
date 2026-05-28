// app.js - German Language Learning Player
// Modes: listen (passive), shadow (listen + repeat), recall (active recall), ai (AI Chat)

const CATEGORIES = {
  all: "All Islands",
  morning_routine: "Morning Routine",
  job_search: "Job Search",
  german_class: "German Class",
  hirschsprach_cafe: "Hirschsprach Café",
  describe_surroundings: "Describe Surroundings",
  inner_thoughts: "Inner Thoughts",
  daily_life: "Daily Life",
  greetings: "Greetings & Small Talk",
  food_drink: "Food & Eating Out",
  shopping: "Shopping",
  health: "Health & Pharmacy",
  travel: "Travel & Directions",
  social: "Social Plans",
  hobbies: "Hobbies & Free Time",
  core_structures: "Core Structures",
  university_life: "Uni & Studium",
  phone_digital: "Handy & Digitales",
  bureaucracy: "Behörden & Bürokratie",
  satzbau: "Satzbau (Sentence Structure)",
};

// ---- Grammar Tags (phrase ID → grammar structure labels) ----
const GRAMMAR_TAGS = {
  1:["Perfekt"], 2:["Modal","Infinitiv"], 3:["Fragewort","Modal"],
  4:["Präsens","Dativ"], 5:["Perfekt"], 6:["Präsens","Adjektiv"],
  7:["Perfekt"], 8:["Perfekt"], 9:["Modal","Konjunktion"],
  10:["Präsens","Adjektiv"], 11:["Präsens"], 12:["Perfekt"],
  13:["Präsens"], 14:["Präteritum"], 15:["Präsens","Nebensatz-dass"],
  16:["Präsens","Adjektiv"], 17:["Perfekt"], 18:["Präsens"],
  19:["Präsens","Adjektiv"], 20:["Präsens","Nebensatz-dass"],
  21:["Modal","Imperativ"], 22:["Perfekt","Negation"],
  23:["Fragewort"], 24:["Fragewort"], 25:["Modal","Komparativ"],
  26:["Präsens","seit"], 27:["Präsens"], 28:["Modal"],
  29:["Präsens","Negation"], 30:["Modal","Infinitiv"],
  31:["Präsens"], 32:["Präsens","Dativ"], 33:["Präsens","Infinitivsatz"],
  34:["Perfekt"], 35:["Fragewort","Meinungsausdruck"],
  36:["Präsens","Meinungsausdruck"], 37:["Präsens"],
  38:["Konjunktiv-II","Infinitivsatz"], 39:["Präsens","Temporalsatz"],
  40:["Präsens","Adjektiv"],
  41:["Präsens","Akkusativ"], 42:["Präsens","Adjektiv"],
  43:["Präsens","Adjektiv"], 44:["Präsens"], 45:["Präsens","Adjektiv"],
  46:["Präsens"], 47:["Präsens","Adjektiv"], 48:["Präsens","Infinitiv"],
  49:["Präsens","Genitiv"], 50:["Präsens"],
  51:["Präsens","Nebensatz-dass"], 52:["Präsens","Nebensatz-ob"],
  53:["Modal","Infinitiv"], 54:["Präsens","Nebensatz-ob"],
  55:["Präsens"], 56:["Präsens"], 57:["Präsens","Reflexiv"],
  58:["Modal","Infinitiv"], 59:["Präsens","Relativsatz"], 60:["Präsens","Adjektiv"],
  61:["Präsens"], 62:["Präteritum"], 63:["Modal"],
  64:["Modal","Fragewort"], 65:["Präsens"], 66:["Perfekt"],
  67:["Präsens"], 68:["Präsens","Komparativ"], 69:["Perfekt"], 70:["Präsens","Adjektiv"],
  71:["Fragewort"], 72:["Präsens"], 73:["Infinitivsatz"],
  74:["Fragewort"], 75:["Präsens"], 76:["Fragewort","seit"],
  77:["Präsens","seit"], 78:["Fragewort"], 79:["Fragewort"], 80:["Imperativ"],
  81:["Fragewort","Modal"], 82:["Konjunktiv-II"], 83:["Präsens","Fragewort"],
  84:["Imperativ"], 85:["Präteritum","Adjektiv"], 86:["Konjunktiv-II"],
  87:["Fragewort"], 88:["Modal","Infinitiv"], 89:["Präsens","Negation"], 90:["Perfekt"],
  91:["Präsens","Akkusativ"], 92:["Fragewort","Modal"], 93:["Fragewort"],
  94:["Fragewort"], 95:["Fragewort","Komparativ"], 96:["Präsens"],
  97:["Modal","Nebensatz-wenn"], 98:["Fragewort"], 99:["Fragewort"], 100:["Präsens","Akkusativ"],
  101:["Präsens","Negation"], 102:["Präsens","seit"], 103:["Präsens","Nebensatz-dass"],
  104:["Fragewort","Modal"], 105:["Fragewort","Modal"], 106:["Präsens"],
  107:["Präsens","Dativ"], 108:["Präsens"], 109:["Präsens","Akkusativ"],
  110:["Modal","Fragewort"],
  111:["Fragewort","Komparativ"], 112:["Fragewort"], 113:["Akkusativ"],
  114:["Fragewort"], 115:["Präsens"], 116:["Perfekt","Fragewort"],
  117:["Imperativ","Separierbar"], 118:["Fragewort"], 119:["Fragewort"], 120:["Fragewort","Modal"],
  121:["Fragewort"], 122:["Modal","Infinitiv"], 123:["Präsens"],
  124:["Präsens","Negation"], 125:["Fragewort","Modal"], 126:["Fragewort","Modal"],
  127:["Präsens","Reflexiv"], 128:["Dativ"], 129:["Konjunktiv-II","Modal"],
  130:["Präteritum","Adjektiv"],
  131:["Fragewort","Komparativ"], 132:["Präsens","Dativ"], 133:["Präsens"],
  134:["Präsens","Häufigkeit"], 135:["Fragewort"], 136:["Präsens","Reflexiv"],
  137:["Komparativ","Infinitivsatz"], 138:["Präsens"], 139:["Infinitivsatz","um-zu"],
  140:["Präsens"],
  141:["Präteritum"], 142:["Präteritum","Nebensatz-dass"],
  143:["Präteritum"], 144:["Präteritum"], 145:["Präteritum","als-Satz"],
  146:["Relativsatz","Akkusativ"], 147:["Relativsatz","Nominativ"],
  148:["Relativsatz","mit-Dativ"], 149:["Relativsatz","Nominativ"],
  150:["Relativsatz","Modal"], 151:["Passiv","Präsens"],
  152:["Passiv","Perfekt"], 153:["Passiv","Perfekt"], 154:["Passiv","Modal"],
  155:["Konjunktiv-II","wenn-Satz"], 156:["Konjunktiv-II","würde"],
  157:["Konjunktiv-II","Ratschlag"], 158:["Konjunktiv-II","wäre"],
  159:["Nebensatz-weil"], 160:["Nebensatz-obwohl"],
  161:["Nebensatz-nachdem","Perfekt"], 162:["Nebensatz-damit"],
  163:["Futur-I"], 164:["Futur-I"], 165:["Plusquamperfekt"],
  166:["Präsens","Akkusativ"], 167:["Präsens"],
  168:["Präsens","Negation","Modal"], 169:["Modal","Reflexiv","Infinitiv"],
  170:["Präteritum","Dativ"], 171:["Modal","Reflexiv","Separierbar"],
  172:["Plusquamperfekt","Komparativ"], 173:["Perfekt","Akkusativ"],
  174:["Modal","Fragewort"], 175:["Perfekt","Separierbar"],
  176:["Präsens","Separierbar"], 177:["Präsens","Konjunktion"],
  178:["Modal","Dativ"], 179:["Perfekt","Dativ"],
  180:["Präsens","Separierbar"], 181:["Modal","Separierbar","Infinitivsatz"],
  182:["Präsens","Fragewort"], 183:["Präsens","Separierbar"],
  184:["Perfekt","Separierbar","Akkusativ"], 185:["Modal","Dativ","Akkusativ"],
  186:["Präsens","Akkusativ"], 187:["Präsens","Separierbar"],
  188:["Modal","Fragewort","Reflexiv"], 189:["Präsens","Akkusativ"],
  190:["Modal","Fragewort","Separierbar"], 191:["Perfekt","Konjunktion","Negation"],
  192:["Präsens","Adjektiv"], 193:["Modal","Separierbar","Akkusativ"],
  194:["Präsens","Adjektiv"], 195:["Fragewort","Präsens","Akkusativ"],
  196:["SatzbauAussage"],
  197:["SatzbauAussage","Inversion"],
  198:["SatzbauAussage","Inversion"],
  199:["SatzbauAussage","Inversion","TeKaMoLo"],
  200:["SatzbauAussage","Inversion"],
  201:["SatzbauWFrage","Fragewort","Modal","Separierbar"],
  202:["SatzbauWFrage","Fragewort"],
  203:["SatzbauWFrage","Fragewort","Modal"],
  204:["SatzbauWFrage","Fragewort"],
  205:["SatzbauWFrage","Fragewort"],
  206:["SatzbauJaNein"],
  207:["SatzbauJaNein","Perfekt"],
  208:["SatzbauJaNein"],
  209:["SatzbauJaNein","Modal"],
  210:["SatzbauJaNein"],
  211:["NebensatzVerb","Nebensatz-weil","Modal"],
  212:["NebensatzVerb","Nebensatz-weil","Inversion","Reflexiv"],
  213:["NebensatzVerb","Nebensatz-wenn","Modal"],
  214:["NebensatzVerb","Nebensatz-damit"],
  215:["NebensatzVerb","Nebensatz-dass"],
  216:["NebensatzVerb","Fragewort","Modal"],
  217:["NebensatzVerb","Relativsatz","Perfekt"],
  218:["TeKaMoLo","SatzbauAussage"],
  219:["TeKaMoLo","SatzbauAussage"],
  220:["TeKaMoLo","SatzbauAussage"],
  221:["SatzbauAussage"],
  222:["SatzbauAussage"],
  223:["SatzbauAussage","Inversion"],
  224:["SatzbauWFrage","Fragewort"],
  225:["SatzbauWFrage","Fragewort"],
  226:["SatzbauWFrage","Fragewort"],
  227:["SatzbauJaNein"],
  228:["SatzbauJaNein"],
  229:["SatzbauJaNein"],
  230:["TeKaMoLo","SatzbauAussage"],
  231:["TeKaMoLo","SatzbauAussage"],
  232:["TeKaMoLo","SatzbauAussage","Inversion"],
  233:["NebensatzVerb","Nebensatz-weil"],
  234:["NebensatzVerb","Nebensatz-weil","Inversion"],
  235:["NebensatzVerb","Nebensatz-weil"],
  236:["NebensatzVerb","Nebensatz-weil","Inversion"],
  237:["NebensatzVerb","Nebensatz-wenn"],
  238:["NebensatzVerb","Nebensatz-wenn"],
  239:["NebensatzVerb","Nebensatz-wenn"],
  240:["NebensatzVerb","Nebensatz-seitdem"],
  241:["NebensatzVerb","Nebensatz-während"],
  242:["NebensatzVerb","Nebensatz-bis","Separierbar"],
  243:["NebensatzVerb","Nebensatz-damit","Modal"],
  244:["NebensatzVerb","Nebensatz-damit"],
  245:["NebensatzVerb","Nebensatz-dass"],
  246:["SatzbauJaNein","NebensatzVerb","Nebensatz-dass"],
  247:["NebensatzVerb","Fragewort","Modal"],
  248:["NebensatzVerb","Fragewort","Modal"],
  249:["NebensatzVerb","Relativsatz","Separierbar"],
  250:["NebensatzVerb","Relativsatz","Perfekt"],
  251:["NebensatzVerb","Nebensatz-wenn","Separierbar","Inversion"],
  252:["DativAkkusativ","Dativ","Akkusativ"],
  253:["DativAkkusativ","Dativ","Akkusativ"],
  254:["DativAkkusativ","Dativ","Akkusativ"],
  255:["DativAkkusativ","Dativ","Akkusativ"],
  256:["DativAkkusativ","Dativ","Akkusativ"],
  257:["DativAkkusativ","Pronomen","Dativ","Akkusativ"],
  258:["DativAkkusativ","Pronomen","Dativ","Akkusativ"],
  259:["DativAkkusativ","Pronomen","Dativ","Akkusativ"],
  260:["DativAkkusativ","Pronomen","Dativ","Akkusativ"],
  261:["DativAkkusativ","Pronomen","Dativ","Akkusativ"],
  262:["DativAkkusativ","Pronomen","Dativ","Akkusativ"],
  263:["SatzbauAussage","Inversion","AltVorNeu"],
  264:["SatzbauAussage","Inversion","Perfekt","AltVorNeu"],
  265:["TeKaMoLo","SatzbauAussage"],
  266:["AltVorNeu","DativAkkusativ","Dativ","Akkusativ"],
  267:["AltVorNeu","TeKaMoLo","SatzbauAussage"],
  268:["AltVorNeu","TeKaMoLo","SatzbauAussage"],
  269:["TeKaMoLo","SatzbauAussage","DativAkkusativ","Akkusativ"],
  270:["TeKaMoLo","SatzbauAussage","DativAkkusativ","Dativ","Akkusativ"],
  271:["TeKaMoLo","SatzbauAussage","Perfekt","DativAkkusativ","Dativ","Akkusativ"],
  272:["TeKaMoLo","SatzbauAussage"],
  273:["TeKaMoLo","SatzbauAussage","Modal"],
  274:["DativAkkusativ","Dativ","Akkusativ","TeKaMoLo","SatzbauAussage"],
  275:["DativAkkusativ","Pronomen","Dativ","Akkusativ"],
  276:["DativAkkusativ","Perfekt","TeKaMoLo","Dativ","Akkusativ"],
  277:["DativAkkusativ","Pronomen","Dativ","Akkusativ","TeKaMoLo"],
  278:["NebensatzVerb","Nebensatz-seitdem","DativAkkusativ","Dativ","Akkusativ"],
  279:["PräpAkk","KasusAkkusativ"], 280:["PräpAkk","KasusAkkusativ"],
  281:["PräpAkk","KasusAkkusativ"], 282:["PräpAkk","KasusAkkusativ"],
  283:["PräpAkk","KasusAkkusativ"], 284:["PräpAkk","KasusAkkusativ"],
  285:["PräpAkk","KasusAkkusativ"],
  286:["PräpDat","KasusDativ"], 287:["PräpDat","KasusDativ"],
  288:["PräpDat","KasusDativ"], 289:["PräpDat","KasusDativ"],
  290:["PräpDat","KasusDativ"], 291:["PräpDat","KasusDativ"],
  292:["PräpDat","KasusDativ"], 293:["PräpDat","KasusDativ"],
  294:["PräpDat","KasusDativ"],
  295:["Wechselpräp","KasusDativ"], 296:["Wechselpräp","KasusAkkusativ"],
  297:["Wechselpräp","KasusDativ"], 298:["Wechselpräp","KasusAkkusativ"],
  299:["Wechselpräp","KasusDativ"], 300:["Wechselpräp","KasusAkkusativ"],
  301:["Wechselpräp","KasusDativ"], 302:["Wechselpräp","KasusAkkusativ"],
  303:["Wechselpräp","KasusDativ"],
  304:["VerbAkk","KasusAkkusativ"], 305:["VerbAkk","KasusAkkusativ"],
  306:["VerbAkk","KasusAkkusativ"], 307:["VerbAkk","KasusAkkusativ"],
  308:["VerbAkk","KasusAkkusativ"],
  309:["VerbDat","KasusDativ"], 310:["VerbDat","KasusDativ"],
  311:["VerbDat","KasusDativ"], 312:["VerbDat","KasusDativ"],
  313:["VerbDat","KasusDativ"],
  314:["VerbDatAkk","KasusDativ","KasusAkkusativ"], 315:["VerbDatAkk","KasusDativ","KasusAkkusativ"],
  316:["VerbDatAkk","KasusDativ","KasusAkkusativ"], 317:["VerbDatAkk","KasusDativ","KasusAkkusativ"],
  318:["VerbDatAkk","KasusDativ","KasusAkkusativ"],
  319:["FestAusdrücke","PräpAkk","KasusAkkusativ"],
  320:["FestAusdrücke","PräpAkk","KasusAkkusativ"],
  321:["FestAusdrücke","PräpDat","KasusDativ"],
  322:["FestAusdrücke","PräpAkk","KasusAkkusativ"],
  323:["FestAusdrücke","PräpDat","KasusDativ"],
  324:["Genitiv"], 325:["Genitiv"], 326:["Genitiv"],
  327:["Genitiv"], 328:["Genitiv"],
  329:["GenitPräp","Genitiv"], 330:["GenitPräp","Genitiv"],
  331:["GenitPräp","Genitiv"], 332:["GenitPräp","Genitiv"],
  333:["GenitPräp","Genitiv"], 334:["GenitPräp","Genitiv"],
  335:["GenitPräp","Genitiv"], 336:["GenitPräp","Genitiv"],
  337:["GenitPräp","Genitiv"],
  338:["AdjektivEndungen"], 339:["AdjektivEndungen"], 340:["AdjektivEndungen"],
  341:["AdjektivEndungen"], 342:["AdjektivEndungen"], 343:["AdjektivEndungen"],
  344:["AdjektivEndungen","AdjektivStark"], 345:["AdjektivEndungen","AdjektivStark"],
  346:["AdjektivEndungen"], 347:["AdjektivEndungen"],
  348:["AdjektivEndungen","AdjektivStark"], 349:["AdjektivEndungen","AdjektivStark"],
};

// ---- Auto Grammar Tag Detection ----
// Scans any German text and returns additional grammar tags based on preposition/case patterns.
const CASE_TAG_PRIORITY = ['KasusAkkusativ','KasusDativ','PräpAkk','PräpDat','Wechselpräp','GenitPräp','Genitiv','VerbAkk','VerbDat','VerbDatAkk','FestAusdrücke','AdjektivEndungen','AdjektivStark'];

function getAutoTags(german) {
  const tags = new Set();
  const t = german;
  // Shorthand: matches any article/possessive in accusative or dative form
  const AKK_ART = /d(?:en|ie|as)|ein(?:en|e)?|(?:m|d|s|ihr|unser|euer|kein)\w+/i;
  const DAT_ART = /d(?:em|er)|ein(?:em|er)|(?:m|d|s|ihr|unser|euer|kein)\w+|mir|dir|ihm|ihr|uns|euch|ihnen|Ihnen/i;
  const GEN_ART = /d(?:es|er)|ein(?:es|er)|(?:m|d|s|ihr|unser|euer|kein)\w+/i;

  // Accusative-only prepositions + any accusative/possessive form
  const akkPrepRx = new RegExp(`\\b(durch|für|gegen|ohne|um)\\s+(${AKK_ART.source})\\b`, 'i');
  if (akkPrepRx.test(t) || /\b(für|ohne)\s+(mich|dich|ihn|uns|euch|Sie)\b/i.test(t)) {
    tags.add('PräpAkk');
  }

  // Dative-only prepositions + any dative/pronoun form
  const datPrepRx = new RegExp(`\\b(mit|aus|bei|nach|seit|von|zu|außer|gegenüber)\\s+(${DAT_ART.source})\\b`, 'i');
  if (datPrepRx.test(t) || /\b(zum|zur)\b/i.test(t)) {
    tags.add('PräpDat');
  }

  // Genitive prepositions + any genitive article/possessive form
  const genitPrepRx = new RegExp(`\\b(wegen|trotz|während|außerhalb|innerhalb|aufgrund|statt|anstatt|laut|oberhalb|unterhalb|ungeachtet|diesseits|jenseits|bezüglich|hinsichtlich|infolge)\\s+(${GEN_ART.source})\\b`, 'i');
  if (genitPrepRx.test(t)) {
    tags.add('GenitPräp');
    tags.add('Genitiv');
  }

  // Genitive possession: des + noun with -s/-es ending
  if (/\bdes\s+\w+(?:es|s)\b/i.test(t)) tags.add('Genitiv');

  // Wechselpräpositionen + any article (either case)
  const wechselRx = new RegExp(`\\b(an|auf|in|hinter|neben|über|unter|vor|zwischen)\\s+(d(?:em|er|en|as|ie)|ein\\w*|(?:m|d|s|ihr|unser|euer|kein)\\w+)\\b`, 'i');
  if (wechselRx.test(t) || /\b(im|am|ins|ans|aufs)\b/i.test(t)) {
    tags.add('Wechselpräp');
  }

  return [...tags];
}

// Returns the full enriched tag list for a phrase, combining static GRAMMAR_TAGS with auto-detected ones.
// Priority tags (case/preposition) surface first so the most educational chips appear in the card.
function getTagsForCard(phraseId, german) {
  const staticTags = [].concat(GRAMMAR_TAGS[phraseId] || []);
  const tagSet = new Set(staticTags);

  // Map legacy generic tags to new specific case topics
  if (tagSet.has('Akkusativ')) tagSet.add('KasusAkkusativ');
  if (tagSet.has('Dativ'))     tagSet.add('KasusDativ');

  // Auto-detect additional tags from phrase text
  getAutoTags(german).forEach(t => tagSet.add(t));

  // Build result with priority tags first, then everything else
  const result = [];
  CASE_TAG_PRIORITY.forEach(t => { if (tagSet.has(t)) result.push(t); });
  [...tagSet].forEach(t => { if (!CASE_TAG_PRIORITY.includes(t)) result.push(t); });
  return result;
}

// ---- Conversation Scenarios ----
const SCENARIOS = {
  hirschsprach_cafe: {
    title: "Language Café Chat",
    goal: "Have a natural conversation about your week, interests, or language learning",
    starter: "Hallo! Schön, dass du wieder da bist. Wie war deine Woche so?",
  },
  shopping: {
    title: "Shopping for Clothes",
    goal: "Find and buy a suitable item of clothing",
    starter: "Guten Tag! Kann ich Ihnen helfen? Suchen Sie etwas Bestimmtes?",
  },
  health: {
    title: "Doctor's Appointment",
    goal: "Describe your symptoms and get advice",
    starter: "Guten Morgen! Nehmen Sie bitte Platz. Was führt Sie heute zu mir?",
  },
  travel: {
    title: "At the Train Station",
    goal: "Buy a train ticket and find out the platform and departure time",
    starter: "Guten Tag! Was kann ich für Sie tun?",
  },
  greetings: {
    title: "Meeting Someone New",
    goal: "Introduce yourself and get to know each other",
    starter: "Oh, hallo! Du bist neu hier, oder? Ich bin Markus — und du?",
  },
  food_drink: {
    title: "At the Restaurant",
    goal: "Order food and drinks and ask about the menu",
    starter: "Guten Abend! Herzlich willkommen. Haben Sie schon gewählt, oder brauchen Sie noch einen Moment?",
  },
  job_search: {
    title: "Job Interview",
    goal: "Answer interview questions and ask about the position",
    starter: "Guten Tag! Schön, Sie kennenzulernen. Erzählen Sie mir bitte kurz etwas über sich.",
  },
  social: {
    title: "Planning a Weekend",
    goal: "Agree on what to do and when to meet",
    starter: "Hey! Hast du am Wochenende schon was vor? Ich hätte da eine Idee!",
  },
  university_life: {
    title: "Study Session",
    goal: "Discuss coursework, exams, or university life with a classmate",
    starter: "Hey, hast du schon für die Klausur nächste Woche gelernt? Ich weiß gar nicht wo ich anfangen soll!",
  },
  phone_digital: {
    title: "Phone & Tech Chat",
    goal: "Handle a real-life phone situation or sort out a tech problem in German",
    starter: "Hallo? Kannst du mich hören? Ich habe hier gerade kaum Netz. Was wolltest du mir sagen?",
  },
  bureaucracy: {
    title: "Government Office",
    goal: "Navigate a visit to a German authority and ask about your paperwork",
    starter: "Guten Tag, nehmen Sie bitte Platz. Womit kann ich Ihnen heute helfen?",
  },
};

// ---- Grammar Topics (for Grammar tab) ----
const GRAMMAR_TOPICS = [
  { id:"Perfekt", title:"Perfekt (Present Perfect)",
    rule:"haben/sein + Partizip II. Used for past events in spoken German.",
    ids:[1,5,8,12,17,34,66,69,90,173,175,179,184,191] },
  { id:"Präteritum", title:"Präteritum (Simple Past)",
    rule:"Common in writing and narratives. Key forms: war, hatte, ging, kam, sprach, sah, stand.",
    ids:[14,62,85,130,141,142,143,144,145,170] },
  { id:"Modal", title:"Modal Verbs (können, müssen, wollen...)",
    rule:"Modal verb in position 2, infinitive goes to the end. Konjunktiv II: könnte, müsste, etc.",
    ids:[2,9,21,25,28,63,64,104,150,168,169,171,174,178,181,185,188,190,193] },
  { id:"Relativsatz", title:"Relative Clauses (Relativsätze)",
    rule:"der/die/das matches the noun's gender. Verb goes to the end of the relative clause.",
    ids:[146,147,148,149,150] },
  { id:"Konjunktiv-II", title:"Konjunktiv II (Conditional)",
    rule:"würde + infinitive for hypotheticals. Polite requests. hätte/wäre for haben/sein.",
    ids:[38,82,86,129,155,156,157,158] },
  { id:"Passiv", title:"Passive Voice (Passiv)",
    rule:"werden + Partizip II. The focus shifts to the action, not the person doing it.",
    ids:[151,152,153,154] },
  { id:"Nebensatz", title:"Subordinate Clauses (weil, obwohl, nachdem, damit, dass, wenn)",
    rule:"The conjunction sends the verb to the very end of the clause. Main clause can come first or second.",
    ids:[15,20,37,39,52,54,97,159,160,161,162] },
  { id:"Futur-I", title:"Future Tense (Futur I)",
    rule:"werden + infinitive. Present tense + time expression also works (very common in spoken German).",
    ids:[163,164] },
  { id:"Plusquamperfekt", title:"Past Perfect (Plusquamperfekt)",
    rule:"hatte/war + Partizip II. Used for events that happened before another past event.",
    ids:[165,172] },
  { id:"Fragewort", title:"Question Words (Fragewörter)",
    rule:"Wer/Was/Wo/Woher/Wann/Wie/Warum — verb comes directly after the question word.",
    ids:[3,23,24,64,74,78,79,81,94,111,119,125,126,131,135,174,182,188,190,195] },
  { id:"Separierbar", title:"Separable Verbs (Trennbare Verben)",
    rule:"The prefix splits off to the end of the main clause. Common prefixes: ab-, an-, auf-, aus-, ein-, mit-, nach-, vor-, zurück-, aus-. In subordinate clauses the verb stays together.",
    ids:[117,171,175,176,180,181,183,184,187,190,193] },
  { id:"Reflexiv", title:"Reflexive Verbs (Reflexivverben)",
    rule:"Use a reflexive pronoun (mich/dich/sich/uns/euch) that refers back to the subject. Common verbs: sich anmelden, sich aufteilen, sich beeilen, sich fühlen, sich vorstellen.",
    ids:[57,127,136,169,171,188] },
  { id:"SatzbauAussage", title:"Satzbau: Aussagen — Verb always at Position 2",
    rule:"In statements the verb is ALWAYS at position 2. Any element (time, location, manner) can move to position 1, which pushes the subject to position 3. This is called Inversion — the verb never moves!",
    ids:[196,222,223,197,198,199,200,221,230,231,232,263,264,265],
    breakdown:[
      { phraseId:196, parts:[
        {text:"Ich",label:"Subj.",pos:"subj"},{text:"habe",label:"Verb",pos:"verb"},
        {text:"letzten Dezember",label:"Temporal",pos:"temp"},{text:"meinen Bachelor",label:"Erg.",pos:"erg"},
        {text:"abgeschlossen",label:"Partizip",pos:"erg"}
      ]},
      { phraseId:222, parts:[
        {text:"Wir",label:"Subj.",pos:"subj"},{text:"sprechen",label:"Verb",pos:"verb"},
        {text:"heute",label:"Temporal",pos:"temp"},{text:"Deutsch",label:"Erg.",pos:"erg"}
      ]},
      { phraseId:223, parts:[
        {text:"Heute",label:"Temporal",pos:"temp"},{text:"sprechen",label:"Verb",pos:"verb"},
        {text:"wir",label:"Subj.",pos:"subj"},{text:"Deutsch",label:"Erg.",pos:"erg"}
      ]},
      { phraseId:197, parts:[
        {text:"Jetzt",label:"Temporal",pos:"temp"},{text:"bewerbe",label:"Verb",pos:"verb"},
        {text:"ich",label:"Subj.",pos:"subj"},{text:"mich",label:"Erg.",pos:"erg"},
        {text:"auf Masterstudienplätze",label:"Erg.",pos:"erg"},{text:"in Deutschland",label:"Lokal",pos:"local"}
      ]},
      { phraseId:198, parts:[
        {text:"Jeden Morgen",label:"Temporal",pos:"temp"},{text:"lerne",label:"Verb",pos:"verb"},
        {text:"ich",label:"Subj.",pos:"subj"},{text:"zwei Stunden Deutsch",label:"Erg.",pos:"erg"},
        {text:"für meinen B1-Kurs",label:"Erg.",pos:"erg"}
      ]},
      { phraseId:199, parts:[
        {text:"Mit dem Fahrrad",label:"Modal",pos:"manner"},{text:"fahre",label:"Verb",pos:"verb"},
        {text:"ich",label:"Subj.",pos:"subj"},{text:"meistens",label:"Temporal",pos:"temp"},
        {text:"zum Sprachcafé",label:"Lokal",pos:"local"}
      ]}
    ]},
  { id:"SatzbauWFrage", title:"Satzbau: W-Fragen — Question Word at Position 1",
    rule:"W-questions: question word (Fragewort) at position 1, verb at position 2, subject at position 3. The verb stays at position 2 — same rule as statements!",
    ids:[201,202,203,204,205,224,225,226],
    breakdown:[
      { phraseId:201, parts:[
        {text:"Wie",label:"Fragewort",pos:"frage"},{text:"bereite",label:"Verb",pos:"verb"},
        {text:"ich",label:"Subj.",pos:"subj"},{text:"mich",label:"Erg.",pos:"erg"},
        {text:"am besten",label:"Modal",pos:"manner"},{text:"auf ein Vorstellungsgespräch",label:"Erg.",pos:"erg"},
        {text:"vor",label:"Präfix",pos:"erg"}
      ]},
      { phraseId:202, parts:[
        {text:"Wann",label:"Fragewort",pos:"frage"},{text:"beginnt",label:"Verb",pos:"verb"},
        {text:"mein Online-Kurs",label:"Subj.",pos:"subj"},{text:"bei IQ Lingua",label:"Lokal",pos:"local"}
      ]},
      { phraseId:203, parts:[
        {text:"Wo",label:"Fragewort",pos:"frage"},{text:"kann",label:"Verb",pos:"verb"},
        {text:"ich",label:"Subj.",pos:"subj"},{text:"in Bremen",label:"Lokal",pos:"local"},
        {text:"gut Bachata tanzen gehen",label:"Erg.",pos:"erg"}
      ]},
      { phraseId:205, parts:[
        {text:"Warum",label:"Fragewort",pos:"frage"},{text:"lernst",label:"Verb",pos:"verb"},
        {text:"du",label:"Subj.",pos:"subj"},{text:"so intensiv",label:"Modal",pos:"manner"},
        {text:"Deutsch",label:"Erg.",pos:"erg"}
      ]}
    ]},
  { id:"SatzbauJaNein", title:"Satzbau: Ja/Nein-Fragen — Verb at Position 1",
    rule:"Yes/no questions: the verb jumps to position 1, the subject moves to position 2. There is no question word — the inverted structure itself signals a question!",
    ids:[206,207,208,209,210,227,228,229,246],
    breakdown:[
      { phraseId:206, parts:[
        {text:"Gehst",label:"Verb",pos:"verb"},{text:"du",label:"Subj.",pos:"subj"},
        {text:"heute Abend",label:"Temporal",pos:"temp"},{text:"ins Sprachcafé",label:"Lokal",pos:"local"}
      ]},
      { phraseId:207, parts:[
        {text:"Hast",label:"Verb",pos:"verb"},{text:"du",label:"Subj.",pos:"subj"},
        {text:"schon",label:"Temporal",pos:"temp"},{text:"Bewerbungen",label:"Erg.",pos:"erg"},
        {text:"abgeschickt",label:"Partizip",pos:"erg"}
      ]},
      { phraseId:209, parts:[
        {text:"Kannst",label:"Verb",pos:"verb"},{text:"du",label:"Subj.",pos:"subj"},
        {text:"mir",label:"Erg.",pos:"erg"},{text:"beim Lebenslauf",label:"Erg.",pos:"erg"},
        {text:"helfen",label:"Infinitiv",pos:"erg"}
      ]},
      { phraseId:210, parts:[
        {text:"Fährst",label:"Verb",pos:"verb"},{text:"du",label:"Subj.",pos:"subj"},
        {text:"heute",label:"Temporal",pos:"temp"},{text:"mit dem Fahrrad",label:"Modal",pos:"manner"}
      ]}
    ]},
  { id:"TeKaMoLo", title:"TeKaMoLo — Time, Manner, Location Order",
    rule:"When stacking adverbs after the verb, use TeKaMoLo order: Temporal (wann?) → Kausal (warum?) → Modal (wie?) → Lokal (wo/wohin?). Memory aid: Te-Ka-Mo-Lo!",
    ids:[230,231,269,218,219,220,199,1,232,265,270,271,272,273],
    breakdown:[
      { phraseId:230, parts:[
        {text:"Hans",label:"Subj.",pos:"subj"},{text:"fährt",label:"Verb",pos:"verb"},
        {text:"morgen",label:"Te (wann?)",pos:"temp"},{text:"mit dem Bus",label:"Mo (wie?)",pos:"manner"},
        {text:"in die Schule",label:"Lo (wohin?)",pos:"local"}
      ]},
      { phraseId:231, parts:[
        {text:"Lisa",label:"Subj.",pos:"subj"},{text:"geht",label:"Verb",pos:"verb"},
        {text:"am Dienstag",label:"Te (wann?)",pos:"temp"},{text:"zu Fuß",label:"Mo (wie?)",pos:"manner"},
        {text:"ins Kino",label:"Lo (wohin?)",pos:"local"}
      ]},
      { phraseId:269, parts:[
        {text:"Ich",label:"Subj.",pos:"subj"},{text:"fahre",label:"Verb",pos:"verb"},
        {text:"morgen",label:"Te (wann?)",pos:"temp"},{text:"meine Frau",label:"Obj. (Akk)",pos:"akk"},
        {text:"wegen des Regens",label:"Ka (warum?)",pos:"erg"},{text:"mit dem Auto",label:"Mo (wie?)",pos:"manner"},
        {text:"ins Büro",label:"Lo (wohin?)",pos:"local"}
      ]},
      { phraseId:218, parts:[
        {text:"Ich",label:"Subj.",pos:"subj"},{text:"fahre",label:"Verb",pos:"verb"},
        {text:"jeden Morgen",label:"Te (wann?)",pos:"temp"},{text:"mit dem Fahrrad",label:"Mo (wie?)",pos:"manner"},
        {text:"zum Sprachcafé",label:"Lo (wohin?)",pos:"local"}
      ]},
      { phraseId:219, parts:[
        {text:"Wir",label:"Subj.",pos:"subj"},{text:"spielen",label:"Verb",pos:"verb"},
        {text:"am Freitag",label:"Te (wann?)",pos:"temp"},{text:"zusammen",label:"Mo (wie?)",pos:"manner"},
        {text:"Tischtennis",label:"Erg.",pos:"erg"},{text:"im Park",label:"Lo (wo?)",pos:"local"}
      ]},
      { phraseId:199, parts:[
        {text:"Mit dem Fahrrad",label:"Mo (wie?)",pos:"manner"},{text:"fahre",label:"Verb",pos:"verb"},
        {text:"ich",label:"Subj.",pos:"subj"},{text:"meistens",label:"Te (wann?)",pos:"temp"},
        {text:"zum Sprachcafé",label:"Lo (wohin?)",pos:"local"}
      ]}
    ]},
  { id:"NebensatzVerb", title:"Nebensatz — Verb always at the End (7 Types)",
    rule:"In ALL subordinate clauses the conjugated verb goes to the VERY END. Types: weil/da (causal), wenn/falls (conditional), seitdem/während/bis (temporal), damit (final), dass, indirect questions (wo/was/wann), relative clauses (der/die/das).",
    ids:[233,234,211,212,213,214,215,216,217,159,162,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251],
    breakdown:[
      { phraseId:233, parts:[
        {text:"Ich esse ein Sandwich",label:"Hauptsatz",pos:"erg"},{text:",",label:"",pos:"erg"},
        {text:"weil",label:"Konj.",pos:"conj"},{text:"ich",label:"Subj.",pos:"subj"},
        {text:"Hunger",label:"Erg.",pos:"erg"},{text:"habe",label:"Verb (Ende!)",pos:"verb"}
      ]},
      { phraseId:234, parts:[
        {text:"Weil",label:"Konj.",pos:"conj"},{text:"ich",label:"Subj.",pos:"subj"},
        {text:"Hunger",label:"Erg.",pos:"erg"},{text:"habe",label:"Verb (Ende!)",pos:"verb"},
        {text:",",label:"",pos:"erg"},{text:"esse",label:"Verb",pos:"verb"},
        {text:"ich",label:"Subj.",pos:"subj"},{text:"ein Sandwich",label:"Erg.",pos:"erg"}
      ]},
      { phraseId:211, parts:[
        {text:"Ich lerne Deutsch intensiv",label:"Hauptsatz",pos:"erg"},{text:",",label:"",pos:"erg"},
        {text:"weil",label:"Konj.",pos:"conj"},{text:"ich",label:"Subj.",pos:"subj"},
        {text:"in Deutschland",label:"Lokal",pos:"local"},{text:"bleiben möchte",label:"Verb (Ende!)",pos:"verb"}
      ]},
      { phraseId:212, parts:[
        {text:"Weil",label:"Konj.",pos:"conj"},{text:"ich",label:"Subj.",pos:"subj"},
        {text:"einen B1-Kurs bei IQ Lingua",label:"Erg.",pos:"erg"},{text:"mache",label:"Verb (Ende!)",pos:"verb"},
        {text:",",label:"",pos:"erg"},{text:"verbessert sich mein Deutsch schnell",label:"Hauptsatz",pos:"erg"}
      ]},
      { phraseId:215, parts:[
        {text:"Ich glaube",label:"Hauptsatz",pos:"erg"},{text:",",label:"",pos:"erg"},
        {text:"dass",label:"Konj.",pos:"conj"},{text:"das wöchentliche Sprachcafé",label:"Subj.",pos:"subj"},
        {text:"sehr hilfreich",label:"Erg.",pos:"erg"},{text:"ist",label:"Verb (Ende!)",pos:"verb"}
      ]},
      { phraseId:213, parts:[
        {text:"Wenn",label:"Konj.",pos:"conj"},{text:"ich",label:"Subj.",pos:"subj"},
        {text:"die B1-Prüfung",label:"Erg.",pos:"erg"},{text:"bestehe",label:"Verb (Ende!)",pos:"verb"},
        {text:",",label:"",pos:"erg"},{text:"kann ich mich für mehr Masterprogramme bewerben",label:"Hauptsatz",pos:"erg"}
      ]}
    ]},
  { id:"DativAkkusativ", title:"Dativ & Akkusativ — Two Noun Objects (Dat. before Akk.)",
    rule:"Rule 1: When a verb has TWO noun objects, the Dativ (wem?) comes BEFORE the Akkusativ (was?/wen?). Exception: if the Akkusativ noun has a definite article, it can come before an indefinite Dativ.",
    ids:[252,253,254,255,256,274,276],
    breakdown:[
      { phraseId:252, parts:[
        {text:"Die Mutter",label:"Subj.",pos:"subj"},{text:"schenkt",label:"Verb",pos:"verb"},
        {text:"dem Kind",label:"Dativ (wem?)",pos:"dativ"},{text:"einen Teddybär",label:"Akkusativ (was?)",pos:"akk"}
      ]},
      { phraseId:253, parts:[
        {text:"Die Eltern",label:"Subj.",pos:"subj"},{text:"schicken",label:"Verb",pos:"verb"},
        {text:"der Lehrerin",label:"Dativ (wem?)",pos:"dativ"},{text:"eine E-Mail",label:"Akkusativ (was?)",pos:"akk"}
      ]},
      { phraseId:254, parts:[
        {text:"Hans",label:"Subj.",pos:"subj"},{text:"gibt",label:"Verb",pos:"verb"},
        {text:"der Schwester",label:"Dativ (wem?)",pos:"dativ"},{text:"ein Auto",label:"Akkusativ (was?)",pos:"akk"}
      ]},
      { phraseId:255, parts:[
        {text:"Die Mutter",label:"Subj.",pos:"subj"},{text:"schenkt",label:"Verb",pos:"verb"},
        {text:"den Teddy",label:"Akk. (best. - Ausnahme!)",pos:"akk"},{text:"einem Kind",label:"Dat. (unbest.)",pos:"dativ"}
      ]}
    ]},
  { id:"PronomStellung", title:"Pronomen vor Nomen — Pronoun before Noun, Akk. before Dat.",
    rule:"Rule 2: When one object is a PRONOUN, the pronoun always comes before the noun (regardless of case). Rule 3: When BOTH objects are pronouns, the Akkusativ pronoun comes BEFORE the Dativ pronoun.",
    ids:[257,258,259,260,261,262,275,277],
    breakdown:[
      { phraseId:257, parts:[
        {text:"Die Mutter",label:"Subj.",pos:"subj"},{text:"schenkt",label:"Verb",pos:"verb"},
        {text:"ihm",label:"Pron. Dat (1.)",pos:"dativ"},{text:"den Teddybär",label:"Nomen Akk (2.)",pos:"akk"}
      ]},
      { phraseId:258, parts:[
        {text:"Die Eltern",label:"Subj.",pos:"subj"},{text:"schicken",label:"Verb",pos:"verb"},
        {text:"ihr",label:"Pron. Dat (1.)",pos:"dativ"},{text:"eine E-Mail",label:"Nomen Akk (2.)",pos:"akk"}
      ]},
      { phraseId:260, parts:[
        {text:"Die Mutter",label:"Subj.",pos:"subj"},{text:"schenkt",label:"Verb",pos:"verb"},
        {text:"ihn",label:"Pron. Akk (1.!)",pos:"akk"},{text:"ihr",label:"Pron. Dat (2.)",pos:"dativ"}
      ]},
      { phraseId:262, parts:[
        {text:"Hans",label:"Subj.",pos:"subj"},{text:"gibt",label:"Verb",pos:"verb"},
        {text:"es",label:"Pron. Akk (1.!)",pos:"akk"},{text:"ihr",label:"Pron. Dat (2.)",pos:"dativ"}
      ]}
    ]},
  { id:"AltVorNeu", title:"Alt vor Neu — Old Information before New",
    rule:"Known/old information (pronouns, definite articles) comes BEFORE new/unknown information (indefinite articles, no article). Important new information tends to land at the END of the sentence. This principle works together with TeKaMoLo.",
    ids:[267,268,266,263,264],
    breakdown:[
      { phraseId:267, parts:[
        {text:"Lisa",label:"Subj.",pos:"subj"},{text:"trinkt",label:"Verb",pos:"verb"},
        {text:"im Café",label:"Alt (bekannt)",pos:"local"},{text:"einen Tee",label:"Neu (unbekannt)",pos:"akk"}
      ]},
      { phraseId:268, parts:[
        {text:"Lisa",label:"Subj.",pos:"subj"},{text:"trinkt",label:"Verb",pos:"verb"},
        {text:"den Tee",label:"Alt (jetzt bekannt)",pos:"akk"},{text:"in einem Café",label:"Neu (unbekannt)",pos:"local"}
      ]},
      { phraseId:266, parts:[
        {text:"Du",label:"Subj.",pos:"subj"},{text:"schickst",label:"Verb",pos:"verb"},
        {text:"dem Kunden",label:"Alt (bekannt)",pos:"dativ"},{text:"eine E-Mail",label:"Neu (unbekannt)",pos:"akk"}
      ]},
      { phraseId:263, parts:[
        {text:"Morgen",label:"Temporal",pos:"temp"},{text:"kaufe",label:"Verb",pos:"verb"},
        {text:"ich",label:"Subj.",pos:"subj"},{text:"einen Computer",label:"Neu (unbekannt)",pos:"akk"}
      ]}
    ]},
  { id:"KasusAkkusativ", title:"Akkusativ — The Direct Object (wen? / was?)",
    rule:"The accusative marks the DIRECT object — the thing or person directly receiving the action. Ask: Wen? (who?) or Was? (what?). Only masculine changes: der → den, ein → einen. Feminine, neuter, and plural stay the same as nominative.",
    ids:[41,91,100,113,166,279,280],
    table:{
      headers:["Fall","Maskulin","Feminin","Neutral","Plural"],
      rows:[
        ["Nominativ","der / ein","die / eine","das / ein","die / -"],
        ["Akkusativ","den / einen","die / eine","das / ein","die / -"],
      ]
    }
  },
  { id:"KasusDativ", title:"Dativ — The Indirect Object (wem?)",
    rule:"The dative marks the INDIRECT object — the recipient or person affected. Ask: Wem? (to/for whom?). Key verbs that ALWAYS take dative: helfen, danken, gefallen, gehören, antworten, vertrauen, folgen, gratulieren, fehlen, passen, schaden, schmecken.",
    ids:[4,32,107,178,252,286,287],
    table:{
      headers:["Artikel","Maskulin","Feminin","Neutral","Plural"],
      rows:[
        ["bestimmt","dem","der","dem","den"],
        ["unbestimmt","einem","einer","einem","—"],
        ["Pronomen","ihm","ihr","ihm","ihnen"],
      ]
    }
  },
  { id:"PräpAkk", title:"Präpositionen mit Akkusativ (durch / für / gegen / ohne / um)",
    rule:"These 7 prepositions ALWAYS take accusative — no exceptions: durch (through), für (for), gegen (against/around), ohne (without), um (around/at), bis (until/to), entlang (along — comes AFTER the noun). Memory tip: durch-für-gegen-ohne-um are the 5 core ones.",
    ids:[279,280,281,282,283,284,285],
    table:{
      headers:["Präposition","Bedeutung","Beispiel"],
      rows:[
        ["durch","through","durch den Park"],
        ["für","for","für meinen Freund"],
        ["gegen","against / around","gegen den Wind"],
        ["ohne","without","ohne meinen Schlüssel"],
        ["um","around / at (time)","um den Tisch"],
        ["bis","until / up to","bis nächste Woche"],
        ["entlang","along (after noun)","den Fluss entlang"],
      ]
    }
  },
  { id:"PräpDat", title:"Präpositionen mit Dativ (aus / bei / mit / nach / seit / von / zu)",
    rule:"These prepositions ALWAYS take dative — no exceptions: aus (from/out of), bei (at/near), mit (with/by), nach (after/to — cities & home), seit (since/for), von (from/of), zu (to/at). Also: außer (except), gegenüber (opposite). Memory tip: aus-bei-mit-nach-seit-von-zu.",
    ids:[286,287,288,289,290,291,292,293,294],
    table:{
      headers:["Präposition","Bedeutung","Beispiel"],
      rows:[
        ["aus","from / out of","aus dem Haus"],
        ["bei","at / near","bei meiner Freundin"],
        ["mit","with / by","mit dem Bus"],
        ["nach","after / to (cities)","nach Berlin / nach Hause"],
        ["seit","since / for (duration)","seit einem Jahr"],
        ["von","from / of","von meinem Vater"],
        ["zu","to / at","zur Schule (zu + der)"],
        ["außer","except","außer mir"],
        ["gegenüber","opposite","gegenüber dem Bahnhof"],
      ]
    }
  },
  { id:"Wechselpräp", title:"Wechselpräpositionen — Wo? (Dativ) vs. Wohin? (Akkusativ)",
    rule:"9 prepositions switch case: an, auf, hinter, in, neben, über, unter, vor, zwischen. Wo? (location) → Dativ. Wohin? (direction/destination) → Akkusativ. Contrast: Ich bin IN DER Schule (Wo? Dat) vs. Ich gehe IN DIE Schule (Wohin? Akk).",
    ids:[295,296,297,298,299,300,301,302,303],
    table:{
      headers:["Präp.","Wo? (Dativ)","Wohin? (Akkusativ)"],
      rows:[
        ["an","an der Wand","an die Wand"],
        ["auf","auf dem Tisch","auf den Tisch"],
        ["hinter","hinter dem Haus","hinter das Haus"],
        ["in","in der Schule","in die Schule"],
        ["neben","neben dem Stuhl","neben den Stuhl"],
        ["über","über dem Bett","über das Bett"],
        ["unter","unter dem Tisch","unter den Tisch"],
        ["vor","vor dem Kino","vor das Kino"],
        ["zwischen","zwischen den Häusern","zwischen die Häuser"],
      ]
    }
  },
  { id:"VerbAkk", title:"Verben mit Akkusativ — Wen? / Was?",
    rule:"These verbs ALWAYS take an accusative object (wen? was?): kaufen, haben, sehen, brauchen, kennen, verstehen, lesen, hören, nehmen, essen, trinken, lieben, machen, suchen, finden, besuchen, öffnen, schließen, benutzen, lernen, fragen, bestellen, bezahlen, bringen, schreiben, studieren, treffen, vergessen, waschen. Ask yourself: Wen oder was? — the answer is Akkusativ.",
    ids:[41,91,100,166,304,305,306,307,308],
    table:{
      headers:["Verb","Beispiel (+ Akkusativ)"],
      rows:[
        ["kaufen","Ich kaufe einen Kaffee."],
        ["sehen","Ich sehe den Mann."],
        ["lesen","Er liest ein Buch."],
        ["brauchen","Wir brauchen Hilfe."],
        ["kennen","Ich kenne die Stadt."],
        ["verstehen","Ich verstehe das nicht."],
        ["besuchen","Wir besuchen die Oma."],
        ["hören","Sie hört die Musik."],
        ["nehmen","Ich nehme den Bus."],
        ["fragen","Ich frage den Lehrer."],
      ]
    }
  },
  { id:"VerbDat", title:"Verben mit Dativ — Wem?",
    rule:"These verbs ALWAYS take a dative object (wem?): helfen, danken, gefallen, gehören, antworten, vertrauen, folgen, gratulieren, fehlen, passen, schaden, schmecken, glauben, zuhören, zustimmen, widersprechen, begegnen, ähneln, imponieren, nützen. Ask yourself: Wem? — the answer is Dativ.",
    ids:[4,32,107,178,309,310,311,312,313],
    table:{
      headers:["Verb","Beispiel (+ Dativ)"],
      rows:[
        ["helfen","Ich helfe meiner Freundin."],
        ["danken","Er dankt dem Lehrer."],
        ["gefallen","Das Buch gefällt mir."],
        ["gehören","Das Auto gehört meinem Vater."],
        ["passen","Die Schuhe passen mir."],
        ["schmecken","Die Suppe schmeckt dem Kind."],
        ["schaden","Rauchen schadet der Gesundheit."],
        ["antworten","Er antwortet dem Lehrer."],
        ["glauben","Ich glaube dir."],
        ["zuhören","Wir hören dem Lehrer zu."],
      ]
    }
  },
  { id:"VerbDatAkk", title:"Verben mit Dativ + Akkusativ — Wem? Was?",
    rule:"These verbs take TWO objects: a Dativ (wem? — the person) AND an Akkusativ (was? — the thing): geben, schenken, zeigen, erklären, bringen, schicken, wünschen, empfehlen, verkaufen, versprechen, vorlesen, leihen, erzählen, senden. Word order: Dativ before Akkusativ (unless Akkusativ has a definite article — see DativAkkusativ topic).",
    ids:[252,253,254,314,315,316,317,318],
    table:{
      headers:["Verb","Dativ (wem?)","Akkusativ (was?)"],
      rows:[
        ["geben","dem Kind","ein Buch"],
        ["schenken","meiner Mutter","Blumen"],
        ["zeigen","dem Freund","den Weg"],
        ["erklären","den Schülern","die Regel"],
        ["schicken","meiner Familie","ein Paket"],
        ["bringen","der Lehrerin","einen Kaffee"],
        ["wünschen","dir","viel Glück"],
        ["empfehlen","dem Patienten","eine Therapie"],
      ]
    }
  },
  { id:"Genitiv", title:"Genitiv — Possession and Belonging (wessen?)",
    rule:"The genitive shows possession or belonging. Ask: Wessen? (whose?). Masculine and neuter nouns add -s or -es (des Mannes, des Kindes). Feminine and plural nouns add nothing (der Frau, der Kinder). Adjective endings in genitive are ALWAYS -en (des kleinen Hundes, einer schönen Frau). Tip: in everyday speech, von + Dativ is often used instead (das Auto von meinem Vater).",
    ids:[49,324,325,326,327,328],
    table:{
      headers:["","Maskulin","Feminin","Neutral","Plural"],
      rows:[
        ["bestimmt","des Mannes","der Frau","des Kindes","der Kinder"],
        ["unbestimmt","eines Mannes","einer Frau","eines Kindes","— (kein Plural)"],
        ["Nomenendung","-s / -es","keine","-s / -es","keine"],
        ["Adjektiv","-en (des kleinen)","-en (der schönen)","-en (des alten)","-en (der netten)"],
      ]
    }
  },
  { id:"GenitPräp", title:"Genitivpräpositionen — Prepositions with Genitive",
    rule:"These prepositions always take genitive. Common ones: wegen (because of), trotz (despite), während (during), außerhalb (outside), innerhalb (within), aufgrund (due to), statt/anstatt (instead of), laut (according to), oberhalb (above), unterhalb (below). Note: wegen + Dativ is increasingly accepted in spoken German.",
    ids:[329,330,331,332,333,334,335,336,337],
    table:{
      headers:["Präposition","Bedeutung","Beispiel"],
      rows:[
        ["wegen","because of","wegen des Regens"],
        ["trotz","despite","trotz der Probleme"],
        ["während","during","während des Unterrichts"],
        ["außerhalb","outside of","außerhalb der Stadt"],
        ["innerhalb","within / inside","innerhalb eines Monats"],
        ["aufgrund","due to / because of","aufgrund des Problems"],
        ["statt / anstatt","instead of","statt eines Autos"],
        ["laut","according to","laut des Berichts"],
        ["oberhalb","above","oberhalb des Dorfes"],
        ["unterhalb","below","unterhalb der Brücke"],
      ]
    }
  },
  { id:"AdjektivEndungen", title:"Adjektivendungen — After Definite & Indefinite Articles",
    rule:"After a definite article (der/die/das) adjectives take WEAK endings — mostly -en, with only -e in Nom. singular and Nom/Akk. neuter. After an indefinite article (ein/eine) adjectives take MIXED endings — same -e for Nom. Fem. & Nom/Akk. Neut., but strong -er/-es for Nom. Masc. (ein alter Mann, ein altes Haus). Key insight: the ending is weak (-en) wherever the article already shows the gender clearly.",
    ids:[338,339,340,341,342,343,346,347],
    table:{
      headers:["Fall","Maskulin","Feminin","Neutral","Plural"],
      rows:[
        ["Nom (def.)","der alte Mann","die alte Frau","das alte Haus","die alten Kinder"],
        ["Akk (def.)","den alten Mann","die alte Frau","das alte Haus","die alten Kinder"],
        ["Dat (def.)","dem alten Mann","der alten Frau","dem alten Haus","den alten Kindern"],
        ["Nom (indef.)","ein alter Mann","eine alte Frau","ein altes Haus","— alte Kinder"],
        ["Akk (indef.)","einen alten Mann","eine alte Frau","ein altes Haus","— alte Kinder"],
        ["Dat (indef.)","einem alten Mann","einer alten Frau","einem alten Haus","— alten Kindern"],
      ]
    }
  },
  { id:"AdjektivStark", title:"Adjektivendungen ohne Artikel — Strong Endings",
    rule:"When there is NO article before the adjective, the adjective itself must show the gender — it takes STRONG endings that mirror the definite article forms (der→-er, die→-e, das→-es, den→-en). This applies after numbers, kein in plural, and when no determiner is used at all. Examples: kalter Kaffee, frisches Brot, guter Schlaf, gute Menschen.",
    ids:[344,345,348,349],
    table:{
      headers:["Fall","Maskulin","Feminin","Neutral","Plural"],
      rows:[
        ["Nominativ","kalter Kaffee","frische Milch","frisches Brot","gute Menschen"],
        ["Akkusativ","kalten Kaffee","frische Milch","frisches Brot","gute Menschen"],
        ["Dativ","kaltem Kaffee","frischer Milch","frischem Brot","guten Menschen"],
        ["Genitiv","kalten Kaffees","frischer Milch","frischen Brotes","guter Menschen"],
      ]
    }
  },
  { id:"FestAusdrücke", title:"Feste Ausdrücke — Verb + Präposition + Kasus",
    rule:"Many common expressions are verb + fixed preposition + fixed case. You must memorize both the preposition AND the case it requires. Key ones: sich interessieren für (Akk), warten auf (Akk), denken an (Akk), sich freuen auf (Akk), träumen von (Dat), sprechen mit (Dat), sich beschäftigen mit (Dat), Angst haben vor (Dat), abhängen von (Dat).",
    ids:[319,320,321,322,323],
    table:{
      headers:["Ausdruck","Kasus","Beispiel"],
      rows:[
        ["sich interessieren für","Akkusativ","für Deutsch"],
        ["warten auf","Akkusativ","auf den Bus"],
        ["denken an","Akkusativ","an die Prüfung"],
        ["sich freuen auf","Akkusativ","auf das Wochenende"],
        ["sich erinnern an","Akkusativ","an den Urlaub"],
        ["bitten um","Akkusativ","um Hilfe"],
        ["träumen von","Dativ","von einem Urlaub"],
        ["sprechen mit","Dativ","mit dem Lehrer"],
        ["sich beschäftigen mit","Dativ","mit Deutsch"],
        ["Angst haben vor","Dativ","vor der Prüfung"],
        ["abhängen von","Dativ","von der Zeit"],
        ["leiden an","Dativ","an Stress"],
      ]
    }
  },
];

// ---- State ----
let mode = "listen";
let category = "all";
let shuffle = false;
let autoAdvance = true;
let queue = [];
let queueIndex = 0;
let revealed = false;
let audio = new Audio();
let autoTimer = null;

let sessionGot = 0;
let sessionMissed = 0;
let sessionTotal = 0;

let loop = false;
let repeatCount = parseInt(localStorage.getItem("repeatCount") || "1");
let currentRepeat = 0;

// SRS state
let srsData = {};
let srsSettings = { autoGrade: false };
let practiceNowId = null;
let progressFilter = "due";
let progressPage = 0;
let vocabPage = 0;
let grammarPage = 0;
const PROG_PAGE_SIZE = 15;
const VOCAB_PAGE_SIZE = 40;
const GRAM_PAGE_SIZE = 5;

// Recall mode enhancements
let phraseDirection = "en_de"; // "en_de" (production, default) | "de_en" (recognition)
let phraseMode = "flashcard";  // "flashcard" | "mc"

// Grammar + Vocab state
let grammarFilter = "all";
let grammarTopicFilter = null;
const vocabCache = {};

// Words mode state
let wordsSRS = {};
let wordsQueue = [];
let wordsIndex = 0;
let wordRevealed = false;
let wordsShuffled = false;
let wordsDirection = "de_en"; // "de_en" | "en_de"
let wordsMode = "flashcard";  // "flashcard" | "mc"
let wordsSessionCorrect = 0;
let wordsSessionTotal = 0;

// Recall voice state
let recallRecognition = null;
let recallIsRecording = false;

// AI state
let aiMode = "translate";
let aiAudio = null;
let recognition = null;
let isRecording = false;
let lastAIResult = null;
let countdownTimer = null;

// Mini-player state
let miniPhrases = [];
let miniIndex = 0;
let miniRevealed = false;

// Chat state
let convoHistory = [];
let convoMessages = [];
let convoScenario = null;
let convoSessionId = null;
let chatRecognition = null;
let chatIsRecording = false;
let teacherMode = localStorage.getItem("teacherMode") || "caring";
let languageLevel = localStorage.getItem("languageLevel") || "b1";

// Deepgram state
let deepgramAvailable = false;
let deepgramWS = null;
let deepgramStream = null;
let deepgramRecorder = null;
let deepgramSilenceTimer = null;
let deepgramInterimEl = null;

// Conversation session state
let chatSessionActive = false;
let chatCurrentAudio = null;
let audioContextUnlocked = false;
let repetitionContext = null; // { corrected, original } when AI is waiting for learner to repeat

// Drill modal state
let drillQueue = [];
let drillIdx = 0;
let drillTag = null;

// ---- DOM refs (player) ----
const tabEls = document.querySelectorAll(".tab");
const categorySelect = document.getElementById("category-select");
const shuffleBtn = document.getElementById("shuffle-btn");
const autoBtn = document.getElementById("auto-btn");
const loopBtn = document.getElementById("loop-btn");
const cardEl = document.getElementById("card");
const categoryBadge = document.getElementById("category-badge");
const germanEl = document.getElementById("german-text");
const englishEl = document.getElementById("english-text");
const revealHint = document.getElementById("reveal-hint");
const playBtn = document.getElementById("play-btn");
const statusText = document.getElementById("status-text");
const phraseNum = document.getElementById("phrase-num");
const progressBar = document.getElementById("progress-bar");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const recallButtons = document.getElementById("recall-buttons");
const gotItBtn = document.getElementById("got-it-btn");
const missedBtn = document.getElementById("missed-btn");
const counterEl = document.getElementById("counter");
const emptyState = document.getElementById("empty-state");
const statsBar = document.getElementById("stats-bar");
const statGot = document.getElementById("stat-got");
const statMissed = document.getElementById("stat-missed");
const statTotal = document.getElementById("stat-total");

// Player-only elements to hide when AI tab is active
const playerEls = ["card", "audio-bar", "recall-buttons", "stats-bar", "nav-buttons", "empty-state"];

function hideRecallSpecificEls() {
  ["recall-srs-bar", "phrase-mc-area", "recall-voice-area"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
  if (recallIsRecording && recallRecognition) recallRecognition.stop();
}

// ---- DOM refs (AI panel) ----
const aiPanel = document.getElementById("ai-panel");
const aiSubBtns = document.querySelectorAll(".ai-sub-btn");
const aiCategorySelect = document.getElementById("ai-category-select");
const aiMicBtn = document.getElementById("ai-mic-btn");
const aiLangHint = document.getElementById("ai-lang-hint");
const aiMicStatus = document.getElementById("ai-mic-status");
const aiTextInput = document.getElementById("ai-text-input");
const aiSendBtn = document.getElementById("ai-send-btn");
const aiResultCard = document.getElementById("ai-result-card");
const aiSpinner = document.getElementById("ai-spinner");
const aiResultBody = document.getElementById("ai-result-body");
const aiReplayBtn = document.getElementById("ai-replay-btn");
const aiSaveBtn = document.getElementById("ai-save-btn");
const aiSavedCount = document.getElementById("ai-saved-count");
const aiExportBtn = document.getElementById("ai-export-btn");
const aiClearBtn = document.getElementById("ai-clear-btn");
const aiSavedList = document.getElementById("ai-saved-list");

// ---- SRS Algorithm ----

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function getSrsRecord(id) {
  return srsData[String(id)] || {
    interval: 0, easeFactor: 2.5, dueDate: null,
    lastReviewed: null, totalReviews: 0, totalCorrect: 0, archived: false
  };
}

function isDue(id) {
  const r = getSrsRecord(id);
  return r.dueDate === null || r.dueDate <= todayStr();
}

function getStatus(id) {
  const r = getSrsRecord(id);
  if (r.archived) return "archived";
  if (r.dueDate === null) return "new";
  if (r.interval >= 21) return "mastered";
  if (isDue(id)) return "due";
  return "upcoming";
}

function getNextInterval(interval, ef, correct) {
  if (!correct) return 1;
  if (interval === 0) return 1;
  if (interval === 1) return 3;
  return Math.round(interval * ef);
}

function saveSrsData() {
  localStorage.setItem("srsData", JSON.stringify(srsData));
}

function updateOnGotIt(id) {
  const r = getSrsRecord(id);
  const newEF = Math.min(3.0, Math.max(1.3, r.easeFactor + 0.1));
  const newInterval = getNextInterval(r.interval, newEF, true);
  const due = new Date();
  due.setDate(due.getDate() + newInterval);
  srsData[String(id)] = {
    ...r, interval: newInterval, easeFactor: newEF,
    dueDate: due.toISOString().split("T")[0],
    lastReviewed: todayStr(),
    totalReviews: r.totalReviews + 1,
    totalCorrect: r.totalCorrect + 1
  };
  saveSrsData();
}

function updateOnMissed(id) {
  const r = getSrsRecord(id);
  const newEF = Math.max(1.3, r.easeFactor - 0.2);
  const due = new Date();
  due.setDate(due.getDate() + 1);
  srsData[String(id)] = {
    ...r, interval: 1, easeFactor: newEF,
    dueDate: due.toISOString().split("T")[0],
    lastReviewed: todayStr(),
    totalReviews: r.totalReviews + 1
  };
  saveSrsData();
}

function migrateMissedWeights() {
  const old = JSON.parse(localStorage.getItem("missedWeights") || "null");
  if (!old) return;
  const existing = JSON.parse(localStorage.getItem("srsData") || "{}");
  for (const [idStr, missCount] of Object.entries(old)) {
    if (existing[idStr] || missCount === 0) continue;
    const due = new Date();
    due.setDate(due.getDate() + 1);
    existing[idStr] = {
      interval: 1, easeFactor: Math.max(1.3, 2.5 - missCount * 0.1),
      dueDate: due.toISOString().split("T")[0], lastReviewed: null,
      totalReviews: missCount, totalCorrect: 0, archived: false
    };
  }
  localStorage.setItem("srsData", JSON.stringify(existing));
  localStorage.removeItem("missedWeights");
}

// ---- Voice Matching ----

function normalizeGerman(text) {
  return text.toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

function isVoiceMatch(transcript, phraseGerman) {
  const aWords = new Set(normalizeGerman(transcript).split(" ").filter(Boolean));
  const bWords = new Set(normalizeGerman(phraseGerman).split(" ").filter(Boolean));
  if (!aWords.size) return false;
  let intersection = 0;
  for (const w of aWords) { if (bWords.has(w)) intersection++; }
  const union = new Set([...aWords, ...bWords]).size;
  return (intersection / union) >= 0.75;
}

// ---- Init ----
function buildCategorySelect() {
  categorySelect.innerHTML = "";
  for (const [val, label] of Object.entries(CATEGORIES)) {
    const opt = document.createElement("option");
    opt.value = val;
    opt.textContent = label;
    categorySelect.appendChild(opt);
  }
}

function buildQueue() {
  let source = category === "all" ? PHRASES : PHRASES.filter(p => p.category === category);

  source = source.filter(p => !getSrsRecord(p.id).archived);

  if (grammarFilter !== "all") {
    source = source.filter(p => (GRAMMAR_TAGS[p.id] || []).some(t => t.startsWith(grammarFilter)));
  }

  if (mode === "recall") {
    if (shuffle) {
      // Shuffle within due/new group and upcoming group separately to keep SRS priority
      const dueGroup = source.filter(p => isDue(p.id));
      const upcomingGroup = source.filter(p => !isDue(p.id));
      source = [
        ...dueGroup.sort(() => Math.random() - 0.5),
        ...upcomingGroup.sort(() => Math.random() - 0.5),
      ];
    } else {
      const statusOrder = { new: 0, due: 0, upcoming: 1, mastered: 2 };
      source = [...source].sort((a, b) => {
        const sa = statusOrder[getStatus(a.id)] ?? 1;
        const sb = statusOrder[getStatus(b.id)] ?? 1;
        if (sa !== sb) return sa - sb;
        const ra = getSrsRecord(a.id);
        const rb = getSrsRecord(b.id);
        if (ra.dueDate && rb.dueDate) return ra.dueDate.localeCompare(rb.dueDate);
        return 0;
      });
    }
    if (practiceNowId !== null) {
      const idx = source.findIndex(p => p.id === practiceNowId);
      if (idx > 0) { const [item] = source.splice(idx, 1); source.unshift(item); }
      practiceNowId = null;
    }
  }

  if (shuffle && mode !== "recall") source = [...source].sort(() => Math.random() - 0.5);
  queue = source;
  queueIndex = 0;
}

function init() {
  migrateMissedWeights();
  srsData = JSON.parse(localStorage.getItem("srsData") || "{}");
  srsSettings = JSON.parse(localStorage.getItem("srsSettings") || '{"autoGrade":false}');

  if (typeof PHRASES === "undefined" || PHRASES.length === 0) {
    emptyState.style.display = "block";
  }
  const repeatBtn = document.getElementById("repeat-btn");
  repeatBtn.textContent = repeatCount > 1 ? `Repeat: ${repeatCount}x` : "Repeat";
  repeatBtn.classList.toggle("active", repeatCount > 1);

  buildCategorySelect();
  buildQueue();
  renderCard();
  setupEvents();
  initAI();
  setupRecallSpeech();
  initWordsPanel();
}

// ---- Render (player) ----
function renderCard(autoPlay = false) {
  if (mode === "ai" || mode === "progress" || mode === "vocab" || mode === "grammar" || mode === "words") return;

  if (!queue.length) {
    audio.pause();
    statusText.textContent = "";
    emptyState.style.display = "block";
    cardEl.style.display = "none";
    return;
  }
  emptyState.style.display = "none";
  cardEl.style.display = "block";

  const p = queue[queueIndex];
  categoryBadge.textContent = CATEGORIES[p.category] || p.category;
  counterEl.textContent = `${queueIndex + 1} / ${queue.length}`;
  phraseNum.textContent = `#${p.id} - ${CATEGORIES[p.category] || p.category}`;
  progressBar.style.width = `${((queueIndex + 1) / queue.length) * 100}%`;

  revealed = false;
  currentRepeat = 0;
  clearAutoTimer();
  audio.pause();

  // Hide recall-specific elements by default; recall branch shows them
  document.getElementById("recall-srs-bar").style.display = "none";
  document.getElementById("recall-voice-area").style.display = "none";
  document.getElementById("srs-status-badge").style.display = "none";
  if (recallIsRecording) recallRecognition.stop();
  document.getElementById("recall-transcript").textContent = "";

  if (mode === "listen") {
    germanEl.classList.remove("hidden");
    englishEl.classList.remove("hidden");
    revealHint.style.display = "none";
    recallButtons.classList.remove("visible");
    statsBar.style.display = "none";
    if (autoPlay) {
      statusText.textContent = "Playing...";
      loadAndPlay(p);
    } else {
      statusText.textContent = "Press Play to start";
    }
  } else if (mode === "shadow") {
    germanEl.classList.remove("hidden");
    englishEl.classList.add("hidden");
    revealHint.style.display = "block";
    revealHint.textContent = "Tap card to see translation";
    recallButtons.classList.remove("visible");
    statsBar.style.display = "none";
    if (autoPlay) {
      statusText.textContent = "Listen and repeat aloud";
      loadAndPlay(p);
    } else {
      statusText.textContent = "Press Play to start";
    }
  } else if (mode === "recall") {
    recallButtons.classList.remove("visible");
    statsBar.style.display = "flex";
    renderSessionStats();
    document.getElementById("recall-srs-bar").style.display = "flex";
    const st = getStatus(p.id);
    const badge = document.getElementById("srs-status-badge");
    badge.style.display = "inline-block";
    badge.className = `srs-badge srs-${st}`;
    badge.textContent = st;
    renderRecallModeHeader();

    const mcArea = document.getElementById("phrase-mc-area");

    if (phraseMode === "mc") {
      // MC mode: show prompt, hide reveal hint, display choices
      document.getElementById("recall-voice-area").style.display = "none";
      revealHint.style.display = "none";
      if (phraseDirection === "en_de") {
        germanEl.classList.add("hidden");
        englishEl.classList.remove("hidden");
        statusText.textContent = "Pick the German phrase";
      } else {
        germanEl.classList.remove("hidden");
        englishEl.classList.add("hidden");
        statusText.textContent = "Pick the English meaning";
        if (p.audio) loadAndPlay(p);
      }
      mcArea.style.display = "flex";
      renderPhraseMC(p);
    } else {
      // Flashcard mode
      mcArea.style.display = "none";
      document.getElementById("recall-voice-area").style.display = "flex";
      if (phraseDirection === "en_de") {
        germanEl.classList.add("hidden");
        englishEl.classList.remove("hidden");
        revealHint.style.display = "block";
        revealHint.textContent = "Tap mic or card to reveal";
        statusText.textContent = "Produce German from memory";
      } else {
        germanEl.classList.remove("hidden");
        englishEl.classList.add("hidden");
        revealHint.style.display = "block";
        revealHint.textContent = "Tap card to reveal meaning";
        statusText.textContent = "Recall the English meaning";
        if (p.audio) loadAndPlay(p);
      }
    }
  }

  // Grammar tag chips (enriched: static + auto-detected, case tags first)
  const tagContainer = document.getElementById("grammar-tag-container");
  const tags = getTagsForCard(p.id, p.german);
  tagContainer.innerHTML = tags.slice(0, 4).map(t =>
    `<span class="grammar-chip" onclick="openGrammarTopic('${t}')">${t}</span>`
  ).join("");
  tagContainer.style.display = tags.length ? "flex" : "none";

  // Tappable words
  germanEl.innerHTML = p.german.split(/(\s+)/).map(tok =>
    /\s+/.test(tok) ? tok :
    `<span class="tap-word" data-word="${tok.replace(/[.,!?;:]/g, "")}">${tok}</span>`
  ).join("");
  englishEl.textContent = p.english;
}

function loadAndPlay(p) {
  if (!p.audio) {
    const text = p.example_de || p.german;
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "de-DE";
    utt.rate = 0.88;
    utt.onend = () => {
      currentRepeat++;
      if (currentRepeat < repeatCount) {
        if (mode === "listen") {
          statusText.textContent = `Again (${currentRepeat + 1}/${repeatCount})`;
          autoTimer = setTimeout(() => loadAndPlay(p), 1500);
        } else if (mode === "shadow") {
          statusText.textContent = `Repeat aloud! (${currentRepeat}/${repeatCount})`;
          autoTimer = setTimeout(() => loadAndPlay(p), 4000);
        }
      } else {
        currentRepeat = 0;
        statusText.textContent = "Done";
        if (mode === "listen") scheduleAutoAdvance(3000);
        else if (mode === "shadow") { statusText.textContent = "Done"; scheduleAutoAdvance(5000); }
      }
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
    statusText.textContent = "Playing...";
    return;
  }
  audio.src = p.audio;
  audio.play().catch(() => { statusText.textContent = "Tap play to start"; });
}

// ---- Auto-advance ----
function clearAutoTimer() {
  if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
}

function scheduleAutoAdvance(delayMs) {
  if (!autoAdvance || mode === "recall") return;
  autoTimer = setTimeout(() => advance(1), delayMs);
}

// ---- Navigation ----
function advance(delta) {
  clearAutoTimer();
  const next = queueIndex + delta;
  if (next >= queue.length) {
    queueIndex = loop ? 0 : queue.length - 1;
  } else {
    queueIndex = Math.max(0, next);
  }
  renderCard(true);
}

// ---- Show/hide panels when switching tabs ----
function showPlayerPanel() {
  document.getElementById("controls-bar").style.display = "flex";
  aiPanel.style.display = "none";
  document.getElementById("progress-panel").style.display = "none";
  document.getElementById("vocab-panel").style.display = "none";
  document.getElementById("grammar-panel").style.display = "none";
  document.getElementById("words-panel").style.display = "none";
  playerEls.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "";
  });
}

function showAIPanel() {
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
  hideRecallSpecificEls();
  document.getElementById("progress-panel").style.display = "none";
  document.getElementById("vocab-panel").style.display = "none";
  document.getElementById("grammar-panel").style.display = "none";
  document.getElementById("words-panel").style.display = "none";
  aiPanel.style.display = "flex";
  renderAISavedList();
}

// ---- Events (player) ----
function setupEvents() {
  tabEls.forEach(tab => {
    tab.addEventListener("click", () => {
      const newMode = tab.dataset.mode;
      tabEls.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      if (newMode === "ai") {
        mode = "ai";
        showAIPanel();
      } else if (newMode === "progress") {
        mode = "progress";
        showProgressPanel();
      } else if (newMode === "vocab") {
        mode = "vocab";
        showVocabPanel();
      } else if (newMode === "grammar") {
        mode = "grammar";
        showGrammarPanel(null);
      } else if (newMode === "words") {
        mode = "words";
        showWordsPanel();
      } else {
        mode = newMode;
        showPlayerPanel();
        if (mode === "recall") {
          sessionGot = 0; sessionMissed = 0; sessionTotal = 0;
          // Sync button states in case they were toggled while on another tab
          const dirBtn = document.getElementById("phrase-dir-btn");
          dirBtn.textContent = phraseDirection === "en_de" ? "EN→DE" : "DE→EN";
          dirBtn.classList.toggle("active", phraseDirection === "de_en");
          const mcBtn = document.getElementById("phrase-mc-btn");
          mcBtn.textContent = phraseMode === "mc" ? "MC ✓" : "MC";
          mcBtn.classList.toggle("active", phraseMode === "mc");
        }
        buildQueue();
        renderCard();
      }
    });
  });

  categorySelect.addEventListener("change", () => {
    category = categorySelect.value;
    buildQueue();
    renderCard();
  });

  document.getElementById("grammar-filter").addEventListener("change", (e) => {
    grammarFilter = e.target.value;
    buildQueue();
    renderCard();
  });

  shuffleBtn.addEventListener("click", () => {
    shuffle = !shuffle;
    shuffleBtn.classList.toggle("active", shuffle);
    buildQueue();
    renderCard();
  });

  autoBtn.addEventListener("click", () => {
    autoAdvance = !autoAdvance;
    autoBtn.classList.toggle("active", autoAdvance);
    autoBtn.textContent = autoAdvance ? "Auto ✓" : "Auto";
    if (!autoAdvance) clearAutoTimer();
  });

  loopBtn.addEventListener("click", () => {
    loop = !loop;
    loopBtn.classList.toggle("active", loop);
    loopBtn.textContent = loop ? "Loop ✓" : "Loop";
  });

  document.getElementById("repeat-btn").addEventListener("click", () => {
    repeatCount = repeatCount >= 3 ? 1 : repeatCount + 1;
    localStorage.setItem("repeatCount", String(repeatCount));
    const btn = document.getElementById("repeat-btn");
    btn.textContent = repeatCount > 1 ? `Repeat: ${repeatCount}x` : "Repeat";
    btn.classList.toggle("active", repeatCount > 1);
  });

  playBtn.addEventListener("click", () => {
    const p = queue[queueIndex];
    if (!p) return;
    if (!p.audio) {
      clearAutoTimer();
      currentRepeat = 0;
      loadAndPlay(p);
      return;
    }
    if (audio.paused) {
      const audioFile = p.audio.split('/').pop();
      if (!audio.src || audio.src === window.location.href || !audio.src.endsWith(audioFile)) loadAndPlay(p);
      else audio.play();
    } else {
      audio.pause();
      clearAutoTimer();
    }
  });

  audio.addEventListener("play", () => { statusText.textContent = "Playing..."; });
  audio.addEventListener("pause", () => { statusText.textContent = "Paused"; });
  audio.addEventListener("ended", () => {
    currentRepeat++;
    if (currentRepeat < repeatCount) {
      if (mode === "listen") {
        statusText.textContent = `Again (${currentRepeat + 1}/${repeatCount})`;
        autoTimer = setTimeout(() => audio.play().catch(() => {}), 1500);
      } else if (mode === "shadow") {
        statusText.textContent = `Repeat aloud! (${currentRepeat}/${repeatCount})`;
        autoTimer = setTimeout(() => audio.play().catch(() => {}), 4000);
      }
    } else {
      currentRepeat = 0;
      statusText.textContent = "Done";
      if (mode === "listen") scheduleAutoAdvance(3000);
      else if (mode === "shadow") { statusText.textContent = "Done"; scheduleAutoAdvance(5000); }
    }
  });
  audio.addEventListener("error", () => { statusText.textContent = "Audio error"; });

  cardEl.addEventListener("click", (e) => {
    if (e.target.closest("#audio-bar") || e.target.closest("#recall-buttons") || e.target.closest("#phrase-mc-area")) return;
    const p = queue[queueIndex];
    if (!p || revealed) return;
    if (mode === "shadow") {
      revealed = true;
      englishEl.classList.remove("hidden");
      revealHint.style.display = "none";
    } else if (mode === "recall" && phraseMode === "flashcard") {
      revealRecallCard();
    }
  });

  gotItBtn.addEventListener("click", () => {
    const p = queue[queueIndex];
    sessionGot++; sessionTotal++;
    updateOnGotIt(p.id);
    renderRecallModeHeader();
    renderSessionStats();
    advance(1);
  });

  missedBtn.addEventListener("click", () => {
    const p = queue[queueIndex];
    sessionMissed++; sessionTotal++;
    updateOnMissed(p.id);
    renderRecallModeHeader();
    renderSessionStats();
    advance(1);
  });

  prevBtn.addEventListener("click", () => advance(-1));
  nextBtn.addEventListener("click", () => advance(1));

  document.getElementById("recall-mic-btn").addEventListener("click", () => {
    if (!recallRecognition) return;
    if (recallIsRecording) { recallRecognition.stop(); }
    else { document.getElementById("recall-transcript").textContent = ""; recallRecognition.start(); }
  });

  document.getElementById("recall-autograde-toggle").addEventListener("click", () => {
    srsSettings.autoGrade = !srsSettings.autoGrade;
    localStorage.setItem("srsSettings", JSON.stringify(srsSettings));
    renderRecallModeHeader();
  });

  document.getElementById("phrase-dir-btn").addEventListener("click", () => {
    phraseDirection = phraseDirection === "en_de" ? "de_en" : "en_de";
    const btn = document.getElementById("phrase-dir-btn");
    btn.textContent = phraseDirection === "en_de" ? "EN→DE" : "DE→EN";
    btn.classList.toggle("active", phraseDirection === "de_en");
    if (mode === "recall") renderCard();
  });

  document.getElementById("phrase-mc-btn").addEventListener("click", () => {
    phraseMode = phraseMode === "flashcard" ? "mc" : "flashcard";
    const btn = document.getElementById("phrase-mc-btn");
    btn.textContent = phraseMode === "mc" ? "MC ✓" : "MC";
    btn.classList.toggle("active", phraseMode === "mc");
    if (mode === "recall") renderCard();
  });

  document.querySelectorAll(".prog-filter").forEach(btn => {
    btn.addEventListener("click", () => { progressFilter = btn.dataset.filter; progressPage = 0; renderProgressTab(); });
  });

  // Tappable word vocab lookup
  germanEl.addEventListener("click", (e) => {
    const span = e.target.closest(".tap-word");
    if (!span) return;
    const word = span.dataset.word;
    if (word && word.length > 1) openVocabPopup(word);
  });

  // Vocab modal close
  document.getElementById("vocab-modal-close").addEventListener("click", () => {
    document.getElementById("vocab-modal").style.display = "none";
  });
  document.getElementById("vocab-modal").addEventListener("click", (e) => {
    if (e.target === document.getElementById("vocab-modal")) {
      document.getElementById("vocab-modal").style.display = "none";
    }
  });

  // Vocab panel search/filter
  document.getElementById("vocab-panel-search").addEventListener("input", (e) => {
    vocabPage = 0;
    renderVocabPanel(e.target.value);
  });

  document.addEventListener("keydown", (e) => {
    if (mode === "ai" || mode === "progress" || mode === "vocab" || mode === "grammar" || mode === "words") return;
    if (e.key === "Escape") { document.getElementById("vocab-modal").style.display = "none"; return; }
    if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); advance(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); advance(-1); }
    if (e.key === "p" || e.key === "P") playBtn.click();
    if (e.key === "r" || e.key === "R") cardEl.click();
    if (e.key === "g" || e.key === "G") gotItBtn.click();
    if (e.key === "m" || e.key === "M") missedBtn.click();
  });

  setupDrillModal();
}

// ---- AI Chat ----

function initAI() {
  aiCategorySelect.innerHTML = "";
  for (const [val, label] of Object.entries(CATEGORIES)) {
    if (val === "all") continue;
    const opt = document.createElement("option");
    opt.value = val;
    opt.textContent = label;
    if (val === "hirschsprach_cafe") opt.selected = true;
    aiCategorySelect.appendChild(opt);
  }
  renderAISavedList();
  setupAIEvents();
  setupSpeechRecognition();
  initChat();
}

function setupAIEvents() {
  aiSubBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      aiMode = btn.dataset.aimode;
      aiSubBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      if (aiMode === "chat") {
        document.getElementById("ai-tc-panel").style.display = "none";
        document.getElementById("ai-chat-panel").style.display = "flex";
      } else {
        document.getElementById("ai-tc-panel").style.display = "flex";
        document.getElementById("ai-chat-panel").style.display = "none";
        aiLangHint.textContent = aiMode === "translate" ? "Speak in English" : "Sprechen Sie Deutsch";
        document.getElementById("ai-category-row").style.display = aiMode === "translate" ? "flex" : "none";
        const modeTitle = document.getElementById("ai-mode-title");
        const modeDesc = document.getElementById("ai-mode-desc");
        if (aiMode === "translate") {
          if (modeTitle) modeTitle.textContent = "Translate to German";
          if (modeDesc) modeDesc.textContent = "Speak or type in English — hear the German.";
          aiTextInput.placeholder = "Or type here and press Enter";
        } else if (aiMode === "write") {
          if (modeTitle) modeTitle.textContent = "Check my Writing";
          if (modeDesc) modeDesc.textContent = "Type a German sentence and get case and preposition feedback.";
          aiLangHint.textContent = "Type in German";
          aiTextInput.placeholder = "Write any German sentence...";
        } else {
          if (modeTitle) modeTitle.textContent = "Check my German";
          if (modeDesc) modeDesc.textContent = "Say or type a German sentence — get it corrected.";
          aiTextInput.placeholder = "Or type here and press Enter";
        }
        clearAIResult();
        if (recognition) recognition.lang = aiMode === "translate" ? "en-US" : "de-DE";
      }
    });
  });

  aiMicBtn.addEventListener("click", toggleRecording);
  aiSendBtn.addEventListener("click", () => { cancelCountdown(); sendToAI(aiTextInput.value.trim()); });
  aiTextInput.addEventListener("keydown", e => { if (e.key === "Enter") { cancelCountdown(); sendToAI(aiTextInput.value.trim()); } });
  aiTextInput.addEventListener("input", () => { if (countdownTimer) { cancelCountdown(); aiMicStatus.textContent = "Tap Send or mic"; } });
  aiReplayBtn.addEventListener("click", () => {
    const text = lastAIResult ? (aiMode === "translate" ? lastAIResult.german : lastAIResult.corrected) : null;
    playBase64Audio(lastAIResult?.audio_base64, text);
  });
  aiSaveBtn.addEventListener("click", saveCurrentPhrase);
  aiExportBtn.addEventListener("click", exportAIPhrases);
  aiClearBtn.addEventListener("click", () => {
    if (confirm("Clear all saved AI phrases?")) {
      localStorage.removeItem("ai_phrases");
      renderAISavedList();
    }
  });

  document.getElementById("mini-practice-btn").addEventListener("click", openMiniPlayer);
  document.getElementById("mini-close-btn").addEventListener("click", closeMiniPlayer);
  document.getElementById("mini-shuffle-btn").addEventListener("click", () => {
    miniPhrases = [...miniPhrases].sort(() => Math.random() - 0.5);
    miniIndex = 0;
    renderMiniCard();
  });
  document.getElementById("mini-card").addEventListener("click", () => {
    if (!miniRevealed) miniRevealCard();
  });
  document.getElementById("mini-got-it-btn").addEventListener("click", () => miniAdvance());
  document.getElementById("mini-skip-btn").addEventListener("click", () => miniAdvance());
  document.getElementById("mini-replay-btn").addEventListener("click", () => {
    const p = miniPhrases[miniIndex];
    playBase64Audio(p?.audio_base64, p?.german);
  });
}

function setupSpeechRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    aiMicBtn.style.display = "none";
    aiLangHint.style.display = "none";
    aiMicStatus.textContent = "Mic not supported in this browser - use text input below";
    return;
  }
  recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onstart = () => {
    isRecording = true;
    aiMicBtn.classList.add("recording");
    aiMicStatus.textContent = "Listening...";
  };
  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    aiTextInput.value = text;
    startCountdown(text);
  };
  recognition.onerror = (e) => {
    aiMicStatus.textContent = `Could not hear you (${e.error}). Try typing instead.`;
    stopRecording();
  };
  recognition.onend = () => stopRecording();
}

function cancelCountdown() {
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
}

function startCountdown(text) {
  cancelCountdown();
  let count = 3;
  aiMicStatus.textContent = `Sending in ${count}… (tap Send to go now)`;
  countdownTimer = setInterval(() => {
    count--;
    if (count > 0) {
      aiMicStatus.textContent = `Sending in ${count}… (tap Send to go now)`;
    } else {
      cancelCountdown();
      sendToAI(aiTextInput.value.trim() || text);
    }
  }, 1000);
}

function toggleRecording() {
  if (!recognition) return;
  if (isRecording) { recognition.stop(); }
  else {
    recognition.lang = aiMode === "translate" ? "en-US" : "de-DE";
    recognition.start();
  }
}

function stopRecording() {
  isRecording = false;
  aiMicBtn.classList.remove("recording");
  if (!lastAIResult) aiMicStatus.textContent = "Tap mic to start";
}

async function sendToAI(text) {
  if (!text) return;
  cancelCountdown();
  clearAIResult();
  aiResultCard.style.display = "flex";
  aiSpinner.style.display = "block";
  aiMicStatus.textContent = "Processing...";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: aiMode === "write" ? "write-check" : aiMode, text }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Server error");

    lastAIResult = result;
    aiSpinner.style.display = "none";
    renderAIResult(result);
    if (aiMode !== "write") {
      const ttsText = aiMode === "translate" ? result.german : result.corrected;
      playBase64Audio(result.audio_base64, ttsText);
    }
    aiMicStatus.textContent = "Done";
    aiTextInput.value = "";
  } catch (err) {
    aiSpinner.style.display = "none";
    aiResultBody.innerHTML = `<span style="color:var(--red)">Error: ${err.message}</span>`;
    aiMicStatus.textContent = "Error - try again";
  }
}

function renderAIResult(result) {
  if (aiMode === "translate") {
    if (result.category && aiCategorySelect.querySelector(`option[value="${result.category}"]`)) {
      aiCategorySelect.value = result.category;
    }
    const islandLabel = CATEGORIES[result.category];
    const hint = islandLabel ? `<div class="ai-category-hint">Suggested island: ${islandLabel}</div>` : "";
    aiResultBody.innerHTML = `
      <div class="ai-english">You: "${result.english}"</div>
      <div class="ai-german">${result.german}</div>
      ${hint}
    `;
  } else if (aiMode === "write") {
    const badge = result.is_correct ? `<div class="ai-correct-badge">✓ Correct German!</div>` : "";
    const autoChips = getAutoTags(result.corrected);
    const chipsHtml = autoChips.length
      ? `<div class="ai-write-chips">${autoChips.map(t => `<span class="grammar-chip" onclick="openGrammarTopic('${t}')">${t}</span>`).join("")}</div>`
      : "";
    aiResultBody.innerHTML = `
      <div class="ai-original">You wrote: "${result.original}"</div>
      ${badge}
      <div class="ai-corrected">${result.corrected}</div>
      <div class="ai-explanation">${result.explanation}</div>
      ${chipsHtml}
    `;
  } else {
    const badge = result.is_correct ? `<div class="ai-correct-badge">✓ Perfect German!</div>` : "";
    aiResultBody.innerHTML = `
      <div class="ai-original">You said: "${result.original}"</div>
      ${badge}
      <div class="ai-corrected">${result.corrected}</div>
      <div class="ai-explanation">${result.explanation}</div>
    `;
  }
}

function speakGerman(text) {
  if (!text || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "de-DE";
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
  return utter;
}

function playBase64Audio(base64, text) {
  if (base64) {
    if (aiAudio) aiAudio.pause();
    aiAudio = new Audio(`data:audio/mp3;base64,${base64}`);
    aiAudio.play().catch(() => {});
  } else if (text) {
    speakGerman(text);
  }
}

function clearAIResult() {
  lastAIResult = null;
  aiResultCard.style.display = "none";
  aiSpinner.style.display = "none";
  aiResultBody.innerHTML = "";
}

function saveCurrentPhrase() {
  if (!lastAIResult) return;
  const german = aiMode === "translate" ? lastAIResult.german : lastAIResult.corrected;
  const english = aiMode === "translate" ? lastAIResult.english : lastAIResult.original;
  const cat = aiCategorySelect.value;
  const audio_base64 = lastAIResult.audio_base64 || null;

  const saved = JSON.parse(localStorage.getItem("ai_phrases") || "[]");
  saved.push({ german, english, category: cat, audio_base64, created_date: new Date().toISOString().split("T")[0] });
  localStorage.setItem("ai_phrases", JSON.stringify(saved));

  aiSaveBtn.textContent = "Saved!";
  setTimeout(() => { aiSaveBtn.textContent = "+ Save phrase"; }, 1500);
  renderAISavedList();
}

function renderAISavedList() {
  const saved = JSON.parse(localStorage.getItem("ai_phrases") || "[]");
  aiSavedCount.textContent = `Saved: ${saved.length}`;
  if (!saved.length) { aiSavedList.innerHTML = ""; return; }
  aiSavedList.innerHTML = [...saved].reverse().map((p, revIdx) => {
    const idx = saved.length - 1 - revIdx;
    return `
      <div class="ai-saved-item">
        <div class="saved-german">${p.german}</div>
        <div class="saved-english">${p.english}</div>
        <div class="ai-saved-meta">
          <span class="saved-category">${CATEGORIES[p.category] || p.category}</span>
          <button class="ai-saved-play-btn" onclick="playAISavedPhrase(${idx})">▶ Play</button>
        </div>
      </div>
    `;
  }).join("");
}

function playAISavedPhrase(idx) {
  const saved = JSON.parse(localStorage.getItem("ai_phrases") || "[]");
  const p = saved[idx];
  playBase64Audio(p?.audio_base64, p?.german);
}

function exportAIPhrases() {
  const saved = JSON.parse(localStorage.getItem("ai_phrases") || "[]");
  if (!saved.length) { alert("No saved phrases to export yet."); return; }
  const blob = new Blob([JSON.stringify(saved, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `ai_phrases_${new Date().toISOString().split("T")[0]}.json`;
  a.click();
}

// ---- Recall Voice ----

function setupRecallSpeech() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { document.getElementById("recall-mic-btn").style.display = "none"; return; }
  recallRecognition = new SR();
  recallRecognition.continuous = false;
  recallRecognition.interimResults = false;
  recallRecognition.lang = "de-DE";
  recallRecognition.onstart = () => {
    recallIsRecording = true;
    document.getElementById("recall-mic-btn").classList.add("recording");
    document.getElementById("recall-transcript").textContent = "Listening...";
  };
  recallRecognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    document.getElementById("recall-transcript").textContent = `"${text}"`;
    handleRecallVoice(text);
  };
  recallRecognition.onerror = (e) => {
    document.getElementById("recall-transcript").textContent = `Error: ${e.error}`;
    recallIsRecording = false;
    document.getElementById("recall-mic-btn").classList.remove("recording");
  };
  recallRecognition.onend = () => {
    recallIsRecording = false;
    document.getElementById("recall-mic-btn").classList.remove("recording");
  };
}

function handleRecallVoice(transcript) {
  const p = queue[queueIndex];
  if (!p || phraseMode !== "flashcard" || phraseDirection !== "en_de") return;
  revealRecallCard();
  if (srsSettings.autoGrade && isVoiceMatch(transcript, p.german)) {
    setTimeout(() => gotItBtn.click(), 700);
  }
}

function revealRecallCard() {
  if (revealed) return;
  revealed = true;
  revealHint.style.display = "none";
  recallButtons.classList.add("visible");

  if (phraseDirection === "en_de") {
    germanEl.classList.remove("hidden");
    loadAndPlay(queue[queueIndex]);
  } else {
    // DE→EN: reveal the English meaning (no audio needed)
    englishEl.classList.remove("hidden");
  }
}

function generatePhraseMCChoices(correctPhrase) {
  // Prefer same category, then any other
  let pool = PHRASES.filter(p => p.id !== correctPhrase.id && p.category === correctPhrase.category);
  if (pool.length < 3) pool = PHRASES.filter(p => p.id !== correctPhrase.id);
  const distractors = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
  return [...distractors, correctPhrase].sort(() => Math.random() - 0.5);
}

function renderPhraseMC(correctPhrase) {
  const choices = generatePhraseMCChoices(correctPhrase);
  const container = document.getElementById("phrase-mc-choices");
  container.innerHTML = choices.map(p => {
    const label = phraseDirection === "en_de" ? p.german : p.english;
    return `<button class="phrase-mc-btn" data-id="${p.id}" onclick="handlePhraseMC(${p.id}, ${correctPhrase.id})">${label}</button>`;
  }).join("");
}

function handlePhraseMC(selectedId, correctId) {
  document.querySelectorAll(".phrase-mc-btn").forEach(btn => {
    btn.disabled = true;
    const btnId = parseInt(btn.dataset.id);
    if (btnId === correctId) btn.classList.add("mc-correct");
    else if (btnId === selectedId) btn.classList.add("mc-wrong");
  });

  const isCorrect = selectedId === correctId;
  if (isCorrect) { sessionGot++; sessionTotal++; updateOnGotIt(correctId); }
  else { sessionMissed++; sessionTotal++; updateOnMissed(correctId); }

  renderRecallModeHeader();
  renderSessionStats();

  // Play German audio of correct phrase as audio feedback
  const correctPhrase = PHRASES.find(p => p.id === correctId);
  if (correctPhrase?.audio) {
    audio.src = correctPhrase.audio;
    audio.play().catch(() => {});
  }

  setTimeout(() => advance(1), isCorrect ? 900 : 1600);
}

function renderSessionStats() {
  statGot.textContent = sessionGot;
  statMissed.textContent = sessionMissed;
  statTotal.textContent = sessionTotal;
  const pctEl = document.getElementById("stat-pct");
  if (pctEl && sessionTotal > 0) {
    pctEl.textContent = `${Math.round((sessionGot / sessionTotal) * 100)}%`;
    pctEl.style.display = "block";
  } else if (pctEl) {
    pctEl.style.display = "none";
  }
}

function renderRecallModeHeader() {
  const dueCount = PHRASES.filter(p => {
    const r = getSrsRecord(p.id);
    return !r.archived && isDue(p.id);
  }).length;
  document.getElementById("recall-due-count").textContent =
    dueCount > 0 ? `${dueCount} due today` : "All caught up!";
  const btn = document.getElementById("recall-autograde-toggle");
  btn.textContent = `Auto-grade: ${srsSettings.autoGrade ? "ON" : "OFF"}`;
  btn.classList.toggle("active", srsSettings.autoGrade);
}

// ---- Progress Tab ----

function computeGrammarStats() {
  const stats = {};
  for (const p of PHRASES) {
    const tags = getTagsForCard(p.id, p.german);
    const rec = getSrsRecord(p.id);
    for (const tag of tags) {
      if (!CASE_TAG_PRIORITY.includes(tag)) continue;
      if (!stats[tag]) stats[tag] = { total: 0, totalReviews: 0, totalCorrect: 0 };
      stats[tag].total++;
      stats[tag].totalReviews += rec.totalReviews || 0;
      stats[tag].totalCorrect += rec.totalCorrect || 0;
    }
  }
  return stats;
}

function renderWeakSpots() {
  const el = document.getElementById("grammar-weak-spots");
  if (!el) return;
  const stats = computeGrammarStats();
  const entries = Object.entries(stats).filter(([, s]) => s.total > 0);
  if (!entries.length) { el.innerHTML = ""; return; }
  entries.sort(([, a], [, b]) => {
    const aAcc = a.totalReviews > 0 ? a.totalCorrect / a.totalReviews : null;
    const bAcc = b.totalReviews > 0 ? b.totalCorrect / b.totalReviews : null;
    if (aAcc === null && bAcc === null) return 0;
    if (aAcc === null) return 1;
    if (bAcc === null) return -1;
    return aAcc - bAcc;
  });
  el.innerHTML = `<div class="ws-section">
    <div class="ws-title">Grammar Weak Spots</div>
    ${entries.map(([tag, s]) => {
      const pct = s.totalReviews > 0 ? Math.round((s.totalCorrect / s.totalReviews) * 100) : null;
      const clr = pct === null ? "var(--text-dim)" : pct < 50 ? "var(--red)" : pct < 75 ? "var(--yellow)" : "var(--green)";
      const fill = pct === null ? "var(--surface3)" : pct < 50 ? "var(--red)" : pct < 75 ? "var(--yellow)" : "var(--green)";
      const label = pct === null ? "not reviewed yet" : `${pct}% accurate`;
      const reviewed = s.totalReviews > 0 ? `${s.totalCorrect}/${s.totalReviews} correct` : `0 of ${s.total} reviewed`;
      return `<div class="ws-row">
        <div class="ws-left">
          <span class="grammar-chip ws-chip" onclick="openGrammarTopic('${tag}')">${tag}</span>
          <span class="ws-reviewed">${reviewed}</span>
        </div>
        <div class="ws-right">
          <span class="ws-pct" style="color:${clr}">${label}</span>
          <div class="ws-bar-wrap"><div class="ws-fill" style="width:${pct ?? 0}%;background:${fill}"></div></div>
          <button class="ws-drill-btn" onclick="openDrillMode('${tag}')">Drill</button>
        </div>
      </div>`;
    }).join("")}
  </div>`;
}

function showProgressPanel() {
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
  hideRecallSpecificEls();
  aiPanel.style.display = "none";
  document.getElementById("progress-panel").style.display = "flex";
  renderProgressTab();
}

function paginationHTML(page, total, pageSize, prevFn, nextFn) {
  if (total <= pageSize) return "";
  const totalPages = Math.ceil(total / pageSize);
  return `<div class="pagination-bar">
    <button class="page-btn" onclick="${prevFn}()" ${page === 0 ? "disabled" : ""}>&#8592; Prev</button>
    <span class="page-info">${page + 1} / ${totalPages}</span>
    <button class="page-btn" onclick="${nextFn}()" ${page >= totalPages - 1 ? "disabled" : ""}>Next &#8594;</button>
  </div>`;
}

function renderProgressTab() {
  renderWeakSpots();
  const counts = { new: 0, due: 0, upcoming: 0, mastered: 0, archived: 0 };
  for (const p of PHRASES) { const s = getStatus(p.id); if (counts[s] !== undefined) counts[s]++; }
  document.getElementById("prog-due-val").textContent = counts.due + counts.new;
  document.getElementById("prog-upcoming-val").textContent = counts.upcoming;
  document.getElementById("prog-mastered-val").textContent = counts.mastered;
  document.getElementById("prog-new-val").textContent = counts.new;

  document.querySelectorAll(".prog-filter").forEach(b => b.classList.toggle("active", b.dataset.filter === progressFilter));

  let filtered = PHRASES.filter(p => {
    if (progressFilter === "all") return true;
    if (progressFilter === "due") return ["due", "new"].includes(getStatus(p.id));
    return getStatus(p.id) === progressFilter;
  });
  if (progressFilter === "upcoming") {
    filtered.sort((a, b) => (getSrsRecord(a.id).dueDate || "").localeCompare(getSrsRecord(b.id).dueDate || ""));
  }

  const list = document.getElementById("progress-list");
  if (!filtered.length) { list.innerHTML = `<div class="prog-empty">Nothing here yet.</div>`; return; }
  const totalPages = Math.ceil(filtered.length / PROG_PAGE_SIZE);
  progressPage = Math.min(progressPage, totalPages - 1);
  const page = filtered.slice(progressPage * PROG_PAGE_SIZE, (progressPage + 1) * PROG_PAGE_SIZE);
  list.innerHTML = page.map(p => {
    const r = getSrsRecord(p.id);
    const st = getStatus(p.id);
    const dueLabel = r.dueDate ? (isDue(p.id) ? "Due now" : `Due ${r.dueDate}`) : "Never reviewed";
    return `
      <div class="prog-item">
        <div class="prog-item-top">
          <span class="srs-badge srs-${st}">${st}</span>
          <span class="prog-interval">Interval: ${r.interval}d &middot; EF: ${r.easeFactor.toFixed(1)}</span>
        </div>
        <div class="prog-german">${p.german}</div>
        <div class="prog-english">${p.english}</div>
        <div class="prog-meta">${dueLabel} &middot; ${r.totalCorrect}/${r.totalReviews} correct</div>
        <div class="prog-actions">
          <button class="prog-btn" onclick="practiceNow(${p.id})">Practice Now</button>
          <button class="prog-btn" onclick="resetSrs(${p.id})">Reset</button>
          ${r.archived
            ? `<button class="prog-btn warn" onclick="restorePhrase(${p.id})">Restore</button>`
            : `<button class="prog-btn warn" onclick="archivePhrase(${p.id})">Archive</button>`}
        </div>
      </div>`;
  }).join("") + paginationHTML(progressPage, filtered.length, PROG_PAGE_SIZE, "prevProgressPage", "nextProgressPage");
}

function prevProgressPage() { progressPage = Math.max(0, progressPage - 1); renderProgressTab(); document.getElementById("progress-list").scrollIntoView({ behavior: "smooth", block: "start" }); }
function nextProgressPage() { progressPage++; renderProgressTab(); document.getElementById("progress-list").scrollIntoView({ behavior: "smooth", block: "start" }); }

function practiceNow(phraseId) {
  practiceNowId = phraseId;
  mode = "recall";
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.mode === "recall"));
  sessionGot = 0; sessionMissed = 0; sessionTotal = 0;
  showPlayerPanel();
  buildQueue();
  renderCard();
}

function resetSrs(phraseId) {
  if (!confirm("Reset SRS data for this phrase?")) return;
  delete srsData[String(phraseId)];
  saveSrsData();
  renderProgressTab();
}

function archivePhrase(phraseId) {
  srsData[String(phraseId)] = { ...getSrsRecord(phraseId), archived: true };
  saveSrsData();
  renderProgressTab();
}

function restorePhrase(phraseId) {
  srsData[String(phraseId)] = { ...getSrsRecord(phraseId), archived: false };
  saveSrsData();
  renderProgressTab();
}

// ---- Drill Modal ----

const DRILL_BLANKABLE_RX = /\b(der|die|das|dem|den|des|ein|eine|einem|einen|einer|eines|im|am|ins|ans|zum|zur)\b/;
const DRILL_DISTRACTORS = {
  "dem": ["den","der","die"], "den": ["dem","der","einen"], "der": ["dem","den","die"],
  "die": ["das","der","dem"], "das": ["die","dem","den"], "des": ["dem","der","eines"],
  "ein": ["eine","einen","einem"], "eine": ["ein","einen","einer"], "einem": ["einen","einer","ein"],
  "einen": ["einem","einer","ein"], "einer": ["eine","einem","ein"], "eines": ["einem","einer","ein"],
  "im": ["am","zum","ins"], "am": ["im","zum","zur"], "ins": ["ans","im","die"],
  "ans": ["ins","am","die"], "zum": ["zur","am","im"], "zur": ["zum","am","der"],
};

function generateGapFill(phrase) {
  const match = DRILL_BLANKABLE_RX.exec(phrase.german);
  if (!match) return null;
  const blank = match[1];
  const display = phrase.german.slice(0, match.index) +
    '<span class="drill-blank">___</span>' +
    phrase.german.slice(match.index + blank.length);
  const distractors = (DRILL_DISTRACTORS[blank.toLowerCase()] || ["dem","die","den"]).slice(0, 3);
  const options = [blank, ...distractors].sort(() => Math.random() - 0.5);
  return { display, blank, options, phraseId: phrase.id, german: phrase.german };
}

function openDrillMode(tag) {
  drillTag = tag;
  const tagged = PHRASES.filter(p => getTagsForCard(p.id, p.german).includes(tag));
  drillQueue = tagged.map(p => generateGapFill(p)).filter(Boolean).sort(() => Math.random() - 0.5);
  if (!drillQueue.length) {
    alert(`No drillable phrases found for "${tag}". Try a different topic.`);
    return;
  }
  drillIdx = 0;
  document.getElementById("drill-modal").style.display = "flex";
  renderDrillCard();
}

function renderDrillCard() {
  if (drillIdx >= drillQueue.length) {
    document.getElementById("drill-sentence").innerHTML = '<div class="drill-done">Done! All phrases completed.</div>';
    document.getElementById("drill-choices").innerHTML = "";
    document.getElementById("drill-feedback").style.display = "none";
    document.getElementById("drill-next").style.display = "none";
    document.getElementById("drill-progress-label").textContent = "Complete!";
    return;
  }
  const item = drillQueue[drillIdx];
  document.getElementById("drill-tag-chip").innerHTML = `<span class="grammar-chip">${drillTag}</span>`;
  document.getElementById("drill-progress-label").textContent = `${drillIdx + 1} / ${drillQueue.length}`;
  document.getElementById("drill-sentence").innerHTML = `<div class="drill-phrase">${item.display}</div>`;
  document.getElementById("drill-feedback").style.display = "none";
  document.getElementById("drill-next").style.display = "none";
  document.getElementById("drill-choices").innerHTML = item.options.map(opt =>
    `<button class="drill-choice" onclick="answerDrill('${opt}')">${opt}</button>`
  ).join("");
}

function answerDrill(chosen) {
  const item = drillQueue[drillIdx];
  const correct = item.blank;
  const isCorrect = chosen.toLowerCase() === correct.toLowerCase();
  document.querySelectorAll(".drill-choice").forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) btn.classList.add("drill-correct");
    else if (btn.textContent === chosen && !isCorrect) btn.classList.add("drill-wrong");
  });
  document.getElementById("drill-sentence").innerHTML = `<div class="drill-phrase">${item.german}</div>`;
  if (isCorrect) updateOnGotIt(item.phraseId);
  else updateOnMissed(item.phraseId);
  speakGerman(item.german);
  const fb = document.getElementById("drill-feedback");
  fb.style.display = "block";
  fb.innerHTML = isCorrect
    ? `<span style="color:var(--green)">✓ Correct!</span>`
    : `<span style="color:var(--red)">✗ Correct answer: <strong>${correct}</strong></span>`;
  document.getElementById("drill-next").style.display = "block";
  drillIdx++;
}

function setupDrillModal() {
  document.getElementById("drill-close").addEventListener("click", () => {
    document.getElementById("drill-modal").style.display = "none";
    window.speechSynthesis && window.speechSynthesis.cancel();
  });
  document.getElementById("drill-modal").addEventListener("click", e => {
    if (e.target === document.getElementById("drill-modal")) {
      document.getElementById("drill-modal").style.display = "none";
      window.speechSynthesis && window.speechSynthesis.cancel();
    }
  });
  document.getElementById("drill-next").addEventListener("click", renderDrillCard);
}

// ---- Vocab Popup ----

async function openVocabPopup(word) {
  const modal = document.getElementById("vocab-modal");
  modal.style.display = "flex";
  document.getElementById("vocab-spinner").style.display = "block";
  document.getElementById("vocab-result").style.display = "none";
  document.getElementById("vocab-spinner").textContent = "Looking up...";

  if (vocabCache[word]) {
    renderVocabResult(vocabCache[word]);
    return;
  }
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "vocab", text: word }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Server error");
    vocabCache[word] = data;
    renderVocabResult(data);
  } catch (err) {
    document.getElementById("vocab-spinner").textContent = `Error: ${err.message}`;
  }
}

function renderVocabResult(data) {
  document.getElementById("vocab-spinner").style.display = "none";
  document.getElementById("vocab-result").style.display = "block";
  const articleHtml = data.article && data.article !== "none"
    ? `<span class="vocab-article">${data.article}</span> ` : "";
  document.getElementById("vocab-word-main").innerHTML =
    `${articleHtml}<span class="vocab-word-text">${data.word || ""}</span>`;
  document.getElementById("vocab-pos-badge").textContent = data.pos || "";
  document.getElementById("vocab-def").textContent = data.definition || "";
  document.getElementById("vocab-example-text").textContent = data.example || "";
  document.getElementById("vocab-tip-text").textContent = data.tip || "";
}

// ---- Vocab Tab ----

const STOP_WORDS = new Set([
  "ich","du","er","sie","es","wir","ihr","sich","mir","mich","dir","dich","uns","euch",
  "der","die","das","ein","eine","einen","einem","einer","eines","den","dem","des",
  "und","oder","aber","auch","denn","wenn","weil","dass","ob","als","wie","damit",
  "ist","bin","bist","sind","war","waren","sein","haben","hat","habe","hatte","hatten",
  "nicht","kein","keine","keinen","so","noch","schon","sehr","nur","hier","da","dort",
  "an","auf","in","von","zu","aus","mit","bei","nach","vor","über","unter","für","gegen",
  "bis","durch","ohne","um","am","im","ins","zum","zur","beim","vom","was","wer","wo",
  "wann","wie","warum","woher","wohin","welche","welchen","welchem","welches","mal"
]);

function extractVocabWords() {
  const map = new Map();
  for (const p of PHRASES) {
    const tokens = p.german.replace(/[.,!?;:]/g, "").split(/\s+/).filter(Boolean);
    for (const tok of tokens) {
      const key = tok.toLowerCase();
      if (key.length < 3 || STOP_WORDS.has(key)) continue;
      if (!map.has(key)) map.set(key, { display: tok, count: 0, phraseIds: [] });
      const entry = map.get(key);
      entry.count++;
      if (!entry.phraseIds.includes(p.id)) entry.phraseIds.push(p.id);
    }
  }
  return [...map.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .map(([key, val]) => ({ key, ...val }));
}

function renderVocabPanel(search = "") {
  const words = extractVocabWords();
  const filtered = search
    ? words.filter(w => w.key.includes(search.toLowerCase()))
    : words;
  const list = document.getElementById("vocab-panel-list");
  if (!filtered.length) { list.innerHTML = `<div class="prog-empty">No words found.</div>`; return; }
  const totalPages = Math.ceil(filtered.length / VOCAB_PAGE_SIZE);
  vocabPage = Math.min(vocabPage, totalPages - 1);
  const page = filtered.slice(vocabPage * VOCAB_PAGE_SIZE, (vocabPage + 1) * VOCAB_PAGE_SIZE);
  list.innerHTML = page.map(w => `
    <div class="vocab-item" onclick="openVocabPopup('${w.display.replace(/'/g, "\\'")}')">
      <span class="vocab-item-word">${w.display}</span>
      <span class="vocab-item-count">${w.count}×</span>
    </div>
  `).join("") + paginationHTML(vocabPage, filtered.length, VOCAB_PAGE_SIZE, "prevVocabPage", "nextVocabPage");
}

function prevVocabPage() { vocabPage = Math.max(0, vocabPage - 1); renderVocabPanel(document.getElementById("vocab-panel-search").value); document.getElementById("vocab-panel-list").scrollIntoView({ behavior: "smooth", block: "start" }); }
function nextVocabPage() { vocabPage++; renderVocabPanel(document.getElementById("vocab-panel-search").value); document.getElementById("vocab-panel-list").scrollIntoView({ behavior: "smooth", block: "start" }); }

function showVocabPanel() {
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
  hideRecallSpecificEls();
  aiPanel.style.display = "none";
  document.getElementById("progress-panel").style.display = "none";
  document.getElementById("grammar-panel").style.display = "none";
  document.getElementById("vocab-panel").style.display = "flex";
  document.getElementById("vocab-panel-search").value = "";
  vocabPage = 0;
  renderVocabPanel();
}

// ---- Grammar Tab ----

function showGrammarPanel(filterTag = null) {
  grammarTopicFilter = filterTag;
  grammarPage = 0;
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
  hideRecallSpecificEls();
  aiPanel.style.display = "none";
  document.getElementById("progress-panel").style.display = "none";
  document.getElementById("vocab-panel").style.display = "none";
  document.getElementById("grammar-panel").style.display = "flex";
  renderGrammarTab(filterTag);
}

function renderSatzbauBreakdown(parts) {
  return `<div class="satzbau-breakdown">${parts.map(p =>
    p.text === "," ? `<span style="align-self:center;color:var(--text-dim);font-size:1rem">,</span>` :
    `<div class="satz-part ${p.pos}">
      <span class="satz-text">${p.text}</span>
      ${p.label ? `<span class="satz-label">${p.label}</span>` : ""}
    </div>`
  ).join("")}</div>`;
}

function renderGrammarTable({ headers, rows }) {
  const headerCells = headers.map(h => `<th>${h}</th>`).join("");
  const bodyRows = rows.map(row =>
    `<tr>${row.map((cell, i) => i === 0 ? `<td class="gt-table-label">${cell}</td>` : `<td>${cell}</td>`).join("")}</tr>`
  ).join("");
  return `<table class="gt-table"><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>`;
}

function renderGrammarTab(filterTag = null) {
  const topics = filterTag
    ? GRAMMAR_TOPICS.filter(t => filterTag.startsWith(t.id) || t.id === filterTag)
    : GRAMMAR_TOPICS;
  const list = document.getElementById("grammar-list");
  if (!topics.length) {
    list.innerHTML = `<div class="prog-empty">No grammar topic found for "${filterTag}".</div>`;
    return;
  }
  const totalPages = Math.ceil(topics.length / GRAM_PAGE_SIZE);
  grammarPage = Math.min(grammarPage, totalPages - 1);
  const page = topics.slice(grammarPage * GRAM_PAGE_SIZE, (grammarPage + 1) * GRAM_PAGE_SIZE);
  list.innerHTML = page.map(topic => {
    const examples = topic.ids.map(id => PHRASES.find(p => p.id === id)).filter(Boolean);
    return `
      <div class="grammar-topic">
        <div class="gt-header">${topic.title}</div>
        <div class="gt-rule">${topic.rule}</div>
        ${topic.table ? renderGrammarTable(topic.table) : ""}
        <div class="gt-examples">
          ${examples.slice(0, 4).map(p => {
            const bd = topic.breakdown && topic.breakdown.find(b => b.phraseId === p.id);
            return `<div class="gt-example" onclick="practiceNow(${p.id})">
              ${bd ? renderSatzbauBreakdown(bd.parts) : `<div class="gt-german">${p.german}</div>`}
              <div class="gt-english">${p.english}</div>
            </div>`;
          }).join("")}
        </div>
        <div class="gt-footer-btns">
          <button class="prog-btn gt-explain-btn" data-topic-id="${topic.id}" data-topic-title="${topic.title}">Ask AI to explain deeper ›</button>
          <button class="prog-btn gt-drill-btn" onclick="openDrillMode('${topic.id}')">Drill this rule</button>
        </div>
      </div>`;
  }).join("") + paginationHTML(grammarPage, topics.length, GRAM_PAGE_SIZE, "prevGrammarPage", "nextGrammarPage");

  document.querySelectorAll(".gt-explain-btn").forEach(btn => {
    btn.addEventListener("click", () => explainGrammar(btn.dataset.topicId, btn.dataset.topicTitle, btn));
  });
}

function prevGrammarPage() { grammarPage = Math.max(0, grammarPage - 1); renderGrammarTab(grammarTopicFilter); document.getElementById("grammar-list").scrollIntoView({ behavior: "smooth", block: "start" }); }
function nextGrammarPage() { grammarPage++; renderGrammarTab(grammarTopicFilter); document.getElementById("grammar-list").scrollIntoView({ behavior: "smooth", block: "start" }); }

async function explainGrammar(topicId, topicTitle, btn) {
  btn.textContent = "Loading...";
  btn.disabled = true;
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "grammar", text: topicTitle }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Server error");
    const expDiv = document.createElement("div");
    expDiv.className = "gt-ai-explanation";
    expDiv.textContent = data.explanation || "No explanation returned.";
    btn.parentElement.insertBefore(expDiv, btn);
    btn.remove();
  } catch (err) {
    btn.textContent = "Error - try again";
    btn.disabled = false;
  }
}

function openGrammarTopic(tagId) {
  mode = "grammar";
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.mode === "grammar"));
  showGrammarPanel(tagId);
}

// ---- Conversation Chat ----

function initChat() {
  // Teacher mode buttons
  document.querySelectorAll(".teacher-btn").forEach(btn => {
    if (btn.dataset.mode === teacherMode) btn.classList.add("active");
    else btn.classList.remove("active");
    btn.addEventListener("click", () => {
      teacherMode = btn.dataset.mode;
      localStorage.setItem("teacherMode", teacherMode);
      document.querySelectorAll(".teacher-btn").forEach(b => b.classList.toggle("active", b === btn));
    });
  });

  // Language level
  const levelSel = document.getElementById("chat-level-select");
  if (levelSel) {
    levelSel.value = languageLevel;
    levelSel.addEventListener("change", (e) => {
      languageLevel = e.target.value;
      localStorage.setItem("languageLevel", languageLevel);
    });
  }

  checkDeepgramAvailability().then(() => setupChatSpeech());
  renderChatMessages(); // show start prompt, no greeting fired yet

  document.getElementById("chat-scenario-select").addEventListener("change", (e) => {
    stopChatSession();
    startConversation(e.target.value || null);
  });
  document.getElementById("chat-new-btn").addEventListener("click", () => {
    stopChatSession();
    startConversation(document.getElementById("chat-scenario-select").value || null);
  });
  document.getElementById("chat-history-btn").addEventListener("click", showChatHistory);
  document.getElementById("chat-history-close").addEventListener("click", () => {
    document.getElementById("chat-history-panel").style.display = "none";
  });
  document.getElementById("chat-hint-btn").addEventListener("click", requestHint);
  document.getElementById("chat-send-btn").addEventListener("click", () => {
    const text = document.getElementById("chat-input").value.trim();
    if (text) sendConvoMessage(text);
  });
  document.getElementById("chat-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const text = document.getElementById("chat-input").value.trim();
      if (text) sendConvoMessage(text);
    }
  });
  document.getElementById("chat-mic-btn").addEventListener("click", () => {
    unlockAudio();
    if (chatSessionActive) stopChatSession();
    else startChatSession();
  });
}

function setupChatSpeech() {
  if (deepgramAvailable) return; // Deepgram handles STT

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { document.getElementById("chat-mic-btn").style.display = "none"; return; }

  const sttLabel = document.getElementById("chat-stt-mode");
  if (sttLabel) sttLabel.textContent = "Browser mic";

  chatRecognition = new SR();
  chatRecognition.continuous = true;
  chatRecognition.interimResults = true;
  chatRecognition.lang = "de-DE";

  let silenceTimer = null;
  let finalTranscript = "";

  chatRecognition.onstart = () => {
    chatIsRecording = true;
    finalTranscript = "";
    document.getElementById("chat-mic-btn").classList.add("recording");
    setChatVoiceStatus("Listening...");
    setChatInterim("");
  };
  chatRecognition.onresult = (e) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) finalTranscript += e.results[i][0].transcript;
      else interim += e.results[i][0].transcript;
    }
    setChatInterim(finalTranscript + interim);
    clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
      chatRecognition.stop();
    }, 1800);
  };
  chatRecognition.onerror = () => {
    chatIsRecording = false;
    clearTimeout(silenceTimer);
    document.getElementById("chat-mic-btn").classList.remove("recording");
    setChatVoiceStatus("");
    setChatInterim("");
  };
  chatRecognition.onend = () => {
    chatIsRecording = false;
    clearTimeout(silenceTimer);
    document.getElementById("chat-mic-btn").classList.remove("recording");
    setChatVoiceStatus("");
    setChatInterim("");
    const text = finalTranscript.trim();
    if (text) {
      document.getElementById("chat-input").value = text;
      sendConvoMessage(text);
    }
    finalTranscript = "";
  };
}

// ---- Audio unlock (required on mobile before programmatic play) ----

function unlockAudio() {
  if (audioContextUnlocked) return;
  const silent = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=");
  silent.play().then(() => { audioContextUnlocked = true; }).catch(() => {});
}

// ---- Conversation session ----

function startChatSession() {
  chatSessionActive = true;
  updateMicBtnState("session");
  startListening();
}

function stopChatSession() {
  chatSessionActive = false;
  if (chatCurrentAudio) { chatCurrentAudio.pause(); chatCurrentAudio = null; }
  if (chatIsRecording) {
    if (deepgramAvailable) stopDeepgramRecording();
    else if (chatRecognition) chatRecognition.stop();
  }
  updateMicBtnState("idle");
}

function startListening() {
  if (!chatSessionActive || chatIsRecording) return;
  updateMicBtnState("listening");
  if (deepgramAvailable) startDeepgramRecording();
  else if (chatRecognition) chatRecognition.start();
}

function updateMicBtnState(state) {
  const btn = document.getElementById("chat-mic-btn");
  const label = document.getElementById("chat-mic-label");
  if (!btn) return;
  btn.classList.remove("recording", "ai-speaking");
  switch (state) {
    case "idle":
      btn.disabled = false;
      if (label) label.textContent = "Tap to start";
      break;
    case "session":
      btn.disabled = false;
      if (label) label.textContent = "Tap to stop";
      break;
    case "listening":
      btn.disabled = false;
      btn.classList.add("recording");
      if (label) label.textContent = "Listening...";
      break;
    case "speaking":
      btn.disabled = false;
      btn.classList.add("ai-speaking");
      if (label) label.textContent = "AI speaking...";
      break;
    case "processing":
      btn.disabled = true;
      if (label) label.textContent = "Processing...";
      break;
  }
}

function playChatResponse(base64, text) {
  if (!base64) {
    if (text && window.speechSynthesis) {
      updateMicBtnState("speaking");
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "de-DE";
      utter.rate = 0.9;
      utter.onend = () => {
        setChatVoiceStatus("");
        if (chatSessionActive) startListening();
        else updateMicBtnState("idle");
      };
      window.speechSynthesis.speak(utter);
    } else {
      if (chatSessionActive) startListening();
    }
    return;
  }
  updateMicBtnState("speaking");
  chatCurrentAudio = new Audio(`data:audio/mp3;base64,${base64}`);
  chatCurrentAudio.onended = () => {
    chatCurrentAudio = null;
    setChatVoiceStatus("");
    if (chatSessionActive) startListening();
    else updateMicBtnState("idle");
  };
  chatCurrentAudio.play().catch(() => {
    chatCurrentAudio = null;
    if (chatSessionActive) startListening();
    else updateMicBtnState("idle");
  });
}

async function checkDeepgramAvailability() {
  try {
    const res = await fetch("/api/deepgram-token", { method: "POST" });
    if (res.ok) {
      deepgramAvailable = true;
      const sttLabel = document.getElementById("chat-stt-mode");
      if (sttLabel) sttLabel.textContent = "Deepgram";
    }
  } catch {
    deepgramAvailable = false;
  }
}

async function startDeepgramRecording() {
  if (chatIsRecording) return;
  try {
    const tokenRes = await fetch("/api/deepgram-token", { method: "POST" });
    if (!tokenRes.ok) throw new Error("Token fetch failed");
    const { key } = await tokenRes.json();

    deepgramStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const url = `wss://api.deepgram.com/v1/listen?language=multi&model=nova-2-general&interim_results=true&utterance_end_ms=1500&endpointing=600&vad_events=true&encoding=linear16&sample_rate=16000`;
    deepgramWS = new WebSocket(url, ["token", key]);

    deepgramWS.onopen = () => {
      chatIsRecording = true;
      document.getElementById("chat-mic-btn").classList.add("recording");
      setChatVoiceStatus("Listening...");
      setChatInterim("");

      deepgramRecorder = new MediaRecorder(deepgramStream, { mimeType: "audio/webm;codecs=opus" });
      deepgramRecorder.ondataavailable = (e) => {
        if (deepgramWS.readyState === WebSocket.OPEN && e.data.size > 0) {
          deepgramWS.send(e.data);
        }
      };
      deepgramRecorder.start(100);
    };

    let interimText = "";
    deepgramWS.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === "Results") {
        const transcript = msg.channel?.alternatives?.[0]?.transcript || "";
        if (msg.is_final) {
          interimText = "";
          if (transcript.trim()) {
            stopDeepgramRecording(transcript.trim());
          }
        } else {
          interimText = transcript;
          setChatInterim(interimText);
        }
      } else if (msg.type === "UtteranceEnd") {
        // Deepgram detected end of utterance - stop if we have text
        if (interimText.trim()) {
          stopDeepgramRecording(interimText.trim());
        }
      }
    };

    deepgramWS.onerror = () => stopDeepgramRecording();
    deepgramWS.onclose = () => {
      if (chatIsRecording) stopDeepgramRecording();
    };
  } catch (err) {
    console.error("[deepgram]", err.message);
    deepgramAvailable = false;
    setupChatSpeech();
  }
}

function stopDeepgramRecording(finalText) {
  chatIsRecording = false;
  document.getElementById("chat-mic-btn").classList.remove("recording");
  setChatVoiceStatus("");
  setChatInterim("");

  if (deepgramRecorder && deepgramRecorder.state !== "inactive") deepgramRecorder.stop();
  if (deepgramWS) { deepgramWS.close(); deepgramWS = null; }
  if (deepgramStream) { deepgramStream.getTracks().forEach(t => t.stop()); deepgramStream = null; }
  deepgramRecorder = null;

  if (finalText) {
    document.getElementById("chat-input").value = finalText;
    sendConvoMessage(finalText);
  }
}

function setChatInterim(text) {
  let el = document.getElementById("chat-interim");
  if (!text) { if (el) el.remove(); return; }
  if (!el) {
    el = document.createElement("div");
    el.id = "chat-interim";
    el.className = "chat-interim-text";
    const statusRow = document.getElementById("chat-voice-status-row");
    statusRow.parentNode.insertBefore(el, statusRow);
  }
  el.textContent = text;
}

function setChatVoiceStatus(text) {
  const el = document.getElementById("chat-voice-status");
  if (el) el.textContent = text;
}

function setChatMicEnabled(enabled) {
  const btn = document.getElementById("chat-mic-btn");
  if (btn) btn.disabled = !enabled;
}

function beginConversation() {
  startConversation(document.getElementById("chat-scenario-select")?.value || null);
}

function startConversation(scenarioKey) {
  convoScenario = scenarioKey || null;
  convoHistory = [];
  convoMessages = [];
  repetitionContext = null;
  convoSessionId = Date.now().toString();
  document.getElementById("chat-hint-area").style.display = "none";
  document.getElementById("chat-history-panel").style.display = "none";

  renderChatGoal();
  renderChatMessages();
  showChatTyping(true);
  fetchAIGreeting();
}

async function fetchAIGreeting() {
  setChatMicEnabled(false);
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "greeting", scenario: convoScenario, teacherMode, languageLevel }),
    });
    const data = await res.json();
    showChatTyping(false);
    if (!res.ok) throw new Error(data.error || "Server error");

    convoMessages.push({ role: "assistant", text: data.reply, correction: null, audio_base64: data.audio_base64 || null, timestamp: new Date().toISOString() });
    convoHistory.push({ role: "assistant", content: data.reply });

    renderChatMessages();
    scrollChatToBottom();
    if (data.audio_base64) {
      const audio = new Audio(`data:audio/mp3;base64,${data.audio_base64}`);
      audio.play().catch(() => {});
    } else {
      speakGerman(data.reply);
    }
  } catch {
    showChatTyping(false);
    renderChatMessages();
  } finally {
    setChatMicEnabled(true);
    updateMicBtnState("idle");
  }
}

async function sendConvoMessage(text) {
  if (!text.trim()) return;
  document.getElementById("chat-input").value = "";
  document.getElementById("chat-hint-area").style.display = "none";

  const userMsg = { role: "user", text: text.trim(), correction: null, audio_base64: null, timestamp: new Date().toISOString() };
  convoMessages.push(userMsg);
  convoHistory.push({ role: "user", content: text.trim() });

  const pendingRepetition = repetitionContext;
  repetitionContext = null;
  renderChatMessages();
  scrollChatToBottom();
  showChatTyping(true);
  updateMicBtnState("processing");

  try {
    const body = { mode: "convo", text: text.trim(), history: convoHistory.slice(-20), scenario: convoScenario, teacherMode, languageLevel };
    if (pendingRepetition) body.awaitingRepetition = pendingRepetition;
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Server error");
    showChatTyping(false);

    convoMessages[convoMessages.length - 1].correction = data.correction || null;
    convoMessages.push({ role: "assistant", text: data.reply, correction: null, needs_repetition: data.needs_repetition || false, audio_base64: data.audio_base64 || null, timestamp: new Date().toISOString() });
    convoHistory.push({ role: "assistant", content: data.reply });

    if (data.needs_repetition && data.correction) {
      repetitionContext = { corrected: data.correction.corrected, original: data.correction.original };
    }

    renderChatMessages();
    scrollChatToBottom();
    playChatResponse(data.audio_base64 || null, data.reply);
    saveConvoSession();
  } catch (err) {
    showChatTyping(false);
    updateMicBtnState(chatSessionActive ? "session" : "idle");
    convoMessages.push({ role: "assistant", text: `Error: ${err.message}`, correction: null, needs_repetition: false, audio_base64: null, timestamp: new Date().toISOString() });
    renderChatMessages();
    scrollChatToBottom();
  }
}

async function requestHint() {
  const hintArea = document.getElementById("chat-hint-area");
  const hintChips = document.getElementById("chat-hint-chips");
  hintChips.innerHTML = `<span class="hint-loading">Getting ideas...</span>`;
  hintArea.style.display = "block";
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "hint", text: "hint", history: convoHistory.slice(-6), scenario: convoScenario }),
    });
    const data = await res.json();
    const hints = Array.isArray(data.hints) ? data.hints : [];
    hintChips.innerHTML = hints.map(h =>
      `<button class="hint-chip" onclick="selectHint(this, '${h.replace(/'/g, "\\'")}')">${h}</button>`
    ).join("");
  } catch {
    hintChips.innerHTML = `<span class="hint-loading">Could not get hints.</span>`;
  }
}

function selectHint(btn, hintText) {
  document.querySelectorAll(".hint-chip").forEach(c => c.classList.remove("selected"));
  btn.classList.add("selected");
  document.getElementById("chat-hint-chips").insertAdjacentHTML("beforeend",
    `<div class="hint-selected-note">Idea: "${hintText}" — write this in German below</div>`
  );
}

function renderChatMessages() {
  const container = document.getElementById("chat-messages");
  if (!convoMessages.length) {
    const hasScenario = convoScenario && SCENARIOS[convoScenario];
    const scenarioLabel = hasScenario ? SCENARIOS[convoScenario].title : null;
    container.innerHTML = `
      <div class="chat-start-prompt">
        <div class="chat-start-title">Ready to practice German?</div>
        <div class="chat-start-sub">${scenarioLabel ? `Scenario: ${scenarioLabel}` : "Free conversation with your AI teacher"}</div>
        <button class="chat-start-btn" onclick="beginConversation()">Start Conversation</button>
      </div>`;
    return;
  }
  const msgsHtml = convoMessages.map((msg, idx) => {
    const isUser = msg.role === "user";
    const corrHtml = msg.correction
      ? `<div class="chat-correction">
           <span class="corr-de">${msg.correction.corrected}</span>
           <span class="corr-en">${msg.correction.explanation}</span>
         </div>`
      : "";
    const audioBtn = !isUser && msg.audio_base64
      ? `<button class="chat-play-btn" onclick="playChatAudio(${idx})">&#9654;</button>`
      : "";
    const autoTags = !isUser ? getAutoTags(msg.text) : [];
    const grammarChipsHtml = autoTags.length
      ? `<div class="chat-grammar-chips">${autoTags.map(t => `<span class="grammar-chip chat-chip" onclick="openGrammarTopic('${t}')">${t}</span>`).join("")}</div>`
      : "";
    return `<div class="chat-row ${isUser ? "user-row" : "ai-row"}">
      <div class="chat-bubble ${isUser ? "user-bubble" : "ai-bubble"}">
        <div class="chat-text">${msg.text}</div>
        ${audioBtn}
      </div>
      ${corrHtml}
      ${grammarChipsHtml}
    </div>`;
  }).join("");

  const repeatCardHtml = repetitionContext
    ? `<div class="chat-repeat-card">
         <div class="repeat-label">Say it in German</div>
         <div class="repeat-target">${repetitionContext.corrected}</div>
         <div class="repeat-actions">
           <button class="repeat-hear-btn" onclick="hearRepetitionTarget()">&#9654; Hear it</button>
           <button class="repeat-skip-btn" onclick="skipRepetition()">Skip &rarr;</button>
         </div>
       </div>`
    : "";

  container.innerHTML = msgsHtml + repeatCardHtml;
}

function playChatAudio(idx) {
  const msg = convoMessages[idx];
  playBase64Audio(msg?.audio_base64, msg?.text);
}

function hearRepetitionTarget() {
  if (repetitionContext?.corrected) speakGerman(repetitionContext.corrected);
}

function skipRepetition() {
  if (!repetitionContext) return;
  repetitionContext = null;
  // Advance history context so the AI doesn't keep asking for the same repetition
  convoHistory.push({ role: "user", content: "(skipping correction - let's continue)" });
  convoHistory.push({ role: "assistant", content: "Kein Problem, lass uns weitermachen!" });
  renderChatMessages();
}

function scrollChatToBottom() {
  const el = document.getElementById("chat-messages");
  el.scrollTop = el.scrollHeight;
}

function showChatTyping(show) {
  document.getElementById("chat-typing").style.display = show ? "block" : "none";
  if (show) scrollChatToBottom();
}

function renderChatGoal() {
  const banner = document.getElementById("chat-goal-banner");
  if (convoScenario && SCENARIOS[convoScenario]) {
    banner.style.display = "flex";
    document.getElementById("chat-goal-text").textContent = `Goal: ${SCENARIOS[convoScenario].goal}`;
  } else {
    banner.style.display = "none";
  }
}

function saveConvoSession() {
  if (convoMessages.length < 2) return;
  const sessions = JSON.parse(localStorage.getItem("convo_sessions") || "[]");
  const idx = sessions.findIndex(s => s.id === convoSessionId);
  const session = {
    id: convoSessionId,
    date: new Date().toISOString().split("T")[0],
    title: convoScenario && SCENARIOS[convoScenario] ? SCENARIOS[convoScenario].title : "Free Chat",
    scenarioKey: convoScenario,
    messages: convoMessages.map(m => ({ role: m.role, text: m.text, correction: m.correction || null })),
  };
  if (idx >= 0) sessions[idx] = session;
  else sessions.unshift(session);
  localStorage.setItem("convo_sessions", JSON.stringify(sessions.slice(0, 20)));
}

function showChatHistory() {
  const panel = document.getElementById("chat-history-panel");
  const list = document.getElementById("chat-history-list");
  const sessions = JSON.parse(localStorage.getItem("convo_sessions") || "[]");
  if (!sessions.length) {
    list.innerHTML = `<div class="prog-empty">No past conversations yet.</div>`;
  } else {
    list.innerHTML = sessions.map((s, i) => {
      const corrections = s.messages.filter(m => m.correction).length;
      return `<div class="history-item" onclick="loadConvoSession(${i})">
        <div class="history-title">${s.title}</div>
        <div class="history-meta">${s.date} &middot; ${s.messages.length} messages${corrections ? ` &middot; ${corrections} corrections` : ""}</div>
      </div>`;
    }).join("");
  }
  panel.style.display = "flex";
}

function loadConvoSession(idx) {
  const sessions = JSON.parse(localStorage.getItem("convo_sessions") || "[]");
  const s = sessions[idx];
  if (!s) return;
  convoSessionId = s.id;
  convoScenario = s.scenarioKey;
  convoHistory = s.messages.map(m => ({ role: m.role, content: m.text }));
  convoMessages = s.messages.map(m => ({ ...m, audio_base64: null }));
  document.getElementById("chat-scenario-select").value = s.scenarioKey || "";
  document.getElementById("chat-history-panel").style.display = "none";
  renderChatGoal();
  renderChatMessages();
  scrollChatToBottom();
}

// ---- AI Mini-Player ----

function openMiniPlayer() {
  const saved = JSON.parse(localStorage.getItem("ai_phrases") || "[]");
  if (!saved.length) return;
  miniPhrases = [...saved];
  miniIndex = 0;
  miniRevealed = false;
  document.getElementById("ai-saved-section").style.display = "none";
  document.getElementById("ai-mini-player").style.display = "flex";
  renderMiniCard();
}

function closeMiniPlayer() {
  document.getElementById("ai-mini-player").style.display = "none";
  document.getElementById("ai-saved-section").style.display = "flex";
  if (aiAudio) aiAudio.pause();
}

function renderMiniCard() {
  miniRevealed = false;
  const p = miniPhrases[miniIndex];
  const total = miniPhrases.length;

  document.getElementById("mini-count").textContent = `${miniIndex + 1} / ${total}`;
  document.getElementById("mini-english").textContent = p.english;
  document.getElementById("mini-german").textContent = p.german;
  document.getElementById("mini-german").style.display = "none";
  document.getElementById("mini-hint").style.display = "block";
  document.getElementById("mini-player-btns").style.display = "none";
  document.getElementById("mini-replay-btn").style.display = "none";
  document.getElementById("mini-no-audio").style.display = "none";
  document.getElementById("mini-category").textContent = CATEGORIES[p.category] || p.category;
}

function miniRevealCard() {
  miniRevealed = true;
  const p = miniPhrases[miniIndex];
  document.getElementById("mini-german").style.display = "block";
  document.getElementById("mini-hint").style.display = "none";
  document.getElementById("mini-player-btns").style.display = "flex";

  document.getElementById("mini-replay-btn").style.display = "inline-flex";
  playBase64Audio(p.audio_base64, p.german);
}

function miniAdvance() {
  if (miniIndex < miniPhrases.length - 1) {
    miniIndex++;
    renderMiniCard();
  } else {
    // End of deck
    document.getElementById("mini-german").style.display = "none";
    document.getElementById("mini-hint").style.display = "none";
    document.getElementById("mini-player-btns").style.display = "none";
    document.getElementById("mini-replay-btn").style.display = "none";
    document.getElementById("mini-no-audio").style.display = "none";
    document.getElementById("mini-english").textContent = "All done!";
    document.getElementById("mini-count").textContent = `${miniPhrases.length} / ${miniPhrases.length}`;
    document.getElementById("mini-category").textContent = "";
  }
}

// ---- Words Mode ----

function loadWordsSRS() {
  wordsSRS = JSON.parse(localStorage.getItem("wordsSRS") || "{}");
}

function saveWordsSRS() {
  localStorage.setItem("wordsSRS", JSON.stringify(wordsSRS));
}

function getWordRecord(id) {
  return wordsSRS[String(id)] || {
    interval: 0, easeFactor: 2.5, dueDate: null,
    lastReviewed: null, totalReviews: 0, totalCorrect: 0,
  };
}

function isWordDue(id) {
  const r = getWordRecord(id);
  return r.dueDate === null || r.dueDate <= todayStr();
}

function getWordStatus(id) {
  const r = getWordRecord(id);
  if (!r.dueDate) return "new";
  if (r.interval >= 21) return "mastered";
  if (isWordDue(id)) return "due";
  return "upcoming";
}

function updateWordSRS(id, rating) {
  const r = getWordRecord(id);
  let interval = r.interval;
  let ef = r.easeFactor;

  if (rating === "miss") {
    interval = 1;
    ef = Math.max(1.3, ef - 0.2);
  } else if (rating === "hard") {
    interval = Math.max(1, interval === 0 ? 1 : Math.round(interval * 1.2));
    ef = Math.max(1.3, ef - 0.15);
  } else if (rating === "good") {
    if (interval === 0) interval = 1;
    else if (interval === 1) interval = 3;
    else interval = Math.round(interval * ef);
  } else if (rating === "easy") {
    if (interval === 0) interval = 3;
    else if (interval === 1) interval = 4;
    else interval = Math.round(interval * ef * 1.3);
    ef = Math.min(3.0, ef + 0.1);
  }

  const due = new Date();
  due.setDate(due.getDate() + interval);
  wordsSRS[String(id)] = {
    ...r,
    interval,
    easeFactor: ef,
    dueDate: due.toISOString().split("T")[0],
    lastReviewed: todayStr(),
    totalReviews: r.totalReviews + 1,
    totalCorrect: r.totalCorrect + (rating !== "miss" ? 1 : 0),
  };
  saveWordsSRS();
}

function buildWordsQueue() {
  const tierVal = document.getElementById("word-tier-select").value;
  const posVal = document.getElementById("word-pos-filter").value;

  let source = (typeof WORDS !== "undefined" ? WORDS : []);
  if (tierVal !== "all") source = source.filter(w => w.tier === parseInt(tierVal));
  if (posVal !== "all") source = source.filter(w => w.pos === posVal);

  if (wordsShuffled) {
    // Shuffle within due/new and upcoming groups separately to keep priority
    const dueGroup = source.filter(w => isWordDue(w.id));
    const upcomingGroup = source.filter(w => !isWordDue(w.id));
    source = [
      ...dueGroup.sort(() => Math.random() - 0.5),
      ...upcomingGroup.sort(() => Math.random() - 0.5),
    ];
  } else {
    source = [...source].sort((a, b) => {
      const aDue = isWordDue(a.id) ? 0 : 1;
      const bDue = isWordDue(b.id) ? 0 : 1;
      if (aDue !== bDue) return aDue - bDue;
      return a.tier - b.tier || a.id - b.id;
    });
  }

  wordsQueue = source;
  wordsIndex = 0;
}

function updateWordsStatsBar() {
  const source = typeof WORDS !== "undefined" ? WORDS : [];
  let mastered = 0, due = 0;
  for (const w of source) {
    const st = getWordStatus(w.id);
    if (st === "mastered") mastered++;
    else if (st === "due" || st === "new") due++;
  }
  document.getElementById("words-mastered-count").textContent = `${mastered} mastered`;
  document.getElementById("words-due-count").textContent = `${due} due`;
  document.getElementById("words-total-count").textContent = `/ ${source.length}`;

  const sessionEl = document.getElementById("words-session-stats");
  if (wordsSessionTotal > 0) {
    const pct = Math.round((wordsSessionCorrect / wordsSessionTotal) * 100);
    sessionEl.textContent = `${wordsSessionCorrect}/${wordsSessionTotal} (${pct}%)`;
    sessionEl.style.display = "inline";
  } else {
    sessionEl.style.display = "none";
  }
}

const WORD_POS_LABELS = {
  verb: "Verb", noun: "Nomen", adj: "Adj.", adv: "Adv.",
  prep: "Präp.", conj: "Konj.", pron: "Pron.",
};

function renderWordCard() {
  if (!wordsQueue.length) {
    document.getElementById("word-card").innerHTML =
      `<div style="text-align:center;padding:24px;color:var(--text-dim)">No words match the current filter.</div>`;
    document.getElementById("word-position").textContent = "0 / 0";
    updateWordsStatsBar();
    return;
  }

  const w = wordsQueue[wordsIndex];
  wordRevealed = false;

  // Meta chips
  document.getElementById("word-tier-chip").textContent = `T${w.tier}`;
  const posBadge = document.getElementById("word-pos-badge");
  posBadge.textContent = WORD_POS_LABELS[w.pos] || w.pos;
  posBadge.className = `wpos-${w.pos}`;

  // SRS status chip
  const statusChip = document.getElementById("word-srs-status-chip");
  const wst = getWordStatus(w.id);
  statusChip.textContent = wst;
  statusChip.className = `srs-badge srs-${wst}`;
  statusChip.style.display = "inline-block";

  const mainRow = document.getElementById("word-main-row");
  const enPromptRow = document.getElementById("word-en-prompt-row");
  const sentenceDe = document.getElementById("word-sentence-de");

  if (wordsDirection === "de_en") {
    document.getElementById("word-article-el").textContent = w.article || "";
    document.getElementById("word-german-el").textContent = w.german;
    sentenceDe.innerHTML = w.example_de || "";
    mainRow.style.display = "flex";
    enPromptRow.style.display = "none";
    document.getElementById("word-tts-btn").style.display = "inline-block";
  } else {
    document.getElementById("word-en-prompt-el").textContent = w.english;
    sentenceDe.innerHTML = w.example_en ? `<em style="color:var(--text-dim)">${w.example_en}</em>` : "";
    mainRow.style.display = "none";
    enPromptRow.style.display = "flex";
    // TTS plays German - hide before reveal in production mode
    document.getElementById("word-tts-btn").style.display = "none";
  }

  // Mnemonic hint (useful in both directions for memory aid)
  const mnemonicEl = document.getElementById("word-mnemonic-el");
  const hintBtn = document.getElementById("word-hint-btn");
  if (w.mnemonic) {
    mnemonicEl.textContent = w.mnemonic;
    mnemonicEl.style.display = "none";
    hintBtn.style.display = "inline-block";
  } else {
    mnemonicEl.style.display = "none";
    hintBtn.style.display = "none";
  }

  document.getElementById("word-translation-area").style.display = "none";

  const mcChoices = document.getElementById("word-mc-choices");
  if (wordsMode === "mc") {
    document.getElementById("word-reveal-btn").style.display = "none";
    mcChoices.style.display = "flex";
    renderMCChoices(w);
  } else {
    document.getElementById("word-reveal-btn").style.display = "block";
    mcChoices.style.display = "none";
  }

  document.getElementById("word-position").textContent = `${wordsIndex + 1} / ${wordsQueue.length}`;
  updateWordsStatsBar();
}

function revealWordTranslation() {
  if (wordRevealed) return;
  wordRevealed = true;
  const w = wordsQueue[wordsIndex];

  if (wordsDirection === "de_en") {
    document.getElementById("word-english-el").textContent = w.english;
    document.getElementById("word-sentence-en-el").textContent = w.example_en || "";
  } else {
    // EN→DE: reveal the German word as the answer
    const answerText = w.article ? `${w.article} ${w.german}` : w.german;
    document.getElementById("word-english-el").textContent = answerText;
    document.getElementById("word-sentence-en-el").innerHTML = w.example_de || "";
    // Show TTS now that German is revealed
    document.getElementById("word-tts-btn").style.display = "inline-block";
  }

  document.getElementById("word-translation-area").style.display = "flex";
  document.getElementById("word-reveal-btn").style.display = "none";
}

function generateMCChoices(correctWord) {
  const all = typeof WORDS !== "undefined" ? WORDS : [];
  // Prefer same POS and tier for plausible distractors
  let pool = all.filter(w => w.id !== correctWord.id && w.pos === correctWord.pos && w.tier === correctWord.tier);
  if (pool.length < 3) pool = all.filter(w => w.id !== correctWord.id && w.pos === correctWord.pos);
  if (pool.length < 3) pool = all.filter(w => w.id !== correctWord.id);
  const distractors = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
  return [...distractors, correctWord].sort(() => Math.random() - 0.5);
}

function renderMCChoices(correctWord) {
  const choices = generateMCChoices(correctWord);
  const container = document.getElementById("word-mc-choices");
  container.innerHTML = choices.map(w => {
    const label = wordsDirection === "de_en"
      ? w.english
      : (w.article ? `${w.article} ${w.german}` : w.german);
    return `<button class="word-mc-btn" data-id="${w.id}" onclick="handleMCChoice(${w.id}, ${correctWord.id})">${label}</button>`;
  }).join("");
}

function handleMCChoice(selectedId, correctId) {
  document.querySelectorAll(".word-mc-btn").forEach(btn => {
    btn.disabled = true;
    const btnId = parseInt(btn.dataset.id);
    if (btnId === correctId) btn.classList.add("mc-correct");
    else if (btnId === selectedId) btn.classList.add("mc-wrong");
  });

  const isCorrect = selectedId === correctId;
  wordsSessionTotal++;
  if (isCorrect) wordsSessionCorrect++;
  updateWordSRS(correctId, isCorrect ? "good" : "miss");
  updateWordsStatsBar();

  setTimeout(() => {
    if (wordsIndex < wordsQueue.length - 1) {
      wordsIndex++;
    } else {
      buildWordsQueue();
    }
    renderWordCard();
  }, isCorrect ? 700 : 1400);
}

function handleWordSRS(rating) {
  if (!wordsQueue.length) return;
  const w = wordsQueue[wordsIndex];
  updateWordSRS(w.id, rating);
  wordsSessionTotal++;
  if (rating !== "miss") wordsSessionCorrect++;
  if (wordsIndex < wordsQueue.length - 1) {
    wordsIndex++;
  } else {
    buildWordsQueue();
  }
  renderWordCard();
}

function wordTTS() {
  if (!wordsQueue.length) return;
  const w = wordsQueue[wordsIndex];
  const text = w.example_de ? w.example_de.replace(/<[^>]+>/g, "") : w.german;
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "de-DE";
  utt.rate = 0.88;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utt);
}

function showWordsPanel() {
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
  hideRecallSpecificEls();
  aiPanel.style.display = "none";
  document.getElementById("progress-panel").style.display = "none";
  document.getElementById("vocab-panel").style.display = "none";
  document.getElementById("grammar-panel").style.display = "none";
  document.getElementById("words-panel").style.display = "flex";
  wordsSessionCorrect = 0;
  wordsSessionTotal = 0;
  buildWordsQueue();
  renderWordCard();
}

function initWordsPanel() {
  loadWordsSRS();

  document.getElementById("word-tier-select").addEventListener("change", () => {
    buildWordsQueue();
    renderWordCard();
  });
  document.getElementById("word-pos-filter").addEventListener("change", () => {
    buildWordsQueue();
    renderWordCard();
  });
  document.getElementById("word-reveal-btn").addEventListener("click", revealWordTranslation);
  document.getElementById("word-hint-btn").addEventListener("click", () => {
    const el = document.getElementById("word-mnemonic-el");
    el.style.display = el.style.display === "none" ? "block" : "none";
  });
  document.getElementById("word-tts-btn").addEventListener("click", wordTTS);
  document.getElementById("word-prev-btn").addEventListener("click", () => {
    if (wordsIndex > 0) { wordsIndex--; renderWordCard(); }
  });
  document.getElementById("word-next-btn").addEventListener("click", () => {
    if (wordsIndex < wordsQueue.length - 1) { wordsIndex++; renderWordCard(); }
  });

  document.getElementById("word-shuffle-btn").addEventListener("click", () => {
    wordsShuffled = !wordsShuffled;
    const btn = document.getElementById("word-shuffle-btn");
    btn.textContent = wordsShuffled ? "Shuffle ✓" : "Shuffle";
    btn.classList.toggle("active", wordsShuffled);
    buildWordsQueue();
    renderWordCard();
  });

  document.getElementById("word-dir-btn").addEventListener("click", () => {
    wordsDirection = wordsDirection === "de_en" ? "en_de" : "de_en";
    const btn = document.getElementById("word-dir-btn");
    btn.textContent = wordsDirection === "de_en" ? "DE→EN" : "EN→DE";
    btn.classList.toggle("active", wordsDirection === "en_de");
    renderWordCard();
  });

  document.getElementById("word-mc-btn").addEventListener("click", () => {
    wordsMode = wordsMode === "flashcard" ? "mc" : "flashcard";
    const btn = document.getElementById("word-mc-btn");
    btn.textContent = wordsMode === "mc" ? "MC ✓" : "MC";
    btn.classList.toggle("active", wordsMode === "mc");
    renderWordCard();
  });
}

// ---- Start ----
document.addEventListener("DOMContentLoaded", init);
