import type { Metadata } from 'next';
import T from '@/components/T';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Contact — Glowlist NYC',
  description: 'Get in touch with Glowlist NYC.',
};

export default function ContactPage() {
  return (
    <section className={styles.page}>
      <span className="sec-label"><T k="contact.label" /></span>
      <h1 className={styles.h1}><T k="contact.title" /></h1>
      <p className={styles.sub}><T k="contact.subtitle" /></p>

      <div className={styles.grid}>
        {([
          { lk:'contact.general',     dk:'contact.generalDesc',     href:'mailto:Glowbookingstudio@gmail.com?subject=Glowlist NYC Inquiry' },
          { lk:'contact.partnership', dk:'contact.partnershipDesc', href:'mailto:Glowbookingstudio@gmail.com?subject=Salon Partnership - Glowlist NYC' },
          { lk:'contact.report',      dk:'contact.reportDesc',      href:'https://forms.gle/U8ame9qVVGbc4gpn9' },
          { lk:'contact.review',      dk:'contact.reviewDesc',      href:'https://tally.so/r/MeQr8l' },
        ] as const).map((a) => (
          <a key={a.lk} href={a.href} target={a.href.startsWith('http') ? '_blank' : undefined} rel={a.href.startsWith('http') ? 'noopener' : undefined} className={styles.card}>
            <p className={styles.cardLabel}><T k={a.lk} /> →</p>
            <p className={styles.cardDesc}><T k={a.dk} /></p>
          </a>
        ))}
      </div>

      <p className={styles.note}><T k="contact.responseNote" /></p>
    </section>
  );
}
