import type { Metadata } from 'next';

import { Locatie } from '@/components/Locatie/Locatie';
import { pageMetadata } from '@/lib/metadata';

const path = '/relatietherapie-arnhem/';

export const metadata: Metadata = pageMetadata({
  title: 'Relatietherapie Arnhem (EFT) | Redwoods, Rozendaal',
  description:
    'EFT-relatietherapie voor stellen uit Arnhem, tien minuten van Arnhem-Noord. Vijf getrainde EFT-relatietherapeuten, sessies van 90 minuten, parkeren bij de deur.',
  path,
  bareTitle: true,
});

export default function RelatietherapieArnhemPage() {
  return (
    <Locatie
      path={path}
      eyebrow="Relatietherapie in de regio Arnhem"
      title="Relatietherapie Arnhem"
      intro="Blijven jullie in dezelfde ruzie hangen, of is het juist stil geworden? Stellen uit Arnhem komen bij Redwoods in Rozendaal voor EFT-relatietherapie: op tien minuten van Arnhem-Noord, met vijf getrainde EFT-relatietherapeuten en de rust van de Veluwezoom om de hoek."
      blokken={[
        {
          kop: 'Relatietherapie net buiten Arnhem, zonder de drukte van de stad',
          alineas: [
            'Onze praktijk staat aan de Rosendaalselaan in Rozendaal, direct ten noordoosten van Arnhem. Vanuit Arnhem-Noord, Velperweg of Presikhaaf ben je er met de auto in tien minuten, vanaf Arnhem Centraal in een kwartier met bus 8. Veel stellen vinden het prettig dat de praktijk niet midden in de stad zit: je rijdt even weg uit het dagelijkse, parkeert voor de deur en stapt een rustig huis binnen.',
            'Redwoods bestaat sinds 2000. We zijn een team van zes therapeuten en coaches, van wie er vijf getraind zijn in Emotionally Focused Therapy (EFT), de relatietherapie die ontwikkeld is door Sue Johnson en waarvan de werking in tientallen onderzoeken is aangetoond.',
          ],
        },
        {
          kop: 'Hoe EFT-relatietherapie werkt',
          alineas: [
            'In EFT kijken we niet naar wie gelijk heeft, maar naar het patroon waarin jullie samen terechtkomen: de een dringt aan, de ander trekt zich terug, en allebei voelen jullie je uiteindelijk alleen. In de eerste fase brengen we dat patroon in kaart en leren jullie het te herkennen op het moment dat het gebeurt. In de tweede fase onderzoeken we wat eronder zit: de angst, het verlangen, de behoefte aan nabijheid die niet meer wordt uitgesproken. In de derde fase oefenen jullie om elkaar daarin weer te bereiken.',
            'Een sessie duurt 90 minuten. Hoeveel sessies nodig zijn verschilt per stel; dat bespreken we na de kennismaking. Lees meer over de methode op de pagina <a href="/diensten/relatietherapie/">Relatietherapie (EFT)</a>.',
          ],
        },
        {
          kop: 'Liever eerst een weekend?',
          alineas: [
            'Voor stellen die niet direct aan een traject willen beginnen, of die een stevige start willen maken, is er het <a href="/houd-me-vast/">Houd me Vast relatieweekend</a>: drie dagen in een kleine groep, waarin je de kern van EFT doorloopt met je eigen partner. Veel stellen uit Arnhem en omgeving kiezen hiervoor als eerste stap.',
          ],
        },
        {
          kop: 'Kosten en vergoeding',
          alineas: [
            'Een sessie relatietherapie van 90 minuten kost € 215,- inclusief btw. Relatietherapie wordt door zorgverzekeraars meestal niet vergoed; sommige aanvullende pakketten vergoeden een deel. Je ontvangt twee keer per maand een factuur. Alle tarieven staan op de <a href="/tarieven/">tarievenpagina</a>.',
          ],
        },
      ]}
      route={{
        kop: 'Vanuit Arnhem naar de praktijk',
        items: [
          '<strong>Auto:</strong> via de Velperweg of de Apeldoornseweg richting Rozendaal, of vanaf de A12 afrit 27 (Arnhem-Noord/Velp) en de borden Rozendaal volgen. Parkeren kan bij het pand.',
          '<strong>Bus:</strong> lijn 8 vanaf Arnhem Centraal, 15 minuten. Uitstappen bij halte Ringallee, bij de rotonde linksaf, na twee minuten lopen aan je linkerhand.',
          '<strong>Fiets:</strong> vanaf het centrum van Arnhem ongeveer 20 minuten via de Velperweg en de Rosendaalselaan.',
        ],
      }}
      faq={[
        {
          q: 'Is Rozendaal niet ver voor stellen uit Arnhem?',
          a: 'Nee. Rozendaal grenst aan Arnhem-Noord en Velp. Vanaf de Velperweg ben je er in tien minuten, vanaf Arnhem-Zuid in twintig. Met bus 8 vanaf Arnhem Centraal ben je er in een kwartier.',
        },
        {
          q: 'Hoe snel kunnen we terecht?',
          a: 'Onze praktijkcoördinator Edwin neemt binnen enkele werkdagen contact op na je aanmelding en plant een kennismaking in. Hoe snel de eerste sessie kan, hangt af van de therapeut en de dagen waarop jullie kunnen. [Neem contact op](/contact/) om de actuele mogelijkheden te horen.',
        },
        {
          q: 'Zijn jullie therapeuten geregistreerd?',
          a: 'Onze EFT-relatietherapeuten zijn aanvullend getraind in EFT bij Stichting EFT Nederland en aangesloten bij beroepsverenigingen zoals VIT en RBCZ. Per therapeut staan de registraties op de [teampagina](/team/).',
        },
        {
          q: 'Is Redwoods een christelijke praktijk?',
          a: 'Redwoods is opgericht vanuit een christelijke inspiratie, maar iedereen is welkom, ongeacht geloof of levensovertuiging. Jullie relatie staat centraal; geloof komt alleen ter sprake als jullie dat zelf willen.',
        },
      ]}
      teamIds={['cris-van-dusseldorp', 'michelle-van-dusseldorp', 'marielle-kattouw', 'joost-de-wolf', 'joke-francissen']}
      teamKop="EFT-relatietherapeuten voor stellen uit Arnhem"
      dienst={{ label: 'Relatietherapie (EFT): de methode', href: '/diensten/relatietherapie/' }}
      verwant={[
        { label: 'Houd me Vast relatieweekend', href: '/houd-me-vast/' },
        { label: 'Relatietherapie in Velp', href: '/relatietherapie-velp/' },
        { label: 'Psychotherapie in Arnhem', href: '/psychotherapie-arnhem/' },
      ]}
      formulierOnderwerp="Vraag over relatietherapie (Arnhem)"
      service={{
        name: 'EFT-relatietherapie',
        description:
          'Emotionally Focused Therapy voor stellen uit Arnhem en omgeving, in de praktijk van Redwoods People Services in Rozendaal.',
        plaatsen: ['Arnhem', 'Rozendaal', 'Velp'],
      }}
    />
  );
}
