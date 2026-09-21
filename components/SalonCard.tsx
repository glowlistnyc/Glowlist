'use client';
import Link from 'next/link';
import Image from 'next/image';
import type { Salon } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './SalonCard.module.css';

const CATEGORY_IMG: Record<string, string> = {
  nails:  'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80&auto=format&fit=crop',
  lashes: '/images/services/korean-lash-lift.jpg',
  both:   'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80&auto=format&fit=crop',
};

interface Props {
  salon: Salon;
  googlePhotoUrl?: string;
}

function StarDisplay({ rating }: { rating: number }) {
  const full = Math.min(Math.round(rating), 5);
  return (
    <span className={styles.stars} aria-label={`${rating} out of 5`}>
      {'★'.repeat(full)}{'☆'.repeat(5 - full)}
      <span className={styles.starsNum}>{rating.toFixed(1)}</span>
    </span>
  );
}

export default function SalonCard({ salon, googlePhotoUrl }: Props) {
  const { t } = useLanguage();
  const {
    name, slug, category, area, tags,
    instagramHandle, bookingUrl, priceRange,
    language, verified, photos,
    googleRating, yelpRating,
  } = salon.fields;

  const igUrl = `https://www.instagram.com/${instagramHandle}/`;

  const photoSrc =
    googlePhotoUrl ||
    (photos?.[0]?.fields?.file?.url ? `https:${photos[0].fields.file.url}?w=500&h=320&fit=fill` : null) ||
    (CATEGORY_IMG[category] ?? CATEGORY_IMG.nails);

  // 表示評価: Google優先 → Yelp
  const displayRating = googleRating || yelpRating;
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <article className={styles.card}>
      <Link href={`/salon/${slug}`} className={styles.link}>

        {/* 写真（3:2 コンパクト）*/}
        <div className={styles.photo}>
          <Image
            src={photoSrc}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 25vw"
            style={{ objectFit: 'cover' }}
          />
          <div className={styles.photoOverlay} />
          {verified && <span className={styles.badge}>{t.card.verified}</span>}
        </div>

        {/* テキスト情報 */}
        <div className={styles.info}>
          {/* 名前 + 評価 */}
          <div className={styles.nameRow}>
            <h3 className={styles.name}>{name}</h3>
            {displayRating && <StarDisplay rating={displayRating} />}
          </div>

          {/* エリア */}
          <p className={styles.area}>{area}</p>

          {/* サービス + 言語 バッジ */}
          <div className={styles.badges}>
            <span className={styles.serviceTag}>{cap(category)}</span>
            {language && <span className={styles.langTag}>{language}</span>}
          </div>

          {/* 価格 */}
          {priceRange && <span className={styles.price}>{priceRange}</span>}
        </div>
      </Link>

      {/* アクション */}
      <div className={styles.actions}>
        <a href={igUrl} target="_blank" rel="noopener" className={styles.action}>
          {t.card.instagram} ↗
        </a>
        <a href={bookingUrl} target="_blank" rel="noopener" className={`${styles.action} ${styles.actionBook}`}>
          {t.card.book} ↗
        </a>
      </div>
    </article>
  );
}
