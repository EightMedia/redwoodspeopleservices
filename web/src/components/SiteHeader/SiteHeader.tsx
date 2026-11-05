'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import logo from '@/assets/logo-redwoods.png';
import { nav, site } from '@/data/site';

import './SiteHeader.css';

function ChevronIcon() {
  return (
    <svg className="rw-header__chevron" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/**
 * Site header (Astro `Header.astro`): logo, main menu with hover/focus dropdowns for
 * "Diensten" and "Programma's", a primary Contact button and a mobile menu toggle.
 * Client component: the active item follows the current path and the menu toggles.
 */
export function SiteHeader() {
  const pathname = usePathname() ?? '/';
  // The menu remembers the path it was opened on, so navigating closes it without an effect.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = (next: boolean | ((value: boolean) => boolean)) => {
    const value = typeof next === 'function' ? next(open) : next;
    setOpenedOn(value ? pathname : null);
  };

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="rw-header">
      <div className="rw-container rw-header__bar">
        <a href="/" className="rw-header__logo" aria-label={`${site.name}, naar de homepage`}>
          <Image src={logo} alt={site.name} width={230} height={53} priority className="rw-header__logo-img" />
        </a>

        <nav className="rw-header__nav" aria-label="Hoofdmenu">
          <ul className="rw-header__list">
            {nav.map((item) => (
              <li key={item.href} className="rw-header__item">
                <a
                  href={item.href}
                  className="rw-header__link"
                  data-active={isActive(item.href) ? '' : undefined}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.label}
                  {item.children ? <ChevronIcon /> : null}
                </a>
                {item.children ? (
                  <div className="rw-header__dropdown">
                    <ul className="rw-header__dropdown-list">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <a href={child.href} className="rw-header__dropdown-link">
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <div className="rw-header__actions">
          <a href="/contact/" className="rw-btn--primary rw-header__contact">
            Contact
          </a>
          <button
            type="button"
            className="rw-header__toggle"
            aria-controls="mobile-menu"
            aria-expanded={open}
            aria-label={open ? 'Menu sluiten' : 'Menu openen'}
            onClick={() => setOpen((value) => !value)}
          >
            <svg
              className="rw-header__toggle-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="rw-header__mobile" hidden={!open}>
        <nav className="rw-container rw-header__mobile-nav" aria-label="Mobiel menu">
          <ul className="rw-header__mobile-list">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="rw-header__mobile-link">
                  {item.label}
                </a>
                {item.children ? (
                  <ul className="rw-header__mobile-sublist">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <a href={child.href} className="rw-header__mobile-sublink">
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
            <li className="rw-header__mobile-cta">
              <a href="/contact/" className="rw-btn--primary rw-btn--block">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
