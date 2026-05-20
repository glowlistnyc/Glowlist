'use client';
import { useState, useMemo } from 'react';
import SalonCard from './SalonCard';
import type { Salon, FilterState } from '@/types';
import styles from './FilteredSalonList.module.css';

interface Props { salons: Salon[] }

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

export default function FilteredSalonList({ salons }: Props) {
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

  const filtered = useMemo(() => enriched.filter((s) => {
    if (filters.service !== 'all' && s.fields.category !== filters.service && s.fields.category !== 'both') return false;
    if (filters.areaBig !== 'all' && s._area.big !== filters.areaBig) return false;
    if (filters.areaSub !== 'all' && s._area.sub !== filters.areaSub) return false;
    if (filters.price !== 'all' && s._minPrice !== null) {
      const [lo, hi] = filters.price.split('-').map(Number);
      if (s._minPrice < lo || s._minPrice > hi) return false;
    }
    return true;
  }), [enriched, filters]);

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
  const pLabels: Record<string, string> = { '0-80': 'Under $80', '81-150': '$81–$150', '151-9999': '$150+' };
  if (filters.price !== 'all') summaryParts.push(pLabels[filters.price] ?? '');

  return (
    <div>
      <div className={styles.panel}>
        {/* Service */}
        <p className={styles.rowLabel}>Service</p>
        <div className={styles.chips}>
          {(['all', 'nails', 'lashes'] as const).map((v) => (
            <button key={v} className={`${styles.chip} ${filters.service === v ? styles.active : ''}`}
              onClick={() => setFilter('service', v)}>
              {v === 'all' ? 'All' : v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        {/* Area big */}
        <p className={styles.rowLabel}>Area</p>
        <div className={styles.chips}>
          {(['all', 'manhattan', 'brooklyn', 'queens'] as const).map((v) => (
            <button key={v} className={`${styles.chip} ${filters.areaBig === v ? styles.active : ''}`}
              onClick={() => setFilter('areaBig', v)}>
              {v === 'all' ? 'All' : v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        {/* Area sub */}
        {subAreas.length > 1 && (
          <div className={`${styles.chips} ${styles.subChips}`}>
            <button className={`${styles.chip} ${styles.sub} ${filters.areaSub === 'all' ? styles.active : ''}`}
              onClick={() => setFilter('areaSub', 'all')}>
              All {filters.areaBig.charAt(0).toUpperCase() + filters.areaBig.slice(1)}
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
        <p className={styles.rowLabel}>
          Price <span style={{ fontSize: '.6rem', opacity: .6, textTransform: 'none', letterSpacing: 0 }}>(starting from)</span>
        </p>
        <div className={styles.chips}>
          {([['all', 'All'], ['0-80', 'Under $80'], ['81-150', '$81–$150'], ['151-9999', '$150+']] as [string, string][]).map(([v, label]) => (
            <button key={v} className={`${styles.chip} ${filters.price === v ? styles.active : ''}`}
              onClick={() => setFilter('price', v as FilterState['price'])}>
              {label}
            </button>
          ))}
        </div>

        {/* Summary */}
        <div className={styles.summary}>
          <p>
            Showing <strong>{filtered.length}</strong> spot{filtered.length !== 1 ? 's' : ''}
            {summaryParts.length > 0 && ` — ${summaryParts.join(' · ')}`}
          </p>
          {hasFilter && (
            <button className={styles.reset} onClick={reset}>Clear all</button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            No spots match your filters.{' '}
            <button onClick={reset} className={styles.resetInline}>Clear filters</button>
          </div>
        ) : (
          filtered.map((s) => <SalonCard key={s.sys.id} salon={s} />)
        )}
      </div>
    </div>
  );
}
