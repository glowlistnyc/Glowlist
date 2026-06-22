import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllSalons, getAllAreas, getRecentBlogPosts } from '@/lib/contentful';
import { resolveSalonPins } from '@/lib/salonPins';
import FilteredSalonList from '@/components/FilteredSalonList';
import NeighborhoodMap from '@/components/NeighborhoodMap';
import styles from './page.module.css';

// マップが住所をジオコーディングするため、リスト系ページより少し長めの間隔で再生成
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
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default async function HomePage() {
  const [salons, areas, posts] = await Promise.all([
    getAllSalons(),
    getAllAreas(),
    getRecentBlogPosts(3),
  ]);

  // Contentfulの住所データを実際にジオコーディングしてマップ座標を解決
  const pins = await resolveSalonPins(salons);

  return (
    <>
      <HomeSchema />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <p className={styles.eyebrow}>
          <span />Asian-inspired Beauty · New York<span />
        </p>
        <h1 className={styles.h1}>
          A little treat<br />for <em>yourself.</em>
        </h1>
        <p className={styles.city}>New York City</p>
        <p className={styles.desc}>
          Because you deserve to feel taken care of.<br />
          Find Asian-inspired nails, lashes, and beauty in NYC —<br />
          curated by style, quality, and real community recommendations.
        </p>
        <div className={styles.ctaRow}>
          <Link href="#spots" className="btn btn-primary">Find Your Spot</Link>
          <a href="https://forms.gle/DLBDikk6Do6LHSxu6" target="_blank" rel="noopener" className="btn btn-ghost">
            Share a Photo
          </a>
        </div>
      </section>

      <div className="divider" />

      {/* ── EXPLORE ── */}
      <section className={styles.section} id="explore">
        <span className="sec-label">Start Here</span>
        <h2 className="sec-title">What are you looking for?</h2>
        <div className={styles.exploreGrid}>

          {/* Nails */}
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
            <p className={styles.ecDesc}>
              Soft, minimal, and designed to last. Japanese gel technique prioritises nail health — the kind of manicure that still looks perfect two weeks later.
            </p>
            <div className={styles.ecTags}>
              <span className="tag">Japanese gel</span>
              <span className="tag">Kokoist</span>
              <span className="tag">Minimal</span>
            </div>
            <span className={styles.ecArrow}>→</span>
          </Link>

          {/* Lashes — Asian woman eye close-up (Linh Ha / Unsplash) */}
          <Link href="/service/korean-lash-lift" className={styles.exploreCard}>
            <div className={styles.exploreImg}>
              <Image
                src="https://images.unsplash.com/photo-1542833807-ad5af0977050?w=900&q=80&auto=format&fit=crop&crop=top"
                alt="Asian woman eyelash close-up NYC"
                fill
                style={{ objectFit: 'cover', filter: 'brightness(.65) contrast(1.15) saturate(.75)' }}
              />
              <div className={styles.exploreImgOverlay} />
            </div>
            <span className={styles.ecNum}>02</span>
            <h2 className={styles.ecTitle}>Lashes &amp;<br /><em>Lash Lifts</em></h2>
            <p className={styles.ecDesc}>
              Wake up with naturally lifted lashes. Korean lash lift technique gives you a clean, open-eyed look that lasts 6–8 weeks — no extensions needed.
            </p>
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

      {/* ── WHY ── */}
      <section className={styles.section}>
        <span className="sec-label">Why Glowlist</span>
        <h2 className="sec-title" style={{ maxWidth: 520 }}>
          Finding the right place should feel<br />
          <em style={{ fontStyle: 'italic', color: 'var(--beige-s)' }}>as good as the service itself.</em>
        </h2>
        <div className={styles.whyGrid}>
          {[
            {
              n: '01',
              title: 'Style over star ratings',
              body: 'Filter by Japanese gel, Korean lash lift, quiet vibe, Japanese-speaking staff — the things Google Maps won\'t tell you.',
            },
            {
              n: '02',
              title: 'A space to exhale',
              body: 'Every spot on Glowlist is chosen with care. Calm atmospheres, skilled hands, and the little details that make a service feel like a real treat.',
            },
            {
              n: '03',
              title: 'Community-powered',
              body: 'Built on real recommendations from people who actually went. Not ads, not sponsorships — just spots worth knowing about.',
            },
          ].map((w) => (
            <div key={w.n} className={styles.whyItem}>
              <div className={styles.whyNum}>{w.n}</div>
              <h3>{w.title}</h3>
              <p>{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ── SPOTS ── */}
      <section className={styles.section} id="spots">
        <span className="sec-label">Curated List</span>
        <h2 className="sec-title">Spots to try in NYC</h2>
        <p style={{ color: 'var(--beige-s)', fontSize: '.9rem', marginBottom: '2rem', fontWeight: 300, lineHeight: 1.8 }}>
          Every salon on Glowlist is handpicked. Tap any card to see prices, photos, and booking info.
        </p>
        <FilteredSalonList salons={salons} />
      </section>

      {/* ── MAP (Spots to try NYC の直下) ── */}
      {pins.length > 0 && (
        <>
          <div className="divider" />
          <section className={styles.section}>
            <span className="sec-label">On the Map</span>
            <h2 className="sec-title">Where to find them</h2>
            <p style={{ color: 'var(--beige-s)', fontSize: '.88rem', marginBottom: '0', fontWeight: 300, lineHeight: 1.8 }}>
              Hover a pin, or browse the list, to see where each spot actually sits.
            </p>
            <NeighborhoodMap pins={pins} />
          </section>
        </>
      )}

      <div className="divider" />

      {/* ── AREAS ── */}
      {areas.length > 0 && (
        <>
          <section className={styles.section}>
            <span className="sec-label">Browse by Area</span>
            <h2 className="sec-title">Find spots near you</h2>
            <div className={styles.areaGrid}>
              {areas.map((area) => (
                <Link key={area.sys.id} href={`/area/${area.fields.slug}`} className={styles.areaCard}>
                  <p className={styles.areaName}>{area.fields.name}</p>
                  <p className={styles.areaBig}>{area.fields.bigArea}</p>
                  <span className={styles.areaArrow}>→</span>
                </Link>
              ))}
            </div>
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
                    {new Date(post.fields.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
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
              Found a spot that deserves to be on here?<br />
              Had a great experience worth sharing?<br />
              This guide gets better when more people contribute.
            </p>
          </div>
          <div className={styles.communityActions}>
            {[
              { label: 'Submit a Spot', desc: 'Know a great nail or lash salon? Add it to Glowlist.', href: 'https://forms.gle/VmLJBtzQ3tXpjFri9' },
              { label: 'Glowlist Photo Drop ✨', desc: 'Nails or lashes you\'re proud of? Share it — anonymously OK.', href: 'https://forms.gle/DLBDikk6Do6LHSxu6' },
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
