import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { getAllServices, getServiceBySlug, getSalonsByService } from '@/lib/contentful';
import SalonCard from '@/components/SalonCard';
import Link from 'next/link';

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  const services = await getAllServices();
  return services.map((s) => ({ slug: s.fields.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const svc = await getServiceBySlug(params.slug);
  if (!svc) return {};
  const title = svc.fields.seoTitle ?? `${svc.fields.name} in NYC — Glowlist`;
  const description = svc.fields.seoDescription ?? `Find the best ${svc.fields.name} salons in New York City. Curated guide by Glowlist NYC.`;
  return { title, description, openGraph: { title, description } };
}

export default async function ServicePage({ params }: Props) {
  const svc = await getServiceBySlug(params.slug);
  if (!svc) notFound();

  const salons = await getSalonsByService(svc.fields.tags[0] ?? '');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${svc.fields.name} salons in NYC`,
    numberOfItems: salons.length,
    itemListElement: salons.map((s, i) => ({
      '@type': 'ListItem', position: i + 1,
      name: s.fields.name,
      url: `https://glowlistnyc.com/salon/${s.fields.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section style={{ padding: '5rem 5vw' }}>
        <nav style={{ fontSize: '.68rem', color: 'var(--beige-d)', marginBottom: '1.5rem', letterSpacing: '.08em' }}>
          <Link href="/" style={{ color: 'var(--beige-d)' }}>Home</Link>
          {' / '}<Link href="/service" style={{ color: 'var(--beige-d)' }}>Services</Link>
          {' / '}<span style={{ color: 'var(--beige-s)' }}>{svc.fields.name}</span>
        </nav>

        <span className="sec-label">Service Guide · NYC</span>
        <h1 className="sec-title">{svc.fields.name} in NYC</h1>
        <p style={{ color: 'var(--beige-s)', fontSize: '.95rem', maxWidth: 560, lineHeight: 1.8, marginBottom: '2rem', fontWeight: 300 }}>
          {svc.fields.shortDescription}
        </p>

        {svc.fields.description && (
          <div style={{ color: 'var(--beige-s)', fontSize: '.9rem', lineHeight: 1.85, maxWidth: 640, marginBottom: '3rem', fontWeight: 300 }}>
            {documentToReactComponents(svc.fields.description)}
          </div>
        )}

        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', color: 'var(--beige)', marginBottom: '1.5rem', fontWeight: 300 }}>
          {salons.length} spot{salons.length !== 1 ? 's' : ''} offering {svc.fields.name}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5px', background: 'var(--border)' }}>
          {salons.map((s) => <SalonCard key={s.sys.id} salon={s} />)}
        </div>
      </section>
    </>
  );
}
