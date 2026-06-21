// ─── Contentful Content Types ───────────────────────────────────────────────
// これらの型はContentfulのコンテンツモデルと対応しています

import type { Document } from '@contentful/rich-text-types';

export interface ContentfulImage {
  fields: {
    title: string;
    description?: string;
    file: {
      url: string;
      details: { size: number; image?: { width: number; height: number } };
      fileName: string;
      contentType: string;
    };
  };
}

// ── Salon (サロン) ──────────────────────────────────────────────────────────
export interface PriceItem {
  service: string;
  price: string;
}

export interface PriceCategory {
  category: string;
  items: PriceItem[];
}

export interface SalonFields {
  name: string;                    // サロン名
  slug: string;                    // URL: /salon/mellow-bar
  category: 'nails' | 'lashes' | 'both';
  area: string;                    // 表示用エリア名 (e.g. "SoHo / West Village")
  areaSlug: string;                // URLスラッグ (e.g. "soho")
  tags: string[];                  // ["Japanese gel", "Kokoist", "HEMA-free"]
  instagramHandle: string;         // mellowbarnyc (@ なし)
  bookingUrl: string;
  websiteUrl?: string;             // 公式HP URL
  address?: string;                // 住所 (e.g. "120 Sullivan St, New York, NY 10012")
  priceRange: string;              // "From $70" など
  language?: string;               // "Japanese-speaking" など
  priceDetails: PriceCategory[];   // 料金表 (JSONフィールド)
  verified: boolean;
  notes?: string;
  heroImage?: ContentfulImage;
  photos?: ContentfulImage[];      // サロン公式写真
  relatedSalons?: Salon[];         // 他店舗・同チェーン店
  seoTitle?: string;
  seoDescription?: string;
  featured: boolean;               // Community Picksに表示
}

export interface Salon {
  sys: { id: string; updatedAt: string };
  fields: SalonFields;
}

// ── Area (エリア) ───────────────────────────────────────────────────────────
export interface AreaFields {
  name: string;                    // "Williamsburg"
  slug: string;                    // "williamsburg"
  bigArea: 'manhattan' | 'brooklyn' | 'queens';
  description?: Document;          // Rich text
  heroImage?: ContentfulImage;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Area {
  sys: { id: string };
  fields: AreaFields;
}

// ── Service/Style (サービス・スタイル) ─────────────────────────────────────
export interface ServiceFields {
  name: string;                    // "Japanese Gel Nails"
  slug: string;                    // "japanese-gel-nails"
  shortDescription: string;
  description?: Document;          // Rich text
  heroImage?: ContentfulImage;
  tags: string[];                  // このサービスに対応するサロンのタグ
  seoTitle?: string;
  seoDescription?: string;
}

export interface Service {
  sys: { id: string };
  fields: ServiceFields;
}

// ── Blog Post (ブログ) ──────────────────────────────────────────────────────
export interface BlogPostFields {
  title: string;
  slug: string;                    // "best-japanese-nail-salons-nyc"
  excerpt: string;                 // 一覧表示用の要約
  body: Document;                  // Rich text 本文
  coverImage?: ContentfulImage;
  publishedAt: string;             // ISO date string
  tags: string[];
  relatedSalons?: { sys: { id: string } }[];  // 関連サロンの参照
  seoTitle?: string;
  seoDescription?: string;
}

export interface BlogPost {
  sys: { id: string; updatedAt: string };
  fields: BlogPostFields;
}

// ── User Photo (ユーザー投稿写真) ───────────────────────────────────────────
export interface UserPhotoFields {
  salonName: string;
  photoUrl: string;
  caption?: string;
  approved: boolean;
  submittedAt: string;
  igHandle?: string;
}

export interface UserPhoto {
  sys: { id: string };
  fields: UserPhotoFields;
}

// ── Filter State ────────────────────────────────────────────────────────────
export interface FilterState {
  service: 'all' | 'nails' | 'lashes';
  areaBig: 'all' | 'manhattan' | 'brooklyn' | 'queens';
  areaSub: string;
  price: 'all' | '0-80' | '81-150' | '151-9999';
}
