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
  return { title, description, openGraph: { title, description } };
}

export default async function SalonPage({ params }: Props) {
  const salon = await getSalonBySlug(params.slug);
  if (!salon) notFound();

  const {
    name, area, areaSlug, category, tags,
    instagramHandle, bookingUrl, websiteUrl, address,
    priceRange, language, verified, notes,
    priceDetails, heroImage, photos,
  } = salon.fields;

  const igUrl = `https://www.instagram.com/${instagramHandle}/`;

  // Google Maps embed URL (addressがある場合)
  const mapQuery = address
    ? encodeURIComponent(address)
    : encodeURIComponent(`${name} ${area} New York`);
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=${mapQuery}`;
  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name,
    description: `${name} — ${category} salon in ${area}, NYC`,
    address: { '@type': 'PostalAddress', streetAddress: address ?? '', addressLocality: 'New York', addressRegion: 'NY', addressCountry: 'US' },
    url: websiteUrl ?? bookingUrl,
    sameAs: [igUrl],
    priceRange: priceRange ?? undefined,
    ...(heroImage ? { image: `https:${heroImage.fields.file.url}` } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* ── HERO ── */}
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
          {/* ── CTAボタン：全て同じサイズ ── */}
          <div className={styles.ctaRow}>
            <a href={bookingUrl} target="_blank" rel="noopener" className={styles.ctaBtn}>
              Book Now →
            </a>
            <a href={igUrl} target="_blank" rel="noopener" className={`${styles.ctaBtn} ${styles.ctaBtnGhost}`}>
              Instagram ↗
            </a>
            {websiteUrl && (
              <a href={websiteUrl} target="_blank" rel="noopener" className={`${styles.ctaBtn} ${styles.ctaBtnGhost}`}>
                Website ↗
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="divider" />

      <div className={styles.body}>

        {/* ── BASIC INFORMATION ── */}
        <section className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>Basic Information</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoLeft}>
              <table className={styles.infoTable}>
                <tbody>
                  <tr>
                    <td className={styles.infoLabel}>Category</td>
                    <td className={styles.infoValue}>{category.charAt(0).toUpperCase() + category.slice(1)}</td>
                  </tr>
                  <tr>
                    <td className={styles.infoLabel}>Area</td>
                    <td className={styles.infoValue}>{area}</td>
                  </tr>
                  {address && (
                    <tr>
                      <td className={styles.infoLabel}>Address</td>
                      <td className={styles.infoValue}>
                        <a href={mapSearchUrl} target="_blank" rel="noopener" className={styles.mapLink}>
                          {address} ↗
                        </a>
                      </td>
                    </tr>
                  )}
                  {language && (
                    <tr>
                      <td className={styles.infoLabel}>Language</td>
                      <td className={styles.infoValue}>{language}</td>
                    </tr>
                  )}
                  {priceRange && (
                    <tr>
                      <td className={styles.infoLabel}>Price Range</td>
                      <td className={styles.infoValue}>{priceRange}</td>
                    </tr>
                  )}
                  {websiteUrl && (
                    <tr>
                      <td className={styles.infoLabel}>Website</td>
                      <td className={styles.infoValue}>
                        <a href={websiteUrl} target="_blank" rel="noopener" className={styles.mapLink}>
                          {websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
                        </a>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className={styles.infoLabel}>Instagram</td>
                    <td className={styles.infoValue}>
                      <a href={igUrl} target="_blank" rel="noopener" className={styles.mapLink}>
                        @{instagramHandle} ↗
                      </a>
                    </td>
                  </tr>
                  {notes && (
                    <tr>
                      <td className={styles.infoLabel}>Notes</td>
                      <td className={styles.infoValue}>{notes}</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {tags.length > 0 && (
                <div className={styles.infoTags}>
                  {tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              )}
            </div>

            {/* Google Map */}
            <div className={styles.infoRight}>
              <div className={styles.mapWrap}>
                <iframe
                  title={`${name} on Google Maps`}
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a href={mapSearchUrl} target="_blank" rel="noopener" className={styles.mapLinkBtn}>
                Open in Google Maps ↗
              </a>
            </div>
          </div>
        </section>

        <div className="divider" style={{ marginBottom: '3rem' }} />

        {/* ── PRICES ── */}
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
              Pricing not listed.{' '}
              <a href={websiteUrl ?? bookingUrl} target="_blank" rel="noopener">Check their site</a> for current prices.
            </p>
          )}
          {notes && <p className={styles.notes}>{notes}</p>}
          <p className={styles.priceDisclaimer}>
            Prices sourced from public menus and may not reflect current rates. Confirm directly before booking.
          </p>
        </section>

        {/* ── PHOTOS ── */}
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

        {/* ── BACK ── */}
        <div style={{ marginTop: '3rem' }}>
          <Link href="/#spots" className="btn btn-ghost">← Back to all spots</Link>
        </div>
      </div>
    </>
  );
}
