const PHRASES = [
  {
    "id": 1,
    "german": "Ich bin heute Morgen um sieben Uhr aufgestanden.",
    "english": "I woke up at seven this morning.",
    "category": "morning_routine",
    "audio": ""
  },
  {
    "id": 2,
    "german": "Ich muss noch schnell duschen.",
    "english": "I still need to shower quickly.",
    "category": "morning_routine",
    "audio": ""
  },
  {
    "id": 3,
    "german": "Was soll ich heute anziehen?",
    "english": "What should I wear today?",
    "category": "morning_routine",
    "audio": ""
  },
  {
    "id": 4,
    "german": "Ich mache mir einen Kaffee.",
    "english": "I'm making myself a coffee.",
    "category": "morning_routine",
    "audio": ""
  },
  {
    "id": 5,
    "german": "Ich habe heute Morgen Haferbrei gegessen.",
    "english": "I had oatmeal for breakfast this morning.",
    "category": "morning_routine",
    "audio": ""
  },
  {
    "id": 6,
    "german": "Ich bin heute total müde.",
    "english": "I'm totally tired today.",
    "category": "morning_routine",
    "audio": ""
  },
  {
    "id": 7,
    "german": "Der Wecker hat mich um sechs geweckt.",
    "english": "The alarm woke me up at six.",
    "category": "morning_routine",
    "audio": ""
  },
  {
    "id": 8,
    "german": "Ich habe heute Nacht schlecht geschlafen.",
    "english": "I slept badly last night.",
    "category": "morning_routine",
    "audio": ""
  },
  {
    "id": 9,
    "german": "Ich muss mich beeilen",
    "english": " sonst komme ich zu spät.",
    "category": "I need to hurry or I'll be late.",
    "audio": "morning_routine"
  },
  {
    "id": 10,
    "german": "Heute fühle ich mich ausgeruht und bereit für den Tag.",
    "english": "Today I feel rested and ready for the day.",
    "category": "morning_routine",
    "audio": ""
  },
  {
    "id": 11,
    "german": "Ich bin gerade auf Jobsuche.",
    "english": "I'm currently looking for a job.",
    "category": "job_search",
    "audio": ""
  },
  {
    "id": 12,
    "german": "Ich habe heute eine Bewerbung abgeschickt.",
    "english": "I sent out an application today.",
    "category": "job_search",
    "audio": ""
  },
  {
    "id": 13,
    "german": "Ich warte noch auf eine Antwort von der Firma.",
    "english": "I'm still waiting for a response from the company.",
    "category": "job_search",
    "audio": ""
  },
  {
    "id": 14,
    "german": "Das Vorstellungsgespräch war gestern.",
    "english": "The job interview was yesterday.",
    "category": "job_search",
    "audio": ""
  },
  {
    "id": 15,
    "german": "Ich hoffe",
    "english": " dass ich bald eine Stelle finde.",
    "category": "I hope I find a position soon.",
    "audio": "job_search"
  },
  {
    "id": 16,
    "german": "Die Jobsuche ist manchmal wirklich frustrierend.",
    "english": "Job searching is really frustrating sometimes.",
    "category": "job_search",
    "audio": ""
  },
  {
    "id": 17,
    "german": "Ich habe meinen Lebenslauf aktualisiert.",
    "english": "I updated my resume.",
    "category": "job_search",
    "audio": ""
  },
  {
    "id": 18,
    "german": "Ich bewerbe mich auf eine Stelle als Softwareentwickler.",
    "english": "I'm applying for a position as a software developer.",
    "category": "job_search",
    "audio": ""
  },
  {
    "id": 19,
    "german": "Die Stelle klingt wirklich interessant.",
    "english": "The position sounds really interesting.",
    "category": "job_search",
    "audio": ""
  },
  {
    "id": 20,
    "german": "Ich bin zuversichtlich",
    "english": " dass ich bald etwas finden werde.",
    "category": "I'm confident that I'll find something soon.",
    "audio": "job_search"
  },
  {
    "id": 21,
    "german": "Können Sie das bitte wiederholen?",
    "english": "Could you please repeat that?",
    "category": "german_class",
    "audio": ""
  },
  {
    "id": 22,
    "german": "Ich habe das nicht ganz verstanden.",
    "english": "I didn't quite understand that.",
    "category": "german_class",
    "audio": ""
  },
  {
    "id": 23,
    "german": "Wie sagt man das auf Deutsch?",
    "english": "How do you say that in German?",
    "category": "german_class",
    "audio": ""
  },
  {
    "id": 24,
    "german": "Was bedeutet dieses Wort?",
    "english": "What does this word mean?",
    "category": "german_class",
    "audio": ""
  },
  {
    "id": 25,
    "german": "Können Sie das bitte langsamer sagen?",
    "english": "Could you please say that more slowly?",
    "category": "german_class",
    "audio": ""
  },
  {
    "id": 26,
    "german": "Ich lerne Deutsch seit ein paar Monaten.",
    "english": "I've been learning German for a few months.",
    "category": "german_class",
    "audio": ""
  },
  {
    "id": 27,
    "german": "Ich mache noch viele Fehler",
    "english": " aber ich versuche mein Bestes.",
    "category": "I still make many mistakes",
    "audio": " but I try my best."
  },
  {
    "id": 28,
    "german": "Darf ich eine Frage stellen?",
    "english": "May I ask a question?",
    "category": "german_class",
    "audio": ""
  },
  {
    "id": 29,
    "german": "Ich verstehe den Unterschied nicht.",
    "english": "I don't understand the difference.",
    "category": "german_class",
    "audio": ""
  },
  {
    "id": 30,
    "german": "Können Sie das bitte an die Tafel schreiben?",
    "english": "Could you please write that on the board?",
    "category": "german_class",
    "audio": ""
  },
  {
    "id": 31,
    "german": "Ich gehe heute Nachmittag ins Sprachcafé.",
    "english": "I'm going to the language café this afternoon.",
    "category": "hirschsprach_cafe",
    "audio": ""
  },
  {
    "id": 32,
    "german": "Es macht mir Spaß",
    "english": " mit Muttersprachlern zu reden.",
    "category": "I enjoy talking with native speakers.",
    "audio": "hirschsprach_cafe"
  },
  {
    "id": 33,
    "german": "Manchmal fällt es mir schwer",
    "english": " dem schnellen Gespräch zu folgen.",
    "category": "I sometimes find it hard to follow fast conversation.",
    "audio": "hirschsprach_cafe"
  },
  {
    "id": 34,
    "german": "Ich habe heute jemanden Interessantes kennengelernt.",
    "english": "I met someone interesting today.",
    "category": "hirschsprach_cafe",
    "audio": ""
  },
  {
    "id": 35,
    "german": "Was denkst du darüber?",
    "english": "What do you think about that?",
    "category": "hirschsprach_cafe",
    "audio": ""
  },
  {
    "id": 36,
    "german": "Ich bin anderer Meinung.",
    "english": "I have a different opinion.",
    "category": "hirschsprach_cafe",
    "audio": ""
  },
  {
    "id": 37,
    "german": "Das stimmt",
    "english": " aber ich denke auch",
    "category": " dass...",
    "audio": "That's true"
  },
  {
    "id": 38,
    "german": "Könntest du mir helfen",
    "english": " das auf Deutsch zu sagen?",
    "category": "Could you help me say this in German?",
    "audio": "hirschsprach_cafe"
  },
  {
    "id": 39,
    "german": "Ich bestelle immer einen Kaffee",
    "english": " wenn ich im Café bin.",
    "category": "I always order a coffee when I'm at the café.",
    "audio": "hirschsprach_cafe"
  },
  {
    "id": 40,
    "german": "Das heutige Gespräch war sehr hilfreich für mich.",
    "english": "Today's conversation was very helpful for me.",
    "category": "hirschsprach_cafe",
    "audio": ""
  },
  {
    "id": 41,
    "german": "Ich sehe ein Bild an der Wand.",
    "english": "I see a picture on the wall.",
    "category": "describe_surroundings",
    "audio": ""
  },
  {
    "id": 42,
    "german": "Das Wetter ist heute wunderschön.",
    "english": "The weather is beautiful today.",
    "category": "describe_surroundings",
    "audio": ""
  },
  {
    "id": 43,
    "german": "Es ist heute sehr kalt draußen.",
    "english": "It's very cold outside today.",
    "category": "describe_surroundings",
    "audio": ""
  },
  {
    "id": 44,
    "german": "Ich sitze am Fenster und schaue auf die Straße.",
    "english": "I'm sitting by the window and looking at the street.",
    "category": "describe_surroundings",
    "audio": ""
  },
  {
    "id": 45,
    "german": "Da drüben steht ein großes rotes Gebäude.",
    "english": "Over there stands a large red building.",
    "category": "describe_surroundings",
    "audio": ""
  },
  {
    "id": 46,
    "german": "Es regnet gerade in Strömen.",
    "english": "It's raining heavily right now.",
    "category": "describe_surroundings",
    "audio": ""
  },
  {
    "id": 47,
    "german": "Die Stadt sieht heute Morgen sehr ruhig aus.",
    "english": "The city looks very quiet this morning.",
    "category": "describe_surroundings",
    "audio": ""
  },
  {
    "id": 48,
    "german": "Ich höre die Vögel draußen singen.",
    "english": "I can hear the birds singing outside.",
    "category": "describe_surroundings",
    "audio": ""
  },
  {
    "id": 49,
    "german": "Der Tisch in der Mitte des Raumes ist aus Holz.",
    "english": "The table in the middle of the room is made of wood.",
    "category": "describe_surroundings",
    "audio": ""
  },
  {
    "id": 50,
    "german": "Es riecht nach frischem Kaffee.",
    "english": "It smells like fresh coffee.",
    "category": "describe_surroundings",
    "audio": ""
  },
  {
    "id": 51,
    "german": "Ich denke",
    "english": " das ist eine gute Idee.",
    "category": "I think that's a good idea.",
    "audio": "inner_thoughts"
  },
  {
    "id": 52,
    "german": "Ich bin mir nicht sicher",
    "english": " ob das richtig ist.",
    "category": "I'm not sure if that's right.",
    "audio": "inner_thoughts"
  },
  {
    "id": 53,
    "german": "Ich möchte mehr Zeit für mich selbst haben.",
    "english": "I want to have more time for myself.",
    "category": "inner_thoughts",
    "audio": ""
  },
  {
    "id": 54,
    "german": "Ich frage mich",
    "english": " ob ich das schaffen kann.",
    "category": "I wonder if I can manage that.",
    "audio": "inner_thoughts"
  },
  {
    "id": 55,
    "german": "Ich bin wirklich stolz auf meinen Fortschritt.",
    "english": "I'm really proud of my progress.",
    "category": "inner_thoughts",
    "audio": ""
  },
  {
    "id": 56,
    "german": "Das macht mich ein bisschen nervös.",
    "english": "That makes me a little nervous.",
    "category": "inner_thoughts",
    "audio": ""
  },
  {
    "id": 57,
    "german": "Ich freue mich sehr auf das Wochenende.",
    "english": "I'm really looking forward to the weekend.",
    "category": "inner_thoughts",
    "audio": ""
  },
  {
    "id": 58,
    "german": "Ich muss darüber nachdenken.",
    "english": "I need to think about that.",
    "category": "inner_thoughts",
    "audio": ""
  },
  {
    "id": 59,
    "german": "Das ist genau das",
    "english": " was ich gesucht habe.",
    "category": "That's exactly what I was looking for.",
    "audio": "inner_thoughts"
  },
  {
    "id": 60,
    "german": "Ich fühle mich heute besonders motiviert.",
    "english": "I feel particularly motivated today.",
    "category": "inner_thoughts",
    "audio": ""
  },
  {
    "id": 61,
    "german": "Ich gehe heute zum Supermarkt einkaufen.",
    "english": "I'm going grocery shopping at the supermarket today.",
    "category": "daily_life",
    "audio": ""
  },
  {
    "id": 62,
    "german": "Die U-Bahn war heute wieder voll.",
    "english": "The subway was packed again today.",
    "category": "daily_life",
    "audio": ""
  },
  {
    "id": 63,
    "german": "Ich muss noch die Wäsche waschen.",
    "english": "I still need to do the laundry.",
    "category": "daily_life",
    "audio": ""
  },
  {
    "id": 64,
    "german": "Können Sie mir sagen",
    "english": " wo die nächste Apotheke ist?",
    "category": "Could you tell me where the nearest pharmacy is?",
    "audio": "daily_life"
  },
  {
    "id": 65,
    "german": "Ich koche heute Abend selbst.",
    "english": "I'm cooking dinner myself tonight.",
    "category": "daily_life",
    "audio": ""
  },
  {
    "id": 66,
    "german": "Ich habe das Ticket online gekauft.",
    "english": "I bought the ticket online.",
    "category": "daily_life",
    "audio": ""
  },
  {
    "id": 67,
    "german": "Der Bus hat heute Verspätung.",
    "english": "The bus is running late today.",
    "category": "daily_life",
    "audio": ""
  },
  {
    "id": 68,
    "german": "Ich zahle lieber mit Karte.",
    "english": "I prefer to pay by card.",
    "category": "daily_life",
    "audio": ""
  },
  {
    "id": 69,
    "german": "Ich habe mein Handy zu Hause vergessen.",
    "english": "I left my phone at home.",
    "category": "daily_life",
    "audio": ""
  },
  {
    "id": 70,
    "german": "Ich brauche dringend neue Schuhe.",
    "english": "I urgently need new shoes.",
    "category": "daily_life",
    "audio": ""
  }
];
