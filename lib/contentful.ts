import { createClient } from 'contentful';
import type { Salon, Area, Service, BlogPost } from '@/types';

// ── Client ──────────────────────────────────────────────────────────────────
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

// ── Salons ──────────────────────────────────────────────────────────────────
export async function getAllSalons(): Promise<Salon[]> {
  const res = await client.getEntries<any>({
    content_type: 'salon',
    order: ['fields.name'],
    limit: 200,
  });
  return res.items as unknown as Salon[];
}

export async function getSalonBySlug(slug: string): Promise<Salon | null> {
  const res = await client.getEntries<any>({
    content_type: 'salon',
    'fields.slug': slug,
    limit: 1,
  });
  return (res.items[0] as unknown as Salon) ?? null;
}

export async function getSalonsByArea(areaSlug: string): Promise<Salon[]> {
  const res = await client.getEntries<any>({
    content_type: 'salon',
    'fields.areaSlug': areaSlug,
    order: ['fields.name'],
    limit: 100,
  });
  return res.items as unknown as Salon[];
}

export async function getSalonsByService(serviceTag: string): Promise<Salon[]> {
  // tagsフィールドに該当タグを持つサロンを取得
  const res = await client.getEntries<any>({
    content_type: 'salon',
    'fields.tags[in]': serviceTag,
    order: ['fields.name'],
    limit: 100,
  });
  return res.items as unknown as Salon[];
}

export async function getFeaturedSalons(): Promise<Salon[]> {
  const res = await client.getEntries<any>({
    content_type: 'salon',
    'fields.featured': true,
    limit: 20,
  });
  return res.items as unknown as Salon[];
}

// ── Areas ───────────────────────────────────────────────────────────────────
export async function getAllAreas(): Promise<Area[]> {
  const res = await client.getEntries<any>({
    content_type: 'area',
    order: ['fields.name'],
    limit: 50,
  });
  return res.items as unknown as Area[];
}

export async function getAreaBySlug(slug: string): Promise<Area | null> {
  const res = await client.getEntries<any>({
    content_type: 'area',
    'fields.slug': slug,
    limit: 1,
  });
  return (res.items[0] as unknown as Area) ?? null;
}

// ── Services ─────────────────────────────────────────────────────────────────
export async function getAllServices(): Promise<Service[]> {
  const res = await client.getEntries<any>({
    content_type: 'service',
    order: ['fields.name'],
    limit: 50,
  });
  return res.items as unknown as Service[];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const res = await client.getEntries<any>({
    content_type: 'service',
    'fields.slug': slug,
    limit: 1,
  });
  return (res.items[0] as unknown as Service) ?? null;
}

// ── Blog ────────────────────────────────────────────────────────────────────
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const res = await client.getEntries<any>({
    content_type: 'blogPost',
    order: ['-fields.publishedAt'],
    limit: 100,
  });
  return res.items as unknown as BlogPost[];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const res = await client.getEntries<any>({
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1,
  });
  return (res.items[0] as unknown as BlogPost) ?? null;
}

export async function getRecentBlogPosts(limit = 3): Promise<BlogPost[]> {
  const res = await client.getEntries<any>({
    content_type: 'blogPost',
    order: ['-fields.publishedAt'],
    limit,
  });
  return res.items as unknown as BlogPost[];
}

// ── Sitemap helpers ──────────────────────────────────────────────────────────
export async function getAllSlugs() {
  const [salons, areas, services, posts] = await Promise.all([
    getAllSalons(),
    getAllAreas(),
    getAllServices(),
    getAllBlogPosts(),
  ]);
  return {
    salons: salons.map((s) => s.fields.slug),
    areas: areas.map((a) => a.fields.slug),
    services: services.map((s) => s.fields.slug),
    posts: posts.map((p) => p.fields.slug),
  };
}
