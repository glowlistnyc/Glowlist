'use client';
// GooglePlaceReviews.tsx
// Google Places UI Kit（Extended Component Library）を使って
// サロンのGoogle評価・レビューをリアルタイムで表示する。
//
// ─ 設計方針 ─────────────────────────────────────────────────
//   - googlePlaceId がない場合は何も表示しない
//   - IntersectionObserver で lazy load（viewport 400px 手前でロード）
//   - Google のデータは永続保存しない（表示のみ）
//   - エラーが起きてもページ全体には影響しない
//   - Glowlist のデザイントークンでテーマ適用
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react';
import styles from './GooglePlaceReviews.module.css';

// CDN URL（バージョン固定でキャッシュを安定させる）
const CDN_URL =
  'https://unpkg.com/@googlemaps/extended-component-library@0.6.11/dist/index.min.js';
const SCRIPT_ATTR = 'data-glowlist-gmpx';
const LOADER_ID   = 'gmpx-api-loader-glowlist';

interface Props {
  placeId:    string;         // ContentfulのgooglePlaceIdフィールド
  salonName?: string;         // Google Mapsリンク用のサロン名（任意）
}

export default function GooglePlaceReviews({ placeId, salonName }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const injectedRef  = useRef(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !placeId) return;

    // IntersectionObserver: viewport から 400px 以内に入ったら遅延ロード
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (injectedRef.current) return;
        injectedRef.current = true;

        try {
          inject(apiKey);
        } catch (err) {
          console.error('[GooglePlaceReviews] load failed:', err);
          // エラーはユーザーに見せない → コンテナを非表示にするだけ
          if (containerRef.current) {
            containerRef.current.style.display = 'none';
          }
        }
      },
      { rootMargin: '400px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();

    function inject(key: string) {
      const container = containerRef.current;
      if (!container) return;

      // ── CSS カスタムプロパティでGlowlistテーマを適用 ──────────────────
      // gmpx-place-reviews は Shadow DOM を使っているが、
      // CSS custom properties はシャドウ境界を貫通する
      container.style.setProperty('--gmpx-color-surface',            '#1a2035');
      container.style.setProperty('--gmpx-color-on-surface',         '#e0d4bc');
      container.style.setProperty('--gmpx-color-on-surface-variant', '#a08a68');
      container.style.setProperty('--gmpx-color-primary',            '#c4a882');
      container.style.setProperty('--gmpx-color-on-primary',         '#1a2035');
      container.style.setProperty('--gmpx-color-outline',            'rgba(224,212,188,0.18)');
      container.style.setProperty('--gmpx-font-family-base',         '"DM Sans", sans-serif');
      container.style.setProperty('--gmpx-font-family-headings',     '"Cormorant Garamond", serif');
      container.style.setProperty('--gmpx-font-size-base',           '0.88rem');
      container.style.setProperty('--gmpx-border-radius',            '0');

      // ── API Loader（1ページ1つのみ）────────────────────────────────────
      if (!document.getElementById(LOADER_ID)) {
        const loader = document.createElement('gmpx-api-loader') as HTMLElement;
        loader.id = LOADER_ID;
        loader.setAttribute('key', key);
        // solution-channel は Google への利用目的申告
        loader.setAttribute('solution-channel', 'GMP_PLACE_REVIEWS_GLOWLIST');
        document.body.prepend(loader);
      }

      // ── gmpx-place-reviews（レビューカード一覧）────────────────────────
      const reviewsEl = document.createElement('gmpx-place-reviews') as HTMLElement;
      reviewsEl.setAttribute('place', placeId);
      // Google ロゴはフッターに別途表示するのでここでは任意
      reviewsEl.setAttribute('google-logo-already-displayed', 'false');
      container.appendChild(reviewsEl);

      // ── CDN スクリプト（1ページ1回のみロード）──────────────────────────
      if (!document.querySelector(`script[${SCRIPT_ATTR}]`)) {
        const script  = document.createElement('script');
        script.type   = 'module';
        script.src    = CDN_URL;
        script.setAttribute(SCRIPT_ATTR, '');
        script.onerror = () => {
          if (containerRef.current) containerRef.current.style.display = 'none';
        };
        document.head.appendChild(script);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeId]);

  const mapUrl = `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(placeId)}`;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Google Reviews</h2>

      {/* ── gmpx-place-reviews がここに注入される ── */}
      <div ref={containerRef} className={styles.embedWrap} />

      {/* ── Google Maps リンク（Google 利用規約で推奨）── */}
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.mapLink}
        aria-label={`View ${salonName ?? 'this salon'} on Google Maps`}
      >
        View on Google Maps ↗
      </a>

      {/* ── Attribution（Google 利用規約準拠）── */}
      <p className={styles.attribution}>
        Reviews powered by{' '}
        <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
          Google
        </a>
        . Ratings and content may change.{' '}
        <a href="/disclaimer">Disclaimer</a>
      </p>
    </section>
  );
}
