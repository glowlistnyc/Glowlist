import Link from 'next/link';
import type { Salon } from '@/types';
import styles from './SalonCard.module.css';

interface Props {
  salon: Salon;
}

function addGlowlistUtm(url: string, salonId: string) {
  if (!url) return '';

  // すでにGlowlistのUTMが付いている場合は二重につけない
  if (url.includes('utm_source=glowlist')) return url;

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

  const salonId = slug;
  const igHandle = instagramHandle?.replace('@', '');
  const igUrl = igHandle ? `https://www.instagram.com/${igHandle}/` : '';
  const bookingUrlWithUtm = bookingUrl ? addGlowlistUtm(bookingUrl, salonId) : '';
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
        {igUrl && (
          <a
            href={igUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.link} glow-instagram-link`}
            data-salon-id={salonId}
            data-salon-name={name}
            data-category={category}
            data-area={area}
            data-link-type="instagram"
          >
            Instagram ↗
          </a>
        )}

        {bookingUrlWithUtm && (
          <a
            href={bookingUrlWithUtm}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.link} glow-book-link`}
            data-salon-id={salonId}
            data-salon-name={name}
            data-category={category}
            data-area={area}
            data-link-type="book"
          >
            Book ↗
          </a>
        )}
      </div>
    </article>
  );
}