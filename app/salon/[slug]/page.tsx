import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllSalons, getSalonBySlug } from '@/lib/contentful';
import { getApprovedReviews } from '@/lib/supabase';
import { getYelpData } from '@/lib/yelp';
import { getPlaceSummary } from '@/lib/googlePlaces';
import InstagramEmbed from '@/components/InstagramEmbed';
import ReviewSection from '@/components/ReviewSection';
import GooglePlaceReviews from '@/components/GooglePlaceReviews';
import YelpReviews from '@/components/YelpReviews';
import T from '@/components/T';
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
  const [salon, reviews] = await Promise.all([
    getSalonBySlug(params.slug),
    getApprovedReviews(params.slug),
  ]);
  if (!salon) notFound();

  const {
    name, area, areaSlug, category, tags,
    instagramHandle, bookingUrl, websiteUrl, address,
    priceRange, language, verified, notes,
    priceDetails, photos, relatedSalons, instagramPostUrls,
    googlePlaceId, yelpBusinessId,
  } = salon.fields;

  // Google Photos + Yelp を並列取得
  const [googlePlace, yelpData] = await Promise.all([
    googlePlaceId ? getPlaceSummary(googlePlaceId) : Promise.resolve(null),
    yelpBusinessId ? getYelpData(yelpBusinessId) : Promise.resolve(null),
  ]);

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

      {/* ── 2カラムレイアウト（PC: 左=メイン, 右=レビュー+IG / SP: 縦並び） ── */}
      <div className={styles.twoCol}>

        {/* ── LEFT: メインコンテンツ ── */}
        <div className={styles.mainCol}>

          {/* PHOTOS — Contentful + Google Places */}
          {(() => {
            const allPhotos = [
              ...(photos ?? []).map((p, i) => ({
                src: `https:${p.fields.file.url}?w=600&h=440&fit=fill`,
                alt: p.fields.description ?? `${name} — photo ${i + 1}`,
                key: `cf-${i}`,
              })),
              ...(googlePlace?.photos ?? []).map((p, i) => ({
                src: p.proxyUrl,
                alt: `${name} — Google photo ${i + 1}`,
                key: `gp-${i}`,
              })),
            ];
            if (allPhotos.length === 0) return null;
            return (
              <section className={styles.photoSection}>
                <h2 className={styles.sectionTitle}><T k="salon.photos" /></h2>
                <div className={styles.photoGrid}>
                  {allPhotos.map((p) => (
                    <div key={p.key} className={styles.photoWrap}>
                      <Image
                        src={p.src}
                        alt={p.alt}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
                {googlePlace?.photos && googlePlace.photos.length > 0 && (
                  <p className={styles.photoAttrib}>
                    Some photos from <a href={`https://www.google.com/maps/place/?q=place_id:${googlePlaceId}`} target="_blank" rel="noopener">Google</a>.
                  </p>
                )}
              </section>
            );
          })()}

          {/* BASIC INFO */}
          <section className={styles.infoSection}>
            <h2 className={styles.sectionTitle}><T k="salon.basicInfo" /></h2>
            <table className={styles.infoTable}>
              <tbody>
                <tr><td className={styles.infoLabel}><T k="salon.category" /></td><td className={styles.infoVal}>{cap(category)}</td></tr>
                <tr><td className={styles.infoLabel}><T k="salon.area" /></td><td className={styles.infoVal}>{area}</td></tr>
                {address && (
                  <tr>
                    <td className={styles.infoLabel}><T k="salon.address" /></td>
                    <td className={styles.infoVal}>
                      <a href={mapUrl} target="_blank" rel="noopener" className={styles.infoLink}>{address} ↗</a>
                    </td>
                  </tr>
                )}
                {language && <tr><td className={styles.infoLabel}><T k="salon.language" /></td><td className={styles.infoVal}>{language}</td></tr>}
                {priceRange && <tr><td className={styles.infoLabel}>Price</td><td className={styles.infoVal}>{priceRange}</td></tr>}
                {websiteUrl && (
                  <tr>
                    <td className={styles.infoLabel}><T k="salon.website" /></td>
                    <td className={styles.infoVal}><a href={websiteUrl} target="_blank" rel="noopener" className={styles.infoLink}>{websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗</a></td>
                  </tr>
                )}
                <tr>
                  <td className={styles.infoLabel}><T k="salon.instagram" /></td>
                  <td className={styles.infoVal}><a href={igUrl} target="_blank" rel="noopener" className={styles.infoLink}>@{instagramHandle} ↗</a></td>
                </tr>
                {notes && <tr><td className={styles.infoLabel}><T k="salon.notes" /></td><td className={styles.infoVal}>{notes}</td></tr>}
              </tbody>
            </table>
            <div className={styles.tagRow}>{tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
            {address && <a href={mapUrl} target="_blank" rel="noopener" className={styles.mapLink}>Open in Google Maps ↗</a>}
          </section>

          {/* PRICES */}
          <section className={styles.priceSection}>
            <h2 className={styles.sectionTitle}><T k="salon.prices" /></h2>
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
                <a href={websiteUrl ?? bookingUrl} target="_blank" rel="noopener">Check their site</a> for current prices.
              </p>
            )}
            <p className={styles.disclaimer}>
              <T k="salon.priceDisclaimer" />
            </p>
            <a href={bookingUrl} target="_blank" rel="noopener" className={styles.bookBtn}>
              <T k="salon.bookAt" /> {name} →
            </a>
          </section>

          {/* ── INSTAGRAM POSTS（料金表の直下）── */}
          {instagramPostUrls && instagramPostUrls.length > 0 && (
            <InstagramEmbed postUrls={instagramPostUrls} salonName={name} />
          )}

          {/* OTHER LOCATIONS */}
          {relatedSalons && relatedSalons.length > 0 && (
            <section className={styles.relatedSection}>
              <h2 className={styles.sectionTitle}><T k="salon.otherLocations" /></h2>
              <div className={styles.relatedGrid}>
                {relatedSalons.map((related) => (
                  <Link key={related.sys.id} href={`/salon/${related.fields.slug}`} className={styles.relatedCard}>
                    <div className={styles.relatedCardInner}>
                      <p className={styles.relatedName}>{related.fields.name}</p>
                      <p className={styles.relatedMeta}>
                        {related.fields.area}
                        {related.fields.address && <span className={styles.relatedAddress}>{related.fields.address}</span>}
                      </p>
                      {related.fields.priceRange && <p className={styles.relatedPrice}>{related.fields.priceRange}</p>}
                    </div>
                    <span className={styles.relatedArrow}>→</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className={styles.backLink}>
            <Link href="/#spots" className="btn btn-ghost"><T k="salon.backToAll" /></Link>
          </div>
        </div>

        {/* ── RIGHT: レビューのみ ── */}
        <aside className={styles.sideCol}>
          <ReviewSection reviews={reviews} />
          {googlePlaceId && (
            <GooglePlaceReviews placeId={googlePlaceId} salonName={name} />
          )}
          {yelpData && <YelpReviews data={yelpData} />}
        </aside>

      </div>
    </>
  );
}
