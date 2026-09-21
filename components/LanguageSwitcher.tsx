'use client';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LANGS } from '@/lib/i18n/translations';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const current = LANGS.find(l => l.code === lang);

  useEffect(() => {
    function onOut(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onOut);
    return () => document.removeEventListener('mousedown', onOut);
  }, []);

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        className={styles.trigger}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label="Select language"
      >
        <svg className={styles.globe} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9z"/>
          <path d="M3 12h18"/>
        </svg>
        <span className={styles.label}>{current?.label ?? 'EN'}</span>
        <span className={styles.chevron}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className={styles.menu} role="listbox">
          {LANGS.map(l => (
            <button
              key={l.code}
              role="option"
              aria-selected={lang === l.code}
              className={`${styles.item} ${lang === l.code ? styles.active : ''}`}
              onClick={() => { setLang(l.code); setOpen(false); }}
            >
              <span className={styles.itemLabel}>{l.label}</span>
              {l.sub && <span className={styles.itemSub}>{l.sub}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
