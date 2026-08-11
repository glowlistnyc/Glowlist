import styles from './RatingStars.module.css';

interface Props {
  googleRating?: number;
  googleReviewCount?: number;
  yelpRating?: number;
  yelpReviewCount?: number;
  size?: 'sm' | 'md';
  showSources?: boolean;
}

// Google + Yelp の重み付き平均を計算
export function getCombinedRating(
  googleRating?: number, googleCount?: number,
  yelpRating?: number, yelpCount?: number,
): { rating: number; count: number } | null {
  const gR = googleRating || 0;
  const gC = googleCount || 0;
  const yR = yelpRating || 0;
  const yC = yelpCount || 0;
  const totalCount = gC + yC;
  if (totalCount === 0) return null;
  const weighted = (gR * gC + yR * yC) / totalCount;
  return { rating: Math.round(weighted * 10) / 10, count: totalCount };
}

// ★ を数値から生成（小数点第1位まで）
function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.3;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(full)}
      {half ? '⯨' : ''}
      {'☆'.repeat(Math.max(0, empty))}
    </span>
  );
}

export default function RatingStars({
  googleRating, googleReviewCount,
  yelpRating, yelpReviewCount,
  size = 'sm', showSources = false,
}: Props) {
  const combined = getCombinedRating(googleRating, googleReviewCount, yelpRating, yelpReviewCount);
  if (!combined) return null;

  return (
    <span className={`${styles.wrap} ${size === 'md' ? styles.md : styles.sm}`}>
      <span className={styles.stars}><Stars rating={combined.rating} /></span>
      <span className={styles.score}>{combined.rating}</span>
      {combined.count > 0 && (
        <span className={styles.count}>({combined.count.toLocaleString()})</span>
      )}
      {showSources && (
        <span className={styles.source}>
          {googleRating && yelpRating ? 'Google & Yelp' : googleRating ? 'Google' : 'Yelp'}
        </span>
      )}
    </span>
  );
}
