export type PublicReview = {
  id: string;
  reviewer_name: string;
  overall_rating: number;
  atmosphere_rating: number | null;
  service_rating: number | null;
  quality_rating: number | null;
  value_rating: number | null;
  service_category: string | null;
  service_type: string;
  visit_month: string | null;
  review_title: string | null;
  review_text: string;
  return_intent: 'yes' | 'maybe' | 'no' | null;
  first_visit: boolean | null;
  relationship_disclosure:
    | 'none'
    | 'free_or_discounted'
    | 'salon_connection';
  published_at: string | null;
  created_at: string;
};

function getPublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !key) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is missing.',
    );
  }

  return {
    url: url.replace(/\/$/, ''),
    key,
  };
}

export async function getApprovedReviews(
  salonId: string,
  signal?: AbortSignal,
): Promise<PublicReview[]> {
  const { url, key } = getPublicConfig();
  const endpoint = new URL(`${url}/rest/v1/reviews`);

  endpoint.searchParams.set(
    'select',
    [
      'id',
      'reviewer_name',
      'overall_rating',
      'atmosphere_rating',
      'service_rating',
      'quality_rating',
      'value_rating',
      'service_category',
      'service_type',
      'visit_month',
      'review_title',
      'review_text',
      'return_intent',
      'first_visit',
      'relationship_disclosure',
      'published_at',
      'created_at',
    ].join(','),
  );
  endpoint.searchParams.set('salon_id', `eq.${salonId}`);
  endpoint.searchParams.set('status', 'eq.approved');
  endpoint.searchParams.set(
    'order',
    'published_at.desc.nullslast,created_at.desc',
  );
  endpoint.searchParams.set('limit', '1000');

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      apikey: key,
      Accept: 'application/json',
    },
    cache: 'no-store',
    signal,
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Supabase reviews request failed (${response.status}): ${details}`,
    );
  }

  return (await response.json()) as PublicReview[];
}
