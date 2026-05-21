import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllSalons, getAllAreas, getAllServices, getRecentBlogPosts } from '@/lib/contentful';
import SalonCard from '@/components/SalonCard';
import FilteredSalonList from '@/components/FilteredSalonList';
import styles from './page.module.css';

export const revalidate = 60;


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

// Schema.org for the homepage
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
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function HomePage() {
  const [salons, areas, services, posts] = await Promise.all([
    getAllSalons(),
    getAllAreas(),
    getAllServices(),
    getRecentBlogPosts(3),
  ]);

  const featuredSalons = salons.filter((s) => s.fields.featured);

  return (
    <>
      <HomeSchema />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Asian-inspired Beauty · New York</p>
        <h1 className={styles.h1}>
          Find beauty<br />you can <em>trust</em>
        </h1>
        <p className={styles.city}>New York City</p>
        <p className={styles.desc}>
          A curated guide to Asian-inspired nails, lashes, and beauty spots in New York.
          Find places by style, vibe, language, and area — not just star ratings.
        </p>
        <div className={styles.ctaRow}>
          <Link href="#spots" className="btn btn-primary">Explore Spots</Link>
          <a href="https://forms.gle/DLBDikk6Do6LHSxu6" target="_blank" rel="noopener" className="btn btn-ghost">
            Submit a Photo
          </a>
        </div>
      </section>

      <div className="divider" />

      {/* ── EXPLORE CATEGORIES ── */}
      <section className={styles.section} id="explore">
        <span className="sec-label">Discover</span>
        <h2 className="sec-title">Curated by category</h2>
        <div className={styles.exploreGrid}>
          <Link href="/service/japanese-gel-nails" className={styles.exploreCard}>
            <div className={styles.exploreImg}>
              <Image
                src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=900&q=80&auto=format&fit=crop"
                alt="Japanese gel nails NYC"
                fill
                style={{ objectFit: 'cover', filter: 'brightness(.78) contrast(1.05) saturate(.8)' }}
              />
            </div>
            <span className={styles.ecNum}>01</span>
            <h2 className={styles.ecTitle}>Japanese<br /><em>Gel Nails</em></h2>
            <p className={styles.ecDesc}>Japanese-style gel, minimal designs, and technicians trained in Japanese technique.</p>
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
                src="https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=900&q=80&auto=format&fit=crop&crop=top"
                alt="Asian woman eyelash close-up NYC"
                fill
                style={{ objectFit: 'cover', filter: 'brightness(.78) contrast(1.05) saturate(.8)' }}
              />
            </div>
            <span className={styles.ecNum}>02</span>
            <h2 className={styles.ecTitle}>Lashes &<br /><em>Lash Lifts</em></h2>
            <p className={styles.ecDesc}>Korean lash lifts, natural extensions, and soft curls for the understated look.</p>
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

      {/* ── WHY GLOWLIST ── */}
      <section className={styles.section}>
        <span className="sec-label">Why Glowlist</span>
        <h2 className="sec-title" style={{ maxWidth: 480 }}>
          Finding good Asian-inspired beauty in NYC
          <em style={{ fontStyle: 'italic', color: 'var(--beige-s)', display: 'block' }}>
            should not be this hard.
          </em>
        </h2>
        <div className={styles.whyGrid}>
          {[
            { n: '01', title: 'Style over stars', body: 'Filter by Japanese gel, Korean lash, natural aesthetic, quiet vibe — the things that actually matter, not just average ratings.' },
            { n: '02', title: 'Language & comfort', body: 'See at a glance which salons have Japanese-speaking staff or a calm atmosphere for first-timers.' },
            { n: '03', title: 'Community-powered', body: 'Built on real recommendations — not paid placements dressed as reviews.' },
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

      {/* ── SPOTS WITH FILTER ── */}
      <section className={styles.section} id="spots">
        <span className="sec-label">Curated List</span>
        <h2 className="sec-title">Spots to try in NYC</h2>
        <p style={{ color: 'var(--beige-s)', fontSize: '.88rem', marginBottom: '1.8rem', fontWeight: 300 }}>
          Tap any card for prices and details.
        </p>
        <FilteredSalonList salons={salons} />
      </section>

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
            <h2 className="sec-title">Help us build the NYC beauty map girls actually need.</h2>
            <p style={{ color: 'var(--beige-s)', fontSize: '.88rem', lineHeight: 1.85, marginTop: '1rem', fontWeight: 300 }}>
              Got a salon recommendation? A nail photo you&apos;re proud of?
              Your contribution helps other girls find beauty spots they can trust.
            </p>
          </div>
          <div className={styles.communityActions}>
            {[
              { label: 'Submit a Spot', desc: 'Know a great nail or lash salon? Add it to Glowlist.', href: 'https://forms.gle/VmLJBtzQ3tXpjFri9' },
              { label: 'Glowlist Photo Drop ✨', desc: 'Got your nails or lashes done? Share a photo — anonymously OK.', href: 'https://forms.gle/DLBDikk6Do6LHSxu6' },
              { label: 'Report an Update', desc: 'Price, hours, or service changed? Let us know.', href: 'https://forms.gle/U8ame9qVVGbc4gpn9' },
              { label: 'Follow on Instagram', desc: '@glowlist_nyc — new spots, community picks, and more.', href: 'https://www.instagram.com/glowlist_nyc/' },
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
