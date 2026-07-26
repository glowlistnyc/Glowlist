import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Disclaimer — Glowlist NYC',
  description: 'Legal disclaimer for Glowlist NYC, an independent curated beauty discovery guide.',
};

const UPDATED = 'June 2025';

export default function DisclaimerPage() {
  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <span className="sec-label">Legal</span>
        <h1 className={styles.h1}>Disclaimer</h1>
        <p className={styles.updated}>Last updated: {UPDATED}</p>
      </header>

      <div className={styles.body}>

        <section className={styles.section}>
          <h2>1. Independent Guide</h2>
          <p>
            Glowlist NYC (<strong>glowlistnyc.com</strong>) is an independent curated beauty discovery guide.
            We are not affiliated with, endorsed by, or sponsored by any of the salons, studios, or businesses listed on this site unless explicitly stated.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Accuracy of Information</h2>
          <p>
            Pricing, services, hours, availability, and other details shown on this site are sourced from publicly available information including salon websites, menus, and social media at the time of listing.
            This information may not reflect current rates or offerings.
          </p>
          <p>
            Glowlist NYC makes no warranties — express or implied — about the accuracy, completeness, or timeliness of any information displayed.
            <strong> Always confirm pricing, availability, and services directly with the salon before booking.</strong>
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Third-Party Links and Booking</h2>
          <p>
            This site links to third-party booking platforms, salon websites, and Instagram profiles.
            These are provided for convenience only.
            Glowlist NYC has no control over the content, accuracy, or practices of third-party sites and accepts no responsibility for any transactions, bookings, or experiences that result from using those links.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. User-Submitted Content and Photos</h2>
          <p>
            Glowlist NYC may display photos and reviews submitted by users who have consented to publication at the time of submission.
            By submitting content, users represent that they own the rights to the content or have permission to share it, and grant Glowlist NYC a non-exclusive license to display it on this site.
          </p>
          <p>
            If you believe your copyrighted material has been included without permission, please contact us and we will remove it promptly.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Paid Placements and Featured Listings</h2>
          <p>
            Some listings on Glowlist NYC may be "Featured" placements for which salons have paid a fee to receive additional visibility.
            All paid placements are clearly indicated with a "Featured" badge.
            Payment does not influence editorial curation decisions, ratings, or review content.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. No Professional Advice</h2>
          <p>
            Content on this site is for informational and discovery purposes only.
            Nothing on Glowlist NYC constitutes professional medical, dermatological, or cosmetic advice.
            If you have concerns about a beauty service or skin reaction, consult a licensed professional.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable law, Glowlist NYC, its operators, contributors, and affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of this site or reliance on any information contained herein.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Changes to This Disclaimer</h2>
          <p>
            We reserve the right to update this disclaimer at any time.
            Continued use of the site after changes are posted constitutes acceptance of the updated terms.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Contact</h2>
          <p>
            Questions about this disclaimer? Reach us via{' '}
            <a href="https://www.instagram.com/glowlist_nyc/" target="_blank" rel="noopener">@glowlist_nyc on Instagram</a>{' '}
            or through our{' '}
            <a href="https://forms.gle/U8ame9qVVGbc4gpn9" target="_blank" rel="noopener">contact form</a>.
          </p>
        </section>

        <div style={{ marginTop: '3rem' }}>
          <Link href="/" className="btn btn-ghost">← Back to Glowlist</Link>
        </div>
      </div>
    </article>
  );
}
