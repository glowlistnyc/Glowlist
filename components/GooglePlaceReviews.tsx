'use client';
// GooglePlaceReviews.tsx
// Google Places UI Kit（Extended Component Library）
// gmpx-place-overview: 写真 + 評価 + 概要
// gmpx-place-reviews:  口コミ一覧
//
// 必要な設定:
// 1. Vercel環境変数: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
// 2. Contentfulの各サロンに googlePlaceId フィールドを設定
// 3. Google Cloud: Maps JavaScript API + Places API (New) を有効化

import { useEffect, useRef, useState } from 'react';
import styles from './GooglePlaceReviews.module.css';

const CDN_URL     = 'https://unpkg.com/@googlemaps/extended-component-library@0.6.11/dist/index.min.js';
const LOADER_ID   = 'gmpx-api-loader-glowlist';
const SCRIPT_ATTR = 'data-glowlist-gmpx';

interface Props { placeId: string; salonName?: string }

export default function GooglePlaceReviews({ placeId, salonName }: Props) {
  const overviewRef = useRef<HTMLDivElement>(null);
  const reviewsRef  = useRef<HTMLDivElement>(null);
  const [noKey, setNoKey] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setNoKey(true);
      return;
    }
    if (!placeId) return;

    // Glowlist テーマを gmpx CSS 変数で設定
    const applyTheme = (el: HTMLElement) => {
      el.style.setProperty('--gmpx-color-surface',            '#1a2035');
      el.style.setProperty('--gmpx-color-on-surface',         '#e0d4bc');
      el.style.setProperty('--gmpx-color-on-surface-variant', '#a08a68');
      el.style.setProperty('--gmpx-color-primary',            '#c4a882');
      el.style.setProperty('--gmpx-color-outline',            'rgba(224,212,188,0.18)');
      el.style.setProperty('--gmpx-font-family-base',         '"DM Sans", sans-serif');
    };

    // 1. API Loader（ページ全体で1個のみ）
    if (!document.getElementById(LOADER_ID)) {
      const loader = document.createElement('gmpx-api-loader') as HTMLElement;
      loader.id = LOADER_ID;
      loader.setAttribute('key', apiKey);
      loader.setAttribute('solution-channel', 'GMP_PLACE_GLOWLIST');
      document.body.prepend(loader);
    }

    // 2. gmpx-place-overview（写真 + 評価 + 住所）
    if (overviewRef.current && overviewRef.current.childElementCount === 0) {
      applyTheme(overviewRef.current);
      const ov = document.createElement('gmpx-place-overview') as HTMLElement;
      ov.setAttribute('place', placeId);
      ov.setAttribute('size', 'medium');
      overviewRef.current.appendChild(ov);
    }

    // 3. gmpx-place-reviews（口コミ一覧）
    if (reviewsRef.current && reviewsRef.current.childElementCount === 0) {
      applyTheme(reviewsRef.current);
      const rv = document.createElement('gmpx-place-reviews') as HTMLElement;
      rv.setAttribute('place', placeId);
      reviewsRef.current.appendChild(rv);
    }

    // 4. CDN スクリプト読み込み（1回のみ）
    if (!document.querySelector(`script[${SCRIPT_ATTR}]`)) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src  = CDN_URL;
      script.setAttribute(SCRIPT_ATTR, '');
      document.head.appendChild(script);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeId]);

  // APIキー未設定の場合は何も表示しない（エラーメッセージもなし）
  if (noKey) return null;

  const mapUrl = `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(placeId)}`;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Google Reviews</h2>
      <div ref={overviewRef} className={styles.overviewWrap} />
      <div ref={reviewsRef}  className={styles.reviewsWrap} />
      <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
        View on Google Maps ↗
      </a>
      <p className={styles.attribution}>
        Photos and reviews via{' '}
        <a href="https://maps.google.com" target="_blank" rel="noopener">Google Maps</a>.
        {' '}<a href="/disclaimer">Disclaimer →</a>
      </p>
    </section>
  );
}
