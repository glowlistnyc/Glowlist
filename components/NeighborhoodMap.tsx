'use client';
import dynamic from 'next/dynamic';
import type { SalonPin } from '@/lib/salonPins';
import styles from './NeighborhoodMap.module.css';

const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '500px', background: '#222b45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#a08a68', fontSize: '.8rem', letterSpacing: '.1em', textTransform: 'uppercase' }}>Loading map…</p>
    </div>
  ),
});

interface Props {
  pins: SalonPin[];
  activeAreaSlug?: string | null;
}

export default function NeighborhoodMap({ pins, activeAreaSlug }: Props) {
  return (
    <div className={styles.wrap}>
      <MapClient pins={pins} height="520px" activeAreaSlug={activeAreaSlug} />
      <p className={styles.hint}>
        Tap a pin to see salon name, service type, and details.
      </p>
    </div>
  );
}
