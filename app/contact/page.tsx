import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Contact — Glowlist NYC',
  description: 'Get in touch with Glowlist NYC.',
};

export default function ContactPage() {
  return (
    <section className={styles.page}>
      <span className="sec-label">Get in touch</span>
      <h1 className={styles.h1}>Contact</h1>
      <p className={styles.sub}>
        Questions, feedback, salon partnerships, or press inquiries — we&rsquo;d love to hear from you.
      </p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>General Inquiries</h2>
          <p className={styles.cardDesc}>Questions about listings, partnerships, or the site.</p>
          <a
            href="mailto:Glowbookingstudio@gmail.com?subject=Glowlist NYC Inquiry"
            className={styles.emailBtn}
          >
            Glowbookingstudio@gmail.com →
          </a>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Salon Partnerships</h2>
          <p className={styles.cardDesc}>Interested in a featured placement or getting your salon listed?</p>
          <a
            href="mailto:Glowbookingstudio@gmail.com?subject=Salon Partnership - Glowlist NYC"
            className={styles.emailBtn}
          >
            Email us →
          </a>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Report an Update</h2>
          <p className={styles.cardDesc}>Price, hours, or service info needs updating?</p>
          <a
            href="https://forms.gle/U8ame9qVVGbc4gpn9"
            target="_blank"
            rel="noopener"
            className={styles.emailBtn}
          >
            Use our form →
          </a>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Write a Review</h2>
          <p className={styles.cardDesc}>Share your experience at a salon you&rsquo;ve visited.</p>
          <a
            href="https://tally.so/r/MeQr8l"
            target="_blank"
            rel="noopener"
            className={styles.emailBtn}
          >
            Submit a review →
          </a>
        </div>
      </div>

      <p className={styles.note}>
        We typically respond within 2–3 business days.
        Follow <a href="https://www.instagram.com/glowlist_nyc/" target="_blank" rel="noopener">@glowlist_nyc</a> for the fastest updates.
      </p>
    </section>
  );
}
