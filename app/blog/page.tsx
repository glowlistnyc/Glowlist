import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllBlogPosts } from '@/lib/contentful';
import T from '@/components/T';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blog — Glowlist NYC',
  description: 'Guides, recommendations, and stories about Asian-inspired beauty in New York City.',
};

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts();
  return (
    <section style={{ padding: '5rem 5vw' }}>
      <span className="sec-label"><T k="blog.label" /></span>
      <h1 className="sec-title"><T k="blog.title" /></h1>
      {posts.length === 0 ? (
        <p style={{ color: 'var(--beige-s)', marginTop: '2rem' }}><T k="blog.noPostsYet" /></p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginTop: '2.5rem' }}>
          {posts.map((post) => (
            <Link key={post.sys.id} href={`/blog/${post.fields.slug}`}
              style={{ background: 'var(--navy)', display: 'flex', flexDirection: 'column', gap: '.8rem', transition: 'background .2s', textDecoration: 'none' }}>
              {post.fields.coverImage && (
                <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden' }}>
                  <Image src={`https:${post.fields.coverImage.fields.file.url}`} alt={post.fields.title} fill style={{ objectFit: 'cover', filter: 'brightness(.8)' }} />
                </div>
              )}
              <div style={{ padding: '.2rem 1.6rem 1.8rem' }}>
                <p style={{ fontSize: '.68rem', letterSpacing: '.1em', color: 'var(--beige-d)', textTransform: 'uppercase', marginBottom: '.5rem' }}>
                  {new Date(post.fields.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--beige)', fontWeight: 400, lineHeight: 1.3, marginBottom: '.5rem' }}>
                  {post.fields.title}
                </h3>
                <p style={{ fontSize: '.82rem', color: 'var(--beige-s)', lineHeight: 1.7, fontWeight: 300 }}>
                  {post.fields.excerpt}
                </p>
                <span style={{ display: 'block', marginTop: '.8rem', fontSize: '.7rem', letterSpacing: '.1em', color: 'var(--beige-s)', textTransform: 'uppercase' }}>
                  <T k="blog.readMore" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
