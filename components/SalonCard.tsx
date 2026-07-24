import Link from 'next/link';
import type { Salon } from '@/types';
import styles from './SalonCard.module.css';

interface Props { salon: Salon }

export default function SalonCard({ salon }: Props) {
  const { name, slug, category, area, tags, instagramHandle, bookingUrl, priceRange, language, verified } = salon.fields;
  const igUrl = `https://www.instagram.com/${instagramHandle}/`;
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <article className={styles.card}>
      <Link href={`/salon/${slug}`} className={styles.cardInner}>
        <span className={styles.name}>
          {name}
          {verified && <span className={styles.badge}>Verified</span>}
        </span>
        <span className={styles.meta}>
          {area} · {cap(category)}
          {language && ` · ${language}`}
        </span>
        <span className={styles.tags}>
          {tags.slice(0, 3).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </span>
        {priceRange && <span className={styles.price}>{priceRange}</span>}
        <span className={styles.hint}>View details →</span>
      </Link>
      <div className={styles.links}>
        <a href={igUrl} target="_blank" rel="noopener" className={styles.link}>Instagram ↗</a>
        <a href={bookingUrl} target="_blank" rel="noopener" className={styles.link}>Book ↗</a>
      </div>
    </article>
  );
}
