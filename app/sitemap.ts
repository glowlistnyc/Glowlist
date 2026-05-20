import { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/contentful';

const BASE = 'https://glowlistnyc.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { salons, areas, services, posts } = await getAllSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/area`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/service`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  const salonPages = salons.map((slug) => ({
    url: `${BASE}/salon/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const areaPages = areas.map((slug) => ({
    url: `${BASE}/area/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const servicePages = services.map((slug) => ({
    url: `${BASE}/service/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const blogPages = posts.map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...salonPages, ...areaPages, ...servicePages, ...blogPages];
}
