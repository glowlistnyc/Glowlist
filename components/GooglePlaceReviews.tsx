'use client';
// GooglePlaceReviews.tsx
// gmpx-place-overview (写真+評価+概要) + gmpx-place-reviews (口コミ一覧)
import { useEffect, useRef } from 'react';
import styles from './GooglePlaceReviews.module.css';

const CDN_URL   = 'https://unpkg.com/@googlemaps/extended-component-library@0.6.11/dist/index.min.js';
const SCRIPT_ATTR = 'data-glowlist-gmpx';
const LOADER_ID   = 'gmpx-api-loader-glowlist';

interface Props { placeId: string; salonName?: string }

export default function GooglePlaceReviews({ placeId, salonName }: Props) {
  const overviewRef = useRef<HTMLDivElement>(null);
  const reviewsRef  = useRef<HTMLDivElement>(null);
  const injectedRef = useRef(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !placeId) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (injectedRef.current) return;
      injectedRef.current = true;

      try {
        // CSS テーマ適用ヘルパー
        const applyTheme = (el: HTMLElement) => {
          el.style.setProperty('--gmpx-color-surface',            '#1a2035');
          el.style.setProperty('--gmpx-color-on-surface',         '#e0d4bc');
          el.style.setProperty('--gmpx-color-on-surface-variant', '#a08a68');
          el.style.setProperty('--gmpx-color-primary',            '#c4a882');
          el.style.setProperty('--gmpx-color-outline',            'rgba(224,212,188,0.18)');
          el.style.setProperty('--gmpx-font-family-base',         '"DM Sans", sans-serif');
          el.style.setProperty('--gmpx-font-family-headings',     '"Cormorant Garamond", serif');
          el.style.setProperty('--gmpx-border-radius',            '0');
        };

        // API Loader（ページ全体で1個）
        if (!document.getElementById(LOADER_ID)) {
          const loader = document.createElement('gmpx-api-loader') as HTMLElement;
          loader.id = LOADER_ID;
          loader.setAttribute('key', apiKey);
          loader.setAttribute('solution-channel', 'GMP_PLACE_DETAILS_GLOWLIST');
          document.body.prepend(loader);
        }

        // gmpx-place-overview: 写真 + 評価 + 概要
        if (overviewRef.current) {
          applyTheme(overviewRef.current);
          const overview = document.createElement('gmpx-place-overview') as HTMLElement;
          overview.setAttribute('place', placeId);
          overview.setAttribute('size', 'medium');
          overviewRef.current.appendChild(overview);
        }

        // gmpx-place-reviews: 口コミ一覧
        if (reviewsRef.current) {
          applyTheme(reviewsRef.current);
          const reviews = document.createElement('gmpx-place-reviews') as HTMLElement;
          reviews.setAttribute('place', placeId);
          reviewsRef.current.appendChild(reviews);
        }

        // CDN スクリプト（1回のみ）
        if (!document.querySelector(`script[${SCRIPT_ATTR}]`)) {
          const script = document.createElement('script');
          script.type = 'module';
          script.src  = CDN_URL;
          script.setAttribute(SCRIPT_ATTR, '');
          script.onerror = () => {
            if (overviewRef.current) overviewRef.current.style.display = 'none';
            if (reviewsRef.current)  reviewsRef.current.style.display  = 'none';
          };
          document.head.appendChild(script);
        }
      } catch {
        if (overviewRef.current) overviewRef.current.style.display = 'none';
        if (reviewsRef.current)  reviewsRef.current.style.display  = 'none';
      }
    }, { rootMargin: '400px' });

    if (overviewRef.current) observer.observe(overviewRef.current);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeId]);

  const mapUrl = `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(placeId)}`;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Google</h2>

      {/* Photos + 概要 */}
      <div ref={overviewRef} className={styles.overviewWrap} />

      {/* 口コミ */}
      <div ref={reviewsRef} className={styles.reviewsWrap} />

      <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
        View on Google Maps ↗
      </a>
      <p className={styles.attribution}>
        Photos and reviews from{' '}
        <a href="https://maps.google.com" target="_blank" rel="noopener">Google</a>.
        {' '}<a href="/disclaimer">Disclaimer →</a>
      </p>
    </section>
  );
}
