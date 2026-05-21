'use client';
import { useState } from 'react';
import Link from 'next/link';
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

  const toggle = (key: string) =>
    setExpanded((prev) => (prev === key ? null : key));

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        Glowlist <span>NYC</span>
      </Link>

      {/* ── Desktop ── */}
      <ul className={styles.links}>
        <li className={styles.dropdown}>
          <Link href="/area" className={styles.dropTrigger}>Areas</Link>
          <div className={styles.dropMenu}>
            {AREAS.map((a) => (
              <Link key={a.href} href={a.href} className={styles.dropItem}>{a.label}</Link>
            ))}
            <Link href="/area" className={`${styles.dropItem} ${styles.dropAll}`}>All Areas →</Link>
          </div>
        </li>
        <li className={styles.dropdown}>
          <Link href="/service" className={styles.dropTrigger}>Services</Link>
          <div className={styles.dropMenu}>
            {SERVICES.map((s) => (
              <Link key={s.href} href={s.href} className={styles.dropItem}>{s.label}</Link>
            ))}
            <Link href="/service" className={`${styles.dropItem} ${styles.dropAll}`}>All Services →</Link>
          </div>
        </li>
        <li><Link href="/blog">Blog</Link></li>
        <li>
          <a href="https://www.instagram.com/glowlist_nyc/" target="_blank" rel="noopener">
            Instagram ↗
          </a>
        </li>
      </ul>

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
          {/* Areas */}
          <div className={styles.mobileGroup}>
            <button className={styles.mobileToggle} onClick={() => toggle('areas')}>
              Areas <span>{expanded === 'areas' ? '▲' : '▼'}</span>
            </button>
            {expanded === 'areas' && (
              <div className={styles.mobileSub}>
                {AREAS.map((a) => (
                  <Link key={a.href} href={a.href} className={styles.mobileSubItem} onClick={() => setMobileOpen(false)}>
                    {a.label}
                  </Link>
                ))}
                <Link href="/area" className={`${styles.mobileSubItem} ${styles.mobileSubAll}`} onClick={() => setMobileOpen(false)}>
                  All Areas →
                </Link>
              </div>
            )}
          </div>
          {/* Services */}
          <div className={styles.mobileGroup}>
            <button className={styles.mobileToggle} onClick={() => toggle('services')}>
              Services <span>{expanded === 'services' ? '▲' : '▼'}</span>
            </button>
            {expanded === 'services' && (
              <div className={styles.mobileSub}>
                {SERVICES.map((s) => (
                  <Link key={s.href} href={s.href} className={styles.mobileSubItem} onClick={() => setMobileOpen(false)}>
                    {s.label}
                  </Link>
                ))}
                <Link href="/service" className={`${styles.mobileSubItem} ${styles.mobileSubAll}`} onClick={() => setMobileOpen(false)}>
                  All Services →
                </Link>
              </div>
            )}
          </div>
          <Link href="/blog" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Blog</Link>
          <a href="https://www.instagram.com/glowlist_nyc/" target="_blank" rel="noopener" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
            Instagram ↗
          </a>
        </div>
      )}
    </nav>
  );
}
