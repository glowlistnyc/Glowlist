import type { Metadata } from 'next';
import Link from 'next/link';
import T from '@/components/T';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About Glowlist NYC',
  description: 'Glowlist NYC — curated Asian-inspired beauty in New York.',
};

export default function AboutPage() {
  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <span className="sec-label"><T k="about.label" /></span>
        <h1 className={styles.h1}>
          <T k="about.title" /><br />
          <em><T k="about.subtitle" /></em>
        </h1>
      </header>

      <div className={styles.body}>
        <section className={styles.section}>
          <h2 className={styles.h2}><T k="about.whyTitle" /></h2>
          <p><T k="about.whyBody1" /></p>
          <p><T k="about.whyBody2" /></p>
        </section>

        <div className={styles.dividerLine} />

        <section className={styles.pillars}>
          {(['01','02','03'] as const).map((n, i) => (
            <div key={n} className={styles.pillar}>
              <span className={styles.pillarNum}>{n}</span>
              <h3 className={styles.pillarTitle}>
                <T k={`about.p0${i+1}Title`} />
              </h3>
              <p className={styles.pillarBody}>
                <T k={`about.p0${i+1}Body`} />
              </p>
            </div>
          ))}
        </section>

        <div className={styles.dividerLine} />

        <section className={styles.section}>
          <h2 className={styles.h2}><T k="about.howTitle" /></h2>
          <p><T k="about.howBody1" /></p>
          <p><T k="about.howBody2" /></p>
        </section>

        <div className={styles.dividerLine} />

        <section className={styles.ctaSection}>
          <h2 className={styles.h2}><T k="about.getInvolvedTitle" /></h2>
          <div className={styles.ctaGrid}>
            {([
              { lk:'community.writeReview',  dk:'community.writeReviewDesc',  href:'https://tally.so/r/MeQr8l' },
              { lk:'community.followIG',     dk:'community.followIGDesc',     href:'https://www.instagram.com/glowlist_nyc/' },
              { lk:'community.reportUpdate', dk:'community.reportUpdateDesc', href:'https://forms.gle/U8ame9qVVGbc4gpn9' },
              { lk:'community.contactUs',    dk:'community.contactUsDesc',    href:'/contact' },
            ] as const).map((a) => (
              <a key={a.lk} href={a.href} target={a.href.startsWith('http') ? '_blank' : undefined} rel={a.href.startsWith('http') ? 'noopener' : undefined} className={styles.ctaCard}>
                <p className={styles.ctaLabel}><T k={a.lk} /> →</p>
                <p className={styles.ctaDesc}><T k={a.dk} /></p>
              </a>
            ))}
          </div>
        </section>

        <div style={{ marginTop: '3rem' }}>
          <Link href="/" className="btn btn-ghost">← Glowlist</Link>
        </div>
      </div>
    </article>
  );
}
