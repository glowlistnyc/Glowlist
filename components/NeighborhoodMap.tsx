'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { Salon } from '@/types';
import styles from './NeighborhoodMap.module.css';

interface Props { salons: Salon[] }

// ── 簡略化したNYCエリア座標（実際の地理ではなく、デザイン用の概略マップ）──
const AREA_POSITIONS: Record<string, { x: number; y: number; label: string }> = {
  'upper-west-side':  { x: 120, y: 95,  label: 'Upper West Side' },
  'upper-east-side':  { x: 215, y: 95,  label: 'Upper East Side' },
  'midtown':          { x: 168, y: 175, label: 'Midtown' },
  'midtown-east':     { x: 205, y: 190, label: 'Midtown East' },
  'k-town':           { x: 178, y: 210, label: 'K-Town' },
  'nomad':             { x: 180, y: 235, label: 'NoMad' },
  'chelsea':          { x: 140, y: 245, label: 'Chelsea / Flatiron' },
  'union-square':     { x: 175, y: 258, label: 'Union Square' },
  'east-village':     { x: 195, y: 280, label: 'East Village' },
  'soho':             { x: 145, y: 295, label: 'SoHo / West Village' },
  'lower-east-side':  { x: 190, y: 305, label: 'Lower East Side' },
  'tribeca':          { x: 135, y: 330, label: 'Tribeca' },
  'lower-manhattan':  { x: 145, y: 365, label: 'Lower Manhattan' },
  'williamsburg':     { x: 270, y: 290, label: 'Williamsburg' },
  'brooklyn':         { x: 280, y: 380, label: 'Brooklyn' },
  'long-island-city': { x: 295, y: 230, label: 'Long Island City' },
};

export default function NeighborhoodMap({ salons }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  // エリアごとのサロン数を集計
  const counts = salons.reduce<Record<string, number>>((acc, s) => {
    const slug = s.fields.areaSlug;
    acc[slug] = (acc[slug] || 0) + 1;
    return acc;
  }, {});

  const activeAreas = Object.keys(AREA_POSITIONS).filter((slug) => counts[slug] > 0);

  return (
    <div className={styles.wrap}>
      <div className={styles.mapBox}>
        <svg viewBox="0 0 360 420" className={styles.svg} role="img" aria-label="Map of Glowlist NYC salon areas">
          {/* ── Manhattan（簡略形）── */}
          <path
            d="M150,40 C170,38 190,45 200,60 C215,85 220,130 210,170
               C218,200 222,230 215,260 C210,290 195,310 180,330
               C165,350 150,375 140,400 C135,408 125,406 122,398
               C115,370 110,340 108,310 C105,270 103,230 105,190
               C107,150 112,110 122,75 C128,55 138,42 150,40 Z"
            className={styles.borough}
          />
          {/* ── Brooklyn（簡略形）── */}
          <path
            d="M230,260 C250,255 275,260 295,275 C315,290 320,320 310,350
               C300,380 275,400 250,405 C235,407 222,398 218,382
               C212,355 215,325 218,300 C220,285 222,270 230,260 Z"
            className={styles.borough}
          />
          {/* ── Queens（簡略形）── */}
          <path
            d="M250,180 C270,175 295,180 310,195 C322,208 320,225 305,232
               C288,240 268,235 252,225 C242,218 240,198 250,180 Z"
            className={styles.borough}
          />

          <text x="155" y="180" className={styles.boroughLabel}>MANHATTAN</text>
          <text x="248" y="335" className={styles.boroughLabel}>BROOKLYN</text>
          <text x="263" y="210" className={styles.boroughLabelSmall}>QUEENS</text>

          {/* ── Area dots ── */}
          {activeAreas.map((slug) => {
            const pos = AREA_POSITIONS[slug];
            const count = counts[slug];
            const isHovered = hovered === slug;
            const radius = Math.min(6 + count * 1.2, 14);
            return (
              <g
                key={slug}
                onMouseEnter={() => setHovered(slug)}
                onMouseLeave={() => setHovered(null)}
                className={styles.dotGroup}
              >
                <Link href={`/area/${slug}`}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radius}
                    className={`${styles.dot} ${isHovered ? styles.dotHover : ''}`}
                  />
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radius}
                    className={styles.dotPulse}
                  />
                </Link>
              </g>
            );
          })}

          {/* ── Tooltip (hover時のみ表示) ── */}
          {hovered && AREA_POSITIONS[hovered] && (
            <g>
              <rect
                x={AREA_POSITIONS[hovered].x - 55}
                y={AREA_POSITIONS[hovered].y - 38}
                width="110"
                height="26"
                rx="2"
                className={styles.tooltipBg}
              />
              <text
                x={AREA_POSITIONS[hovered].x}
                y={AREA_POSITIONS[hovered].y - 21}
                className={styles.tooltipText}
                textAnchor="middle"
              >
                {AREA_POSITIONS[hovered].label} ({counts[hovered]})
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* ── Legend / area list ── */}
      <div className={styles.legend}>
        <p className={styles.legendTitle}>Areas with spots</p>
        <div className={styles.legendList}>
          {activeAreas
            .sort((a, b) => counts[b] - counts[a])
            .map((slug) => (
              <Link
                key={slug}
                href={`/area/${slug}`}
                className={styles.legendItem}
                onMouseEnter={() => setHovered(slug)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className={styles.legendDot} />
                <span className={styles.legendLabel}>{AREA_POSITIONS[slug]?.label ?? slug}</span>
                <span className={styles.legendCount}>{counts[slug]}</span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
