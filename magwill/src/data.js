// Magwill AB – all content. Swedish only (the business, the courses and the audience are Swedish).
// Course descriptions and every "Kursinnehåll" list are theirs, copied from magwill.se with typos fixed.
// Anything written by us is marked in CONTENT-NOTES.md.

const site = {
  name: 'Magwill AB',
  shortName: 'Magwill',
  tagline: 'Lär för framtiden',
  domain: 'https://magwill.se',
  phone: '070-320 17 42',
  email: 'info@magwill.se',
  orgnr: '559166-8453',
  street: 'Kvilletorget 19',
  postal: '417 03',
  city: 'Göteborg',
  maps: 'https://www.openstreetmap.org/search?query=Kvilletorget%2019%2C%20417%2003%20G%C3%B6teborg',
  dayTime: ['09:00', '16:00'],
};

// program → display name + one-line pitch (pitch lines: ours, built from their course texts)
const programs = [
  { key: 'excel', name: 'Excel', pitch: 'Från första formeln till Pivottabeller, ekonomimodeller och PowerPivot.' },
  { key: 'word', name: 'Word', pitch: 'Snygga, överskådliga dokument – och mallar som gör jobbet åt dig.' },
  { key: 'powerpoint', name: 'PowerPoint', pitch: 'Presentationer som får fram budskapet till åhörarna.' },
  { key: 'project', name: 'MS Project', pitch: 'Tidplaner, resurser och uppföljning för projektledare.' },
  { key: 'access', name: 'Access', pitch: 'Hantera en befintlig databas eller bygg en egen.' },
  { key: 'data', name: 'Data grund', pitch: 'Windows, filer och mappar och en första titt på Word och Excel.' },
];

const levels = { grund: 'Grund', intensiv: 'Grund, högre tempo', fortsattning: 'Fortsättning', special: 'Fördjupning' };

// legacy = the old URL on magwill.se, used for 301 redirects
const courses = [
  {
    key: 'excelgr', slug: 'excel-grund', legacy: 'excelgr.html', program: 'excel', level: 'grund', days: 2,
    name: 'Excel grund',
    short: 'Behöver du komma igång i Excel för att bli mer effektiv i ditt arbete? Den här utbildningen ger dig allt du behöver för en snabb start.',
    intro: 'Utbildningen lämpar sig för dig som vill få en grundläggande kunskap i Excel. Du lär dig skapa formler och kalkyler och att skapa formler mellan bladflikar. Du lär dig även skapa diagram och att hantera större datamängder med hjälp av sortering och filtrering, och mycket annat.',
    prereq: 'Inga. Du behöver bara vana vid att använda en dator.',
    next: ['excelforts', 'excelek', 'powerpiv'],
    content: ['Skapa serier med autofyll för att effektivisera', 'Skapa formler', 'Skapa kalkyl', 'Autosummering', 'Kopiera formler', 'Absoluta och relativa referenser i formler', 'Ange talformat', 'Ange decimaler och tusentalsavgränsning', 'Formatera celler', 'Formatering med kantlinjer och fyllning', 'Celljusteringar', 'Infoga kommentarer', 'Infoga rader och kolumner', 'Dölja rader och kolumner', 'Viktiga utskriftsinställningar', 'Hantera bladflikar', 'Namnge och flytta bladflikar', 'Gruppera blad', '3D-kalkyl (formler mellan bladflikar)', 'Skapa diagram', 'Redigera diagram', 'Formatera diagram', 'Utskrift av diagram', 'Exportera diagram till PowerPoint', 'Vanliga funktioner som Medel, Max, Min och Antal', 'Bra tips när man arbetar med listor', 'Låsa fönsterrutor', 'Utskriftsrubriker', 'Sortera listor i stigande och fallande ordning', 'Filter för att göra urval i listor', 'Skapa tabell i listor och dess fördelar', 'Skydda blad', 'Bästa tipsen', 'Praktisk övning'],
  },
  {
    key: 'excelintensiv', slug: 'excel-intensiv', legacy: 'excelintensiv.html', program: 'excel', level: 'intensiv', days: 1,
    name: 'Excel intensiv',
    short: 'En grundutbildning i högre tempo för dig som har arbetat en del i Excel och är självlärd.',
    intro: 'Det här är en grundutbildning med ett högre tempo för dig som har arbetat en del i Excel och är självlärd. Du får de rätta tipsen för att bli mer effektiv i ditt arbete. Efter den här utbildningen kan du bygga vidare med Excel fortsättning.',
    prereq: 'Du har arbetat en del i Excel på egen hand.',
    next: ['excelforts', 'excelek'],
    content: ['Autofyll för att effektivisera', 'Skapa kalkyl', 'Skapa formler och använda Autosumma', 'Absoluta och relativa referenser i formler', 'Formatera med kantlinjer och fyllningar', 'Ange talformat', 'Tusentalsavgränsningar, decimaler, valutor', 'Formatera celler', 'Hantera texter i Excel', 'Datum och tider', 'Text och celljustering', 'Centrering över kolumner', 'Infoga kommentarer', 'Viktiga utskriftsinställningar', 'Formler mellan bladflikar', 'Grunderna i diagram', 'Vanliga funktionsformler: Medel, Max, Min och Antal', 'Bra tips när man arbetar med listor', 'Låsa fönsterrutor', 'Utskriftsrubriker', 'Sortera listor i stigande och fallande ordning', 'Autofilter för att göra urval i listor', 'Skapa tabell och dess fördelar', 'Söka och ersätta data i stora listor', 'Skydda blad', 'Bästa tipsen', 'Bra kortkommandon', 'Praktisk övning'],
  },
  {
    key: 'excelforts', slug: 'excel-fortsattning', legacy: 'excelforts.html', program: 'excel', level: 'fortsattning', days: 2,
    name: 'Excel fortsättning',
    short: 'Pivottabeller, Om, SummaOm, Letarad och länkningar. Utbildningen som gör dig till företagets Excelexpert.',
    intro: 'Utbildningen passar dig som kan grunderna i Excel och behöver bygga på dina kunskaper ytterligare. Du lär dig villkorsstyrd formatering, funktionsformlerna Om, SummaOm, Letarad, datumfunktioner och andra funktioner som är viktiga att kunna. Du lär dig även Pivottabeller för att sammanställa stora datamängder, och mycket annat.',
    prereq: 'Du kan grunderna i Excel, motsvarande Excel grund eller Excel intensiv.',
    next: ['excelek', 'powerpiv'],
    content: ['Bra tips och kortkommandon för att arbeta mer effektivt', 'Skapa egna format', 'Villkorsstyrd formatering för att färga data som avviker', 'Klistra in special', 'Diagram med sekundär axel', 'Diagrammallar', 'Funktionsformler och deras logik', 'Om, SummaOm, Letarad, datumfunktioner, Sammanfoga med flera', 'Kombinera funktionsformler med varandra', 'Fler funktionsformler som är viktiga att kunna', 'Länkning mellan arbetsböcker', 'Länkning av data till PowerPoint', 'Jämföra arbetsböcker sida vid sida', 'Blad sida vid sida på skärmen för att jämföra data', 'Hyperlänkar för att skapa klickbara genvägar', 'Formelgranskning', 'Visa formler i cellerna', 'Spåra över- och underordnade celler', 'Namnge celler', 'Pivottabeller för att sammanställa och analysera data', 'Pivotdiagram', 'Dela upp data som ligger i samma kolumn', 'Snabbfyllning för att effektivisera arbetet i listor', 'Import av data', 'Övriga tips kring större datamängder', 'Dataverifiering för att säkerställa inmatningar i celler', 'Skapa listrutor och rullgardinsmenyer', 'Skydda blad', 'Skydda arbetsbok', 'Vad är ett makro?', 'Spela in makro', 'Skapa knappar till makron', 'Bästa tipsen', 'Praktisk övning'],
  },
  {
    key: 'excelek', slug: 'excel-for-ekonomer', legacy: 'excelek.html', program: 'excel', level: 'special', days: 2,
    name: 'Excel för ekonomer',
    short: 'Arbetar du med ekonomi och behöver spetsa dina Excelkunskaper? En fortsättningskurs med Pivottabeller och länkade arbetsböcker.',
    intro: 'Den här utbildningen är en fortsättningskurs som är specialanpassad för dig som arbetar med ekonomi. Jobbar du med ekonomi och behöver sammanställa och analysera data med hjälp av Pivottabeller är det här den perfekta kursen. Du lär dig även länka information mellan blad och dokument, och mycket annat.',
    prereq: 'Du kan grunderna i Excel och arbetar med ekonomi.',
    next: ['powerpiv', 'excelforts'],
    content: ['Bra tips och kortkommandon för att effektivisera', 'Skapa specialformat', 'Villkor i format', 'Se värden som avviker med villkorsstyrd formatering', 'Klistra in special', 'Sekundär axel i diagram', 'Skapa diagrammallar', 'Funktionsformler och deras logik', 'Ekonomiska funktioner', 'Om, SummaOm, Letarad, Sammanfoga, datumfunktioner med flera', 'Viktiga funktionsformler att kunna', 'Kapsla flera funktionsformler i varandra', 'Slå ihop kolumner med formler och funktioner', 'Länkning av data mellan blad och arbetsböcker', 'Arbetsböcker sida vid sida på skärmen', 'Blad sida vid sida på skärmen för att jämföra data', 'Länkning av data mellan Officeprogram', 'Spåra formler och se vart de leder', 'Namnge celler och områden', 'Sammanställa data med Pivottabeller', 'Beräkningar i Pivottabeller', 'Övriga tips i Pivottabeller', 'Pivotdiagram', 'Separera importerad data korrekt', 'Snabbfyllning för att effektivisera arbetet i listor', 'Import av data', 'Bra tips när man arbetar med stora mängder data', 'Dataverifiering', 'Skapa listrutor', 'Skydda blad', 'Skydda arbetsbok', 'Vad är ett makro?', 'Spela in makron', 'Skapa knappar till makron', 'Bästa tipsen', 'Praktisk övning'],
  },
  {
    key: 'powerpiv', slug: 'excel-powerpivot', legacy: 'powerpiv.html', program: 'excel', level: 'special', days: 1,
    name: 'Excel PowerPivot',
    short: 'Analysera information från flera tabeller med PowerPivot och bygg snygga, dynamiska rapporter.',
    intro: 'Den här kursen är för dig som vill kunna analysera information från flera tabeller med hjälp av PowerPivot och skapa dynamiska rapporter. PowerPivot i Excel är ett utmärkt verktyg för att sammanföra information från flera kalkylblad. I stället för att göra det med SQL-syntax gör PowerPivot jobbet åt dig.\n\nPowerPivot består av en databas som kan hantera flera relaterade tabeller och en kraftfull rapportdel.',
    prereq: 'Kunskaper motsvarande Excel grund.',
    next: ['excelforts', 'excelek'],
    content: ['Skillnader mellan vanliga Pivottabeller och PowerPivot', 'Genomgång av databasstruktur', 'Tips kring vanlig listhantering', 'Skapa tabeller', 'Namnge tabeller', 'Separera importerad data korrekt', 'Vanliga Pivottabeller', 'Gruppera Pivottabeller', 'Beräkningar i Pivottabeller', 'Arbeta i PowerPivot-fönstret', 'Relationer mellan tabeller', 'Primärnycklar', 'Relationstyper', 'Import från Access', 'Import från textfiler', 'Filter och utsnitt', 'Pivotdiagram', 'DAX-formler', 'Beräknade mått', 'Beräknade kolumner', 'Funktioner', 'Grupperingar', 'IF och kapslade IF', 'RELATED', 'Datumfunktioner', 'Procentberäkning', 'SUMX, COUNTROWS och COUNTBLANK', 'Textfunktioner', 'KPI:er', 'Bästa tipsen', 'Praktisk övning'],
  },
  {
    key: 'wordgr', slug: 'word-grund', legacy: 'wordgr.html', program: 'word', level: 'grund', days: 1,
    name: 'Word grund',
    short: 'De rätta tipsen i Word för indrag, tabbar och tabeller. Snygga och överskådliga dokument från start.',
    intro: 'Den här kursen lämpar sig för dig som behöver lära dig skapa snygga och överskådliga dokument i Word. Du lär dig hantera text med tabbar och indrag och att skapa snygga tabeller. Du lär dig även hur man infogar bilder i ett dokument och hur du placerar bilden på ett bra sätt. Efter utbildningen kommer du känna dig mycket säkrare i programmet.',
    prereq: 'Inga. Du behöver bara vana vid att använda en dator.',
    next: ['wordfk', 'powpoint'],
    content: ['De olika vyerna i Word', 'Skillnaden mellan radbrytningar och styckebrytningar', 'Visa dolda tecken', 'Smarta markeringstekniker', 'Tips kring att klippa ut, kopiera och klistra in text', 'Teckenformatering', 'Styckeformatering', 'Indrag av texter och stycken', 'Radavstånd i stycken', 'Kantlinjer och fyllningar', 'Infoga symboler och specialtecken', 'Kopiera format', 'Sök och ersätt text', 'Rättstavning', 'Autokorrigering', 'Autotext för avslutningsfraser', 'Arbeta med tabbar för att ställa upp texter', 'Punktlistor och numrerade listor', 'Skapa tabeller', 'Marginalinställningar', 'Automatiska sidbrytningar', 'Infoga manuella sidbrytningar', 'Sidhuvud och sidfot', 'Automatisk sidnumrering', 'Infoga bilder i dokument', 'Figursätta bild i dokument', 'Redigera bild i Word', 'Få text och bild att samverka', 'Skapa vattenstämpel i dokument', 'Introduktion till formatmallar', 'Viktiga programinställningar', 'Bästa tipsen', 'Praktisk övning'],
  },
  {
    key: 'wordfk', slug: 'word-fortsattning', legacy: 'wordfk.html', program: 'word', level: 'fortsattning', days: 1,
    name: 'Word fortsättning',
    short: 'Avsnitt, formatmallar och dokumentmallar i Word, så att dokumenten nästan skriver sig själva.',
    intro: 'Du arbetar i Word och behöver bli mer effektiv med tabeller och listor. Du lär dig även hur du arbetar med avsnittsbrytningar och hur du skapar formatmallar och dokumentmallar för att automatisera ditt arbete.',
    prereq: 'Du kan grunderna i Word, motsvarande Word grund.',
    next: ['wordgr', 'powpoint'],
    content: ['Bra tips och kortkommandon som effektiviserar', 'Autokorrigering', 'Skapa autotexter', 'Undernivålistor', 'Mer om tabeller', 'Arbeta med avsnittsbrytningar', 'Olika sidhuvuden och sidfötter', 'Blanda stående och liggande sidor', 'Skapa spalter', 'Länka data från Excel till Word', 'Skapa hyperlänkar', 'Bokmärken', 'Koppla dokument', 'Hantera bilder i dokument', 'Figursätta bilder', 'Formatmallar', 'Skapa teckenformatmallar', 'Skapa styckeformatmallar', 'Skapa listformatmallar', 'Skapa tabellformatmallar', 'Kopiera formatmallar mellan dokument', 'Skapa innehållsförteckningar och index', 'Skapa dokumentmallar', 'Dokumentmallars sökvägar', 'Infoga fältkoder i dokumentmall', 'Skapa formulärfält i mallar', 'Skapa vattenstämpel i dokument', 'Granska dokument', 'Infoga kommentarer', 'Spåra ändringar i dokument', 'Skydda dokument', 'Vad är ett makro?', 'Spela in enklare makron', 'Skapa knappar till makron', 'Bästa tipsen', 'Praktisk övning'],
  },
  {
    key: 'powpoint', slug: 'powerpoint', legacy: 'powpoint.html', program: 'powerpoint', level: 'grund', days: 1,
    name: 'PowerPoint',
    short: 'Lär dig skapa snygga och tilltalande presentationer som får fram viktiga budskap till dina åhörare.',
    intro: 'Den här kursen lämpar sig för dig som behöver skapa snygga och tilltalande presentationer för att få fram viktiga budskap till dina åhörare. Du lär dig även hantera text, diagram och tabeller, skapa mallar, animera presentationen och mycket annat.',
    prereq: 'Inga. Du behöver bara vana vid att använda en dator.',
    next: ['wordgr', 'excelgr'],
    content: ['Designtips i presentationer', 'Att tänka på', 'Skapa layout', 'Platshållare och textrutor', 'Skriva text i layout', 'Punktlistor och numrerade listor', 'Undernivålistor', 'Olika vyer i PowerPoint', 'Figurverktygen', 'Fyllningar och konturer', 'Sortera och gruppera objekt', 'Justera objekt', 'Infoga bilder och anpassa dem i presentationen', 'SmartArt och organisationsscheman', 'Skapa diagram', 'Importera diagram från Excel', 'Skapa tabeller', 'Bildbakgrunder och mallar', 'Spara som mall', 'Smarta bildspelstekniker', 'Tidsinställningar av bildspel', 'Övergångar i bildspel', 'Animeringar', 'Vilka typer av animeringar som är lämpliga att använda', 'Hyperlänkar', 'Skapa klickbara områden i bildspel', 'Länka Exceldokument till PowerPoint', 'Anteckningssidor', 'Utskrifter av presentation', 'Åhörarkopior', 'Exportera presentation som bildspel', 'Viktiga programinställningar', 'Bästa tipsen', 'Praktisk övning'],
  },
  {
    key: 'projectgr', slug: 'ms-project-grund', legacy: 'projectgr.html', program: 'project', level: 'grund', days: 2,
    name: 'MS Project grund',
    short: 'Arbetar du som projektledare och behöver skapa övergripande projekttidplaner för dig och dina medarbetare? Då är det här utbildningen.',
    intro: 'Den här utbildningen ger dig grunderna i Project. Du lär dig skapa övergripande projekttidplaner och planera resurser. Du lär dig också skapa en originalplan och uppdatera planen med verkligt utfall. Därefter lär du dig jämföra originalplanen med det verkliga utfallet och skapa snygga rapporter kring resultatet.',
    prereq: 'Inga förkunskaper i Project krävs.',
    next: ['projectfk', 'excelgr'],
    content: ['Viktiga programinställningar', 'Vyerna i Project', 'Skapa projekt och ange projektstart', 'Ange arbetstid i projektkalender', 'Lägga upp aktiviteter och varaktighet', 'Ange milstolpar', 'Schemaläggning av aktiviteter', 'Länkning och beroenden mellan aktiviteter', 'Manuella placeringar av aktiviteter', 'Aktivitetsvillkor och tidsgränser', 'Anpassa tidskalan', 'Anteckningar på aktivitet', 'Återkommande aktiviteter', 'Gruppera aktiviteter i olika faser', 'Utskrifter av projektplan', 'Anpassa utskrifter', 'Resursplanering', 'Resurskalendrar', 'Tilldela resurser på aktiviteter', 'Insatsberoende tilldelning', 'Variablerna arbete, varaktighet och enhet', 'Återstående tillgänglighet av resurs', 'Kontrollera överbeläggningar av resurser', 'Kostnader och ekonomi i projektet', 'Delprojekt och huvudprojektplan', 'Uppföljning av projekt', 'Ange originalplan', 'Uppdatera tidplan med verkligt utfall', 'Analys av avvikelser', 'Filter och autofilter', 'Skapa snygga rapporter', 'Formatering av tidplan', 'Skapa mallar för att effektivisera', 'Övriga vyer som är viktiga att känna till', 'Bästa tipsen', 'Praktisk övning'],
  },
  {
    key: 'projectfk', slug: 'ms-project-fortsattning', legacy: 'projectfk.html', program: 'project', level: 'fortsattning', days: 1,
    name: 'MS Project fortsättning',
    short: 'Fördjupad resursplanering och uppföljning, egna vyer, resurspooler och masterprojektfiler.',
    intro: 'Du behöver fördjupade kunskaper inom resursplanering och uppföljning och behöver anpassa Project med egna vyer för att presentera projektets information på bästa sätt. Du lär dig även konsolidera projekt i en så kallad masterprojektfil, och du får kunskap om hur en resurspool fungerar.',
    prereq: 'Du kan grunderna i Project, motsvarande MS Project grund.',
    next: ['projectgr', 'excelforts'],
    content: ['Mer om resursplanering', 'Insatsberoende schemaläggning av resurs', 'Aktivitetstyperna arbete, varaktighet och enhet', 'Tilldela resurser med lämpliga aktivitetstyper', 'Aktivitetsanvändning och resursanvändning', 'Detaljplanering', 'Hantera överbeläggning', 'Variabel kostnad för resurs', 'Ange aktivitetskostnader', 'Fasta kostnader', 'Skapa olika kostnadstabeller', 'Resursutjämning', 'Skapa resurspool', 'Kopplingen mellan resurspool och projektfil', 'Huvudprojekt och delprojekt', 'Konsolidera projekt', 'Skapa aktivitetskalender', 'Mer om uppföljning', 'Originalplan och interimsplaner', 'Aktivitetsbaserad uppföljning', 'Resursbaserad uppföljning', 'Rapportering', 'Formatering', 'Skapa projektmallar för att effektivisera', 'Anpassa egna fält och beräkningar', 'Skapa egna tabeller och vyer', 'Exportera till Excel', 'Länkning mellan Excel och Project', 'Skydda projektplan', 'Spela in makro', 'Skapa knappar till makron', 'Bästa tipsen', 'Praktisk övning'],
  },
  {
    key: 'accessgrund', slug: 'access-grund', legacy: 'accessgrund.html', program: 'access', level: 'grund', days: 2,
    name: 'Access grund',
    short: 'Hantera befintliga databaser och bygg en egen: tabeller, relationer, frågor, formulär och rapporter.',
    intro: 'Det här är en grundutbildning i Access där du lär dig både att hantera befintliga databaser och att bygga en egen. Du får grundläggande kunskaper om hur du bygger databaser med en och flera tabeller. Du lär dig skapa relationer mellan tabeller och frågor för att söka ut information på bästa sätt. Du lär dig även skapa snygga formulär och rapporter, och mycket annat.',
    prereq: 'Inga förkunskaper i Access krävs. Vana vid Excel är en fördel.',
    next: ['accessforts', 'powerpiv'],
    content: ['Grunderna kring databaser', 'Fördelen med Access i stället för Excel', 'Objekttyper i Access', 'Planering av databasstruktur', 'Skapa databas', 'Skapa tabeller med fält och primärnycklar', 'Ange datatyper i tabeller', 'Indatamasker', 'Verifiera data', 'Säkerställa inmatning i databas', 'Ange standardvärden i tabeller', 'Relationer mellan tabeller', 'Registrera data', 'Uppslagskolumner och listrutor', 'Import av Excelfiler', 'Import av textfiler', 'Export av data', 'Filtrering och sökning av data', 'Spara filter som fråga', 'Skapa urvalsfrågor', 'Villkor i frågor', 'Parameterfrågor', 'Övriga tips kring frågor', 'Skapa snygga formulär', 'Designa och anpassa formulär', 'Ange ett startformulär', 'Skapa snygga rapporter', 'Designa och anpassa rapporter', 'Komprimera databas', 'Bästa tipsen', 'Praktisk övning'],
  },
  {
    key: 'accessforts', slug: 'access-fortsattning', legacy: 'accessforts.html', program: 'access', level: 'fortsattning', days: 1,
    name: 'Access fortsättning',
    short: 'Referensintegritet, avancerade frågor, huvud- och underformulär, makron och en introduktion till VBA.',
    intro: 'Det här är en utbildning för dig som vill fördjupa dig och lära dig mer avancerade funktioner i Access. Du lär dig mer om relationer med referensintegritet, mer om frågor och formulär och att skapa makron för att automatisera din databas, och mycket annat.',
    prereq: 'Du kan grunderna i Access, motsvarande Access grund.',
    next: ['accessgrund', 'powerpiv'],
    content: ['Normalisering av databas', 'Designa databas', 'Mer om relationer', 'Referensintegritet', 'Uppslagskolumner och listrutor', 'Länkning av tabeller', 'Mer om frågor', 'Fler uttryck i frågor', 'Parameterfrågor', 'Beräkningar i frågor', 'Gruppera frågor', 'Funktioner i frågor', 'Uppdateringsfråga', 'Borttagningsfråga', 'Tilläggsfråga', 'Skapa tabellfråga', 'Skapa huvud- och underformulär', 'Skapa knappar i formulär', 'Beräkningar i formulär', 'Övriga tips i formulär', 'Mer om rapporter', 'Skapa makron', 'Händelsemakron och villkor i makron', 'Knappar till makron', 'Konvertera makron till VBA', 'Introduktion till VBA', 'Säkerhet i databas', 'Komprimering av databas', 'Konvertering av databas', 'Bästa tipsen', 'Praktisk övning'],
  },
  {
    key: 'datagr', slug: 'data-grund', legacy: 'datagr.html', program: 'data', level: 'grund', days: 1,
    name: 'Data grund',
    short: 'För dig som är ovan datoranvändare: Windows, filer och mappar, och en introduktion till Word och Excel.',
    intro: 'Den här utbildningen lämpar sig för dig som är en ovan datoranvändare och behöver grundläggande kunskaper om Windows och hur filer och mappar fungerar. Du lär dig strukturen i Utforskaren och hur du flyttar och kopierar mellan mappar. Du får även en introduktion med grundläggande moment i Word och Excel. Efter kursen kommer du vara betydligt effektivare och känna dig säkrare i ditt arbete.',
    prereq: 'Inga. Kursen är gjord för dig som är ny vid datorn.',
    next: ['wordgr', 'excelgr'],
    content: ['Grunderna i Windows', 'Skapa mappar och filer', 'Flytta filer mellan mappar', 'Kopiera filer mellan mappar', 'Skapa genvägar', 'Bra kortkommandon som förenklar', 'Introduktion till Word', 'Skriva och redigera text i Word', 'Använda stavningskontrollen', 'Formatering av text i Word', 'Bra kortkommandon i Word', 'Indrag och radavstånd i Word', 'Introduktion till Excel', 'Autofyll i Excel', 'Skapa enkla formler i Excel', 'Autosummering i Excel', 'Ange talformat i Excel', 'Skapa en snygg kalkyl i Excel', 'Formatera med kantlinjer och färg', 'Infoga kommentarer i Excel', 'Anpassa kalkylen för utskrift', 'Praktisk övning', 'Bästa tipsen'],
  },
];

// "Vilken Excelkurs?" – the routing is theirs (each course text names who it is for); the phrasing is ours.
const excelGuide = [
  ['Jag har knappt öppnat Excel', 'excelgr'],
  ['Jag är självlärd och vill få ordning på grunderna', 'excelintensiv'],
  ['Jag kan grunderna och vill lära mig Letarad och Pivottabeller', 'excelforts'],
  ['Jag jobbar med ekonomi och sammanställer mycket data', 'excelek'],
  ['Jag behöver analysera data från flera tabeller', 'powerpiv'],
];

// Konsulttjänster – the list is verbatim from konsult.html
const consulting = ['Behovsanalys', 'Företagsanpassad utbildning', 'Dokumentation', 'Konsultstöd och individuell utbildning', 'Mallar i Microsoft Office', 'Databasutveckling i Access', 'Kalkylmodeller i Excel', 'VBA-lösningar i Excel, Access och Word', 'Projektmodeller i MS Project', 'Projektledning i Microsoft Project'];

// Arbeta med oss – verbatim from arb_med_oss.html
const hiring = ['MS Project', 'Projektmetodik', 'Microsoft Office', 'Excel för ekonomer', 'Excel PowerPivot', 'VBA-programmering i Microsoft Office', 'Databasutveckling i SQL och Access', 'Webbutveckling', 'HTML och CSS', 'Webbdesign', 'SharePoint'];

// Old URL → new path (301). The three PDFs were directions to course centres that no longer exist.
const redirects = [
  ['/default.html', '/'], ['/index.html', '/'],
  ['/utb.html', '/utbildningar/'],
  ['/konsult.html', '/konsulttjanster/'],
  ['/omoss.html', '/om-oss/'],
  ['/arb_med_oss.html', '/jobba-med-oss/'],
  ['/kontakt.html', '/kontakt/'],
  ['/vagbeskrivningGbg%5B1%5D.pdf', '/kontakt/'],
  ['/vagbeskrivningSthlm%5B1%5D.pdf', '/kontakt/'],
  ['/vagbeskrivning_kista.pdf', '/kontakt/'],
  ...courses.map(c => ['/' + c.legacy, `/utbildningar/${c.slug}/`]),
];

module.exports = { site, programs, levels, courses, excelGuide, consulting, hiring, redirects };
