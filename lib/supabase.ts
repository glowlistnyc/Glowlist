// lib/supabase.ts
// Supabase クライアントと口コミ取得関数
// 環境変数が未設定の場合は空配列を返すフォールバック付き

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// ── Review型 ────────────────────────────────────────────────────────────────
// public.reviews テーブルのカラムに対応
// salon_id = Contentful の salon.fields.slug（例: "mellow-bar"）
export interface Review {
  id: string;
  salon_id: string;
  reviewer_name?: string | null;
  body?: string | null;
  rating_overall?: number | null;         // 総合 1–5
  rating_price_value?: number | null;     // Price & Value 1–5
  rating_atmosphere?: number | null;      // 雰囲気 1–5
  rating_skill?: number | null;           // 技術 1–5
  rating_reproducibility?: number | null; // デザイン再現性 1–5
  // would_book_again は表示しない（削除対象）
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

// ── 承認済み口コミ取得 ──────────────────────────────────────────────────────
export async function getApprovedReviews(salonSlug: string): Promise<Review[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(
        'id, salon_id, reviewer_name, body, rating_overall, rating_price_value, rating_atmosphere, rating_skill, rating_reproducibility, created_at, status'
      )
      .eq('salon_id', salonSlug)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase] review fetch error:', error.message);
      return [];
    }
    return (data as Review[]) || [];
  } catch (e) {
    console.error('[Supabase] unexpected error:', e);
    return [];
  }
}
