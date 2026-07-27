'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  getApprovedReviews,
  type PublicReview,
} from '@/lib/supabaseReviews';
import styles from './SalonReviews.module.css';

interface Props {
  salonId: string;
  salonName: string;
}

type RatingKey =
  | 'overall_rating'
  | 'atmosphere_rating'
  | 'service_rating'
  | 'quality_rating'
  | 'value_rating';

function average(reviews: PublicReview[], key: RatingKey): number | null {
  const values = reviews
    .map((review) => review[key])
    .filter((value): value is number => typeof value === 'number');

  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatScore(value: number | null, digits = 1): string {
  return value === null ? '—' : value.toFixed(digits);
}

function renderStars(rating: number): string {
  const rounded = Math.max(0, Math.min(5, Math.round(rating)));
  return `${'★'.repeat(rounded)}${'☆'.repeat(5 - rounded)}`;
}

function formatVisitMonth(value: string | null): string | null {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function buildReviewUrl(salonId: string, salonName: string): string {
  const url = new URL('https://tally.so/r/MeQr8l');
  url.searchParams.set('salon_id', salonId);
  url.searchParams.set('salon_name', salonName);
  url.searchParams.set('source', 'glowlist-salon-page');
  return url.toString();
}

export default function SalonReviews({ salonId, salonName }: Props) {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reviewUrl = useMemo(
    () => buildReviewUrl(salonId, salonName),
    [salonId, salonName],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadReviews() {
      setLoading(true);
      setError(null);

      try {
        const result = await getApprovedReviews(salonId, controller.signal);
        setReviews(result);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        console.error(loadError);
        setError('Reviews could not be loaded right now.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadReviews();
    return () => controller.abort();
  }, [salonId]);

  const stats = useMemo(() => {
    const returnAnswers = reviews.filter(
      (review) => review.return_intent !== null,
    );
    const returnYes = returnAnswers.filter(
      (review) => review.return_intent === 'yes',
    ).length;

    return {
      overall: average(reviews, 'overall_rating'),
      atmosphere: average(reviews, 'atmosphere_rating'),
      service: average(reviews, 'service_rating'),
      quality: average(reviews, 'quality_rating'),
      value: average(reviews, 'value_rating'),
      returnPercent:
        returnAnswers.length === 0
          ? null
          : Math.round((returnYes / returnAnswers.length) * 100),
    };
  }, [reviews]);

  return (
    <section className={styles.wrap} id="reviews">
      <div className={styles.headingRow}>
        <div>
          <p className={styles.eyebrow}>Community Reviews</p>
          <h2 className={styles.title}>What clients are saying</h2>
        </div>
        <a
          href={reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.writeButton}
        >
          Write a review →
        </a>
      </div>

      {loading && <p className={styles.message}>Loading reviews…</p>}

      {!loading && error && (
        <p className={styles.message} role="status">
          {error}
        </p>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className={styles.empty}>
          <p>No approved reviews yet.</p>
          <p>Be the first to share your experience at {salonName}.</p>
        </div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <>
          <div className={styles.summary}>
            <div className={styles.mainScore}>
              <strong>{formatScore(stats.overall, 2)}</strong>
              <span className={styles.stars} aria-label={`${formatScore(stats.overall)} out of 5`}>
                {renderStars(stats.overall ?? 0)}
              </span>
              <p>
                Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </p>
            </div>

            <dl className={styles.breakdown}>
              <div><dt>Atmosphere</dt><dd>{formatScore(stats.atmosphere)}</dd></div>
              <div><dt>Service &amp; Hospitality</dt><dd>{formatScore(stats.service)}</dd></div>
              <div><dt>Technique &amp; Results</dt><dd>{formatScore(stats.quality)}</dd></div>
              <div><dt>Menu &amp; Value</dt><dd>{formatScore(stats.value)}</dd></div>
              <div>
                <dt>Would book again</dt>
                <dd>{stats.returnPercent === null ? '—' : `${stats.returnPercent}%`}</dd>
              </div>
            </dl>
          </div>

          <div className={styles.list}>
            {reviews.slice(0, 10).map((review) => {
              const visitMonth = formatVisitMonth(review.visit_month);
              const meta = [
                review.service_type,
                visitMonth ? `Visited ${visitMonth}` : null,
                review.first_visit === true ? 'First visit' : null,
                review.reviewer_name ? `By ${review.reviewer_name}` : null,
              ].filter(Boolean);

              return (
                <article key={review.id} className={styles.review}>
                  <div className={styles.reviewStars}>
                    {renderStars(review.overall_rating)}
                  </div>
                  {review.review_title && <h3>{review.review_title}</h3>}
                  <p className={styles.meta}>{meta.join(' · ')}</p>
                  <p className={styles.reviewText}>{review.review_text}</p>

                  {review.return_intent && (
                    <p className={styles.intent}>
                      Would book again:{' '}
                      {review.return_intent === 'yes'
                        ? 'Yes'
                        : review.return_intent === 'maybe'
                          ? 'Maybe'
                          : 'No'}
                    </p>
                  )}

                  {review.relationship_disclosure === 'free_or_discounted' && (
                    <p className={styles.disclosure}>
                      Free or discounted service disclosed by the reviewer.
                    </p>
                  )}
                  {review.relationship_disclosure === 'salon_connection' && (
                    <p className={styles.disclosure}>
                      A connection to the salon was disclosed by the reviewer.
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
