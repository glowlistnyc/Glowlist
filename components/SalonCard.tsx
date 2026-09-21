'use client';
import Link from 'next/link';
import Image from 'next/image';
import type { Salon } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './SalonCard.module.css';

// ã‚µãƒ­ãƒ³å†™çœŸãŒãªã„å ´åˆã®ã‚«ãƒ†ã‚´ãƒªãƒ¼åˆ¥ãƒ•ã‚©ãƒ¼ãƒ«ãƒãƒƒã‚¯ç”»åƒ
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

  // å„ªå…ˆé †ä½: Google Photo â†’ Contentful Photo â†’ ã‚«ãƒ†ã‚´ãƒªãƒ¼ãƒ•ã‚©ãƒ¼ãƒ«ãƒãƒƒã‚¯
  const photoSrc =
    googlePhotoUrl ||
    (photos?.[0]?.fields?.file?.url ? `https:${photos[0].fields.file.url}?w=600&h=440&fit=fill` : null) ||
    (CATEGORY_IMG[category] ?? CATEGORY_IMG.nails);

  return (
    <article className={styles.card}>
      <Link href={`/salon/${slug}`} className={styles.link}>

        {/* â”€â”€ å†™çœŸã‚¨ãƒªã‚¢ â”€â”€ */}
        <div className={styles.photo}>
          <Image
            src={photoSrc}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
          <div className={styles.photoOverlay} />

          {/* ãƒãƒƒã‚¸ï¼ˆVerifiedï¼‰ */}
          {verified && (
            <span className={styles.badge}>{t.card.verified}</span>
          )}

          {/* ã‚¿ã‚°ï¼ˆå†™çœŸã®ä¸Šã«å°ã•ãï¼‰ */}
          <div className={styles.photoTags}>
            {tags.slice(0, 2).map((t) => (
              <span key={t} className={styles.photoTag}>{t}</span>
            ))}
          </div>
        </div>

        {/* â”€â”€ ãƒ†ã‚­ã‚¹ãƒˆæƒ…å ± â”€â”€ */}
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
              <span className={styles.lang}> Â· {language}</span>
            )}
          </p>
        </div>
      </Link>

      {/* â”€â”€ ã‚¢ã‚¯ã‚·ãƒ§ãƒ³ãƒªãƒ³ã‚¯ â”€â”€ */}
      <div className={styles.actions}>
        <a href={igUrl} target="_blank" rel="noopener" className={styles.action}>
          {t.card.instagram} â†—
        </a>
        <a href={bookingUrl} target="_blank" rel="noopener" className={`${styles.action} ${styles.actionPrimary}`}>
          {t.card.book} â†—
        </a>
      </div>
    </article>
  );
}

