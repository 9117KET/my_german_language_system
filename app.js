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
  { id:"Perfekt", level:"a2", title:"Perfekt (Present Perfect)",
    rule:"haben/sein + Partizip II. Used for past events in spoken German.",
    ids:[1,5,8,12,17,34,66,69,90,173,175,179,184,191] },
  { id:"Präteritum", level:"b1", title:"Präteritum (Simple Past)",
    rule:"Common in writing and narratives. Key forms: war, hatte, ging, kam, sprach, sah, stand.",
    ids:[14,62,85,130,141,142,143,144,145,170] },
  { id:"Modal", level:"a2", title:"Modal Verbs (können, müssen, wollen...)",
    rule:"Modal verb in position 2, infinitive goes to the end. Konjunktiv II: könnte, müsste, etc.",
    ids:[2,9,21,25,28,63,64,104,150,168,169,171,174,178,181,185,188,190,193] },
  { id:"Relativsatz", level:"b1", title:"Relative Clauses (Relativsätze)",
    rule:"der/die/das matches the noun's gender. Verb goes to the end of the relative clause.",
    ids:[146,147,148,149,150] },
  { id:"Konjunktiv-II", level:"b2", title:"Konjunktiv II (Conditional)",
    rule:"würde + infinitive for hypotheticals. Polite requests. hätte/wäre for haben/sein.",
    ids:[38,82,86,129,155,156,157,158] },
  { id:"Passiv", level:"b2", title:"Passive Voice (Passiv)",
    rule:"werden + Partizip II. The focus shifts to the action, not the person doing it.",
    ids:[151,152,153,154] },
  { id:"Nebensatz", level:"b1", title:"Subordinate Clauses (weil, obwohl, nachdem, damit, dass, wenn)",
    rule:"The conjunction sends the verb to the very end of the clause. Main clause can come first or second.",
    ids:[15,20,37,39,52,54,97,159,160,161,162] },
  { id:"Futur-I", level:"a2", title:"Future Tense (Futur I)",
    rule:"werden + infinitive. Present tense + time expression also works (very common in spoken German).",
    ids:[163,164] },
  { id:"Plusquamperfekt", level:"b1", title:"Past Perfect (Plusquamperfekt)",
    rule:"hatte/war + Partizip II. Used for events that happened before another past event.",
    ids:[165,172] },
  { id:"Fragewort", level:"a1", title:"Question Words (Fragewörter)",
    rule:"Wer/Was/Wo/Woher/Wann/Wie/Warum — verb comes directly after the question word.",
    ids:[3,23,24,64,74,78,79,81,94,111,119,125,126,131,135,174,182,188,190,195] },
  { id:"Separierbar", level:"a2", title:"Separable Verbs (Trennbare Verben)",
    rule:"The prefix splits off to the end of the main clause. Common prefixes: ab-, an-, auf-, aus-, ein-, mit-, nach-, vor-, zurück-, aus-. In subordinate clauses the verb stays together.",
    ids:[117,171,175,176,180,181,183,184,187,190,193] },
  { id:"Reflexiv", level:"a2", title:"Reflexive Verbs (Reflexivverben)",
    rule:"Use a reflexive pronoun (mich/dich/sich/uns/euch) that refers back to the subject. Common verbs: sich anmelden, sich aufteilen, sich beeilen, sich fühlen, sich vorstellen.",
    ids:[57,127,136,169,171,188] },
  { id:"SatzbauAussage", level:"a1", title:"Satzbau: Aussagen — Verb always at Position 2",
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
  { id:"SatzbauWFrage", level:"a1", title:"Satzbau: W-Fragen — Question Word at Position 1",
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
  { id:"SatzbauJaNein", level:"a1", title:"Satzbau: Ja/Nein-Fragen — Verb at Position 1",
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
  { id:"TeKaMoLo", level:"a2", title:"TeKaMoLo — Time, Manner, Location Order",
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
  { id:"NebensatzVerb", level:"b1", title:"Nebensatz — Verb always at the End (7 Types)",
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
  { id:"DativAkkusativ", level:"b1", title:"Dativ & Akkusativ — Two Noun Objects (Dat. before Akk.)",
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
  { id:"PronomStellung", level:"b1", title:"Pronomen vor Nomen — Pronoun before Noun, Akk. before Dat.",
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
  { id:"AltVorNeu", level:"b2", title:"Alt vor Neu — Old Information before New",
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
  { id:"KasusAkkusativ", level:"a2", title:"Akkusativ — The Direct Object (wen? / was?)",
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
  { id:"KasusDativ", level:"a2", title:"Dativ — The Indirect Object (wem?)",
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
  { id:"PräpAkk", level:"b1", title:"Präpositionen mit Akkusativ (durch / für / gegen / ohne / um)",
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
  { id:"PräpDat", level:"b1", title:"Präpositionen mit Dativ (aus / bei / mit / nach / seit / von / zu)",
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
  { id:"Wechselpräp", level:"b1", title:"Wechselpräpositionen — Wo? (Dativ) vs. Wohin? (Akkusativ)",
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
  { id:"VerbAkk", level:"b1", title:"Verben mit Akkusativ — Wen? / Was?",
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
  { id:"VerbDat", level:"b1", title:"Verben mit Dativ — Wem?",
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
  { id:"VerbDatAkk", level:"b1", title:"Verben mit Dativ + Akkusativ — Wem? Was?",
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
  { id:"Genitiv", level:"b2", title:"Genitiv — Possession and Belonging (wessen?)",
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
  { id:"GenitPräp", level:"b2", title:"Genitivpräpositionen — Prepositions with Genitive",
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
  { id:"AdjektivEndungen", level:"b2", title:"Adjektivendungen — After Definite & Indefinite Articles",
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
  { id:"AdjektivStark", level:"b2", title:"Adjektivendungen ohne Artikel — Strong Endings",
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
  { id:"FestAusdrücke", level:"b2", title:"Feste Ausdrücke — Verb + Präposition + Kasus",
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

const STARTER_CATEGORIES = {
  all: "All", classroom: "Classroom", clarification: "Clarification",
  answering: "Answering", social: "Social", escape: "Buy Time",
};

const STARTERS = [
  // Classroom
  { id:1,  cat:"classroom",     german:"Darf ich eine Frage stellen?",                              english:"May I ask a question?",                               example:"Darf ich eine Frage zur letzten Aufgabe stellen?",              level:"a2" },
  { id:2,  cat:"classroom",     german:"Ich hätte eine Frage zu...",                                english:"I have a question about...",                           example:"Ich hätte eine Frage zu dem Text aus Lektion 3.",               level:"b1" },
  { id:3,  cat:"classroom",     german:"Könnten Sie das bitte erklären?",                           english:"Could you please explain that?",                        example:"Könnten Sie das bitte noch einmal erklären?",                  level:"a2" },
  { id:4,  cat:"classroom",     german:"Was meinen Sie genau mit...?",                              english:"What exactly do you mean by...?",                       example:"Was meinen Sie genau mit 'Dativ-Ergänzung'?",                  level:"b1" },
  { id:5,  cat:"classroom",     german:"Darf ich kurz nachfragen?",                                english:"May I quickly follow up?",                             example:"",                                                            level:"b1" },
  { id:6,  cat:"classroom",     german:"Gilt das auch für...?",                                    english:"Does that also apply to...?",                          example:"Gilt das auch für trennbare Verben?",                          level:"b1" },
  { id:7,  cat:"classroom",     german:"Ich bin nicht sicher, ob ich das richtig verstanden habe.", english:"I'm not sure if I understood that correctly.",         example:"",                                                            level:"b1" },
  { id:8,  cat:"classroom",     german:"Können wir kurz bei diesem Punkt bleiben?",                english:"Can we stay on this point for a moment?",              example:"",                                                            level:"b2" },
  { id:9,  cat:"classroom",     german:"Wie lautet die Aufgabenstellung?",                         english:"What is the task?",                                    example:"",                                                            level:"a2" },
  { id:10, cat:"classroom",     german:"Ich verstehe die Aufgabe nicht ganz.",                     english:"I don't quite understand the task.",                    example:"",                                                            level:"a2" },
  { id:11, cat:"classroom",     german:"Könnte ich bitte ein Beispiel haben?",                     english:"Could I please have an example?",                       example:"",                                                            level:"a2" },
  { id:12, cat:"classroom",     german:"Ich habe eine kurze Anmerkung dazu.",                      english:"I have a brief comment on that.",                       example:"",                                                            level:"b2" },
  // Clarification
  { id:20, cat:"clarification", german:"Könnten Sie das bitte wiederholen?",                       english:"Could you please repeat that?",                         example:"",                                                            level:"a1" },
  { id:21, cat:"clarification", german:"Ich habe das nicht ganz verstanden.",                      english:"I didn't quite understand that.",                       example:"",                                                            level:"a1" },
  { id:22, cat:"clarification", german:"Entschuldigung, was bedeutet...?",                         english:"Excuse me, what does ... mean?",                        example:"Entschuldigung, was bedeutet 'Wechselpräposition'?",           level:"a1" },
  { id:23, cat:"clarification", german:"Könnten Sie das bitte langsamer sagen?",                   english:"Could you please say that more slowly?",                example:"",                                                            level:"a1" },
  { id:24, cat:"clarification", german:"Wie schreibt man das?",                                    english:"How do you write/spell that?",                          example:"",                                                            level:"a1" },
  { id:25, cat:"clarification", german:"Was ist der Unterschied zwischen ... und ...?",            english:"What is the difference between ... and ...?",          example:"Was ist der Unterschied zwischen 'weil' und 'denn'?",          level:"a2" },
  { id:26, cat:"clarification", german:"Ich glaube, ich habe das falsch verstanden.",              english:"I think I misunderstood that.",                         example:"",                                                            level:"b1" },
  { id:27, cat:"clarification", german:"Meinen Sie damit, dass...?",                               english:"Do you mean that...?",                                 example:"Meinen Sie damit, dass das Verb immer an zweiter Stelle steht?", level:"b1" },
  { id:28, cat:"clarification", german:"Könnten Sie das bitte an einem Beispiel zeigen?",          english:"Could you show that with an example?",                  example:"",                                                            level:"b1" },
  { id:29, cat:"clarification", german:"Ich bin ein bisschen verloren. Könnten Sie zusammenfassen?", english:"I'm a bit lost. Could you summarize?",               example:"",                                                            level:"b1" },
  // Answering
  { id:40, cat:"answering",     german:"Ich glaube, dass...",                                      english:"I believe that...",                                     example:"Ich glaube, dass das Verb am Ende des Satzes steht.",          level:"a2" },
  { id:41, cat:"answering",     german:"Meiner Meinung nach...",                                   english:"In my opinion...",                                      example:"Meiner Meinung nach ist das die einfachste Lösung.",           level:"b1" },
  { id:42, cat:"answering",     german:"Ich würde sagen, dass...",                                 english:"I would say that...",                                   example:"",                                                            level:"b1" },
  { id:43, cat:"answering",     german:"Wenn ich das richtig verstanden habe...",                  english:"If I understood that correctly...",                     example:"Wenn ich das richtig verstanden habe, brauchen wir hier den Akkusativ.", level:"b1" },
  { id:44, cat:"answering",     german:"Ich bin nicht sicher, aber...",                            english:"I'm not sure, but...",                                  example:"Ich bin nicht sicher, aber ich denke, es ist 'dem' hier.",     level:"a2" },
  { id:45, cat:"answering",     german:"Ich stimme zu, weil...",                                   english:"I agree, because...",                                   example:"",                                                            level:"b1" },
  { id:46, cat:"answering",     german:"Das sehe ich ein bisschen anders, weil...",                english:"I see that a little differently, because...",           example:"",                                                            level:"b2" },
  { id:47, cat:"answering",     german:"Ich möchte hinzufügen, dass...",                           english:"I'd like to add that...",                               example:"",                                                            level:"b1" },
  { id:48, cat:"answering",     german:"Dazu wollte ich sagen...",                                 english:"I wanted to say about that...",                         example:"",                                                            level:"b1" },
  { id:49, cat:"answering",     german:"Das ist ein guter Punkt. Ich denke auch, dass...",         english:"That's a good point. I also think that...",             example:"",                                                            level:"b1" },
  { id:50, cat:"answering",     german:"Ich kann das so bestätigen.",                              english:"I can confirm that.",                                   example:"",                                                            level:"b2" },
  { id:51, cat:"answering",     german:"Ich würde das ein bisschen anders formulieren.",           english:"I would phrase that a little differently.",             example:"",                                                            level:"b2" },
  // Social
  { id:60, cat:"social",        german:"Entschuldigung, könnten Sie mir helfen?",                  english:"Excuse me, could you help me?",                         example:"",                                                            level:"a1" },
  { id:61, cat:"social",        german:"Darf ich mich kurz vorstellen?",                           english:"May I briefly introduce myself?",                       example:"",                                                            level:"a1" },
  { id:62, cat:"social",        german:"Ich bin neu hier und...",                                  english:"I'm new here and...",                                   example:"Ich bin neu hier und kenne mich noch nicht so gut aus.",        level:"a1" },
  { id:63, cat:"social",        german:"Über welches Thema sprechen wir heute?",                   english:"What topic are we discussing today?",                   example:"",                                                            level:"a2" },
  { id:64, cat:"social",        german:"Schön, Sie kennenzulernen.",                               english:"Nice to meet you.",                                     example:"",                                                            level:"a1" },
  { id:65, cat:"social",        german:"Ich lerne seit ... Deutsch.",                              english:"I have been learning German for ...",                   example:"Ich lerne seit sechs Monaten Deutsch.",                        level:"a2" },
  { id:66, cat:"social",        german:"Mein Deutsch ist noch nicht so gut, aber ich versuche es.", english:"My German isn't that good yet, but I'm trying.",       example:"",                                                            level:"a2" },
  { id:67, cat:"social",        german:"Könnten wir das auf Deutsch besprechen?",                  english:"Could we discuss that in German?",                      example:"",                                                            level:"b1" },
  // Escape / Buy Time
  { id:80, cat:"escape",        german:"Einen Moment bitte.",                                      english:"One moment please.",                                    example:"",                                                            level:"a1" },
  { id:81, cat:"escape",        german:"Ich muss kurz nachdenken.",                                english:"I need to think for a moment.",                         example:"",                                                            level:"a1" },
  { id:82, cat:"escape",        german:"Wie sagt man ... auf Deutsch?",                            english:"How do you say ... in German?",                         example:"Wie sagt man 'furthermore' auf Deutsch?",                      level:"a1" },
  { id:83, cat:"escape",        german:"Ich weiß das Wort gerade nicht.",                          english:"I don't know the word right now.",                      example:"",                                                            level:"a1" },
  { id:84, cat:"escape",        german:"Entschuldigung, ich habe das Wort vergessen.",             english:"Sorry, I forgot the word.",                             example:"",                                                            level:"a1" },
  { id:85, cat:"escape",        german:"Das ist schwer zu erklären, aber ich versuche es.",        english:"That's hard to explain, but I'll try.",                 example:"",                                                            level:"b1" },
  { id:86, cat:"escape",        german:"Ich suche das richtige Wort...",                           english:"I'm looking for the right word...",                     example:"",                                                            level:"a2" },
  { id:87, cat:"escape",        german:"Also... ich meine...",                                     english:"Well... I mean...",                                     example:"",                                                            level:"a1" },
];

// ---- State ----
let mode = "today";
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
let cefrFilter = localStorage.getItem("cefrFilter") || "all";
const TIER_TO_CEFR = { 1: "a1", 2: "a2", 3: "b1", 4: "b2" };
let grammarTopicFilter = null;
const vocabCache = {};

// Words mode state
let wordsSRS = {};

// Grammar Sprint state
let gsTimerInterval = null;
let gsSecondsLeft = 90;
let gsDuration = 90;
let gsSessionCorrect = 0;
let gsSessionTotal = 0;
let gsQueue = [];
let gsQueueIdx = 0;
let gsSet = "all";
let gsRunning = false;
let gsHighScore = 0;

// Listening Blitz state
let lbCurrentPhrase = null;
let lbTargetWord = "";
let lbTargetIdx = -1;
let lbOptions = [];
let lbSessionScore = 0;
let lbSessionTotal = 0;
let lbSeenIds = new Set();
let lbChecked = false;

// Sentence Builder state
let sbCurrentPhrase = null;
let sbBankWords = [];
let sbBuiltWords = [];
let sbSessionScore = 0;
let sbSessionTotal = 0;
let sbGrammarFilter = "all";
let sbSeenIds = new Set();
let sbChecked = false;

// Talk Box state
let tbCurrentCard = null;
let tbCategory = "alltag";
let tbSeenIds = new Set();
let tbIsRecording = false;
let tbTranscriptChunks = [];
let tbDuration = 45;
let tbSecondsLeft = 45;
let tbTimerInterval = null;
let tbMicStream = null;
let tbMicWS = null;
let tbMicRecorder = null;

// Games mode state
let wsCurrentPuzzle = null;
let wsIsDragging = false;
let wsStartCell = null;
let wsLockedDir = null;
let wsHoveredCells = [];
let wsCurrentPopupWordId = null;
let wsHintsUsed = 0;
let wsWsMode = "vocab";
let wordsQueue = [];
let wordsIndex = 0;
let wordRevealed = false;
let wordsShuffled = false;
let wordsDirection = "de_en"; // "de_en" | "en_de"
let wordsMode = "flashcard";  // "flashcard" | "mc"
let wordsSessionCorrect = 0;
let wordsSessionTotal = 0;

// Recall attempt state (managed inside setupRecallSpeech closure)

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
let drillSetKey = null;
let drillSessionCorrect = 0;
let drillSessionTotal = 0;

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
  ["recall-srs-bar", "phrase-mc-area", "recall-attempt-area", "recall-ai-feedback"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
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

// Local-timezone date strings (YYYY-MM-DD). toISOString() is UTC and shifts the
// day boundary by 1-2h for Europe/Berlin, crediting after-midnight study to the
// wrong day and hiding due cards until 1-2am — always use these helpers instead.
function toLocalDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function todayStr() {
  return toLocalDateStr(new Date());
}

function daysAgoStr(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toLocalDateStr(d);
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
  updateTabBadges();
}

function updateOnGotIt(id) {
  const r = getSrsRecord(id);
  const newEF = Math.min(3.0, Math.max(1.3, r.easeFactor + 0.1));
  const newInterval = getNextInterval(r.interval, newEF, true);
  const due = new Date();
  due.setDate(due.getDate() + newInterval);
  srsData[String(id)] = {
    ...r, interval: newInterval, easeFactor: newEF,
    dueDate: toLocalDateStr(due),
    lastReviewed: todayStr(),
    totalReviews: r.totalReviews + 1,
    totalCorrect: r.totalCorrect + 1
  };
  saveSrsData();
  awardXP(4, "Phrase");
  todayOnPhraseGraded();
}

function updateOnMissed(id) {
  const r = getSrsRecord(id);
  const newEF = Math.max(1.3, r.easeFactor - 0.2);
  const due = new Date();
  due.setDate(due.getDate() + 1);
  srsData[String(id)] = {
    ...r, interval: 1, easeFactor: newEF,
    dueDate: toLocalDateStr(due),
    lastReviewed: todayStr(),
    totalReviews: r.totalReviews + 1
  };
  saveSrsData();
  awardXP(1, "Versuch");
  todayOnPhraseGraded();
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
      dueDate: toLocalDateStr(due), lastReviewed: null,
      totalReviews: missCount, totalCorrect: 0, archived: false
    };
  }
  localStorage.setItem("srsData", JSON.stringify(existing));
  localStorage.removeItem("missedWeights");
}

// ---- XP, Levels & Global Streak (motivation layer) ----
// One reward system across every feature: any graded action earns XP via
// awardXP(). A day with >= XP_STREAK_MIN counts toward the global streak,
// so ANY real practice keeps the flame alive - not just one specific tab.

const XP_DAILY_GOAL = 40;
const XP_STREAK_MIN = 10;
const XP_LEVELS = [
  { xp: 0,    title: "Neuling" },
  { xp: 150,  title: "Entdecker" },
  { xp: 400,  title: "Wortsammler" },
  { xp: 800,  title: "Satzbauer" },
  { xp: 1400, title: "Plauderer" },
  { xp: 2200, title: "Geschichtenerzähler" },
  { xp: 3200, title: "Alltagsheld" },
  { xp: 4500, title: "B2-Kandidat" },
  { xp: 6000, title: "Prüfungsprofi" },
  { xp: 8000, title: "Sprachmeister" },
];

let xpState = null;

function loadXPState() {
  if (xpState) return;
  try { xpState = JSON.parse(localStorage.getItem("xp_state") || "null"); } catch {}
  if (!xpState || typeof xpState !== "object") xpState = { total: 0, days: {} };
  if (!xpState.days || typeof xpState.days !== "object") xpState.days = {};
  if (typeof xpState.total !== "number") xpState.total = 0;
}

function saveXPState() {
  try { localStorage.setItem("xp_state", JSON.stringify(xpState)); } catch {}
}

function xpToday() {
  loadXPState();
  return xpState.days[todayStr()] || 0;
}

function xpLastNDays(n) {
  loadXPState();
  const out = [];
  for (let i = n - 1; i >= 0; i--) out.push({ date: daysAgoStr(i), xp: xpState.days[daysAgoStr(i)] || 0 });
  return out;
}

function getXPLevel() {
  loadXPState();
  let idx = 0;
  for (let i = 0; i < XP_LEVELS.length; i++) if (xpState.total >= XP_LEVELS[i].xp) idx = i;
  const next = XP_LEVELS[idx + 1] || null;
  return { index: idx, title: XP_LEVELS[idx].title, floor: XP_LEVELS[idx].xp, next };
}

// Consecutive days (ending today or yesterday) with >= XP_STREAK_MIN earned.
function getGlobalStreak() {
  loadXPState();
  let start = 0;
  if ((xpState.days[daysAgoStr(0)] || 0) < XP_STREAK_MIN) {
    if ((xpState.days[daysAgoStr(1)] || 0) < XP_STREAK_MIN) return 0;
    start = 1;
  }
  let streak = 0;
  for (let i = start; (xpState.days[daysAgoStr(i)] || 0) >= XP_STREAK_MIN; i++) streak++;
  return streak;
}

function awardXP(amount, label) {
  if (!amount || amount <= 0) return;
  loadXPState();
  const before = xpState.days[todayStr()] || 0;
  xpState.total += amount;
  xpState.days[todayStr()] = before + amount;
  const levelBefore = getXPLevelIndexAt(xpState.total - amount);
  saveXPState();
  renderXPBar();
  showXPToast(amount, label);
  if (before < XP_DAILY_GOAL && before + amount >= XP_DAILY_GOAL) {
    celebrateMoment(`Tagesziel erreicht! 🎯`, `🔥 ${getGlobalStreak()} day streak — see you tomorrow!`);
  } else if (getXPLevel().index > levelBefore) {
    celebrateMoment(`Level up! ⭐`, `You are now: ${getXPLevel().title}`);
  }
}

function getXPLevelIndexAt(total) {
  let idx = 0;
  for (let i = 0; i < XP_LEVELS.length; i++) if (total >= XP_LEVELS[i].xp) idx = i;
  return idx;
}

function renderXPBar() {
  const bar = document.getElementById("xp-topbar");
  if (!bar) return;
  const today = xpToday();
  const streak = getGlobalStreak();
  const lvl = getXPLevel();
  const streakEl = document.getElementById("xp-streak");
  streakEl.textContent = `🔥 ${streak}`;
  streakEl.classList.toggle("alive", streak > 0 && today >= XP_STREAK_MIN);
  document.getElementById("xp-level").textContent = `⭐ ${lvl.title}`;
  const pct = Math.min(100, Math.round((today / XP_DAILY_GOAL) * 100));
  document.getElementById("xp-goal-fill").style.width = pct + "%";
  document.getElementById("xp-goal-fill").classList.toggle("goal-hit", today >= XP_DAILY_GOAL);
  document.getElementById("xp-goal-label").textContent = `${today} / ${XP_DAILY_GOAL} XP`;
  document.getElementById("xp-total").textContent = `${xpState.total} XP`;
}

let xpToastTimer = null;
function showXPToast(amount, label) {
  let wrap = document.getElementById("xp-toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "xp-toast-wrap";
    document.body.appendChild(wrap);
  }
  const toast = document.createElement("div");
  toast.className = "xp-toast";
  toast.textContent = `+${amount} XP${label ? " · " + label : ""}`;
  wrap.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 1600);
}

function celebrateMoment(title, sub) {
  const old = document.getElementById("celebrate-overlay");
  if (old) old.remove();
  const el = document.createElement("div");
  el.id = "celebrate-overlay";
  const confetti = Array.from({ length: 24 }, (_, i) =>
    `<span class="confetti c${i % 6}" style="left:${(i * 41) % 100}%;animation-delay:${(i % 8) * 90}ms"></span>`).join("");
  el.innerHTML = `${confetti}<div id="celebrate-card"><div id="celebrate-title">${title}</div><div id="celebrate-sub">${sub}</div></div>`;
  document.body.appendChild(el);
  el.addEventListener("click", () => el.remove());
  setTimeout(() => { if (el.parentNode) el.remove(); }, 2800);
}

// ---- Voice Matching ----


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

  if (cefrFilter !== "all") {
    source = source.filter(p => p.level === cefrFilter);
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
  document.querySelectorAll(".level-chip").forEach(c => {
    c.classList.toggle("active", c.dataset.level === cefrFilter);
  });
  buildQueue();
  renderCard();
  setupMobileMoreNav();
  setupEvents();
  initAI();
  setupRecallSpeech();
  initWordsPanel();
  setupStarterPracticeModal();
  setupSpeakPanel();
  setupMonologuePanel();
  setupDrillsPanel();
  initGamesPanel();
  setupTodayPanel();
  setupStoriesPanel();
  setupErrorProfileSection();
  setupExamPanel();
  loadXPState();
  renderXPBar();
  setupSyncCard();
  // Pull synced episodes in the background so another device's progress appears
  if (getSyncId()) syncPull();
  // Land on the Today dashboard (mode defaults to "today")
  showTodayPanel();
  updateTabBadges();
}

// ---- Render (player) ----
function renderCard(autoPlay = false) {
  if (mode === "ai" || mode === "progress" || mode === "vocab" || mode === "grammar" || mode === "words" || mode === "starters" || mode === "speak" || mode === "monologue" || mode === "drills" || mode === "games" || mode === "today" || mode === "stories" || mode === "exam") return;

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
  document.getElementById("recall-attempt-area").style.display = "none";
  document.getElementById("recall-ai-feedback").style.display = "none";
  document.getElementById("srs-status-badge").style.display = "none";

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
      document.getElementById("recall-attempt-area").style.display = "none";
      document.getElementById("recall-ai-feedback").style.display = "none";
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
      const attemptArea = document.getElementById("recall-attempt-area");
      const aiFeedback = document.getElementById("recall-ai-feedback");
      if (phraseDirection === "en_de") {
        attemptArea.style.display = "flex";
        aiFeedback.style.display = "none";
        document.getElementById("recall-text-input").value = "";
        document.getElementById("recall-check-btn").disabled = true;
        document.getElementById("recall-attempt-status").textContent = "";
        germanEl.classList.add("hidden");
        englishEl.classList.remove("hidden");
        revealHint.style.display = "block";
        revealHint.textContent = "Tap card to reveal";
        statusText.textContent = "Produce German from memory";
      } else {
        attemptArea.style.display = "none";
        aiFeedback.style.display = "none";
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
  document.getElementById("drills-panel").style.display = "none";
  document.getElementById("starters-panel").style.display = "none";
  document.getElementById("speak-panel").style.display = "none";
  document.getElementById("monologue-panel").style.display = "none";
  document.getElementById("games-panel").style.display = "none";
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
  document.getElementById("drills-panel").style.display = "none";
  document.getElementById("starters-panel").style.display = "none";
  document.getElementById("speak-panel").style.display = "none";
  document.getElementById("monologue-panel").style.display = "none";
  document.getElementById("games-panel").style.display = "none";
  aiPanel.style.display = "flex";
  renderAISavedList();
}

// ---- Mobile bottom nav: 4 primary tabs + "More" sheet ----
const MOBILE_PRIMARY_MODES = ["today", "recall", "speak", "ai"];
const MORE_SHEET_GROUPS = [
  { label: "Practice", modes: ["listen", "shadow", "stories"] },
  { label: "Conversation", modes: ["starters", "monologue"] },
  { label: "Vocabulary", modes: ["words", "vocab"] },
  { label: "Grammar", modes: ["grammar", "drills"] },
  { label: "Exam", modes: ["exam"] },
  { label: "Explore", modes: ["games", "progress"] },
];

function setupMobileMoreNav() {
  const nav = document.getElementById("mode-tabs");

  const moreBtn = document.createElement("div");
  moreBtn.className = "tab";
  moreBtn.id = "more-tab";
  moreBtn.innerHTML =
    '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/>' +
    '<circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>' +
    '<circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>' +
    '<span class="tab-label">More</span>';
  nav.appendChild(moreBtn);

  const sheet = document.createElement("div");
  sheet.id = "more-sheet";
  sheet.style.display = "none";
  const inner = document.createElement("div");
  inner.id = "more-sheet-inner";
  sheet.appendChild(inner);

  MORE_SHEET_GROUPS.forEach(group => {
    const items = group.modes
      .map(m => document.querySelector(`.tab[data-mode="${m}"]`))
      .filter(Boolean);
    if (!items.length) return;
    const section = document.createElement("div");
    section.className = "more-group";
    const label = document.createElement("div");
    label.className = "more-group-label";
    label.textContent = group.label;
    section.appendChild(label);
    const row = document.createElement("div");
    row.className = "more-group-items";
    items.forEach(srcTab => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "more-item";
      item.dataset.mode = srcTab.dataset.mode;
      item.innerHTML = srcTab.innerHTML;
      item.addEventListener("click", () => {
        closeMoreSheet();
        srcTab.click();
      });
      row.appendChild(item);
    });
    section.appendChild(row);
    inner.appendChild(section);
  });

  document.body.appendChild(sheet);

  moreBtn.addEventListener("click", () => {
    const open = sheet.style.display !== "none";
    if (open) { closeMoreSheet(); return; }
    sheet.style.display = "flex";
    updateMoreTabState();
  });
  sheet.addEventListener("click", e => {
    if (e.target === sheet) closeMoreSheet();
  });
}

function closeMoreSheet() {
  const sheet = document.getElementById("more-sheet");
  if (sheet) sheet.style.display = "none";
}

function updateMoreTabState() {
  const moreBtn = document.getElementById("more-tab");
  if (moreBtn) moreBtn.classList.toggle("active", !MOBILE_PRIMARY_MODES.includes(mode));
  document.querySelectorAll(".more-item").forEach(item => {
    item.classList.toggle("active", item.dataset.mode === mode);
  });
}

// ---- Events (player) ----
function setupEvents() {
  tabEls.forEach(tab => {
    tab.addEventListener("click", () => {
      const newMode = tab.dataset.mode;
      closeMoreSheet();
      tabEls.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("today-panel").style.display = "none";
      document.getElementById("stories-panel").style.display = "none";
      document.getElementById("exam-panel").style.display = "none";

      if (newMode === "today") {
        mode = "today";
        showTodayPanel();
      } else if (newMode === "stories") {
        mode = "stories";
        showStoriesPanel();
      } else if (newMode === "exam") {
        mode = "exam";
        showExamPanel();
      } else if (newMode === "ai") {
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
      } else if (newMode === "drills") {
        mode = "drills";
        showDrillsPanel();
      } else if (newMode === "starters") {
        mode = "starters";
        showStartersPanel();
      } else if (newMode === "speak") {
        mode = "speak";
        showSpeakPanel();
      } else if (newMode === "monologue") {
        mode = "monologue";
        showMonologuePanel();
      } else if (newMode === "games") {
        mode = "games";
        showGamesPanel();
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
      updateMoreTabState();
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

  document.querySelectorAll(".level-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      cefrFilter = chip.dataset.level;
      localStorage.setItem("cefrFilter", cefrFilter);
      document.querySelectorAll(".level-chip").forEach(c => c.classList.toggle("active", c.dataset.level === chip.dataset.level));
      buildQueue();
      renderCard();
      if (mode === "words") { buildWordsQueue(); renderWordCard(); }
      if (mode === "vocab") renderVocabPanel(document.getElementById("vocab-panel-search")?.value || "");
      if (mode === "grammar") renderGrammarTab(grammarTopicFilter);
    });
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
    if (mode === "ai" || mode === "progress" || mode === "vocab" || mode === "grammar" || mode === "words" || mode === "starters" || mode === "speak" || mode === "monologue" || mode === "drills" || mode === "games" || mode === "today" || mode === "stories" || mode === "exam") return;
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
    const result = await parseApiResponse(res);
    if (!res.ok) throw new Error(result.error || "Server error");

    lastAIResult = result;
    aiSpinner.style.display = "none";
    renderAIResult(result);
    if ((aiMode === "correct" || aiMode === "write") && result.is_correct === false) {
      logError(aiMode, result.original, result.corrected, result.explanation);
    }
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

// All /api/chat responses are parsed through here so a missing backend
// produces a clear message instead of a cryptic JSON parse error.
// A plain static server (python -m http.server, Live Server, file://)
// has no /api functions - only the deployed Vercel app or `vercel dev` does.
async function parseApiResponse(res) {
  const raw = (await res.text() || "").trim();
  if (raw.startsWith("{") || raw.startsWith("[")) {
    try { return JSON.parse(raw); } catch {}
  }
  throw new Error(
    `AI backend not reachable (HTTP ${res.status}). ` +
    `If you opened the app from a local static server, the /api functions don't exist there - ` +
    `use the deployed site or run "vercel dev".`
  );
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
  saved.push({ german, english, category: cat, audio_base64, created_date: todayStr() });
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

// ---- Recall Attempt (type or speak, then AI checks without revealing) ----

function setupRecallSpeech() {
  const micBtn = document.getElementById("recall-attempt-mic-btn");
  const textInput = document.getElementById("recall-text-input");
  const statusEl = document.getElementById("recall-attempt-status");
  const checkBtn = document.getElementById("recall-check-btn");

  if (!micBtn) return;

  let recallAttemptRecording = false;
  let recallAttemptStream = null;
  let recallAttemptWS = null;
  let recallAttemptRecorder = null;

  async function startAttemptRecording() {
    if (recallAttemptRecording) { stopAttemptRecording(); return; }
    statusEl.textContent = "Connecting...";
    try {
      const tokenRes = await fetch("/api/deepgram-token", { method: "POST" });
      if (!tokenRes.ok) throw new Error("token");
      const { key } = await tokenRes.json();

      recallAttemptStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const wsUrl = "wss://api.deepgram.com/v1/listen?language=de&model=nova-2-general&interim_results=true&utterance_end_ms=1200&endpointing=500&vad_events=true&encoding=linear16&sample_rate=16000";
      recallAttemptWS = new WebSocket(wsUrl, ["token", key]);

      recallAttemptWS.onopen = () => {
        recallAttemptRecording = true;
        micBtn.classList.add("recording");
        statusEl.textContent = "Listening...";
        recallAttemptRecorder = new MediaRecorder(recallAttemptStream, { mimeType: "audio/webm;codecs=opus" });
        recallAttemptRecorder.ondataavailable = (e) => {
          if (recallAttemptWS && recallAttemptWS.readyState === WebSocket.OPEN && e.data.size > 0) {
            recallAttemptWS.send(e.data);
          }
        };
        recallAttemptRecorder.start(100);
      };

      let interimText = "";
      recallAttemptWS.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.type === "Results") {
          const t = msg.channel?.alternatives?.[0]?.transcript || "";
          if (msg.is_final) {
            interimText = "";
            if (t.trim()) stopAttemptRecording(t.trim());
          } else {
            interimText = t;
            statusEl.textContent = interimText;
          }
        } else if (msg.type === "UtteranceEnd" && interimText.trim()) {
          stopAttemptRecording(interimText.trim());
        }
      };

      recallAttemptWS.onerror = () => stopAttemptRecording();
      recallAttemptWS.onclose = () => { if (recallAttemptRecording) stopAttemptRecording(); };

    } catch {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) { statusEl.textContent = "Mic not available"; return; }
      const sr = new SR();
      sr.lang = "de-DE";
      sr.interimResults = false;
      sr.onresult = (ev) => stopAttemptRecording(ev.results[0][0].transcript.trim());
      sr.onerror = () => { statusEl.textContent = ""; micBtn.classList.remove("recording"); };
      recallAttemptRecording = true;
      micBtn.classList.add("recording");
      statusEl.textContent = "Listening...";
      sr.start();
    }
  }

  function stopAttemptRecording(transcript) {
    recallAttemptRecording = false;
    micBtn.classList.remove("recording");
    if (recallAttemptRecorder && recallAttemptRecorder.state !== "inactive") recallAttemptRecorder.stop();
    if (recallAttemptWS) { recallAttemptWS.close(); recallAttemptWS = null; }
    if (recallAttemptStream) { recallAttemptStream.getTracks().forEach(t => t.stop()); recallAttemptStream = null; }
    if (transcript) {
      textInput.value = transcript;
      statusEl.textContent = `"${transcript}"`;
      checkBtn.disabled = false;
    } else {
      statusEl.textContent = "";
    }
  }

  micBtn.addEventListener("click", startAttemptRecording);

  textInput.addEventListener("input", () => {
    checkBtn.disabled = textInput.value.trim().length === 0;
  });

  checkBtn.addEventListener("click", async () => {
    const text = textInput.value.trim();
    if (!text) return;
    const p = queue[queueIndex];
    if (!p) return;

    checkBtn.disabled = true;
    checkBtn.textContent = "Checking...";
    statusEl.textContent = "";

    const feedbackEl = document.getElementById("recall-ai-feedback");
    const feedbackBody = document.getElementById("recall-ai-feedback-body");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "recall-check", text, targetEnglish: p.english }),
      });
      const result = await parseApiResponse(res);

      if (!result.is_correct) {
        logError("recall", text, p.german, result.feedback);
      }
      const badge = result.is_correct
        ? `<div class="recall-feedback-correct">✓ Correct!</div>`
        : `<div class="recall-feedback-wrong">✗ Not quite</div>`;

      const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

      let attemptHtml = "";
      if (!result.is_correct) {
        const errText = (result.error_text || "").trim();
        const idx = errText ? text.indexOf(errText) : -1;
        const marked = idx === -1
          ? escapeHtml(text)
          : `${escapeHtml(text.slice(0, idx))}<mark class="recall-error-highlight">${escapeHtml(text.slice(idx, idx + errText.length))}</mark>${escapeHtml(text.slice(idx + errText.length))}`;
        attemptHtml = `<div class="recall-feedback-attempt">${marked}</div>`;
      }

      const hintHtml = (!result.is_correct && result.hint)
        ? `<button class="recall-hint-toggle-btn" type="button">Show me a hint</button><div class="recall-feedback-hint" hidden>${result.hint}</div>`
        : "";
      feedbackBody.innerHTML = `${badge}${attemptHtml}<div class="recall-feedback-text">${result.feedback}</div>${hintHtml}`;

      const hintToggleBtn = feedbackBody.querySelector(".recall-hint-toggle-btn");
      if (hintToggleBtn) {
        hintToggleBtn.addEventListener("click", () => {
          const hintEl = feedbackBody.querySelector(".recall-feedback-hint");
          hintEl.hidden = false;
          hintToggleBtn.hidden = true;
        });
      }

      const actionsEl = document.getElementById("recall-ai-feedback-actions");
      if (result.is_correct) {
        actionsEl.innerHTML = `<button class="recall-gotit-btn">Got it! Next →</button>`;
        actionsEl.querySelector(".recall-gotit-btn").addEventListener("click", () => {
          feedbackEl.style.display = "none";
          document.getElementById("recall-attempt-area").style.display = "none";
          document.getElementById("got-it-btn").click();
        });
      } else {
        actionsEl.innerHTML = `
          <button id="recall-try-again-btn" class="recall-action-btn">Try Again</button>
          <button id="recall-reveal-btn" class="recall-action-btn recall-reveal-btn">Reveal Answer</button>
        `;
        document.getElementById("recall-try-again-btn").addEventListener("click", () => {
          textInput.value = "";
          statusEl.textContent = "";
          checkBtn.disabled = true;
          checkBtn.textContent = "Check";
          feedbackEl.style.display = "none";
          document.getElementById("recall-attempt-area").style.display = "flex";
          textInput.focus();
        });
        document.getElementById("recall-reveal-btn").addEventListener("click", () => {
          feedbackEl.style.display = "none";
          revealRecallCard();
        });
      }

      feedbackEl.style.display = "flex";
      document.getElementById("recall-attempt-area").style.display = "none";
    } catch {
      statusEl.textContent = "Error - please try again";
    }
    checkBtn.textContent = "Check";
  });
}

function revealRecallCard() {
  if (revealed) return;
  revealed = true;
  document.getElementById("recall-attempt-area").style.display = "none";
  document.getElementById("recall-ai-feedback").style.display = "none";
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

  const correctPhrase = PHRASES.find(p => p.id === correctId);
  const postAudioDelay = isCorrect ? 350 : 550;

  if (correctPhrase?.audio) {
    audio.src = correctPhrase.audio;
    const onDone = () => {
      audio.removeEventListener("ended", onDone);
      audio.removeEventListener("error", onDone);
      setTimeout(() => advance(1), postAudioDelay);
    };
    audio.addEventListener("ended", onDone);
    audio.addEventListener("error", onDone);
    audio.play().catch(() => setTimeout(() => advance(1), 1800));
  } else if (correctPhrase) {
    const utter = speakGerman(correctPhrase.german);
    if (utter) {
      utter.onend = () => setTimeout(() => advance(1), postAudioDelay);
    } else {
      setTimeout(() => advance(1), 1800);
    }
  } else {
    setTimeout(() => advance(1), 1800);
  }
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
  document.getElementById("vocab-panel").style.display = "none";
  document.getElementById("grammar-panel").style.display = "none";
  document.getElementById("words-panel").style.display = "none";
  document.getElementById("drills-panel").style.display = "none";
  document.getElementById("starters-panel").style.display = "none";
  document.getElementById("speak-panel").style.display = "none";
  document.getElementById("monologue-panel").style.display = "none";
  document.getElementById("games-panel").style.display = "none";
  document.getElementById("progress-panel").style.display = "flex";
  renderProgressTab();
  renderErrorProfileSection();
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

// Headline numbers that only grow - the proof that the work is paying off
function renderResultsCard() {
  loadWordsSRS();
  const recs = Object.values(wordsSRS);
  document.getElementById("res-words-met").textContent = recs.filter(r => r.totalReviews > 0).length;
  document.getElementById("res-words-solid").textContent = recs.filter(r => (r.interval || 0) >= 7).length;
  document.getElementById("res-streak").textContent = getGlobalStreak();
  document.getElementById("res-stories").textContent = getStoriesReadCount();

  const week = xpLastNDays(7);
  const weekTotal = week.reduce((s, d) => s + d.xp, 0);
  document.getElementById("res-xp-week").textContent = weekTotal;

  const max = Math.max(XP_DAILY_GOAL, ...week.map(d => d.xp));
  const dayLetters = ["S", "M", "T", "W", "T", "F", "S"];
  document.getElementById("xp-week-chart").innerHTML = week.map((d, i) => {
    const h = Math.max(4, Math.round((d.xp / max) * 100));
    const hit = d.xp >= XP_DAILY_GOAL;
    const isToday = i === week.length - 1;
    return `<div class="xpw-col${isToday ? " today" : ""}" title="${d.date}: ${d.xp} XP">
      <div class="xpw-bar-wrap"><div class="xpw-bar${hit ? " hit" : ""}" style="height:${h}%"></div></div>
      <span class="xpw-day">${dayLetters[new Date(d.date + "T12:00:00").getDay()]}</span>
    </div>`;
  }).join("");
}

function renderProgressTab() {
  renderResultsCard();
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
  updateMoreTabState();
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
  drillSetKey = null;
  drillSessionCorrect = 0;
  drillSessionTotal = 0;
  const tagged = PHRASES.filter(p => getTagsForCard(p.id, p.german).includes(tag));
  drillQueue = tagged.map(p => generateGapFill(p)).filter(Boolean).sort(() => Math.random() - 0.5);
  if (!drillQueue.length) {
    alert(`No drillable phrases found for "${tag}". Try a different topic.`);
    return;
  }
  drillIdx = 0;
  document.getElementById("drill-score-label").textContent = "";
  document.getElementById("drill-modal").style.display = "flex";
  renderDrillCard();
}

function buildDrillQueueItem(item, srcSetKey) {
  const sentenceHtml = item.sentence.replace("___", '<span class="drill-blank">___</span>');
  const answerShown = item.sentence.startsWith("___")
    ? item.answer.charAt(0).toUpperCase() + item.answer.slice(1)
    : item.answer;
  const revealedText = item.sentence.replace("___", answerShown);
  const revealedHtml = item.sentence.replace("___", `<strong style="color:var(--green)">${answerShown}</strong>`);
  const options = [item.answer, ...item.distractors].sort(() => Math.random() - 0.5);
  return {
    display: sentenceHtml,
    blank: item.answer,
    options,
    phraseId: null,
    german: revealedText,
    germanHtml: revealedHtml,
    rule: item.rule,
    srcItem: item,
    srcSetKey: srcSetKey || null,
  };
}

function openDrillSetSession(setKey) {
  const set = DRILL_SETS[setKey];
  if (!set || !set.items || !set.items.length) return;
  drillTag = null;
  drillSetKey = setKey;
  drillSessionCorrect = 0;
  drillSessionTotal = 0;
  drillQueue = [...set.items].sort(() => Math.random() - 0.5).map(item => buildDrillQueueItem(item, setKey));
  drillIdx = 0;
  document.getElementById("drill-tag-chip").innerHTML = `<span class="grammar-chip">${set.label}</span>`;
  document.getElementById("drill-score-label").textContent = "";
  document.getElementById("drill-progress-label").textContent = `1 / ${drillQueue.length}`;
  document.getElementById("drill-modal").style.display = "flex";
  renderDrillCard();
}

// ---- Drill mistake bank ----
// Wrong answers from drill sets and Grammar Sprint land here; a correct
// answer anywhere clears the item again.

function getDrillMistakeBank() {
  try { return JSON.parse(localStorage.getItem("drillMistakeBank") || "{}"); } catch { return {}; }
}

function saveDrillMistakeBank(bank) {
  localStorage.setItem("drillMistakeBank", JSON.stringify(bank));
}

function addDrillMistake(setKey, item) {
  if (!item || !item.sentence) return;
  const bank = getDrillMistakeBank();
  const prev = bank[item.sentence];
  bank[item.sentence] = {
    setKey: setKey || (prev && prev.setKey) || null,
    sentence: item.sentence,
    answer: item.answer,
    distractors: item.distractors || [],
    rule: item.rule || "",
    misses: ((prev && prev.misses) || 0) + 1,
    ts: Date.now(),
  };
  saveDrillMistakeBank(bank);
}

function clearDrillMistake(item) {
  if (!item || !item.sentence) return;
  const bank = getDrillMistakeBank();
  if (bank[item.sentence]) {
    delete bank[item.sentence];
    saveDrillMistakeBank(bank);
  }
}

function findDrillSetKeyForItem(item) {
  for (const [key, set] of Object.entries(DRILL_SETS || {})) {
    if ((set.items || []).some(i => i.sentence === item.sentence)) return key;
  }
  return null;
}

function openMistakeReviewSession() {
  const entries = Object.values(getDrillMistakeBank()).sort((a, b) => b.ts - a.ts).slice(0, 20);
  if (!entries.length) return;
  drillTag = null;
  drillSetKey = "__mistakes__";
  drillSessionCorrect = 0;
  drillSessionTotal = 0;
  drillQueue = entries.sort(() => Math.random() - 0.5).map(item => buildDrillQueueItem(item, item.setKey));
  drillIdx = 0;
  document.getElementById("drill-tag-chip").innerHTML = `<span class="grammar-chip">Mistake Review</span>`;
  document.getElementById("drill-score-label").textContent = "";
  document.getElementById("drill-progress-label").textContent = `1 / ${drillQueue.length}`;
  document.getElementById("drill-modal").style.display = "flex";
  renderDrillCard();
}

// ---- Drills panel ----

function showDrillsPanel() {
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
  hideRecallSpecificEls();
  aiPanel.style.display = "none";
  document.getElementById("progress-panel").style.display = "none";
  document.getElementById("vocab-panel").style.display = "none";
  document.getElementById("grammar-panel").style.display = "none";
  document.getElementById("words-panel").style.display = "none";
  document.getElementById("starters-panel").style.display = "none";
  document.getElementById("speak-panel").style.display = "none";
  document.getElementById("monologue-panel").style.display = "none";
  document.getElementById("games-panel").style.display = "none";
  document.getElementById("drills-panel").style.display = "flex";
  renderDrillSetsPanel();
}

function renderDrillSetsPanel() {
  updateDrillsStreakBadge();
  const grid = document.getElementById("drills-set-grid");
  if (!grid) return;
  const mistakeCount = Object.keys(getDrillMistakeBank()).length;
  const mistakesCard = mistakeCount > 0
    ? `<div class="drill-set-card drill-mistakes-card" onclick="openMistakeReviewSession()" style="--set-color:#f87171">
        <div class="drill-set-name">&#9888; Review Mistakes</div>
        <div class="drill-set-subtitle">Items you got wrong recently. Answer correctly to clear them.</div>
        <div class="drill-set-count">${mistakeCount} to fix &rarr;</div>
      </div>`
    : "";
  const setKeys = Object.keys(DRILL_SETS);
  grid.innerHTML = mistakesCard + setKeys.map(key => {
    const s = DRILL_SETS[key];
    return `<div class="drill-set-card" onclick="openDrillSetSession('${key}')" style="--set-color:${s.color}">
      <div class="drill-set-name">${s.label}</div>
      <div class="drill-set-subtitle">${s.subtitle}</div>
      <div class="drill-set-count">${s.items.length} drills →</div>
    </div>`;
  }).join("");
}

function getDrillStreak() {
  try {
    const data = JSON.parse(localStorage.getItem("drills_streak") || "{}");
    const today = todayStr();
    const yesterday = daysAgoStr(1);
    if (data.last === today || data.last === yesterday) return data.count || 0;
    return 0;
  } catch { return 0; }
}

function recordDrillDone() {
  try {
    const today = todayStr();
    const yesterday = daysAgoStr(1);
    const data = JSON.parse(localStorage.getItem("drills_streak") || "{}");
    if (data.last === today) return;
    const newCount = (data.last === yesterday) ? (data.count || 0) + 1 : 1;
    localStorage.setItem("drills_streak", JSON.stringify({ last: today, count: newCount }));
  } catch {}
}

function updateDrillsStreakBadge() {
  const streak = getDrillStreak();
  const badge = document.getElementById("drills-streak-badge");
  if (!badge) return;
  if (streak > 0) {
    badge.textContent = "🔥 " + streak + " day streak";
    badge.classList.add("visible");
  } else {
    badge.classList.remove("visible");
  }
}

function setupDrillsPanel() {
  // nothing extra needed; openDrillSetSession handles setup
}

function renderDrillCard() {
  if (drillIdx >= drillQueue.length) {
    if (drillSetKey && drillSessionTotal > 0) recordDrillDone();
    const streak = getDrillStreak();
    const streakHtml = streak > 0 ? `<div class="drill-done-streak">🔥 ${streak} day streak</div>` : "";
    document.getElementById("drill-sentence").innerHTML = `
      <div class="drill-done">
        <div class="drill-done-score">${drillSessionCorrect} / ${drillSessionTotal}</div>
        <div class="drill-done-label">Set complete!</div>
        ${streakHtml}
      </div>`;
    document.getElementById("drill-choices").innerHTML = "";
    document.getElementById("drill-feedback").style.display = "none";
    document.getElementById("drill-next").style.display = "none";
    document.getElementById("drill-progress-label").textContent = "Complete!";
    document.getElementById("drill-score-label").textContent = "";
    if (mode === "drills") renderDrillSetsPanel();
    if (mode === "today") renderTodayPanel();
    return;
  }
  const item = drillQueue[drillIdx];
  const chipLabel = drillSetKey === "__mistakes__" ? "Mistake Review"
    : drillSetKey === "__errorlog__" ? "My Mistakes"
    : drillSetKey ? (DRILL_SETS[drillSetKey] || {}).label : drillTag;
  document.getElementById("drill-tag-chip").innerHTML = `<span class="grammar-chip">${chipLabel || ""}</span>`;
  document.getElementById("drill-progress-label").textContent = `${drillIdx + 1} / ${drillQueue.length}`;
  document.getElementById("drill-score-label").textContent = drillSessionTotal > 0 ? `${drillSessionCorrect} ✓` : "";
  document.getElementById("drill-sentence").innerHTML = `<div class="drill-phrase">${item.display}</div>`;
  document.getElementById("drill-feedback").style.display = "none";
  document.getElementById("drill-next").style.display = "none";
  document.getElementById("drill-choices").innerHTML = item.options.map(opt =>
    `<button class="drill-choice" onclick="answerDrill('${opt.replace(/'/g, "\\'")}')">${opt}</button>`
  ).join("");
}

function answerDrill(chosen) {
  const item = drillQueue[drillIdx];
  const correct = item.blank;
  const isCorrect = chosen.toLowerCase() === correct.toLowerCase();
  document.querySelectorAll(".drill-choice").forEach(btn => {
    btn.disabled = true;
    if (btn.textContent.toLowerCase() === correct.toLowerCase()) btn.classList.add("drill-correct");
    else if (btn.textContent === chosen && !isCorrect) btn.classList.add("drill-wrong");
  });
  document.getElementById("drill-sentence").innerHTML = `<div class="drill-phrase">${item.germanHtml || item.german}</div>`;
  if (item.phraseId != null) {
    if (isCorrect) updateOnGotIt(item.phraseId);
    else updateOnMissed(item.phraseId);
  }
  if (item.srcItem) {
    if (isCorrect) clearDrillMistake(item.srcItem);
    else addDrillMistake(drillSetKey === "__mistakes__" ? item.srcSetKey : drillSetKey, item.srcItem);
  }
  // Phrase-backed drills already earn XP via updateOnGotIt/Missed above
  if (item.phraseId == null) awardXP(isCorrect ? 3 : 1, "Drill");
  if (isCorrect) drillSessionCorrect++;
  drillSessionTotal++;
  speakGerman(item.german);
  const fb = document.getElementById("drill-feedback");
  fb.style.display = "block";
  let ruleHint = "";
  if (item.rule) {
    ruleHint = `<div class="drill-rule-hint">${item.rule}</div>`;
  } else if (drillTag) {
    const topic = GRAMMAR_TOPICS.find(t => t.id === drillTag);
    if (topic) ruleHint = `<div class="drill-rule-hint">${topic.rule}</div>`;
  }
  fb.innerHTML = isCorrect
    ? `<span style="color:var(--green)">✓ Correct!</span>${ruleHint}`
    : `<span style="color:var(--red)">✗ Correct answer: <strong>${correct}</strong></span>${ruleHint}`;
  document.getElementById("drill-next").style.display = "block";
  document.getElementById("drill-score-label").textContent = `${drillSessionCorrect} ✓`;
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
    const data = await parseApiResponse(res);
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

  // Offer to add to the Words SRS when the word exists in the word list
  const addBtn = document.getElementById("vocab-add-btn");
  if (addBtn) {
    const lookup = (data.word || "").toLowerCase().trim();
    const match = (typeof WORDS !== "undefined" ? WORDS : [])
      .find(w => w.german.toLowerCase() === lookup);
    if (match && !wordsSRS[String(match.id)]) {
      addBtn.style.display = "block";
      addBtn.disabled = false;
      addBtn.textContent = "+ Add to Words";
      addBtn.onclick = () => {
        // Due immediately so it surfaces in the next review session
        wordsSRS[String(match.id)] = {
          interval: 0, easeFactor: 2.5, dueDate: todayStr(),
          lastReviewed: null, totalReviews: 0, totalCorrect: 0, archived: false,
        };
        saveWordsSRS();
        addBtn.textContent = "Saved ✓ (due now)";
        addBtn.disabled = true;
      };
    } else {
      addBtn.style.display = "none";
    }
  }
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

function extractVocabWords(phrases = PHRASES) {
  const map = new Map();
  for (const p of phrases) {
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

// PHRASES is immutable at runtime, so the extracted word list only depends on
// cefrFilter. Cache it per-filter so typing in the vocab search box doesn't
// re-tokenize all phrases on every keystroke.
const _vocabWordsCache = new Map();
function getVocabWordsCached() {
  const key = cefrFilter || "all";
  let words = _vocabWordsCache.get(key);
  if (!words) {
    const sourcePhrases = cefrFilter !== "all" ? PHRASES.filter(p => p.level === cefrFilter) : PHRASES;
    words = extractVocabWords(sourcePhrases);
    _vocabWordsCache.set(key, words);
  }
  return words;
}

function renderVocabPanel(search = "") {
  const words = getVocabWordsCached();
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
  document.getElementById("words-panel").style.display = "none";
  document.getElementById("drills-panel").style.display = "none";
  document.getElementById("starters-panel").style.display = "none";
  document.getElementById("speak-panel").style.display = "none";
  document.getElementById("monologue-panel").style.display = "none";
  document.getElementById("games-panel").style.display = "none";
  document.getElementById("vocab-panel").style.display = "flex";
  document.getElementById("vocab-panel-search").value = "";
  vocabPage = 0;
  renderVocabPanel();
}

// ---- Conversation Starters ----

function showStartersPanel() {
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
  hideRecallSpecificEls();
  aiPanel.style.display = "none";
  document.getElementById("progress-panel").style.display = "none";
  document.getElementById("vocab-panel").style.display = "none";
  document.getElementById("grammar-panel").style.display = "none";
  document.getElementById("words-panel").style.display = "none";
  document.getElementById("drills-panel").style.display = "none";
  document.getElementById("speak-panel").style.display = "none";
  document.getElementById("monologue-panel").style.display = "none";
  document.getElementById("games-panel").style.display = "none";
  document.getElementById("starters-panel").style.display = "flex";
  renderStartersPanel("all");
}

let startersCatFilter = "all";

function getStartersPracticedToday() {
  const key = "starters_practiced_" + todayStr();
  try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); } catch { return new Set(); }
}

function markStarterPracticed(id) {
  const key = "starters_practiced_" + todayStr();
  const set = getStartersPracticedToday();
  set.add(id);
  localStorage.setItem(key, JSON.stringify([...set]));
}

function renderStartersPanel(catFilter) {
  startersCatFilter = catFilter || "all";
  const practiced = getStartersPracticedToday();

  document.querySelectorAll(".starter-cat-chip").forEach(c =>
    c.classList.toggle("active", c.dataset.cat === startersCatFilter)
  );

  const list = catFilter === "all" ? STARTERS : STARTERS.filter(s => s.cat === catFilter);
  const progressEl = document.getElementById("starters-progress-count");
  progressEl.textContent = `${practiced.size} / ${STARTERS.length} practiced today`;

  document.getElementById("starters-list").innerHTML = list.map(s => `
    <div class="starter-card${practiced.has(s.id) ? " practiced-today" : ""}" id="starter-card-${s.id}">
      <div class="starter-card-top">
        <span class="starter-cat-badge ${s.cat}">${STARTER_CATEGORIES[s.cat]}</span>
        <span class="starter-level-badge">${s.level.toUpperCase()}</span>
        <span class="starter-practiced-badge">&#10003; Practiced</span>
      </div>
      <div class="starter-german">${s.german}</div>
      <div class="starter-english">${s.english}</div>
      ${s.example ? `<div class="starter-example">&rarr; ${s.example}</div>` : ""}
      <div class="starter-card-actions">
        <button class="starter-hear-card-btn" onclick="starterHear(${s.id})">&#9654; Hear it</button>
        <button class="starter-practice-card-btn" onclick="openStarterPractice(${s.id})">Practice</button>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".starter-cat-chip").forEach(chip => {
    chip.addEventListener("click", () => renderStartersPanel(chip.dataset.cat));
  });
}

function starterHear(id) {
  const s = STARTERS.find(x => x.id === id);
  if (!s) return;
  const utt = new SpeechSynthesisUtterance(s.german);
  utt.lang = "de-DE";
  utt.rate = 0.88;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utt);
}

let starterPracticeId = null;
let starterMicRecording = false;
let starterMicStream = null;
let starterMicWS = null;
let starterMicRecorder = null;

function openStarterPractice(id) {
  const s = STARTERS.find(x => x.id === id);
  if (!s) return;
  starterPracticeId = id;

  document.getElementById("starter-practice-cat").innerHTML =
    `<span class="starter-cat-badge ${s.cat}">${STARTER_CATEGORIES[s.cat]}</span>`;
  document.getElementById("starter-practice-german").textContent = s.german;
  document.getElementById("starter-practice-english").textContent = s.english;
  const exEl = document.getElementById("starter-practice-example");
  if (s.example) { exEl.textContent = "→ " + s.example; exEl.style.display = "block"; }
  else { exEl.style.display = "none"; }
  document.getElementById("starter-practice-transcript").style.display = "none";
  document.getElementById("starter-practice-transcript").textContent = "";
  document.getElementById("starter-practice-status").textContent = "";
  document.getElementById("starter-mic-btn").classList.remove("recording");
  document.getElementById("starter-practice-modal").style.display = "flex";
}

function closeStarterPractice() {
  stopStarterMic();
  window.speechSynthesis && window.speechSynthesis.cancel();
  document.getElementById("starter-practice-modal").style.display = "none";
  starterPracticeId = null;
}

function starterSpeak(rate) {
  const s = STARTERS.find(x => x.id === starterPracticeId);
  if (!s) return;
  const utt = new SpeechSynthesisUtterance(s.german);
  utt.lang = "de-DE";
  utt.rate = rate;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utt);
}

async function startStarterMic() {
  if (starterMicRecording) { stopStarterMic(); return; }
  const statusEl = document.getElementById("starter-practice-status");
  const micBtn = document.getElementById("starter-mic-btn");
  statusEl.textContent = "Connecting...";

  try {
    const tokenRes = await fetch("/api/deepgram-token", { method: "POST" });
    if (!tokenRes.ok) throw new Error("token");
    const { key } = await tokenRes.json();

    starterMicStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const wsUrl = "wss://api.deepgram.com/v1/listen?language=de&model=nova-2-general&interim_results=true&utterance_end_ms=1200&endpointing=500&vad_events=true&encoding=linear16&sample_rate=16000";
    starterMicWS = new WebSocket(wsUrl, ["token", key]);

    starterMicWS.onopen = () => {
      starterMicRecording = true;
      micBtn.classList.add("recording");
      statusEl.textContent = "Listening...";
      starterMicRecorder = new MediaRecorder(starterMicStream, { mimeType: "audio/webm;codecs=opus" });
      starterMicRecorder.ondataavailable = (e) => {
        if (starterMicWS && starterMicWS.readyState === WebSocket.OPEN && e.data.size > 0) starterMicWS.send(e.data);
      };
      starterMicRecorder.start(100);
    };

    let interim = "";
    starterMicWS.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === "Results") {
        const t = msg.channel?.alternatives?.[0]?.transcript || "";
        if (msg.is_final) {
          interim = "";
          if (t.trim()) stopStarterMic(t.trim());
        } else {
          interim = t;
          statusEl.textContent = interim;
        }
      } else if (msg.type === "UtteranceEnd" && interim.trim()) {
        stopStarterMic(interim.trim());
      }
    };

    starterMicWS.onerror = () => stopStarterMic();
    starterMicWS.onclose = () => { if (starterMicRecording) stopStarterMic(); };

  } catch {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { statusEl.textContent = "Mic not available"; return; }
    const sr = new SR();
    sr.lang = "de-DE";
    sr.interimResults = false;
    sr.onresult = (ev) => stopStarterMic(ev.results[0][0].transcript.trim());
    sr.onerror = () => { statusEl.textContent = ""; micBtn.classList.remove("recording"); };
    starterMicRecording = true;
    micBtn.classList.add("recording");
    statusEl.textContent = "Listening...";
    sr.start();
  }
}

function stopStarterMic(transcript) {
  starterMicRecording = false;
  document.getElementById("starter-mic-btn").classList.remove("recording");
  if (starterMicRecorder && starterMicRecorder.state !== "inactive") starterMicRecorder.stop();
  if (starterMicWS) { starterMicWS.close(); starterMicWS = null; }
  if (starterMicStream) { starterMicStream.getTracks().forEach(t => t.stop()); starterMicStream = null; }

  if (transcript) {
    const transcriptEl = document.getElementById("starter-practice-transcript");
    transcriptEl.textContent = `"${transcript}"`;
    transcriptEl.style.display = "block";
    document.getElementById("starter-practice-status").textContent = "";
  } else {
    document.getElementById("starter-practice-status").textContent = "";
  }
}

function starterMarkDone() {
  if (!starterPracticeId) return;
  markStarterPracticed(starterPracticeId);
  const card = document.getElementById("starter-card-" + starterPracticeId);
  if (card) card.classList.add("practiced-today");
  const practiced = getStartersPracticedToday();
  document.getElementById("starters-progress-count").textContent = `${practiced.size} / ${STARTERS.length} practiced today`;
  closeStarterPractice();
}

function setupStarterPracticeModal() {
  document.getElementById("starter-practice-close").addEventListener("click", closeStarterPractice);
  document.getElementById("starter-practice-modal").addEventListener("click", e => {
    if (e.target === document.getElementById("starter-practice-modal")) closeStarterPractice();
  });
  document.getElementById("starter-hear-slow-btn").addEventListener("click", () => starterSpeak(0.6));
  document.getElementById("starter-hear-btn").addEventListener("click", () => starterSpeak(0.9));
  document.getElementById("starter-mic-btn").addEventListener("click", startStarterMic);
  document.getElementById("starter-mark-done-btn").addEventListener("click", starterMarkDone);
}

// ---- Just Say It (Speak) ----

const SPEAK_PROMPTS = [
  // Classroom - asking professor
  { id:1,  cat:"classroom", prompt:"Your professor just explained the Dativ case and asks if anyone has questions. Explain what you understood and ask one thing you are unsure about.", hint:"Try: 'Ich habe verstanden, dass... Aber ich bin nicht sicher, ob...'" },
  { id:2,  cat:"classroom", prompt:"You arrived 5 minutes late to the online class. Apologize to the professor and briefly explain why.", hint:"Try: 'Entschuldigung, ich bin zu spät, weil...'" },
  { id:3,  cat:"classroom", prompt:"The professor assigns a group task. Ask your partner what they think you should do first.", hint:"Try: 'Was denkst du, was sollen wir zuerst machen?'" },
  { id:4,  cat:"classroom", prompt:"The professor asks you to summarize what you learned in the last lesson. Speak for as long as you can.", hint:"Try: 'In der letzten Stunde haben wir... gelernt.'" },
  { id:5,  cat:"classroom", prompt:"You don't understand the homework. Ask the professor to explain it again and say specifically what confused you.", hint:"Try: 'Ich verstehe die Aufgabe nicht ganz. Könnten Sie... erklären?'" },
  { id:6,  cat:"classroom", prompt:"Your professor asks for your opinion on a short German text you just read. Share your thoughts.", hint:"Try: 'Ich finde den Text... weil...'" },
  // Daily life
  { id:7,  cat:"daily",     prompt:"Describe your morning routine today entirely in German. What did you do from waking up to joining this session?", hint:"Try: 'Heute Morgen bin ich um... Uhr aufgewacht und dann...'" },
  { id:8,  cat:"daily",     prompt:"You are at a German supermarket and can't find the bread aisle. Ask a staff member for help and have a short conversation.", hint:"Try: 'Entschuldigung, wo finde ich... bitte?'" },
  { id:9,  cat:"daily",     prompt:"Tell a classmate about your weekend plans in German. Include at least two activities.", hint:"Try: 'Am Wochenende möchte ich... und vielleicht auch...'" },
  { id:10, cat:"daily",     prompt:"You are ordering coffee in a German café. The barista asks for your name and whether you want it to go or stay. Handle the whole exchange.", hint:"Try: 'Ich hätte gerne einen... Mein Name ist..., und ich nehme es mit.'" },
  // Opinion / discussion
  { id:11, cat:"opinion",   prompt:"Your classmate says learning German grammar is impossible. Agree or disagree and explain why.", hint:"Try: 'Ich stimme dir (nicht) zu, weil...' or 'Ich sehe das ein bisschen anders...'" },
  { id:12, cat:"opinion",   prompt:"The professor asks: what is the hardest thing about speaking German for you? Be honest and explain.", hint:"Try: 'Das Schwierigste für mich ist..., weil...'" },
  { id:13, cat:"opinion",   prompt:"Describe your favourite German word you have learned so far and explain why you like it.", hint:"Try: 'Mein Lieblingswort auf Deutsch ist... weil es...'" },
  { id:14, cat:"opinion",   prompt:"Someone asks whether you prefer learning German online or in person. Give your opinion with reasons.", hint:"Try: 'Ich bevorzuge... weil... Allerdings...'" },
  // Storytelling
  { id:15, cat:"story",     prompt:"Tell a short story about a time something went wrong during your day - in German.", hint:"Try: 'Gestern ist etwas Lustiges passiert. Ich wollte... aber...'" },
  { id:16, cat:"story",     prompt:"Describe a place that is important to you - your room, a park, a city. Paint the picture in German.", hint:"Try: 'Es gibt einen Ort, der mir sehr wichtig ist. Er ist...'" },
  { id:17, cat:"story",     prompt:"Tell your classmate about a movie or show you recently watched. What happened and did you like it?", hint:"Try: 'Ich habe letztens... gesehen. Es handelt von... Ich finde es...'" },
  // Escape / buy-time practice
  { id:18, cat:"escape",    prompt:"The professor calls on you suddenly and you are not sure of the answer. Buy time, try your best, and wrap up gracefully.", hint:"Try: 'Einen Moment bitte... Ich glaube, dass... Ich bin mir aber nicht ganz sicher.'" },
  { id:19, cat:"escape",    prompt:"You forget a key word mid-sentence while explaining something in class. Work around it out loud in German.", hint:"Try: 'Wie sagt man... auf Deutsch? Ich meine das Wort für...' then keep going." },
  { id:20, cat:"escape",    prompt:"You are asked a question in German that you completely do not understand. Ask for clarification politely, twice if needed, then attempt an answer.", hint:"Try: 'Entschuldigung, könnten Sie das bitte wiederholen? Meinen Sie...?'" },
];

const SPEAK_DURATION = 60;
const SPEAK_CIRCUMFERENCE = 2 * Math.PI * 44;

let speakPromptIndex = 0;
let speakTimerInterval = null;
let speakSecondsLeft = SPEAK_DURATION;
let speakMicStream = null;
let speakMicWS = null;
let speakMicRecorder = null;
let speakTranscriptChunks = [];
let speakIsRecording = false;

function showSpeakPanel() {
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
  hideRecallSpecificEls();
  aiPanel.style.display = "none";
  document.getElementById("progress-panel").style.display = "none";
  document.getElementById("vocab-panel").style.display = "none";
  document.getElementById("grammar-panel").style.display = "none";
  document.getElementById("words-panel").style.display = "none";
  document.getElementById("drills-panel").style.display = "none";
  document.getElementById("starters-panel").style.display = "none";
  document.getElementById("speak-panel").style.display = "none";
  document.getElementById("monologue-panel").style.display = "none";
  document.getElementById("games-panel").style.display = "none";
  document.getElementById("speak-panel").style.display = "flex";
  initSpeakPanel();
}

function initSpeakPanel() {
  speakStopRecording();
  speakClearTimer();
  speakPromptIndex = shuffleSpeakIndex();
  renderSpeakPrompt();
  updateSpeakStreak();
  document.getElementById("speak-feedback-area").style.display = "none";
  document.getElementById("speak-sample-wrap").style.display = "none";
  document.getElementById("speak-improve-area").style.display = "none";
  document.getElementById("speak-improve-btn").style.display = "none";
  document.getElementById("speak-transcript-area").style.display = "none";
  document.getElementById("speak-actions").style.display = "flex";
  document.getElementById("speak-start-btn").disabled = false;
  document.getElementById("speak-start-btn").textContent = "▶ Start Speaking";
  document.getElementById("speak-start-btn").classList.remove("recording");
  setSpeakTimerDisplay(SPEAK_DURATION);
  setSpeakArc(1);
}

function shuffleSpeakIndex() {
  return Math.floor(Math.random() * SPEAK_PROMPTS.length);
}

function renderSpeakPrompt() {
  const p = SPEAK_PROMPTS[speakPromptIndex];
  document.getElementById("speak-scenario-text").textContent = p.prompt;
  document.getElementById("speak-scenario-hint").textContent = p.hint;
}

function updateSpeakStreak() {
  const streak = getSpeakStreak();
  const badge = document.getElementById("speak-streak-badge");
  if (streak > 0) {
    badge.textContent = "🔥 " + streak + " day streak";
    badge.classList.add("visible");
  } else {
    badge.classList.remove("visible");
  }
}

function getSpeakStreak() {
  try {
    const data = JSON.parse(localStorage.getItem("speak_streak") || "{}");
    const today = todayStr();
    const yesterday = daysAgoStr(1);
    if (data.last === today) return data.count || 0;
    if (data.last === yesterday) return data.count || 0;
    return 0;
  } catch { return 0; }
}

function recordSpeakDone() {
  try {
    const today = todayStr();
    const yesterday = daysAgoStr(1);
    const data = JSON.parse(localStorage.getItem("speak_streak") || "{}");
    if (data.last === today) return;
    const newCount = (data.last === yesterday) ? (data.count || 0) + 1 : 1;
    localStorage.setItem("speak_streak", JSON.stringify({ last: today, count: newCount }));
  } catch {}
}

function setSpeakTimerDisplay(seconds) {
  document.getElementById("speak-timer-display").textContent = seconds;
}

function setSpeakArc(fraction) {
  const arc = document.getElementById("speak-timer-arc");
  arc.style.strokeDashoffset = SPEAK_CIRCUMFERENCE * (1 - fraction);
  if (fraction <= 0.25) arc.classList.add("low-time");
  else arc.classList.remove("low-time");
}

function speakClearTimer() {
  if (speakTimerInterval) { clearInterval(speakTimerInterval); speakTimerInterval = null; }
  speakSecondsLeft = SPEAK_DURATION;
}

async function speakStartRecording() {
  if (speakIsRecording) return;
  speakTranscriptChunks = [];
  document.getElementById("speak-transcript-text").textContent = "";
  document.getElementById("speak-transcript-area").style.display = "none";
  speakIsRecording = true;
  document.getElementById("speak-start-btn").textContent = "Listening…";
  document.getElementById("speak-start-btn").classList.add("recording");
  document.getElementById("speak-start-btn").disabled = true;

  try {
    const tokenRes = await fetch("/api/deepgram-token", { method: "POST" });
    if (!tokenRes.ok) throw new Error("token");
    const { key } = await tokenRes.json();
    speakMicStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const wsUrl = "wss://api.deepgram.com/v1/listen?language=de&model=nova-2-general&interim_results=true&endpointing=800&vad_events=true&encoding=linear16&sample_rate=16000";
    speakMicWS = new WebSocket(wsUrl, ["token", key]);

    speakMicWS.onopen = () => {
      speakMicRecorder = new MediaRecorder(speakMicStream, { mimeType: "audio/webm;codecs=opus" });
      speakMicRecorder.ondataavailable = (e) => {
        if (speakMicWS && speakMicWS.readyState === WebSocket.OPEN && e.data.size > 0) speakMicWS.send(e.data);
      };
      speakMicRecorder.start(100);
    };

    speakMicWS.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === "Results" && msg.is_final) {
        const t = msg.channel?.alternatives?.[0]?.transcript || "";
        if (t.trim()) {
          speakTranscriptChunks.push(t.trim());
          document.getElementById("speak-transcript-text").textContent = speakTranscriptChunks.join(" ");
          document.getElementById("speak-transcript-area").style.display = "flex";
        }
      }
    };
    speakMicWS.onerror = () => {};
    speakMicWS.onclose = () => {};
  } catch {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const sr = new SR();
      sr.lang = "de-DE";
      sr.interimResults = false;
      sr.continuous = true;
      sr.onresult = (ev) => {
        const t = ev.results[ev.results.length - 1][0].transcript.trim();
        if (t) {
          speakTranscriptChunks.push(t);
          document.getElementById("speak-transcript-text").textContent = speakTranscriptChunks.join(" ");
          document.getElementById("speak-transcript-area").style.display = "flex";
        }
      };
      sr.start();
      speakMicWS = { _sr: sr, close: () => sr.stop() };
    }
  }

  speakSecondsLeft = SPEAK_DURATION;
  setSpeakTimerDisplay(speakSecondsLeft);
  setSpeakArc(1);
  speakTimerInterval = setInterval(() => {
    speakSecondsLeft--;
    setSpeakTimerDisplay(speakSecondsLeft);
    setSpeakArc(speakSecondsLeft / SPEAK_DURATION);
    if (speakSecondsLeft <= 0) speakTimeUp();
  }, 1000);
}

function speakStopRecording() {
  speakIsRecording = false;
  if (speakMicRecorder && speakMicRecorder.state !== "inactive") speakMicRecorder.stop();
  if (speakMicWS) { speakMicWS.close(); speakMicWS = null; }
  if (speakMicStream) { speakMicStream.getTracks().forEach(t => t.stop()); speakMicStream = null; }
  speakMicRecorder = null;
}

async function speakTimeUp() {
  speakClearTimer();
  speakStopRecording();
  setSpeakTimerDisplay(0);
  setSpeakArc(0);
  recordSpeakDone();
  updateSpeakStreak();
  awardXP(10, "Sprechen");
  todayOnSpeakDone();

  document.getElementById("speak-actions").style.display = "none";
  document.getElementById("speak-start-btn").disabled = false;
  document.getElementById("speak-start-btn").classList.remove("recording");

  const transcript = speakTranscriptChunks.join(" ").trim();
  const prompt = SPEAK_PROMPTS[speakPromptIndex].prompt;

  document.getElementById("speak-feedback-area").style.display = "flex";
  document.getElementById("speak-improve-area").style.display = "none";
  document.getElementById("speak-improve-btn").style.display = "none";
  document.getElementById("speak-feedback-text").textContent = "Getting feedback…";
  document.getElementById("speak-next-btn").disabled = true;

  if (transcript.length > 5) {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "speak-check", text: transcript, prompt }),
      });
      const data = await parseApiResponse(res);
      document.getElementById("speak-feedback-text").textContent =
        data.feedback || "Good effort! Keep practicing.";
      if (data.sample) {
        document.getElementById("speak-sample-text").textContent = data.sample;
        document.getElementById("speak-sample-wrap").style.display = "";
        logError("speak", transcript, data.sample, data.feedback);
      }
      document.getElementById("speak-improve-btn").style.display = "block";
    } catch {
      document.getElementById("speak-feedback-text").textContent =
        "Could not get feedback right now - but great job speaking!";
    }
  } else {
    document.getElementById("speak-feedback-text").textContent =
      "No speech detected. Make sure your microphone is on and try again!";
  }

  document.getElementById("speak-next-btn").disabled = false;
}

async function speakGetImproved() {
  const transcript = speakTranscriptChunks.join(" ").trim();
  const prompt = SPEAK_PROMPTS[speakPromptIndex].prompt;
  const btn = document.getElementById("speak-improve-btn");
  btn.disabled = true;
  btn.textContent = "Loading…";

  document.getElementById("speak-improve-area").style.display = "flex";
  document.getElementById("speak-improve-text").textContent = "Generating polished version…";
  document.getElementById("speak-improve-notes-wrap").style.display = "none";
  document.getElementById("speak-improve-add-prompt").style.display = "none";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "speak-improve", text: transcript, prompt }),
    });
    const data = await parseApiResponse(res);

    document.getElementById("speak-improve-text").textContent = data.improved || transcript;

    if (data.notes && data.notes.length > 0) {
      const ul = document.getElementById("speak-improve-notes");
      ul.innerHTML = data.notes.map(n => `<li>${n}</li>`).join("");
      document.getElementById("speak-improve-notes-wrap").style.display = "flex";
    }

    if (data.new_phrases && data.new_phrases.length > 0) {
      document.getElementById("speak-improve-add-text").textContent =
        `${data.new_phrases.length} phrase${data.new_phrases.length > 1 ? "s" : ""} here could go in your Starters library.`;
      document.getElementById("speak-improve-add-prompt").style.display = "flex";
      document.getElementById("speak-add-phrases-btn").onclick = () =>
        speakAddPhrasesToStarters(data.new_phrases);
    }
  } catch {
    document.getElementById("speak-improve-text").textContent =
      "Could not generate the polished version right now. Try again.";
  }

  btn.disabled = false;
  btn.textContent = "✨ Show me a polished version";
}

function speakCopyImproved() {
  const text = document.getElementById("speak-improve-text").textContent;
  if (!text || text.includes("Generating")) return;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("speak-copy-btn");
    btn.textContent = "✓ Copied";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = "📋 Copy";
      btn.classList.remove("copied");
    }, 2000);
  }).catch(() => {});
}

function speakAddPhrasesToStarters(phrases) {
  const btn = document.getElementById("speak-add-phrases-btn");
  btn.disabled = true;
  let added = 0;
  const maxId = STARTERS.reduce((m, s) => Math.max(m, s.id), 0);
  phrases.forEach((p, i) => {
    if (p.german && p.english) {
      STARTERS.push({
        id: maxId + i + 1,
        cat: "classroom",
        german: p.german,
        english: p.english,
        example: p.example || "",
        level: p.level || "b1",
      });
      added++;
    }
  });
  document.getElementById("speak-improve-add-text").textContent =
    `${added} phrase${added !== 1 ? "s" : ""} added to your Starters tab.`;
  btn.textContent = "✓ Added";
}

function speakSkip() {
  speakClearTimer();
  speakStopRecording();
  speakPromptIndex = (speakPromptIndex + 1) % SPEAK_PROMPTS.length;
  renderSpeakPrompt();
  document.getElementById("speak-feedback-area").style.display = "none";
  document.getElementById("speak-sample-wrap").style.display = "none";
  document.getElementById("speak-improve-area").style.display = "none";
  document.getElementById("speak-improve-btn").style.display = "none";
  document.getElementById("speak-transcript-area").style.display = "none";
  document.getElementById("speak-actions").style.display = "flex";
  document.getElementById("speak-start-btn").disabled = false;
  document.getElementById("speak-start-btn").textContent = "▶ Start Speaking";
  document.getElementById("speak-start-btn").classList.remove("recording");
  setSpeakTimerDisplay(SPEAK_DURATION);
  setSpeakArc(1);
}

function setupSpeakPanel() {
  document.getElementById("speak-start-btn").addEventListener("click", () => {
    if (!speakIsRecording) speakStartRecording();
  });
  document.getElementById("speak-skip-btn").addEventListener("click", speakSkip);
  document.getElementById("speak-next-btn").addEventListener("click", () => {
    speakPromptIndex = (speakPromptIndex + 1) % SPEAK_PROMPTS.length;
    initSpeakPanel();
  });
  document.getElementById("speak-improve-btn").addEventListener("click", speakGetImproved);
  document.getElementById("speak-copy-btn").addEventListener("click", speakCopyImproved);
}

// ---- Think in German (Inner Monologue) ----

const MONOLOGUE_PROMPTS = [
  // Observation
  { id:1,  cat:"observe", prompt:"Describe everything you can see around you right now. What colours, objects, and people do you notice?" },
  { id:2,  cat:"observe", prompt:"Look at the room you are in. Describe it as if you are explaining it to someone who cannot see it." },
  { id:3,  cat:"observe", prompt:"What is the weather like right now? Describe it in detail - sky, temperature, sound, how it makes you feel." },
  { id:4,  cat:"observe", prompt:"Describe what you are wearing today and why you chose it." },
  // Reflection
  { id:5,  cat:"reflect", prompt:"What was the most interesting thing you learned in German class this week? Try to explain it in your own words." },
  { id:6,  cat:"reflect", prompt:"What is one thing you want to say in German but always struggle to start? Write it out now - imperfectly is fine." },
  { id:7,  cat:"reflect", prompt:"Think about your day so far. What happened? Write a short journal entry in German." },
  { id:8,  cat:"reflect", prompt:"What is one German word or phrase you learned recently that you want to remember? Use it in three sentences." },
  { id:9,  cat:"reflect", prompt:"What do you find hardest about thinking in German? Describe the feeling and what happens when you try." },
  // Imagination
  { id:10, cat:"imagine", prompt:"Imagine you are a German-speaking exchange student on your first day at a university in Munich. What do you see, hear, and feel?" },
  { id:11, cat:"imagine", prompt:"You are at a Berlin Christmas market. Describe the sights, smells, sounds, and what you would buy." },
  { id:12, cat:"imagine", prompt:"Imagine explaining your hometown to a German friend who has never heard of it. What would you say?" },
  { id:13, cat:"imagine", prompt:"You meet your German professor at a café by coincidence. What do you say? Write the whole conversation." },
  // Opinion
  { id:14, cat:"opinion", prompt:"What do you think about learning languages online? What are the advantages and disadvantages?" },
  { id:15, cat:"opinion", prompt:"If you could choose any German-speaking city to live in for one year, which would you choose and why?" },
  { id:16, cat:"opinion", prompt:"Is it harder to learn grammar rules or to find the confidence to speak? What do you think?" },
  { id:17, cat:"opinion", prompt:"What motivates you to learn German? Write honestly - what is your real reason?" },
  // Course-specific
  { id:18, cat:"course",  prompt:"Imagine the professor asks you tomorrow: 'Was haben Sie letzte Woche gemacht?' Write your answer now so you are ready." },
  { id:19, cat:"course",  prompt:"There is a group discussion in class about hobbies. Write what you would say to introduce yourself and your interests in German." },
  { id:20, cat:"course",  prompt:"Your professor gives you unexpected praise. Write down what you would say in response - in German, politely and naturally." },
  { id:21, cat:"course",  prompt:"A classmate asks you to explain Dativ prepositions. How would you explain it to them in simple German?" },
  { id:22, cat:"course",  prompt:"Write a short message to your professor asking for an extension on an assignment. Be polite and give a reason." },
  { id:23, cat:"course",  prompt:"Describe your ideal German class. What would the teacher be like? What would you practise?" },
];

let monologuePromptIndex = 0;
let monologueDoneToday = 0;

function showMonologuePanel() {
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
  hideRecallSpecificEls();
  aiPanel.style.display = "none";
  document.getElementById("progress-panel").style.display = "none";
  document.getElementById("vocab-panel").style.display = "none";
  document.getElementById("grammar-panel").style.display = "none";
  document.getElementById("words-panel").style.display = "none";
  document.getElementById("drills-panel").style.display = "none";
  document.getElementById("starters-panel").style.display = "none";
  document.getElementById("speak-panel").style.display = "none";
  document.getElementById("monologue-panel").style.display = "none";
  document.getElementById("games-panel").style.display = "none";
  document.getElementById("monologue-panel").style.display = "flex";
  initMonologuePanel();
}

function initMonologuePanel() {
  monologuePromptIndex = Math.floor(Math.random() * MONOLOGUE_PROMPTS.length);
  monologueDoneToday = getMonologueDoneToday();
  renderMonologuePrompt();
  updateMonologueStreak();
  updateMonologueCount();
  document.getElementById("monologue-input").value = "";
  document.getElementById("monologue-submit-btn").disabled = true;
  document.getElementById("monologue-char-hint").textContent = "";
  document.getElementById("monologue-reflection-area").style.display = "none";
  document.getElementById("monologue-submit-btn").textContent = "Reflect →";
}

function renderMonologuePrompt() {
  const p = MONOLOGUE_PROMPTS[monologuePromptIndex];
  document.getElementById("monologue-prompt-text").textContent = p.prompt;
}

function getMonologueDoneToday() {
  try {
    const key = "monologue_done_" + todayStr();
    return parseInt(localStorage.getItem(key) || "0", 10);
  } catch { return 0; }
}

function recordMonologueDone() {
  try {
    const today = todayStr();
    const key = "monologue_done_" + today;
    const n = parseInt(localStorage.getItem(key) || "0", 10) + 1;
    localStorage.setItem(key, String(n));
    monologueDoneToday = n;

    const streakKey = "monologue_streak";
    const yesterday = daysAgoStr(1);
    const data = JSON.parse(localStorage.getItem(streakKey) || "{}");
    if (data.last === today) return;
    const newCount = (data.last === yesterday) ? (data.count || 0) + 1 : 1;
    localStorage.setItem(streakKey, JSON.stringify({ last: today, count: newCount }));
  } catch {}
}

function getMonologueStreak() {
  try {
    const data = JSON.parse(localStorage.getItem("monologue_streak") || "{}");
    const today = todayStr();
    const yesterday = daysAgoStr(1);
    if (data.last === today || data.last === yesterday) return data.count || 0;
    return 0;
  } catch { return 0; }
}

function updateMonologueStreak() {
  const streak = getMonologueStreak();
  const badge = document.getElementById("monologue-streak-badge");
  if (streak > 0) {
    badge.textContent = streak + " day streak";
    badge.classList.add("visible");
  } else {
    badge.classList.remove("visible");
  }
}

function updateMonologueCount() {
  document.getElementById("monologue-count-num").textContent = String(monologueDoneToday);
}

async function submitMonologue() {
  const text = document.getElementById("monologue-input").value.trim();
  if (text.length < 10) return;

  const btn = document.getElementById("monologue-submit-btn");
  btn.disabled = true;
  btn.textContent = "Thinking…";
  document.getElementById("monologue-reflection-area").style.display = "none";

  const prompt = MONOLOGUE_PROMPTS[monologuePromptIndex].prompt;
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "monologue-reflect", text, prompt }),
    });
    const data = await parseApiResponse(res);
    document.getElementById("monologue-reflection-text").textContent =
      data.reflection || "Good thinking! Keep writing in German every day.";
  } catch {
    document.getElementById("monologue-reflection-text").textContent =
      "Could not get a reflection right now - but great job writing in German!";
  }

  recordMonologueDone();
  updateMonologueCount();
  updateMonologueStreak();
  awardXP(10, "Denken");
  todayOnThinkDone();
  document.getElementById("monologue-reflection-area").style.display = "flex";
  btn.textContent = "Reflect →";
  btn.disabled = false;
}

function setupMonologuePanel() {
  const input = document.getElementById("monologue-input");
  const submitBtn = document.getElementById("monologue-submit-btn");
  const charHint = document.getElementById("monologue-char-hint");

  input.addEventListener("input", () => {
    const len = input.value.trim().length;
    submitBtn.disabled = len < 10;
    if (len === 0) { charHint.textContent = ""; }
    else if (len < 10) { charHint.textContent = `${10 - len} more characters to unlock reflection`; }
    else { charHint.textContent = `${len} characters`; }
  });

  submitBtn.addEventListener("click", submitMonologue);

  document.getElementById("monologue-new-prompt-btn").addEventListener("click", () => {
    monologuePromptIndex = (monologuePromptIndex + 1) % MONOLOGUE_PROMPTS.length;
    renderMonologuePrompt();
    document.getElementById("monologue-reflection-area").style.display = "none";
    input.value = "";
    submitBtn.disabled = true;
    charHint.textContent = "";
  });

  document.getElementById("monologue-another-btn").addEventListener("click", () => {
    monologuePromptIndex = (monologuePromptIndex + 1) % MONOLOGUE_PROMPTS.length;
    initMonologuePanel();
  });
}

// ---- Today: guided daily session ----
// One ~15-minute flow: due phrase reviews -> due words -> 1 Speak scenario
// -> 1 Think prompt. Steps advance via the sticky session bar.

const TODAY_STEPS = [
  { id: "phrases", label: "Phrases", tabMode: "recall" },
  { id: "words", label: "Words", tabMode: "words" },
  { id: "story", label: "Story", tabMode: "stories" },
  { id: "speak", label: "Speak", tabMode: "speak" },
  { id: "think", label: "Think", tabMode: "monologue" },
];
const TODAY_PHRASE_TARGET = 8;
const TODAY_WORD_TARGET = 10;

let todaySession = null;

function countDuePhrases() {
  let due = 0, fresh = 0;
  (typeof PHRASES !== "undefined" ? PHRASES : []).forEach(p => {
    const st = getStatus(p.id);
    if (st === "due") due++;
    else if (st === "new") fresh++;
  });
  return { due, fresh };
}

function countDueWords() {
  let due = 0, fresh = 0;
  (typeof WORDS !== "undefined" ? WORDS : []).forEach(w => {
    const st = getWordStatus(w.id);
    if (st === "due") due++;
    else if (st === "new") fresh++;
  });
  return { due, fresh };
}

function getTodayStreak() {
  try {
    const data = JSON.parse(localStorage.getItem("today_streak") || "{}");
    const today = todayStr();
    const yesterday = daysAgoStr(1);
    if (data.last === today || data.last === yesterday) return data.count || 0;
    return 0;
  } catch { return 0; }
}

function isTodaySessionDoneToday() {
  try {
    return JSON.parse(localStorage.getItem("today_streak") || "{}").last === todayStr();
  } catch { return false; }
}

function recordTodaySessionDone() {
  try {
    const today = todayStr();
    const yesterday = daysAgoStr(1);
    const data = JSON.parse(localStorage.getItem("today_streak") || "{}");
    if (data.last === today) return;
    const newCount = (data.last === yesterday) ? (data.count || 0) + 1 : 1;
    localStorage.setItem("today_streak", JSON.stringify({ last: today, count: newCount }));
    awardXP(20, "Session komplett");
  } catch {}
}

function showTodayPanel() {
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
  hideRecallSpecificEls();
  aiPanel.style.display = "none";
  ["progress-panel", "vocab-panel", "grammar-panel", "words-panel", "drills-panel",
   "starters-panel", "speak-panel", "monologue-panel", "games-panel", "stories-panel",
   "exam-panel"].forEach(id => {
    document.getElementById(id).style.display = "none";
  });
  document.getElementById("today-panel").style.display = "flex";
  renderTodayPanel();
}

function renderTodayPanel() {
  const phrases = countDuePhrases();
  const words = countDueWords();
  const mistakes = Object.keys(getDrillMistakeBank()).length;
  const streak = getTodayStreak();
  const doneToday = isTodaySessionDoneToday();

  document.getElementById("today-date-line").textContent =
    new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  document.getElementById("today-phrases-due").textContent = phrases.due;
  document.getElementById("today-words-due").textContent = words.due;
  document.getElementById("today-mistakes-count").textContent = mistakes;
  document.getElementById("today-streak-num").textContent = streak;

  const badge = document.getElementById("today-streak-badge");
  if (streak > 0) {
    badge.textContent = "🔥 " + streak + " day streak";
    badge.classList.add("visible");
  } else {
    badge.classList.remove("visible");
  }

  const btn = document.getElementById("today-start-btn");
  if (todaySession) btn.textContent = "▶ Resume session";
  else if (doneToday) btn.textContent = "✓ Done today — go again";
  else btn.textContent = "▶ Start today's session (~20 min)";

  const phraseTotal = Math.min(TODAY_PHRASE_TARGET, phrases.due + phrases.fresh);
  const wordTotal = Math.min(TODAY_WORD_TARGET, words.due + words.fresh);
  const details = {
    phrases: phraseTotal > 0 ? `${phraseTotal} cards · ${phrases.due} due` : "nothing due",
    words: wordTotal > 0 ? `${wordTotal} words · ${words.due} due` : "nothing due",
    story: "1 episode · quiz + word check",
    speak: "1 scenario · 60 seconds",
    think: "1 prompt · write freely",
  };
  document.getElementById("today-plan").innerHTML = TODAY_STEPS.map((s, i) => {
    const done = todaySession ? i < todaySession.step : doneToday;
    const current = todaySession && i === todaySession.step;
    return `<div class="today-plan-row${done ? " done" : ""}${current ? " current" : ""}">
      <span class="today-plan-num">${done ? "✓" : i + 1}</span>
      <span class="today-plan-name">${s.label}</span>
      <span class="today-plan-detail">${details[s.id]}</span>
    </div>`;
  }).join("");

  const hint = document.getElementById("today-mistakes-hint");
  if (mistakes > 0) {
    document.getElementById("today-mistakes-hint-text").textContent =
      `${mistakes} drill mistake${mistakes !== 1 ? "s" : ""} waiting for review.`;
    hint.style.display = "flex";
  } else {
    hint.style.display = "none";
  }
}

function startTodaySession() {
  const phrases = countDuePhrases();
  const words = countDueWords();
  todaySession = {
    step: 0,
    phrasesDone: 0,
    phrasesTarget: Math.min(TODAY_PHRASE_TARGET, phrases.due + phrases.fresh),
    wordsDone: 0,
    wordsTarget: Math.min(TODAY_WORD_TARGET, words.due + words.fresh),
    storyDone: false,
    speakDone: false,
    thinkDone: false,
  };
  enterTodayStep();
}

function todayStepComplete() {
  if (!todaySession) return false;
  const s = TODAY_STEPS[todaySession.step];
  if (!s) return false;
  if (s.id === "phrases") return todaySession.phrasesDone >= todaySession.phrasesTarget;
  if (s.id === "words") return todaySession.wordsDone >= todaySession.wordsTarget;
  if (s.id === "story") return todaySession.storyDone;
  if (s.id === "speak") return todaySession.speakDone;
  if (s.id === "think") return todaySession.thinkDone;
  return false;
}

function todayStepHasNothingToDo() {
  const s = TODAY_STEPS[todaySession.step];
  if (s.id === "phrases") return todaySession.phrasesTarget === 0;
  if (s.id === "words") return todaySession.wordsTarget === 0;
  return false;
}

function enterTodayStep() {
  if (!todaySession) return;
  while (todaySession.step < TODAY_STEPS.length && todayStepHasNothingToDo()) {
    todaySession.step++;
  }
  if (todaySession.step >= TODAY_STEPS.length) {
    completeTodaySession();
    return;
  }
  const s = TODAY_STEPS[todaySession.step];
  const tab = document.querySelector(`.tab[data-mode="${s.tabMode}"]`);
  if (tab) tab.click();
  renderTodaySessionBar();
}

function renderTodaySessionBar() {
  if (!todaySession) return;
  document.getElementById("today-session-bar").style.display = "flex";
  document.getElementById("tsb-steps").innerHTML = TODAY_STEPS.map((s, i) => {
    const cls = i < todaySession.step ? "tsb-dot done"
      : i === todaySession.step ? "tsb-dot current" : "tsb-dot";
    return `<span class="${cls}"></span>`;
  }).join("");
  const s = TODAY_STEPS[todaySession.step];
  let label = s.label;
  if (s.id === "phrases") label = `Phrases ${todaySession.phrasesDone}/${todaySession.phrasesTarget}`;
  else if (s.id === "words") label = `Words ${todaySession.wordsDone}/${todaySession.wordsTarget}`;
  else if (s.id === "story") label = "Story: read today's episode + quiz";
  else if (s.id === "speak") label = "Speak: finish 1 scenario";
  else if (s.id === "think") label = "Think: submit 1 prompt";
  const complete = todayStepComplete();
  document.getElementById("tsb-label").textContent = complete ? `${s.label} done ✓` : label;
  document.getElementById("tsb-next-btn").style.display = complete ? "inline-block" : "none";
  document.getElementById("tsb-skip-btn").style.display = complete ? "none" : "inline-block";
  document.getElementById("tsb-next-btn").textContent =
    todaySession.step === TODAY_STEPS.length - 1 ? "Finish 🎉" : "Continue →";
}

function advanceTodayStep() {
  if (!todaySession) return;
  todaySession.step++;
  if (todaySession.step >= TODAY_STEPS.length) completeTodaySession();
  else enterTodayStep();
}

function completeTodaySession() {
  recordTodaySessionDone();
  todaySession = null;
  document.getElementById("today-session-bar").style.display = "none";
  const todayTab = document.querySelector('.tab[data-mode="today"]');
  if (todayTab) todayTab.click();
}

function endTodaySession() {
  todaySession = null;
  document.getElementById("today-session-bar").style.display = "none";
  if (mode === "today") renderTodayPanel();
}

// Hooks called from the grading paths of each step's mode
function todayOnPhraseGraded() {
  if (!todaySession || mode !== "recall") return;
  if (TODAY_STEPS[todaySession.step].id !== "phrases") return;
  todaySession.phrasesDone++;
  renderTodaySessionBar();
}

function todayOnWordGraded() {
  if (!todaySession || mode !== "words") return;
  if (TODAY_STEPS[todaySession.step].id !== "words") return;
  todaySession.wordsDone++;
  renderTodaySessionBar();
}

function todayOnStoryDone() {
  if (!todaySession || TODAY_STEPS[todaySession.step].id !== "story") return;
  todaySession.storyDone = true;
  renderTodaySessionBar();
}

function todayOnSpeakDone() {
  if (!todaySession || TODAY_STEPS[todaySession.step].id !== "speak") return;
  todaySession.speakDone = true;
  renderTodaySessionBar();
}

function todayOnThinkDone() {
  if (!todaySession || TODAY_STEPS[todaySession.step].id !== "think") return;
  todaySession.thinkDone = true;
  renderTodaySessionBar();
}

function setupTodayPanel() {
  document.getElementById("today-start-btn").addEventListener("click", () => {
    if (todaySession) enterTodayStep();
    else startTodaySession();
  });
  document.getElementById("tsb-next-btn").addEventListener("click", advanceTodayStep);
  document.getElementById("tsb-skip-btn").addEventListener("click", advanceTodayStep);
  document.getElementById("tsb-end-btn").addEventListener("click", endTodaySession);
  document.getElementById("today-fix-mistakes-btn").addEventListener("click", () => {
    const tab = document.querySelector('.tab[data-mode="drills"]');
    if (tab) tab.click();
  });
}

// ---- Due-count tab badges ----
function updateTabBadges() {
  const setBadge = (modeName, count) => {
    document.querySelectorAll(`[data-mode="${modeName}"] .tab-badge`).forEach(el => {
      el.textContent = count > 99 ? "99+" : String(count);
      el.classList.toggle("visible", count > 0);
    });
  };
  const phraseDue = countDuePhrases().due;
  const wordDue = countDueWords().due;
  setBadge("recall", phraseDue);
  setBadge("words", wordDue);

  // Words lives in the More sheet on mobile - surface its due count there
  const moreBtn = document.getElementById("more-tab");
  if (moreBtn) {
    let dot = moreBtn.querySelector(".tab-badge");
    if (!dot) {
      dot = document.createElement("span");
      dot.className = "tab-badge";
      moreBtn.appendChild(dot);
    }
    dot.textContent = wordDue > 99 ? "99+" : String(wordDue);
    dot.classList.toggle("visible", wordDue > 0);
  }
}

// ---- Stories: AI graded reader that recycles SRS vocabulary ----

let currentStory = null;
let storyPlayAllActive = false;

function getStoriesReadCount() {
  try { return parseInt(localStorage.getItem("stories_read_count") || "0", 10); } catch { return 0; }
}

function recordStoryRead() {
  try {
    localStorage.setItem("stories_read_count", String(getStoriesReadCount() + 1));
  } catch {}
  awardXP(15, "Geschichte");
  todayOnStoryDone();
  updateStoriesReadBadge();
  scheduleSyncPush();
}

function updateStoriesReadBadge() {
  const n = getStoriesReadCount();
  const badge = document.getElementById("stories-read-badge");
  if (!badge) return;
  if (n > 0) {
    badge.textContent = `📚 ${n} read`;
    badge.classList.add("visible");
  } else {
    badge.classList.remove("visible");
  }
}

// ---- Story series (Palteca-style serialized comprehensible input) ----
function getStorySeries() {
  try { return JSON.parse(localStorage.getItem("storySeries") || "null"); } catch { return null; }
}

function saveStorySeries(s) {
  try {
    if (s && !s.updatedAt) s.updatedAt = Date.now();
    localStorage.setItem("storySeries", JSON.stringify(s));
  } catch {}
  scheduleSyncPush();
}

function resetStorySeries() {
  try {
    localStorage.removeItem("storySeries");
    localStorage.removeItem("storyEpisodeArchive");
  } catch {}
  updateSeriesControls();
}

// Every finished-generating episode is archived so it can be re-read later
// without another AI call; "Continue" still advances the series.
function getEpisodeArchive() {
  try {
    const a = JSON.parse(localStorage.getItem("storyEpisodeArchive") || "[]");
    return Array.isArray(a) ? a : [];
  } catch { return []; }
}

function saveEpisodeToArchive(story) {
  if (!story || !story.episode) return;
  const archive = getEpisodeArchive();
  const key = `${story.genre || "?"}-${story.episode}`;
  const idx = archive.findIndex(e => `${e.genre || "?"}-${e.episode}` === key);
  if (idx >= 0) archive[idx] = story;
  else archive.push(story);
  try { localStorage.setItem("storyEpisodeArchive", JSON.stringify(archive.slice(-40))); } catch {}
  scheduleSyncPush();
}

// ---- Cross-device sync (episodes, series, read count) via /api/sync ----
// One shared JSON per sync code in a private Vercel Blob store. Create a code
// on one device, enter it on another; pushes are debounced after any change.

function getSyncId() {
  try { return localStorage.getItem("syncId") || ""; } catch { return ""; }
}

function generateSyncCode() {
  const words = ["berlin", "fuchs", "wald", "mond", "stern", "brot", "fluss", "adler",
                 "hafen", "insel", "birke", "wolke", "regen", "sonne", "kiesel", "tanne"];
  const pick = () => words[Math.floor(Math.random() * words.length)];
  return `${pick()}-${pick()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function buildSyncPayload() {
  return {
    series: getStorySeries(),
    archive: getEpisodeArchive(),
    storiesRead: getStoriesReadCount(),
    savedAt: Date.now(),
  };
}

function setSyncStatus(text, isError) {
  const el = document.getElementById("sync-status");
  if (!el) return;
  el.textContent = text;
  el.classList.toggle("sync-error", !!isError);
}

let syncPushTimer = null;
function scheduleSyncPush() {
  if (!getSyncId()) return;
  clearTimeout(syncPushTimer);
  syncPushTimer = setTimeout(() => syncPush(), 2500);
}

async function syncPush() {
  const id = getSyncId();
  if (!id) return;
  try {
    const res = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ op: "push", id, data: buildSyncPayload() }),
    });
    const data = await parseApiResponse(res);
    if (!res.ok) throw new Error(data.error || "Push failed");
    try { localStorage.setItem("sync_last_ok", String(Date.now())); } catch {}
    setSyncStatus(`Synced ✓ ${new Date().toLocaleTimeString()}`);
  } catch (err) {
    setSyncStatus(`Sync push failed: ${err.message}`, true);
  }
}

async function syncPull() {
  const id = getSyncId();
  if (!id) return false;
  try {
    const res = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ op: "pull", id }),
    });
    const data = await parseApiResponse(res);
    if (!res.ok) throw new Error(data.error || "Pull failed");
    if (data.data) mergeSyncData(data.data);
    try { localStorage.setItem("sync_last_ok", String(Date.now())); } catch {}
    setSyncStatus(`Synced ✓ ${new Date().toLocaleTimeString()}`);
    return true;
  } catch (err) {
    setSyncStatus(`Sync pull failed: ${err.message}`, true);
    return false;
  }
}

// Merge is additive and progress-preferring, so neither device loses episodes.
function mergeSyncData(remote) {
  const keyOf = e => `${e.genre || "?"}-${e.episode}`;
  const progress = e => (e.quizDone ? 100 : 0) + Object.keys(e.ratedWords || {}).length;
  const byKey = {};
  for (const e of getEpisodeArchive()) byKey[keyOf(e)] = e;
  for (const r of (Array.isArray(remote.archive) ? remote.archive : [])) {
    if (!r || !r.episode) continue;
    const k = keyOf(r);
    if (!byKey[k] || progress(r) > progress(byKey[k])) byKey[k] = r;
  }
  const merged = Object.values(byKey).sort((a, b) =>
    (a.genre || "").localeCompare(b.genre || "") || (a.episode || 0) - (b.episode || 0));
  try { localStorage.setItem("storyEpisodeArchive", JSON.stringify(merged.slice(-40))); } catch {}

  const localSeries = getStorySeries();
  const remoteSeries = remote.series;
  if (remoteSeries && (!localSeries || (remoteSeries.updatedAt || 0) > (localSeries.updatedAt || 0))) {
    try { localStorage.setItem("storySeries", JSON.stringify(remoteSeries)); } catch {}
  }

  const remoteRead = parseInt(remote.storiesRead || 0, 10);
  if (remoteRead > getStoriesReadCount()) {
    try { localStorage.setItem("stories_read_count", String(remoteRead)); } catch {}
  }
  updateStoriesReadBadge();
  if (mode === "stories") updateSeriesControls();
}

function renderSyncCard() {
  const id = getSyncId();
  const linkedRow = document.getElementById("sync-linked-row");
  const setupRow = document.getElementById("sync-setup-row");
  if (!linkedRow) return;
  linkedRow.style.display = id ? "flex" : "none";
  setupRow.style.display = id ? "none" : "flex";
  if (id) {
    document.getElementById("sync-code-display").textContent = id;
    const last = parseInt(localStorage.getItem("sync_last_ok") || "0", 10);
    if (last) setSyncStatus(`Last synced ${new Date(last).toLocaleString()}`);
    else setSyncStatus("Linked — not synced yet");
  } else {
    setSyncStatus("Not linked. Episodes stay on this device only.");
  }
}

function setupSyncCard() {
  const createBtn = document.getElementById("sync-create-btn");
  if (!createBtn) return;
  createBtn.addEventListener("click", async () => {
    try { localStorage.setItem("syncId", generateSyncCode()); } catch {}
    renderSyncCard();
    setSyncStatus("Creating…");
    await syncPush();
  });
  document.getElementById("sync-link-btn").addEventListener("click", async () => {
    const code = (document.getElementById("sync-code-input").value || "").trim().toLowerCase();
    if (!/^[a-z0-9][a-z0-9-]{7,63}$/.test(code)) {
      setSyncStatus("That doesn't look like a sync code (e.g. fuchs-mond-4821).", true);
      return;
    }
    try { localStorage.setItem("syncId", code); } catch {}
    renderSyncCard();
    setSyncStatus("Linking…");
    const ok = await syncPull();
    if (ok) await syncPush(); // upload the merged state back
  });
  document.getElementById("sync-now-btn").addEventListener("click", async () => {
    setSyncStatus("Syncing…");
    const ok = await syncPull();
    if (ok) await syncPush();
  });
  document.getElementById("sync-copy-btn").addEventListener("click", () => {
    const id = getSyncId();
    if (id && navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setSyncStatus("Code copied — enter it on your other device.");
    }
  });
  document.getElementById("sync-unlink-btn").addEventListener("click", () => {
    if (!confirm("Unlink this device? Your episodes stay here and in the cloud; you can re-link with the same code.")) return;
    try { localStorage.removeItem("syncId"); } catch {}
    renderSyncCard();
  });
  renderSyncCard();
}

function openArchivedEpisode(index) {
  const archive = getEpisodeArchive();
  const story = archive[index];
  if (!story) return;
  storyStopPlayAll();
  currentStory = story;
  try { localStorage.setItem("lastStory", JSON.stringify(currentStory)); } catch {}
  renderStory(true);
  renderEpisodeList();
}

function renderEpisodeList() {
  const el = document.getElementById("story-episode-list");
  const isSeries = document.getElementById("story-series-select").value === "series";
  const archive = getEpisodeArchive();
  if (!isSeries || !archive.length) { el.style.display = "none"; el.innerHTML = ""; return; }
  const genreEmoji = { krimi: "🔍", comedy: "😂", romance: "💌", scifi: "🛸", abenteuer: "🧭" };
  el.style.display = "flex";
  el.innerHTML = `<span class="story-episode-list-label">Re-read:</span>` +
    archive.map((s, i) => {
      const isCurrent = currentStory && currentStory.episode === s.episode && currentStory.genre === s.genre;
      return `<button class="story-episode-chip-btn${isCurrent ? " current" : ""}${s.quizDone ? " done" : ""}"
        data-ep-index="${i}" title="${(s.title || "").replace(/"/g, "&quot;")}">
        ${genreEmoji[s.genre] || "📖"} Ep ${s.episode}${s.quizDone ? " ✓" : ""}</button>`;
    }).join("");
}

function updateSeriesControls() {
  const isSeries = document.getElementById("story-series-select").value === "series";
  const series = getStorySeries();
  document.getElementById("story-genre-select").style.display = isSeries ? "" : "none";
  document.getElementById("story-type-select").style.display = isSeries ? "none" : "";
  document.getElementById("story-topic-select").style.display = isSeries ? "none" : "";
  const status = document.getElementById("story-series-status");
  if (isSeries && series) {
    const genreLabel = { krimi: "🔍 Krimi", comedy: "😂 WG-Comedy", romance: "💌 Romanze", scifi: "🛸 Sci-Fi", abenteuer: "🧭 Abenteuer" }[series.genre] || series.genre;
    document.getElementById("story-series-status-text").textContent =
      `${genreLabel} · Episode ${series.episode} gelesen` + (series.cliffhanger ? ` · Offen: ${series.cliffhanger}` : "");
    status.style.display = "flex";
    document.getElementById("story-genre-select").value = series.genre;
    document.getElementById("story-generate-btn").innerHTML = `&#9654; Continue: Episode ${series.episode + 1}`;
  } else {
    status.style.display = "none";
    document.getElementById("story-generate-btn").innerHTML = isSeries
      ? "&#10024; Start my series (Episode 1)"
      : "&#10024; Generate story";
  }
  renderEpisodeList();
}

function showStoriesPanel() {
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
  hideRecallSpecificEls();
  aiPanel.style.display = "none";
  ["progress-panel", "vocab-panel", "grammar-panel", "words-panel", "drills-panel",
   "starters-panel", "speak-panel", "monologue-panel", "games-panel", "today-panel",
   "exam-panel"].forEach(id => {
    document.getElementById(id).style.display = "none";
  });
  document.getElementById("stories-panel").style.display = "flex";
  updateStoriesReadBadge();
  updateSeriesControls();
  renderStoryVocabPreview();
  // Restore the last generated story so a reload doesn't cost another generation
  if (!currentStory) {
    try { currentStory = JSON.parse(localStorage.getItem("lastStory") || "null"); } catch {}
    if (currentStory) renderStory(false);
  }
}

// Words worth recycling: due first, then weak (low ease), then new at level
function pickStoryTargetWords(level) {
  const tierFor = { a1: 1, a2: 2, b1: 3, b2: 4, c1: 4 };
  const pool = (typeof WORDS !== "undefined" ? WORDS : []);
  const due = [], weak = [], fresh = [];
  for (const w of pool) {
    const st = getWordStatus(w.id);
    if (st === "due") due.push(w);
    else if (st !== "new" && getWordRecord(w.id).easeFactor < 2.3) weak.push(w);
    else if (st === "new" && w.tier === tierFor[level]) fresh.push(w);
  }
  const picked = [...due.slice(0, 5), ...weak.slice(0, 2)];
  const shuffledFresh = fresh.sort(() => Math.random() - 0.5);
  while (picked.length < 8 && shuffledFresh.length) picked.push(shuffledFresh.pop());
  return picked.slice(0, 8);
}

function renderStoryVocabPreview() {
  const level = document.getElementById("story-level-select").value;
  const words = pickStoryTargetWords(level);
  const el = document.getElementById("story-vocab-preview");
  if (!words.length) { el.innerHTML = ""; return; }
  el.innerHTML = `<span class="story-vocab-label">Will recycle:</span> ` +
    words.map(w => `<span class="story-vocab-chip" title="${w.english}">${w.german}</span>`).join("");
}

async function generateStory() {
  const level = document.getElementById("story-level-select").value;
  const storyType = document.getElementById("story-type-select").value;
  const topic = document.getElementById("story-topic-select").value;
  const isSeries = document.getElementById("story-series-select").value === "series";
  const targets = pickStoryTargetWords(level);

  const btn = document.getElementById("story-generate-btn");
  btn.disabled = true;
  storyStopPlayAll();
  document.getElementById("story-loading").style.display = "block";
  document.getElementById("story-error").style.display = "none";
  document.getElementById("story-view").style.display = "none";

  try {
    const body = {
      mode: "story",
      level,
      storyType,
      topic,
      targetWords: targets.map(w => w.german),
    };
    if (isSeries) {
      const prev = getStorySeries();
      const genre = document.getElementById("story-genre-select").value;
      const sameSeries = prev && prev.genre === genre;
      body.series = {
        genre,
        episode: sameSeries ? prev.episode + 1 : 1,
        summary: sameSeries ? prev.summary : "",
        characters: sameSeries ? prev.characters : "",
        cliffhanger: sameSeries ? prev.cliffhanger : "",
      };
    }
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await parseApiResponse(res);
    if (!res.ok) throw new Error(data.error || "Server error");
    currentStory = {
      ...data,
      quizDone: false,
      target_words: targets.map(w => ({ id: w.id, german: w.german, english: w.english })),
    };
    if (isSeries) {
      currentStory.genre = body.series.genre;
      saveStorySeries({
        genre: body.series.genre,
        episode: body.series.episode,
        level,
        summary: data.summary || "",
        characters: data.characters || "",
        cliffhanger: data.cliffhanger || "",
      });
      saveEpisodeToArchive(currentStory);
      updateSeriesControls();
    }
    try { localStorage.setItem("lastStory", JSON.stringify(currentStory)); } catch {}
    renderStory(true);
  } catch (err) {
    const errEl = document.getElementById("story-error");
    errEl.textContent = err.message || "Could not generate a story right now. Try again.";
    errEl.style.display = "block";
  }

  document.getElementById("story-loading").style.display = "none";
  btn.disabled = false;
}

function storyWrapTapWords(text) {
  return text.split(/(\s+)/).map(tok =>
    /^\s+$/.test(tok) ? tok :
    `<span class="tap-word" data-word="${tok.replace(/[.,!?;:'"„“”»«()–—]/g, "")}">${tok}</span>`
  ).join("");
}

function renderStory(scrollToTop) {
  if (!currentStory) return;
  document.getElementById("story-view").style.display = "flex";
  document.getElementById("story-title").textContent = currentStory.title || "Eine Geschichte";
  document.getElementById("story-level-chip").textContent = (currentStory.level || "b1").toUpperCase();

  const epChip = document.getElementById("story-episode-chip");
  if (currentStory.episode) {
    epChip.textContent = `Episode ${currentStory.episode}`;
    epChip.style.display = "";
  } else {
    epChip.style.display = "none";
  }
  const cliff = document.getElementById("story-cliffhanger");
  if (currentStory.cliffhanger) {
    document.getElementById("story-cliffhanger-text").textContent = currentStory.cliffhanger;
    cliff.style.display = "flex";
  } else {
    cliff.style.display = "none";
  }
  document.getElementById("story-word-rate").style.display = currentStory.quizDone ? "flex" : "none";
  if (currentStory.quizDone) renderStoryWordRate();

  const usedWords = (currentStory.used_words || []).map(w => w.toLowerCase());
  document.getElementById("story-body").innerHTML = currentStory.sentences.map((s, i) => `
    <div class="story-sentence" data-idx="${i}">
      <button class="story-sent-play" data-idx="${i}" aria-label="Play sentence">&#9654;</button>
      <div class="story-sent-main">
        <div class="story-sent-de">${storyWrapTapWords(s.de)}</div>
        <div class="story-sent-en">${s.en || ""}</div>
      </div>
    </div>`).join("");

  // Highlight recycled target words (stem match so inflected forms count:
  // "warten" -> "wartet", "Schlüssel" -> "Schlüssels")
  if (usedWords.length) {
    const stems = usedWords
      .map(t => t.toLowerCase().replace(/^(der|die|das)\s+/, "").replace(/e?n$/, ""))
      .filter(s => s.length >= 3);
    document.querySelectorAll("#story-body .tap-word").forEach(el => {
      const w = (el.dataset.word || "").toLowerCase();
      if (stems.some(s => w.startsWith(s))) {
        el.classList.add("story-target-word");
      }
    });
  }

  renderStoryQuiz();
  document.getElementById("story-show-en-btn").textContent = "Show English";
  document.getElementById("story-body").classList.remove("show-english");
  if (scrollToTop) document.getElementById("story-title").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderStoryQuiz() {
  const quiz = document.getElementById("story-quiz");
  const list = document.getElementById("story-quiz-list");
  const resultEl = document.getElementById("story-quiz-result");
  resultEl.style.display = "none";
  if (!currentStory.questions || !currentStory.questions.length) {
    quiz.style.display = "none";
    return;
  }
  quiz.style.display = "flex";
  list.innerHTML = currentStory.questions.map((q, qi) => `
    <div class="story-quiz-q" data-qi="${qi}">
      <div class="story-quiz-question">${qi + 1}. ${q.q}</div>
      <div class="story-quiz-options">
        ${q.options.map((opt, oi) =>
          `<button class="story-quiz-opt" data-qi="${qi}" data-oi="${oi}">${opt}</button>`).join("")}
      </div>
    </div>`).join("");
}

function handleStoryQuizAnswer(qi, oi, btn) {
  const q = currentStory.questions[qi];
  const wrap = btn.closest(".story-quiz-q");
  if (wrap.dataset.answered) return;
  wrap.dataset.answered = "1";
  wrap.querySelectorAll(".story-quiz-opt").forEach((b, i) => {
    b.disabled = true;
    if (i === q.answer) b.classList.add("quiz-correct");
    else if (i === oi) b.classList.add("quiz-wrong");
  });
  wrap.dataset.correct = oi === q.answer ? "1" : "0";

  const answered = document.querySelectorAll('.story-quiz-q[data-answered]');
  if (answered.length === currentStory.questions.length) {
    const right = [...answered].filter(w => w.dataset.correct === "1").length;
    const resultEl = document.getElementById("story-quiz-result");
    resultEl.style.display = "block";
    resultEl.textContent = right === answered.length
      ? `${right}/${answered.length} richtig — perfekt! 🎉`
      : `${right}/${answered.length} richtig. Lies die Stelle noch einmal!`;
    if (!currentStory.quizDone) {
      currentStory.quizDone = true;
      try { localStorage.setItem("lastStory", JSON.stringify(currentStory)); } catch {}
      saveEpisodeToArchive(currentStory);
      renderEpisodeList();
      recordStoryRead();
    }
    // Palteca loop: after understanding the input, self-rate the target words
    // so fuzzy ones come back via SRS in the next episodes.
    document.getElementById("story-word-rate").style.display = "flex";
    renderStoryWordRate();
  }
}

function renderStoryWordRate() {
  const list = document.getElementById("story-word-rate-list");
  const targets = currentStory && Array.isArray(currentStory.target_words) ? currentStory.target_words : [];
  if (!targets.length) {
    document.getElementById("story-word-rate").style.display = "none";
    return;
  }
  const rated = currentStory.ratedWords || {};
  list.innerHTML = targets.map(w => {
    const done = rated[String(w.id)];
    return `<div class="story-rate-row${done ? " rated" : ""}" data-wid="${w.id}">
      <span class="story-rate-word">${w.german}</span>
      <span class="story-rate-en">${w.english}</span>
      ${done
        ? `<span class="story-rate-done">${done === "good" ? "✓ wusste ich" : "→ kommt wieder"}</span>`
        : `<button class="story-rate-btn know" data-wid="${w.id}" data-rate="good">✓ Wusste ich</button>
           <button class="story-rate-btn fuzzy" data-wid="${w.id}" data-rate="miss">✗ Noch unsicher</button>`}
    </div>`;
  }).join("");
}

function storyRateWord(wordId, rating) {
  if (!currentStory) return;
  if (!currentStory.ratedWords) currentStory.ratedWords = {};
  if (currentStory.ratedWords[String(wordId)]) return;
  loadWordsSRS();
  updateWordSRS(wordId, rating);
  currentStory.ratedWords[String(wordId)] = rating;
  try { localStorage.setItem("lastStory", JSON.stringify(currentStory)); } catch {}
  saveEpisodeToArchive(currentStory);
  renderStoryWordRate();
}

function storySpeakSentence(idx) {
  storyStopPlayAll();
  const s = currentStory && currentStory.sentences[idx];
  if (!s) return;
  speakGerman(s.de);
}

function storyStopPlayAll() {
  storyPlayAllActive = false;
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  const btn = document.getElementById("story-play-all-btn");
  if (btn) btn.innerHTML = "&#9654; Play all";
  document.querySelectorAll(".story-sentence.playing").forEach(el => el.classList.remove("playing"));
}

function storyPlayAll() {
  if (!currentStory || !window.speechSynthesis) return;
  if (storyPlayAllActive) { storyStopPlayAll(); return; }
  storyPlayAllActive = true;
  document.getElementById("story-play-all-btn").innerHTML = "&#9632; Stop";
  window.speechSynthesis.cancel();

  const sentences = currentStory.sentences;
  const playNext = (i) => {
    if (!storyPlayAllActive || i >= sentences.length) { storyStopPlayAll(); return; }
    document.querySelectorAll(".story-sentence.playing").forEach(el => el.classList.remove("playing"));
    const row = document.querySelector(`.story-sentence[data-idx="${i}"]`);
    if (row) { row.classList.add("playing"); row.scrollIntoView({ behavior: "smooth", block: "center" }); }
    const utt = new SpeechSynthesisUtterance(sentences[i].de);
    utt.lang = "de-DE";
    utt.rate = 0.9;
    utt.onend = () => setTimeout(() => playNext(i + 1), 350);
    utt.onerror = () => storyStopPlayAll();
    window.speechSynthesis.speak(utt);
  };
  playNext(0);
}

function setupStoriesPanel() {
  document.getElementById("story-generate-btn").addEventListener("click", generateStory);
  document.getElementById("story-new-btn").addEventListener("click", () => {
    storyStopPlayAll();
    document.getElementById("story-view").style.display = "none";
    renderStoryVocabPreview();
    document.getElementById("stories-setup").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.getElementById("story-level-select").addEventListener("change", renderStoryVocabPreview);
  document.getElementById("story-series-select").addEventListener("change", updateSeriesControls);
  document.getElementById("story-genre-select").addEventListener("change", updateSeriesControls);
  document.getElementById("story-series-reset").addEventListener("click", () => {
    if (confirm("Start a fresh series? Your current storyline will be forgotten.")) resetStorySeries();
  });
  document.getElementById("story-play-all-btn").addEventListener("click", storyPlayAll);
  document.getElementById("story-show-en-btn").addEventListener("click", () => {
    const body = document.getElementById("story-body");
    const showing = body.classList.toggle("show-english");
    document.getElementById("story-show-en-btn").textContent = showing ? "Hide English" : "Show English";
  });

  // Delegated: word taps open the vocab popup, sentence taps toggle translation,
  // play buttons speak the sentence, quiz options grade themselves.
  document.getElementById("stories-panel").addEventListener("click", (e) => {
    const epBtn = e.target.closest(".story-episode-chip-btn");
    if (epBtn) { openArchivedEpisode(parseInt(epBtn.dataset.epIndex, 10)); return; }
    const rateBtn = e.target.closest(".story-rate-btn");
    if (rateBtn) { storyRateWord(parseInt(rateBtn.dataset.wid, 10), rateBtn.dataset.rate); return; }
    const playBtn = e.target.closest(".story-sent-play");
    if (playBtn) { storySpeakSentence(parseInt(playBtn.dataset.idx, 10)); return; }
    const quizOpt = e.target.closest(".story-quiz-opt");
    if (quizOpt) {
      handleStoryQuizAnswer(parseInt(quizOpt.dataset.qi, 10), parseInt(quizOpt.dataset.oi, 10), quizOpt);
      return;
    }
    if (e.target.classList.contains("tap-word")) {
      const word = e.target.dataset.word;
      if (word) openVocabPopup(word);
      return;
    }
    const sentence = e.target.closest(".story-sentence");
    if (sentence) sentence.classList.toggle("show-en");
  });
}

// ---- telc B2 Exam Simulator ----

let examSbData = null;
let examSbAnswers = {};
let examSbTimerInt = null;
let examSbSecondsLeft = 0;

let examWriteTask = null;
let examWriteTimerInt = null;
let examWriteSecondsLeft = 0;

let examSpeakTopic = null;
let examSpeakTimerInt = null;
let examSpeakSecondsLeft = 0;
let examSpeakWS = null;
let examSpeakStream = null;
let examSpeakRecorder = null;
let examSpeakChunks = [];

function getExamTasksDone() {
  try { return parseInt(localStorage.getItem("exam_tasks_done") || "0", 10); } catch { return 0; }
}

function recordExamTaskDone() {
  try { localStorage.setItem("exam_tasks_done", String(getExamTasksDone() + 1)); } catch {}
  awardXP(25, "Prüfungsaufgabe");
  updateExamDoneBadge();
}

function updateExamDoneBadge() {
  const n = getExamTasksDone();
  const badge = document.getElementById("exam-done-badge");
  if (!badge) return;
  if (n > 0) { badge.textContent = `🎓 ${n} done`; badge.classList.add("visible"); }
  else badge.classList.remove("visible");
}

function fmtExamTime(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function stopExamTimers() {
  if (examSbTimerInt) { clearInterval(examSbTimerInt); examSbTimerInt = null; }
  if (examWriteTimerInt) { clearInterval(examWriteTimerInt); examWriteTimerInt = null; }
  if (examSpeakTimerInt) { clearInterval(examSpeakTimerInt); examSpeakTimerInt = null; }
}

function showExamPanel() {
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
  hideRecallSpecificEls();
  aiPanel.style.display = "none";
  ["progress-panel", "vocab-panel", "grammar-panel", "words-panel", "drills-panel",
   "starters-panel", "speak-panel", "monologue-panel", "games-panel", "today-panel",
   "stories-panel"].forEach(id => {
    document.getElementById(id).style.display = "none";
  });
  document.getElementById("exam-panel").style.display = "flex";
  showExamLanding();
}

function showExamLanding() {
  stopExamTimers();
  examStopRecording();
  document.getElementById("exam-landing").style.display = "flex";
  document.getElementById("exam-sb-view").style.display = "none";
  document.getElementById("exam-write-view").style.display = "none";
  document.getElementById("exam-speak-view").style.display = "none";
  updateExamDoneBadge();
}

// --- Sprachbausteine ---

function openExamSb() {
  document.getElementById("exam-landing").style.display = "none";
  document.getElementById("exam-sb-view").style.display = "flex";
  document.getElementById("exam-sb-start").style.display = "flex";
  document.getElementById("exam-sb-test").style.display = "none";
  document.getElementById("exam-sb-result").style.display = "none";
  document.getElementById("exam-sb-timer").style.display = "none";
}

function examShuffleItemOptions(item) {
  const order = [0, 1, 2].slice(0, item.options.length).sort(() => Math.random() - 0.5);
  return {
    ...item,
    options: order.map(i => item.options[i]),
    answer: order.indexOf(item.answer),
  };
}

async function examSbStart() {
  const btn = document.getElementById("exam-sb-start-btn");
  btn.disabled = true;
  btn.textContent = "Generating test…";
  let data = null;
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "exam-sprachbausteine" }),
    });
    if (res.ok) data = await parseApiResponse(res);
  } catch {}
  if (!data || !data.items) data = EXAM_SB_FALLBACK;
  btn.disabled = false;
  btn.textContent = "Start test";
  if (!data) return;

  examSbData = { ...data, items: data.items.map(examShuffleItemOptions) };
  examSbAnswers = {};
  document.getElementById("exam-sb-start").style.display = "none";
  document.getElementById("exam-sb-result").style.display = "none";
  document.getElementById("exam-sb-test").style.display = "flex";
  document.getElementById("exam-sb-letter-title").textContent = examSbData.title || "";
  document.getElementById("exam-sb-text").innerHTML = (examSbData.text || "")
    .replace(/\n/g, "<br>")
    .replace(/\[(\d+)\]/g, '<span class="exam-sb-gap">[$1]</span>');
  document.getElementById("exam-sb-items").innerHTML = examSbData.items.map((it, qi) => `
    <div class="exam-sb-item" data-qi="${qi}">
      <span class="exam-sb-item-num">${it.num}</span>
      <div class="exam-sb-options">
        ${it.options.map((opt, oi) =>
          `<button class="exam-sb-opt" data-qi="${qi}" data-oi="${oi}">${opt}</button>`).join("")}
      </div>
    </div>`).join("");
  document.getElementById("exam-sb-submit-btn").disabled = true;

  examSbSecondsLeft = 600;
  const timerEl = document.getElementById("exam-sb-timer");
  timerEl.style.display = "block";
  timerEl.classList.remove("low");
  timerEl.textContent = fmtExamTime(examSbSecondsLeft);
  examSbTimerInt = setInterval(() => {
    examSbSecondsLeft--;
    timerEl.textContent = fmtExamTime(Math.max(0, examSbSecondsLeft));
    if (examSbSecondsLeft <= 60) timerEl.classList.add("low");
    if (examSbSecondsLeft <= 0) { clearInterval(examSbTimerInt); examSbTimerInt = null; examSbSubmit(); }
  }, 1000);
}

function examSbPick(qi, oi) {
  examSbAnswers[qi] = oi;
  document.querySelectorAll(`.exam-sb-opt[data-qi="${qi}"]`).forEach((b, i) => {
    b.classList.toggle("selected", i === oi);
  });
  document.getElementById("exam-sb-submit-btn").disabled =
    Object.keys(examSbAnswers).length < examSbData.items.length;
}

function examSbSubmit() {
  if (!examSbData) return;
  stopExamTimers();
  document.getElementById("exam-sb-timer").style.display = "none";
  let right = 0;
  const review = examSbData.items.map((it, qi) => {
    const chosen = examSbAnswers[qi];
    const correct = chosen === it.answer;
    if (correct) right++;
    else if (it.sentence && it.sentence.includes("___")) {
      // wrong exam items resurface as drill-bank mistakes
      addDrillMistake(null, {
        sentence: it.sentence,
        answer: it.options[it.answer],
        distractors: it.options.filter((_, i) => i !== it.answer),
        rule: it.rule,
      });
    }
    return `
      <div class="exam-sb-review-item ${correct ? "ok" : "bad"}">
        <div class="exam-sb-review-top">
          <span>${it.num}. ${correct ? "✓" : "✗"}</span>
          <span class="exam-sb-review-answer">${it.options[it.answer]}</span>
          ${!correct && chosen != null ? `<span class="exam-sb-review-yours">you: ${it.options[chosen]}</span>` : ""}
          ${chosen == null ? `<span class="exam-sb-review-yours">no answer</span>` : ""}
        </div>
        ${it.rule ? `<div class="exam-sb-review-rule">${it.rule}</div>` : ""}
      </div>`;
  }).join("");

  document.getElementById("exam-sb-test").style.display = "none";
  document.getElementById("exam-sb-result").style.display = "flex";
  const pct = Math.round((right / examSbData.items.length) * 100);
  document.getElementById("exam-sb-score").innerHTML =
    `<div class="exam-score-big">${right} / ${examSbData.items.length}</div>
     <div class="exam-score-sub">${pct >= 60 ? "Bestanden-Niveau ✓ (telc pass mark is 60%)" : "Below the 60% telc pass mark — review the rules below"}</div>`;
  document.getElementById("exam-sb-review").innerHTML = review;
  recordExamTaskDone();
}

// --- Schriftlicher Ausdruck ---

function openExamWrite() {
  document.getElementById("exam-landing").style.display = "none";
  document.getElementById("exam-write-view").style.display = "flex";
  document.getElementById("exam-write-setup").style.display = "flex";
  document.getElementById("exam-write-work").style.display = "none";
  document.getElementById("exam-write-grading").style.display = "none";
  document.getElementById("exam-write-result").style.display = "none";
  document.getElementById("exam-write-timer").style.display = "none";
}

function examWriteStart() {
  const type = document.getElementById("exam-write-type").value;
  const pool = type ? EXAM_WRITE_TASKS.filter(t => t.type === type) : EXAM_WRITE_TASKS;
  if (!pool.length) return;
  examWriteTask = pool[Math.floor(Math.random() * pool.length)];

  document.getElementById("exam-write-setup").style.display = "none";
  document.getElementById("exam-write-work").style.display = "flex";
  document.getElementById("exam-write-task-title").textContent = `${examWriteTask.type}: ${examWriteTask.title}`;
  document.getElementById("exam-write-situation").textContent = examWriteTask.situation;
  document.getElementById("exam-write-points").innerHTML =
    examWriteTask.points.map(p => `<li>${p}</li>`).join("");
  const input = document.getElementById("exam-write-input");
  input.value = "";
  document.getElementById("exam-write-wordcount").textContent = "0 words";
  document.getElementById("exam-write-submit-btn").disabled = true;

  examWriteSecondsLeft = 1800;
  const timerEl = document.getElementById("exam-write-timer");
  timerEl.style.display = "block";
  timerEl.classList.remove("low");
  timerEl.textContent = fmtExamTime(examWriteSecondsLeft);
  examWriteTimerInt = setInterval(() => {
    examWriteSecondsLeft--;
    timerEl.textContent = fmtExamTime(Math.max(0, examWriteSecondsLeft));
    if (examWriteSecondsLeft <= 300) timerEl.classList.add("low");
    if (examWriteSecondsLeft <= 0) {
      clearInterval(examWriteTimerInt); examWriteTimerInt = null;
      if (!document.getElementById("exam-write-submit-btn").disabled) examWriteSubmit();
    }
  }, 1000);
}

function examCountWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

const EXAM_SCORE_LABELS = { A: "A — very good", B: "B — acceptable", C: "C — not yet" };

function examScoreChips(scores, labels) {
  return Object.entries(labels).map(([key, label]) => {
    const grade = String(scores[key] || "?").toUpperCase().charAt(0);
    return `<div class="exam-score-chip grade-${grade}">
      <span class="exam-score-chip-label">${label}</span>
      <span class="exam-score-chip-grade">${EXAM_SCORE_LABELS[grade] || grade}</span>
    </div>`;
  }).join("");
}

async function examWriteSubmit() {
  const text = document.getElementById("exam-write-input").value.trim();
  if (!text || !examWriteTask) return;
  stopExamTimers();
  document.getElementById("exam-write-timer").style.display = "none";
  document.getElementById("exam-write-work").style.display = "none";
  document.getElementById("exam-write-grading").style.display = "block";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "exam-write-feedback",
        text,
        task: `${examWriteTask.type}: ${examWriteTask.situation}`,
        points: examWriteTask.points,
      }),
    });
    const data = await parseApiResponse(res);
    if (!res.ok) throw new Error(data.error || "Server error");

    document.getElementById("exam-write-scores").innerHTML = examScoreChips(data.scores || {}, {
      inhalt: "Inhalt", kommunikation: "Kommunikative Gestaltung",
      korrektheit: "Korrektheit", wortschatz: "Wortschatz",
    });
    const covered = data.points_covered || [];
    document.getElementById("exam-write-points-covered").innerHTML = covered.length
      ? `<div class="exam-small-label">Leitpunkte:</div>` + examWriteTask.points.map((p, i) =>
          `<div class="exam-point-row">${covered[i] ? "✓" : "✗"} ${p}</div>`).join("")
      : "";
    document.getElementById("exam-write-overall").textContent = data.overall || "";
    const corrections = data.corrections || [];
    corrections.forEach(c => logError("exam", c.original, c.corrected, c.explanation));
    document.getElementById("exam-write-corrections").innerHTML = corrections.length
      ? `<div class="exam-small-label">Corrections (saved to My Mistakes):</div>` + corrections.map(c => `
          <div class="exam-correction">
            <div class="error-log-original">${c.original}</div>
            <div class="error-log-corrected">${c.corrected}</div>
            ${c.explanation ? `<div class="error-log-explanation">${c.explanation}</div>` : ""}
          </div>`).join("")
      : "";
    document.getElementById("exam-write-model").textContent = data.model || "";
    document.getElementById("exam-write-model").style.display = "none";
    document.getElementById("exam-write-model-toggle").textContent = "Show model letter";
    document.getElementById("exam-write-grading").style.display = "none";
    document.getElementById("exam-write-result").style.display = "flex";
    recordExamTaskDone();
  } catch (err) {
    document.getElementById("exam-write-grading").style.display = "none";
    document.getElementById("exam-write-work").style.display = "flex";
    alert(err.message || "Grading failed - your letter is still in the box. Try submitting again.");
  }
}

// --- Präsentation (Mündliche Prüfung Teil 1) ---

function examPickSpeakTopic() {
  examSpeakTopic = EXAM_SPEAK_TOPICS[Math.floor(Math.random() * EXAM_SPEAK_TOPICS.length)];
  document.getElementById("exam-speak-topic").textContent = examSpeakTopic ? examSpeakTopic.de : "";
  document.getElementById("exam-speak-topic-en").textContent = examSpeakTopic ? examSpeakTopic.en : "";
}

function openExamSpeak() {
  document.getElementById("exam-landing").style.display = "none";
  document.getElementById("exam-speak-view").style.display = "flex";
  document.getElementById("exam-speak-setup").style.display = "flex";
  document.getElementById("exam-speak-live").style.display = "none";
  document.getElementById("exam-speak-grading").style.display = "none";
  document.getElementById("exam-speak-result").style.display = "none";
  document.getElementById("exam-speak-timer").style.display = "none";
  document.getElementById("exam-speak-phase").textContent = "";
  document.getElementById("exam-speak-structure").innerHTML =
    EXAM_SPEAK_STRUCTURE.map(s => `<li>${s}</li>`).join("");
  examPickSpeakTopic();
}

function examSpeakStartPrep() {
  document.getElementById("exam-speak-setup").style.display = "none";
  document.getElementById("exam-speak-live").style.display = "flex";
  document.getElementById("exam-speak-live-topic").textContent = examSpeakTopic ? examSpeakTopic.de : "";
  document.getElementById("exam-speak-status").textContent = "Sammeln Sie Ideen: Erfahrungen, Heimatland, Vor- und Nachteile, Meinung.";
  document.getElementById("exam-speak-talk-btn").style.display = "none";
  document.getElementById("exam-speak-stop-btn").style.display = "none";
  document.getElementById("exam-speak-transcript-wrap").style.display = "none";
  document.getElementById("exam-speak-transcript").textContent = "";
  document.getElementById("exam-speak-phase").textContent = "Vorbereitung";

  examSpeakSecondsLeft = 60;
  const timerEl = document.getElementById("exam-speak-timer");
  timerEl.style.display = "block";
  timerEl.classList.remove("low");
  timerEl.textContent = fmtExamTime(examSpeakSecondsLeft);
  examSpeakTimerInt = setInterval(() => {
    examSpeakSecondsLeft--;
    timerEl.textContent = fmtExamTime(Math.max(0, examSpeakSecondsLeft));
    if (examSpeakSecondsLeft <= 10) timerEl.classList.add("low");
    if (examSpeakSecondsLeft <= 0) {
      clearInterval(examSpeakTimerInt); examSpeakTimerInt = null;
      examSpeakReadyToTalk();
    }
  }, 1000);
}

function examSpeakReadyToTalk() {
  document.getElementById("exam-speak-phase").textContent = "Präsentation";
  document.getElementById("exam-speak-status").textContent = "Sprechen Sie bis zu 2 Minuten über Ihr Thema.";
  document.getElementById("exam-speak-talk-btn").style.display = "inline-block";
  document.getElementById("exam-speak-timer").classList.remove("low");
  document.getElementById("exam-speak-timer").textContent = "2:00";
}

async function examSpeakStartTalking() {
  document.getElementById("exam-speak-talk-btn").style.display = "none";
  document.getElementById("exam-speak-stop-btn").style.display = "inline-block";
  document.getElementById("exam-speak-status").textContent = "Aufnahme läuft… sprechen Sie!";
  document.getElementById("exam-speak-transcript-wrap").style.display = "block";
  await examStartRecording();

  examSpeakSecondsLeft = 120;
  const timerEl = document.getElementById("exam-speak-timer");
  timerEl.textContent = fmtExamTime(examSpeakSecondsLeft);
  examSpeakTimerInt = setInterval(() => {
    examSpeakSecondsLeft--;
    timerEl.textContent = fmtExamTime(Math.max(0, examSpeakSecondsLeft));
    if (examSpeakSecondsLeft <= 20) timerEl.classList.add("low");
    if (examSpeakSecondsLeft <= 0) examSpeakFinish();
  }, 1000);
}

async function examStartRecording() {
  examSpeakChunks = [];
  const transcriptEl = document.getElementById("exam-speak-transcript");
  const pushChunk = (t) => {
    if (!t) return;
    examSpeakChunks.push(t);
    transcriptEl.textContent = examSpeakChunks.join(" ");
  };
  try {
    const tokenRes = await fetch("/api/deepgram-token", { method: "POST" });
    if (!tokenRes.ok) throw new Error("token");
    const { key } = await tokenRes.json();
    examSpeakStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const wsUrl = "wss://api.deepgram.com/v1/listen?language=de&model=nova-2-general&interim_results=true&endpointing=800&vad_events=true&encoding=linear16&sample_rate=16000";
    examSpeakWS = new WebSocket(wsUrl, ["token", key]);
    examSpeakWS.onopen = () => {
      examSpeakRecorder = new MediaRecorder(examSpeakStream, { mimeType: "audio/webm;codecs=opus" });
      examSpeakRecorder.ondataavailable = (e) => {
        if (examSpeakWS && examSpeakWS.readyState === WebSocket.OPEN && e.data.size > 0) examSpeakWS.send(e.data);
      };
      examSpeakRecorder.start(100);
    };
    examSpeakWS.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === "Results" && msg.is_final) {
        pushChunk((msg.channel?.alternatives?.[0]?.transcript || "").trim());
      }
    };
    examSpeakWS.onerror = () => {};
  } catch {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const sr = new SR();
      sr.lang = "de-DE";
      sr.interimResults = false;
      sr.continuous = true;
      sr.onresult = (ev) => pushChunk(ev.results[ev.results.length - 1][0].transcript.trim());
      sr.start();
      examSpeakWS = { _sr: sr, close: () => sr.stop() };
    }
  }
}

function examStopRecording() {
  if (examSpeakRecorder && examSpeakRecorder.state !== "inactive") examSpeakRecorder.stop();
  if (examSpeakWS) { examSpeakWS.close(); examSpeakWS = null; }
  if (examSpeakStream) { examSpeakStream.getTracks().forEach(t => t.stop()); examSpeakStream = null; }
  examSpeakRecorder = null;
}

async function examSpeakFinish() {
  stopExamTimers();
  examStopRecording();
  document.getElementById("exam-speak-timer").style.display = "none";
  document.getElementById("exam-speak-stop-btn").style.display = "none";

  const transcript = examSpeakChunks.join(" ").trim();
  if (transcript.length <= 5) {
    document.getElementById("exam-speak-status").textContent =
      "No speech detected. Check your microphone and try again.";
    document.getElementById("exam-speak-talk-btn").style.display = "inline-block";
    document.getElementById("exam-speak-timer").style.display = "block";
    document.getElementById("exam-speak-timer").textContent = "2:00";
    return;
  }

  document.getElementById("exam-speak-live").style.display = "none";
  document.getElementById("exam-speak-grading").style.display = "block";
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "exam-speak-feedback", text: transcript, topic: examSpeakTopic ? examSpeakTopic.de : "" }),
    });
    const data = await parseApiResponse(res);
    if (!res.ok) throw new Error(data.error || "Server error");

    document.getElementById("exam-speak-scores").innerHTML = examScoreChips(data.scores || {}, {
      aufgabe: "Aufgabenbewältigung", fluessigkeit: "Flüssigkeit",
      korrektheit: "Korrektheit", ausdruck: "Ausdruck",
    });
    document.getElementById("exam-speak-overall").textContent = data.overall || "";
    const corrections = data.corrections || [];
    corrections.forEach(c => logError("exam", c.original, c.corrected, c.explanation));
    document.getElementById("exam-speak-corrections").innerHTML = corrections.length
      ? `<div class="exam-small-label">Corrections (saved to My Mistakes):</div>` + corrections.map(c => `
          <div class="exam-correction">
            <div class="error-log-original">${c.original}</div>
            <div class="error-log-corrected">${c.corrected}</div>
            ${c.explanation ? `<div class="error-log-explanation">${c.explanation}</div>` : ""}
          </div>`).join("")
      : "";
    document.getElementById("exam-speak-model").textContent = data.model || "";
    document.getElementById("exam-speak-grading").style.display = "none";
    document.getElementById("exam-speak-result").style.display = "flex";
    recordExamTaskDone();
  } catch (err) {
    document.getElementById("exam-speak-grading").style.display = "none";
    document.getElementById("exam-speak-live").style.display = "flex";
    document.getElementById("exam-speak-status").textContent =
      (err.message || "Grading failed.") + " Your transcript is kept - try finishing again.";
    document.getElementById("exam-speak-talk-btn").style.display = "none";
    document.getElementById("exam-speak-stop-btn").style.display = "inline-block";
  }
}

function setupExamPanel() {
  document.getElementById("exam-card-sb").addEventListener("click", openExamSb);
  document.getElementById("exam-card-write").addEventListener("click", openExamWrite);
  document.getElementById("exam-card-speak").addEventListener("click", openExamSpeak);
  document.getElementById("exam-sb-back").addEventListener("click", showExamLanding);
  document.getElementById("exam-write-back").addEventListener("click", showExamLanding);
  document.getElementById("exam-speak-back").addEventListener("click", showExamLanding);

  document.getElementById("exam-sb-start-btn").addEventListener("click", examSbStart);
  document.getElementById("exam-sb-submit-btn").addEventListener("click", examSbSubmit);
  document.getElementById("exam-sb-again-btn").addEventListener("click", openExamSb);
  document.getElementById("exam-sb-items").addEventListener("click", (e) => {
    const opt = e.target.closest(".exam-sb-opt");
    if (opt) examSbPick(parseInt(opt.dataset.qi, 10), parseInt(opt.dataset.oi, 10));
  });

  document.getElementById("exam-write-start-btn").addEventListener("click", examWriteStart);
  document.getElementById("exam-write-submit-btn").addEventListener("click", examWriteSubmit);
  document.getElementById("exam-write-again-btn").addEventListener("click", openExamWrite);
  document.getElementById("exam-write-input").addEventListener("input", (e) => {
    const words = examCountWords(e.target.value);
    document.getElementById("exam-write-wordcount").textContent = `${words} words`;
    document.getElementById("exam-write-submit-btn").disabled = words < 50;
  });
  document.getElementById("exam-write-model-toggle").addEventListener("click", () => {
    const el = document.getElementById("exam-write-model");
    const showing = el.style.display !== "none";
    el.style.display = showing ? "none" : "block";
    document.getElementById("exam-write-model-toggle").textContent =
      showing ? "Show model letter" : "Hide model letter";
  });

  document.getElementById("exam-speak-newtopic-btn").addEventListener("click", examPickSpeakTopic);
  document.getElementById("exam-speak-prep-btn").addEventListener("click", examSpeakStartPrep);
  document.getElementById("exam-speak-talk-btn").addEventListener("click", examSpeakStartTalking);
  document.getElementById("exam-speak-stop-btn").addEventListener("click", examSpeakFinish);
  document.getElementById("exam-speak-again-btn").addEventListener("click", openExamSpeak);
}

// ---- Unified error log: every correction the app produces lands here ----

const ERROR_LOG_MAX = 100;
const ERROR_SOURCE_LABELS = {
  chat: "Chat", correct: "Correct", write: "Write",
  recall: "Recall", speak: "Speak", talkbox: "Talk Box",
};

function getErrorLog() {
  try { return JSON.parse(localStorage.getItem("errorLog") || "[]"); } catch { return []; }
}

function saveErrorLog(log) {
  localStorage.setItem("errorLog", JSON.stringify(log));
}

function logError(source, original, corrected, explanation) {
  original = String(original || "").trim();
  corrected = String(corrected || "").trim();
  if (!original || !corrected) return;
  if (original.toLowerCase() === corrected.toLowerCase()) return;
  const log = getErrorLog();
  if (log.some(e => e.original === original && e.corrected === corrected)) return;
  log.push({ ts: Date.now(), source, original, corrected, explanation: String(explanation || "").trim() });
  while (log.length > ERROR_LOG_MAX) log.shift();
  saveErrorLog(log);
}

function renderErrorProfileSection() {
  const section = document.getElementById("error-profile-section");
  if (!section) return;
  const log = getErrorLog();
  if (!log.length) { section.style.display = "none"; return; }
  section.style.display = "flex";
  document.getElementById("error-log-count").textContent =
    `${log.length} logged${log.length >= ERROR_LOG_MAX ? " (max)" : ""}`;

  // Restore a cached analysis if it still matches the log size
  const patternsEl = document.getElementById("error-patterns");
  if (patternsEl.style.display === "none") {
    try {
      const cache = JSON.parse(localStorage.getItem("errorProfileCache") || "null");
      if (cache && cache.errorCount === log.length && Array.isArray(cache.patterns)) {
        renderErrorPatterns(cache.patterns);
      }
    } catch {}
  }
}

function renderErrorPatterns(patterns) {
  const el = document.getElementById("error-patterns");
  el.style.display = "flex";
  el.innerHTML = patterns.map((p, i) => `
    <div class="error-pattern-card">
      <div class="error-pattern-title">${i + 1}. ${p.title}</div>
      <div class="error-pattern-desc">${p.description}</div>
      ${p.tip ? `<div class="error-pattern-tip">💡 ${p.tip}</div>` : ""}
      ${(p.examples || []).length ? `<div class="error-pattern-examples">${p.examples.map(ex => `<span>${ex}</span>`).join("")}</div>` : ""}
    </div>`).join("");
}

function renderErrorLogList() {
  const el = document.getElementById("error-log-list");
  const log = getErrorLog().slice(-20).reverse();
  el.innerHTML = log.map(e => `
    <div class="error-log-item">
      <div class="error-log-top">
        <span class="error-log-source">${ERROR_SOURCE_LABELS[e.source] || e.source}</span>
        <span class="error-log-date">${new Date(e.ts).toLocaleDateString()}</span>
      </div>
      <div class="error-log-original">${e.original}</div>
      <div class="error-log-corrected">${e.corrected}</div>
      ${e.explanation ? `<div class="error-log-explanation">${e.explanation}</div>` : ""}
    </div>`).join("");
}

function setErrorProfileStatus(msg, isError) {
  const el = document.getElementById("error-profile-status");
  if (!msg) { el.style.display = "none"; return; }
  el.style.display = "block";
  el.textContent = msg;
  el.classList.toggle("is-error", !!isError);
}

async function analyzeErrorProfile() {
  const log = getErrorLog();
  if (!log.length) return;
  const btn = document.getElementById("error-analyze-btn");
  btn.disabled = true;
  setErrorProfileStatus("Analyzing your mistakes…");
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "error-profile", errors: log.slice(-30) }),
    });
    const data = await parseApiResponse(res);
    if (!res.ok) throw new Error(data.error || "Server error");
    renderErrorPatterns(data.patterns || []);
    try {
      localStorage.setItem("errorProfileCache", JSON.stringify({ ts: Date.now(), errorCount: log.length, patterns: data.patterns }));
    } catch {}
    setErrorProfileStatus("");
  } catch (err) {
    setErrorProfileStatus(err.message || "Analysis failed. Try again.", true);
  }
  btn.disabled = false;
}

async function practiceErrorDrills() {
  const log = getErrorLog();
  if (!log.length) return;
  const btn = document.getElementById("error-practice-btn");
  btn.disabled = true;
  setErrorProfileStatus("Building drills from your mistakes…");
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "error-drills", errors: log.slice(-12) }),
    });
    const data = await parseApiResponse(res);
    if (!res.ok) throw new Error(data.error || "Server error");
    if (!data.drills || !data.drills.length) throw new Error("No drills could be built. Collect a few more mistakes first.");
    setErrorProfileStatus("");
    openErrorDrillSession(data.drills);
  } catch (err) {
    setErrorProfileStatus(err.message || "Could not build drills. Try again.", true);
  }
  btn.disabled = false;
}

function openErrorDrillSession(drills) {
  drillTag = null;
  drillSetKey = "__errorlog__";
  drillSessionCorrect = 0;
  drillSessionTotal = 0;
  drillQueue = drills.map(item => buildDrillQueueItem(item, null));
  drillIdx = 0;
  document.getElementById("drill-tag-chip").innerHTML = `<span class="grammar-chip">My Mistakes</span>`;
  document.getElementById("drill-score-label").textContent = "";
  document.getElementById("drill-progress-label").textContent = `1 / ${drillQueue.length}`;
  document.getElementById("drill-modal").style.display = "flex";
  renderDrillCard();
}

function setupErrorProfileSection() {
  document.getElementById("error-analyze-btn").addEventListener("click", analyzeErrorProfile);
  document.getElementById("error-practice-btn").addEventListener("click", practiceErrorDrills);
  document.getElementById("error-toggle-list-btn").addEventListener("click", () => {
    const el = document.getElementById("error-log-list");
    const showing = el.style.display !== "none";
    el.style.display = showing ? "none" : "flex";
    document.getElementById("error-toggle-list-btn").textContent = showing ? "Show list" : "Hide list";
    if (!showing) renderErrorLogList();
  });
  document.getElementById("error-clear-btn").addEventListener("click", () => {
    if (!confirm("Clear all logged mistakes?")) return;
    localStorage.removeItem("errorLog");
    localStorage.removeItem("errorProfileCache");
    document.getElementById("error-patterns").style.display = "none";
    document.getElementById("error-log-list").style.display = "none";
    renderErrorProfileSection();
  });
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
  document.getElementById("words-panel").style.display = "none";
  document.getElementById("drills-panel").style.display = "none";
  document.getElementById("starters-panel").style.display = "none";
  document.getElementById("speak-panel").style.display = "none";
  document.getElementById("monologue-panel").style.display = "none";
  document.getElementById("games-panel").style.display = "none";
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
  let topics = filterTag
    ? GRAMMAR_TOPICS.filter(t => filterTag.startsWith(t.id) || t.id === filterTag)
    : GRAMMAR_TOPICS;
  if (cefrFilter !== "all") {
    topics = topics.filter(t => t.level === cefrFilter);
  }
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
    const data = await parseApiResponse(res);
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
  updateMoreTabState();
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
    const data = await parseApiResponse(res);
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
    const data = await parseApiResponse(res);
    if (!res.ok) throw new Error(data.error || "Server error");
    showChatTyping(false);

    convoMessages[convoMessages.length - 1].correction = data.correction || null;
    // Log real German errors (skip the "say this in German" translation prompts)
    if (data.correction && !/try saying/i.test(data.correction.explanation || "")) {
      logError("chat", data.correction.original, data.correction.corrected, data.correction.explanation);
    }
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
    const data = await parseApiResponse(res);
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
    date: todayStr(),
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
  updateTabBadges();
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
    dueDate: toLocalDateStr(due),
    lastReviewed: todayStr(),
    totalReviews: r.totalReviews + 1,
    totalCorrect: r.totalCorrect + (rating !== "miss" ? 1 : 0),
  };
  saveWordsSRS();
  awardXP(rating === "miss" ? 1 : 3, "Wort");
}

function buildWordsQueue() {
  const tierVal = document.getElementById("word-tier-select").value;
  const posVal = document.getElementById("word-pos-filter").value;

  let source = (typeof WORDS !== "undefined" ? WORDS : []);
  if (tierVal !== "all") source = source.filter(w => w.tier === parseInt(tierVal));
  if (posVal !== "all") source = source.filter(w => w.pos === posVal);
  if (cefrFilter !== "all") source = source.filter(w => TIER_TO_CEFR[w.tier] === cefrFilter);

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
  todayOnWordGraded();
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
  document.getElementById("drills-panel").style.display = "none";
  document.getElementById("starters-panel").style.display = "none";
  document.getElementById("speak-panel").style.display = "none";
  document.getElementById("monologue-panel").style.display = "none";
  document.getElementById("games-panel").style.display = "none";
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

// ---- Games / Word Search ----

const WS_GRID_SIZE = 12;
const WS_WORD_COUNT = 10;
const WS_DIRECTIONS = [
  [0,1],[1,0],[0,-1],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]
];
const WS_FILL_POOL = Array.from("ABCDEFGHIJKLMNOPRSTUVWXZÄÖÜ");

function showGamesPanel() {
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
  hideRecallSpecificEls();
  aiPanel.style.display = "none";
  document.getElementById("progress-panel").style.display = "none";
  document.getElementById("vocab-panel").style.display = "none";
  document.getElementById("grammar-panel").style.display = "none";
  document.getElementById("words-panel").style.display = "none";
  document.getElementById("drills-panel").style.display = "none";
  document.getElementById("starters-panel").style.display = "none";
  document.getElementById("speak-panel").style.display = "none";
  document.getElementById("monologue-panel").style.display = "none";
  document.getElementById("games-panel").style.display = "flex";
  showGamesLanding();
  updateGamesStreakBadge();
}

function initGamesPanel() {
  // Populate island select
  const islandSel = document.getElementById("ws-island-select");
  if (islandSel && typeof GAME_ISLAND_SETS !== "undefined") {
    islandSel.innerHTML = "";
    Object.entries(GAME_ISLAND_SETS).forEach(([key, val]) => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = val.label;
      islandSel.appendChild(opt);
    });
  }

  // Mode tab buttons
  document.querySelectorAll(".ws-mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".ws-mode-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      wsWsMode = btn.dataset.wsmode;
      document.getElementById("ws-vocab-filters").style.display = wsWsMode === "vocab" ? "" : "none";
      document.getElementById("ws-island-filters").style.display = wsWsMode === "island" ? "" : "none";
      wsGenerateAndRender();
    });
  });

  document.getElementById("ws-back-btn").addEventListener("click", exitWordSearch);
  document.getElementById("ws-new-puzzle-btn").addEventListener("click", wsGenerateAndRender);
  document.getElementById("ws-hint-btn").addEventListener("click", handleWsHint);
  document.getElementById("ws-popup-x").addEventListener("click", closeWordPopup);
  document.getElementById("ws-popup-continue-btn").addEventListener("click", closeWordPopup);
  document.getElementById("ws-popup-add-btn").addEventListener("click", () => {
    if (wsCurrentPopupWordId != null) addWordToSRS(wsCurrentPopupWordId);
  });
}

function showGamesLanding() {
  document.getElementById("games-landing").style.display = "";
  document.getElementById("wordsearch-view").style.display = "none";
  document.getElementById("talkbox-view").style.display = "none";
  document.getElementById("sentencebuilder-view").style.display = "none";
  document.getElementById("listeningblitz-view").style.display = "none";
  document.getElementById("grammarsprint-view").style.display = "none";
}

function openWordSearch() {
  document.getElementById("games-landing").style.display = "none";
  document.getElementById("wordsearch-view").style.display = "";
  wsHintsUsed = 0;
  const hintBtn = document.getElementById("ws-hint-btn");
  if (hintBtn) { hintBtn.textContent = "Hint (3)"; hintBtn.disabled = false; }
  wsGenerateAndRender();
}

function exitWordSearch() {
  saveWsPuzzleState();
  showGamesLanding();
}

function wsGetWordPool() {
  if (!WORDS || !WORDS.length) return [];
  if (wsWsMode === "island") {
    const key = document.getElementById("ws-island-select")?.value;
    const set = (typeof GAME_ISLAND_SETS !== "undefined") && GAME_ISLAND_SETS[key];
    if (set && set.wordIds) {
      return set.wordIds.map(id => WORDS.find(w => w.id === id)).filter(Boolean);
    }
  }
  const tier = parseInt(document.getElementById("ws-tier-select")?.value || "1", 10);
  return WORDS.filter(w => w.tier === tier);
}

function wsFilterCandidates(pool) {
  return pool.filter(w => {
    const s = w.german;
    return s && !s.includes(" ") && s.length >= 5 && s.length <= 11;
  });
}

function wsShuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function wsGenerateGrid(words) {
  const G = WS_GRID_SIZE;
  const grid = Array.from({length: G}, () => Array(G).fill(""));
  const placed = [];

  const sortedWords = [...words].sort((a, b) => b.german.length - a.german.length);

  for (const word of sortedWords) {
    const letters = Array.from(word.german.toUpperCase());
    const L = letters.length;
    let didPlace = false;

    for (let attempt = 0; attempt < 200 && !didPlace; attempt++) {
      const [dr, dc] = WS_DIRECTIONS[Math.floor(Math.random() * WS_DIRECTIONS.length)];
      const maxR = dr === 0 ? G - 1 : dr > 0 ? G - L : L - 1;
      const minR = dr < 0 ? L - 1 : 0;
      const maxC = dc === 0 ? G - 1 : dc > 0 ? G - L : L - 1;
      const minC = dc < 0 ? L - 1 : 0;
      if (maxR < minR || maxC < minC) continue;
      const r0 = minR + Math.floor(Math.random() * (maxR - minR + 1));
      const c0 = minC + Math.floor(Math.random() * (maxC - minC + 1));

      let fits = true;
      for (let i = 0; i < L; i++) {
        const r = r0 + i * dr;
        const c = c0 + i * dc;
        if (r < 0 || r >= G || c < 0 || c >= G) { fits = false; break; }
        if (grid[r][c] !== "" && grid[r][c] !== letters[i]) { fits = false; break; }
      }
      if (!fits) continue;

      for (let i = 0; i < L; i++) {
        grid[r0 + i * dr][c0 + i * dc] = letters[i];
      }
      placed.push({ word, r0, c0, dr, dc, letters, discovered: false, colorIdx: placed.length % 8 });
      didPlace = true;
    }
  }

  for (let r = 0; r < G; r++) {
    for (let c = 0; c < G; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = WS_FILL_POOL[Math.floor(Math.random() * WS_FILL_POOL.length)];
      }
    }
  }

  return { grid, placed };
}

function wsGenerateAndRender() {
  wsCurrentPuzzle = null;
  wsHintsUsed = 0;
  const hintBtn = document.getElementById("ws-hint-btn");
  if (hintBtn) { hintBtn.textContent = "Hint (3)"; hintBtn.disabled = false; }

  const pool = wsGetWordPool();
  const candidates = wsFilterCandidates(pool);
  if (!candidates.length) {
    document.getElementById("ws-grid").innerHTML = "<div style='padding:20px;color:var(--text-dim)'>No words available. Choose another tier or island.</div>";
    document.getElementById("ws-word-list").innerHTML = "";
    document.getElementById("ws-word-count").textContent = "0 / 0";
    return;
  }

  const shuffled = wsShuffle(candidates);
  const selected = shuffled.slice(0, WS_WORD_COUNT);

  // Try up to 3 times to get at least 6 words placed
  let result;
  for (let t = 0; t < 3; t++) {
    result = wsGenerateGrid(selected);
    if (result.placed.length >= 6) break;
  }

  wsCurrentPuzzle = {
    grid: result.grid,
    placed: result.placed,
    foundIds: [],
  };

  renderWsGrid();
  renderWsWordList();
  document.getElementById("ws-word-count").textContent = `0 / ${result.placed.length}`;
}

function renderWsGrid() {
  if (!wsCurrentPuzzle) return;
  const { grid } = wsCurrentPuzzle;
  const G = WS_GRID_SIZE;
  const container = document.getElementById("ws-grid");
  container.innerHTML = "";
  container.style.gridTemplateColumns = `repeat(${G}, 1fr)`;

  for (let r = 0; r < G; r++) {
    for (let c = 0; c < G; c++) {
      const cell = document.createElement("div");
      cell.className = "ws-cell";
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.textContent = grid[r][c];
      container.appendChild(cell);
    }
  }

  container.addEventListener("pointerdown", wsOnPointerDown);
  document.addEventListener("pointermove", wsOnPointerMove);
  document.addEventListener("pointerup", wsOnPointerUp);
}

function renderWsWordList() {
  if (!wsCurrentPuzzle) return;
  const list = document.getElementById("ws-word-list");
  list.innerHTML = wsCurrentPuzzle.placed.map(p =>
    `<span class="ws-target-word${wsCurrentPuzzle.foundIds.includes(p.word.id) ? " found" : ""}" data-word-id="${p.word.id}">${p.word.german}</span>`
  ).join("");
}

function wsOnPointerDown(e) {
  if (e.button !== undefined && e.button !== 0 && e.pointerType !== "touch") return;
  const cell = e.target.closest(".ws-cell");
  if (!cell) return;
  e.preventDefault();
  wsIsDragging = true;
  wsLockedDir = null;
  wsHoveredCells = [];
  wsStartCell = { r: parseInt(cell.dataset.row), c: parseInt(cell.dataset.col) };
  wsHoveredCells = [wsStartCell];
  wsApplyHighlight(wsHoveredCells);
  try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
}

function wsOnPointerMove(e) {
  if (!wsIsDragging) return;
  e.preventDefault();
  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (!el) return;
  const cell = el.closest(".ws-cell");
  if (!cell) return;
  const r = parseInt(cell.dataset.row);
  const c = parseInt(cell.dataset.col);
  if (isNaN(r) || isNaN(c)) return;

  const dr = r - wsStartCell.r;
  const dc = c - wsStartCell.c;

  if (dr === 0 && dc === 0) {
    wsHoveredCells = [wsStartCell];
    wsLockedDir = null;
    wsApplyHighlight(wsHoveredCells);
    return;
  }

  if (!wsLockedDir) {
    wsLockedDir = wsSnapToAxis(dr, dc);
  }

  const steps = wsProjectOnAxis(dr, dc, wsLockedDir);
  const G = WS_GRID_SIZE;
  const cells = [];
  for (let i = 0; i <= steps; i++) {
    const nr = wsStartCell.r + i * wsLockedDir[0];
    const nc = wsStartCell.c + i * wsLockedDir[1];
    if (nr >= 0 && nr < G && nc >= 0 && nc < G) cells.push({ r: nr, c: nc });
  }
  wsHoveredCells = cells;
  wsApplyHighlight(wsHoveredCells);
}

function wsOnPointerUp(e) {
  if (!wsIsDragging) return;
  wsIsDragging = false;
  const cells = wsHoveredCells.slice();
  wsApplyHighlight([]);
  wsHoveredCells = [];
  if (cells.length >= 2) wsCheckMatch(cells);
}

function wsSnapToAxis(dr, dc) {
  const angle = Math.atan2(dr, dc);
  const sector = Math.round(angle / (Math.PI / 4));
  const idx = ((sector % 8) + 8) % 8;
  const axes = [[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]];
  return axes[idx];
}

function wsProjectOnAxis(dr, dc, axis) {
  if (axis[0] !== 0 && axis[1] !== 0) return Math.max(Math.abs(dr), Math.abs(dc));
  if (axis[0] === 0) return Math.abs(dc);
  return Math.abs(dr);
}

function wsApplyHighlight(cells) {
  if (!wsCurrentPuzzle) return;
  document.querySelectorAll(".ws-cell.selecting").forEach(c => c.classList.remove("selecting"));
  cells.forEach(({ r, c }) => {
    const el = wsGetCell(r, c);
    if (el && !el.classList.contains("ws-found")) el.classList.add("selecting");
  });
}

function wsGetCell(r, c) {
  return document.querySelector(`.ws-cell[data-row="${r}"][data-col="${c}"]`);
}

function wsCheckMatch(cells) {
  if (!wsCurrentPuzzle) return;
  const fwd = cells.map(({ r, c }) => wsCurrentPuzzle.grid[r][c]).join("");
  const rev = fwd.split("").reverse().join("");

  for (const p of wsCurrentPuzzle.placed) {
    if (p.discovered) continue;
    const target = p.letters.join("");
    if (fwd === target || rev === target) {
      wsMarkFound(p, cells);
      wsShowWordPopup(p.word);
      return;
    }
  }
  // Wrong selection: flash red
  cells.forEach(({ r, c }) => {
    const el = wsGetCell(r, c);
    if (!el) return;
    el.classList.add("ws-wrong-flash");
    setTimeout(() => el.classList.remove("ws-wrong-flash"), 500);
  });
}

function wsMarkFound(placed, cells) {
  placed.discovered = true;
  wsCurrentPuzzle.foundIds.push(placed.word.id);
  cells.forEach(({ r, c }) => {
    const el = wsGetCell(r, c);
    if (!el) return;
    el.classList.remove("selecting");
    el.classList.add("ws-found", `ws-found-${placed.colorIdx}`);
  });
  // Update word list chip
  const chip = document.querySelector(`.ws-target-word[data-word-id="${placed.word.id}"]`);
  if (chip) chip.classList.add("found");
  // Update counter
  const total = wsCurrentPuzzle.placed.length;
  const found = wsCurrentPuzzle.foundIds.length;
  document.getElementById("ws-word-count").textContent = `${found} / ${total}`;
  // Persist found word
  try {
    const fw = JSON.parse(localStorage.getItem("ws_found_words") || "{}");
    fw[String(placed.word.id)] = true;
    localStorage.setItem("ws_found_words", JSON.stringify(fw));
    const total2 = parseInt(localStorage.getItem("ws_total_found") || "0") + 1;
    localStorage.setItem("ws_total_found", String(total2));
  } catch {}
  if (found === total) wsPuzzleComplete();
}

function wsPuzzleComplete() {
  recordGamesStreak();
  awardXP(10, "Wortsuche");
  updateGamesStreakBadge();
  const list = document.getElementById("ws-word-list");
  const n = wsCurrentPuzzle.placed.length;
  list.innerHTML = `<div class="ws-complete-msg">All ${n} words found! <button id="ws-play-again-btn" class="ws-play-again-btn">New Puzzle</button></div>`;
  document.getElementById("ws-play-again-btn")?.addEventListener("click", wsGenerateAndRender);
}

function wsShowWordPopup(word) {
  wsCurrentPopupWordId = word.id;
  const popup = document.getElementById("ws-word-popup");

  // Populate immediately with static data
  document.getElementById("ws-popup-article").textContent = word.article || "";
  document.getElementById("ws-popup-word").textContent = word.german;
  document.getElementById("ws-popup-pos").textContent = word.pos || "";
  document.getElementById("ws-popup-english").textContent = word.english || "";
  document.getElementById("ws-popup-forms").textContent = "";
  document.getElementById("ws-popup-example").innerHTML = (word.example_de || "").replace(/<mark>/g, "<strong>").replace(/<\/mark>/g, "</strong>");
  document.getElementById("ws-popup-tip").textContent = word.mnemonic ? `💡 ${word.mnemonic}` : "";
  document.getElementById("ws-popup-spinner").style.display = "";

  // Check if already in SRS
  loadWordsSRS();
  const addBtn = document.getElementById("ws-popup-add-btn");
  if (wordsSRS[String(word.id)]) {
    addBtn.textContent = "Already in Word List";
    addBtn.disabled = true;
  } else {
    addBtn.textContent = "+ Add to Word List";
    addBtn.disabled = false;
  }

  popup.style.display = "";

  // Async enrich with AI
  fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "game-word-info", wordData: word }),
  })
    .then(r => r.json())
    .then(data => {
      if (wsCurrentPopupWordId !== word.id) return; // popup changed
      if (data.forms) document.getElementById("ws-popup-forms").textContent = data.forms;
      if (data.example) {
        document.getElementById("ws-popup-example").textContent = data.example;
        if (data.example_en) {
          document.getElementById("ws-popup-example").innerHTML +=
            `<div class="ws-popup-example-en">${data.example_en}</div>`;
        }
      }
      if (data.plural) {
        document.getElementById("ws-popup-forms").textContent =
          [data.forms, `Plural: ${data.plural}`].filter(Boolean).join(" · ");
      }
      if (data.tip) document.getElementById("ws-popup-tip").textContent = `💡 ${data.tip}`;
    })
    .catch(() => {})
    .finally(() => {
      const spinner = document.getElementById("ws-popup-spinner");
      if (spinner) spinner.style.display = "none";
    });
}

function closeWordPopup() {
  document.getElementById("ws-word-popup").style.display = "none";
  wsCurrentPopupWordId = null;
}

function addWordToSRS(wordId) {
  loadWordsSRS();
  const key = String(wordId);
  if (wordsSRS[key]) {
    const btn = document.getElementById("ws-popup-add-btn");
    if (btn) { btn.textContent = "Already in Word List"; btn.disabled = true; }
    return;
  }
  wordsSRS[key] = {
    interval: 0, easeFactor: 2.5, dueDate: null,
    lastReviewed: null, totalReviews: 0, totalCorrect: 0, archived: false,
  };
  saveWordsSRS();
  const btn = document.getElementById("ws-popup-add-btn");
  if (btn) { btn.textContent = "Saved ✓"; btn.disabled = true; }
}

function handleWsHint() {
  if (!wsCurrentPuzzle) return;
  const remaining = wsCurrentPuzzle.placed.filter(p => !p.discovered);
  if (!remaining.length) return;

  if (wsHintsUsed >= 3) {
    document.getElementById("ws-hint-btn").disabled = true;
    return;
  }
  wsHintsUsed++;

  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  const hintCell = wsGetCell(pick.r0, pick.c0);
  if (hintCell) {
    hintCell.classList.add("ws-hint-pulse");
    setTimeout(() => hintCell.classList.remove("ws-hint-pulse"), 2200);
  }

  const remaining2 = 3 - wsHintsUsed;
  const msg = document.getElementById("ws-hint-msg");
  if (msg) {
    msg.style.display = "";
    msg.textContent = `Hint: look for a word starting with "${pick.letters[0]}"`;
    setTimeout(() => { msg.style.display = "none"; }, 3500);
  }

  const hintBtn = document.getElementById("ws-hint-btn");
  if (remaining2 <= 0) {
    hintBtn.textContent = "No hints left";
    hintBtn.disabled = true;
  } else {
    hintBtn.textContent = `Hint (${remaining2})`;
  }
}

function getGamesStreak() {
  try {
    const data = JSON.parse(localStorage.getItem("ws_streak") || "{}");
    const today = todayStr();
    const yesterday = daysAgoStr(1);
    if (data.last === today) return data.count || 1;
    if (data.last === yesterday) return data.count || 0;
    return 0;
  } catch { return 0; }
}

function recordGamesStreak() {
  try {
    const today = todayStr();
    const yesterday = daysAgoStr(1);
    const data = JSON.parse(localStorage.getItem("ws_streak") || "{}");
    if (data.last === today) return;
    const newCount = (data.last === yesterday) ? (data.count || 0) + 1 : 1;
    localStorage.setItem("ws_streak", JSON.stringify({ last: today, count: newCount }));
  } catch {}
}

function updateGamesStreakBadge() {
  const streak = getGamesStreak();
  const badge = document.getElementById("games-streak-badge");
  if (!badge) return;
  badge.textContent = streak > 0 ? `🔥 ${streak} day streak` : "";
  badge.style.display = streak > 0 ? "" : "none";
}

function saveWsPuzzleState() {
  if (!wsCurrentPuzzle) return;
  try {
    localStorage.setItem("ws_puzzle_state", JSON.stringify({
      grid: wsCurrentPuzzle.grid,
      placed: wsCurrentPuzzle.placed.map(p => ({
        wordId: p.word.id, r0: p.r0, c0: p.c0, dr: p.dr, dc: p.dc,
        letters: p.letters, discovered: p.discovered, colorIdx: p.colorIdx,
      })),
      foundIds: wsCurrentPuzzle.foundIds,
      wsWsMode,
      ts: Date.now(),
    }));
  } catch {}
}

// ---- Grammar Sprint ----

const GS_CIRCUMFERENCE = 2 * Math.PI * 44;

function openGrammarSprint() {
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
  hideRecallSpecificEls();
  aiPanel.style.display = "none";
  ["progress-panel","vocab-panel","grammar-panel","words-panel","drills-panel",
   "starters-panel","speak-panel","monologue-panel"].forEach(id => {
    document.getElementById(id).style.display = "none";
  });
  document.getElementById("games-panel").style.display = "flex";
  showGamesLanding();
  document.getElementById("games-landing").style.display = "none";
  document.getElementById("grammarsprint-view").style.display = "flex";

  gsRunning = false;
  if (gsTimerInterval) { clearInterval(gsTimerInterval); gsTimerInterval = null; }
  gsHighScore = parseInt(localStorage.getItem("gs_highscore") || "0", 10);

  gsShowReady();
  gsUpdateStreak();

  document.getElementById("gs-back-btn").onclick = () => {
    if (gsTimerInterval) { clearInterval(gsTimerInterval); gsTimerInterval = null; }
    showGamesLanding();
  };
  document.querySelectorAll(".gs-set-btn").forEach(btn => {
    btn.onclick = () => {
      gsSet = btn.dataset.gsset;
      document.querySelectorAll(".gs-set-btn").forEach(b => b.classList.toggle("active", b === btn));
    };
  });
  document.querySelectorAll(".gs-dur-btn").forEach(btn => {
    btn.onclick = () => {
      gsDuration = parseInt(btn.dataset.gsdur, 10);
      document.querySelectorAll(".gs-dur-btn").forEach(b => b.classList.toggle("active", b === btn));
    };
  });
  document.getElementById("gs-start-btn").onclick = gsStartSprint;
  document.getElementById("gs-again-btn").onclick = gsStartSprint;
  document.getElementById("gs-change-btn").onclick = gsShowReady;
}

function gsGetPool() {
  if (!DRILL_SETS) return [];
  if (gsSet === "all") return Object.values(DRILL_SETS).flatMap(s => s.items);
  return (DRILL_SETS[gsSet]?.items) || [];
}

function gsShuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function gsShowReady() {
  if (gsTimerInterval) { clearInterval(gsTimerInterval); gsTimerInterval = null; }
  gsRunning = false;
  document.getElementById("gs-ready-section").style.display = "flex";
  document.getElementById("gs-play-section").style.display = "none";
  document.getElementById("gs-done-section").style.display = "none";
}

function gsStartSprint() {
  const pool = gsGetPool();
  if (!pool.length) return;
  gsQueue = gsShuffle(pool);
  gsQueueIdx = 0;
  gsSessionCorrect = 0;
  gsSessionTotal = 0;
  gsSecondsLeft = gsDuration;

  document.getElementById("gs-ready-section").style.display = "none";
  document.getElementById("gs-done-section").style.display = "none";
  document.getElementById("gs-play-section").style.display = "flex";
  document.getElementById("gs-rule-display").style.display = "none";

  gsUpdatePlayStats();
  gsSetTimerDisplay(gsSecondsLeft);
  gsSetArc(1);
  gsRunning = true;
  gsRenderQuestion();

  if (gsTimerInterval) clearInterval(gsTimerInterval);
  gsTimerInterval = setInterval(() => {
    gsSecondsLeft--;
    gsSetTimerDisplay(gsSecondsLeft);
    gsSetArc(gsSecondsLeft / gsDuration);
    if (gsSecondsLeft <= 0) gsEndSprint();
  }, 1000);
}

function gsRenderQuestion() {
  if (gsQueueIdx >= gsQueue.length) gsQueue = gsShuffle(gsGetPool());
  const item = gsQueue[gsQueueIdx % gsQueue.length];
  gsQueueIdx++;

  const sentEl = document.getElementById("gs-sentence-display");
  sentEl.innerHTML = item.sentence.replace("_____", '<span class="gs-blank">___</span>').replace("___", '<span class="gs-blank">___</span>');
  document.getElementById("gs-rule-display").style.display = "none";
  document.getElementById("gs-rule-display").textContent = "";

  const opts = gsShuffle([item.answer, ...item.distractors]);
  const grid = document.getElementById("gs-answer-grid");
  grid.innerHTML = "";
  opts.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "gs-opt-btn";
    btn.textContent = opt;
    btn.onclick = () => gsPickAnswer(opt, item, btn);
    grid.appendChild(btn);
  });
}

function gsPickAnswer(chosen, item, btn) {
  if (!gsRunning) return;
  const correct = chosen === item.answer;
  gsSessionTotal++;
  if (correct) gsSessionCorrect++;

  document.querySelectorAll(".gs-opt-btn").forEach(b => {
    b.disabled = true;
    if (b.textContent === item.answer) b.classList.add("gs-opt-correct");
    else if (b === btn && !correct) b.classList.add("gs-opt-wrong");
    else b.classList.add("gs-opt-dim");
  });

  const blank = document.querySelector(".gs-blank");
  if (blank) { blank.textContent = item.answer; blank.className = correct ? "gs-blank gs-filled-correct" : "gs-blank gs-filled-wrong"; }

  if (!correct) {
    const ruleEl = document.getElementById("gs-rule-display");
    ruleEl.textContent = item.rule;
    ruleEl.style.display = "block";
    addDrillMistake(gsSet !== "all" ? gsSet : findDrillSetKeyForItem(item), item);
  } else {
    clearDrillMistake(item);
  }

  gsUpdatePlayStats();
  if (correct) recordGsDone();

  setTimeout(gsRenderQuestion, correct ? 350 : 900);
}

function gsEndSprint() {
  clearInterval(gsTimerInterval);
  gsTimerInterval = null;
  gsRunning = false;
  gsSetTimerDisplay(0);
  gsSetArc(0);

  if (gsSessionCorrect > gsHighScore) {
    gsHighScore = gsSessionCorrect;
    localStorage.setItem("gs_highscore", String(gsHighScore));
  }

  const accuracy = gsSessionTotal > 0 ? Math.round((gsSessionCorrect / gsSessionTotal) * 100) : 0;
  document.getElementById("gs-done-score").textContent = gsSessionCorrect + " correct out of " + gsSessionTotal + " (" + accuracy + "%)";
  document.getElementById("gs-done-highscore").textContent = "Best: " + gsHighScore + " correct";

  const setLabel = gsSet === "all" ? "All sets" : (DRILL_SETS[gsSet]?.label || gsSet);
  document.getElementById("gs-done-breakdown").textContent = setLabel + " · " + gsDuration + "s";

  document.getElementById("gs-play-section").style.display = "none";
  document.getElementById("gs-done-section").style.display = "flex";

  if (gsSessionTotal > 0) awardXP(Math.min(10, 2 + gsSessionCorrect), "Grammar Sprint");
  gsUpdateStreak();
}

function gsSetTimerDisplay(s) {
  const el = document.getElementById("gs-timer-display");
  if (el) el.textContent = s;
}

function gsSetArc(fraction) {
  const arc = document.getElementById("gs-timer-arc");
  if (!arc) return;
  arc.style.strokeDashoffset = GS_CIRCUMFERENCE * (1 - fraction);
  if (fraction <= 0.25) arc.classList.add("low-time");
  else arc.classList.remove("low-time");
}

function gsUpdatePlayStats() {
  document.getElementById("gs-score-big").textContent = gsSessionCorrect;
  document.getElementById("gs-total-label").textContent = gsSessionTotal + " attempted";
}

function gsUpdateStreak() {
  const streak = getGsStreak();
  const badge = document.getElementById("gs-streak-badge");
  if (!badge) return;
  if (streak > 0) { badge.textContent = "🔥 " + streak + " day streak"; badge.classList.add("visible"); }
  else badge.classList.remove("visible");
}

function getGsStreak() {
  try {
    const data = JSON.parse(localStorage.getItem("gs_streak") || "{}");
    const today = todayStr();
    const yesterday = daysAgoStr(1);
    if (data.last === today || data.last === yesterday) return data.count || 0;
    return 0;
  } catch { return 0; }
}

function recordGsDone() {
  try {
    const today = todayStr();
    const yesterday = daysAgoStr(1);
    const data = JSON.parse(localStorage.getItem("gs_streak") || "{}");
    if (data.last === today) return;
    const newCount = data.last === yesterday ? (data.count || 0) + 1 : 1;
    localStorage.setItem("gs_streak", JSON.stringify({ last: today, count: newCount }));
  } catch {}
}

// ---- Listening Blitz ----

const LB_SKIP_WORDS = new Set([
  "ich","sie","er","es","wir","ihr","ist","bin","hat","habe","haben","sein","war","waren",
  "eine","einen","einem","einer","eines","der","die","das","dem","den","des",
  "ein","kein","und","aber","oder","weil","dass","wenn","ob","nicht","auch","noch",
  "ja","nein","so","wie","was","wo","wer","doch","mal","sich","mir","dir","uns","euch",
  "in","an","auf","bei","von","zu","mit","für","aus","nach","über","unter","vor","hinter",
  "am","im","ins","ans","zum","zur","beim","vom","durch","gegen","ohne","um",
  "du","ich","mich","dich","ihn","ihm","ihr","ihnen","wir",
]);

function openListeningBlitz() {
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
  hideRecallSpecificEls();
  aiPanel.style.display = "none";
  ["progress-panel","vocab-panel","grammar-panel","words-panel","drills-panel",
   "starters-panel","speak-panel","monologue-panel"].forEach(id => {
    document.getElementById(id).style.display = "none";
  });
  document.getElementById("games-panel").style.display = "flex";
  document.getElementById("games-landing").style.display = "none";
  document.getElementById("wordsearch-view").style.display = "none";
  document.getElementById("talkbox-view").style.display = "none";
  document.getElementById("sentencebuilder-view").style.display = "none";
  document.getElementById("listeningblitz-view").style.display = "flex";

  lbSessionScore = 0;
  lbSessionTotal = 0;
  lbSeenIds = new Set();
  lbChecked = false;

  lbUpdateScore();
  lbUpdateStreak();
  lbNextPhrase();

  document.getElementById("lb-back-btn").onclick = () => {
    const audio = document.getElementById("lb-audio");
    if (audio) { audio.pause(); audio.src = ""; }
    showGamesLanding();
  };
  document.getElementById("lb-play-btn").onclick = lbPlayAudio;
  document.getElementById("lb-replay-btn").onclick = lbPlayAudio;
  document.getElementById("lb-next-btn").onclick = lbNextPhrase;
}

function lbGetPool() {
  if (!PHRASES || !PHRASES.length) return [];
  return PHRASES.filter(p => p.audio && p.german.split(/\s+/).length >= 5);
}

function lbNextPhrase() {
  const audio = document.getElementById("lb-audio");
  if (audio) { audio.pause(); audio.src = ""; }

  const pool = lbGetPool();
  const unseen = pool.filter(p => !lbSeenIds.has(p.id));
  const candidates = unseen.length > 0 ? unseen : pool;
  if (!candidates.length) return;
  if (unseen.length === 0) lbSeenIds = new Set();

  const phrase = candidates[Math.floor(Math.random() * candidates.length)];
  lbCurrentPhrase = phrase;
  lbSeenIds.add(phrase.id);
  lbChecked = false;

  const words = phrase.german.trim().split(/\s+/);
  const { idx } = lbPickBlankIdx(words);
  lbTargetIdx = idx;
  lbTargetWord = words[idx];

  lbOptions = lbBuildOptions(lbTargetWord, phrase.id);
  lbRenderSentence(words, idx);
  lbRenderOptions();

  document.getElementById("lb-feedback-area").style.display = "none";
  document.getElementById("lb-play-btn").style.display = "";
  document.getElementById("lb-replay-btn").style.display = "none";

  if (audio) {
    audio.src = phrase.audio;
    audio.load();
    audio.play().catch(() => {});
    document.getElementById("lb-play-btn").style.display = "none";
    document.getElementById("lb-replay-btn").style.display = "";
  }
}

function lbPickBlankIdx(words) {
  const candidates = words
    .map((w, i) => ({ w: w.replace(/[.,!?;:"„"'()]/g, "").toLowerCase(), i }))
    .filter(({ w, i }) => w.length >= 4 && !LB_SKIP_WORDS.has(w) && i > 0);
  if (candidates.length > 0) {
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    return { idx: pick.i };
  }
  return { idx: Math.max(1, Math.floor(words.length / 2)) };
}

function lbBuildOptions(target, excludeId) {
  const pool = lbGetPool();
  const allWords = [];
  pool.forEach(p => {
    if (p.id === excludeId) return;
    p.german.trim().split(/\s+/).forEach(w => {
      const clean = w.replace(/[.,!?;:"„"'()]/g, "");
      if (clean.length >= 4 && !LB_SKIP_WORDS.has(clean.toLowerCase()) && clean !== target) {
        allWords.push(clean);
      }
    });
  });
  const targetClean = target.replace(/[.,!?;:"„"'()]/g, "");
  const suffix = target.slice(targetClean.length);
  const shuffled = allWords.sort(() => Math.random() - 0.5);
  const seen = new Set([targetClean.toLowerCase()]);
  const distractors = [];
  for (const w of shuffled) {
    if (distractors.length >= 3) break;
    if (!seen.has(w.toLowerCase())) { seen.add(w.toLowerCase()); distractors.push(w + suffix); }
  }
  while (distractors.length < 3) distractors.push("???");
  const opts = [target, ...distractors];
  return opts.sort(() => Math.random() - 0.5);
}

function lbRenderSentence(words, blankIdx) {
  const display = document.getElementById("lb-sentence-display");
  display.innerHTML = "";
  words.forEach((w, i) => {
    if (i > 0) display.appendChild(document.createTextNode(" "));
    if (i === blankIdx) {
      const span = document.createElement("span");
      span.id = "lb-blank";
      span.className = "lb-blank";
      span.textContent = "___";
      display.appendChild(span);
    } else {
      display.appendChild(document.createTextNode(w));
    }
  });
}

function lbRenderOptions() {
  const grid = document.getElementById("lb-options-grid");
  grid.innerHTML = "";
  lbOptions.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "lb-option-btn";
    btn.textContent = opt;
    btn.onclick = () => lbSelectOption(opt, btn);
    grid.appendChild(btn);
  });
}

function lbSelectOption(chosen, btn) {
  if (lbChecked) return;
  lbChecked = true;
  lbSessionTotal++;

  const cleanChosen = chosen.replace(/[.,!?;:"„"'()]/g, "").toLowerCase();
  const cleanTarget = lbTargetWord.replace(/[.,!?;:"„"'()]/g, "").toLowerCase();
  const correct = cleanChosen === cleanTarget;

  document.querySelectorAll(".lb-option-btn").forEach(b => {
    const bClean = b.textContent.replace(/[.,!?;:"„"'()]/g, "").toLowerCase();
    if (bClean === cleanTarget) b.classList.add("lb-opt-correct");
    else b.classList.add("lb-opt-disabled");
    b.disabled = true;
  });
  if (!correct) btn.classList.add("lb-opt-wrong");

  const blank = document.getElementById("lb-blank");
  if (blank) { blank.textContent = lbTargetWord; blank.className = correct ? "lb-blank lb-revealed-correct" : "lb-blank lb-revealed-wrong"; }

  const icon = document.getElementById("lb-feedback-icon");
  const text = document.getElementById("lb-feedback-text");
  icon.textContent = correct ? "✓" : "✗";
  icon.className = correct ? "lb-correct" : "lb-wrong";
  text.textContent = correct ? "Correct!" : "Not quite.";

  document.getElementById("lb-full-sentence").textContent = lbCurrentPhrase.english;
  document.getElementById("lb-feedback-area").style.display = "flex";

  if (correct) { lbSessionScore++; recordLbDone(); lbUpdateStreak(); }
  lbUpdateScore();
}

function lbPlayAudio() {
  const audio = document.getElementById("lb-audio");
  if (!audio || !lbCurrentPhrase) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function lbUpdateScore() {
  document.getElementById("lb-score-display").textContent = lbSessionScore + " / " + lbSessionTotal;
}

function lbUpdateStreak() {
  const streak = getLbStreak();
  const badge = document.getElementById("lb-streak-badge");
  if (!badge) return;
  if (streak > 0) { badge.textContent = "🔥 " + streak + " day streak"; badge.classList.add("visible"); }
  else badge.classList.remove("visible");
}

function getLbStreak() {
  try {
    const data = JSON.parse(localStorage.getItem("lb_streak") || "{}");
    const today = todayStr();
    const yesterday = daysAgoStr(1);
    if (data.last === today || data.last === yesterday) return data.count || 0;
    return 0;
  } catch { return 0; }
}

function recordLbDone() {
  try {
    const today = todayStr();
    const yesterday = daysAgoStr(1);
    const data = JSON.parse(localStorage.getItem("lb_streak") || "{}");
    if (data.last === today) return;
    const newCount = data.last === yesterday ? (data.count || 0) + 1 : 1;
    localStorage.setItem("lb_streak", JSON.stringify({ last: today, count: newCount }));
  } catch {}
}

// ---- Sentence Builder ----

function openSentenceBuilder() {
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
  hideRecallSpecificEls();
  aiPanel.style.display = "none";
  ["progress-panel","vocab-panel","grammar-panel","words-panel","drills-panel",
   "starters-panel","speak-panel","monologue-panel"].forEach(id => {
    document.getElementById(id).style.display = "none";
  });
  document.getElementById("games-panel").style.display = "flex";
  document.getElementById("games-landing").style.display = "none";
  document.getElementById("wordsearch-view").style.display = "none";
  document.getElementById("talkbox-view").style.display = "none";
  document.getElementById("sentencebuilder-view").style.display = "flex";

  sbSessionScore = 0;
  sbSessionTotal = 0;
  sbGrammarFilter = "all";
  sbSeenIds = new Set();
  sbChecked = false;

  document.querySelectorAll(".sb-filter-btn").forEach(b => b.classList.toggle("active", b.dataset.sbgrammar === "all"));
  sbUpdateScore();
  sbUpdateStreak();
  sbNextPhrase();

  document.getElementById("sb-back-btn").onclick = showGamesLanding;
  document.querySelectorAll(".sb-filter-btn").forEach(btn => {
    btn.onclick = () => {
      sbGrammarFilter = btn.dataset.sbgrammar;
      document.querySelectorAll(".sb-filter-btn").forEach(b => b.classList.toggle("active", b === btn));
      sbSeenIds = new Set();
      sbNextPhrase();
    };
  });
  document.getElementById("sb-check-btn").onclick = sbCheck;
  document.getElementById("sb-clear-btn").onclick = sbClear;
  document.getElementById("sb-skip-btn").onclick = sbSkip;
  document.getElementById("sb-next-btn").onclick = sbNextPhrase;
}

function sbGetPool() {
  if (!PHRASES || !PHRASES.length) return [];
  return PHRASES.filter(p => {
    const words = p.german.trim().split(/\s+/);
    if (words.length < 4 || words.length > 13) return false;
    if (sbGrammarFilter === "all") return true;
    const tags = GRAMMAR_TAGS[p.id] || [];
    return sbGrammarFilter === "Nebensatz"
      ? tags.some(t => t.startsWith("Nebensatz"))
      : tags.includes(sbGrammarFilter);
  });
}

function sbNextPhrase() {
  const pool = sbGetPool();
  const unseen = pool.filter(p => !sbSeenIds.has(p.id));
  const candidates = unseen.length > 0 ? unseen : pool;
  if (!candidates.length) return;
  if (unseen.length === 0) sbSeenIds = new Set();

  const phrase = candidates[Math.floor(Math.random() * candidates.length)];
  sbCurrentPhrase = phrase;
  sbSeenIds.add(phrase.id);
  sbChecked = false;

  const words = phrase.german.trim().split(/\s+/);
  sbBankWords = sbShuffle(words.slice());
  sbBuiltWords = [];

  document.getElementById("sb-english-text").textContent = phrase.english;
  document.getElementById("sb-feedback-area").style.display = "none";
  document.getElementById("sb-build-zone").classList.remove("correct","wrong");
  document.getElementById("sb-check-btn").disabled = true;
  document.getElementById("sb-check-btn").textContent = "Check";
  document.getElementById("sb-actions").style.display = "flex";
  sbRenderTiles();
}

function sbShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function sbRenderTiles() {
  const buildEl = document.getElementById("sb-build-tiles");
  const bankEl = document.getElementById("sb-bank-tiles");
  const placeholder = document.getElementById("sb-build-placeholder");

  buildEl.innerHTML = "";
  bankEl.innerHTML = "";

  placeholder.style.display = sbBuiltWords.length === 0 ? "block" : "none";

  sbBuiltWords.forEach((word, idx) => {
    const btn = document.createElement("button");
    btn.className = "sb-tile sb-tile-built";
    btn.textContent = word;
    btn.onclick = () => { sbBuiltWords.splice(idx, 1); sbBankWords.push(word); sbRenderTiles(); sbSyncCheck(); };
    buildEl.appendChild(btn);
  });

  sbBankWords.forEach((word, idx) => {
    const btn = document.createElement("button");
    btn.className = "sb-tile sb-tile-bank";
    btn.textContent = word;
    btn.onclick = () => { sbBankWords.splice(idx, 1); sbBuiltWords.push(word); sbRenderTiles(); sbSyncCheck(); };
    bankEl.appendChild(btn);
  });
}

function sbSyncCheck() {
  document.getElementById("sb-check-btn").disabled = sbBuiltWords.length === 0 || sbChecked;
}

function sbNormalize(str) {
  return str.toLowerCase().replace(/[.,!?;:"""„"'()\-]/g, "").replace(/\s+/g, " ").trim();
}

function sbCheck() {
  if (!sbCurrentPhrase || sbChecked) return;
  sbChecked = true;
  sbSessionTotal++;

  const userSentence = sbBuiltWords.join(" ");
  const correct = sbNormalize(userSentence) === sbNormalize(sbCurrentPhrase.german);

  const zone = document.getElementById("sb-build-zone");
  zone.classList.toggle("correct", correct);
  zone.classList.toggle("wrong", !correct);

  const feedbackArea = document.getElementById("sb-feedback-area");
  const feedbackIcon = document.getElementById("sb-feedback-icon");
  const feedbackText = document.getElementById("sb-feedback-text");
  const correctWrap = document.getElementById("sb-correct-wrap");
  const correctSentence = document.getElementById("sb-correct-sentence");

  if (correct) {
    sbSessionScore++;
    feedbackIcon.textContent = "✓";
    feedbackIcon.className = "sb-correct";
    feedbackText.textContent = "Correct!";
    correctWrap.style.display = "none";
    recordSbDone();
    awardXP(3, "Satzbau");
    sbUpdateStreak();
  } else {
    feedbackIcon.textContent = "✗";
    feedbackIcon.className = "sb-wrong";
    feedbackText.textContent = "Not quite.";
    correctWrap.style.display = "";
    correctSentence.textContent = sbCurrentPhrase.german;
  }

  feedbackArea.style.display = "flex";
  document.getElementById("sb-check-btn").disabled = true;
  document.getElementById("sb-actions").style.display = "none";
  sbUpdateScore();
}

function sbClear() {
  sbBankWords = [...sbBankWords, ...sbBuiltWords];
  sbBuiltWords = [];
  sbBankWords = sbShuffle(sbBankWords);
  sbRenderTiles();
  sbSyncCheck();
  document.getElementById("sb-build-zone").classList.remove("correct","wrong");
}

function sbSkip() {
  sbNextPhrase();
}

function sbUpdateScore() {
  document.getElementById("sb-score-display").textContent = sbSessionScore + " / " + sbSessionTotal;
}

function sbUpdateStreak() {
  const streak = getSbStreak();
  const badge = document.getElementById("sb-streak-badge");
  if (!badge) return;
  if (streak > 0) { badge.textContent = "🔥 " + streak + " day streak"; badge.classList.add("visible"); }
  else badge.classList.remove("visible");
}

function getSbStreak() {
  try {
    const data = JSON.parse(localStorage.getItem("sb_streak") || "{}");
    const today = todayStr();
    const yesterday = daysAgoStr(1);
    if (data.last === today || data.last === yesterday) return data.count || 0;
    return 0;
  } catch { return 0; }
}

function recordSbDone() {
  try {
    const today = todayStr();
    const yesterday = daysAgoStr(1);
    const data = JSON.parse(localStorage.getItem("sb_streak") || "{}");
    if (data.last === today) return;
    const newCount = data.last === yesterday ? (data.count || 0) + 1 : 1;
    localStorage.setItem("sb_streak", JSON.stringify({ last: today, count: newCount }));
  } catch {}
}

// ---- Talk Box ----

const TB_CIRCUMFERENCE = 2 * Math.PI * 44;

function openTalkBox() {
  document.getElementById("controls-bar").style.display = "none";
  playerEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
  hideRecallSpecificEls();
  aiPanel.style.display = "none";
  document.getElementById("progress-panel").style.display = "none";
  document.getElementById("vocab-panel").style.display = "none";
  document.getElementById("grammar-panel").style.display = "none";
  document.getElementById("words-panel").style.display = "none";
  document.getElementById("drills-panel").style.display = "none";
  document.getElementById("starters-panel").style.display = "none";
  document.getElementById("speak-panel").style.display = "none";
  document.getElementById("monologue-panel").style.display = "none";
  document.getElementById("games-panel").style.display = "flex";

  document.getElementById("games-landing").style.display = "none";
  document.getElementById("wordsearch-view").style.display = "none";
  document.getElementById("talkbox-view").style.display = "flex";

  tbStopRecording();
  tbClearTimer();
  tbCurrentCard = null;
  tbSeenIds = new Set();
  tbCategory = "alltag";
  tbDuration = 45;
  tbTranscriptChunks = [];

  document.querySelectorAll(".tb-cat-btn").forEach(b => b.classList.toggle("active", b.dataset.tbcat === "alltag"));
  document.querySelectorAll(".tb-dur-btn").forEach(b => b.classList.toggle("active", b.dataset.dur === "45"));
  tbResetToDrawState();
  tbUpdateStreakBadge();

  document.querySelectorAll(".tb-dur-btn").forEach(btn => {
    btn.onclick = () => {
      if (tbIsRecording) return;
      tbDuration = parseInt(btn.dataset.dur, 10);
      tbSecondsLeft = tbDuration;
      document.querySelectorAll(".tb-dur-btn").forEach(b => b.classList.toggle("active", b === btn));
      tbSetTimerDisplay(tbDuration);
      tbSetArc(1);
    };
  });

  document.getElementById("tb-back-btn").onclick = () => {
    tbStopRecording();
    tbClearTimer();
    showGamesLanding();
  };

  document.querySelectorAll(".tb-cat-btn").forEach(btn => {
    btn.onclick = () => tbSelectCategory(btn.dataset.tbcat);
  });

  document.getElementById("tb-draw-btn").onclick = tbDrawCard;
  document.getElementById("tb-start-btn").onclick = tbStartSpeaking;
  document.getElementById("tb-stop-btn").onclick = tbTimeUp;
  document.getElementById("tb-next-btn").onclick = () => {
    tbStopRecording();
    tbClearTimer();
    tbCurrentCard = null;
    tbResetToDrawState();
  };
  document.getElementById("tb-retry-btn").onclick = tbRetry;
}

function tbSelectCategory(cat) {
  tbCategory = cat;
  document.querySelectorAll(".tb-cat-btn").forEach(b => b.classList.toggle("active", b.dataset.tbcat === cat));
  tbCurrentCard = null;
  tbSeenIds = new Set();
  tbStopRecording();
  tbClearTimer();
  tbResetToDrawState();
}

function tbResetToDrawState() {
  document.getElementById("tb-card").classList.remove("flipped");
  document.getElementById("tb-card-category-label").textContent = "";
  document.getElementById("tb-card-prompt-de").textContent = "";
  document.getElementById("tb-card-prompt-en").textContent = "";
  document.getElementById("tb-draw-area").style.display = "flex";
  document.getElementById("tb-actions").style.display = "none";
  document.getElementById("tb-duration-row").style.display = "none";
  document.getElementById("tb-timer-ring-wrap").style.display = "none";
  document.getElementById("tb-transcript-area").style.display = "none";
  document.getElementById("tb-transcript-text").textContent = "";
  document.getElementById("tb-feedback-area").style.display = "none";
  document.getElementById("tb-sample-wrap").style.display = "none";
  document.getElementById("tb-start-btn").textContent = "▶ Start Speaking";
  document.getElementById("tb-start-btn").disabled = false;
  document.getElementById("tb-start-btn").classList.remove("recording");
  document.getElementById("tb-stop-btn").style.display = "none";
  tbSetTimerDisplay(tbDuration);
  tbSetArc(1);
}

function tbDrawCard() {
  const pool = tbGetCardPool();
  const unseen = pool.filter(c => !tbSeenIds.has(c.id));
  const candidates = unseen.length > 0 ? unseen : pool;
  if (candidates.length === 0) return;
  if (unseen.length === 0) tbSeenIds = new Set();

  const card = candidates[Math.floor(Math.random() * candidates.length)];
  tbCurrentCard = card;
  tbSeenIds.add(card.id);

  const cat = tbCategory === "random"
    ? Object.values(TALKBOX_CARDS).find(c => c.cards.some(x => x.id === card.id))
    : TALKBOX_CARDS[tbCategory];

  document.getElementById("tb-card-category-label").textContent = cat ? `${cat.label} · ${cat.labelEn}` : "";
  document.getElementById("tb-card-prompt-de").textContent = card.de;
  document.getElementById("tb-card-prompt-en").textContent = card.en;

  document.getElementById("tb-draw-area").style.display = "none";
  document.getElementById("tb-card").classList.add("flipped");

  setTimeout(() => {
    document.getElementById("tb-duration-row").style.display = "flex";
    document.getElementById("tb-timer-ring-wrap").style.display = "flex";
    document.getElementById("tb-actions").style.display = "flex";
    tbSetTimerDisplay(tbDuration);
    tbSetArc(1);
  }, 520);
}

function tbGetCardPool() {
  if (!TALKBOX_CARDS) return [];
  if (tbCategory === "random") {
    return Object.values(TALKBOX_CARDS).flatMap(c => c.cards);
  }
  return (TALKBOX_CARDS[tbCategory]?.cards) || [];
}

async function tbStartSpeaking() {
  if (tbIsRecording) return;
  tbTranscriptChunks = [];
  document.getElementById("tb-transcript-text").textContent = "";
  document.getElementById("tb-transcript-area").style.display = "none";
  tbIsRecording = true;
  document.getElementById("tb-start-btn").textContent = "Listening…";
  document.getElementById("tb-start-btn").classList.add("recording");
  document.getElementById("tb-start-btn").disabled = true;
  document.getElementById("tb-stop-btn").style.display = "";

  try {
    const tokenRes = await fetch("/api/deepgram-token", { method: "POST" });
    if (!tokenRes.ok) throw new Error("token");
    const { key } = await tokenRes.json();
    tbMicStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const wsUrl = "wss://api.deepgram.com/v1/listen?language=de&model=nova-2-general&interim_results=true&endpointing=800&vad_events=true&encoding=linear16&sample_rate=16000";
    tbMicWS = new WebSocket(wsUrl, ["token", key]);

    tbMicWS.onopen = () => {
      tbMicRecorder = new MediaRecorder(tbMicStream, { mimeType: "audio/webm;codecs=opus" });
      tbMicRecorder.ondataavailable = (e) => {
        if (tbMicWS && tbMicWS.readyState === WebSocket.OPEN && e.data.size > 0) tbMicWS.send(e.data);
      };
      tbMicRecorder.start(100);
    };

    tbMicWS.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === "Results" && msg.is_final) {
        const t = msg.channel?.alternatives?.[0]?.transcript || "";
        if (t.trim()) {
          tbTranscriptChunks.push(t.trim());
          document.getElementById("tb-transcript-text").textContent = tbTranscriptChunks.join(" ");
          document.getElementById("tb-transcript-area").style.display = "flex";
        }
      }
    };
    tbMicWS.onerror = () => {};
    tbMicWS.onclose = () => {};
  } catch {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const sr = new SR();
      sr.lang = "de-DE";
      sr.interimResults = false;
      sr.continuous = true;
      sr.onresult = (ev) => {
        const t = ev.results[ev.results.length - 1][0].transcript.trim();
        if (t) {
          tbTranscriptChunks.push(t);
          document.getElementById("tb-transcript-text").textContent = tbTranscriptChunks.join(" ");
          document.getElementById("tb-transcript-area").style.display = "flex";
        }
      };
      sr.start();
      tbMicWS = { _sr: sr, close: () => sr.stop() };
    }
  }

  tbSecondsLeft = tbDuration;
  tbSetTimerDisplay(tbSecondsLeft);
  tbSetArc(1);
  tbTimerInterval = setInterval(() => {
    tbSecondsLeft--;
    tbSetTimerDisplay(tbSecondsLeft);
    tbSetArc(tbSecondsLeft / tbDuration);
    if (tbSecondsLeft <= 0) tbTimeUp();
  }, 1000);
}

function tbStopRecording() {
  tbIsRecording = false;
  if (tbMicRecorder && tbMicRecorder.state !== "inactive") tbMicRecorder.stop();
  if (tbMicWS) { tbMicWS.close(); tbMicWS = null; }
  if (tbMicStream) { tbMicStream.getTracks().forEach(t => t.stop()); tbMicStream = null; }
  tbMicRecorder = null;
}

async function tbTimeUp() {
  tbClearTimer();
  tbStopRecording();
  tbSetTimerDisplay(0);
  tbSetArc(0);
  recordTalkBoxDone();
  tbUpdateStreakBadge();

  document.getElementById("tb-start-btn").disabled = false;
  document.getElementById("tb-start-btn").classList.remove("recording");
  document.getElementById("tb-start-btn").textContent = "▶ Start Speaking";
  document.getElementById("tb-stop-btn").style.display = "none";

  const transcript = tbTranscriptChunks.join(" ").trim();
  const cardPrompt = tbCurrentCard ? tbCurrentCard.de : "";
  const category = tbCategory;

  document.getElementById("tb-feedback-area").style.display = "flex";
  document.getElementById("tb-feedback-text").textContent = "Getting feedback…";
  document.getElementById("tb-grammar-tip").style.display = "none";
  document.getElementById("tb-vocab-note").style.display = "none";
  document.getElementById("tb-next-btn").disabled = true;
  document.getElementById("tb-retry-btn").disabled = true;

  if (transcript.length > 5) {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "talkbox-feedback", text: transcript, prompt: cardPrompt, category }),
      });
      const data = await parseApiResponse(res);
      document.getElementById("tb-feedback-text").textContent = data.feedback || "Good effort — keep speaking!";
      if (data.sample) {
        document.getElementById("tb-sample-text").textContent = data.sample;
        document.getElementById("tb-sample-wrap").style.display = "";
        logError("talkbox", transcript, data.sample, data.feedback);
      }
      if (data.grammar_tip) {
        document.getElementById("tb-grammar-tip").textContent = "Grammar: " + data.grammar_tip;
        document.getElementById("tb-grammar-tip").style.display = "";
      }
      if (data.vocab_note) {
        document.getElementById("tb-vocab-note").textContent = "Vocab: " + data.vocab_note;
        document.getElementById("tb-vocab-note").style.display = "";
      }
    } catch {
      document.getElementById("tb-feedback-text").textContent = "Great effort speaking! Keep practicing.";
    }
  } else {
    document.getElementById("tb-feedback-text").textContent = "No speech detected. Make sure your microphone is on and try again!";
  }

  document.getElementById("tb-next-btn").disabled = false;
  document.getElementById("tb-retry-btn").disabled = false;
}

function tbRetry() {
  tbStopRecording();
  tbClearTimer();
  tbTranscriptChunks = [];
  document.getElementById("tb-transcript-text").textContent = "";
  document.getElementById("tb-transcript-area").style.display = "none";
  document.getElementById("tb-feedback-area").style.display = "none";
  document.getElementById("tb-sample-wrap").style.display = "none";
  document.getElementById("tb-start-btn").textContent = "▶ Start Speaking";
  document.getElementById("tb-start-btn").disabled = false;
  document.getElementById("tb-start-btn").classList.remove("recording");
  document.getElementById("tb-stop-btn").style.display = "none";
  tbSetTimerDisplay(tbDuration);
  tbSetArc(1);
}

function tbClearTimer() {
  if (tbTimerInterval) { clearInterval(tbTimerInterval); tbTimerInterval = null; }
  tbSecondsLeft = tbDuration;
}

function tbSetTimerDisplay(seconds) {
  document.getElementById("tb-timer-display").textContent = seconds;
}

function tbSetArc(fraction) {
  const arc = document.getElementById("tb-timer-arc");
  if (!arc) return;
  arc.style.strokeDashoffset = TB_CIRCUMFERENCE * (1 - fraction);
  if (fraction <= 0.25) arc.classList.add("low-time");
  else arc.classList.remove("low-time");
}

function getTalkBoxStreak() {
  try {
    const data = JSON.parse(localStorage.getItem("talkbox_streak") || "{}");
    const today = todayStr();
    const yesterday = daysAgoStr(1);
    if (data.last === today) return data.count || 0;
    if (data.last === yesterday) return data.count || 0;
    return 0;
  } catch { return 0; }
}

function recordTalkBoxDone() {
  try {
    const today = todayStr();
    const yesterday = daysAgoStr(1);
    const data = JSON.parse(localStorage.getItem("talkbox_streak") || "{}");
    if (data.last === today) return;
    const newCount = (data.last === yesterday) ? (data.count || 0) + 1 : 1;
    localStorage.setItem("talkbox_streak", JSON.stringify({ last: today, count: newCount }));
    const key = "talkbox_done_" + today;
    localStorage.setItem(key, String(parseInt(localStorage.getItem(key) || "0", 10) + 1));
  } catch {}
}

function tbUpdateStreakBadge() {
  const streak = getTalkBoxStreak();
  const badge = document.getElementById("tb-streak-badge");
  if (!badge) return;
  if (streak > 0) {
    badge.textContent = "🔥 " + streak + " day streak";
    badge.classList.add("visible");
  } else {
    badge.classList.remove("visible");
  }
}

// ---- Start ----
document.addEventListener("DOMContentLoaded", init);
