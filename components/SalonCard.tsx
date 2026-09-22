'use client';
import Link from 'next/link';
import Image from 'next/image';
import type { Salon } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './SalonCard.module.css';

// カテゴリーラベルの翻訳
const CATEGORY_LABEL: Record<string, Record<string, string>> = {
  nails:  { en:'Nails',         ja:'ネイル',         ko:'네일',      'zh-TW':'美甲',     'zh-CN':'美甲' },
  lashes: { en:'Lashes',        ja:'まつ毛',         ko:'속눈썹',    'zh-TW':'睫毛',     'zh-CN':'睫毛' },
  both:   { en:'Nails & Lashes',ja:'ネイル＆まつ毛', ko:'네일 & 속눈썹','zh-TW':'美甲＆睫毛','zh-CN':'美甲＆睫毛' },
};

// 写真なし時のカテゴリー別フォールバック
const CATEGORY_IMG: Record<string, string> = {
  nails:  'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80&auto=format&fit=crop',
  lashes: '/images/services/korean-lash-lift.jpg',
  both:   'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80&auto=format&fit=crop',
};

interface Props {
  salon: Salon;
  googlePhotoUrl?: string;
  fmtPrice?: (p: string) => string;
}

function Stars({ n }: { n: number }) {
  const f = Math.min(Math.round(n), 5);
  return (
    <span className={styles.stars}>
      {'★'.repeat(f)}{'☆'.repeat(5 - f)}
      <span className={styles.starsNum}>{n.toFixed(1)}</span>
    </span>
  );
}

export default function SalonCard({ salon, googlePhotoUrl, fmtPrice }: Props) {
  const { t, lang } = useLanguage();
  const { name, slug, category, area, instagramHandle, bookingUrl,
          priceRange, language, verified, photos, googleRating, yelpRating } = salon.fields;

  const igUrl = `https://www.instagram.com/${instagramHandle}/`;
  const photoSrc =
    googlePhotoUrl ||
    (photos?.[0]?.fields?.file?.url ? `https:${photos[0].fields.file.url}?w=500&h=375&fit=fill` : null) ||
    (CATEGORY_IMG[category] ?? CATEGORY_IMG.nails);

  const displayRating = googleRating || yelpRating;
  const catLabel = (CATEGORY_LABEL[category]?.[lang]) ?? (CATEGORY_LABEL[category]?.['en'] ?? category);

  return (
    <article className={styles.card}>
      <Link href={`/salon/${slug}`} className={styles.link}>
        {/* 写真 — サービスカードと同じ 4:3 */}
        <div className={styles.photo}>
          <Image
            src={photoSrc}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 25vw"
            style={{ objectFit: 'cover' }}
          />
          <div className={styles.overlay} />
          {verified && <span className={styles.badge}>{t.card.verified}</span>}
        </div>

        {/* 情報 */}
        <div className={styles.info}>
          <div className={styles.row}>
            <h3 className={styles.name}>{name}</h3>
            {displayRating && <Stars n={displayRating} />}
          </div>
          <p className={styles.area}>{area}</p>
          <div className={styles.tags}>
            <span className={styles.catTag}>{catLabel}</span>
            {language && <span className={styles.langTag}>{language}</span>}
          </div>
          {priceRange && <p className={styles.price}>{fmtPrice ? fmtPrice(priceRange) : priceRange}</p>}
        </div>
      </Link>

      <div className={styles.actions}>
        <a href={igUrl}     target="_blank" rel="noopener" className={styles.action}>{t.card.instagram} ↗</a>
        <a href={bookingUrl} target="_blank" rel="noopener" className={`${styles.action} ${styles.bookBtn}`}>{t.card.book} ↗</a>
      </div>
    </article>
  );
}
