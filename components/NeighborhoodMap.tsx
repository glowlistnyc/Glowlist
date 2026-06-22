'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import type { SalonPin } from '@/lib/salonPins';
import styles from './NeighborhoodMap.module.css';

// LeafletはSSR不可 → dynamic importでクライアントのみロード
const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '500px', background: '#222b45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#a08a68', fontSize: '.8rem', letterSpacing: '.1em', textTransform: 'uppercase' }}>
        Loading map…
      </p>
    </div>
  ),
});

interface Props { pins: SalonPin[] }

export default function NeighborhoodMap({ pins }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className={styles.wrap}>
      {/* ── 実地図（Leaflet + CartoDB Dark） ── */}
      <div className={styles.mapBox}>
        <MapClient pins={pins} height="500px" />
        <p className={styles.mapHint}>
          Tap a pin to see salon details. Scroll or pinch to zoom.
        </p>
      </div>

      {/* ── サロンリスト ── */}
      <div className={styles.legend}>
        <p className={styles.legendTitle}>{pins.length} spots on the map</p>
        <div className={styles.legendList}>
          {pins
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((pin) => (
              <Link
                key={pin.id}
                href={`/salon/${pin.slug}`}
                className={`${styles.legendItem} ${hovered === pin.id ? styles.legendItemHovered : ''}`}
                onMouseEnter={() => setHovered(pin.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className={styles.legendDot} />
                <span className={styles.legendText}>
                  <span className={styles.legendLabel}>{pin.name}</span>
                  <span className={styles.legendArea}>{pin.area}</span>
                </span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
