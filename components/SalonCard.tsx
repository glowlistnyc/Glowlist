import Link from 'next/link';
import type { Salon } from '@/types';
import styles from './SalonCard.module.css';

interface Props {
  salon: Salon;
}

export default function SalonCard({ salon }: Props) {
  const { name, slug, category, area, tags, instagramHandle, bookingUrl, priceRange, language, verified } = salon.fields;

  return (
    <article className={styles.card}>
      <p className={styles.name}>
        {name}
        {verified && <span className={styles.badge}>Verified</span>}
      </p>
      <p className={styles.meta}>
        {area} · {category.charAt(0).toUpperCase() + category.slice(1)}
        {language && ` · ${language}`}
      </p>
      <div className={styles.tags}>
        {tags.slice(0, 3).map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>
      {priceRange && <p className={styles.price}>{priceRange}</p>}
      <div className={styles.links}>
        <a
          href={`https://www.instagram.com/${instagramHandle}/`}
          target="_blank"
          rel="noopener"
          className={styles.link}
        >
          Instagram ↗
        </a>
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener"
          className={styles.link}
        >
          Book ↗
        </a>
      </div>
      <Link href={`/salon/${slug}`} className={styles.hint}>
        Tap for details →
      </Link>
    </article>
  );
}