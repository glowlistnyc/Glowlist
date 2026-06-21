// ── Geocoding (住所 → 緯度経度) ──
// OpenStreetMap / Nominatim を使用。無料・APIキー不要。
// Next.jsのfetchキャッシュで30日間結果を保存するため、
// 同じ住所への重複リクエストは発生しない。

export interface GeoPoint {
  lat: number;
  lng: number;
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export async function geocodeAddress(query: string): Promise<GeoPoint | null> {
  if (!query || !query.trim()) return null;

  const url = `${NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=us`;

  try {
    const res = await fetch(url, {
      headers: {
        // Nominatim利用ポリシーにより、識別可能なUser-Agentが必須
        'User-Agent': 'GlowlistNYC/1.0 (https://glowlistnyc.com)',
        'Accept-Language': 'en-US',
      },
      // 30日間キャッシュ。同じ住所は再リクエストしない。
      next: { revalidate: 60 * 60 * 24 * 30 },
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

    return { lat, lng };
  } catch {
    return null;
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
