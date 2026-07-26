'use client';
import { useEffect } from 'react';
import styles from './InstagramEmbed.module.css';

// Instagram embed requires specific post URLs
// Contentful Salon → instagramPostUrls field (Array of Short text)
// Each value: https://www.instagram.com/p/XXXXXXX/
// (Get this URL by opening a specific Instagram post and copying the link)

interface Props { postUrls: string[]; salonName: string }

declare global {
  interface Window { instgrm?: { Embeds: { process: () => void } } }
}

export default function InstagramEmbed({ postUrls, salonName }: Props) {
  useEffect(() => {
    // Instagram embed script を動的にロード
    const load = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      } else {
        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        script.onload = () => window.instgrm?.Embeds.process();
        document.body.appendChild(script);
      }
    };
    load();
  }, [postUrls]);

  if (!postUrls || postUrls.length === 0) return null;

  return (
    <section className={styles.wrap}>
      <h2 className={styles.title}>From {salonName}&rsquo;s Instagram</h2>
      <div className={styles.grid}>
        {postUrls.map((url, i) => (
          <blockquote
            key={i}
            className={`instagram-media ${styles.embed}`}
            data-instgrm-permalink={url}
            data-instgrm-version="14"
            data-instgrm-captioned
          />
        ))}
      </div>
      <p className={styles.note}>Posts shown with permission from the salon.</p>
    </section>
  );
}
