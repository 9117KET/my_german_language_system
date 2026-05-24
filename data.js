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
    "audio": "audio/010_heute_fuehle_ich_mich_ausgeruht_und_bere.mp3"
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
    "audio": "audio/012_ich_habe_heute_eine_bewerbung_abgeschick.mp3"
  },
  {
    "id": 13,
    "german": "Ich warte noch auf eine Antwort von der Firma.",
    "english": "I'm still waiting for a response from the company.",
    "category": "job_search",
    "audio": "audio/013_ich_warte_noch_auf_eine_antwort_von_der.mp3"
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
    "audio": "audio/016_die_jobsuche_ist_manchmal_wirklich_frust.mp3"
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
    "audio": "audio/018_ich_bewerbe_mich_auf_eine_stelle_als_sof.mp3"
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
    "audio": "audio/030_koennen_sie_das_bitte_an_die_tafel_schre.mp3"
  },
  {
    "id": 31,
    "german": "Ich gehe heute Nachmittag ins Sprachcafé.",
    "english": "I'm going to the language café this afternoon.",
    "category": "hirschsprach_cafe",
    "audio": "audio/031_ich_gehe_heute_nachmittag_ins_sprachcaf.mp3"
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
    "audio": "audio/034_ich_habe_heute_jemanden_interessantes_ke.mp3"
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
    "audio": "audio/040_das_heutige_gespraech_war_sehr_hilfreich.mp3"
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
    "audio": "audio/044_ich_sitze_am_fenster_und_schaue_auf_die.mp3"
  },
  {
    "id": 45,
    "german": "Da drüben steht ein großes rotes Gebäude.",
    "english": "Over there stands a large red building.",
    "category": "describe_surroundings",
    "audio": "audio/045_da_drueben_steht_ein_grosses_rotes_gebae.mp3"
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
    "audio": "audio/047_die_stadt_sieht_heute_morgen_sehr_ruhig.mp3"
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
    "audio": "audio/049_der_tisch_in_der_mitte_des_raumes_ist_au.mp3"
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
    "audio": "audio/053_ich_moechte_mehr_zeit_fuer_mich_selbst_h.mp3"
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
    "audio": "audio/055_ich_bin_wirklich_stolz_auf_meinen_fortsc.mp3"
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
    "audio": "audio/060_ich_fuehle_mich_heute_besonders_motivier.mp3"
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
  },
  {
    "id": 71,
    "german": "Hallo wie geht es Ihnen?",
    "english": "Hello how are you?",
    "category": "greetings",
    "audio": "audio/071_hallo_wie_geht_es_ihnen.mp3"
  },
  {
    "id": 72,
    "german": "Mir geht es gut danke. Und Ihnen?",
    "english": "I'm doing well thank you. And you?",
    "category": "greetings",
    "audio": "audio/072_mir_geht_es_gut_danke_und_ihnen.mp3"
  },
  {
    "id": 73,
    "german": "Schön Sie kennenzulernen.",
    "english": "Nice to meet you.",
    "category": "greetings",
    "audio": "audio/073_schoen_sie_kennenzulernen.mp3"
  },
  {
    "id": 74,
    "german": "Woher kommen Sie ursprünglich?",
    "english": "Where are you originally from?",
    "category": "greetings",
    "audio": "audio/074_woher_kommen_sie_urspruenglich.mp3"
  },
  {
    "id": 75,
    "german": "Ich komme aus Kamerun.",
    "english": "I'm from Cameroon.",
    "category": "greetings",
    "audio": "audio/075_ich_komme_aus_kamerun.mp3"
  },
  {
    "id": 76,
    "german": "Seit wann wohnen Sie schon hier?",
    "english": "How long have you been living here?",
    "category": "greetings",
    "audio": "audio/076_seit_wann_wohnen_sie_schon_hier.mp3"
  },
  {
    "id": 77,
    "german": "Ich wohne seit ungefähr einem Jahr hier.",
    "english": "I've been living here for about a year.",
    "category": "greetings",
    "audio": "audio/077_ich_wohne_seit_ungefaehr_einem_jahr_hier.mp3"
  },
  {
    "id": 78,
    "german": "Was machen Sie beruflich?",
    "english": "What do you do for work?",
    "category": "greetings",
    "audio": "audio/078_was_machen_sie_beruflich.mp3"
  },
  {
    "id": 79,
    "german": "Wie war Ihr Wochenende?",
    "english": "How was your weekend?",
    "category": "greetings",
    "audio": "audio/079_wie_war_ihr_wochenende.mp3"
  },
  {
    "id": 80,
    "german": "Tschüss bis zum nächsten Mal!",
    "english": "Bye until next time!",
    "category": "greetings",
    "audio": "audio/080_tschuess_bis_zum_naechsten_mal.mp3"
  },
  {
    "id": 81,
    "german": "Haben Sie einen Tisch für zwei Personen frei?",
    "english": "Do you have a free table for two?",
    "category": "food_drink",
    "audio": "audio/081_haben_sie_einen_tisch_fuer_zwei_personen.mp3"
  },
  {
    "id": 82,
    "german": "Was würden Sie empfehlen?",
    "english": "What would you recommend?",
    "category": "food_drink",
    "audio": "audio/082_was_wuerden_sie_empfehlen.mp3"
  },
  {
    "id": 83,
    "german": "Ich bin Vegetarier gibt es etwas ohne Fleisch?",
    "english": "I'm vegetarian is there something without meat?",
    "category": "food_drink",
    "audio": "audio/083_ich_bin_vegetarier_gibt_es_etwas_ohne_fl.mp3"
  },
  {
    "id": 84,
    "german": "Die Rechnung bitte.",
    "english": "The bill please.",
    "category": "food_drink",
    "audio": "audio/084_die_rechnung_bitte.mp3"
  },
  {
    "id": 85,
    "german": "Das war wirklich lecker danke.",
    "english": "That was really delicious thank you.",
    "category": "food_drink",
    "audio": "audio/085_das_war_wirklich_lecker_danke.mp3"
  },
  {
    "id": 86,
    "german": "Ich hätte gerne ein Glas Leitungswasser bitte.",
    "english": "I'd like a glass of tap water please.",
    "category": "food_drink",
    "audio": "audio/086_ich_haette_gerne_ein_glas_leitungswasser.mp3"
  },
  {
    "id": 87,
    "german": "Was ist das Tagesgericht heute?",
    "english": "What is today's special?",
    "category": "food_drink",
    "audio": "audio/087_was_ist_das_tagesgericht_heute.mp3"
  },
  {
    "id": 88,
    "german": "Kann ich bitte die Speisekarte haben?",
    "english": "Can I have the menu please?",
    "category": "food_drink",
    "audio": "audio/088_kann_ich_bitte_die_speisekarte_haben.mp3"
  },
  {
    "id": 89,
    "german": "Ich esse kein Schweinefleisch.",
    "english": "I don't eat pork.",
    "category": "food_drink",
    "audio": "audio/089_ich_esse_kein_schweinefleisch.mp3"
  },
  {
    "id": 90,
    "german": "Entschuldigung ich habe das falsche Gericht bekommen.",
    "english": "Excuse me I received the wrong dish.",
    "category": "food_drink",
    "audio": "audio/090_entschuldigung_ich_habe_das_falsche_geri.mp3"
  },
  {
    "id": 91,
    "german": "Ich suche eine warme Winterjacke.",
    "english": "I'm looking for a warm winter jacket.",
    "category": "shopping",
    "audio": "audio/091_ich_suche_eine_warme_winterjacke.mp3"
  },
  {
    "id": 92,
    "german": "Haben Sie das in Größe M?",
    "english": "Do you have that in size M?",
    "category": "shopping",
    "audio": "audio/092_haben_sie_das_in_groesse_m.mp3"
  },
  {
    "id": 93,
    "german": "Wo sind die Umkleidekabinen?",
    "english": "Where are the fitting rooms?",
    "category": "shopping",
    "audio": "audio/093_wo_sind_die_umkleidekabinen.mp3"
  },
  {
    "id": 94,
    "german": "Wie viel kostet das insgesamt?",
    "english": "How much does that cost in total?",
    "category": "shopping",
    "audio": "audio/094_wie_viel_kostet_das_insgesamt.mp3"
  },
  {
    "id": 95,
    "german": "Haben Sie etwas Günstigeres?",
    "english": "Do you have something cheaper?",
    "category": "shopping",
    "audio": "audio/095_haben_sie_etwas_guenstigeres.mp3"
  },
  {
    "id": 96,
    "german": "Das gefällt mir ich nehme es.",
    "english": "I like it I'll take it.",
    "category": "shopping",
    "audio": "audio/096_das_gefaellt_mir_ich_nehme_es.mp3"
  },
  {
    "id": 97,
    "german": "Kann ich das umtauschen wenn es nicht passt?",
    "english": "Can I exchange this if it doesn't fit?",
    "category": "shopping",
    "audio": "audio/097_kann_ich_das_umtauschen_wenn_es_nicht_pa.mp3"
  },
  {
    "id": 98,
    "german": "Haben Sie das auch in einer anderen Farbe?",
    "english": "Do you have that in another color too?",
    "category": "shopping",
    "audio": "audio/098_haben_sie_das_auch_in_einer_anderen_farb.mp3"
  },
  {
    "id": 99,
    "german": "Wo finde ich die Sportabteilung?",
    "english": "Where do I find the sports department?",
    "category": "shopping",
    "audio": "audio/099_wo_finde_ich_die_sportabteilung.mp3"
  },
  {
    "id": 100,
    "german": "Ich brauche eine Tüte bitte.",
    "english": "I need a bag please.",
    "category": "shopping",
    "audio": "audio/100_ich_brauche_eine_tuete_bitte.mp3"
  },
  {
    "id": 101,
    "german": "Ich fühle mich heute gar nicht wohl.",
    "english": "I don't feel well at all today.",
    "category": "health",
    "audio": "audio/101_ich_fuehle_mich_heute_gar_nicht_wohl.mp3"
  },
  {
    "id": 102,
    "german": "Ich habe seit zwei Tagen starke Kopfschmerzen.",
    "english": "I've had a bad headache for two days.",
    "category": "health",
    "audio": "audio/102_ich_habe_seit_zwei_tagen_starke_kopfschm.mp3"
  },
  {
    "id": 103,
    "german": "Ich glaube ich habe eine Erkältung.",
    "english": "I think I have a cold.",
    "category": "health",
    "audio": "audio/103_ich_glaube_ich_habe_eine_erkaeltung.mp3"
  },
  {
    "id": 104,
    "german": "Haben Sie etwas gegen Halsschmerzen?",
    "english": "Do you have something for a sore throat?",
    "category": "health",
    "audio": "audio/104_haben_sie_etwas_gegen_halsschmerzen.mp3"
  },
  {
    "id": 105,
    "german": "Wann hat der Arzt den nächsten freien Termin?",
    "english": "When does the doctor have the next free appointment?",
    "category": "health",
    "audio": "audio/105_wann_hat_der_arzt_den_naechsten_freien_t.mp3"
  },
  {
    "id": 106,
    "german": "Ich habe um zehn Uhr einen Termin.",
    "english": "I have an appointment at ten o'clock.",
    "category": "health",
    "audio": "audio/106_ich_habe_um_zehn_uhr_einen_termin.mp3"
  },
  {
    "id": 107,
    "german": "Mir tut der Magen weh.",
    "english": "My stomach hurts.",
    "category": "health",
    "audio": "audio/107_mir_tut_der_magen_weh.mp3"
  },
  {
    "id": 108,
    "german": "Ich bin gegen Penicillin allergisch.",
    "english": "I'm allergic to penicillin.",
    "category": "health",
    "audio": "audio/108_ich_bin_gegen_penicillin_allergisch.mp3"
  },
  {
    "id": 109,
    "german": "Ich brauche eine Krankmeldung für die Arbeit.",
    "english": "I need a sick note for work.",
    "category": "health",
    "audio": "audio/109_ich_brauche_eine_krankmeldung_fuer_die_a.mp3"
  },
  {
    "id": 110,
    "german": "Wie oft soll ich die Tabletten nehmen?",
    "english": "How often should I take the tablets?",
    "category": "health",
    "audio": "audio/110_wie_oft_soll_ich_die_tabletten_nehmen.mp3"
  },
  {
    "id": 111,
    "german": "Wie komme ich am besten zum Hauptbahnhof?",
    "english": "What's the best way to get to the main station?",
    "category": "travel",
    "audio": "audio/111_wie_komme_ich_am_besten_zum_hauptbahnhof.mp3"
  },
  {
    "id": 112,
    "german": "Wie weit ist es noch von hier?",
    "english": "How far is it from here?",
    "category": "travel",
    "audio": "audio/112_wie_weit_ist_es_noch_von_hier.mp3"
  },
  {
    "id": 113,
    "german": "Eine Fahrkarte nach Hamburg einfach bitte.",
    "english": "A one-way ticket to Hamburg please.",
    "category": "travel",
    "audio": "audio/113_eine_fahrkarte_nach_hamburg_einfach_bitt.mp3"
  },
  {
    "id": 114,
    "german": "Auf welchem Gleis fährt der Zug ab?",
    "english": "Which platform does the train depart from?",
    "category": "travel",
    "audio": "audio/114_auf_welchem_gleis_faehrt_der_zug_ab.mp3"
  },
  {
    "id": 115,
    "german": "Ist dieser Platz noch frei?",
    "english": "Is this seat still free?",
    "category": "travel",
    "audio": "audio/115_ist_dieser_platz_noch_frei.mp3"
  },
  {
    "id": 116,
    "german": "Ich habe mich verlaufen können Sie mir helfen?",
    "english": "I got lost can you help me?",
    "category": "travel",
    "audio": "audio/116_ich_habe_mich_verlaufen_koennen_sie_mir.mp3"
  },
  {
    "id": 117,
    "german": "Biegen Sie an der Ampel rechts ab.",
    "english": "Turn right at the traffic lights.",
    "category": "travel",
    "audio": "audio/117_biegen_sie_an_der_ampel_rechts_ab.mp3"
  },
  {
    "id": 118,
    "german": "Wie lange fährt man bis zur Innenstadt?",
    "english": "How long does it take to get to the city center?",
    "category": "travel",
    "audio": "audio/118_wie_lange_faehrt_man_bis_zur_innenstadt.mp3"
  },
  {
    "id": 119,
    "german": "Wo ist der nächste Geldautomat?",
    "english": "Where is the nearest ATM?",
    "category": "travel",
    "audio": "audio/119_wo_ist_der_naechste_geldautomat.mp3"
  },
  {
    "id": 120,
    "german": "Wo kann ich hier ein Fahrrad mieten?",
    "english": "Where can I rent a bicycle here?",
    "category": "travel",
    "audio": "audio/120_wo_kann_ich_hier_ein_fahrrad_mieten.mp3"
  },
  {
    "id": 121,
    "german": "Hast du am Wochenende schon etwas vor?",
    "english": "Do you already have plans for the weekend?",
    "category": "social",
    "audio": "audio/121_hast_du_am_wochenende_schon_etwas_vor.mp3"
  },
  {
    "id": 122,
    "german": "Wollen wir zusammen etwas unternehmen?",
    "english": "Shall we do something together?",
    "category": "social",
    "audio": "audio/122_wollen_wir_zusammen_etwas_unternehmen.mp3"
  },
  {
    "id": 123,
    "german": "Das klingt super ich bin dabei!",
    "english": "That sounds great I'm in!",
    "category": "social",
    "audio": "audio/123_das_klingt_super_ich_bin_dabei.mp3"
  },
  {
    "id": 124,
    "german": "Tut mir leid da habe ich leider schon was.",
    "english": "I'm sorry I already have something on then.",
    "category": "social",
    "audio": "audio/124_tut_mir_leid_da_habe_ich_leider_schon_wa.mp3"
  },
  {
    "id": 125,
    "german": "Um wie viel Uhr sollen wir uns treffen?",
    "english": "What time shall we meet?",
    "category": "social",
    "audio": "audio/125_um_wie_viel_uhr_sollen_wir_uns_treffen.mp3"
  },
  {
    "id": 126,
    "german": "Wo wollen wir uns treffen?",
    "english": "Where shall we meet?",
    "category": "social",
    "audio": "audio/126_wo_wollen_wir_uns_treffen.mp3"
  },
  {
    "id": 127,
    "german": "Ich freue mich schon sehr darauf.",
    "english": "I'm really looking forward to it.",
    "category": "social",
    "audio": "audio/127_ich_freue_mich_schon_sehr_darauf.mp3"
  },
  {
    "id": 128,
    "german": "Danke für die Einladung sehr nett von dir.",
    "english": "Thank you for the invitation very kind of you.",
    "category": "social",
    "audio": "audio/128_danke_fuer_die_einladung_sehr_nett_von_d.mp3"
  },
  {
    "id": 129,
    "german": "Wir sollten das öfter machen.",
    "english": "We should do this more often.",
    "category": "social",
    "audio": "audio/129_wir_sollten_das_oefter_machen.mp3"
  },
  {
    "id": 130,
    "german": "Es war ein toller Abend danke!",
    "english": "It was a great evening thank you!",
    "category": "social",
    "audio": "audio/130_es_war_ein_toller_abend_danke.mp3"
  },
  {
    "id": 131,
    "german": "Was machst du in deiner Freizeit am liebsten?",
    "english": "What do you like doing most in your free time?",
    "category": "hobbies",
    "audio": "audio/131_was_machst_du_in_deiner_freizeit_am_lieb.mp3"
  },
  {
    "id": 132,
    "german": "Ich spiele gerne Fußball mit Freunden.",
    "english": "I like playing football with friends.",
    "category": "hobbies",
    "audio": "audio/132_ich_spiele_gerne_fussball_mit_freunden.mp3"
  },
  {
    "id": 133,
    "german": "Ich lese jeden Abend vor dem Schlafen.",
    "english": "I read every evening before sleeping.",
    "category": "hobbies",
    "audio": "audio/133_ich_lese_jeden_abend_vor_dem_schlafen.mp3"
  },
  {
    "id": 134,
    "german": "Ich gehe zweimal pro Woche ins Fitnessstudio.",
    "english": "I go to the gym twice a week.",
    "category": "hobbies",
    "audio": "audio/134_ich_gehe_zweimal_pro_woche_ins_fitnessst.mp3"
  },
  {
    "id": 135,
    "german": "Hast du irgendwelche Hobbys?",
    "english": "Do you have any hobbies?",
    "category": "hobbies",
    "audio": "audio/135_hast_du_irgendwelche_hobbys.mp3"
  },
  {
    "id": 136,
    "german": "Ich interessiere mich sehr für Fotografie.",
    "english": "I'm very interested in photography.",
    "category": "hobbies",
    "audio": "audio/136_ich_interessiere_mich_sehr_fuer_fotograf.mp3"
  },
  {
    "id": 137,
    "german": "Am liebsten probiere ich neue Gerichte aus.",
    "english": "I most enjoy trying out new dishes.",
    "category": "hobbies",
    "audio": "audio/137_am_liebsten_probiere_ich_neue_gerichte_a.mp3"
  },
  {
    "id": 138,
    "german": "Ich schaue gerne Dokumentationen auf YouTube.",
    "english": "I like watching documentaries on YouTube.",
    "category": "hobbies",
    "audio": "audio/138_ich_schaue_gerne_dokumentationen_auf_you.mp3"
  },
  {
    "id": 139,
    "german": "Ich gehe oft spazieren um den Kopf frei zu bekommen.",
    "english": "I often go for walks to clear my head.",
    "category": "hobbies",
    "audio": "audio/139_ich_gehe_oft_spazieren_um_den_kopf_frei.mp3"
  },
  {
    "id": 140,
    "german": "Musik hören ist mein bester Ausgleich zum Stress.",
    "english": "Listening to music is my best stress relief.",
    "category": "hobbies",
    "audio": "audio/140_musik_hoeren_ist_mein_bester_ausgleich_z.mp3"
  },
  {
    "id": 141,
    "german": "Gestern ging ich in die Stadt und traf einen alten Freund.",
    "english": "Yesterday I went into town and met an old friend.",
    "category": "core_structures",
    "audio": "audio/141_gestern_ging_ich_in_die_stadt_und_traf_e.mp3"
  },
  {
    "id": 142,
    "german": "Er sprach so schnell dass ich kaum etwas verstehen konnte.",
    "english": "He spoke so fast that I could barely understand anything.",
    "category": "core_structures",
    "audio": "audio/142_er_sprach_so_schnell_dass_ich_kaum_etwas.mp3"
  },
  {
    "id": 143,
    "german": "Wir saßen im Café und redeten stundenlang miteinander.",
    "english": "We sat in the café and talked with each other for hours.",
    "category": "core_structures",
    "audio": "audio/143_wir_sassen_im_caf_und_redeten_stundenlan.mp3"
  },
  {
    "id": 144,
    "german": "Das Wetter war schlecht also blieb ich den ganzen Tag zu Hause.",
    "english": "The weather was bad so I stayed home all day.",
    "category": "core_structures",
    "audio": "audio/144_das_wetter_war_schlecht_also_blieb_ich_d.mp3"
  },
  {
    "id": 145,
    "german": "Als ich aufstand war es schon halb neun.",
    "english": "When I got up it was already half past eight.",
    "category": "core_structures",
    "audio": "audio/145_als_ich_aufstand_war_es_schon_halb_neun.mp3"
  },
  {
    "id": 146,
    "german": "Das ist das Restaurant das mir mein Kollege empfohlen hat.",
    "english": "That is the restaurant that my colleague recommended to me.",
    "category": "core_structures",
    "audio": "audio/146_das_ist_das_restaurant_das_mir_mein_koll.mp3"
  },
  {
    "id": 147,
    "german": "Ich suche einen Job der gut bezahlt ist und mir Spaß macht.",
    "english": "I'm looking for a job that is well paid and that I enjoy.",
    "category": "core_structures",
    "audio": "audio/147_ich_suche_einen_job_der_gut_bezahlt_ist.mp3"
  },
  {
    "id": 148,
    "german": "Die Frau mit der ich gesprochen habe war sehr hilfsbereit.",
    "english": "The woman I spoke with was very helpful.",
    "category": "core_structures",
    "audio": "audio/148_die_frau_mit_der_ich_gesprochen_habe_war.mp3"
  },
  {
    "id": 149,
    "german": "Das Buch das ich gerade lese ist wirklich spannend.",
    "english": "The book I'm currently reading is really exciting.",
    "category": "core_structures",
    "audio": "audio/149_das_buch_das_ich_gerade_lese_ist_wirklic.mp3"
  },
  {
    "id": 150,
    "german": "Kennst du jemanden der mir bei meinem Deutsch helfen kann?",
    "english": "Do you know someone who can help me with my German?",
    "category": "core_structures",
    "audio": "audio/150_kennst_du_jemanden_der_mir_bei_meinem_de.mp3"
  },
  {
    "id": 151,
    "german": "Deutsch wird in vielen Ländern gesprochen.",
    "english": "German is spoken in many countries.",
    "category": "core_structures",
    "audio": "audio/151_deutsch_wird_in_vielen_laendern_gesproch.mp3"
  },
  {
    "id": 152,
    "german": "Die Stelle wurde bereits besetzt.",
    "english": "The position has already been filled.",
    "category": "core_structures",
    "audio": "audio/152_die_stelle_wurde_bereits_besetzt.mp3"
  },
  {
    "id": 153,
    "german": "Mein Fahrrad wurde gestohlen.",
    "english": "My bicycle was stolen.",
    "category": "core_structures",
    "audio": "audio/153_mein_fahrrad_wurde_gestohlen.mp3"
  },
  {
    "id": 154,
    "german": "Das Formular muss bis Freitag ausgefüllt werden.",
    "english": "The form must be filled out by Friday.",
    "category": "core_structures",
    "audio": "audio/154_das_formular_muss_bis_freitag_ausgefuell.mp3"
  },
  {
    "id": 155,
    "german": "Wenn ich mehr Zeit hätte würde ich jeden Tag Deutsch lernen.",
    "english": "If I had more time I would study German every day.",
    "category": "core_structures",
    "audio": "audio/155_wenn_ich_mehr_zeit_haette_wuerde_ich_jed.mp3"
  },
  {
    "id": 156,
    "german": "Ich würde lieber zu Hause bleiben wenn es dir nichts ausmacht.",
    "english": "I would rather stay home if you don't mind.",
    "category": "core_structures",
    "audio": "audio/156_ich_wuerde_lieber_zu_hause_bleiben_wenn.mp3"
  },
  {
    "id": 157,
    "german": "An deiner Stelle würde ich den Arzt anrufen.",
    "english": "In your position I would call the doctor.",
    "category": "core_structures",
    "audio": "audio/157_an_deiner_stelle_wuerde_ich_den_arzt_anr.mp3"
  },
  {
    "id": 158,
    "german": "Es wäre toll wenn wir uns öfter treffen könnten.",
    "english": "It would be great if we could meet up more often.",
    "category": "core_structures",
    "audio": "audio/158_es_waere_toll_wenn_wir_uns_oefter_treffe.mp3"
  },
  {
    "id": 159,
    "german": "Ich lerne Deutsch weil ich in Deutschland arbeiten möchte.",
    "english": "I'm learning German because I want to work in Germany.",
    "category": "core_structures",
    "audio": "audio/159_ich_lerne_deutsch_weil_ich_in_deutschlan.mp3"
  },
  {
    "id": 160,
    "german": "Obwohl ich müde war habe ich trotzdem weitergemacht.",
    "english": "Although I was tired I carried on anyway.",
    "category": "core_structures",
    "audio": "audio/160_obwohl_ich_muede_war_habe_ich_trotzdem_w.mp3"
  },
  {
    "id": 161,
    "german": "Nachdem ich gegessen habe mache ich immer einen kurzen Spaziergang.",
    "english": "After eating I always take a short walk.",
    "category": "core_structures",
    "audio": "audio/161_nachdem_ich_gegessen_habe_mache_ich_imme.mp3"
  },
  {
    "id": 162,
    "german": "Ich spare Geld damit ich nächstes Jahr reisen kann.",
    "english": "I'm saving money so that I can travel next year.",
    "category": "core_structures",
    "audio": "audio/162_ich_spare_geld_damit_ich_naechstes_jahr.mp3"
  },
  {
    "id": 163,
    "german": "Ich werde morgen früh zum Amt gehen und das erledigen.",
    "english": "I will go to the office early tomorrow and take care of it.",
    "category": "core_structures",
    "audio": "audio/163_ich_werde_morgen_frueh_zum_amt_gehen_und.mp3"
  },
  {
    "id": 164,
    "german": "Bis nächsten Sommer werde ich fließend Deutsch sprechen.",
    "english": "By next summer I will speak German fluently.",
    "category": "core_structures",
    "audio": "audio/164_bis_naechsten_sommer_werde_ich_fliessend.mp3"
  },
  {
    "id": 165,
    "german": "Ich hatte das Formular bereits ausgefüllt bevor ich ankam.",
    "english": "I had already filled out the form before I arrived.",
    "category": "core_structures",
    "audio": "audio/165_ich_hatte_das_formular_bereits_ausgefuel.mp3"
  },
  {
    "id": 166,
    "german": "Ich habe heute Vormittag drei Vorlesungen.",
    "english": "I have three lectures this morning.",
    "category": "university_life",
    "audio": "audio/166_ich_habe_heute_vormittag_drei_vorlesunge.mp3"
  },
  {
    "id": 167,
    "german": "Die Abgabefrist für das Projekt ist morgen.",
    "english": "The deadline for the project is tomorrow.",
    "category": "university_life",
    "audio": "audio/167_die_abgabefrist_fuer_das_projekt_ist_mor.mp3"
  },
  {
    "id": 168,
    "german": "Ich verstehe den Code nicht ganz kannst du mir das erklären?",
    "english": "I don't quite understand the code - can you explain that to me?",
    "category": "university_life",
    "audio": "audio/168_ich_verstehe_den_code_nicht_ganz_kannst.mp3"
  },
  {
    "id": 169,
    "german": "Wir müssen uns für die Gruppenarbeit aufteilen.",
    "english": "We need to split up for the group work.",
    "category": "university_life",
    "audio": "audio/169_wir_muessen_uns_fuer_die_gruppenarbeit_a.mp3"
  },
  {
    "id": 170,
    "german": "Ich war heute in der Mensa zum Mittagessen.",
    "english": "I was at the canteen for lunch today.",
    "category": "university_life",
    "audio": "audio/170_ich_war_heute_in_der_mensa_zum_mittagess.mp3"
  },
  {
    "id": 171,
    "german": "Ich muss mich noch für das nächste Semester anmelden.",
    "english": "I still need to register for next semester.",
    "category": "university_life",
    "audio": "audio/171_ich_muss_mich_noch_fuer_das_naechste_sem.mp3"
  },
  {
    "id": 172,
    "german": "Die Prüfung war viel schwerer als ich erwartet hatte.",
    "english": "The exam was much harder than I had expected.",
    "category": "university_life",
    "audio": "audio/172_die_pruefung_war_viel_schwerer_als_ich_e.mp3"
  },
  {
    "id": 173,
    "german": "Ich habe die ganze Nacht für die Klausur gelernt.",
    "english": "I studied for the exam all night.",
    "category": "university_life",
    "audio": "audio/173_ich_habe_die_ganze_nacht_fuer_die_klausu.mp3"
  },
  {
    "id": 174,
    "german": "Können Sie mir sagen wo das Prüfungsamt ist?",
    "english": "Could you tell me where the examinations office is?",
    "category": "university_life",
    "audio": "audio/174_koennen_sie_mir_sagen_wo_das_pruefungsam.mp3"
  },
  {
    "id": 175,
    "german": "Mein Professor hat die Vorlesung auf nächste Woche verschoben.",
    "english": "My professor moved the lecture to next week.",
    "category": "university_life",
    "audio": "audio/175_mein_professor_hat_die_vorlesung_auf_nae.mp3"
  },
  {
    "id": 176,
    "german": "Ich rufe dich gleich zurück mein Akku ist fast leer.",
    "english": "I'll call you right back - my battery is almost dead.",
    "category": "phone_digital",
    "audio": "audio/176_ich_rufe_dich_gleich_zurueck_mein_akku_i.mp3"
  },
  {
    "id": 177,
    "german": "Hast du gerade WLAN oder bist du auf mobilen Daten?",
    "english": "Do you have Wi-Fi right now or are you on mobile data?",
    "category": "phone_digital",
    "audio": "audio/177_hast_du_gerade_wlan_oder_bist_du_auf_mob.mp3"
  },
  {
    "id": 178,
    "german": "Kannst du mir deinen Standort schicken?",
    "english": "Can you send me your location?",
    "category": "phone_digital",
    "audio": "audio/178_kannst_du_mir_deinen_standort_schicken.mp3"
  },
  {
    "id": 179,
    "german": "Ich habe dir eine Nachricht auf WhatsApp geschickt.",
    "english": "I sent you a message on WhatsApp.",
    "category": "phone_digital",
    "audio": "audio/179_ich_habe_dir_eine_nachricht_auf_whatsapp.mp3"
  },
  {
    "id": 180,
    "german": "Die App stürzt immer wieder ab ich weiß nicht warum.",
    "english": "The app keeps crashing - I don't know why.",
    "category": "phone_digital",
    "audio": "audio/180_die_app_stuerzt_immer_wieder_ab_ich_weis.mp3"
  },
  {
    "id": 181,
    "german": "Kannst du mich kurz anrufen ich habe keine Zeit zu tippen.",
    "english": "Can you give me a quick call - I don't have time to type.",
    "category": "phone_digital",
    "audio": "audio/181_kannst_du_mich_kurz_anrufen_ich_habe_kei.mp3"
  },
  {
    "id": 182,
    "german": "Ich bin gerade in einem Videoanruf kannst du später nochmal schreiben?",
    "english": "I'm in a video call right now - can you message me later?",
    "category": "phone_digital",
    "audio": "audio/182_ich_bin_gerade_in_einem_videoanruf_kanns.mp3"
  },
  {
    "id": 183,
    "german": "Mein Handy-Vertrag läuft nächsten Monat aus.",
    "english": "My phone contract expires next month.",
    "category": "phone_digital",
    "audio": "audio/183_mein_handy_vertrag_laeuft_naechsten_mona.mp3"
  },
  {
    "id": 184,
    "german": "Ich habe die Benachrichtigungen für diese App ausgeschaltet.",
    "english": "I've turned off the notifications for this app.",
    "category": "phone_digital",
    "audio": "audio/184_ich_habe_die_benachrichtigungen_fuer_die.mp3"
  },
  {
    "id": 185,
    "german": "Kannst du mir kurz dein WLAN-Passwort geben?",
    "english": "Could you give me your Wi-Fi password for a moment?",
    "category": "phone_digital",
    "audio": "audio/185_kannst_du_mir_kurz_dein_wlan_passwort_ge.mp3"
  },
  {
    "id": 186,
    "german": "Ich brauche einen Termin bei der Ausländerbehörde.",
    "english": "I need an appointment at the foreigners' registration office.",
    "category": "bureaucracy",
    "audio": "audio/186_ich_brauche_einen_termin_bei_der_auslaen.mp3"
  },
  {
    "id": 187,
    "german": "Meine Aufenthaltserlaubnis läuft in zwei Monaten ab.",
    "english": "My residence permit expires in two months.",
    "category": "bureaucracy",
    "audio": "audio/187_meine_aufenthaltserlaubnis_laeuft_in_zwe.mp3"
  },
  {
    "id": 188,
    "german": "Wo muss ich mich offiziell anmelden?",
    "english": "Where do I have to officially register my address?",
    "category": "bureaucracy",
    "audio": "audio/188_wo_muss_ich_mich_offiziell_anmelden.mp3"
  },
  {
    "id": 189,
    "german": "Ich brauche eine Immatrikulationsbescheinigung von der Uni.",
    "english": "I need an enrollment certificate from the university.",
    "category": "bureaucracy",
    "audio": "audio/189_ich_brauche_eine_immatrikulationsbeschei.mp3"
  },
  {
    "id": 190,
    "german": "Welche Unterlagen muss ich mitbringen?",
    "english": "Which documents do I need to bring?",
    "category": "bureaucracy",
    "audio": "audio/190_welche_unterlagen_muss_ich_mitbringen.mp3"
  },
  {
    "id": 191,
    "german": "Ich habe einen Brief vom Amt bekommen aber ich verstehe ihn nicht ganz.",
    "english": "I received a letter from the office but I don't quite understand it.",
    "category": "bureaucracy",
    "audio": "audio/191_ich_habe_einen_brief_vom_amt_bekommen_ab.mp3"
  },
  {
    "id": 192,
    "german": "Ist meine Krankenversicherung auch im Ausland gültig?",
    "english": "Is my health insurance also valid abroad?",
    "category": "bureaucracy",
    "audio": "audio/192_ist_meine_krankenversicherung_auch_im_au.mp3"
  },
  {
    "id": 193,
    "german": "Kann ich dieses Formular auch online einreichen?",
    "english": "Can I also submit this form online?",
    "category": "bureaucracy",
    "audio": "audio/193_kann_ich_dieses_formular_auch_online_ein.mp3"
  },
  {
    "id": 194,
    "german": "Ich bin als Student krankenversichert bei der TK.",
    "english": "I'm health insured as a student with TK.",
    "category": "bureaucracy",
    "audio": "audio/194_ich_bin_als_student_krankenversichert_be.mp3"
  },
  {
    "id": 195,
    "german": "Wann bekomme ich die Entscheidung über meinen Antrag?",
    "english": "When will I receive the decision on my application?",
    "category": "bureaucracy",
    "audio": "audio/195_wann_bekomme_ich_die_entscheidung_ueber.mp3"
  },
  {
    "id": 196,
    "german": "Ich habe letzten Dezember meinen Bachelor abgeschlossen.",
    "english": "I completed my bachelor's last December.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 197,
    "german": "Jetzt bewerbe ich mich auf Masterstudienplätze in Deutschland.",
    "english": "Now I am applying for master's places in Germany.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 198,
    "german": "Jeden Morgen lerne ich zwei Stunden Deutsch für meinen B1-Kurs.",
    "english": "Every morning I study German for two hours for my B1 course.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 199,
    "german": "Mit dem Fahrrad fahre ich meistens zum Sprachcafé.",
    "english": "I usually cycle to the language café.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 200,
    "german": "Am Wochenende spiele ich Basketball mit Freunden.",
    "english": "At the weekend I play basketball with friends.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 201,
    "german": "Wie bereite ich mich am besten auf ein Vorstellungsgespräch vor?",
    "english": "How do I best prepare for a job interview?",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 202,
    "german": "Wann beginnt mein Online-Kurs bei IQ Lingua?",
    "english": "When does my online course at IQ Lingua start?",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 203,
    "german": "Wo kann ich in Bremen gut Bachata tanzen gehen?",
    "english": "Where can I go bachata dancing in Bremen?",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 204,
    "german": "Was machst du nach dem Sprachcafé heute Abend?",
    "english": "What are you doing after the language café this evening?",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 205,
    "german": "Warum lernst du so intensiv Deutsch?",
    "english": "Why are you studying German so intensively?",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 206,
    "german": "Gehst du heute Abend ins Sprachcafé?",
    "english": "Are you going to the language café this evening?",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 207,
    "german": "Hast du schon Bewerbungen abgeschickt?",
    "english": "Have you already sent off applications?",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 208,
    "german": "Spielst du lieber Tischtennis oder Tennis?",
    "english": "Do you prefer table tennis or tennis?",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 209,
    "german": "Kannst du mir beim Lebenslauf helfen?",
    "english": "Can you help me with my CV?",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 210,
    "german": "Fährst du heute mit dem Fahrrad?",
    "english": "Are you cycling today?",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 211,
    "german": "Ich lerne Deutsch intensiv, weil ich in Deutschland bleiben möchte.",
    "english": "I study German intensively because I want to stay in Germany.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 212,
    "german": "Weil ich einen B1-Kurs bei IQ Lingua mache, verbessert sich mein Deutsch schnell.",
    "english": "Because I'm doing a B1 course at IQ Lingua, my German is improving quickly.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 213,
    "german": "Wenn ich die B1-Prüfung bestehe, kann ich mich für mehr Masterprogramme bewerben.",
    "english": "If I pass the B1 exam, I can apply for more master's programmes.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 214,
    "german": "Ich übe jeden Tag Klavierspielen, damit ich schneller Fortschritte mache.",
    "english": "I practise piano every day so that I make progress faster.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 215,
    "german": "Ich glaube, dass das wöchentliche Sprachcafé sehr hilfreich ist.",
    "english": "I believe that the weekly language café is very helpful.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 216,
    "german": "Können Sie mir sagen, wo ich meine Bewerbungsunterlagen einreichen kann?",
    "english": "Could you tell me where I can submit my application documents?",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 217,
    "german": "Das Masterprogramm, das ich angestrebt habe, beginnt im Oktober.",
    "english": "The master's programme I have been aiming for starts in October.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 218,
    "german": "Ich fahre jeden Morgen mit dem Fahrrad zum Sprachcafé.",
    "english": "I cycle to the language café every morning.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 219,
    "german": "Wir spielen am Freitag zusammen Tischtennis im Park.",
    "english": "We play table tennis together in the park on Friday.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 220,
    "german": "Er tanzt am Wochenende alleine Bachata zu Hause.",
    "english": "He dances bachata alone at home at the weekend.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 221,
    "german": "Hans isst gern Spaghetti.",
    "english": "Hans likes to eat spaghetti.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 222,
    "german": "Wir sprechen heute Deutsch.",
    "english": "We are speaking German today.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 223,
    "german": "Heute sprechen wir Deutsch.",
    "english": "Today we are speaking German.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 224,
    "german": "Was esst ihr gern?",
    "english": "What do you all like to eat?",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 225,
    "german": "Wie geht es dir?",
    "english": "How are you?",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 226,
    "german": "Wann lernst du Deutsch?",
    "english": "When do you study German?",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 227,
    "german": "Schaust du gern Fußball?",
    "english": "Do you like watching football?",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 228,
    "german": "Hört er oft Musik?",
    "english": "Does he often listen to music?",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 229,
    "german": "Essen wir heute Abend zu Hause?",
    "english": "Are we eating at home this evening?",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 230,
    "german": "Hans fährt morgen mit dem Bus in die Schule.",
    "english": "Hans is taking the bus to school tomorrow.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 231,
    "german": "Lisa geht am Dienstag zu Fuß ins Kino.",
    "english": "Lisa walks to the cinema on Tuesday.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 232,
    "german": "Am Dienstag geht Lisa zu Fuß ins Kino.",
    "english": "On Tuesday Lisa walks to the cinema.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 233,
    "german": "Ich esse ein Sandwich, weil ich Hunger habe.",
    "english": "I'm eating a sandwich because I'm hungry.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 234,
    "german": "Weil ich Hunger habe, esse ich ein Sandwich.",
    "english": "Because I'm hungry, I'm eating a sandwich.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 235,
    "german": "Er bleibt zu Hause, weil das Wetter schlecht ist.",
    "english": "He stays at home because the weather is bad.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 236,
    "german": "Da ihr Auto kaputt ist, nimmt sie ein Taxi.",
    "english": "Since her car is broken, she takes a taxi.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 237,
    "german": "Wir kaufen ein neues Auto, wenn wir Geld haben.",
    "english": "We will buy a new car when we have money.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 238,
    "german": "Ich bleibe zu Hause, falls es regnet.",
    "english": "I'll stay at home if it rains.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 239,
    "german": "Er hilft dir, sofern er Zeit hat.",
    "english": "He will help you as long as he has time.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 240,
    "german": "Er lernt Deutsch, seitdem er in Deutschland lebt.",
    "english": "He has been learning German since he started living in Germany.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 241,
    "german": "Sie zeichnet ein Bild, während sie telefoniert.",
    "english": "She draws a picture while she is on the phone.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 242,
    "german": "Ich warte, bis du mich anrufst.",
    "english": "I'll wait until you call me.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 243,
    "german": "Hans spart Geld, damit er ein Haus kaufen kann.",
    "english": "Hans is saving money so that he can buy a house.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 244,
    "german": "Sie geht früh schlafen, damit sie morgen fit ist.",
    "english": "She goes to bed early so that she is fit tomorrow.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 245,
    "german": "Wir glauben, dass das Wetter morgen gut ist.",
    "english": "We believe that the weather will be good tomorrow.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 246,
    "german": "Denkst du, dass es morgen regnet?",
    "english": "Do you think it will rain tomorrow?",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 247,
    "german": "Können Sie mir sagen, wo der Bahnhof ist?",
    "english": "Could you tell me where the train station is?",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 248,
    "german": "Ich möchte wissen, wie viel das kostet.",
    "english": "I would like to know how much that costs.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 249,
    "german": "Das Konzert, das morgen stattfindet, ist ausverkauft.",
    "english": "The concert that takes place tomorrow is sold out.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 250,
    "german": "Das ist die Lampe, die ich gekauft habe.",
    "english": "That is the lamp that I bought.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 251,
    "german": "Wenn du das Fenster aufmachst, wird es kalt.",
    "english": "If you open the window, it will get cold.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 252,
    "german": "Die Mutter schenkt dem Kind einen Teddybär.",
    "english": "The mother gives the child a teddy bear.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 253,
    "german": "Die Eltern schicken der Lehrerin eine E-Mail.",
    "english": "The parents send the teacher an email.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 254,
    "german": "Hans gibt der Schwester ein Auto.",
    "english": "Hans gives his sister a car.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 255,
    "german": "Die Mutter schenkt den Teddy einem Kind.",
    "english": "The mother gives the teddy to a child.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 256,
    "german": "Die Mutter schenkt den Teddy dem Kind.",
    "english": "The mother gives the teddy to the child.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 257,
    "german": "Die Mutter schenkt ihm den Teddybär.",
    "english": "The mother gives him the teddy bear.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 258,
    "german": "Die Eltern schicken ihr eine E-Mail.",
    "english": "The parents send her an email.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 259,
    "german": "Hans gibt ihr ein Auto.",
    "english": "Hans gives her a car.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 260,
    "german": "Die Mutter schenkt ihn ihr.",
    "english": "The mother gives it to her.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 261,
    "german": "Die Eltern schicken sie ihr.",
    "english": "The parents send it to her.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 262,
    "german": "Hans gibt es ihr.",
    "english": "Hans gives it to her.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 263,
    "german": "Morgen kaufe ich einen Computer.",
    "english": "Tomorrow I'm buying a computer.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 264,
    "german": "Gestern hat er einen Film gesehen.",
    "english": "Yesterday he watched a film.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 265,
    "german": "Wir fahren mit dem Zug nach Berlin.",
    "english": "We're travelling to Berlin by train.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 266,
    "german": "Du schickst dem Kunden eine E-Mail.",
    "english": "You're sending the customer an email.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 267,
    "german": "Lisa trinkt im Café einen Tee.",
    "english": "Lisa is drinking a tea in the café.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 268,
    "german": "Lisa trinkt den Tee in einem Café.",
    "english": "Lisa is drinking the tea in a café.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 269,
    "german": "Ich fahre morgen meine Frau wegen des Regens mit dem Auto ins Büro.",
    "english": "I'm driving my wife to the office tomorrow because of the rain.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 270,
    "german": "Ich bringe heute Abend meiner Frau mit dem Auto ein Geschenk nach Hause.",
    "english": "I'm bringing my wife a gift home by car this evening.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 271,
    "german": "Lisa hat gestern ihrem Vater einen Brief ins Büro geschickt.",
    "english": "Lisa sent her father a letter to the office yesterday.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 272,
    "german": "Hans spielt jeden Tag mit Freude auf dem Sportplatz Basketball.",
    "english": "Hans plays basketball on the sports field with joy every day.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 273,
    "german": "Ihr sollt täglich fleißig zu Hause Deutsch lernen.",
    "english": "You all should learn German diligently at home every day.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 274,
    "german": "Ich schicke meinem Freund eine Nachricht nach dem Sprachcafé.",
    "english": "I send my friend a message after the language café.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 275,
    "german": "Ich gebe ihm meine Handynummer.",
    "english": "I give him my phone number.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 276,
    "german": "Ich habe meiner Mutter gestern Fotos aus Bremen geschickt.",
    "english": "I sent my mother photos from Bremen yesterday.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 277,
    "german": "Ich kaufe ihr heute ein kleines Geschenk.",
    "english": "I'm buying her a small gift today.",
    "category": "satzbau",
    "audio": ""
  },
  {
    "id": 278,
    "german": "Seitdem ich in Deutschland lebe, schicke ich meiner Familie regelmäßig Pakete.",
    "english": "Since I've been living in Germany, I regularly send packages to my family.",
    "category": "satzbau",
    "audio": ""
  }
];
