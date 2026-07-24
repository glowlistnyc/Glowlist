'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Salon } from '@/types';
import styles from './SearchBar.module.css';

interface Props { salons: Salon[] }

const CAT_LABEL: Record<string, string> = {
  nails: 'Gel Nails', lashes: 'Lashes', both: 'Nails & Lashes',
};

export default function SearchBar({ salons }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return salons.filter((s) => {
      const { name, area, tags, category } = s.fields;
      return (
        name.toLowerCase().includes(q) ||
        area.toLowerCase().includes(q) ||
        tags.some((t) => t.toLowerCase().includes(q)) ||
        CAT_LABEL[category]?.toLowerCase().includes(q)
      );
    }).slice(0, 7);
  }, [query, salons]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleSelect(slug: string) {
    setQuery('');
    setOpen(false);
    router.push(`/salon/${slug}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && results.length > 0) {
      handleSelect(results[0].fields.slug);
    }
    if (e.key === 'Escape') setOpen(false);
  }

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div className={styles.inputRow}>
        <span className={styles.icon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7" />
            <path d="M16.5 16.5l4 4" strokeLinecap="round" />
          </svg>
        </span>
        <input
          className={styles.input}
          type="search"
          placeholder="Search by salon, area, or style (e.g. Japanese gel, Williamsburg)"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search salons"
          autoComplete="off"
        />
        {query && (
          <button className={styles.clear} onClick={() => { setQuery(''); setOpen(false); }} aria-label="Clear">✕</button>
        )}
      </div>

      {open && results.length > 0 && (
        <ul className={styles.dropdown} role="listbox">
          {results.map((s) => (
            <li key={s.sys.id} role="option">
              <button className={styles.result} onClick={() => handleSelect(s.fields.slug)}>
                <span className={styles.resultName}>{s.fields.name}</span>
                <span className={styles.resultMeta}>{s.fields.area} · {CAT_LABEL[s.fields.category]}</span>
              </button>
            </li>
          ))}
          <li className={styles.hint}>Press Enter to open first result</li>
        </ul>
      )}

      {open && query.trim() && results.length === 0 && (
        <div className={styles.noResult}>No salons found for &ldquo;{query}&rdquo;</div>
      )}
    </div>
  );
}
