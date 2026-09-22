import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllSalons, getAllAreas, getAllServices, getRecentBlogPosts } from '@/lib/contentful';
import { resolveSalonPins } from '@/lib/salonPins';
import { getPlaceFirstPhoto } from '@/lib/googlePlaces';
import FilteredSalonList from '@/components/FilteredSalonList';
import AdvancedSearch from '@/components/AdvancedSearch';
import LPMapSection from '@/components/LPMapSection';
import T from '@/components/T';
import styles from './page.module.css';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Glowlist NYC — Curated Asian-inspired Beauty Guide for New York',
  description:
    'Find Japanese gel nails, Korean lash lifts, and Asian-inspired beauty spots in NYC. Curated by style, vibe, language, and area — not just star ratings.',
  openGraph: {
    title: 'Glowlist NYC — Curated Beauty Guide for New York',
    description: 'Find Japanese gel nails, Korean lash lifts, and beauty spots in NYC.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
};

function HomeSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Glowlist NYC',
    url: 'https://glowlistnyc.com',
    description: 'Curated guide to Asian-inspired nails, lashes, and beauty spots in New York.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://glowlistnyc.com/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default async function HomePage() {
  const [salons, areas, services, posts] = await Promise.all([
    getAllSalons(),
    getAllAreas(),
    getAllServices(),
    getRecentBlogPosts(3),
  ]);

  const pins = await resolveSalonPins(salons);

  // Google Place Photos（googlePlaceIdがあるサロンのみ取得、1枚目をカードに使用）
  const googlePhotos: Record<string, string> = {};
  await Promise.all(
    salons
      .filter((s) => s.fields.googlePlaceId)
      .map(async (s) => {
        const url = await getPlaceFirstPhoto(s.fields.googlePlaceId!);
        if (url) googlePhotos[s.sys.id] = url;
      })
  );

  return (
    <>
      <HomeSchema />

      {/* ── HERO（外部写真・中央揃え）── */}
      <section className={styles.hero}>
        <div className={styles.heroImg}>
          <Image
            src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1920&q=80&auto=format&fit=crop"
            alt="Luxury beauty salon in New York"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          />
        </div>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>
            <span /><T k="hero.eyebrow" /><span />
          </p>
          <h1 className={styles.h1}><T k="hero.title" /></h1>
          <div className={styles.searchWrap}>
            <AdvancedSearch salons={salons} areas={areas} services={services} />
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── EXPLORE CATEGORIES ── */}
      <section className={styles.section} id="explore">
        <span className="sec-label"><T k="sections.startHere" /></span>
        <h2 className="sec-title"><T k="sections.whatLooking" /></h2>
        <div className={styles.serviceGrid}>
          {services.map((svc) => {
            // slug → ローカル画像マッピング
            const LOCAL_IMAGES: Record<string, string> = {
              'japanese-gel-nails': 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=75&auto=format&fit=crop',
              'korean-lash-lift':   '/images/services/korean-lash-lift.jpg', // Eyelash_lift.png (Asian woman, lash lift)
              'lash-extensions':    '/images/services/lash-extensions.jpg',
              'brow-lamination':    '/images/services/brow-lamination.jpg',
              'head-spa':           '/images/services/head-spa.jpg',
              'gel-x-extensions':   '/images/services/gel-x-extensions.jpg',
              'hair-salon':         '/images/services/hair-salon.jpg',
              'massage':            '/images/services/massage.jpg',
            };
            const imgSrc =
              LOCAL_IMAGES[svc.fields.slug] ||
              (svc.fields.heroImage
                ? `https:${svc.fields.heroImage.fields.file.url}`
                : '/images/services/head-spa.jpg'); // fallback
            return (
              <Link key={svc.sys.id} href={`/service/${svc.fields.slug}`} className={styles.svcCard}>
                <div className={styles.svcImg}>
                  <Image
                    src={imgSrc}
                    alt={`${svc.fields.name} NYC`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    style={{
                      objectFit: 'cover',
                      filter: 'brightness(.72) contrast(1.08) saturate(.82)',
                    }}
                  />
                  <div className={styles.svcImgOverlay} />
                  <span className={styles.svcLabel}>{svc.fields.name}</span>
                </div>
                <p className={styles.svcSub}>{svc.fields.shortDescription}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="divider" />

      {/* ── SPOTS WITH FILTER ── */}
      <section className={styles.section} id="spots">
        <span className="sec-label"><T k="sections.curated" /></span>
        <h2 className="sec-title"><T k="sections.spotsNYC" /></h2>
        <p style={{ color: 'var(--beige-s)', fontSize: '.88rem', marginBottom: '1.8rem', fontWeight: 300 }}>
          <T k="sections.spotsDesc" />
        </p>
        <FilteredSalonList salons={salons} googlePhotos={googlePhotos} />
      </section>

      <div className="divider" />

      {/* ── MAP ── */}
      {pins.length > 0 && (
        <>
          <section className={styles.section}>
            <span className="sec-label"><T k="sections.onMap" /></span>
            <h2 className="sec-title"><T k="sections.findSpots" /></h2>
            <LPMapSection pins={pins} />
          </section>
          <div className="divider" />
        </>
      )}

      {/* ── BLOG ── */}
      <section className={styles.section}>
        <span className="sec-label"><T k="sections.blog" /></span>
        <h2 className="sec-title"><T k="sections.guides" /></h2>
        {posts.length > 0 ? (
          <>
            {/* 1記事目をフィーチャード（大きく表示）*/}
            <Link href={`/blog/${posts[0].fields.slug}`} className={styles.blogFeatured}>
              <div className={styles.blogFeaturedMeta}>
                <span className={styles.blogFeaturedLabel}>Featured</span>
                <span className={styles.blogDate}>
                  {new Date(posts[0].fields.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h3 className={styles.blogFeaturedTitle}>{posts[0].fields.title}</h3>
              <p className={styles.blogFeaturedExcerpt}>{posts[0].fields.excerpt}</p>
              <span className={styles.blogArrow}>Read →</span>
            </Link>

            {/* 残りのブログ記事 */}
            {posts.length > 1 && (
              <div className={styles.blogGrid}>
                {posts.slice(1).map((post) => (
                  <Link key={post.sys.id} href={`/blog/${post.fields.slug}`} className={styles.blogCard}>
                    <p className={styles.blogDate}>
                      {new Date(post.fields.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <h3 className={styles.blogTitle}>{post.fields.title}</h3>
                    <p className={styles.blogExcerpt}>{post.fields.excerpt}</p>
                    <span className={styles.blogArrow}>Read →</span>
                  </Link>
                ))}
              </div>
            )}
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <Link href="/blog" className="btn btn-ghost"><T k="common.allPosts" /></Link>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ color: 'var(--beige-s)', fontSize: '.9rem', marginBottom: '1.5rem', fontWeight: 300 }}>
              <T k="common.noPosts" />
            </p>
            <Link href="/blog" className="btn btn-ghost"><T k="common.visitBlog" /></Link>
          </div>
        )}
      </section>

      <div className="divider" />

      {/* ── COMMUNITY ── */}
      <section className={styles.section} id="community">
        <div className={styles.communityWrap}>
          <div>
            <span className="sec-label"><T k="sections.contribute" /></span>
            <h2 className="sec-title"><T k="sections.helpBuild" /></h2>
            <p style={{ color: 'var(--beige-s)', fontSize: '.9rem', lineHeight: 1.9, marginTop: '1rem', fontWeight: 300 }}>
              <T k="sections.contributeDesc" />
            </p>
            <Link href="/about" className={styles.aboutLink}><T k="common.learnAbout" /></Link>
          </div>
          <div className={styles.communityActions}>
            {([
              { lk: 'community.writeReview',  dk: 'community.writeReviewDesc',  href: 'https://tally.so/r/MeQr8l' },
              { lk: 'community.reportUpdate', dk: 'community.reportUpdateDesc', href: 'https://forms.gle/U8ame9qVVGbc4gpn9' },
              { lk: 'community.followIG',     dk: 'community.followIGDesc',     href: 'https://www.instagram.com/glowlist_nyc/' },
              { lk: 'community.contactUs',    dk: 'community.contactUsDesc',    href: '/contact' },
            ] as const).map((a) => (
              <a key={a.lk} href={a.href} target={a.href.startsWith('http') ? '_blank' : undefined} rel={a.href.startsWith('http') ? 'noopener' : undefined} className={styles.ca}>
                <div>
                  <h3><T k={a.lk} /></h3>
                  <p><T k={a.dk} /></p>
                </div>
                <span>→</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
