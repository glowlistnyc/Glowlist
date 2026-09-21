// YelpReviews — サーバーコンポーネント
// Yelp ToS: 最大3件, 最大160文字/件, Yelp帰属リンク必須
import type { YelpData } from '@/lib/yelp';
import styles from './YelpReviews.module.css';

function Stars({ n }: { n: number }) {
  const f = Math.min(Math.round(n), 5);
  return (
    <span className={styles.stars} aria-label={`${n} stars`}>
      {'★'.repeat(f)}{'☆'.repeat(5 - f)}
    </span>
  );
}

export default function YelpReviews({ data }: { data: YelpData }) {
  if (!data.reviews.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Yelp Reviews</h2>
        <div className={styles.summary}>
          <Stars n={data.rating} />
          <span className={styles.score}>{data.rating}</span>
          <span className={styles.count}>({data.reviewCount.toLocaleString()})</span>
        </div>
      </div>

      <div className={styles.list}>
        {data.reviews.map((r) => (
          <div key={r.id} className={styles.card}>
            <div className={styles.top}>
              <span className={styles.reviewer}>{r.user.name}</span>
              <span className={styles.date}>
                {new Date(r.time_created).toLocaleDateString('en-US', { year:'numeric', month:'short' })}
              </span>
            </div>
            <Stars n={r.rating} />
            <p className={styles.text}>{r.text}</p>
          </div>
        ))}
      </div>

      {/* Yelp attribution — ToS required */}
      <a href={data.businessUrl} target="_blank" rel="noopener noreferrer" className={styles.yelpLink}>
        View full reviews on Yelp ↗
      </a>
      <p className={styles.attribution}>
        Reviews from <a href="https://www.yelp.com" target="_blank" rel="noopener">Yelp</a>.
        Showing up to 3 of {data.reviewCount} reviews.
      </p>
    </section>
  );
}
