'use client';
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { Salon } from '@/types';
import type { SalonPin } from '@/lib/salonPins';
import styles from './LPMapSection.module.css';

const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '460px', background: '#222b45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#a08a68', fontSize: '.8rem', letterSpacing: '.1em', textTransform: 'uppercase' }}>Loading map…</p>
    </div>
  ),
});

type Borough = 'all' | 'manhattan' | 'brooklyn' | 'queens';
type Service = 'all' | 'nails' | 'lashes';

const BIG_LABEL: Record<Borough, string> = {
  all: 'All NYC', manhattan: 'Manhattan', brooklyn: 'Brooklyn', queens: 'Queens',
};
const SVC_LABEL: Record<Service, string> = {
  all: 'All Services', nails: 'Gel Nails', lashes: 'Lashes',
};

interface Props {
  pins: SalonPin[];
}

export default function LPMapSection({ pins }: Props) {
  const [borough, setBorough] = useState<Borough>('all');
  const [service, setService] = useState<Service>('all');

  const filtered = useMemo(() => pins.filter((p) => {
    const boroughMatch = borough === 'all' || p.areaSlug === borough || (() => {
      // areaSlugでボロを判定
      const MAN = ['soho','nomad','chelsea','union-square','midtown','k-town','midtown-east','upper-east-side','upper-west-side','east-village','lower-east-side','tribeca','lower-manhattan','manhattan'];
      const BK  = ['williamsburg','brooklyn'];
      const QN  = ['long-island-city','queens'];
      if (borough === 'manhattan') return MAN.includes(p.areaSlug);
      if (borough === 'brooklyn')  return BK.includes(p.areaSlug);
      if (borough === 'queens')    return QN.includes(p.areaSlug);
      return true;
    })();
    const serviceMatch =
      service === 'all' ||
      p.category === service ||
      p.category === 'both';
    return boroughMatch && serviceMatch;
  }), [pins, borough, service]);

  return (
    <div className={styles.wrap}>
      {/* ── フィルター ── */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <p className={styles.filterLabel}>Borough</p>
          <div className={styles.chips}>
            {(['all','manhattan','brooklyn','queens'] as Borough[]).map((b) => (
              <button
                key={b}
                className={`${styles.chip} ${borough === b ? styles.chipActive : ''}`}
                onClick={() => setBorough(b)}
              >{BIG_LABEL[b]}</button>
            ))}
          </div>
        </div>
        <div className={styles.filterGroup}>
          <p className={styles.filterLabel}>Service</p>
          <div className={styles.chips}>
            {(['all','nails','lashes'] as Service[]).map((s) => (
              <button
                key={s}
                className={`${styles.chip} ${service === s ? styles.chipActive : ''}`}
                onClick={() => setService(s)}
              >{SVC_LABEL[s]}</button>
            ))}
          </div>
        </div>
        <p className={styles.summary}>
          {filtered.length} spot{filtered.length !== 1 ? 's' : ''}
          {borough !== 'all' || service !== 'all'
            ? ` — ${[borough !== 'all' && BIG_LABEL[borough], service !== 'all' && SVC_LABEL[service]].filter(Boolean).join(' · ')}`
            : ' across NYC'}
        </p>
      </div>

      {/* ── マップ ── */}
      <MapClient pins={filtered} height="460px" />
      <p className={styles.hint}>Tap a pin to see salon details · Scroll to zoom</p>
    </div>
  );
}
