import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllAreas } from '@/lib/contentful';
import styles from './page.module.css';

export const revalidate = 60;


export const metadata: Metadata = {
  title: 'Beauty Spots by Area — Glowlist NYC',
  description: 'Find Asian-inspired nail salons and lash studios in Manhattan, Brooklyn, Queens, and across New York City.',
};

export default async function AreaIndexPage() {
  const areas = await getAllAreas();

  const byBig = areas.reduce<Record<string, typeof areas>>((acc, a) => {
    const big = a.fields.bigArea;
    if (!acc[big]) acc[big] = [];
    acc[big].push(a);
    return acc;
  }, {});

  return (
    <section style={{ padding: '5rem 5vw' }}>
      <span className="sec-label">Browse</span>
      <h1 className="sec-title">Beauty Spots by Area</h1>
      <p style={{ color: 'var(--beige-s)', fontSize: '.9rem', marginBottom: '3rem', fontWeight: 300 }}>
        Find Asian-inspired nails and lashes across New York City.
      </p>

      {(['manhattan', 'brooklyn', 'queens'] as const).map((big) => {
        const list = byBig[big] ?? [];
        if (!list.length) return null;
        return (
          <div key={big} className={styles.bigGroup}>
            <h2 className={styles.bigTitle}>{big.charAt(0).toUpperCase() + big.slice(1)}</h2>
            <div className={styles.grid}>
              {list.map((area) => (
                <Link key={area.sys.id} href={`/area/${area.fields.slug}`} className={styles.card}>
                  <p className={styles.name}>{area.fields.name}</p>
                  <span className={styles.arrow}>→</span>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
