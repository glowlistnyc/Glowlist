import type { Metadata } from 'next';
import { getAllAreas, getAllSalons } from '@/lib/contentful';
import { resolveSalonPins } from '@/lib/salonPins';
import AreaIndexClient from './AreaIndexClient';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Beauty Spots by Area — Glowlist NYC',
  description: 'Find Asian-inspired nail salons and lash studios in Manhattan, Brooklyn, Queens, and across New York City.',
};

export default async function AreaIndexPage() {
  const [areas, salons] = await Promise.all([getAllAreas(), getAllSalons()]);
  const pins = await resolveSalonPins(salons);

  return (
    <section style={{ padding: '5rem 5vw' }}>
      <span className="sec-label">Browse</span>
      <h1 className="sec-title">Beauty Spots by Area</h1>
      <p style={{ color: 'var(--beige-s)', fontSize: '.9rem', marginBottom: '2rem', fontWeight: 300 }}>
        Click an area to zoom in on the map.
      </p>
      <AreaIndexClient areas={areas} pins={pins} />
    </section>
  );
}
