// lib/yelp.ts — サーバーサイドのみ（YELP_API_KEY は NEXT_PUBLIC_ なし）

export interface YelpReview {
  id: string;
  rating: number;
  text: string;
  time_created: string;
  url: string;
  user: { name: string; image_url?: string };
}

export interface YelpData {
  businessUrl: string;
  rating: number;
  reviewCount: number;
  reviews: YelpReview[];
}

export async function getYelpData(businessId: string): Promise<YelpData | null> {
  const key = process.env.YELP_API_KEY;
  if (!key || !businessId) return null;

  const headers = { Authorization: `Bearer ${key}`, Accept: 'application/json' };

  try {
    const [bizRes, revRes] = await Promise.all([
      fetch(`https://api.yelp.com/v3/businesses/${businessId}`,
        { headers, next: { revalidate: 3600 } }),
      fetch(`https://api.yelp.com/v3/businesses/${businessId}/reviews?limit=3&sort_by=yelp_sort`,
        { headers, next: { revalidate: 3600 } }),
    ]);

    if (!bizRes.ok || !revRes.ok) return null;

    const [biz, rev] = await Promise.all([bizRes.json(), revRes.json()]);

    return {
      businessUrl:  biz.url,
      rating:       biz.rating ?? 0,
      reviewCount:  biz.review_count ?? 0,
      reviews:      rev.reviews ?? [],
    };
  } catch {
    return null;
  }
}
