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

interface Props {
  areas: Area[];
  pins: SalonPin[];
}

const BIG_LABELS: Record<BigArea, string> = {
  all: 'All NYC',
  manhattan: 'Manhattan',
  brooklyn: 'Brooklyn',
  queens: 'Queens',
};

// ボロごとのフォーカス座標・ズーム
const BIG_FOCUS: Record<string, { lat: number; lng: number; zoom: number }> = {
  manhattan: { lat: 40.760, lng: -73.980, zoom: 13 },
  brooklyn:  { lat: 40.700, lng: -73.975, zoom: 13 },
  queens:    { lat: 40.748, lng: -73.948, zoom: 13 },
};

export default function AreaIndexClient({ areas, pins }: Props) {
  const [bigFilter, setBigFilter] = useState<BigArea>('all');

  // エリアごとのサロン数
  const countBySlug = useMemo(() => {
    const c: Record<string, number> = {};
    pins.forEach((p) => { c[p.areaSlug] = (c[p.areaSlug] || 0) + 1; });
    return c;
  }, [pins]);

  // 表示するエリアリスト（bigFilter でフィルタ）
  const filteredAreas = useMemo(
    () => bigFilter === 'all' ? areas : areas.filter(a => a.fields.bigArea === bigFilter),
    [areas, bigFilter]
  );

  // マップのズーム対象（bigFilter が all 以外 → そのボロのピンのみ）
  const focusPins = useMemo(
    () => bigFilter === 'all' ? pins : pins.filter(p => {
      const area = areas.find(a => a.fields.slug === p.areaSlug);
      return area?.fields.bigArea === bigFilter;
    }),
    [pins, bigFilter, areas]
  );

  const byBig = useMemo(() =>
    filteredAreas.reduce<Record<string, typeof areas>>((acc, a) => {
      const big = a.fields.bigArea;
      if (!acc[big]) acc[big] = [];
      acc[big].push(a);
      return acc;
    }, {}),
  [filteredAreas]);

  const bigOptions: BigArea[] = ['all', 'manhattan', 'brooklyn', 'queens'];

  return (
    <div>
      {/* ── ボロ選択フィルター（マップズーム制御） ── */}
      <div className={styles.filterRow}>
        <p className={styles.filterLabel}>Filter by borough</p>
        <div className={styles.chips}>
          {bigOptions.map((opt) => (
            <button
              key={opt}
              className={`${styles.chip} ${bigFilter === opt ? styles.chipActive : ''}`}
              onClick={() => setBigFilter(opt)}
            >
              {BIG_LABELS[opt]}
            </button>
          ))}
        </div>
      </div>

      {/* ── マップ（bigFilterに連動してズーム） ── */}
      <div className={styles.mapWrap}>
        <MapClient
          pins={focusPins}
          height="480px"
          activeAreaSlug={bigFilter !== 'all' ? bigFilter + '-focus' : null}
        />
        <p className={styles.mapHint}>
          {bigFilter === 'all'
            ? `${pins.length} spots across NYC. Tap a pin to see salon details.`
            : `${focusPins.length} spot${focusPins.length !== 1 ? 's' : ''} in ${BIG_LABELS[bigFilter]}. Tap a pin for details.`
          }
        </p>
      </div>

      {/* ── エリアカードリスト（クリック→ページ遷移） ── */}
      <div className={styles.areaSection}>
        {(['manhattan', 'brooklyn', 'queens'] as const)
          .filter((big) => (byBig[big] ?? []).length > 0)
          .map((big) => (
            <div key={big} className={styles.group}>
              <h2 className={styles.groupTitle}>
                {BIG_LABELS[big]}
              </h2>
              <div className={styles.grid}>
                {(byBig[big] ?? []).map((area) => {
                  const count = countBySlug[area.fields.slug] ?? 0;
                  return (
                    <Link
                      key={area.sys.id}
                      href={`/area/${area.fields.slug}`}
                      className={styles.card}
                    >
                      <span className={styles.cardInner}>
                        <span className={styles.areaName}>{area.fields.name}</span>
                        {count > 0 && (
                          <span className={styles.count}>{count} spot{count !== 1 ? 's' : ''}</span>
                        )}
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
