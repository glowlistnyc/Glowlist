// lib/googlePlaces.ts
// Google Places API — サーバーサイドのみ（APIキー非公開）

export interface PlacePhoto {
  proxyUrl: string;    // /api/place-photo?ref=...  ← クライアントから安全に使える
  width: number;
  height: number;
}

export interface PlaceSummary {
  rating?: number;
  reviewCount?: number;
  photos: PlacePhoto[];
}

// Place Details から写真+評価を取得（サーバーコンポーネント専用）
export async function getPlaceSummary(placeId: string): Promise<PlaceSummary | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key || !placeId) return null;

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=rating,user_ratings_total,photos&key=${key}`,
      { next: { revalidate: 3600 } } // 1時間キャッシュ
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.result) return null;

    const photos: PlacePhoto[] = (data.result.photos ?? []).slice(0, 6).map(
      (p: { photo_reference: string; width: number; height: number }) => ({
        proxyUrl: `/api/place-photo?ref=${encodeURIComponent(p.photo_reference)}&w=800`,
        width: p.width,
        height: p.height,
      })
    );

    return {
      rating:      data.result.rating,
      reviewCount: data.result.user_ratings_total,
      photos,
    };
  } catch {
    return null;
  }
}

// リスト用: 最初の1枚だけ取得（高速）
export async function getPlaceFirstPhoto(placeId: string): Promise<string | null> {
  const summary = await getPlaceSummary(placeId);
  return summary?.photos[0]?.proxyUrl ?? null;
}
