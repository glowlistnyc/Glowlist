'use client';
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { Area } from '@/types';
import type { SalonPin } from '@/lib/salonPins';
import styles from './AreaIndexClient.module.css';

const MapClient = dynamic(() => import('@/components/MapClient'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '520px', background: '#222b45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#a08a68', fontSize: '.8rem', letterSpacing: '.1em', textTransform: 'uppercase' }}>Loading map…</p>
    </div>
  ),
});

type BigArea = 'all' | 'manhattan' | 'brooklyn' | 'queens';
const BIG_LABELS: Record<BigArea, string> = {
  all: 'All NYC', manhattan: 'Manhattan', brooklyn: 'Brooklyn', queens: 'Queens',
};

interface Props { areas: Area[]; pins: SalonPin[] }

export default function AreaIndexClient({ areas, pins }: Props) {
  const [bigFilter, setBigFilter] = useState<BigArea>('all');
  const [subFilter, setSubFilter] = useState<string | null>(null);

  const countBySlug = useMemo(() => {
    const c: Record<string, number> = {};
    pins.forEach((p) => { c[p.areaSlug] = (c[p.areaSlug] || 0) + 1; });
    return c;
  }, [pins]);

  const subAreas = useMemo(() =>
    bigFilter === 'all' ? [] : areas.filter(a => a.fields.bigArea === bigFilter),
  [areas, bigFilter]);

  const focusPins = useMemo(() => {
    if (subFilter) return pins.filter(p => p.areaSlug === subFilter);
    if (bigFilter !== 'all') {
      const slugSet = new Set(subAreas.map(a => a.fields.slug));
      return pins.filter(p => slugSet.has(p.areaSlug));
    }
    return pins;
  }, [pins, bigFilter, subFilter, subAreas]);

  function handleBig(val: BigArea) { setBigFilter(val); setSubFilter(null); }
  function handleSub(slug: string) { setSubFilter(prev => prev === slug ? null : slug); }

  const hintText = useMemo(() => {
    if (subFilter) {
      const area = areas.find(a => a.fields.slug === subFilter);
      const n = focusPins.length;
      return `${n} spot${n !== 1 ? 's' : ''} in ${area?.fields.name ?? subFilter}. Tap a pin for salon details.`;
    }
    if (bigFilter !== 'all') {
      return `${focusPins.length} spot${focusPins.length !== 1 ? 's' : ''} in ${BIG_LABELS[bigFilter]}. Select a neighborhood to zoom in.`;
    }
    return `${pins.length} spots across NYC. Select a borough or neighborhood to filter.`;
  }, [subFilter, bigFilter, focusPins, pins, areas]);

  return (
    <div>
      {/* ── 1段目：ボロフィルター ── */}
      <div className={styles.filterBlock}>
        <p className={styles.rowLabel}>Borough</p>
        <div className={styles.chips}>
          {(['all', 'manhattan', 'brooklyn', 'queens'] as BigArea[]).map((opt) => (
            <button
              key={opt}
              className={`${styles.chip} ${bigFilter === opt ? styles.chipActive : ''}`}
              onClick={() => handleBig(opt)}
            >
              {BIG_LABELS[opt]}
            </button>
          ))}
        </div>

        {/* ── 2段目：ネイバーフッドチップ ── */}
        {subAreas.length > 0 && (
          <>
            <p className={styles.rowLabel} style={{ marginTop: '.8rem' }}>Neighborhood</p>
            <div className={styles.chips}>
              <button
                className={`${styles.chip} ${styles.chipSub} ${subFilter === null ? styles.chipActive : ''}`}
                onClick={() => setSubFilter(null)}
              >
                All {BIG_LABELS[bigFilter]}
              </button>
              {subAreas.map((area) => {
                const count = countBySlug[area.fields.slug] ?? 0;
                return (
                  <button
                    key={area.fields.slug}
                    className={`${styles.chip} ${styles.chipSub} ${subFilter === area.fields.slug ? styles.chipActive : ''}`}
                    onClick={() => handleSub(area.fields.slug)}
                  >
                    {area.fields.name}
                    {count > 0 && <span className={styles.chipCount}>{count}</span>}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── マップのみ（カードリストなし）── */}
      <div className={styles.mapWrap}>
        <MapClient pins={focusPins} height="520px" />
        <p className={styles.mapHint}>{hintText}</p>
      </div>
    </div>
  );
}
