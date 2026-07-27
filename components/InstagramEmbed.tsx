'use client';

import { useEffect, useMemo } from 'react';
import styles from './InstagramEmbed.module.css';

interface Props {
  postUrls: string[];
  salonName: string;
}

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

function normalizeInstagramUrl(value: string): string | null {
  try {
    const url = new URL(value.trim());
    const validHost =
      url.hostname === 'instagram.com' ||
      url.hostname === 'www.instagram.com';
    const validPath = /^\/(p|reel|tv)\/[^/]+\/?/.test(url.pathname);

    if (!validHost || !validPath) return null;

    url.protocol = 'https:';
    url.hostname = 'www.instagram.com';
    url.search = '';
    url.hash = '';
    if (!url.pathname.endsWith('/')) url.pathname += '/';
    return url.toString();
  } catch {
    return null;
  }
}

export default function InstagramEmbed({ postUrls, salonName }: Props) {
  const validPostUrls = useMemo(
    () =>
      Array.from(
        new Set(
          postUrls
            .map(normalizeInstagramUrl)
            .filter((url): url is string => Boolean(url)),
        ),
      ).slice(0, 3),
    [postUrls],
  );

  useEffect(() => {
    if (validPostUrls.length === 0) return;

    const processEmbeds = () => window.instgrm?.Embeds.process();
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.instagram.com/embed.js"]',
    );

    if (window.instgrm) {
      processEmbeds();
      return;
    }

    if (existingScript) {
      existingScript.addEventListener('load', processEmbeds, { once: true });
      return () => existingScript.removeEventListener('load', processEmbeds);
    }

    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = processEmbeds;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [validPostUrls]);

  if (validPostUrls.length === 0) return null;

  return (
    <section className={styles.wrap}>
      <h2 className={styles.title}>From {salonName}&rsquo;s Instagram</h2>
      <div className={styles.grid}>
        {validPostUrls.map((url) => (
          <blockquote
            key={url}
            className={`instagram-media ${styles.embed}`}
            data-instgrm-permalink={url}
            data-instgrm-version="14"
          />
        ))}
      </div>
      <p className={styles.note}>Posts shown with permission from the salon.</p>
    </section>
  );
}
