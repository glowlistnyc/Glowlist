'use client';
import { useState, useMemo } from 'react';
import SalonCard from './SalonCard';
import type { Salon, FilterState } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './FilteredSalonList.module.css';

const INITIAL_SHOW = 6; // 最初に表示する件数

interface Props {
  salons: Salon[];
  googlePhotos?: Record<string, string>; // salonId → Google photo proxy URL
}

const AREA_MAP: Record<string, { big: string; sub: string }> = {
  'soho': { big: 'manhattan', sub: 'SoHo / West Village' },
  'west village': { big: 'manhattan', sub: 'SoHo / West Village' },
  'tribeca': { big: 'manhattan', sub: 'Tribeca' },
  'lower east side': { big: 'manhattan', sub: 'Lower East Side' },
  'lower manhattan': { big: 'manhattan', sub: 'Lower Manhattan' },
  'chinatown': { big: 'manhattan', sub: 'Lower Manhattan' },
  'nomad': { big: 'manhattan', sub: 'NoMad' },
  'chelsea': { big: 'manhattan', sub: 'Chelsea / Flatiron' },
  'flatiron': { big: 'manhattan', sub: 'Chelsea / Flatiron' },
  'union square': { big: 'manhattan', sub: 'Union Square' },
  'murray hill': { big: 'manhattan', sub: 'Midtown East / Murray Hill' },
  'midtown east': { big: 'manhattan', sub: 'Midtown East / Murray Hill' },
  'k-town': { big: 'manhattan', sub: 'K-Town / Midtown' },
  'ktown': { big: 'manhattan', sub: 'K-Town / Midtown' },
  'midtown': { big: 'manhattan', sub: 'Midtown' },
  'fifth ave': { big: 'manhattan', sub: 'Midtown' },
  'upper west': { big: 'manhattan', sub: 'Upper West Side' },
  'upper east': { big: 'manhattan', sub: 'Upper East Side' },
  'manhattan': { big: 'manhattan', sub: 'Manhattan' },
  'williamsburg': { big: 'brooklyn', sub: 'Williamsburg' },
  'brooklyn': { big: 'brooklyn', sub: 'Brooklyn' },
  'long island city': { big: 'queens', sub: 'Long Island City' },
  'queens': { big: 'queens', sub: 'Queens' },
};

function classifyArea(raw: string) {
  const a = raw.toLowerCase();
  for (const [key, val] of Object.entries(AREA_MAP)) {
    if (a.includes(key)) return val;
  }
  return { big: 'other', sub: raw };
}

function extractMinPrice(s: string): number | null {
  const m = s.match(/\$(\d[\d,]*)/);
  return m ? parseInt(m[1].replace(',', ''), 10) : null;
}

export default function FilteredSalonList({ salons, googlePhotos = {} }: Props) {
  const [showAll, setShowAll] = useState(false);
  const { t, lang } = useLanguage();
  const [filters, setFilters] = useState<FilterState>({
    service: 'all', areaBig: 'all', areaSub: 'all', price: 'all',
  });

  const enriched = useMemo(() => salons.map((s) => ({
    ...s,
    _area: classifyArea(s.fields.area),
    _minPrice: extractMinPrice(s.fields.priceRange),
  })), [salons]);

  const subAreas = useMemo(() => {
    if (filters.areaBig === 'all') return [];
    const subs = new Set(enriched.filter((s) => s._area.big === filters.areaBig).map((s) => s._area.sub));
    return Array.from(subs).sort();
  }, [enriched, filters.areaBig]);

  const filtered = useMemo(() => {
    const f = enriched.filter((s) => {
      if (filters.service !== 'all' && s.fields.category !== filters.service && s.fields.category !== 'both') return false;
      if (filters.areaBig !== 'all' && s._area.big !== filters.areaBig) return false;
      if (filters.areaSub !== 'all' && s._area.sub !== filters.areaSub) return false;
      if (filters.price !== 'all' && s._minPrice !== null) {
        const [lo, hi] = filters.price.split('-').map(Number);
        if (s._minPrice < lo || s._minPrice > hi) return false;
      }
      return true;
    });
    // featured → verified → アルファベット順
    return f.sort((a, b) => {
      if (a.fields.featured && !b.fields.featured) return -1;
      if (!a.fields.featured && b.fields.featured) return 1;
      if (a.fields.verified && !b.fields.verified) return -1;
      if (!a.fields.verified && b.fields.verified) return 1;
      return a.fields.name.localeCompare(b.fields.name);
    });
  }, [enriched, filters]);

  function setFilter<K extends keyof FilterState>(key: K, val: FilterState[K]) {
    setFilters((prev) => ({
      ...prev,
      [key]: val,
      ...(key === 'areaBig' ? { areaSub: 'all' } : {}),
    }));
  }

  function reset() {
    setFilters({ service: 'all', areaBig: 'all', areaSub: 'all', price: 'all' });
  }

  const hasFilter = filters.service !== 'all' || filters.areaBig !== 'all' || filters.price !== 'all';

  const summaryParts: string[] = [];
  if (filters.service !== 'all') summaryParts.push(filters.service.charAt(0).toUpperCase() + filters.service.slice(1));
  if (filters.areaBig !== 'all') {
    let loc = filters.areaBig.charAt(0).toUpperCase() + filters.areaBig.slice(1);
    if (filters.areaSub !== 'all') loc += `, ${filters.areaSub}`;
    summaryParts.push(loc);
  }
  if (filters.price !== 'all') summaryParts.push(filters.price);

  const priceLabels: Record<string, string> = {
    'all': t.filters.priceAll, '0-80': 'Under $80', '81-150': '$81–$150', '151-9999': '$150+',
  };

  // "From $XX" プレフィックスを現在の言語に合わせて変換
  const fmtPrice = (p: string) => {
    if (!p || lang === 'en') return p;
    if (p.startsWith('From ')) {
      const amt = p.replace('From ', '');
      const sfx = t.filters.priceFrom;
      return (lang === 'ja' || lang === 'ko') ? `${amt}${sfx}` : `${sfx}${amt}`;
    }
    return p;
  };

  return (
    <div>
      <div className={styles.panel}>
        {/* Service */}
        <p className={styles.rowLabel}>{t.filters.service}</p>
        <div className={styles.chips}>
          {(['all', 'nails', 'lashes'] as const).map((v) => (
            <button key={v} className={`${styles.chip} ${filters.service === v ? styles.active : ''}`}
              onClick={() => setFilter('service', v)}>
              {v === 'all' ? t.filters.all : v === 'nails' ? t.filters.nails : t.filters.lashes}
            </button>
          ))}
        </div>

        {/* Area big */}
        <p className={styles.rowLabel}>{t.filters.area}</p>
        <div className={styles.chips}>
          {(['all', 'manhattan', 'brooklyn', 'queens'] as const).map((v) => (
            <button key={v} className={`${styles.chip} ${filters.areaBig === v ? styles.active : ''}`}
              onClick={() => setFilter('areaBig', v)}>
              {v === 'all' ? t.filters.all : t.filters[v as 'manhattan'|'brooklyn'|'queens']}
            </button>
          ))}
        </div>

        {/* Area sub */}
        {subAreas.length > 1 && (
          <div className={`${styles.chips} ${styles.subChips}`}>
            <button className={`${styles.chip} ${styles.sub} ${filters.areaSub === 'all' ? styles.active : ''}`}
              onClick={() => setFilter('areaSub', 'all')}>
              {t.filters.all} {filters.areaBig !== 'all' ? t.filters[filters.areaBig as 'manhattan'|'brooklyn'|'queens'] : ''}
            </button>
            {subAreas.map((sub) => (
              <button key={sub} className={`${styles.chip} ${styles.sub} ${filters.areaSub === sub ? styles.active : ''}`}
                onClick={() => setFilter('areaSub', sub)}>
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* Price */}
        <p className={styles.rowLabel}>{t.filters.price}</p>
        <div className={styles.chips}>
          {(['all', '0-80', '81-150', '151-9999'] as const).map((v) => (
            <button key={v} className={`${styles.chip} ${filters.price === v ? styles.active : ''}`}
              onClick={() => setFilter('price', v as FilterState['price'])}>
              {priceLabels[v]}
            </button>
          ))}
        </div>

        {/* Summary */}
        <div className={styles.summary}>
          <p>
            {t.filters.showing} <strong>{filtered.length}</strong> {t.filters.spots}{filtered.length !== 1 && lang === 'en' ? 's' : ''}
            {summaryParts.length > 0 && ` — ${summaryParts.join(' · ')}`}
          </p>
          {hasFilter && (
            <button className={styles.reset} onClick={reset}>{t.filters.reset}</button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            No spots match your filters.{' '}
            <button onClick={reset} className={styles.resetInline}>{t.filters.reset}</button>
          </div>
        ) : (
          (showAll ? filtered : filtered.slice(0, INITIAL_SHOW)).map((s) => (
            <SalonCard
              key={s.sys.id}
              salon={s}
              googlePhotoUrl={googlePhotos[s.sys.id]}
              fmtPrice={fmtPrice}
            />
          ))
        )}
      </div>

      {/* View more / Collapse */}
      {filtered.length > INITIAL_SHOW && (
        <div className={styles.viewMore}>
          <button
            className={styles.viewMoreBtn}
            onClick={() => setShowAll(v => !v)}
          >
            {showAll
              ? '↑ Show less'
              : `View more (${filtered.length - INITIAL_SHOW} more spots) →`}
          </button>
        </div>
      )}
    </div>
  );
}
