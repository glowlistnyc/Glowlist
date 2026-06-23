import Link from 'next/link';
import type { Salon } from '@/types';
import styles from './SalonCard.module.css';

interface Props {
  salon: Salon;
}

function toSalonId(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function addGlowlistUtm(url: string, salonId: string) {
  if (!url) return url;

  const separator = url.includes('?') ? '&' : '?';

  return `${url}${separator}utm_source=glowlist&utm_medium=referral&utm_campaign=salon_listing&utm_content=${salonId}_book`;
}

export default function SalonCard({ salon }: Props) {
  const {
    name,
    slug,
    category,
    area,
    tags,
    instagramHandle,
    bookingUrl,
    priceRange,
    language,
    verified,
  } = salon.fields;

  const igUrl = `https://www.instagram.com/${instagramHandle}/`;
  const salonId = toSalonId(name);
  const bookingUrlWithUtm = addGlowlistUtm(bookingUrl, salonId);
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
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </span>

        {priceRange && <span className={styles.price}>{priceRange}</span>}

        <span className={styles.hint}>View details →</span>
      </Link>

      <div className={styles.links}>
        <a
          href={igUrl}
          target="_blank"
          rel="noopener"
          className={`${styles.link} glow-instagram-link`}
          data-salon-id={salonId}
          data-salon-name={name}
          data-category={category}
          data-area={area}
          data-link-type="instagram"
        >
          Instagram ↗
        </a>

        <a
          href={bookingUrlWithUtm}
          target="_blank"
          rel="noopener"
          className={`${styles.link} glow-book-link`}
          data-salon-id={salonId}
          data-salon-name={name}
          data-category={category}
          data-area={area}
          data-link-type="book"
        >
          Book ↗
        </a>
      </div>
    </article>
  );
}