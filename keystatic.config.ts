import { config, fields, collection, singleton } from "@keystatic/core";

/**
 * Keystatic: beheerscherm op /keystatic.
 * - Lokaal (npm run dev) schrijft het direct naar de bestanden in deze map.
 * - In productie werkt het via GitHub (commits in de repo) of Keystatic Cloud.
 *   Zie README.md onder "Content beheren".
 */
const repo = { owner: "EightMedia", name: "redwoodspeopleservices" } as const;
// Let op: dit bestand draait ook in de browser, dus alleen import.meta.env en PUBLIC_-variabelen.
const cloudProject = import.meta.env.PUBLIC_KEYSTATIC_CLOUD_PROJECT as string | undefined;
const storage =
  import.meta.env.DEV
    ? ({ kind: "local" } as const)
    : cloudProject
      ? ({ kind: "cloud" } as const)
      : ({ kind: "github", repo } as const);

const markdown = (label = "Tekst", imageDir = "src/assets/content") =>
  fields.markdoc({
    label,
    extension: "md",
    options: {
      image: { directory: imageDir, publicPath: `../../${imageDir.replace(/^src\//, "")}/` },
      table: false,
    },
  });

export default config({
  storage,
  ...(cloudProject ? { cloud: { project: cloudProject } } : {}),
  ui: {
    brand: { name: "Redwoods website" },
    navigation: {
      Content: ["blog", "team", "diensten"],
      Instellingen: ["tarieven", "houdMeVast", "rouwEnVerlies"],
    },
  },
  collections: {
    blog: collection({
      label: "Blog",
      slugField: "title",
      path: "src/content/blog/*",
      entryLayout: "content",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Titel" }, slug: { label: "URL-naam", description: "Wordt het adres: /blog/url-naam/" } }),
        description: fields.text({ label: "Korte samenvatting", description: "Twee zinnen. Verschijnt in overzichten en in Google.", multiline: true, validation: { length: { min: 20, max: 300 } } }),
        date: fields.date({ label: "Datum", defaultValue: { kind: "today" } }),
        author: fields.text({ label: "Auteur", defaultValue: "Redwoods People Services" }),
        cover: fields.image({ label: "Omslagfoto", description: "Liggend, minimaal 1200 pixels breed, kleiner dan 2 MB.", directory: "src/assets/blog", publicPath: "../../assets/blog/" }),
        content: markdown("Artikel", "src/assets/blog"),
      },
    }),
    team: collection({
      label: "Team",
      slugField: "name",
      path: "src/content/team/*",
      format: { contentField: "content" },
      schema: {
        name: fields.slug({ name: { label: "Naam" }, slug: { label: "URL-naam" } }),
        role: fields.text({ label: "Functie", description: "Bijvoorbeeld: Integratief therapeut en EFT-relatietherapeut" }),
        intro: fields.text({ label: "Korte introductie", description: "Eén of twee zinnen voor de teamkaart.", multiline: true }),
        photo: fields.image({ label: "Portretfoto", description: "Vierkant of staand, minimaal 800 pixels.", directory: "src/assets/team", publicPath: "../../assets/team/", validation: { isRequired: true } }),
        order: fields.integer({ label: "Volgorde", defaultValue: 99 }),
        specialties: fields.array(fields.text({ label: "Specialisatie" }), { label: "Specialisaties", itemLabel: (p) => p.value }),
        registrations: fields.array(fields.text({ label: "Registratie" }), { label: "Registraties", description: "Bijvoorbeeld: VIT: lid", itemLabel: (p) => p.value }),
        content: markdown("Profieltekst", "src/assets/team"),
      },
    }),
    diensten: collection({
      label: "Diensten",
      slugField: "title",
      path: "src/content/diensten/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Naam van de dienst" }, slug: { label: "URL-naam" } }),
        description: fields.text({ label: "Omschrijving voor Google", description: "Maximaal 160 tekens, noem de plaats.", multiline: true }),
        intro: fields.text({ label: "Intro", description: "Twee zinnen bovenaan de pagina.", multiline: true }),
        order: fields.integer({ label: "Volgorde", defaultValue: 99 }),
        faq: fields.array(
          fields.object({ q: fields.text({ label: "Vraag" }), a: fields.text({ label: "Antwoord", multiline: true }) }),
          { label: "Veelgestelde vragen", itemLabel: (p) => p.fields.q.value },
        ),
        content: markdown("Tekst", "src/assets/content"),
      },
    }),
  },
  singletons: {
    tarieven: singleton({
      label: "Tarieven",
      path: "src/data/tarieven",
      format: "json",
      schema: {
        geldigVanaf: fields.text({ label: "Geldig vanaf", description: "Bijvoorbeeld: 1 januari 2026" }),
        tarieven: fields.array(
          fields.object({
            naam: fields.text({ label: "Dienst" }),
            prijs: fields.text({ label: "Prijs", description: "Bijvoorbeeld: € 115,-" }),
            btw: fields.text({ label: "Btw", description: "btw-vrij of incl. 21% btw" }),
            info: fields.text({ label: "Toelichting", multiline: true }),
          }),
          { label: "Tarieven", itemLabel: (p) => `${p.fields.naam.value} – ${p.fields.prijs.value}` },
        ),
        studenten: fields.array(
          fields.object({
            naam: fields.text({ label: "Dienst" }),
            prijs: fields.text({ label: "Prijs" }),
            btw: fields.text({ label: "Btw" }),
            info: fields.text({ label: "Toelichting", multiline: true }),
          }),
          { label: "Tarieven studenten Groundwork Academy", itemLabel: (p) => `${p.fields.naam.value} – ${p.fields.prijs.value}` },
        ),
      },
    }),
    houdMeVast: singleton({
      label: "Houd me Vast: data en prijs",
      path: "src/data/houd-me-vast",
      format: "json",
      schema: {
        prijs: fields.text({ label: "Prijs per stel", description: "Bijvoorbeeld: € 1.395,-" }),
        aanbetaling: fields.text({ label: "Aanbetaling (tekst)", description: "Bijvoorbeeld: € 697,50" }),
        aanbetalingBedrag: fields.text({ label: "Aanbetaling (bedrag voor Mollie)", description: "Alleen cijfers met punt, bijvoorbeeld 697.50", validation: { isRequired: true, pattern: { regex: /^\d+\.\d{2}$/, message: "Gebruik het formaat 697.50" } } }),
        data: fields.array(
          fields.object({
            datum: fields.text({ label: "Datum", description: "Bijvoorbeeld: 22 – 24 januari 2027" }),
            vol: fields.checkbox({ label: "Vol", defaultValue: false }),
          }),
          { label: "Weekenden", itemLabel: (p) => p.fields.datum.value },
        ),
      },
    }),
    rouwEnVerlies: singleton({
      label: "Rouw en Verlies: data en prijs",
      path: "src/data/rouw-en-verlies",
      format: "json",
      schema: {
        wanneer: fields.text({ label: "Wanneer", description: "Bijvoorbeeld: Start 12 maart 2027, of: data volgen binnenkort", multiline: true }),
        omvang: fields.text({ label: "Omvang", defaultValue: "Vijf bijeenkomsten van 09:30 tot 12:00 uur, in een kleine groep" }),
        prijs: fields.text({ label: "Prijs", description: "Bijvoorbeeld: € 525,-" }),
        inclusief: fields.text({ label: "Inclusief", defaultValue: "koffie, thee en versnaperingen" }),
      },
    }),
  },
});
