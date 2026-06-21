import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { getAllBlogPosts, getBlogPostBySlug, getAllSalons } from '@/lib/contentful';
import SalonCard from '@/components/SalonCard';
import styles from './page.module.css';

export const revalidate = 60;


interface Props { params: { slug: string } }

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((p) => ({ slug: p.fields.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};
  const title = post.fields.seoTitle ?? post.fields.title;
  const description = post.fields.seoDescription ?? post.fields.excerpt;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.fields.publishedAt,
      ...(post.fields.coverImage
        ? { images: [{ url: `https:${post.fields.coverImage.fields.file.url}`, width: 1200, height: 630 }] }
        : {}),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const { title, body, publishedAt, coverImage, tags, excerpt } = post.fields;

  // Related salons
  let relatedSalons: Awaited<ReturnType<typeof getAllSalons>> = [];
  if (post.fields.relatedSalons?.length) {
    const allSalons = await getAllSalons();
    const ids = new Set(post.fields.relatedSalons.map((r) => r.sys.id));
    relatedSalons = allSalons.filter((s) => ids.has(s.sys.id));
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt,
    datePublished: publishedAt,
    publisher: { '@type': 'Organization', name: 'Glowlist NYC', url: 'https://glowlistnyc.com' },
    ...(coverImage ? { image: `https:${coverImage.fields.file.url}` } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <article>
        {coverImage && (
          <div className={styles.cover}>
            <Image
              src={`https:${coverImage.fields.file.url}`}
              alt={title}
              fill
              style={{ objectFit: 'cover', filter: 'brightness(.75) contrast(1.05)' }}
              priority
            />
          </div>
        )}

        <div className={styles.content}>
          <nav className={styles.breadcrumb}>
            <Link href="/">Home</Link> / <Link href="/blog">Blog</Link> / <span>{title}</span>
          </nav>

          <p className={styles.date}>
            {new Date(publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <h1 className={styles.h1}>{title}</h1>
          <p className={styles.excerpt}>{excerpt}</p>

          <div className={styles.tags}>
            {tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>

          <div className={styles.body}>
            {documentToReactComponents(body)}
          </div>

          {relatedSalons.length > 0 && (
            <div className={styles.relatedSalons}>
              <h2>Salons mentioned in this guide</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.5px', background: 'var(--border)' }}>
                {relatedSalons.map((s) => <SalonCard key={s.sys.id} salon={s} />)}
              </div>
            </div>
          )}

          <div style={{ marginTop: '3rem' }}>
            <Link href="/blog" className="btn btn-ghost">← All posts</Link>
          </div>
        </div>
      </article>
    </>
  );
}
