'use client';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>Glowlist NYC</Link>
          <p>{t.footer.tagline}</p>
        </div>

        <div className={styles.links}>
          <div>
            <p className={styles.colTitle}>{t.footer.explore}</p>
            <Link href="/area">{t.footer.byArea}</Link>
            <Link href="/service">{t.footer.byService}</Link>
            <Link href="/blog">{t.footer.blog}</Link>
            <Link href="/about">{t.footer.about}</Link>
            <Link href="/disclaimer">{t.footer.disclaimer}</Link>
          </div>
          <div>
            <p className={styles.colTitle}>{t.footer.contribute}</p>
            <a href="https://forms.gle/VmLJBtzQ3tXpjFri9" target="_blank" rel="noopener">{t.footer.submitSpot}</a>
            <a href="https://tally.so/r/MeQr8l" target="_blank" rel="noopener">{t.footer.photoDrop}</a>
            <a href="https://forms.gle/U8ame9qVVGbc4gpn9" target="_blank" rel="noopener">{t.footer.reportUpdate}</a>
          </div>
          <div>
            <p className={styles.colTitle}>{t.footer.follow}</p>
            <a href="https://www.instagram.com/glowlist_nyc/" target="_blank" rel="noopener">Instagram ↗</a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.disclaimer}>{t.footer.legalNote}</p>
        <p className={styles.copy}>© {new Date().getFullYear()} Glowlist NYC</p>
      </div>
    </footer>
  );
}
