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
    <div style={{ height: '520px', background: '#222b45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#a08a68', fontSize: '.8rem', letterSpacing: '.1em', textTransform: 'uppercase' }}>Loading map…</p>
    </div>
  ),
});

interface Props {
  areas: Area[];
  pins: SalonPin[];
}

export default function AreaIndexClient({ areas, pins }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  // エリアごとのサロン数
  const countBySlug = useMemo(() => {
    const c: Record<string, number> = {};
    pins.forEach((p) => { c[p.areaSlug] = (c[p.areaSlug] || 0) + 1; });
    return c;
  }, [pins]);

  const byBig = useMemo(() =>
    areas.reduce<Record<string, typeof areas>>((acc, a) => {
      const big = a.fields.bigArea;
      if (!acc[big]) acc[big] = [];
      acc[big].push(a);
      return acc;
    }, {}),
  [areas]);

  return (
    <div>
      {/* ── Map — activeSlug が変わるとズーム ── */}
      <div className={styles.mapWrap}>
        <MapClient pins={pins} height="520px" activeAreaSlug={activeSlug} />
        <p className={styles.mapHint}>
          {activeSlug
            ? `Showing ${countBySlug[activeSlug] ?? 0} spot${countBySlug[activeSlug] !== 1 ? 's' : ''} in this area. Tap a pin to view salon details.`
            : 'Click an area below to zoom in. Tap a pin for details.'}
        </p>
      </div>

      {/* ── Area list（クリックでマップズーム）── */}
      <div className={styles.areaSection}>
        {(['manhattan', 'brooklyn', 'queens'] as const).map((big) => {
          const list = byBig[big] ?? [];
          if (!list.length) return null;
          return (
            <div key={big} className={styles.group}>
              <h2 className={styles.groupTitle}>
                {big.charAt(0).toUpperCase() + big.slice(1)}
              </h2>
              <div className={styles.grid}>
                {list.map((area) => {
                  const slug = area.fields.slug;
                  const count = countBySlug[slug] ?? 0;
                  const isActive = activeSlug === slug;
                  return (
                    <button
                      key={area.sys.id}
                      className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
                      onClick={() => setActiveSlug(isActive ? null : slug)}
                    >
                      <span className={styles.cardInner}>
                        <span className={styles.areaName}>{area.fields.name}</span>
                        {count > 0 && (
                          <span className={styles.count}>{count} spot{count !== 1 ? 's' : ''}</span>
                        )}
                      </span>
                      <span className={styles.arrow}>{isActive ? '↑' : '→'}</span>
                    </button>
                  );
                })}
              </div>
              {/* サロン個別ページへのリンク（サブテキスト）*/}
              <div className={styles.browseLinks}>
                {list.filter(a => (countBySlug[a.fields.slug] ?? 0) > 0).map((area) => (
                  <Link key={area.sys.id} href={`/area/${area.fields.slug}`} className={styles.browseLink}>
                    Browse all {area.fields.name} salons →
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
