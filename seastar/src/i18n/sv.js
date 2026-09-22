// Swedish – the base locale. en.js is a full override, deep-merged over this file.
module.exports = {
  ui: {
    htmlLang: 'sv',
    dateLocale: 'sv-SE',
    skip: 'Hoppa till innehållet',
    menu: 'Meny', close: 'Stäng', language: 'Språk',
    bookNow: 'Boka kurs',
    contactUs: 'Kontakta oss',
    priceOnRequest: 'Pris på förfrågan',
    askPrice: 'Fråga om pris',
    readMore: 'Läs mer',
    allCourses: 'Alla kurser',
    backToCourses: '← Alla kurser',
    days: '{n} dagar', day: '1 dag', evenings: '{n} kvällar',
    internship: 'Praktikperiod',
    minAge: 'Från {n} år',
    maxDepth: 'Till {n} m',
    certificate: 'Certifikat',
    noCert: 'Inget certifikat',
    level: 'Nivå',
    duration: 'Omfattning',
    prereq: 'Förkunskaper',
    included: 'Det här ingår',
    youLearn: 'Det här lär du dig',
    levels: ['Nybörjare', 'Nybörjare', 'Certifierad dykare', 'Erfaren dykare', 'Proffs'],
    groups: { start: 'Börja dyka', con: 'Fortsätt', pro: 'Bli proffs', tec: 'Teknisk dykning', spec: 'Specialkurser' },
    hoursTitle: 'Öppettider',
    closed: 'Stängt',
    weekdays: { mon: 'Måndag', tue: 'Tisdag', wed: 'Onsdag', thu: 'Torsdag', fri: 'Fredag', sat: 'Lördag', sun: 'Söndag' },
    weekdaysShort: { mon: 'Mån', tue: 'Tis', wed: 'Ons', thu: 'Tors', fri: 'Fre', sat: 'Lör', sun: 'Sön' },
    openNow: 'Öppet nu', closedNow: 'Stängt just nu',
    call: 'Ring', mail: 'Mejla', directions: 'Hitta hit',
    slugs: {
      courses: 'kurser', tec: 'teknisk-dykning', trips: 'dykutfarder', gear: 'utrustning',
      service: 'service', gas: 'gas-och-luft', travel: 'dykresor', club: 'dykklubb',
      about: 'om-oss', contact: 'kontakt', book: 'boka', faq: 'fragor-och-svar',
    },
    nav: {
      courses: 'Kurser', tec: 'Teknisk dykning', trips: 'Utfärder', gear: 'Utrustning',
      service: 'Service', gas: 'Gas & luft', travel: 'Resor', club: 'Klubben',
      about: 'Om oss', contact: 'Kontakt', faq: 'Frågor', more: 'Mer',
    },
    footTagline: 'Dykskolan med allt extra. Från första andetaget under ytan till instruktör.',
    footCourses: 'Kurser', footServices: 'Hos oss', footContact: 'Kontakt',
    footNote: 'Demo byggd av en utomstående utvecklare. Inte publicerad av Seastar Diving.',
    padiBadge: 'PADI 5 Star IDC Dive Center',
    form: {
      name: 'Namn', email: 'E-post', phone: 'Telefon', what: 'Vad gäller det?', message: 'Meddelande',
      level: 'Din dykerfarenhet', when: 'När vill du börja?', send: 'Skicka',
      required: 'obligatoriskt',
      whatOptions: ['Kurs', 'Utfärd', 'Utrustning', 'Service av utrustning', 'Gasfyllning', 'Dykresa', 'Klubben', 'Annat'],
      levelOptions: ['Har aldrig dykt', 'Provat på', 'Open Water', 'Advanced', 'Rescue eller mer', 'Teknisk dykare'],
      whenOptions: ['Så snart som möjligt', 'Inom en månad', 'Inom tre månader', 'Vet inte än'],
      note: 'Formuläret är en demo och skickar ingenting. Ring eller mejla så länge.',
      thanks: 'Tack! Vi hör av oss.',
    },
  },

  content: {
    // ---------------------------------------------------------------- HOME
    home: {
      title: 'Seastar Diving – dykskola och dykcenter i Stockholm',
      desc: 'PADI 5 Star IDC-center i Skrubba, Stockholm. Dykkurser från prova-på till instruktör, teknisk dykning, torrdräkt, service, gasfyllning och uthyrning.',
      heroKicker: 'PADI 5 Star IDC Dive Center · Stockholm',
      heroTitle: 'Östersjön är mörkare, kallare och långt mer intressant än du tror.',
      heroLead: 'Vi lär dig dyka i vattnet som faktiskt finns utanför dörren – och tar dig sedan hela vägen till instruktör om du vill. Kurser, teknisk dykning, service, gas och utrustning under ett tak i Skrubba.',
      heroCtaPrimary: 'Hitta din kurs',
      heroCtaSecondary: 'Prova på först',
      statLabels: { padi: 'PADI-center', instructors: 'Instruktörer', languages: 'Språk i klassrummet', gas: 'Dagar om året med gas' },

      pathsTitle: 'Var är du just nu?',
      pathsSub: 'Tre vägar in. Alla slutar i samma vatten.',
      paths: [
        ['Har aldrig dykt', 'Börja med ett prova-på i bassäng, eller gå direkt på Open Water Diver – certifikatet som gäller i hela världen.', 'discover'],
        ['Certifierad men ringrostig', 'Torrdräktskurs, Advanced eller en uppfräschning med instruktör innan säsongen drar igång.', 'aow'],
        ['Vill längre ner', 'TecRec, trimix och rebreather. Vi fyller gasen själva och servar din utrustning i huset.', 'tec'],
      ],

      whyTitle: 'Varför Seastar',
      why: [
        ['Allt finns i huset', 'Kurslokal, utrustning, verkstad och gasfyllning på samma adress. Du behöver inte åka mellan tre ställen för att få ihop en dykhelg.'],
        ['Tio instruktörer', 'Små grupper och riktig tid i vattnet. Vi utbildar från första andetaget till instruktörsnivå – IDC-centret är här, inte utomlands.'],
        ['Kallt vatten på riktigt', 'Torrdräkt, tjocka handskar och sikt som växlar. Vi utbildar för Östersjön, inte för en bassäng i trettio grader.'],
        ['Fyra språk', 'Svenska, engelska, danska och norska. Alla kurser kan gå på engelska.'],
      ],

      coursesTitle: 'Kurser',
      coursesSub: 'Från första andetaget under ytan till instruktör.',
      tecTitle: 'När sporten inte räcker',
      tecLead: 'Vi är TecRec-center och utbildar på rebreather. Vi blandar nitrox och trimix själva och säljer sorb över disk – du behöver inte planera runt någon annans öppettider.',
      tecCta: 'Läs om teknisk dykning',

      gearTitle: 'Utrustning, service och gas',
      gearSub: 'Det tråkiga som avgör om dyket blir av.',
      gearCards: [
        ['Butik och uthyrning', 'Allt från mask och snorkel till torrdräkt, dykdator och rebreather. Prova utrustningen innan du köper.', 'gear'],
        ['Verkstad', 'Service och reparation av regulatorer, BCD, dykdatorer, instrument, våt- och torrdräkter samt flaskor.', 'service'],
        ['Gas och luft', 'Luft, nitrox, trimix, blandgas och CO2-absorbent.', 'gas'],
      ],

      ctaTitle: 'Börja med ett samtal',
      ctaLead: 'Berätta var du står så föreslår vi en väg. Inga förkunskaper krävs för att ringa.',
    },

    // ---------------------------------------------------------------- COURSES HUB
    courses: {
      title: 'Dykkurser i Stockholm',
      desc: 'PADI-kurser från prova-på och Open Water till Rescue, Divemaster och instruktör. Torrdräkt och nitrox som specialkurser. Seastar Diving, Skrubba.',
      h1: 'Dykkurser',
      lead: 'Vi utbildar enligt PADI hela vägen från nybörjare till instruktör. Kurserna går året runt – teori och bassäng inomhus, öppet vatten när säsongen tillåter.',
      note: 'Priser och kursstarter varierar över året. Ring eller mejla så får du aktuella datum och pris för den kurs du är intresserad av.',
    },

    // ---------------------------------------------------------------- COURSE TEXT
    courseText: {
      discover: {
        name: 'Prova på dykning', nav: 'Prova på',
        short: 'Ditt första andetag under ytan, i bassäng med instruktör.',
        lead: 'Det här är den enklaste vägen in. Du får utrustningen påsatt, en genomgång på land och sedan ett riktigt andetag under ytan – med en instruktör bredvid dig hela tiden.',
        body: 'Ingen teori att plugga, inget certifikat i slutet, inga förkunskaper. Bara ett sätt att ta reda på om det här är något för dig innan du lägger tid och pengar på en hel kurs.\n\nGillar du det kan innehållet i många fall räknas av mot Open Water Diver-kursen – fråga oss när du bokar.',
      },
      ow: {
        name: 'PADI Open Water Diver', nav: 'Open Water',
        short: 'Grundcertifikatet. Gäller i hela världen, livet ut.',
        lead: 'Grundkursen i sportdykning och det certifikat de allra flesta dykare har. Efter godkänd kurs får du dyka på egen hand med en dykkamrat, ner till 18 meter, var som helst i världen.',
        body: 'Kursen består av tre delar: teori, avgränsat vatten (bassäng) och fyra dyk i öppet vatten. Teorin läser du som e-learning i din egen takt innan vi ses – då slipper vi sitta i klassrum och kan lägga tiden i vattnet i stället.\n\nI bassängen bygger vi upp färdigheterna i lugn takt: montera utrustningen, kontrollera flytkraften, tömma masken, dela luft. När de sitter går vi ut i öppet vatten.\n\nDu behöver kunna simma 200 meter (eller 300 m med mask, snorkel och fenor) och flyta eller trampa vatten i tio minuter. Ingen tid mäts – vi tittar bara på att du är trygg i vatten.',
      },
      aow: {
        name: 'PADI Advanced Open Water Diver', nav: 'Advanced',
        short: 'Fem äventyrsdyk, bland annat djup och navigation.',
        lead: 'Nästa steg efter Open Water. Fem dyk där du provar olika typer av dykning tillsammans med instruktör – två obligatoriska och tre du väljer själv.',
        body: 'Djupdyket och navigationsdyket ingår alltid. Resten väljer du utifrån vad du vill kunna: vrak, torrdräkt, nitrox, sökning och bärgning, nattdykning, flytkraftskontroll eller fotografering.\n\nEfter kursen får du dyka till 30 meter. Minst lika viktigt: du har gjort fem dyk till med någon som tittar på vad du gör och säger vad du kan göra bättre.',
      },
      rescue: {
        name: 'PADI Rescue Diver', nav: 'Rescue',
        short: 'Kursen de flesta dykare säger var den bästa.',
        lead: 'Här slutar det handla om dig själv och börjar handla om alla andra. Du lär dig känna igen problem innan de blir olyckor, och hantera dem när de ändå blir det.',
        body: 'Kursen är krävande och rolig på samma gång. Du övar självräddning, stressad dykare på ytan och under ytan, saknad dykare, uppstigning med medvetslös dykare och omhändertagande på land.\n\nDu behöver ett giltigt första hjälpen- och HLR-intyg som inte är äldre än 24 månader. Har du inget kör vi EFR-kursen i samband med Rescue.',
      },
      dm: {
        name: 'PADI Divemaster', nav: 'Divemaster',
        short: 'Första proffsnivån. Börja jobba med dykning.',
        lead: 'Divemaster är den första professionella nivån inom PADI. Du fördjupar teorin, finslipar dina egna färdigheter till demonstrationsnivå och lär dig leda och assistera andra dykare.',
        body: 'Kursen är ett internship snarare än en kurs med fast schema – du går den parallellt med vår verksamhet under en period vi kommer överens om. Du assisterar på kurser, guidar certifierade dykare, kartlägger en dykplats och genomför räddningsövningar.\n\nSom certifierad Divemaster kan du arbeta på dykcenter, guida dykare och assistera instruktörer. Det är också förkunskapskravet för att gå vidare till instruktör.',
      },
      idc: {
        name: 'PADI Instructor Development Course', nav: 'Instruktör (IDC)',
        short: 'Bli PADI-instruktör – här hemma, inte utomlands.',
        lead: 'Vi är ett IDC-center, vilket betyder att hela instruktörsutbildningen går att göra hos oss. Du behöver inte åka till Thailand eller Egypten för att bli PADI-instruktör.',
        body: 'IDC består av Assistant Instructor-delen och Open Water Scuba Instructor-delen. Du lär dig PADI:s undervisningssystem, håller presentationer i klassrum, avgränsat vatten och öppet vatten, och går igenom standarder och riskhantering.\n\nKursen avslutas med Instructor Examination (IE), som hålls av en PADI-examinator. Klarar du den är du PADI Open Water Scuba Instructor och kan certifiera egna dykare.',
      },
      dry: {
        name: 'PADI Dry Suit Diver', nav: 'Torrdräkt',
        short: 'Förutsättningen för att dyka här året runt.',
        lead: 'I svenskt vatten är torrdräkt inte lyx utan förutsättningen för att dyket ska bli av mer än tre månader om året. Den här kursen gör dig trygg i den.',
        body: 'Du lär dig hur dräkten fungerar, hur du använder den för flytkraft i stället för västen, hur du hanterar ventilerna och vad du gör om du hamnar upp och ner med luft i fötterna.\n\nVi går igenom underställ, skötsel och vad som faktiskt går sönder. Har du ingen egen dräkt hyr du en av oss under kursen – och har du en som läcker tar verkstaden den samtidigt.',
      },
      nitrox: {
        name: 'PADI Enriched Air (Nitrox) Diver', nav: 'Nitrox',
        short: 'Längre bottentid på samma djup.',
        lead: 'Nitrox är luft med högre syrehalt. Resultatet är längre tillåten bottentid på samma djup, och för många dykare en märkbart piggare känsla efter dagens andra dyk.',
        body: 'Kursen är mest teori och kan göras på en dag, med eller utan dyk. Du lär dig analysera en flaska, räkna ut maxdjup för blandningen, ställa in dykdatorn och förstå varför syre har en gräns nedåt.\n\nVi blandar nitrox här i huset, så när certifikatet sitter kan du fylla på plats.',
      },
    },

    // ---------------------------------------------------------------- INCLUDES / LEARN
    includes: {
      instructor: 'Instruktör', gear: 'All utrustning', pool: 'Bassängpass', openwater: 'Dyk i öppet vatten',
      elearning: 'PADI e-learning', certificate: 'Certifikat och digitalt kort', drysuit: 'Torrdräkt att låna',
      analyser: 'Syreanalys och märkning', mentor: 'Mentor och handledning', workshops: 'Workshops',
      internship: 'Praktik hos oss', courseDirector: 'Course Director', materials: 'Kursmaterial', ie: 'Anmälan till IE',
    },
    learn: {
      breathe: 'Andas under vattnet', equalize: 'Tryckutjämning', buoyancy: 'Flytkraftskontroll', signals: 'Handsignaler',
      theory: 'Dykteori och tabeller', assembly: 'Montera och kontrollera utrustningen', masksafety: 'Maskrensning och luftdelning',
      navigation: 'Navigation med kompass', buddy: 'Kamratkontroll och planering',
      deep: 'Djupdykning', adventure: 'Tre valfria äventyrsdyk', planning: 'Dykplanering',
      selfrescue: 'Självräddning', stress: 'Stressad dykare', missing: 'Sökmönster', surfacing: 'Uppstigning med medvetslös dykare', firstaid: 'Första hjälpen och syrgas',
      physics: 'Fördjupad dykfysik', skills24: 'De 24 färdigheterna på demonstrationsnivå', mapping: 'Kartläggning av dykplats', guiding: 'Guida certifierade dykare', assisting: 'Assistera på kurs',
      teaching: 'PADI:s undervisningssystem', standards: 'Standarder och regelverk', presentations: 'Presentationer i klassrum och vatten', riskmgmt: 'Riskhantering',
      drysuitBuoyancy: 'Flytkraft med torrdräkt', valves: 'In- och utloppsventiler', recovery: 'Ta dig ur fotupp-läge', care: 'Skötsel och förvaring',
      eanBasics: 'Syrets för- och nackdelar', analysing: 'Analysera din flaska', mod: 'Räkna ut maxdjup', computer: 'Ställa in dykdatorn',
    },
    prereqs: {
      none: 'Inga. Du ska vara frisk och trygg i vatten.',
      swim: 'Simma 200 m (eller 300 m med mask, snorkel och fenor) och flyta i 10 minuter.',
      ow: 'PADI Open Water Diver eller motsvarande.',
      aowEfr: 'PADI Advanced Open Water Diver och giltigt första hjälpen/HLR-intyg, max 24 månader gammalt.',
      rescue: 'PADI Rescue Diver, 40 loggade dyk och läkarintyg.',
      dm: 'PADI Divemaster, 60 loggade dyk och minst 6 månader som certifierad dykare.',
    },

    // ---------------------------------------------------------------- TEC
    tec: {
      title: 'Teknisk dykning – TecRec, trimix och rebreather',
      desc: 'PADI TecRec Tec 40–50, Tec Trimix och rebreather/CCR hos Seastar Diving i Stockholm. Egen blandning av nitrox och trimix, sorb över disk.',
      h1: 'Teknisk dykning',
      lead: 'När sportdykningens gränser börjar kännas som gränser. Vi är TecRec-center, utbildar på rebreather och blandar gasen själva.',
      body: 'Teknisk dykning betyder dyk där du inte kan gå rakt upp till ytan – för att du har dekompression att betala av, eller tak över huvudet. Det kräver mer utrustning, mer planering och betydligt mer disciplin.\n\nVi tar det stegvis. Tec 40 är en mjuk övergång från sportdykning med begränsad dekompression. Tec 45 och Tec 50 öppnar för riktig dekompressionsdykning med flera gaser. Trimix tar dig förbi det djup där luft slutar vara en bra idé.\n\nParallellt utbildar vi på rebreather. Slutet system betyder tystare dyk, varmare andningsgas och betydligt längre tid nere – och ett helt annat krav på noggrannhet före och efter dyket.',
      gasNote: 'Vi blandar nitrox och trimix i huset och säljer CO2-absorbent över disk. Du behöver inte planera dina dyk runt någon annans leveranstider.',
      coursesTitle: 'Kurser vi kör',
      tecCourses: {
        tec40: ['Tec 40', 'Första steget in i teknisk dykning. Begränsad dekompression, en dekogas med upp till 50 % syre.'],
        tec45: ['Tec 45', 'Riktig dekompressionsdykning till 45 meter, med full dekogas och redundans.'],
        tec50: ['Tec 50', 'Till 50 meter med flera dekogaser och accelererad dekompression.'],
        trimix: ['Tec Trimix', 'Helium i botten-gasen. Tar dig förbi luftens gräns, med klart huvud kvar.'],
        ccr: ['Rebreather / CCR', 'Slutet system. Tystare, varmare och mycket längre bottentid – mot betydligt högre krav på rutin.'],
      },
      askTitle: 'Var ska du börja?',
      askLead: 'Har du redan tekniska certifikat eller kommer du från ett annat utbildningssystem? Hör av dig så går vi igenom vad som behöver kompletteras.',
    },

    // ---------------------------------------------------------------- TRIPS
    trips: {
      title: 'Dykutfärder och dykresor',
      desc: 'Dykutfärder i Stockholms skärgård och Östersjön med Seastar Diving, plus längre dykresor. Egen dykbåt.',
      h1: 'Utfärder',
      lead: 'Vi har egen dykbåt och kör utfärder i Stockholms skärgård och Östersjön under säsong.',
      body: 'Östersjön är bräckt, kallt och mörkt – och just därför fullt av trä som inte ruttnar. Skeppsmask trivs inte i det här vattnet, vilket är anledningen till att Östersjön har några av världens bäst bevarade träfartygsvrak.\n\nUtfärderna anpassas efter väder, sikt och vilka som följer med. Är du nycertifierad går du med en guide. Är du tekniker planerar vi dyket tillsammans.',
      seasonNote: 'Säsong, datum och priser varierar. Ring eller mejla så berättar vi vad som är inplanerat närmast.',
      clubTitle: 'Dykklubben',
      clubLead: 'Att dyka är roligare med folk. Klubben är vårt sätt att se till att det finns någon att dyka med även när ingen kurs går.',
      travelTitle: 'Dykresor',
      travelLead: 'Vi arrangerar resor till varmare vatten. Ett bra sätt att göra de första dyken efter certifikatet i trettio meters sikt innan du möter Östersjön i oktober.',
    },

    // ---------------------------------------------------------------- GEAR
    gear: {
      title: 'Dykutrustning – butik och uthyrning',
      desc: 'Dykbutik och uthyrning i Stockholm. Torrdräkt, BCD, regulator, dykdator, flaskor och rebreather. Prova innan du köper.',
      h1: 'Utrustning',
      lead: 'Vi hjälper dig med utrustning för alla miljöer – från shorty i tropikerna till torrdräkt i Östersjön.',
      body: 'Utrustning är personligt och dyrt. Vi tycker därför att du ska få prova innan du bestämmer dig. Hyr en dräkt eller en regulator, dyk med den, och köp sedan den som faktiskt passade.',
      rentalTitle: 'Detta hyr vi ut',
      rentalItems: {
        drysuit: 'Torrdräkt', wetsuit: 'Våtdräkt', bcd: 'BCD', regulator: 'Regulator', computer: 'Dykdator',
        gauges: 'Instrument', cylindersAl: 'Aluminiumflaskor', cylindersSteel: 'Stålflaskor', fins: 'Fenor med hälrem',
        maskSnorkel: 'Mask och snorkel', compass: 'Kompass', torch: 'Dyklampa', ccr: 'Rebreather (CCR)',
      },
      payTitle: 'Betalning',
    },

    // ---------------------------------------------------------------- SERVICE
    service: {
      title: 'Service och reparation av dykutrustning',
      desc: 'Verkstad för regulatorer, BCD, dykdatorer, instrument, våt- och torrdräkter samt flaskor. Seastar Diving, Stockholm.',
      h1: 'Verkstad',
      lead: 'Utrustning som inte fungerar är anledningen till att dyk ställs in. Vi har verkstaden i huset.',
      body: 'Lämna in i butiken under öppettid. Vi tittar på den, hör av oss med vad som behöver göras och vad det kostar innan vi börjar.\n\nServa regulatorn enligt tillverkarens intervall även om den känns bra – en andrasteg som börjar läcka gör det sällan på bryggan.',
      items: {
        regulators: ['Regulatorer', 'Service enligt tillverkarens intervall, läcksökning och justering av andrasteg.'],
        bcd: ['BCD och vingar', 'Inflator, dumpventiler, blåsa och remställ.'],
        computers: ['Dykdatorer', 'Batteribyte och tätningskontroll.'],
        gauges: ['Instrument', 'Manometrar, djupmätare och kompasser.'],
        suits: ['Våt- och torrdräkter', 'Lagning, ventiler, manschetter och dragkedjor.'],
        cylinders: ['Flaskor', 'Ventiler, syrerengöring och kontroll inför provning.'],
      },
    },

    // ---------------------------------------------------------------- GAS
    gas: {
      title: 'Luftfyllning, nitrox och trimix',
      desc: 'Luft, nitrox, trimix, blandgas och CO2-absorbent i Skrubba, Stockholm. Seastar Diving fyller under butikens öppettider.',
      h1: 'Gas och luft',
      lead: 'Vi fyller luft, nitrox och trimix i huset, och säljer CO2-absorbent över disk.',
      body: 'Att behöva planera dykhelgen runt någon annans fyllningstider är ett av de mer onödiga hindren i den här sporten. Därför gör vi det själva.',
      items: {
        air: ['Luft', 'Fyllning under butikens öppettider.'],
        nitrox: ['Nitrox', 'Blandas efter din önskade halt. Nitrox-certifikat krävs.'],
        trimix: ['Trimix', 'Helium i blandningen för djupare dyk. Kom överens med oss i förväg.'],
        mixed: ['Blandgas', 'Övriga blandningar enligt överenskommelse.'],
        sorb: ['CO2-absorbent', 'Sorb till rebreather, över disk.'],
      },
      note: 'Ta med giltigt certifikat för den gas du vill ha, och en flaska med gällande provning.',
    },

    // ---------------------------------------------------------------- ABOUT
    about: {
      title: 'Om Seastar Diving',
      desc: 'PADI 5 Star IDC Dive Center i Skrubba, Stockholm. Tio instruktörer, egen verkstad, gasfyllning och dykbåt.',
      h1: 'Om oss',
      lead: 'Hos oss blir du en stjärna i vattnet, en Seastar helt enkelt.',
      body: 'Vi är ett PADI 5 Star IDC Dive Center i Skrubba i södra Stockholm. Det betyder två saker: dels att vi utbildar hela vägen upp till instruktör, dels att vi bedöms på hur nöjda våra elever faktiskt är – inte bara på att vi följer standarderna.\n\nVi utbildar inom såväl sportdykning som teknisk dykning, och vi hjälper dig med utrustning för alla miljöer. Från shorty i blåa vatten och kritvita stränder i tropikerna till torrdräkt och fantastiska vrakupplevelser i Östersjön.\n\nVår vision är att erbjuda kurser, upplevelser, utrustning och resor i särklass.',
      facilitiesTitle: 'Hos oss finns',
      facilityItems: {
        classroom: ['Kurslokal', 'Egen teorisal i huset.'],
        wifi: ['Fritt wifi', 'För e-learning på plats.'],
        ac: ['Luftkonditionering', 'Även i augusti.'],
        boat: ['Dykbåt', 'För utfärder i skärgården.'],
        parking: ['Parkering', 'Utanför dörren.'],
      },
      langTitle: 'Språk',
      langBody: 'Vi håller kurser på svenska, engelska, danska och norska.',
      teamTitle: 'Teamet',
      teamBody: 'Tio PADI-instruktörer, med kompetens från grundkurs hela vägen upp till instruktörsutbildning och teknisk dykning.',
    },

    // ---------------------------------------------------------------- CONTACT
    contact: {
      title: 'Kontakt och öppettider',
      desc: 'Seastar Diving, Solkraftsvägen 33, 135 70 Stockholm. Telefon +46 72 561 02 40, info@seastardiving.se.',
      h1: 'Kontakt',
      lead: 'Ring, mejla eller kom förbi butiken. Vi svarar hellre på en fråga för mycket än för lite.',
      findUsTitle: 'Hitta hit',
      findUsBody: 'Solkraftsvägen 33 ligger i Skrubba företagsområde i södra Stockholm, strax intill Tyresövägen. Det finns parkering utanför.',
    },

    // ---------------------------------------------------------------- BOOK
    book: {
      title: 'Boka kurs eller ställ en fråga',
      desc: 'Berätta vad du är intresserad av så återkommer vi med datum och pris.',
      h1: 'Boka eller fråga',
      lead: 'Berätta vad du är intresserad av och var du står i dag, så återkommer vi med nästa kursstart och vad det kostar.',
    },

    // ---------------------------------------------------------------- FAQ
    faq: {
      title: 'Vanliga frågor om att lära sig dyka',
      desc: 'Behöver jag kunna simma? Är det inte iskallt? Hur lång tid tar Open Water? Frågor och svar från Seastar Diving i Stockholm.',
      h1: 'Frågor och svar',
      lead: 'Det vi får höra oftast. Hittar du inte ditt svar – ring.',
      items: [
        ['Behöver jag kunna simma?', 'Ja, men inte snabbt. Inför Open Water ska du kunna simma 200 meter utan hjälpmedel (eller 300 meter med mask, snorkel och fenor) och flyta eller trampa vatten i tio minuter. Ingen tid mäts. För ett prova-på räcker det att du är trygg i vatten.'],
        ['Är det inte iskallt?', 'I torrdräkt är du torr och har vanliga kläder under. Det som blir kallt är händer och ansikte. Vi utbildar för de här förhållandena, och torrdräktskursen finns just därför.'],
        ['Hur lång tid tar Open Water-kursen?', 'Teorin läser du som e-learning hemma i din egen takt. Sedan tillkommer bassängpass och fyra dyk i öppet vatten. Hur det fördelas över kalendern beror på när kursen går – hör av dig så berättar vi vad som är inplanerat.'],
        ['Vad kostar det?', 'Priserna varierar med kurs och säsong. Ring 072-561 02 40 eller mejla info@seastardiving.se så får du aktuellt pris för just den kurs du är intresserad av.'],
        ['Behöver jag egen utrustning?', 'Nej. All utrustning ingår under kurs. Många vill däremot köpa egen mask ganska snabbt, eftersom passform är personligt. Resten kan du hyra tills du vet vad du vill ha.'],
        ['Hur gammal måste jag vara?', 'Från 10 år för prova-på och Open Water (Junior). Advanced från 12 år, Rescue från 12 år, Divemaster och instruktör från 18 år.'],
        ['Jag dök för tio år sedan. Måste jag gå om kursen?', 'Nej, certifikatet gäller livet ut. Men har det gått lång tid rekommenderar vi ett uppfräschningspass med instruktör innan du ger dig ut. Hör av dig så lägger vi upp det.'],
        ['Kan jag gå kursen på engelska?', 'Ja. Vi undervisar på svenska, engelska, danska och norska.'],
        ['Kan jag dyka om jag har astma, diabetes eller tar medicin?', 'Ofta ja, men det avgörs inte av oss. Du fyller i en hälsodeklaration innan kursen, och vissa svar kräver läkarintyg från en läkare med dykmedicinsk kompetens. Hör av dig i god tid så hinner det bli klart.'],
        ['Fyller ni luft åt icke-medlemmar?', 'Ja. Vi fyller luft, nitrox och trimix under butikens öppettider. Ta med giltigt certifikat för gasen och en flaska med gällande provning.'],
        ['Servar ni utrustning som inte är köpt hos er?', 'Ja. Lämna in den i butiken så återkommer vi med vad som behöver göras och vad det kostar innan vi börjar.'],
        ['Har ni egen båt?', 'Ja, vi har dykbåt och kör utfärder i Stockholms skärgård under säsong.'],
      ],
    },

    // ---------------------------------------------------------------- 404
    notFound: {
      title: 'Sidan finns inte',
      h1: 'Här var det tomt',
      lead: 'Sidan du letade efter finns inte. Prova kurserna, eller hör av dig så hjälper vi dig hitta rätt.',
    },
  },
};
