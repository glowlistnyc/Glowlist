import type { Review } from '@/lib/supabase';
import styles from './ReviewSection.module.css';

interface Props {
  reviews: Review[];
}

// ★ 表示
function StarRow({ rating }: { rating: number }) {
  const full = Math.min(Math.round(rating), 5);
  return (
    <span className={styles.stars} aria-label={`${rating} out of 5`}>
      {'★'.repeat(full)}
      {'☆'.repeat(Math.max(0, 5 - full))}
    </span>
  );
}

// 詳細評価 — NULL のときは何も表示しない
function DetailRating({ label, value }: { label: string; value?: number | null }) {
  if (value == null) return null;
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailStars}>
        {'★'.repeat(Math.min(Math.round(value), 5))}
        {'☆'.repeat(Math.max(0, 5 - Math.round(value)))}
      </span>
    </div>
  );
}

export default function ReviewSection({ reviews }: Props) {
  const count = reviews.length;

  return (
    <section className={styles.wrap}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Community Reviews
          {count > 0 && <span className={styles.count}>{count}</span>}
        </h2>
        <a
          href="https://tally.so/r/MeQr8l"
          target="_blank"
          rel="noopener"
          className={styles.writeBtn}
        >
          Write a Review →
        </a>
      </div>

      {count === 0 ? (
        <p className={styles.empty}>
          No reviews yet. Be the first to share your experience.
        </p>
      ) : (
        <div className={styles.list}>
          {reviews.map((r) => {
            const hasDetail =
              r.rating_price_value != null ||
              r.rating_atmosphere != null ||
              r.rating_skill != null ||
              r.rating_reproducibility != null;

            return (
              <div key={r.id} className={styles.card}>
                {/* 投稿者 + 日付 */}
                <div className={styles.cardTop}>
                  <span className={styles.reviewerName}>
                    {r.reviewer_name?.trim() || 'Anonymous'}
                  </span>
                  <span className={styles.date}>
                    {new Date(r.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>

                {/* 総合評価 ★★★★★ */}
                {r.rating_overall != null && (
                  <StarRow rating={r.rating_overall} />
                )}

                {/* レビュー本文 */}
                {r.body?.trim() && (
                  <p className={styles.body}>{r.body.trim()}</p>
                )}

                {/* 詳細評価（NULLの項目は非表示） */}
                {hasDetail && (
                  <div className={styles.details}>
                    <DetailRating label="Price & Value"         value={r.rating_price_value} />
                    <DetailRating label="Atmosphere"            value={r.rating_atmosphere} />
                    <DetailRating label="Skill"                 value={r.rating_skill} />
                    <DetailRating label="Design Reproducibility" value={r.rating_reproducibility} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
