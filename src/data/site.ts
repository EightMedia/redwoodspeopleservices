export const site = {
  name: "Redwoods People Services",
  shortName: "Redwoods",
  url: "https://www.redwoodspeopleservices.nl",
  description:
    "Praktijk voor psychotherapie, relatietherapie (EFT), coaching en supervisie in Rozendaal, op tien minuten van Arnhem en Velp.",
  phone: "+31 6 24913779",
  phoneHref: "+31624913779",
  email: "secretariaat@redwoodspeopleservices.nl",
  address: {
    street: "Rosendaalselaan 30",
    postalCode: "6891 DG",
    city: "Rozendaal",
    region: "Gelderland",
    country: "NL",
  },
  geo: { lat: 52.0007, lng: 5.9704 },
  kvk: "77235320",
  openingHours: "Praktijkcoördinator bereikbaar op maandag, woensdag en donderdag van 09:00 tot 13:00",
  socials: {
    linkedin: "https://www.linkedin.com/company/redwoods-people-services/",
    instagram: "https://www.instagram.com/redwoodspeopleservices/",
    facebook: "https://www.facebook.com/redwoodspeopleservices/",
    youtube: "https://www.youtube.com/@redwoodspeopleservices",
  },
};

export const nav = [
  {
    label: "Diensten",
    href: "/diensten/",
    children: [
      { label: "Psychotherapie", href: "/diensten/psychotherapie/" },
      { label: "Relatietherapie (EFT)", href: "/diensten/relatietherapie/" },
      { label: "Coaching", href: "/diensten/coaching/" },
      { label: "Supervisie", href: "/diensten/supervisie/" },
      { label: "Tarieven", href: "/tarieven/" },
    ],
  },
  {
    label: "Programma's",
    href: "/programmas/",
    children: [
      { label: "Houd me Vast relatieweekend", href: "/houd-me-vast/" },
      { label: "Rouw en Verlies", href: "/rouw-en-verlies/" },
      { label: "Greenwoods", href: "/greenwoods/" },
    ],
  },
  { label: "Team", href: "/team/" },
  { label: "Over ons", href: "/over-ons/" },
  { label: "Blog", href: "/blog/" },
];
