import type { Metadata } from 'next';

import { Locatie } from '@/components/Locatie/Locatie';
import { pageMetadata } from '@/lib/metadata';

const path = '/therapie-rheden-rozendaal/';

export const metadata: Metadata = pageMetadata({
  title: 'Therapeut in Rheden, Velp en Rozendaal | Redwoods',
  description:
    'Therapie dichtbij voor Velp, Rheden, De Steeg en Dieren: psychotherapie, relatietherapie, coaching en een rouwgroep bij Redwoods in Rozendaal. Zonder verwijzing.',
  path,
  bareTitle: true,
});

export default function TherapieRhedenRozendaalPage() {
  return (
    <Locatie
      path={path}
      eyebrow="Therapie in de gemeente Rheden"
      title="Therapie in Rheden en Rozendaal"
      intro="Voor inwoners van Rozendaal, Velp, Rheden, De Steeg, Ellecom en Dieren is Redwoods de praktijk om de hoek: psychotherapie, EFT-relatietherapie, coaching en een groep voor rouw en verlies, aan de Rosendaalselaan in Rozendaal. Zonder verwijzing en met een vast aanspreekpunt."
      blokken={[
        {
          kop: 'Eén praktijk voor verschillende vragen',
          alineas: [
            'Soms weet je precies wat je zoekt, vaak ook niet. Bij Redwoods werken zes therapeuten en coaches met elk hun eigen accent, zodat we met je kunnen meedenken over wat past. Individuele <a href="/diensten/psychotherapie/">psychotherapie</a> bij somberheid, angst, burn-out, trauma of een laag zelfbeeld. <a href="/diensten/relatietherapie/">Relatietherapie</a> volgens EFT voor stellen. <a href="/diensten/coaching/">Coaching</a> bij vragen over werk, richting en leiderschap. En met enige regelmaat de groep <a href="/rouw-en-verlies/">Rouw en Verlies</a> voor wie een dierbare heeft verloren.',
            'Je eerste contact is met Edwin, onze praktijkcoördinator. Hij luistert naar je vraag, legt uit hoe het werkt en plant een kennismaking met de therapeut die het beste past.',
          ],
        },
        {
          kop: 'Dichtbij, zonder verwijzing',
          alineas: [
            'Onze therapeuten zijn integratief en psychosociaal therapeut, aangesloten bij VIT en RBCZ. Je hebt geen verwijzing van de huisarts nodig en er is geen diagnose vereist. Veel aanvullende verzekeringen vergoeden een deel van de kosten, buiten het eigen risico om. Dat maakt de stap klein: bellen of mailen, kennismaken, en als het klikt beginnen.',
            'De praktijk zit in een oud pand aan de rand van de Veluwezoom. Vanuit Velp loop of fiets je ernaartoe; vanuit Rheden, De Steeg en Dieren ben je er via de Arnhemsestraatweg in tien tot twintig minuten. Parkeren kan bij het pand.',
          ],
        },
        {
          kop: 'Sinds 2000 geworteld in Rozendaal',
          alineas: [
            'Redwoods is in 2000 opgericht door Cris en Michelle van Dusseldorp. De naam verwijst naar de redwoodbomen, die ondiep wortelen maar hun wortels met elkaar verstrengelen en zo stormen doorstaan. Dat is ook hoe we naar mensen kijken: je staat sterker met anderen om je heen. Lees meer op <a href="/over-ons/">Over ons</a>.',
          ],
        },
        {
          kop: 'Kosten',
          alineas: [
            'Psychotherapie kost € 115,- tot € 135,- per sessie van 60 minuten (btw-vrij, prestatiecode 24500), relatietherapie € 215,- per sessie van 90 minuten. De groep Rouw en Verlies en coaching hebben een eigen tarief. Alles staat op de <a href="/tarieven/">tarievenpagina</a>.',
          ],
        },
      ]}
      route={{
        kop: 'Naar de praktijk',
        items: [
          '<strong>Vanuit Velp:</strong> twintig minuten lopen vanaf het station, of bus 8 richting Rozendaal (halte Ringallee).',
          '<strong>Vanuit Rheden, De Steeg en Dieren:</strong> via de Arnhemsestraatweg naar Velp en de Ringallee, of met bus 8 vanaf Velp.',
          '<strong>Vanuit Arnhem:</strong> tien minuten via de Velperweg, of bus 8 vanaf Arnhem Centraal.',
        ],
      }}
      faq={[
        {
          q: 'Voor welke klachten kan ik bij jullie terecht?',
          a: 'Voor somberheid, angst, stress en burn-out, rouw en verlies, trauma en hechtingsproblemen, een laag zelfbeeld, vragen over zingeving en voor relatieproblemen. Bij ernstige psychiatrische problematiek verwijzen we door.',
        },
        {
          q: 'Hoe meld ik me aan?',
          a: 'Bel, mail of gebruik het [contactformulier](/contact/). Edwin, onze praktijkcoördinator, is op maandag, woensdag en donderdag tussen 09:00 en 13:00 uur bereikbaar en neemt daarbuiten binnen enkele werkdagen contact op.',
        },
        {
          q: 'Wordt therapie vergoed?',
          a: 'Psychosociale therapie wordt door veel aanvullende verzekeringen deels vergoed, zonder eigen risico. Relatietherapie meestal niet. Op de [tarievenpagina](/tarieven/) staat hoe je dit nakijkt bij je verzekeraar.',
        },
      ]}
      teamIds={['cris-van-dusseldorp', 'michelle-van-dusseldorp', 'marielle-kattouw', 'joost-de-wolf', 'jochem-klein-nagelvoort', 'joke-francissen']}
      teamKop="Onze therapeuten en coaches"
      dienst={{ label: 'Alle diensten', href: '/diensten/' }}
      verwant={[
        { label: 'Relatietherapie in Velp', href: '/relatietherapie-velp/' },
        { label: 'Psychotherapie in Arnhem', href: '/psychotherapie-arnhem/' },
        { label: 'Rouwgroep Rouw en Verlies', href: '/rouw-en-verlies/' },
      ]}
      formulierOnderwerp="Vraag over therapie (Rheden/Rozendaal)"
      service={{
        name: 'Psychotherapie, relatietherapie en coaching',
        description:
          'Therapie en coaching voor inwoners van de gemeente Rheden en Rozendaal, bij Redwoods People Services aan de Rosendaalselaan in Rozendaal.',
        plaatsen: ['Rozendaal', 'Velp', 'Rheden', 'De Steeg', 'Dieren'],
      }}
    />
  );
}
