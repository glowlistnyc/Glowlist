'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './Nav.module.css';

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        Glowlist <span>NYC</span>
      </Link>

      <ul className={`${styles.links} ${open ? styles.open : ''}`}>
        <li><Link href="/#spots" onClick={() => setOpen(false)}>Nails</Link></li>
        <li><Link href="/#spots" onClick={() => setOpen(false)}>Lashes</Link></li>
        <li><Link href="/area" onClick={() => setOpen(false)}>Areas</Link></li>
        <li><Link href="/service" onClick={() => setOpen(false)}>Services</Link></li>
        <li><Link href="/blog" onClick={() => setOpen(false)}>Blog</Link></li>
        <li>
          <a href="https://www.instagram.com/glowlist_nyc/" target="_blank" rel="noopener">
            Instagram ↗
          </a>
        </li>
      </ul>

      <button
        className={styles.ham}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open menu"
        aria-expanded={open}
      >
        <span /><span /><span />
      </button>
    </nav>
  );
}
