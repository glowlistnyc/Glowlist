import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllBlogPosts } from '@/lib/contentful';

export const metadata: Metadata = {
  title: 'Blog — Glowlist NYC',
  description: 'Guides, recommendations, and stories about Asian-inspired beauty in New York City.',
};

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts();
  return (
    <section style={{ padding: '5rem 5vw' }}>
      <span className="sec-label">Blog</span>
      <h1 className="sec-title">Guides & Recommendations</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5px', background: 'var(--border)', marginTop: '2.5rem' }}>
        {posts.map((post) => (
          <Link key={post.sys.id} href={`/blog/${post.fields.slug}`}
            style={{ background: 'var(--navy)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '.8rem', transition: 'background .2s' }}>
            {post.fields.coverImage && (
              <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden', marginBottom: '.4rem' }}>
                <Image src={`https:${post.fields.coverImage.fields.file.url}`} alt={post.fields.title} fill style={{ objectFit: 'cover', filter: 'brightness(.8)' }} />
              </div>
            )}
            <p style={{ fontSize: '.68rem', letterSpacing: '.1em', color: 'var(--beige-d)', textTransform: 'uppercase' }}>
              {new Date(post.fields.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--beige)', fontWeight: 400, lineHeight: 1.3 }}>{post.fields.title}</h2>
            <p style={{ fontSize: '.82rem', color: 'var(--beige-s)', lineHeight: 1.7, fontWeight: 300 }}>{post.fields.excerpt}</p>
            <span style={{ fontSize: '.72rem', color: 'var(--beige-s)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 'auto' }}>Read →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
