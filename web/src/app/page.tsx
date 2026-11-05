import type { Metadata } from 'next';
import Image from 'next/image';

import hero from '@/assets/hero-redwoods.jpg';
import praktijk from '@/assets/praktijkruimte.jpg';
import videoPoster from '@/assets/video-8DnQq_ybABg.jpg';
import wortels from '@/assets/wortels.png';
import { Cta } from '@/components/Cta/Cta';
import { SanityImage } from '@/components/SanityImage/SanityImage';
import { Section } from '@/components/Section/Section';
import { TeamCard } from '@/components/TeamCard/TeamCard';
import { VideoBackground } from '@/components/YouTube/VideoBackground';
import { pageMetadata } from '@/lib/metadata';
import { formatBlogDate, getBlogPosts } from '@/sanity/queries/blog';
import { getDiensten } from '@/sanity/queries/diensten';
import { getTeamMembers } from '@/sanity/queries/team';

import './page.css';

export const metadata: Metadata = pageMetadata({
  title: 'Psychotherapie en relatietherapie in Rozendaal bij Arnhem',
  description:
    'Praktijk voor psychotherapie, EFT-relatietherapie, coaching en supervisie in Rozendaal, op tien minuten van Arnhem en Velp. Sinds 2000, zonder verwijzing.',
  path: '/',
  bareTitle: true,
});

const programmas = [
  {
    title: 'Houd me Vast relatieweekend',
    text: 'Een weekend lang werken aan een diepere emotionele band, in een kleine groep stellen en onder begeleiding van ervaren relatietherapeuten.',
    href: '/houd-me-vast/',
    label: 'Data en aanmelden',
  },
  {
    title: 'Rouw en Verlies',
    text: 'Een therapeutisch begeleide groep voor mensen die een dierbare hebben verloren. Vijf bijeenkomsten met ruimte voor jouw verhaal.',
    href: '/rouw-en-verlies/',
    label: 'Meer over de groep',
  },
  {
    title: 'Greenwoods',
    text: 'Spiritual direction, retraites en leiderschapsontwikkeling. Een plek om te wortelen, te groeien en te bloeien.',
    href: '/greenwoods/',
    label: 'Ontdek Greenwoods',
  },
];

const usps = ['Sinds 2000', 'Aangesloten bij VIT en RBCZ', 'Iedereen is welkom', 'In de praktijk of online'];

/** Home page (Astro `index.astro`). */
export default async function HomePage() {
  const [diensten, allTeam, allPosts] = await Promise.all([
    getDiensten(),
    getTeamMembers(),
    getBlogPosts(),
  ]);
  const team = allTeam.filter((member) => member.slug !== 'edwin-meuleman').slice(0, 3);
  const posts = allPosts.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="rw-home-hero">
        <div className="rw-container rw-home-hero__grid">
          <div className="rw-home-hero__copy">
            <p className="rw-eyebrow rw-home-hero__eyebrow">Praktijk in Rozendaal, bij Arnhem en Velp</p>
            <h1 className="rw-home-hero__title">Weer sterk in het leven staan, met mensen om je heen.</h1>
            <p className="rw-measure rw-home-hero__intro">
              Verlang je naar heling en ontwikkeling? Wil je meer vrijheid, verbinding en zingeving ervaren? Bij
              Redwoods vind je oprechte persoonlijke aandacht en deskundige begeleiding: psychotherapie,
              relatietherapie, coaching en supervisie.
            </p>
            <div className="rw-home-hero__actions">
              <a href="/contact/" className="rw-btn--primary">
                Maak een afspraak
              </a>
              <a href="/diensten/" className="rw-btn--secondary">
                Bekijk onze diensten
              </a>
            </div>
            <ul className="rw-home-hero__usps">
              {usps.map((usp) => (
                <li key={usp} className="rw-home-hero__usp">
                  <span className="rw-home-hero__dot" aria-hidden="true" />
                  {usp}
                </li>
              ))}
            </ul>
          </div>
          <div className="rw-home-hero__media">
            <Image
              src={hero}
              alt="Illustratie van drie redwoodbomen in rood en roze tinten"
              width={1100}
              height={487}
              priority
              fetchPriority="high"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="rw-home-hero__image"
            />
          </div>
        </div>
      </section>

      {/* Redwood metaphor */}
      <Section surface="loud" className="rw-home-roots">
        <Image src={wortels} alt="" width={1920} height={800} className="rw-home-roots__bg" aria-hidden="true" />
        <div className="rw-home-roots__grid">
          <div>
            <h2 className="rw-home-h2">Redwoodbomen hebben elkaar nodig.</h2>
            <p className="rw-measure rw-home-roots__text rw-home-roots__text--first">
              De wortels van een redwood zijn, in verhouding tot zijn hoogte, opvallend ondiep: drie à vier meter.
              Toch doorstaan deze bomen stormen, aardbevingen en bosbranden. Hoe? Ze staan bij elkaar. Hun wortels
              reiken in de breedte twintig tot dertig meter en verstrengelen zich met die van hun buren. Ze houden
              elkaar letterlijk overeind.
            </p>
          </div>
          <div>
            <p className="rw-measure rw-home-roots__text">
              Zo werkt het ook bij mensen. Redwoods helpt jou groeien om net zo sterk in het leven te staan als deze
              bomen. En niet jij alleen: ook je relatie, je gezin, je team of je organisatie kan bij ons terecht om
              de kracht die in iedereen zit te ontplooien. Zodat je er uiteindelijk sterker en zekerder van jezelf
              uitspringt.
            </p>
            <a href="/over-ons/" className="rw-btn rw-home-btn--outline-white">
              Lees ons verhaal
            </a>
          </div>
        </div>
      </Section>

      {/* Everyone is welcome */}
      <Section surface="subtle">
        <div className="rw-home-welcome">
          <div>
            <p className="rw-eyebrow rw-home-eyebrow">Iedereen is welkom</p>
            <h2 className="rw-home-h2">Ongeacht geloof of achtergrond. Jij staat centraal.</h2>
          </div>
          <div className="rw-home-welcome__text">
            <p className="rw-measure">
              We werken integratief: met aandacht voor geest, ziel en lichaam, en met het christelijke mensbeeld als
              basis. Als geloof een hulpbron voor je is, zetten we die in; als het een stressbron is, helpen we je er
              beter mee om te gaan. Speelt het voor jou geen rol, dan komt het niet ter sprake.
            </p>
            <p className="rw-measure">
              Gesprekken zijn in onze praktijk in Rozendaal of online. Cliënten komen uit de regio Arnhem, maar ook
              uit de rest van Nederland en het buitenland.
            </p>
          </div>
        </div>
      </Section>

      {/* Services */}
      <Section>
        <div className="rw-home-lead">
          <p className="rw-eyebrow rw-home-eyebrow">Diensten</p>
          <h2 className="rw-home-h2">Waar we je mee helpen</h2>
          <p className="rw-home-lead__text">
            Of je nu zoekt naar persoonlijke groei, hulp in je relatie of professionele begeleiding: we kijken samen
            welke aanpak bij je past.
          </p>
        </div>
        <div className="rw-home-services">
          {diensten.map((dienst) => (
            <a key={dienst.slug} href={`/diensten/${dienst.slug}/`} className="rw-home-service">
              <h3 className="rw-home-service__title">{dienst.title}</h3>
              <p className="rw-home-service__intro">{dienst.intro}</p>
              <span className="rw-home-arrow-link">
                Meer over {dienst.title.toLowerCase().replace(' (eft)', '')} <span aria-hidden="true">→</span>
              </span>
            </a>
          ))}
        </div>
      </Section>

      {/* Team */}
      <Section surface="loud-alt">
        <div className="rw-home-split">
          <div className="rw-home-lead">
            <p className="rw-eyebrow rw-home-eyebrow">Ons team</p>
            <h2 className="rw-home-h2">Ervaren therapeuten, met plezier en passie voor het vak</h2>
          </div>
          <a href="/team/" className="rw-btn--secondary">
            Het hele team
          </a>
        </div>
        <div className="rw-home-team">
          {team.map((member) => (
            <TeamCard key={member.slug} member={member} compact />
          ))}
        </div>
      </Section>

      {/* Programmes */}
      <Section surface="subtle">
        <div className="rw-home-lead">
          <p className="rw-eyebrow rw-home-eyebrow">Programma&apos;s</p>
          <h2 className="rw-home-h2">Samen op weg, in een groep</h2>
        </div>
        <div className="rw-home-programmes">
          {programmas.map((programma) => (
            <div key={programma.href} className="rw-home-programme">
              <h3 className="rw-home-programme__title">{programma.title}</h3>
              <p className="rw-home-programme__text">{programma.text}</p>
              <a href={programma.href} className="rw-home-arrow-link rw-home-programme__link">
                {programma.label} <span aria-hidden="true">→</span>
              </a>
            </div>
          ))}
        </div>
      </Section>

      {/* Video */}
      <section className="rw-home-video">
        <div className="rw-home-video__bg">
          <Image src={videoPoster} alt="" width={1280} height={720} className="rw-home-video__poster" />
          <VideoBackground id="8DnQq_ybABg" title="Sfeervideo Redwoods (zonder geluid)" />
          <div className="rw-home-video__overlay" aria-hidden="true" />
        </div>
        <div className="rw-container rw-home-video__content">
          <p className="rw-eyebrow rw-home-video__eyebrow">Een kijkje bij Redwoods</p>
          <h2 className="rw-home-video__title">Weer in verbinding, met jezelf en met elkaar.</h2>
          <p className="rw-measure rw-home-video__text">
            Daar werken we elke dag aan, met oprechte aandacht en deskundige begeleiding. Bekijk in twee minuten wie
            we zijn en hoe we werken.
          </p>
          <a
            href="https://www.youtube.com/watch?v=8DnQq_ybABg"
            target="_blank"
            rel="noopener"
            className="rw-btn rw-home-btn--outline-white"
          >
            Bekijk de video met geluid
          </a>
        </div>
      </section>

      {/* Practice */}
      <Section>
        <div className="rw-home-practice">
          <Image
            src={praktijk}
            alt="Lichte praktijkruimte met een bank, planten en houten bijzettafels"
            width={1000}
            height={667}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="rw-home-practice__image"
          />
          <div>
            <p className="rw-eyebrow rw-home-eyebrow">Onze praktijk</p>
            <h2 className="rw-home-h2">Een rustige plek aan de rand van Arnhem</h2>
            <p className="rw-measure rw-home-practice__text">
              Je vindt ons aan de Rosendaalselaan 30 in Rozendaal, in een monumentaal pand tussen het groen. Vanaf
              station Arnhem Centraal ben je er met bus 8 in een kwartier, vanaf station Velp in vier minuten.
              Parkeren kan bij het pand.
            </p>
            <p className="rw-measure rw-home-practice__text rw-home-practice__text--follow">
              Liever niet reizen? Gesprekken kunnen ook online. We werken in jouw tempo.
            </p>
            <a href="/contact/" className="rw-btn--secondary rw-home-practice__button">
              Adres en route
            </a>
          </div>
        </div>
      </Section>

      {/* Blog */}
      <Section>
        <div className="rw-home-split">
          <div className="rw-home-lead">
            <p className="rw-eyebrow rw-home-eyebrow">Blog</p>
            <h2 className="rw-home-h2">Inspiratie en inzichten</h2>
          </div>
          <a href="/blog/" className="rw-btn--ghost">
            Alle artikelen →
          </a>
        </div>
        <div className="rw-home-posts">
          {posts.map((post) => (
            <article key={post.slug} className="rw-home-post">
              {post.cover ? (
                <a href={`/blog/${post.slug}/`} tabIndex={-1} aria-hidden="true" className="rw-home-post__media">
                  <SanityImage
                    image={post.cover}
                    alt={post.title}
                    width={640}
                    height={400}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="rw-home-post__image"
                  />
                </a>
              ) : null}
              <p className="rw-home-post__date">{formatBlogDate(post.date)}</p>
              <h3 className="rw-home-post__title">
                <a href={`/blog/${post.slug}/`} className="rw-home-post__link">
                  {post.title}
                </a>
              </h3>
              <p className="rw-home-post__description">{post.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Cta />
    </>
  );
}
