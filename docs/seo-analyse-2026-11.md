# SEO-analyse en AI-vindbaarheid Redwoods People Services

Datum: 2 november 2026, de dag dat www.redwoodspeopleservices.nl live ging op de nieuwe site.
Zoekvragen die centraal staan: relatietherapie, therapie en psychotherapie in combinatie met Arnhem, Velp, Rheden en Rozendaal.

## 1. Samenvatting

- De nieuwe site is technisch op orde: één H1 per pagina, titels en beschrijvingen op elke pagina, schone sitemap, redirects van de oude URL's, JSON-LD voor praktijk, diensten, team, blog, event en FAQ.
- Google heeft de nieuwe site nog niet opnieuw gecrawld. De sitelinks onder het merk tonen nog de oude WordPress-teksten (christelijke psychotherapie, webshop, €115). Dat lost zich op met Search Console en tijd, maar het hoort nu bovenaan de lijst.
- Voor de kernzoekvragen met Arnhem of Velp staat Redwoods niet in de top 30. Voor Rozendaal staat de praktijk in het lokale kaartblok en via eft.nl. De concurrentie wint met drie dingen die Redwoods mist: een pagina per plaats, veel Google-reviews en een vermelding op eft.nl onder de plaats Arnhem.
- Het Google Bedrijfsprofiel bestaat (4,6 uit 7 reviews) maar heeft de categorie Psycholoog, een verouderde beschrijving en weinig reviews vergeleken met concurrenten (BM relatietherapie 18, Praktijk Pur Sang 10, Verbonden Hart 11).
- De gegevens van Redwoods in directories spreken elkaar tegen. Op eft.nl staat Michelle van Dusseldorp op Emmastraat 7 in Velp, bij VIT op Mosterdhof 48 in Westervoort; eft.nl noemt € 180 en € 175 per sessie waar de site € 215 zegt. Zulke verschillen kosten lokale ranking en vertrouwen.
- Op eft.nl staat geen enkele Redwoods-therapeut als EFT-Registertherapeut, alleen als "aanvullend getraind". In de AI-test voor relatietherapie was dat het zwaarste selectiecriterium; het hield Redwoods uit de top 5.
- Voor AI-assistenten geldt: zonder webtoegang kent geen enkel model Redwoods, en met webtoegang komt de praktijk alleen op een shortlist als hij in de bronnen staat die de assistent als eerste opent (eft.nl, Google-resultaten, directories met reviews). Zie hoofdstuk 5.

## 2. Wat er nu goed staat (nieuwe site)

Gecontroleerd op alle 30 URL's uit de sitemap.

| Onderdeel | Stand |
|---|---|
| Titels en meta descriptions | Op elke pagina aanwezig en uniek |
| H1 | Precies één per pagina |
| Taal en canonical | `lang="nl"`, canonical op www |
| Structured data | LocalBusiness/MedicalBusiness met adres, geo, openingstijden, werkgebied en sameAs; Service en FAQPage op dienstpagina's; Person op teamprofielen; BlogPosting; Event met Offer voor Houd me Vast |
| Sitemap en robots | sitemap-index.xml, robots.txt sluit alleen /api/ en /keystatic/ uit |
| Redirects | Oude dienst-, programma- en blog-URL's en de webshop sturen met 301 door |
| Https en www | Certificaat actief, http naar https, kale domein naar www |
| Laadsnelheid | Statische HTML met WebP-afbeeldingen en eigen fonts; PageSpeed kon vandaag niet draaien (quotum), Speed Insights van Vercel loopt nu mee |

## 3. Waar het beter kan (eigen site)

### 3.1 Hoog: Google opnieuw laten kijken

De zoekopdracht `site:redwoodspeopleservices.nl` toont nog /webshop/, /natuurcoaching/, /2025/08/, /tag/zingeving/ en /author/… met oude teksten. De sitelinks bij een merkzoekopdracht tonen "christelijke psychotherapie, gebaseerd op het bijbels mensbeeld" en de webshop.

1. Search Console: eigendom claimen voor het domein (DNS-record of via het bestaande account), de sitemap indienen, de homepage en de vijf belangrijkste pagina's opnieuw laten indexeren.
2. De archief-URL's van WordPress geven nu 404: `/2025/08/`, `/tag/…`, `/author/…`, `/category/…`, `/feed/`. Die kunnen met vier regels in de redirect-configuratie naar /blog/ worden gestuurd, zodat de opgebouwde waarde niet verdampt.
3. Spam-URL's uit de hack die nog in de index staan via Search Console als verwijderd melden.

### 3.2 Hoog: een pagina per plaats

Alle concurrenten die ranken voor "relatietherapie Arnhem" of "relatietherapie Velp" hebben een pagina met precies die titel. Systeemtherapie Van Velzen heeft er zelfs één per dorp (/arnhem, /velp, /rozendaal) en staat daarmee overal op pagina 1. Redwoods heeft nu alleen "Relatietherapie (EFT) in Rozendaal bij Arnhem".

Voorstel: vier landingspagina's, elk met eigen inhoud (geen kopie van elkaar):

- /relatietherapie-arnhem/ : EFT-relatietherapie voor stellen uit Arnhem, 10 minuten vanaf Arnhem-Noord en Velperpoort, bus 8, parkeren voor de deur, de therapeuten, tarief, FAQ. Doorverwijzing naar /diensten/relatietherapie/ en /houd-me-vast/.
- /relatietherapie-velp/ : idem voor Velp en Rozendaal (Velp grenst aan Rozendaal, de praktijk ligt op loopafstand van Velp-Noord).
- /psychotherapie-arnhem/ : integratieve psychotherapie, vergoeding uit de aanvullende verzekering, geen verwijzing en geen wachtlijst, verschil met GGZ.
- /therapie-rheden-rozendaal/ : voor de gemeente Rheden (Velp, Rheden, De Steeg, Dieren) met de nadruk op dichtbij en snel terecht kunnen.

De plaatsnaam hoort in title, H1, eerste alinea, een tussenkop en de alt-tekst van een foto. Rheden en Oosterbeek komen nu op geen enkele pagina in de zichtbare tekst voor, alleen in de JSON-LD.

### 3.3 Midden: titels en beschrijvingen inkorten

Google kapt titels af rond 60 tekens en beschrijvingen rond 155.

| Pagina | Titel (tekens) | Voorstel |
|---|---|---|
| Homepage | 67 | "Psychotherapie en relatietherapie in Rozendaal bij Arnhem" (58) |
| Relatietherapie | 72 | "EFT-relatietherapie Arnhem en Velp, Redwoods Rozendaal" (56) |
| Rouw en Verlies | 81 | "Rouwgroep Rouw en Verlies in Rozendaal bij Arnhem" (49) |
| Greenwoods | 84 | "Greenwoods: retraites en spiritual direction" (44) |
| Blogartikel De leegte bewoond | 117 | Titel van het artikel inkorten of het merk weglaten |

De teamprofielen hebben beschrijvingen van 210 tot 257 tekens; de eerste zin is voldoende. De beschrijvingen van vijf blogartikelen beginnen met een citaat; beter is één zin die zegt waar het artikel over gaat.

### 3.4 Midden: alt-teksten

Op de homepage missen 8 van de 11 afbeeldingen een alt-tekst, op de teampagina 7 van de 8 en op Houd me Vast 6 van de 7. Dat zijn de foto's die via de Image-component van Astro worden geplaatst zonder alt. Elke teamfoto krijgt de naam en functie, elke sfeerfoto een korte beschrijving met de locatie waar dat klopt ("Praktijkruimte van Redwoods aan de Rosendaalselaan in Rozendaal").

### 3.5 Midden: bewijs en reviews op de site

Geen enkele pagina toont beoordelingen, terwijl concurrenten hun Google-score prominent tonen. Voorstel: een blok "Wat cliënten zeggen" met drie geanonimiseerde quotes en een link naar het Google Bedrijfsprofiel, plus het aantal jaren (sinds 2000) en de registraties (VIT, RBCZ, SCAG, LVSC, EFT-register) als logo's op de homepage en de dienstpagina's. Laat `aggregateRating` in de JSON-LD weg zolang de reviews niet op de pagina zelf staan; Google staat dat alleen toe als de beoordelingen zichtbaar zijn.

### 3.6 Laag: interne links en teksten

- De H1 van de homepage is een slogan. Dat mag, maar de eerste alinea eronder moet dan wel binnen twee zinnen zeggen: psychotherapie en EFT-relatietherapie, Rozendaal, Arnhem en Velp. Dat staat er nu.
- Vanuit blogartikelen wordt zelden naar de dienstpagina gelinkt. Een vaste afsluiter per artikel ("Herken je dit? Lees over relatietherapie bij Redwoods") helpt zowel lezers als Google.
- "Psychosociale therapie" en "integratieve therapie" zijn de termen waarop vergoeding wordt gezocht ("psychosociale therapie Velp vergoeding"). Die termen horen op de tarievenpagina en de psychotherapiepagina, inclusief de prestatiecode 24500 die nu alleen op de oude site stond.

## 4. Buiten de eigen site

### 4.1 Google Bedrijfsprofiel

Gevonden als "Redwoods People Services B.V.", categorie Psycholoog, 4,6 uit 7 reviews, openingstijden en adres kloppen. Verbeterpunten:

- Hoofdcategorie wijzigen naar Psychotherapeut en als extra categorieën Relatietherapeut (Google noemt dit "Huwelijks- of relatietherapeut"), Coach en Supervisor toevoegen. Voor "relatietherapie Velp" staan nu alleen profielen met de categorie Gezinstherapie of Psycholoog in het kaartblok.
- De beschrijving herschrijven in lijn met de nieuwe site (nu nog de oude tekst over de bomen en "jouw team, jouw gezin, jouw bedrijf").
- Diensten toevoegen als aparte items (Psychotherapie, EFT-relatietherapie, Coaching, Supervisie, Houd me Vast relatieweekend, Rouwgroep).
- Reviews: van 7 naar 25 of meer. Vraag na een afgerond traject per mail om een review met een directe link; bij een therapiepraktijk kan dat anoniem en met de nadruk op de ervaring met de praktijk, niet met de behandeling. Concurrenten in het kaartblok voor Velp en Rheden hebben 10 tot 18 reviews.
- Foto's van het pand en de praktijkruimtes uploaden en maandelijks een bericht plaatsen (nieuwe data Houd me Vast, een blogartikel).

### 4.2 Directories en registers: gegevens gelijktrekken

| Bron | Stand | Actie |
|---|---|---|
| eft.nl | Cris en Joost onder Rozendaal; Michelle onder Velp op Emmastraat 7; tarieven € 180/€ 175 i.p.v. € 215; niemand als Registertherapeut | Adressen en tarieven gelijktrekken (of de Velpse praktijkruimte ook op de site zetten als die nog bestaat); Joke, Mariëlle en Jochem toevoegen; bij elk profiel beschikbaarheid en werkgebied Arnhem en Velp invullen, want eft.nl rankt voor elke EFT-zoekvraag; op termijn het Registertherapeutschap halen voor minstens één of twee therapeuten |
| eft.nl Houd me Vast-bijeenkomsten | Niet gevonden | De weekenden aanmelden bij Stichting EFT Nederland (info@eft.nl), dit is de landelijke lijst waar stellen en assistenten kijken |
| VIT | Cris op Rosendaalselaan 30, Michelle op Mosterdhof 48 Westervoort | Adres van Michelle corrigeren, overige therapeuten toevoegen |
| RBCZ, SCAG, LVSC | Niet gecontroleerd vanaf buiten | Zelfde adres en praktijknaam overal |
| Zorgkaart Nederland | Geen vermelding | Praktijk aanmelden als psychotherapiepraktijk; Zorgkaart staat op positie 1 voor "psychotherapie Velp" en "psychotherapie Arnhem" |
| vind-een-therapeut.nl | Alleen Joost | Praktijkprofiel plus alle therapeuten |
| Trustoo | Niet aanwezig | Trustoo stond in beide AI-tests bovenaan als eerste bron en vult het kaartblok-achtige "Top 10" voor Arnhem, Velp, Rheden en Rozendaal; de lokale lijsten bestaan uit zes tot zeven praktijken, vrijwel allemaal uit Arnhem, Nijmegen of Ede, dus Redwoods zou als echt lokale praktijk met reviews hoog eindigen |
| relatietherapeuten.net, therapiepsycholoog.com, therapeutenkompas, therapeutvinden.com, kjra.nl, Psyned | Niet aanwezig | Deze directories vullen pagina 1 voor "therapeut Rheden Rozendaal" en tonen praktijken binnen 30 km van Velp; een vermelding levert direct zichtbaarheid |
| waarvindikpsycholoog.nl, ikzoekchristelijkehulp.nl, groundwork.nl | Aanwezig | Tekst en adres controleren |

### 4.3 Links en vermeldingen

De site heeft vrijwel geen externe links buiten directories en de eigen kanalen. Haalbare bronnen: Groundwork Academy (al een profiel van Cris), het Franciscaans Klooster in Denekamp (locatie van het weekend), de gemeente Rheden of Rozendaal (sociale kaart), huisartsenpraktijken in Velp en Rozendaal (verwijslijst), De Gelderlander of Regiobode bij een nieuw programma, en de Christelijke Zorgverzekeraar die al een pagina over Houd me Vast heeft.

## 5. Hoe een AI-assistent een shortlist maakt

Getest op 2 november 2026 met drie onafhankelijke Claude-sessies die niets van dit project wisten. Twee kregen webtoegang en de vraag van een bezoeker uit Arnhem/Velp (relatietherapie) en uit Rheden (psychotherapie). Eén kreeg dezelfde vraag zonder webtoegang.

### 5.1 Zonder webtoegang

Het model geeft geen namen. Het kent geen enkele praktijk in Arnhem, Velp, Rheden of Rozendaal met voldoende zekerheid, ook Redwoods niet, en weigert te gokken omdat het om een zorgkeuze gaat. Het kent wél het concept Houd me Vast (Sue Johnson, EFT). Het verwijst de gebruiker naar registers (NVRG, NIP, BIG), directories en de huisarts.

Conclusie: trainingskennis is voor een kleine praktijk geen kanaal. Alleen brede, herhaalde aanwezigheid in veel gelinkte bronnen (beroepsverenigingen, directories, regionale media) sijpelt op termijn door. Alles wat telt, gebeurt bij assistenten mét webtoegang.

### 5.2 Met webtoegang

**Test B: "Ik woon in Rheden en zoek een psychotherapeut of therapeut dichtbij, geen lange wachtlijst."**

De assistent deed 31 zoekopdrachten en opende ruim 20 pagina's. De shortlist werd: Praktijk Pur Sang (Rheden), Psycholoog Arnhem Mark Bosch (Arnhem-Noord), Psychologenpraktijk De Wenteling (Velperweg), Psychologenpraktijk Mobilé (Velp) en Psychologiepraktijk Kalcik (Velp). Bronnen die de doorslag gaven: Zorgkaart Nederland (in vrijwel elke zoekopdracht de dominante bron), Trustoo en de eigen websites.

Redwoods kwam in geen enkele zoekopdracht en op geen enkele directorypagina voor. Niet op Zorgkaart (waar in Rozendaal geen enkele ggz-aanbieder staat), niet op Trustoo (Rheden, Velp en Rozendaal gecontroleerd), niet op de eerste pagina van de VIT-zoeker. De assistent kon de site alleen beoordelen omdat de URL in de opdracht stond. Het oordeel over de inhoud was positief: op basis van locatie, transparante tarieven, registraties VIT/RBCZ/SCAG en de praktijkcoördinator zou Redwoods op plek 1 of 2 hebben gestaan en Kalcik of Mobilé hebben verdrongen.

Wat de assistent op de site miste: een wachttijd-indicatie (het criterium van de gebruiker, bij vrijwel geen praktijk gepubliceerd, dus wie het wél doet valt op), registratienummers en AGB-code, een aparte vergoedingspagina (/vergoeding geeft 404), /sitemap.xml (de site heeft /sitemap-index.xml), en reviews. De assistent merkte ook op dat "People Services" leest als HR-dienstverlener en dat zoekmachines de naam aan recruitmentbedrijven koppelen; een vaste ondertitel "praktijk voor psychotherapie en relatietherapie in Rozendaal" op elke pagina helpt daartegen. En: wie zoekt op "psychotherapeut" komt in de BIG-lijsten terecht waar een integratief therapeut per definitie niet in staat, dus de termen psychosociale en integratieve therapie moeten overal naast psychotherapie staan.

**Test A: "Ik zoek een goede relatietherapeut in de buurt van Arnhem of Velp."**

De assistent deed 22 zoekopdrachten en opende ruim 40 pagina's, waaronder 17 profielen op eft.nl. De shortlist werd: Praktijk Claartje (Arnhem-Noord), Relatie-gezinstherapie Arnhem (Van Oosterhout), ConnectionLab (Anke Verhees), Bram Taktor (Oosterbeek) en Kitty van den Berg/QP3 (Arnhem-Noord). Het zwaarste criterium was de registratie als EFT-Registertherapeut op eft.nl, gevolgd door een fysiek adres in Arnhem of Velp, expliciete EFT-specialisatie, beschikbaarheid "binnen 1 maand", een concreet tarief en reviews op Trustoo. Landelijke ketens met een pagina "Relatietherapie Arnhem" maar zonder adres (Puur Inzicht, PsyExperts, De Relatiespecialist) vielen af.

Redwoods kwam in geen van de 22 zoekopdrachten voor, ook niet bij een zoekopdracht op de merknaam of op "Houd me vast relatieweekend Arnhem". Niet op Trustoo, niet op relatietherapeuten.net (34 therapeuten binnen 30 km van Velp), niet op therapiepsycholoog.com. Wél gevonden, maar alleen na gericht zoeken: de eft.nl-profielen van Cris (Rozendaal) en Michelle (Velp). Opvallend: wie het EFT-register op "Velp" doorzoekt krijgt als enige resultaat Cris van Dusseldorp.

Redwoods werd uiteindelijk als zesde of zevende optie genoemd, niet in de top 5, om vier redenen:

1. Geen van de therapeuten staat op eft.nl als EFT-Registertherapeut; allen als "aanvullend getrainde EFT-therapeut". Arnhem heeft minstens zes registertherapeuten, meerdere met BIG of NVRG. Voor deze assistent was dat het zwaarste criterium.
2. Geen enkele review te vinden.
3. Het hoogste tarief van alle gevonden aanbieders (€ 215 per 90 minuten) én tegenstrijdige tarieven: de site zegt € 215, eft.nl zegt € 180 in het profiel en € 175 in de biografie.
4. Mariëlle Kattouw ontbreekt op eft.nl, en op eft.nl staat een praktijkruimte Emmastraat 7 in Velp die op de eigen site nergens voorkomt.

Pluspunten die de assistent wel zag: dichtbij Velp, sinds 2000, VIT/RBCZ/SCAG, transparante tarievenpagina, meerdere EFT-therapeuten, het Houd me Vast-weekend en een nette technische basis.


### 5.3 De logica achter de shortlist

Uit de drie tests en de zoekresultaten volgt een vast patroon. Een assistent met webtoegang:

1. Zoekt letterlijk op "relatietherapie Arnhem" of "psychotherapeut Velp" en opent de eerste 5 tot 10 resultaten. Wie daar niet staat, bestaat voor de assistent niet.
2. Opent directories met reviews (Trustoo, Zorgkaart, eft.nl, vind-een-therapeut) en gebruikt die als tweede bron. Een praktijk die in twee of drie bronnen met dezelfde gegevens voorkomt, wordt als betrouwbaar gezien.
3. Beoordeelt per praktijk op zes signalen: locatie expliciet genoemd, specialisatie en methode (EFT, integratief), registraties en keurmerken, reviews met aantal en score, tarief en vergoeding helder, en beschikbaarheid of wachttijd.
4. Sluit uit bij onduidelijkheid: geen plaats op de pagina, geen tarief, geen reviews, een verouderde of onveilige site, of tegenstrijdige gegevens tussen bronnen.
5. Noemt liefst praktijken waarvan het een korte feitelijke toelichting kan geven; een pagina met één heldere alinea "wie, wat, waar, wat kost het" wordt eerder geciteerd dan een lange sfeertekst.

De AI-overzichten van Google zelf werken hetzelfde: voor "relatietherapie Velp" noemde Google Babet Möller, Psychologenpraktijk Richters, delights.nu en Systeemtherapie Van Velzen, allemaal praktijken met een eigen pagina "Relatietherapie Velp" en een eft.nl-profiel onder Velp.

## 6. Aanbevelingen in volgorde

| # | Actie | Wie | Effect |
|---|---|---|---|
| 1 | Search Console: sitemap indienen, herindexering homepage en dienstpagina's, spam-URL's verwijderen | Eight | Oude snippets verdwijnen, nieuwe teksten verschijnen |
| 2 | Google Bedrijfsprofiel: categorieën, beschrijving, diensten, foto's, reviewverzoek na elk traject | Praktijk, met tekst van Eight | Kaartblok voor Velp en Rheden, de bron die AI-assistenten het vaakst citeren |
| 3 | eft.nl: Michelle naar het juiste adres, alle EFT-therapeuten toevoegen met werkgebied Arnhem en Velp, Houd me Vast-weekenden aanmelden bij Stichting EFT Nederland | Praktijk | eft.nl staat op pagina 1 voor elke EFT-zoekvraag |
| 4 | Vier plaatspagina's (Arnhem, Velp, Rheden/Rozendaal, psychotherapie Arnhem) | Eight schrijft, praktijk controleert | Enige manier om voor Arnhem en Velp op pagina 1 te komen |
| 5 | Directories: Zorgkaart, Trustoo, vind-een-therapeut, relatietherapeuten.net, therapiepsycholoog.com, therapeutenkompas; overal hetzelfde adres, dezelfde naam en hetzelfde tarief | Praktijk | Eerste en tweede bron voor AI-shortlists, directe zichtbaarheid voor Rheden |
| 5a | Op de site per therapeut de registraties en nummers tonen (VIT, RBCZ, SCAG, AGB, EFT-status), een wachttijd-indicatie ("intake meestal binnen twee weken") en een vaste ondertitel "praktijk voor psychotherapie en relatietherapie in Rozendaal" | Eight, gegevens van de praktijk | Precies de drie signalen waarop de AI-tests selecteerden en die bij bijna geen concurrent staan |
| 5b | EFT-Registertherapeutschap voor minstens één of twee therapeuten (traject via Stichting EFT Nederland) | Praktijk | Zwaarste criterium in de relatietherapie-test; zonder register blijft Redwoods achter zes Arnhemse registertherapeuten |
| 6 | Archief-redirects, alt-teksten, titels inkorten, reviewblok en registratielogo's op de site | Eight | Technische afronding, meer vertrouwen op de pagina |
| 7 | Blogafsluiters met link naar de dienst, termen psychosociale en integratieve therapie plus prestatiecode op tarieven | Eight | Vergoedingszoekvragen, interne linkstructuur |
| 8 | Externe vermeldingen: Groundwork, Franciscaans Klooster, huisartsen Velp en Rozendaal, sociale kaart gemeente Rheden, regionale pers | Praktijk | Autoriteit en herhaalde vermelding, de enige weg naar trainingskennis van AI-modellen |

Meetpunten na acht weken: positie voor "relatietherapie Arnhem", "relatietherapie Velp", "psychotherapie Velp" en "therapeut Rheden" (Search Console), aantal Google-reviews, aantal vertoningen in het kaartblok (Bedrijfsprofiel), en dezelfde drie AI-tests opnieuw.
