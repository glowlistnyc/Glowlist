'use client';
import { useState } from 'react';
import type { Salon } from '@/types';
import styles from './SalonCard.module.css';

interface Props { salon: Salon }
type Tab = 'info' | 'prices' | 'photos';

export default function SalonCard({ salon }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('info');

  const {
    name, category, area, tags,
    instagramHandle, bookingUrl, websiteUrl, address,
    priceRange, language, verified,
    notes, priceDetails, photos,
  } = salon.fields;

  const igUrl = `https://www.instagram.com/${instagramHandle}/`;
  const mapQuery = address
    ? encodeURIComponent(address)
    : encodeURIComponent(`${name} ${area} New York`);
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <>
      {/* ── Card ── */}
      <article
        className={styles.card}
        onClick={() => { setOpen(true); setTab('info'); }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}
      >
        <span className={styles.name}>
          {name}
          {verified && <span className={styles.badge}>Verified</span>}
        </span>
        <span className={styles.meta}>
          {area} · {cap(category)}
          {language && ` · ${language}`}
        </span>
        <span className={styles.tags}>
          {tags.slice(0, 3).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </span>
        {priceRange && <span className={styles.price}>{priceRange}</span>}
        <span className={styles.links}>
          <a
            href={igUrl}
            target="_blank"
            rel="noopener"
            onClick={(e) => e.stopPropagation()}
            className={styles.link}
          >
            Instagram ↗
          </a>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener"
            onClick={(e) => e.stopPropagation()}
            className={styles.link}
          >
            Book ↗
          </a>
        </span>
        <span className={styles.hint}>Tap for details →</span>
      </article>

      {/* ── Modal ── */}
      {open && (
        <div
          className={styles.overlay}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={name}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.modalName}>
                  {name}
                  {verified && <span className={styles.badge}>Verified</span>}
                </p>
                <p className={styles.modalMeta}>
                  {area} · {cap(category)}
                  {language && ` · ${language}`}
                  {priceRange && ` · ${priceRange}`}
                </p>
              </div>
              <button className={styles.close} onClick={() => setOpen(false)} aria-label="Close">✕</button>
            </div>

            {/* CTA buttons — 全て同じサイズ */}
            <div className={styles.modalCta}>
              <a href={bookingUrl} target="_blank" rel="noopener" className={styles.ctaBtn}>
                Book Now →
              </a>
              <a href={igUrl} target="_blank" rel="noopener" className={`${styles.ctaBtn} ${styles.ctaGhost}`}>
                Instagram ↗
              </a>
              {websiteUrl && (
                <a href={websiteUrl} target="_blank" rel="noopener" className={`${styles.ctaBtn} ${styles.ctaGhost}`}>
                  Website ↗
                </a>
              )}
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              {(['info', 'prices', 'photos'] as Tab[]).map((t) => (
                <button
                  key={t}
                  className={`${styles.tabBtn} ${tab === t ? styles.tabActive : ''}`}
                  onClick={() => setTab(t)}
                >
                  {t === 'info' ? 'Basic Info' : cap(t)}
                </button>
              ))}
            </div>

            {/* ── Tab: Basic Info ── */}
            {tab === 'info' && (
              <div className={styles.pane}>
                <table className={styles.infoTable}>
                  <tbody>
                    <tr>
                      <td className={styles.infoLabel}>Category</td>
                      <td className={styles.infoVal}>{cap(category)}</td>
                    </tr>
                    <tr>
                      <td className={styles.infoLabel}>Area</td>
                      <td className={styles.infoVal}>{area}</td>
                    </tr>
                    {address && (
                      <tr>
                        <td className={styles.infoLabel}>Address</td>
                        <td className={styles.infoVal}>
                          <a href={mapUrl} target="_blank" rel="noopener" className={styles.infoLink}>
                            {address} ↗
                          </a>
                        </td>
                      </tr>
                    )}
                    {language && (
                      <tr>
                        <td className={styles.infoLabel}>Language</td>
                        <td className={styles.infoVal}>{language}</td>
                      </tr>
                    )}
                    {priceRange && (
                      <tr>
                        <td className={styles.infoLabel}>Price</td>
                        <td className={styles.infoVal}>{priceRange}</td>
                      </tr>
                    )}
                    {websiteUrl && (
                      <tr>
                        <td className={styles.infoLabel}>Website</td>
                        <td className={styles.infoVal}>
                          <a href={websiteUrl} target="_blank" rel="noopener" className={styles.infoLink}>
                            {websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
                          </a>
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className={styles.infoLabel}>Instagram</td>
                      <td className={styles.infoVal}>
                        <a href={igUrl} target="_blank" rel="noopener" className={styles.infoLink}>
                          @{instagramHandle} ↗
                        </a>
                      </td>
                    </tr>
                    {notes && (
                      <tr>
                        <td className={styles.infoLabel}>Notes</td>
                        <td className={styles.infoVal}>{notes}</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {tags.length > 0 && (
                  <div className={styles.tagRow}>
                    {tags.map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                )}

                {address && (
                  <a href={mapUrl} target="_blank" rel="noopener" className={styles.mapLink}>
                    Open in Google Maps ↗
                  </a>
                )}
              </div>
            )}

            {/* ── Tab: Prices ── */}
            {tab === 'prices' && (
              <div className={styles.pane}>
                {priceDetails && priceDetails.length > 0 ? (
                  priceDetails.map((cat) => (
                    <div key={cat.category} className={styles.priceCat}>
                      <p className={styles.priceCatTitle}>{cat.category}</p>
                      {cat.items.map((item) => (
                        <div key={item.service} className={styles.priceRow}>
                          <span className={styles.priceSvc}>{item.service}</span>
                          <span className={styles.priceAmt}>{item.price}</span>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <p className={styles.noPrice}>
                    Pricing not listed.{' '}
                    <a href={websiteUrl ?? bookingUrl} target="_blank" rel="noopener">
                      Check their site
                    </a>{' '}
                    for current prices.
                  </p>
                )}
                {notes && <p className={styles.notes}>{notes}</p>}
                <p className={styles.disclaimer}>
                  Prices sourced from public menus. May not reflect current rates — confirm before booking.
                </p>
                <a href={bookingUrl} target="_blank" rel="noopener" className={styles.bookBtn}>
                  Book at {name} →
                </a>
              </div>
            )}

            {/* ── Tab: Photos ── */}
            {tab === 'photos' && (
              <div className={styles.pane}>
                {photos && photos.length > 0 ? (
                  <div className={styles.photoGrid}>
                    {photos.map((photo, i) => (
                      <div key={i} className={styles.photoWrap}>
                        <img
                          src={`https:${photo.fields.file.url}?w=400&q=80`}
                          alt={photo.fields.description ?? `${name} photo ${i + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.noPhotos}>
                    <p>No photos yet.</p>
                    <a
                      href="https://forms.gle/DLBDikk6Do6LHSxu6"
                      target="_blank"
                      rel="noopener"
                      className={styles.mapLink}
                    >
                      Submit a photo via Photo Drop ✨
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
