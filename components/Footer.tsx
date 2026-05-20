import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>Glowlist NYC</Link>
          <p>A curated guide to Asian-inspired nails, lashes, and beauty spots in New York.</p>
        </div>

        <div className={styles.links}>
          <div>
            <p className={styles.colTitle}>Explore</p>
            <Link href="/area">By Area</Link>
            <Link href="/service">By Service</Link>
            <Link href="/blog">Blog</Link>
          </div>
          <div>
            <p className={styles.colTitle}>Contribute</p>
            <a href="https://forms.gle/VmLJBtzQ3tXpjFri9" target="_blank" rel="noopener">Submit a Spot</a>
            <a href="https://forms.gle/DLBDikk6Do6LHSxu6" target="_blank" rel="noopener">Photo Drop</a>
            <a href="https://forms.gle/U8ame9qVVGbc4gpn9" target="_blank" rel="noopener">Report Update</a>
          </div>
          <div>
            <p className={styles.colTitle}>Follow</p>
            <a href="https://www.instagram.com/glowlist_nyc/" target="_blank" rel="noopener">Instagram ↗</a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.disclaimer}>
          Glowlist NYC is an independent curated beauty discovery guide. Not affiliated with any listed salon unless explicitly stated.
          Prices, services, and availability may change — confirm directly with each salon before booking.
          Paid placements are always disclosed.
        </p>
        <p className={styles.copy}>© {new Date().getFullYear()} Glowlist NYC</p>
      </div>
    </footer>
  );
}
