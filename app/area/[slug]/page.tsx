import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllAreas, getAreaBySlug, getSalonsByArea } from '@/lib/contentful';
import SalonCard from '@/components/SalonCard';
import styles from './page.module.css';

export const revalidate = 60;


interface Props { params: { slug: string } }

export async function generateStaticParams() {
  const areas = await getAllAreas();
  return areas.map((a) => ({ slug: a.fields.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const area = await getAreaBySlug(params.slug);
  if (!area) return {};
  const { name, seoTitle, seoDescription } = area.fields;
  const title = seoTitle ?? `Nail Salons & Lash Studios in ${name}, NYC — Glowlist`;
  const description = seoDescription ?? `Find the best Asian-inspired nail salons and lash studios in ${name}, New York City. Curated by Glowlist NYC.`;
  return { title, description, openGraph: { title, description } };
}

export default async function AreaPage({ params }: Props) {
  const [area, salons] = await Promise.all([
    getAreaBySlug(params.slug),
    getSalonsByArea(params.slug),
  ]);
  if (!area) notFound();

  const { name, bigArea } = area.fields;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Beauty spots in ${name}, NYC`,
    numberOfItems: salons.length,
    itemListElement: salons.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.fields.name,
      url: `https://glowlistnyc.com/salon/${s.fields.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section style={{ padding: '5rem 5vw' }}>
        <nav className={styles.breadcrumb}>
          <a href="/">Home</a> / <a href="/area">Areas</a> / <span>{name}</span>
        </nav>

        <span className="sec-label">{bigArea.charAt(0).toUpperCase() + bigArea.slice(1)} · NYC</span>
        <h1 className="sec-title">Beauty spots in {name}</h1>
        <p style={{ color: 'var(--beige-s)', fontSize: '.9rem', marginBottom: '2.5rem', fontWeight: 300 }}>
          {salons.length} curated spot{salons.length !== 1 ? 's' : ''} in {name}
        </p>

        <div className={styles.grid}>
          {salons.length === 0 ? (
            <p style={{ color: 'var(--beige-d)', padding: '2rem 0' }}>No spots listed yet for this area.</p>
          ) : (
            salons.map((s) => <SalonCard key={s.sys.id} salon={s} />)
          )}
        </div>
      </section>
    </>
  );
}
