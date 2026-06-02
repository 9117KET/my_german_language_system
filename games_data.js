// games_data.js — Curated word sets for Word Search "Island" mode
// wordIds reference WORDS[].id from words_data.js
// Words are curated to length 5–11 chars, no spaces

const GAME_ISLAND_SETS = {
  morning_routine: {
    label: "Morning Routine",
    color: "#f59e0b",
    wordIds: [30, 31, 64, 146, 145, 104, 117, 155, 68, 27],
    // essen, trinken, Morgen, Kaffee, Frühstück, laufen, aufstehen, Wetter, Stunde, arbeiten
  },
  job_search: {
    label: "Job Search",
    color: "#4a9eff",
    wordIds: [49, 178, 180, 181, 183, 260, 34, 32, 188, 35],
    // Arbeit, Kollege, Bewerbung, Lebenslauf, Prüfung, Vertrag, sprechen, schreiben, Erfolg, verstehen
  },
  food_drink: {
    label: "Food & Eating Out",
    color: "#34d399",
    wordIds: [30, 31, 146, 118, 149, 122, 255, 148, 293, 288],
    // essen, trinken, Kaffee, bezahlen, Rechnung, reservieren, Tisch, Preis, Empfehlung, Markt
  },
  greetings: {
    label: "Greetings & Small Talk",
    color: "#a78bfa",
    wordIds: [21, 12, 34, 39, 52, 53, 176, 172, 173, 35],
    // heißen, kommen, sprechen, wohnen, Familie, Freund, Freude, Gefühl, Meinung, verstehen
  },
  travel: {
    label: "Travel & Directions",
    color: "#f472b6",
    wordIds: [29, 134, 271, 272, 273, 274, 286, 200, 317, 285],
    // fahren, Bahnhof, Fahrkarte, Verspätung, Abfahrt, Ankunft, Flughafen, Urlaub, umsteigen, Gepäck
  },
  health: {
    label: "Health & Pharmacy",
    color: "#fb7185",
    wordIds: [36, 135, 136, 138, 266, 267, 275, 280, 37, 113],
    // helfen, Apotheke, Krankenhaus, Termin, Rezept, Tablette, Körper, Schmerz, brauchen, warten
  },
  shopping: {
    label: "Shopping",
    color: "#fb923c",
    wordIds: [28, 310, 290, 148, 291, 212, 213, 149, 118, 16],
    // kaufen, einkaufen, Supermarkt, Preis, Rabatt, teuer, billig, Rechnung, bezahlen, nehmen
  },
  social: {
    label: "Social Plans",
    color: "#22d3ee",
    wordIds: [25, 106, 195, 197, 198, 176, 283, 284, 191, 101],
    // spielen, treffen, Musik, Sport, Reise, Freude, Feier, Einladung, Wunsch, lieben
  },
};
