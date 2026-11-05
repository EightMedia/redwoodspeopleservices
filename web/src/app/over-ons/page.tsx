import type { Metadata } from 'next';
import Image from 'next/image';

import rbcz from '@/assets/logo-rbcz.jpg';
import vit from '@/assets/logo-vit.jpg';
import pand from '@/assets/pand-rosendaalselaan.jpg';
import praktijk from '@/assets/praktijkruimte.jpg';
import cris from '@/assets/team/cris-van-dusseldorp.jpg';
import michelle from '@/assets/team/michelle-van-dusseldorp.jpg';
import { Cta } from '@/components/Cta/Cta';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Section } from '@/components/Section/Section';
import { pageMetadata } from '@/lib/metadata';

import './page.css';

export const metadata: Metadata = pageMetadata({
  title: 'Over ons',
  description:
    'Redwoods People Services is in 2000 opgericht door Cris en Michelle van Dusseldorp. Lees ons verhaal, onze visie en waar je ons vindt in Rozendaal bij Arnhem.',
  path: '/over-ons/',
  image: pand,
});

const netwerken = [
  { label: 'Stichting Groundwork', href: 'https://www.groundwork.nl' },
  { label: 'Vivento', href: 'https://www.vivento.nl' },
  { label: 'LVSC', href: 'https://www.lvsc.eu' },
  { label: 'ECP', href: 'https://www.psychotherapie.pro' },
  { label: 'TRE Nederland', href: 'https://www.tre-nederland.nl' },
  { label: 'Anders denken', href: 'https://www.andersdenken.nu' },
  { label: 'vanbinnenuit', href: 'https://www.vanbinnenuit.nl' },
];

/** About page (Astro `over-ons.astro`). */
export default function OverOnsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Over ons"
        title="Sinds 2000: de kracht in mensen zien en helpen ontplooien"
        intro="Redwoods People Services is opgericht door Cris en Michelle van Dusseldorp. Samen met de therapeuten begeleiden zij je met kennis en levenservaring, maar bovenal met plezier en passie voor het vak."
      />

      <Section>
        <div className="rw-about-grid">
          <div className="rw-prose">
            <h2>Onze visie</h2>
            <p>
              Redwoodbomen hebben elkaar nodig. Hun wortels zijn ondiep, maar omdat ze in de breedte reiken en zich
              met elkaar verstrengelen, blijven de bomen overeind in storm, aardbeving en bosbrand. Zo kijken wij ook
              naar mensen: je staat sterker met mensen om je heen.
            </p>
            <p>
              We begeleiden mensen met een verlangen naar heling en ontwikkeling, met oprechte aandacht en deskundige
              begeleiding, op hun reis naar vrijheid, verbinding en zingeving. We werken integratief: met aandacht
              voor geest, ziel en lichaam, en met het christelijke mensbeeld als basis.
            </p>
            <p>
              Iedereen is welkom, ongeacht geloof of achtergrond. Jij staat centraal. Als geloof een hulpbron voor je
              is, zetten we die in; als het een stressbron is, helpen we je er beter mee om te gaan.
            </p>
          </div>
          <Image
            src={praktijk}
            alt="Praktijkruimte van Redwoods met bank en planten"
            width={1000}
            height={667}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="rw-about-image"
          />
        </div>
      </Section>

      <Section surface="subtle">
        <div className="rw-about-story">
          <div className="rw-about-portraits">
            <Image src={cris} alt="Cris van Dusseldorp" width={400} height={400} className="rw-about-portrait" />
            <Image
              src={michelle}
              alt="Michelle van Dusseldorp"
              width={400}
              height={400}
              className="rw-about-portrait"
            />
          </div>
          <div className="rw-prose">
            <h2>Het verhaal van Cris en Michelle</h2>
            <p>
              Cris van Dusseldorp, geboren in 1964 in Nederland, is een pionier in de breedste zin van het woord. Het
              gaat hem niet alleen om reizen, maar om ontdekken, en om zijn kennis op andere plekken delen en
              doorgeven. Bij de start van een van zijn zendingsreizen liep hij Michelle tegen het lijf. Bijna
              letterlijk.
            </p>
            <p>
              Michelle, geboren in 1963 in Nieuw-Zeeland, woonde al enkele jaren in Nederland en zou via dezelfde
              organisatie op reis gaan. Op de vertrekplaats zag Cris dat haar auto en aanhanger voor Rusland totaal
              verkeerd geladen waren. Hij pakte haar hele auto uit en weer in. Eigenlijk bracht hij Michelle op dat
              moment al in balans. Letterlijk. De vonk sloeg over.
            </p>
            <h3>Nieuw-Zeeland</h3>
            <p>
              In 1990 vertrokken ze als gezin naar Nieuw-Zeeland en begonnen ze onderaan de ladder. Cris werkte als
              boerenknecht en leerde via de boeren de plaatselijke bevolking en hun problemen kennen. Vanuit zijn
              geloofsovertuiging richtte hij een rehabilitatiecentrum op voor mannen met levensbepalende problemen:
              verslaving, misbruik, rassenhaat en bendeproblematiek. De kliniek werd een groot succes en hielp vele
              mannen weer aan een plek in de samenleving.
            </p>
            <h3>Terug naar Nederland</h3>
            <p>
              Vlak voor de terugkeer in 2000 droeg Cris de leiding over aan een van de eerste bewoners, die hij tien
              jaar had opgeleid. De organisatie bestaat nog steeds. Dat proces vat zijn passie samen: de kracht en
              kwaliteiten in mensen zien en hen begeleiden om hun potentie te verwezenlijken. In Nederland was Cris
              ruim vijftien jaar voorganger en vervulde hij bestuursfuncties op gemeentelijk en landelijk niveau,
              onder meer met een mentoring- en trainingstraject voor pioniersteams.
            </p>
            <p>
              Michelle is psycholoog, LVSC-geregistreerd supervisor en EFT-relatietherapeut. Ze gaf vele jaren les in
              psychotherapie en relatietherapie en is directeur van Groundwork Academy, een opleidingsinstituut voor
              therapeuten en coaches. Ze schreef de boeken <em>Goed voelen</em> (met Harry van de Pol) en{' '}
              <em>Ik kan veranderen</em>.
            </p>
            <p>
              <a href="/team/">Maak kennis met het hele team →</a>
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="rw-about-grid rw-about-grid--center">
          <Image
            src={pand}
            alt="Het witte monumentale pand aan de Rosendaalselaan in Rozendaal"
            width={1024}
            height={683}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="rw-about-image"
          />
          <div>
            <h2 className="rw-about-h2">Onze praktijk in Rozendaal</h2>
            <p className="rw-measure rw-about-text">
              Je vindt ons aan de Rosendaalselaan 30 in Rozendaal, aan de rand van Arnhem en Velp, in een monumentaal
              pand tussen het groen. Een rustige plek om op adem te komen.
            </p>
            <a href="/contact/" className="rw-btn--secondary rw-about-button">
              Adres en route
            </a>
          </div>
        </div>
      </Section>

      <Section surface="loud-alt">
        <h2 className="rw-about-h2 rw-about-h2--small">Kwaliteit en registraties</h2>
        <p className="rw-measure rw-about-quality">
          Onze therapeuten zijn aangesloten bij beroepsverenigingen en koepels zoals VIT, RBCZ, NFG, LVSC en ECP, en
          hebben een AGB-code. Daardoor wordt therapie vaak (deels) vergoed vanuit een aanvullende zorgverzekering.
        </p>
        <div className="rw-about-logos">
          <Image src={vit} alt="VIT, Vereniging van Integraal Therapeuten" width={104} height={77} className="rw-about-logo" />
          <Image
            src={rbcz}
            alt="RBCZ, Register Beroepsbeoefenaren Complementaire Zorg"
            width={200}
            height={97}
            className="rw-about-logo"
          />
        </div>
        <p className="rw-about-networks">
          Netwerken:{' '}
          {netwerken.map((netwerk, index) => (
            <span key={netwerk.href}>
              {index > 0 ? (index === netwerken.length - 1 ? ' en ' : ', ') : null}
              <a href={netwerk.href} rel="noopener" target="_blank" className="rw-about-link">
                {netwerk.label}
              </a>
            </span>
          ))}
          .
        </p>
      </Section>

      <Cta />
    </>
  );
}
