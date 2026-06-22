'use client';
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { Area } from '@/types';
import type { SalonPin } from '@/lib/salonPins';
import styles from './AreaIndexClient.module.css';

const MapClient = dynamic(() => import('@/components/MapClient'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '480px', background: '#222b45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#a08a68', fontSize: '.8rem', letterSpacing: '.1em', textTransform: 'uppercase' }}>Loading map…</p>
    </div>
  ),
});

type BigArea = 'all' | 'manhattan' | 'brooklyn' | 'queens';
const BIG_LABELS: Record<BigArea, string> = {
  all: 'All NYC',
  manhattan: 'Manhattan',
  brooklyn: 'Brooklyn',
  queens: 'Queens',
};

interface Props { areas: Area[]; pins: SalonPin[] }

export default function AreaIndexClient({ areas, pins }: Props) {
  const [bigFilter, setBigFilter] = useState<BigArea>('all');
  const [subFilter, setSubFilter] = useState<string | null>(null);

  // サロン数
  const countBySlug = useMemo(() => {
    const c: Record<string, number> = {};
    pins.forEach((p) => { c[p.areaSlug] = (c[p.areaSlug] || 0) + 1; });
    return c;
  }, [pins]);

  // 2段目チップ（選択ボロのエリア一覧）
  const subAreas = useMemo(() =>
    bigFilter === 'all' ? [] : areas.filter(a => a.fields.bigArea === bigFilter),
  [areas, bigFilter]);

  // マップに表示するピン
  const focusPins = useMemo(() => {
    if (subFilter) return pins.filter(p => p.areaSlug === subFilter);
    if (bigFilter !== 'all') {
      const slugSet = new Set(subAreas.map(a => a.fields.slug));
      return pins.filter(p => slugSet.has(p.areaSlug));
    }
    return pins;
  }, [pins, bigFilter, subFilter, subAreas]);

  // カードリストに表示するエリア（サロンがあるものを優先、全部表示）
  const displayedAreas = useMemo(() => {
    if (bigFilter === 'all') return areas;
    return subAreas;
  }, [areas, bigFilter, subAreas]);

  const byBig = useMemo(() =>
    displayedAreas.reduce<Record<string, typeof areas>>((acc, a) => {
      const big = a.fields.bigArea;
      if (!acc[big]) acc[big] = [];
      acc[big].push(a);
      return acc;
    }, {}),
  [displayedAreas]);

  function handleBig(val: BigArea) {
    setBigFilter(val);
    setSubFilter(null);
  }
  function handleSub(slug: string) {
    setSubFilter(prev => prev === slug ? null : slug);
  }

  // 現在のフィルター状態の説明文
  const hintText = useMemo(() => {
    if (subFilter) {
      const area = areas.find(a => a.fields.slug === subFilter);
      const n = focusPins.length;
      return `${n} spot${n !== 1 ? 's' : ''} in ${area?.fields.name ?? subFilter}. Tap a pin for details.`;
    }
    if (bigFilter !== 'all') {
      return `${focusPins.length} spot${focusPins.length !== 1 ? 's' : ''} in ${BIG_LABELS[bigFilter]}. Select a neighborhood below to zoom in further.`;
    }
    return `${pins.length} spots across NYC. Select a borough to filter, or click an area card to browse.`;
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

        {/* ── 2段目：ネイバーフッドチップ（ボロ選択後に展開） ── */}
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

      {/* ── マップ ── */}
      <div className={styles.mapWrap}>
        <MapClient pins={focusPins} height="480px" />
        <p className={styles.mapHint}>{hintText}</p>
      </div>

      {/* ── エリアカード（クリック → /area/[slug] へ遷移） ── */}
      <div className={styles.areaSection}>
        {(['manhattan', 'brooklyn', 'queens'] as const)
          .filter(big => bigFilter === 'all' || bigFilter === big)
          .filter(big => (byBig[big] ?? []).length > 0)
          .map((big) => (
            <div key={big} className={styles.group}>
              <h2 className={styles.groupTitle}>{BIG_LABELS[big]}</h2>
              <div className={styles.grid}>
                {(byBig[big] ?? []).map((area) => {
                  const count = countBySlug[area.fields.slug] ?? 0;
                  const isSubActive = subFilter === area.fields.slug;
                  return (
                    <Link
                      key={area.sys.id}
                      href={`/area/${area.fields.slug}`}
                      className={`${styles.card} ${isSubActive ? styles.cardHighlight : ''}`}
                    >
                      <span className={styles.cardInner}>
                        <span className={styles.areaName}>{area.fields.name}</span>
                        {count > 0
                          ? <span className={styles.count}>{count} spot{count !== 1 ? 's' : ''}</span>
                          : <span className={styles.countEmpty}>No spots yet</span>
                        }
                      </span>
                      <span className={styles.arrow}>→</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
