import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllServices } from '@/lib/contentful';
import T from '@/components/T';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Beauty Services in NYC — Glowlist',
  description: 'Browse Japanese gel nails, Korean lash lifts, brow lamination and more Asian-inspired beauty services in New York City.',
};

export default async function ServiceIndexPage() {
  const services = await getAllServices();
  return (
    <section style={{ padding: '5rem 5vw' }}>
      <span className="sec-label"><T k="service.label" /></span>
      <h1 className="sec-title"><T k="service.title" /></h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginTop: '2.5rem' }}>
        {services.map((svc) => (
          <Link key={svc.sys.id} href={`/service/${svc.fields.slug}`}
            style={{ background: 'var(--navy)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '.6rem', transition: 'background .2s', textDecoration: 'none' }}>
            <p style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--beige)', fontWeight: 400 }}>{svc.fields.name}</p>
            <p style={{ fontSize: '.82rem', color: 'var(--beige-s)', lineHeight: 1.7, fontWeight: 300 }}>{svc.fields.shortDescription}</p>
            <span style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--beige-s)', marginTop: 'auto' }}>→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
