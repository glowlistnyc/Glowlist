import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllSalons, getSalonBySlug } from '@/lib/contentful';
import styles from './page.module.css';

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  const salons = await getAllSalons();
  return salons.map((s) => ({ slug: s.fields.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const salon = await getSalonBySlug(params.slug);
  if (!salon) return {};
  const { name, area, category, seoTitle, seoDescription, priceRange } = salon.fields;
  const title = seoTitle ?? `${name} — ${category === 'nails' ? 'Nail Salon' : 'Lash Studio'} in ${area}, NYC`;
  const description = seoDescription ?? `${name} is a ${category} salon in ${area}, New York. ${priceRange ? `Starting from ${priceRange}.` : ''} Find prices, photos, and booking info on Glowlist NYC.`;
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function SalonPage({ params }: Props) {
  const salon = await getSalonBySlug(params.slug);
  if (!salon) notFound();

  const { name, area, areaSlug, category, tags, instagramHandle, bookingUrl, priceRange, language, verified, notes, priceDetails, heroImage, photos } = salon.fields;

  // Schema.org LocalBusiness
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name,
    description: `${name} — ${category} salon in ${area}, NYC`,
    address: { '@type': 'PostalAddress', addressLocality: 'New York', addressRegion: 'NY', addressCountry: 'US' },
    url: bookingUrl,
    sameAs: [`https://www.instagram.com/${instagramHandle}/`],
    priceRange: priceRange ?? undefined,
    ...(heroImage ? { image: `https:${heroImage.fields.file.url}` } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className={styles.hero}>
        {heroImage && (
          <div className={styles.heroImg}>
            <Image
              src={`https:${heroImage.fields.file.url}`}
              alt={`${name} — ${category} salon in ${area} NYC`}
              fill
              style={{ objectFit: 'cover', filter: 'brightness(.75) contrast(1.05)' }}
              priority
            />
          </div>
        )}
        <div className={styles.heroCopy}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <Link href="/#spots">Spots</Link> / <span>{name}</span>
          </nav>
          <h1 className={styles.h1}>
            {name}
            {verified && <span className={styles.badge}>Verified</span>}
          </h1>
          <p className={styles.meta}>
            <Link href={`/area/${areaSlug}`}>{area}</Link>
            {' · '}{category.charAt(0).toUpperCase() + category.slice(1)}
            {language && ` · ${language}`}
            {priceRange && ` · ${priceRange}`}
          </p>
          <div className={styles.tags}>
            {tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
          <div className={styles.ctaRow}>
            <a href={bookingUrl} target="_blank" rel="noopener" className="btn btn-primary">
              Book Now →
            </a>
            <a href={`https://www.instagram.com/${instagramHandle}/`} target="_blank" rel="noopener" className="btn btn-ghost">
              Instagram ↗
            </a>
          </div>
        </div>
      </section>

      <div className="divider" />

      <div className={styles.body}>
        {/* Prices */}
        <section className={styles.priceSection}>
          <h2 className={styles.sectionTitle}>Prices</h2>
          {priceDetails && priceDetails.length > 0 ? (
            priceDetails.map((cat) => (
              <div key={cat.category} className={styles.priceCat}>
                <p className={styles.priceCatTitle}>{cat.category}</p>
                {cat.items.map((item) => (
                  <div key={item.service} className={styles.priceRow}>
                    <span>{item.service}</span>
                    <span className={styles.priceAmt}>{item.price}</span>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className={styles.noPrice}>
              Pricing not listed. <a href={bookingUrl} target="_blank" rel="noopener">Check their site</a> for current prices.
            </p>
          )}
          {notes && <p className={styles.notes}>{notes}</p>}
          <p className={styles.priceDisclaimer}>
            Prices sourced from public menus and may not reflect current rates. Confirm directly before booking.
          </p>
        </section>

        {/* Photos */}
        {photos && photos.length > 0 && (
          <section className={styles.photoSection}>
            <h2 className={styles.sectionTitle}>Photos</h2>
            <div className={styles.photoGrid}>
              {photos.map((photo, i) => (
                <div key={i} className={styles.photoWrap}>
                  <Image
                    src={`https:${photo.fields.file.url}`}
                    alt={photo.fields.description ?? `${name} photo ${i + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Back link */}
        <div style={{ marginTop: '3rem' }}>
          <Link href="/#spots" className="btn btn-ghost">← Back to all spots</Link>
        </div>
      </div>
    </>
  );
}
