import type { Metadata } from 'next';
import Image from 'next/image';

import bg from '@/assets/greenwoods-achtergrond.jpg';
import logo from '@/assets/greenwoods-logo.png';
import natuur from '@/assets/natuurcoaching.jpg';
import { Cta } from '@/components/Cta/Cta';
import { Section } from '@/components/Section/Section';
import { pageMetadata } from '@/lib/metadata';

import './page.css';

export const metadata: Metadata = pageMetadata({
  title: 'Greenwoods: retraites en spiritual direction',
  description:
    'Greenwoods is de plek van Redwoods voor spiritualiteit, zingeving en de innerlijke weg: spiritual direction, retraites in de natuur en leiderschapsontwikkeling.',
  path: '/greenwoods/',
  image: bg,
});

export default function GreenwoodsPage() {
  return (
    <>
      <section className="rw-gw-hero">
        <Image src={bg} alt="" width={1920} height={980} priority sizes="100vw" className="rw-gw-hero__bg" />
        <div className="rw-container rw-gw-hero__inner">
          <Image src={logo} alt="Greenwoods People Services" width={360} height={155} priority className="rw-gw-hero__logo" />
          <p className="rw-eyebrow rw-gw-hero__eyebrow">Greenwoods</p>
          <h1 className="rw-gw-hero__title">Leven vanuit de diepte. Een plek om te wortelen, te groeien en te bloeien.</h1>
          <p className="rw-measure rw-gw-hero__intro">
            Greenwoods is de plek waar onze begeleiding op het gebied van spiritualiteit, zingeving en de innerlijke weg een thuis heeft
            gevonden. Voor mensen en leiders die door een overgangsperiode gaan, merken dat oude structuren niet meer werken en verlangen
            naar vernieuwing van binnenuit.
          </p>
        </div>
      </section>

      <Section>
        <div className="rw-prose rw-gw__narrow">
          <h2>Dezelfde wortels als Redwoods</h2>
          <p>
            Greenwoods is ontstaan vanuit de overtuiging dat echte verandering ontstaat waar groei en kwetsbaarheid elkaar ontmoeten. Waar
            Redwoods zich richt op therapie, coaching en relatiebegeleiding, biedt Greenwoods een huis voor spiritualiteit, innerlijke
            verdieping en de weg van de ziel. Spiritual direction was eerst onderdeel van Redwoods; nu vind je het, samen met retraites en
            andere verdiepende trajecten, bij Greenwoods.
          </p>
        </div>
      </Section>

      <Section surface="subtle">
        <h2 className="rw-gw__h2">Wat je bij Greenwoods kunt vinden</h2>
        <div className="rw-gw__cards">
          <div className="rw-gw__card">
            <h3 className="rw-gw__card-title">Spiritual direction</h3>
            <p className="rw-gw__card-text">
              Individueel of in een groep leer je luisteren naar de diepere lagen van je leven: naar je innerlijke grond, naar de stem van
              God, naar wat werkelijk leven, rust en ruimte geeft. De begeleiding is contemplatief, liefdevol en holistisch, met aandacht
              voor jou als geheel mens.
            </p>
          </div>
          <div className="rw-gw__card" id="retraites">
            <h3 className="rw-gw__card-title">Retraites</h3>
            <p className="rw-gw__card-text">
              Momenten en plekken om tot rust te komen en je opnieuw te oriënteren: retraites in de natuur, dagen van stilte en bezinning,
              ruimtes waar je kunt &apos;ontstappen&apos; aan de drukte en weer thuiskomen bij jezelf.
            </p>
          </div>
          <div className="rw-gw__card">
            <h3 className="rw-gw__card-title">Leiderschapsontwikkeling</h3>
            <p className="rw-gw__card-text">
              Trajecten voor leiders en teams die zoeken naar leidinggeven dat dieper geworteld is in authenticiteit, relationeel en
              verantwoord is, en duurzaam in plaats van uitputtend. Leiderschap vanuit heelheid en verbondenheid.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="rw-gw__grid">
          <Image src={natuur} alt="Wandelaars in een bos bij ochtendlicht" width={1000} height={571} sizes="(min-width: 1024px) 50vw, 100vw" className="rw-gw__photo" />
          <div className="rw-prose">
            <h2>Natuurcoaching: groei in en door de natuur</h2>
            <p>
              Zonder getrainde zintuigen mis je zomaar een boodschap, een aanwijzing of een stuk verwondering. Bij natuurcoaching train je
              je vijf zintuigen én je intuïtie, zodat je weer in verbinding komt met je omgeving, met je verleden, met de ander en met de
              Schepper. Natuurcoaching bieden we individueel aan, als wandelcoaching, en in groepsretraites.
            </p>
            <p>
              <a href="/contact/">Vraag naar de mogelijkheden</a> of lees meer over <a href="/diensten/coaching/">coaching bij Redwoods</a>.
            </p>
          </div>
        </div>
      </Section>

      <Cta
        title="Benieuwd naar Greenwoods?"
        text="Vertel ons waar je naar verlangt. We denken graag mee over spiritual direction, een retraite of een traject voor je team."
        secondary={{ label: 'Ons team', href: '/team/' }}
      />
    </>
  );
}
