import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllSalons, getSalonBySlug } from '@/lib/contentful';
import styles from './page.module.css';

export const revalidate = 60;

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
    priceDetails, photos, relatedSalons,
  } = salon.fields;

  const igUrl = `https://www.instagram.com/${instagramHandle}/`;
  const mapQuery = address
    ? encodeURIComponent(address)
    : encodeURIComponent(`${name} ${area} New York`);
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name,
    description: `${name} — ${category} salon in ${area}, NYC`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address ?? '',
      addressLocality: 'New York',
      addressRegion: 'NY',
      addressCountry: 'US',
    },
    url: websiteUrl ?? bookingUrl,
    sameAs: [igUrl],
    priceRange: priceRange ?? undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* ── HEADER ── */}
      <section className={styles.header}>
        <div className={styles.headerInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/#spots">Spots</Link>
            <span>/</span>
            <span>{name}</span>
          </nav>

          <div className={styles.titleRow}>
            <div>
              <h1 className={styles.h1}>
                {name}
                {verified && <span className={styles.badge}>Verified</span>}
              </h1>
              <p className={styles.meta}>
                <Link href={`/area/${areaSlug}`} className={styles.metaLink}>{area}</Link>
                {' · '}{cap(category)}
                {language && ` · ${language}`}
                {priceRange && <span className={styles.priceTag}>{priceRange}</span>}
              </p>
              <div className={styles.tags}>
                {tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>

            {/* CTA buttons — 全て同じサイズ */}
            <div className={styles.ctaGroup}>
              <a href={bookingUrl} target="_blank" rel="noopener" className={styles.ctaPrimary}>
                Book Now →
              </a>
              <a href={igUrl} target="_blank" rel="noopener" className={styles.ctaGhost}>
                Instagram ↗
              </a>
              {websiteUrl && (
                <a href={websiteUrl} target="_blank" rel="noopener" className={styles.ctaGhost}>
                  Website ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── BODY ── */}
      <div className={styles.body}>

        {/* ── PHOTOS ── */}
        {photos && photos.length > 0 && (
          <section className={styles.photoSection}>
            <h2 className={styles.sectionTitle}>Photos</h2>
            <div className={styles.photoGrid}>
              {photos.map((photo, i) => (
                <div key={i} className={styles.photoWrap}>
                  <Image
                    src={`https:${photo.fields.file.url}`}
                    alt={photo.fields.description ?? `${name} — photo ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
            {/* 
              ── PHOTO UPLOAD GUIDE (Contentful) ──
              サロン写真を追加するには：
              1. contentful.com にログイン
              2. Content → 該当サロンのエントリを開く
              3. "Photos" フィールドに画像をアップロード
              4. Publish → 60秒後に自動反映

              ユーザー投稿写真を表示するには：
              1. Google Formsでユーザーから写真を収集
              2. 収集した写真を確認・許可取得後にContentfulのPhotosフィールドに追加
              3. Publish → 自動反映
            */}
          </section>
        )}

        {photos && photos.length === 0 && (
          <section className={styles.photoSection}>
            <h2 className={styles.sectionTitle}>Photos</h2>
            <div className={styles.noPhotos}>
              <p>Photos coming soon.</p>
              <a
                href="https://forms.gle/DLBDikk6Do6LHSxu6"
                target="_blank"
                rel="noopener"
                className={styles.photoSubmitLink}
              >
                Submit a photo via Glowlist Photo Drop ✨
              </a>
            </div>
          </section>
        )}

        {/* ── BASIC INFO ── */}
        <section className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>Basic Information</h2>
          <table className={styles.infoTable}>
            <tbody>
              <tr>
                <td className={styles.infoLabel}>Category</td>
                <td className={styles.infoVal}>{cap(category)}</td>
              </tr>
              <tr>
                <td className={styles.infoLabel}>Area</td>
                <td className={styles.infoVal}>{area}</td>
              </tr>
              {address && (
                <tr>
                  <td className={styles.infoLabel}>Address</td>
                  <td className={styles.infoVal}>
                    <a href={mapUrl} target="_blank" rel="noopener" className={styles.infoLink}>
                      {address} ↗
                    </a>
                  </td>
                </tr>
              )}
              {language && (
                <tr>
                  <td className={styles.infoLabel}>Language</td>
                  <td className={styles.infoVal}>{language}</td>
                </tr>
              )}
              {priceRange && (
                <tr>
                  <td className={styles.infoLabel}>Price</td>
                  <td className={styles.infoVal}>{priceRange}</td>
                </tr>
              )}
              {websiteUrl && (
                <tr>
                  <td className={styles.infoLabel}>Website</td>
                  <td className={styles.infoVal}>
                    <a href={websiteUrl} target="_blank" rel="noopener" className={styles.infoLink}>
                      {websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
                    </a>
                  </td>
                </tr>
              )}
              <tr>
                <td className={styles.infoLabel}>Instagram</td>
                <td className={styles.infoVal}>
                  <a href={igUrl} target="_blank" rel="noopener" className={styles.infoLink}>
                    @{instagramHandle} ↗
                  </a>
                </td>
              </tr>
              {notes && (
                <tr>
                  <td className={styles.infoLabel}>Notes</td>
                  <td className={styles.infoVal}>{notes}</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className={styles.tagRow}>
            {tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
          {address && (
            <a href={mapUrl} target="_blank" rel="noopener" className={styles.mapLink}>
              Open in Google Maps ↗
            </a>
          )}
        </section>

        {/* ── PRICES ── */}
        <section className={styles.priceSection}>
          <h2 className={styles.sectionTitle}>Prices</h2>
          {priceDetails && priceDetails.length > 0 ? (
            priceDetails.map((cat) => (
              <div key={cat.category} className={styles.priceCat}>
                <p className={styles.priceCatTitle}>{cat.category}</p>
                {cat.items.map((item) => (
                  <div key={item.service} className={styles.priceRow}>
                    <span className={styles.priceSvc}>{item.service}</span>
                    <span className={styles.priceAmt}>{item.price}</span>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className={styles.noPrice}>
              Pricing not listed.{' '}
              <a href={websiteUrl ?? bookingUrl} target="_blank" rel="noopener">
                Check their site
              </a>{' '}
              for current prices.
            </p>
          )}
          {notes && <p className={styles.notes}>{notes}</p>}
          <p className={styles.disclaimer}>
            Prices sourced from public menus and may not reflect current rates. Confirm directly before booking.
          </p>
          <a href={bookingUrl} target="_blank" rel="noopener" className={styles.bookBtn}>
            Book at {name} →
          </a>
        </section>

        {/* ── OTHER LOCATIONS ── */}
        {relatedSalons && relatedSalons.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.sectionTitle}>Other locations</h2>
            <div className={styles.relatedGrid}>
              {relatedSalons.map((related) => (
                <Link
                  key={related.sys.id}
                  href={`/salon/${related.fields.slug}`}
                  className={styles.relatedCard}
                >
                  <div className={styles.relatedCardInner}>
                    <p className={styles.relatedName}>{related.fields.name}</p>
                    <p className={styles.relatedMeta}>
                      {related.fields.area}
                      {related.fields.address && (
                        <span className={styles.relatedAddress}>
                          {related.fields.address}
                        </span>
                      )}
                    </p>
                    {related.fields.priceRange && (
                      <p className={styles.relatedPrice}>{related.fields.priceRange}</p>
                    )}
                  </div>
                  <span className={styles.relatedArrow}>→</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── BACK ── */}
        <div className={styles.backLink}>
          <Link href="/#spots" className="btn btn-ghost">← Back to all spots</Link>
        </div>
      </div>
    </>
  );
}
