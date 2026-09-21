import Link from 'next/link';
import Image from 'next/image';
import type { Salon } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './SalonCard.module.css';

// サロン写真がない場合のカテゴリー別フォールバック画像
const CATEGORY_IMG: Record<string, string> = {
  nails:  'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80&auto=format&fit=crop',
  lashes: '/images/services/korean-lash-lift.jpg',
  both:   'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80&auto=format&fit=crop',
};

interface Props {
  salon: Salon;
  googlePhotoUrl?: string; // Google Places photo proxy URL
}

export default function SalonCard({ salon, googlePhotoUrl }: Props) {
  const { t } = useLanguage();
  const {
    name, slug, category, area,
    tags, instagramHandle, bookingUrl,
    priceRange, language, verified, photos,
  } = salon.fields;

  const igUrl = `https://www.instagram.com/${instagramHandle}/`;

  // 優先順位: Google Photo → Contentful Photo → カテゴリーフォールバック
  const photoSrc =
    googlePhotoUrl ||
    (photos?.[0]?.fields?.file?.url ? `https:${photos[0].fields.file.url}?w=600&h=440&fit=fill` : null) ||
    (CATEGORY_IMG[category] ?? CATEGORY_IMG.nails);

  return (
    <article className={styles.card}>
      <Link href={`/salon/${slug}`} className={styles.link}>

        {/* ── 写真エリア ── */}
        <div className={styles.photo}>
          <Image
            src={photoSrc}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
          <div className={styles.photoOverlay} />

          {/* バッジ（Verified） */}
          {verified && (
            <span className={styles.badge}>{t.card.verified}</span>
          )}

          {/* タグ（写真の上に小さく） */}
          <div className={styles.photoTags}>
            {tags.slice(0, 2).map((t) => (
              <span key={t} className={styles.photoTag}>{t}</span>
            ))}
          </div>
        </div>

        {/* ── テキスト情報 ── */}
        <div className={styles.info}>
          <div className={styles.infoTop}>
            <h3 className={styles.name}>{name}</h3>
            {priceRange && (
              <span className={styles.price}>{priceRange}</span>
            )}
          </div>
          <p className={styles.meta}>
            {area}
            {language && (
              <span className={styles.lang}> · {language}</span>
            )}
          </p>
        </div>
      </Link>

      {/* ── アクションリンク ── */}
      <div className={styles.actions}>
        <a href={igUrl} target="_blank" rel="noopener" className={styles.action}>
          {t.card.instagram} ↗
        </a>
        <a href={bookingUrl} target="_blank" rel="noopener" className={`${styles.action} ${styles.actionPrimary}`}>
          {t.card.book} ↗
        </a>
      </div>
    </article>
  );
}
