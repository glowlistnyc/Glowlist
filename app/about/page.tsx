import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About Glowlist NYC',
  description: 'Glowlist NYC is a curated guide to Asian-inspired nails, lashes, and beauty spots in New York. Built by the community, for the community.',
};

export default function AboutPage() {
  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <span className="sec-label">About</span>
        <h1 className={styles.h1}>Finding good beauty in NYC<br /><em>should not be this hard.</em></h1>
      </header>

      <div className={styles.body}>
        <section className={styles.section}>
          <h2 className={styles.h2}>Why Glowlist</h2>
          <p>
            New York has hundreds of Asian-inspired nail and lash salons — but finding the right one still feels like a gamble.
            Google gives you star ratings. Instagram gives you aesthetics. Neither tells you whether they use Kokoist gel, whether the technician trained in Japan, or whether the vibe is calm enough for a first-timer.
          </p>
          <p>
            Glowlist was built to fix that. Every spot on this site is curated by someone who has either been there or has vetted it carefully.
            We organise by style, service, language, and feel — not just geography and stars.
          </p>
        </section>

        <div className={styles.dividerLine} />

        <section className={styles.pillars}>
          {[
            { n: '01', title: 'Style over star ratings', body: 'Filter by Japanese gel, Korean lash lift, quiet atmosphere, Japanese-speaking staff — the things Google Maps will never show you.' },
            { n: '02', title: 'A space to exhale', body: 'Every spot is chosen with care. Calm atmospheres, skilled hands, and the small details that make a service feel like a genuine treat.' },
            { n: '03', title: 'Community-powered', body: 'Built on real recommendations from people who actually went. Not ads, not sponsorships — just spots worth knowing about.' },
          ].map((p) => (
            <div key={p.n} className={styles.pillar}>
              <span className={styles.pillarNum}>{p.n}</span>
              <h3 className={styles.pillarTitle}>{p.title}</h3>
              <p className={styles.pillarBody}>{p.body}</p>
            </div>
          ))}
        </section>

        <div className={styles.dividerLine} />

        <section className={styles.section}>
          <h2 className={styles.h2}>How listings work</h2>
          <p>
            Salons are listed because they meet Glowlist&rsquo;s curation standards — not because they paid to be here.
            We verify pricing from public menus, check Instagram for style consistency, and cross-reference community feedback before publishing.
          </p>
          <p>
            Featured placements (<em>marked with a badge</em>) are available for salons that want more visibility.
            These are always disclosed and never change how a salon is reviewed or ranked.
          </p>
        </section>

        <div className={styles.dividerLine} />

        <section className={styles.ctaSection}>
          <h2 className={styles.h2}>Get involved</h2>
          <div className={styles.ctaGrid}>
            {[
              { label: 'Submit a Spot', href: 'https://forms.gle/VmLJBtzQ3tXpjFri9', desc: 'Know a salon that should be on Glowlist?' },
              { label: 'Photo Drop', href: 'https://tally.so/r/MeQr8l', desc: 'Share your nail or lash photos.' },
              { label: 'Report an update', href: 'https://forms.gle/U8ame9qVVGbc4gpn9', desc: 'Prices or details changed?' },
              { label: 'Follow @glowlist_nyc', href: 'https://www.instagram.com/glowlist_nyc/', desc: 'New spots, picks, and behind-the-scenes.' },
            ].map((a) => (
              <a key={a.label} href={a.href} target="_blank" rel="noopener" className={styles.ctaCard}>
                <p className={styles.ctaLabel}>{a.label} →</p>
                <p className={styles.ctaDesc}>{a.desc}</p>
              </a>
            ))}
          </div>
        </section>

        <div style={{ marginTop: '3rem' }}>
          <Link href="/" className="btn btn-ghost">← Back to Glowlist</Link>
        </div>
      </div>
    </article>
  );
}
