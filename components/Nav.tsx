'use client';
import { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './Nav.module.css';

const AREAS = [
  { label: 'SoHo / West Village', href: '/area/soho' },
  { label: 'Lower East Side',     href: '/area/lower-east-side' },
  { label: 'NoMad',               href: '/area/nomad' },
  { label: 'Chelsea / Flatiron',  href: '/area/chelsea' },
  { label: 'Midtown',             href: '/area/midtown' },
  { label: 'Upper East Side',     href: '/area/upper-east-side' },
  { label: 'Williamsburg',        href: '/area/williamsburg' },
  { label: 'Brooklyn',            href: '/area/brooklyn' },
];

const SERVICES = [
  { label: 'Japanese Gel Nails', href: '/service/japanese-gel-nails' },
  { label: 'Korean Lash Lift',   href: '/service/korean-lash-lift' },
  { label: 'Lash Extensions',    href: '/service/lash-extensions' },
  { label: 'Brow Lamination',    href: '/service/brow-lamination' },
  { label: 'Head Spa',           href: '/service/head-spa' },
  { label: 'Gel-X Extensions',   href: '/service/gel-x-extensions' },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { t } = useLanguage();
  const toggle = (key: string) => setExpanded((prev) => (prev === key ? null : key));

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        Glowlist <span>NYC</span>
      </Link>

      {/* ── Desktop ── */}
      <ul className={styles.links}>
        <li className={styles.dropdown}>
          <Link href="/area" className={styles.dropTrigger}>{t.nav.areas}</Link>
          <div className={styles.dropMenu}>
            {AREAS.map((a) => (
              <Link key={a.href} href={a.href} className={styles.dropItem}>{a.label}</Link>
            ))}
            <Link href="/area" className={`${styles.dropItem} ${styles.dropAll}`}>{t.nav.allAreas}</Link>
          </div>
        </li>
        <li className={styles.dropdown}>
          <Link href="/service" className={styles.dropTrigger}>{t.nav.services}</Link>
          <div className={styles.dropMenu}>
            {SERVICES.map((s) => (
              <Link key={s.href} href={s.href} className={styles.dropItem}>{s.label}</Link>
            ))}
            <Link href="/service" className={`${styles.dropItem} ${styles.dropAll}`}>{t.nav.allServices}</Link>
          </div>
        </li>
        <li><Link href="/blog">{t.nav.blog}</Link></li>
        <li><Link href="/about">{t.nav.about}</Link></li>
        <li><Link href="/contact">{t.nav.contact}</Link></li>
        <li>
          <a href="https://www.instagram.com/glowlist_nyc/" target="_blank" rel="noopener">
            Instagram ↗
          </a>
        </li>
      </ul>

      {/* ── Language Switcher ── */}
      <LanguageSwitcher />

      {/* ── Hamburger ── */}
      <button
        className={styles.ham}
        onClick={() => { setMobileOpen((v) => !v); setExpanded(null); }}
        aria-label="Toggle menu"
        aria-expanded={mobileOpen}
      >
        <span /><span /><span />
      </button>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileGroup}>
            <button className={styles.mobileToggle} onClick={() => toggle('areas')}>
              {t.nav.areas} <span>{expanded === 'areas' ? '▲' : '▼'}</span>
            </button>
            {expanded === 'areas' && (
              <div className={styles.mobileSub}>
                {AREAS.map((a) => (
                  <Link key={a.href} href={a.href} className={styles.mobileSubItem} onClick={() => setMobileOpen(false)}>
                    {a.label}
                  </Link>
                ))}
                <Link href="/area" className={`${styles.mobileSubItem} ${styles.mobileSubAll}`} onClick={() => setMobileOpen(false)}>
                  {t.nav.allAreas}
                </Link>
              </div>
            )}
          </div>
          <div className={styles.mobileGroup}>
            <button className={styles.mobileToggle} onClick={() => toggle('services')}>
              {t.nav.services} <span>{expanded === 'services' ? '▲' : '▼'}</span>
            </button>
            {expanded === 'services' && (
              <div className={styles.mobileSub}>
                {SERVICES.map((s) => (
                  <Link key={s.href} href={s.href} className={styles.mobileSubItem} onClick={() => setMobileOpen(false)}>
                    {s.label}
                  </Link>
                ))}
                <Link href="/service" className={`${styles.mobileSubItem} ${styles.mobileSubAll}`} onClick={() => setMobileOpen(false)}>
                  {t.nav.allServices}
                </Link>
              </div>
            )}
          </div>
          <Link href="/blog" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>{t.nav.blog}</Link>
          <Link href="/about" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>{t.nav.about}</Link>
          <Link href="/contact" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>{t.nav.contact}</Link>
          <a href="https://www.instagram.com/glowlist_nyc/" target="_blank" rel="noopener" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
            Instagram ↗
          </a>
          {/* Language switcher in mobile */}
          <div className={styles.mobileLang}>
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </nav>
  );
}
