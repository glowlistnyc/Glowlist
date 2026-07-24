import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllSalons, getAllAreas, getAllServices, getRecentBlogPosts } from '@/lib/contentful';
import { resolveSalonPins } from '@/lib/salonPins';
import FilteredSalonList from '@/components/FilteredSalonList';
import SearchBar from '@/components/SearchBar';
import LPMapSection from '@/components/LPMapSection';
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

  // マップ用ピン（エリア代表座標 + 住所があれば実座標）
  const pins = await resolveSalonPins(salons);

  return (
    <>
      <HomeSchema />

      {/* ── HERO + SEARCH ── */}
      <section className={styles.hero}>
        <p className={styles.eyebrow}>
          <span />Asian-inspired Beauty · New York<span />
        </p>
        <h1 className={styles.h1}>
          Find your next<br /><em>beauty spot in NYC.</em>
        </h1>

        {/* 検索バー */}
        <div className={styles.searchWrap}>
          <SearchBar salons={salons} />
        </div>

        {/* クイックカテゴリーピル */}
        <div className={styles.quickPills}>
          <Link href="/service/japanese-gel-nails" className={styles.pill}>Gel Nails</Link>
          <Link href="/service/korean-lash-lift" className={styles.pill}>Lash Lift</Link>
          <Link href="/service/lash-extensions" className={styles.pill}>Lash Extensions</Link>
          <Link href="/service/head-spa" className={styles.pill}>Head Spa</Link>
          <Link href="/area" className={styles.pill}>Browse by Area</Link>
        </div>
      </section>

      <div className="divider" />

      {/* ── EXPLORE CATEGORIES ── */}
      <section className={styles.section} id="explore">
        <span className="sec-label">Start Here</span>
        <h2 className="sec-title">What are you looking for?</h2>
        <div className={styles.exploreGrid}>
          <Link href="/service/japanese-gel-nails" className={styles.exploreCard}>
            <div className={styles.exploreImg}>
              <Image
                src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=900&q=80&auto=format&fit=crop"
                alt="Japanese gel nails NYC"
                fill
                style={{ objectFit: 'cover', filter: 'brightness(.75) contrast(1.08) saturate(.85)' }}
              />
              <div className={styles.exploreImgOverlay} />
            </div>
            <span className={styles.ecNum}>01</span>
            <h2 className={styles.ecTitle}>Japanese<br /><em>Gel Nails</em></h2>
            <p className={styles.ecDesc}>Soft, minimal, long-lasting. Japanese gel technique prioritises nail health.</p>
            <div className={styles.ecTags}>
              <span className="tag">Japanese gel</span>
              <span className="tag">Kokoist</span>
              <span className="tag">Minimal</span>
            </div>
            <span className={styles.ecArrow}>→</span>
          </Link>

          <Link href="/service/korean-lash-lift" className={styles.exploreCard}>
            <div className={styles.exploreImg}>
              <Image
                src="https://images.unsplash.com/photo-1542833807-ad5af0977050?w=900&q=80&auto=format&fit=crop&crop=top"
                alt="Asian woman eyelash lift NYC"
                fill
                style={{ objectFit: 'cover', filter: 'brightness(.65) contrast(1.15) saturate(.75)' }}
              />
              <div className={styles.exploreImgOverlay} />
            </div>
            <span className={styles.ecNum}>02</span>
            <h2 className={styles.ecTitle}>Lashes &amp;<br /><em>Lash Lifts</em></h2>
            <p className={styles.ecDesc}>Natural lift that lasts 6–8 weeks. Korean technique, no extensions needed.</p>
            <div className={styles.ecTags}>
              <span className="tag">Lash lift</span>
              <span className="tag">Korean-style</span>
              <span className="tag">Natural curl</span>
            </div>
            <span className={styles.ecArrow}>→</span>
          </Link>
        </div>
      </section>

      <div className="divider" />

      {/* ── SPOTS WITH FILTER ── */}
      <section className={styles.section} id="spots">
        <span className="sec-label">Curated List</span>
        <h2 className="sec-title">Spots to try in NYC</h2>
        <p style={{ color: 'var(--beige-s)', fontSize: '.88rem', marginBottom: '1.8rem', fontWeight: 300 }}>
          Every salon is handpicked. Tap any card for prices and details.
        </p>
        <FilteredSalonList salons={salons} />
      </section>

      <div className="divider" />

      {/* ── MAP（ボロ + サービス絞り込み）── */}
      {pins.length > 0 && (
        <>
          <section className={styles.section}>
            <span className="sec-label">On the Map</span>
            <h2 className="sec-title">Find spots near you</h2>
            <p style={{ color: 'var(--beige-s)', fontSize: '.88rem', marginBottom: '0', fontWeight: 300 }}>
              Filter by borough and service type, then tap a pin to see details.
            </p>
            <LPMapSection pins={pins} />
          </section>
          <div className="divider" />
        </>
      )}

      {/* ── BLOG ── */}
      <section className={styles.section}>
        <span className="sec-label">From the Blog</span>
        <h2 className="sec-title">Guides & recommendations</h2>
        {posts.length > 0 ? (
          <>
            <div className={styles.blogGrid}>
              {posts.map((post) => (
                <Link key={post.sys.id} href={`/blog/${post.fields.slug}`} className={styles.blogCard}>
                  <p className={styles.blogDate}>
                    {new Date(post.fields.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <h3 className={styles.blogTitle}>{post.fields.title}</h3>
                  <p className={styles.blogExcerpt}>{post.fields.excerpt}</p>
                  <span className={styles.blogArrow}>Read →</span>
                </Link>
              ))}
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <Link href="/blog" className="btn btn-ghost">All posts →</Link>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ color: 'var(--beige-s)', fontSize: '.9rem', marginBottom: '1.5rem', fontWeight: 300 }}>
              Beauty guides and recommendations coming soon.
            </p>
            <Link href="/blog" className="btn btn-ghost">Visit Blog →</Link>
          </div>
        )}
      </section>

      <div className="divider" />

      {/* ── COMMUNITY ── */}
      <section className={styles.section} id="community">
        <div className={styles.communityWrap}>
          <div>
            <span className="sec-label">Contribute</span>
            <h2 className="sec-title">
              Help us build the beauty map<br />
              <em style={{ fontStyle: 'italic', color: 'var(--beige-s)' }}>NYC actually needs.</em>
            </h2>
            <p style={{ color: 'var(--beige-s)', fontSize: '.9rem', lineHeight: 1.9, marginTop: '1rem', fontWeight: 300 }}>
              Found a spot that deserves to be here?<br />
              Had a great experience worth sharing?<br />
              This guide gets better when more people contribute.
            </p>
            <Link href="/about" className={styles.aboutLink}>Learn about Glowlist →</Link>
          </div>
          <div className={styles.communityActions}>
            {[
              { label: 'Submit a Spot', desc: 'Know a great nail or lash salon? Add it to Glowlist.', href: 'https://forms.gle/VmLJBtzQ3tXpjFri9' },
              { label: 'Glowlist Photo Drop ✨', desc: 'Got your nails or lashes done? Share a photo — anonymously OK.', href: 'https://forms.gle/DLBDikk6Do6LHSxu6' },
              { label: 'Report an Update', desc: 'Price, hours, or something changed? Let us know.', href: 'https://forms.gle/U8ame9qVVGbc4gpn9' },
              { label: 'Follow on Instagram', desc: '@glowlist_nyc — new spots, picks, and behind-the-scenes.', href: 'https://www.instagram.com/glowlist_nyc/' },
            ].map((a) => (
              <a key={a.label} href={a.href} target="_blank" rel="noopener" className={styles.ca}>
                <div>
                  <h3>{a.label}</h3>
                  <p>{a.desc}</p>
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
