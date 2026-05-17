const PHRASES = [
  {
    "id": 1,
    "german": "Ich bin heute Morgen um sieben Uhr aufgestanden.",
    "english": "I woke up at seven this morning.",
    "category": "morning_routine",
    "audio": "audio/001_ich_bin_heute_morgen_um_sieben_uhr_aufge.mp3"
  },
  {
    "id": 2,
    "german": "Ich muss noch schnell duschen.",
    "english": "I still need to shower quickly.",
    "category": "morning_routine",
    "audio": "audio/002_ich_muss_noch_schnell_duschen.mp3"
  },
  {
    "id": 3,
    "german": "Was soll ich heute anziehen?",
    "english": "What should I wear today?",
    "category": "morning_routine",
    "audio": "audio/003_was_soll_ich_heute_anziehen.mp3"
  },
  {
    "id": 4,
    "german": "Ich mache mir einen Kaffee.",
    "english": "I'm making myself a coffee.",
    "category": "morning_routine",
    "audio": "audio/004_ich_mache_mir_einen_kaffee.mp3"
  },
  {
    "id": 5,
    "german": "Ich habe heute Morgen Haferbrei gegessen.",
    "english": "I had oatmeal for breakfast this morning.",
    "category": "morning_routine",
    "audio": "audio/005_ich_habe_heute_morgen_haferbrei_gegessen.mp3"
  },
  {
    "id": 6,
    "german": "Ich bin heute total müde.",
    "english": "I'm totally tired today.",
    "category": "morning_routine",
    "audio": "audio/006_ich_bin_heute_total_muede.mp3"
  },
  {
    "id": 7,
    "german": "Der Wecker hat mich um sechs geweckt.",
    "english": "The alarm woke me up at six.",
    "category": "morning_routine",
    "audio": "audio/007_der_wecker_hat_mich_um_sechs_geweckt.mp3"
  },
  {
    "id": 8,
    "german": "Ich habe heute Nacht schlecht geschlafen.",
    "english": "I slept badly last night.",
    "category": "morning_routine",
    "audio": "audio/008_ich_habe_heute_nacht_schlecht_geschlafen.mp3"
  },
  {
    "id": 9,
    "german": "Ich muss mich beeilen sonst komme ich zu spät.",
    "english": "I need to hurry or I'll be late.",
    "category": "morning_routine",
    "audio": "audio/009_ich_muss_mich_beeilen_sonst_komme_ich_zu.mp3"
  },
  {
    "id": 10,
    "german": "Heute fühle ich mich ausgeruht und bereit für den Tag.",
    "english": "Today I feel rested and ready for the day.",
    "category": "morning_routine",
    "audio": "audio/010_heute_fuehle_ich_mich_ausgeruht_und_bereit.mp3"
  },
  {
    "id": 11,
    "german": "Ich bin gerade auf Jobsuche.",
    "english": "I'm currently looking for a job.",
    "category": "job_search",
    "audio": "audio/011_ich_bin_gerade_auf_jobsuche.mp3"
  },
  {
    "id": 12,
    "german": "Ich habe heute eine Bewerbung abgeschickt.",
    "english": "I sent out an application today.",
    "category": "job_search",
    "audio": "audio/012_ich_habe_heute_eine_bewerbung_abgeschickt.mp3"
  },
  {
    "id": 13,
    "german": "Ich warte noch auf eine Antwort von der Firma.",
    "english": "I'm still waiting for a response from the company.",
    "category": "job_search",
    "audio": "audio/013_ich_warte_noch_auf_eine_antwort_von_der_fi.mp3"
  },
  {
    "id": 14,
    "german": "Das Vorstellungsgespräch war gestern.",
    "english": "The job interview was yesterday.",
    "category": "job_search",
    "audio": "audio/014_das_vorstellungsgespraech_war_gestern.mp3"
  },
  {
    "id": 15,
    "german": "Ich hoffe dass ich bald eine Stelle finde.",
    "english": "I hope I find a position soon.",
    "category": "job_search",
    "audio": "audio/015_ich_hoffe_dass_ich_bald_eine_stelle_find.mp3"
  },
  {
    "id": 16,
    "german": "Die Jobsuche ist manchmal wirklich frustrierend.",
    "english": "Job searching is really frustrating sometimes.",
    "category": "job_search",
    "audio": "audio/016_die_jobsuche_ist_manchmal_wirklich_frustr.mp3"
  },
  {
    "id": 17,
    "german": "Ich habe meinen Lebenslauf aktualisiert.",
    "english": "I updated my resume.",
    "category": "job_search",
    "audio": "audio/017_ich_habe_meinen_lebenslauf_aktualisiert.mp3"
  },
  {
    "id": 18,
    "german": "Ich bewerbe mich auf eine Stelle als Softwareentwickler.",
    "english": "I'm applying for a position as a software developer.",
    "category": "job_search",
    "audio": "audio/018_ich_bewerbe_mich_auf_eine_stelle_als_softw.mp3"
  },
  {
    "id": 19,
    "german": "Die Stelle klingt wirklich interessant.",
    "english": "The position sounds really interesting.",
    "category": "job_search",
    "audio": "audio/019_die_stelle_klingt_wirklich_interessant.mp3"
  },
  {
    "id": 20,
    "german": "Ich bin zuversichtlich dass ich bald etwas finden werde.",
    "english": "I'm confident that I'll find something soon.",
    "category": "job_search",
    "audio": "audio/020_ich_bin_zuversichtlich_dass_ich_bald_etw.mp3"
  },
  {
    "id": 21,
    "german": "Können Sie das bitte wiederholen?",
    "english": "Could you please repeat that?",
    "category": "german_class",
    "audio": "audio/021_koennen_sie_das_bitte_wiederholen.mp3"
  },
  {
    "id": 22,
    "german": "Ich habe das nicht ganz verstanden.",
    "english": "I didn't quite understand that.",
    "category": "german_class",
    "audio": "audio/022_ich_habe_das_nicht_ganz_verstanden.mp3"
  },
  {
    "id": 23,
    "german": "Wie sagt man das auf Deutsch?",
    "english": "How do you say that in German?",
    "category": "german_class",
    "audio": "audio/023_wie_sagt_man_das_auf_deutsch.mp3"
  },
  {
    "id": 24,
    "german": "Was bedeutet dieses Wort?",
    "english": "What does this word mean?",
    "category": "german_class",
    "audio": "audio/024_was_bedeutet_dieses_wort.mp3"
  },
  {
    "id": 25,
    "german": "Können Sie das bitte langsamer sagen?",
    "english": "Could you please say that more slowly?",
    "category": "german_class",
    "audio": "audio/025_koennen_sie_das_bitte_langsamer_sagen.mp3"
  },
  {
    "id": 26,
    "german": "Ich lerne Deutsch seit ein paar Monaten.",
    "english": "I've been learning German for a few months.",
    "category": "german_class",
    "audio": "audio/026_ich_lerne_deutsch_seit_ein_paar_monaten.mp3"
  },
  {
    "id": 27,
    "german": "Ich mache noch viele Fehler aber ich versuche mein Bestes.",
    "english": "I still make many mistakes but I try my best.",
    "category": "german_class",
    "audio": "audio/027_ich_mache_noch_viele_fehler_aber_ich_ver.mp3"
  },
  {
    "id": 28,
    "german": "Darf ich eine Frage stellen?",
    "english": "May I ask a question?",
    "category": "german_class",
    "audio": "audio/028_darf_ich_eine_frage_stellen.mp3"
  },
  {
    "id": 29,
    "german": "Ich verstehe den Unterschied nicht.",
    "english": "I don't understand the difference.",
    "category": "german_class",
    "audio": "audio/029_ich_verstehe_den_unterschied_nicht.mp3"
  },
  {
    "id": 30,
    "german": "Können Sie das bitte an die Tafel schreiben?",
    "english": "Could you please write that on the board?",
    "category": "german_class",
    "audio": "audio/030_koennen_sie_das_bitte_an_die_tafel_schreib.mp3"
  },
  {
    "id": 31,
    "german": "Ich gehe heute Nachmittag ins Sprachcafé.",
    "english": "I'm going to the language café this afternoon.",
    "category": "hirschsprach_cafe",
    "audio": "audio/031_ich_gehe_heute_nachmittag_ins_sprachcafe.mp3"
  },
  {
    "id": 32,
    "german": "Es macht mir Spaß mit Muttersprachlern zu reden.",
    "english": "I enjoy talking with native speakers.",
    "category": "hirschsprach_cafe",
    "audio": "audio/032_es_macht_mir_spass_mit_muttersprachlern.mp3"
  },
  {
    "id": 33,
    "german": "Manchmal fällt es mir schwer dem schnellen Gespräch zu folgen.",
    "english": "I sometimes find it hard to follow fast conversation.",
    "category": "hirschsprach_cafe",
    "audio": "audio/033_manchmal_faellt_es_mir_schwer_dem_schnel.mp3"
  },
  {
    "id": 34,
    "german": "Ich habe heute jemanden Interessantes kennengelernt.",
    "english": "I met someone interesting today.",
    "category": "hirschsprach_cafe",
    "audio": "audio/034_ich_habe_heute_jemanden_interessantes_kenne.mp3"
  },
  {
    "id": 35,
    "german": "Was denkst du darüber?",
    "english": "What do you think about that?",
    "category": "hirschsprach_cafe",
    "audio": "audio/035_was_denkst_du_darueber.mp3"
  },
  {
    "id": 36,
    "german": "Ich bin anderer Meinung.",
    "english": "I have a different opinion.",
    "category": "hirschsprach_cafe",
    "audio": "audio/036_ich_bin_anderer_meinung.mp3"
  },
  {
    "id": 37,
    "german": "Das stimmt aber ich denke auch dass...",
    "english": "That's true but I also think that...",
    "category": "hirschsprach_cafe",
    "audio": "audio/037_das_stimmt_aber_ich_denke_auch_dass.mp3"
  },
  {
    "id": 38,
    "german": "Könntest du mir helfen das auf Deutsch zu sagen?",
    "english": "Could you help me say this in German?",
    "category": "hirschsprach_cafe",
    "audio": "audio/038_koenntest_du_mir_helfen_das_auf_deutsch.mp3"
  },
  {
    "id": 39,
    "german": "Ich bestelle immer einen Kaffee wenn ich im Café bin.",
    "english": "I always order a coffee when I'm at the café.",
    "category": "hirschsprach_cafe",
    "audio": "audio/039_ich_bestelle_immer_einen_kaffee_wenn_ich.mp3"
  },
  {
    "id": 40,
    "german": "Das heutige Gespräch war sehr hilfreich für mich.",
    "english": "Today's conversation was very helpful for me.",
    "category": "hirschsprach_cafe",
    "audio": "audio/040_das_heutige_gespraech_war_sehr_hilfreich_f.mp3"
  },
  {
    "id": 41,
    "german": "Ich sehe ein Bild an der Wand.",
    "english": "I see a picture on the wall.",
    "category": "describe_surroundings",
    "audio": "audio/041_ich_sehe_ein_bild_an_der_wand.mp3"
  },
  {
    "id": 42,
    "german": "Das Wetter ist heute wunderschön.",
    "english": "The weather is beautiful today.",
    "category": "describe_surroundings",
    "audio": "audio/042_das_wetter_ist_heute_wunderschoen.mp3"
  },
  {
    "id": 43,
    "german": "Es ist heute sehr kalt draußen.",
    "english": "It's very cold outside today.",
    "category": "describe_surroundings",
    "audio": "audio/043_es_ist_heute_sehr_kalt_draussen.mp3"
  },
  {
    "id": 44,
    "german": "Ich sitze am Fenster und schaue auf die Straße.",
    "english": "I'm sitting by the window and looking at the street.",
    "category": "describe_surroundings",
    "audio": "audio/044_ich_sitze_am_fenster_und_schaue_auf_die_str.mp3"
  },
  {
    "id": 45,
    "german": "Da drüben steht ein großes rotes Gebäude.",
    "english": "Over there stands a large red building.",
    "category": "describe_surroundings",
    "audio": "audio/045_da_drueben_steht_ein_grosses_rotes_gebaeude.mp3"
  },
  {
    "id": 46,
    "german": "Es regnet gerade in Strömen.",
    "english": "It's raining heavily right now.",
    "category": "describe_surroundings",
    "audio": "audio/046_es_regnet_gerade_in_stroemen.mp3"
  },
  {
    "id": 47,
    "german": "Die Stadt sieht heute Morgen sehr ruhig aus.",
    "english": "The city looks very quiet this morning.",
    "category": "describe_surroundings",
    "audio": "audio/047_die_stadt_sieht_heute_morgen_sehr_ruhig_aus.mp3"
  },
  {
    "id": 48,
    "german": "Ich höre die Vögel draußen singen.",
    "english": "I can hear the birds singing outside.",
    "category": "describe_surroundings",
    "audio": "audio/048_ich_hoere_die_voegel_draussen_singen.mp3"
  },
  {
    "id": 49,
    "german": "Der Tisch in der Mitte des Raumes ist aus Holz.",
    "english": "The table in the middle of the room is made of wood.",
    "category": "describe_surroundings",
    "audio": "audio/049_der_tisch_in_der_mitte_des_raumes_ist_aus_h.mp3"
  },
  {
    "id": 50,
    "german": "Es riecht nach frischem Kaffee.",
    "english": "It smells like fresh coffee.",
    "category": "describe_surroundings",
    "audio": "audio/050_es_riecht_nach_frischem_kaffee.mp3"
  },
  {
    "id": 51,
    "german": "Ich denke das ist eine gute Idee.",
    "english": "I think that's a good idea.",
    "category": "inner_thoughts",
    "audio": "audio/051_ich_denke_das_ist_eine_gute_idee.mp3"
  },
  {
    "id": 52,
    "german": "Ich bin mir nicht sicher ob das richtig ist.",
    "english": "I'm not sure if that's right.",
    "category": "inner_thoughts",
    "audio": "audio/052_ich_bin_mir_nicht_sicher_ob_das_richtig.mp3"
  },
  {
    "id": 53,
    "german": "Ich möchte mehr Zeit für mich selbst haben.",
    "english": "I want to have more time for myself.",
    "category": "inner_thoughts",
    "audio": "audio/053_ich_moechte_mehr_zeit_fuer_mich_selbst_habe.mp3"
  },
  {
    "id": 54,
    "german": "Ich frage mich ob ich das schaffen kann.",
    "english": "I wonder if I can manage that.",
    "category": "inner_thoughts",
    "audio": "audio/054_ich_frage_mich_ob_ich_das_schaffen_kann.mp3"
  },
  {
    "id": 55,
    "german": "Ich bin wirklich stolz auf meinen Fortschritt.",
    "english": "I'm really proud of my progress.",
    "category": "inner_thoughts",
    "audio": "audio/055_ich_bin_wirklich_stolz_auf_meinen_fortschri.mp3"
  },
  {
    "id": 56,
    "german": "Das macht mich ein bisschen nervös.",
    "english": "That makes me a little nervous.",
    "category": "inner_thoughts",
    "audio": "audio/056_das_macht_mich_ein_bisschen_nervoes.mp3"
  },
  {
    "id": 57,
    "german": "Ich freue mich sehr auf das Wochenende.",
    "english": "I'm really looking forward to the weekend.",
    "category": "inner_thoughts",
    "audio": "audio/057_ich_freue_mich_sehr_auf_das_wochenende.mp3"
  },
  {
    "id": 58,
    "german": "Ich muss darüber nachdenken.",
    "english": "I need to think about that.",
    "category": "inner_thoughts",
    "audio": "audio/058_ich_muss_darueber_nachdenken.mp3"
  },
  {
    "id": 59,
    "german": "Das ist genau das was ich gesucht habe.",
    "english": "That's exactly what I was looking for.",
    "category": "inner_thoughts",
    "audio": "audio/059_das_ist_genau_das_was_ich_gesucht_habe.mp3"
  },
  {
    "id": 60,
    "german": "Ich fühle mich heute besonders motiviert.",
    "english": "I feel particularly motivated today.",
    "category": "inner_thoughts",
    "audio": "audio/060_ich_fuehle_mich_heute_besonders_motiviert.mp3"
  },
  {
    "id": 61,
    "german": "Ich gehe heute zum Supermarkt einkaufen.",
    "english": "I'm going grocery shopping at the supermarket today.",
    "category": "daily_life",
    "audio": "audio/061_ich_gehe_heute_zum_supermarkt_einkaufen.mp3"
  },
  {
    "id": 62,
    "german": "Die U-Bahn war heute wieder voll.",
    "english": "The subway was packed again today.",
    "category": "daily_life",
    "audio": "audio/062_die_u_bahn_war_heute_wieder_voll.mp3"
  },
  {
    "id": 63,
    "german": "Ich muss noch die Wäsche waschen.",
    "english": "I still need to do the laundry.",
    "category": "daily_life",
    "audio": "audio/063_ich_muss_noch_die_waesche_waschen.mp3"
  },
  {
    "id": 64,
    "german": "Können Sie mir sagen wo die nächste Apotheke ist?",
    "english": "Could you tell me where the nearest pharmacy is?",
    "category": "daily_life",
    "audio": "audio/064_koennen_sie_mir_sagen_wo_die_naechste_ap.mp3"
  },
  {
    "id": 65,
    "german": "Ich koche heute Abend selbst.",
    "english": "I'm cooking dinner myself tonight.",
    "category": "daily_life",
    "audio": "audio/065_ich_koche_heute_abend_selbst.mp3"
  },
  {
    "id": 66,
    "german": "Ich habe das Ticket online gekauft.",
    "english": "I bought the ticket online.",
    "category": "daily_life",
    "audio": "audio/066_ich_habe_das_ticket_online_gekauft.mp3"
  },
  {
    "id": 67,
    "german": "Der Bus hat heute Verspätung.",
    "english": "The bus is running late today.",
    "category": "daily_life",
    "audio": "audio/067_der_bus_hat_heute_verspaetung.mp3"
  },
  {
    "id": 68,
    "german": "Ich zahle lieber mit Karte.",
    "english": "I prefer to pay by card.",
    "category": "daily_life",
    "audio": "audio/068_ich_zahle_lieber_mit_karte.mp3"
  },
  {
    "id": 69,
    "german": "Ich habe mein Handy zu Hause vergessen.",
    "english": "I left my phone at home.",
    "category": "daily_life",
    "audio": "audio/069_ich_habe_mein_handy_zu_hause_vergessen.mp3"
  },
  {
    "id": 70,
    "german": "Ich brauche dringend neue Schuhe.",
    "english": "I urgently need new shoes.",
    "category": "daily_life",
    "audio": "audio/070_ich_brauche_dringend_neue_schuhe.mp3"
  }
];
